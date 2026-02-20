import ActivityMetricCard from "@/components/ActivityMetricProps";
import ExecutionsHeatmap from "@/components/ExecutionsHeatmap";
import HomeNavProfileBtn from "@/components/HomeNavProfileBtn";
import NotificationsMenu from "@/components/NotificationsMenu";
import {
  activityMetrics,
  completeOnboarding,
  metrics,
  recentActivities,
} from "@/constants";
import { getSession } from "@/constants/getSession";
import prisma from "@/lib/prisma";
import { Activity, Bolt, Check, EllipsisVertical, Search } from "lucide-react";
import { redirect } from "next/navigation";

import { getProjectHomeDataAction } from "@/actions/project.actions";

const HomePage = async ({ params }: { params: { orgSlug: string, projectSlug: string } }) => {
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

  const truncateEmail =
    String(session?.user.email).length > 15
      ? String(session?.user.email).slice(0, 15).padEnd(22, " . . . ")
      : String(session?.user.email);

  return (
    <div className="overflow-x-hidden">
      <nav className="flex items-center justify-between px-3 py-0.5">
        <form
          action={""}
          className="py-1.5 px-3 focus:outline-2 focus:outline-zinc-300 rounded-lg flex items-center gap-2"
        >
          <Search width={15} height={15} className="text-zinc-500" />
          <input
            type="text"
            className="focus:outline-none placeholder:text-zinc-500 placeholder:text-sm text-sm text-zinc-700"
            placeholder="Search something..."
          />
        </form>
        <div className="flex items-center gap-4">
          <NotificationsMenu />
          <div className="relative p-1.5 bg-zinc-200 text-zinc-700 rounded-full">
            <Bolt width={15} height={15} className="" />
          </div>
          <div className="h-7 w-px bg-zinc-300" />
          <HomeNavProfileBtn
            session={session}
            truncateEmail={truncateEmail}
            project={project}
            userRole={membership?.role || session.user.role || "Member"}
          />
        </div>
      </nav>
      <main className="border-t-2 border-l-2 border-zinc-300 rounded-tl-2xl min-h-screen relative">
        <div className="grid grid-cols-17 gap-6 p-5 w-full auto-rows-min">
          <div className="grid grid-cols-4 gap-4 col-span-17">
            {metrics.map((item) => (
              <div
                key={item.id}
                className="border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500">{item.label}</p>
                  <item.icon className="w-4 h-4 text-zinc-500" />
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-semibold text-zinc-900">
                    {item.value}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{item.change}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 col-span-17 gap-6">
            {activityMetrics.map((item) => (
              <ActivityMetricCard key={item.id} item={item} />
            ))}
          </div>

          <div className="border border-zinc-200 rounded-2xl col-span-5 p-4 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900">Team</h3>
              <button className="text-xs text-zinc-500 hover:text-zinc-900 transition">
                Manage
              </button>
            </div>

            <div className="flex-col flex justify-between h-[90%]">
              <div className="space-y-3">
                {organization.memberships.map((m: any) => (
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
                <span className="text-zinc-900 font-medium">{organization.memberships.length}</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-zinc-200 rounded-2xl col-span-12 h-fit p-3">
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
          <div className="col-span-5 h-fit border border-zinc-300 rounded-t-2xl rounded-b-[2.5rem] p-3">
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

export default HomePage;