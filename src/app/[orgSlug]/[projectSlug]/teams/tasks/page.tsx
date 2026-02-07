import TasksLayout from "@/components/teams/task/TaskLayout";
import {
  mockTasks,
  mockActivity,
} from "@/constants/index";

export default function TeamsTasksPage() {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-zinc-900">Task Pipeline</h2>
        <p className="text-sm text-zinc-500 mt-1">High-priority execution items for the founding team.</p>
      </div>
      <TasksLayout
        tasks={mockTasks}
        activity={mockActivity}
      />
    </div>
  );
}
