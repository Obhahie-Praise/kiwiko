import ActivityMetricCard from "@/components/ActivityMetricProps";
import ExecutionsHeatmap from "@/components/ExecutionsHeatmap";
import ProjectInnerNav from "@/components/projects/ProjectInnerNav";
import {
  activityMetrics,
  completeOnboarding,
  metrics,
  recentActivities,
} from "@/constants";
import { getSession } from "@/constants/getSession";
import prisma from "@/lib/prisma";
import { Activity, Check, EllipsisVertical, Users, Eye, GitCommit, CircleDot } from "lucide-react";
import { redirect } from "next/navigation";

import { getProjectHomeDataAction } from "@/actions/project.actions";
import { openai } from "@/lib/openai";
import AnalyticsChart from "@/components/projects/AnalyticsChart";
import { groq } from "@/lib/groqai";

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
      change: "+0%",
      positive: true,
      icon: Eye,
    },
    {
      id: "commits",
      label: "Git Commits / Week",
      value: overviewData?.commitsPerWeek?.toString() || "0",
      change: "+0%",
      positive: true,
      icon: GitCommit,
    },
    {
      id: "issues",
      label: "Open Issues",
      value: project.githubOpenIssues?.toString() || "0",
      change: "0",
      positive: false,
      icon: CircleDot,
    }
  ];

  // If YouTube is connected, add it as a metric
  if (overviewData?.youtubeMetric) {
    displayMetrics.push({
        id: "youtube",
        label: "YouTube Engagement",
        value: overviewData.youtubeMetric.value || "0",
        change: overviewData.youtubeMetric.videoTitle ? `Last: ${overviewData.youtubeMetric.videoTitle.substring(0, 15)}...` : "Live",
        positive: true,
        icon: Activity, // Fallback icon
    });
  } else {
    // Fallback metric if YouTube is not connected
    displayMetrics.push({
        id: "members",
        label: "Team Members",
        value: project.members?.length?.toString() || "1",
        change: "Active",
        positive: true,
        icon: Users,
    });
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 hero-font">
      <ProjectInnerNav />
      <main className="flex-1">
        <div className="grid grid-cols-12 gap-6 p-6 w-full auto-rows-min max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-4 col-span-12">
            {displayMetrics.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col justify-between min-h-[110px] relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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

          <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl col-span-4 p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">Team</h3>
              <button className="text-xs text-zinc-500 hover:text-zinc-900 transition">
                Manage
              </button>
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
                        <p className="text-sm font-medium text-zinc-900">
                          {m.userId === userId ? "You" : (m.user.name || m.user.email)}
                        </p>
                        <p className="text-xs text-zinc-500 capitalize">{m.role.toLowerCase()}</p>
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
                        <p className="text-sm font-medium text-zinc-900">
                          {invite.email.split('@')[0]}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] text-zinc-500 capitalize">{invite.role.toLowerCase()}</p>
                          <span className="px-1 py-0.5 bg-zinc-100 text-[8px] font-bold uppercase rounded">Invited</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty member (future-facing) */}
                <div className="flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400">
                      +
                    </div>
                    <div>
                      <p className="text-sm text-zinc-700">Add teammate</p>
                      <p className="text-xs text-zinc-400">
                        Engineering / Growth
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400">—</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-between text-xs text-zinc-500">
                <span>Team size</span>
                <span className="text-zinc-900 font-medium">{(project.members?.length || 0) + (project.invites?.filter((i: any) => !i.accepted).length || 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl col-span-8 h-fit p-5">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-zinc-300 text-zinc-700 rounded-lg group-hover:bg-black group-hover:text-zinc-100 transition">
                  <Activity width={15} height={15} />
                </div>
                <h3 className="font-semibold text-lg">Recent Activity</h3>
              </div>
              <div className="p-2 rounded-md hover:bg-zinc-200">
                <EllipsisVertical
                  width={15}
                  height={15}
                  className="text-black"
                />
              </div>
            </div>
            <div className="">
              <div className="">
                {recentActivities.map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[2fr_1fr_1fr] px-5 py-3 border-b last:border-b-0 border-zinc-200 hover:bg-zinc-300 transition rounded-2xl mt-4"
                    >
                      {/* Activity */}
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <item.icon className="w-4 h-4 text-zinc-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Source */}
                      <div className="text-sm text-zinc-700 flex items-center">
                        {item.source}
                      </div>

                      {/* Time */}
                      <div className="text-xs text-zinc-500 flex items-center">
                        {item.timestamp}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-span-4 h-fit bg-white border border-zinc-200 shadow-sm rounded-3xl p-5">
            <h4 className="flex items-center justify-between my-2">
              <p className="text-xl font-medium">Onboarding</p>
              <p className="text-3xl font-light">18%</p>
            </h4>
            <div className="w-full flex items-center justify-between font-light">
              <p className="text-zinc-400">Completed</p>
              <p className="text-black">Unfinshed</p>
            </div>
            <div className="flex items-center gap-0.5 h-5 w-full mt-4">
              <div className="bg-linear-to-r to-zinc-600 from-zinc-400 h-12 w-25 rounded-xl flex text-sm items-center px-4 text-black justify-start font-light">
                18%
              </div>
              <div className="bg-linear-to-r from-zinc-600 to-zinc-800 h-12 flex-1  rounded-xl flex text-sm items-center px-4 text-zinc-400 justify-end font-light">
                82%
              </div>
            </div>
            <div className="w-full bg-linear-to-b from-zinc-900 to-zinc-700 rounded-[2.5rem] mt-10 p-5">
              <h3 className="text-neutral-100 flex items-center justify-between mt-3 mb-5">
                <p className="text-xl">Onboarding Task</p>
                <p className="text-3xl font-thin">2/8</p>
              </h3>
              <div className="">
                <ul className="space-y-4">
                  {completeOnboarding.map((item) => {
                    return (
                      <li
                        className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-xl cursor-pointer transition-all"
                        key={item.id}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-15 h-15 flex items-center justify-center rounded-full ${item.isCompleted ? "bg-neutral-600 text-neutral-200" : "bg-zinc-200 text-zinc-600"}`}
                          >
                            <item.icon width={25} height={25} />
                          </div>
                          <div className="">
                            <h5
                              className={`text-lg ${item.isCompleted ? "text-neutral-500 line-through" : "text-neutral-200"}`}
                            >
                              {item.name}
                            </h5>
                            <p className="text-neutral-400 text-xs mr-6">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 flex items-center justify-center rounded-full ${item.isCompleted ? "bg-white text-black" : "bg-neutral-500 text-white"}`}
                        >
                          {item.isCompleted ? (
                            <Check
                              width={15}
                              height={15}
                              className={`${item.isCompleted ? "text-black" : "text-white"}`}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          <ExecutionsHeatmap />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;