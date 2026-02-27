import TasksLayout from "@/components/teams/task/TaskLayout";
import { mockActivity } from "@/constants/index";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import { notFound } from "next/navigation";

export default async function TeamsTasksPage(
  props: { params: Promise<{ orgSlug: string; projectSlug: string }> }
) {
  const { orgSlug, projectSlug } = await props.params;

  const res = await getProjectHomeDataAction(orgSlug, projectSlug);
  if (!res.success || !res.data) return notFound();

  const activeMembers = res.data.project.members.map((m: any) => ({
      id: m.userId,
      name: m.user.name || m.user.email?.split("@")[0] || "Unknown",
      role: m.role,
      avatar: m.user.image || "https://api.dicebear.com/7.x/notionists/svg?seed=" + m.userId,
  }));

  // Create mock tasks using the real active members
  const statuses = ["Backlog", "In Progress", "Review", "Completed"];
  const dynamicTasks = Array.from({ length: 12 }).map((_, i) => {
      const assignee = activeMembers[i % activeMembers.length] || { name: "Unassigned", avatar: "" };
      const status = statuses[i % statuses.length];
      
      const date = new Date();
      date.setDate(date.getDate() - (i * 2 + 1)); // distribute over past days

      return {
          id: `task-${i}`,
          title: `Implement feature ${i + 1} for ${projectSlug}`,
          desc: `Detailed requirements and subtasks for feature ${i + 1}`,
          status,
          assignee: assignee.name,
          avatar: assignee.avatar,
          priority: ["High", "Medium", "Low"][i % 3],
          due: date.getTime(), // pass raw timestamp for formatting in the client
      }
  });

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-zinc-900">Task Pipeline</h2>
        <p className="text-sm text-zinc-500 mt-1">High-priority execution items for the founding team.</p>
      </div>
      <TasksLayout
        tasks={dynamicTasks}
        activity={mockActivity}
      />
    </div>
  );
}
