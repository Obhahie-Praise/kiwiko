import { Calendar, Flag } from "lucide-react";

export default function TaskCard({ task }: any) {
  return (
    <div className="border rounded-xl p-3 space-y-2 hover:shadow transition">
      <p className="text-sm font-medium">
        {task.title}
      </p>

      <p className="text-xs text-zinc-500">
        {task.desc}
      </p>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <Flag size={12} />
          {task.priority}
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={12} />
          {task.due}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <img
          src={task.avatar}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-xs text-zinc-600">
          {task.assignee}
        </span>
      </div>
    </div>
  );
}
