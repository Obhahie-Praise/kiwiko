import { getSession } from "@/constants/getSession";
import { Users, Eye, GitCommit, Check, Calendar } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import AnalyticsChart from "@/components/projects/AnalyticsChart";
import SocialAnalyticsChart from "@/components/projects/SocialAnalyticsChart";
import RecentActivityTable from "@/components/projects/RecentActivityTable";
import KiwikoAdvancedAnalytics from "@/components/projects/KiwikoAdvancedAnalytics";
import ProjectCalendar from "@/components/projects/ProjectCalendar";
import RefreshButton from "@/components/projects/RefreshButton";

const OverviewPage = async ({ params }: { params: { orgSlug: string, projectSlug: string } }) => {
  /* const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: "Hello, how are you?",
      },
    ],
  })
  console.log(response) */
  const { orgSlug, projectSlug } = await params;
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/sign-in");
  }

  const contextRes = await getProjectHomeDataAction(orgSlug, projectSlug);

  if (!contextRes.success) {
     // If project not found or unauthorized, redirect back to projects or show 404
     redirect(`/${orgSlug}/projects`);
  }

  const { project, organization, membership } = contextRes.data;
  const userId = session.user.id;

  const { getOverviewMetrics } = await import("@/lib/data-fetchers");
  const overviewData = await getOverviewMetrics(project.id, userId);

  const displayMetrics = [
    {
      id: "views",
      label: "Profile Views",
      value: overviewData?.viewCount?.toString() || "0",
      change: `${(overviewData?.viewGrowth ?? 0) >= 0 ? "+" : ""}${overviewData?.viewGrowth || 0}%`,
      positive: (overviewData?.viewGrowth ?? 0) >= 0,
      icon: Eye,
    },
    {
      id: "commits",
      label: overviewData?.githubConnected ? "Git Commits / Week" : "Project Status",
      value: overviewData?.githubConnected ? (overviewData?.commitsPerWeek?.toString() || "0") : "Active",
      change: overviewData?.githubConnected ? "+0%" : "Live",
      positive: true,
      icon: overviewData?.githubConnected ? GitCommit : Check,
    },
    {
      id: "social-views",
      label: overviewData?.youtubeConnected ? "Social Views (Month)" : "Upcoming Events",
      value: overviewData?.youtubeConnected 
        ? (overviewData?.youtubeMetric?.value || "0")
        : (overviewData?.upcomingEventsCount?.toString() || "0"),
      change: overviewData?.youtubeConnected ? "+12.5%" : "Next 30 days",
      positive: true,
      icon: overviewData?.youtubeConnected ? Eye : Calendar,
    },
    {
      id: "active-users-7d",
      label: overviewData?.kiwikoConnected ? "Active Users (7d)" : "Active Team Members",
      value: overviewData?.kiwikoConnected 
        ? (overviewData?.kiwiko?.activeUsers7d?.toString() || "0")
        : (overviewData?.kiwiko?.onlineTeamMembers?.toString() || "0"),
      change: overviewData?.kiwikoConnected ? "Last 7 days" : "Online now",
      positive: true,
      icon: Users,
    }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-50 relative">
      <RefreshButton path={`/${params.orgSlug}/${params.projectSlug}/overview`} />
      <div className="flex-1">
        <div className="grid grid-cols-12 gap-6 p-6 w-full auto-rows-min max-w-7xl mx-auto">
          <div className={`grid grid-cols-${displayMetrics.length} gap-4 col-span-12`}>
            {displayMetrics.map((item) => (
              <div
                key={item.id}
                className="bg-white border-[0.1px] border-zinc-200 rounded-2xl p-5 flex flex-col justify-between min-h-[110px] relative overflow-hidden shadow-none hover:shadow-md transition-shadow"
              >
                {/* Top row: label + icon */}
                <div className="flex items-start justify-between">
                  <p className="text-sm text-zinc-600 font-medium tracking-wider hero-font">{item.label}</p>
                  <div className="p-1.5 bg-zinc-100 rounded-lg border border-zinc-100">
                    <item.icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Bottom row: value + change pill */}
                <div className="flex items-end justify-between mt-4">
                  <p className="text-2xl font-bold hero-font text-zinc-900 tracking-tight">{item.value}</p>
                  <div className="flex items-center gap-1.5 text-right">
                    <span className={`text-[10px]  px-2 py-0.5 rounded-full ${
                      (item as any).positive
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-red-50 text-red-600 border border-red-100"
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12">
            <AnalyticsChart projectId={project.id} />
          </div>

          {overviewData?.youtubeConnected && (
            <div className="col-span-12">
              <SocialAnalyticsChart projectId={project.id} />
            </div>
          )}

          <div className="bg-white border-[0.2px] border-zinc-200 rounded-2xl col-span-4 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-zinc-900">Team</h3>
              <Link href={`/${orgSlug}/${projectSlug}/teams`} className="text-sm text-zinc-500 hover:text-zinc-900 transition">
                Manage
              </Link>
            </div>

            <div className="flex-col flex justify-between h-[90%]">
              <div className="space-y-3">
                {/* Render Project Members */}
                {project.members && project.members.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.user.image || "/default-avatar.png"}
                        className="w-9 h-9 rounded-full border border-zinc-300"
                        alt={m.user.name || "User"}
                      />
                      <div>
                        <p className="font-light text-zinc-900">
                          {m.userId === userId ? "You" : (m.user.name || m.user.email)}
                        </p>
                        <p className="text-sm text-zinc-500 capitalize">{m.role.toLowerCase()}</p>
                      </div>
                    </div>
                    {m.userId === userId && <span className="text-xs text-zinc-500">100%</span>}
                  </div>
                ))}

                {/* Render Pending Invites */}
                {project.invites && project.invites.filter((i: any) => !i.accepted).map((invite: any) => (
                  <div key={invite.id} className="flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 capitalize">
                          {invite.email.split('@')[0]}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-light text-zinc-500 capitalize">{invite.role.toLowerCase()}</p>
                          <span className="px-1 py-0.5 bg-zinc-100 text-[10px] font-medium rounded">Invited</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty member (future-facing) */}
                <Link href={`/${orgSlug}/${projectSlug}/teams`} className="flex items-center justify-between opacity-90 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-dashed border-zinc-300 flex items-center justify-center text-zinc-600">
                      +
                    </div>
                    <div>
                      <p className="text-black">Add teammate</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">—</span>
                </Link>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-between text-zinc-500">
                <span>Team size</span>
                <span className="text-zinc-900 font-medium">{(project.members?.length || 0) + (project.invites?.filter((i: any) => !i.accepted).length || 0)}</span>
              </div>
            </div>
          </div>

          <div className="col-span-8">
            <RecentActivityTable />
          </div>

          {overviewData?.kiwikoConnected && overviewData?.kiwiko && (
            <div className="col-span-12">
              <KiwikoAdvancedAnalytics data={overviewData.kiwiko} />
            </div>
          )}

          <div className="col-span-12">
            <ProjectCalendar projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;