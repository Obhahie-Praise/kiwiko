import TaskBoard from "./TaskBoard";
import ActivityPanel from "../contributions/ActivityPanel";

export default function TasksLayout({
  tasks,
  activity,
}: any) {
  return (
    <div className="grid grid-cols-[1fr_300px] gap-6">
      <TaskBoard tasks={tasks} />
      <ActivityPanel activity={activity} />
    </div>
  );
}
