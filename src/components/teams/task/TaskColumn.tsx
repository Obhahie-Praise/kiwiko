import TaskCard from "./TaskCard";

export default function TaskColumn({
  title,
  tasks,
}: any) {
  return (
    <div className="bg-white border rounded-2xl p-4 space-y-3">
      <h3 className="font-semibold text-sm">
        {title}
      </h3>

      {tasks.map((t: any) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </div>
  );
}
