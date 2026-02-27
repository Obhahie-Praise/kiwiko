import { Calendar, Flag, MessageSquare } from "lucide-react";

const formatRelativeTime = (timestamp: number) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const daysDifference = Math.round((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(daysDifference) < 7) {
    return rtf.format(daysDifference, "day");
  } else if (Math.abs(daysDifference) < 30) {
    return rtf.format(Math.round(daysDifference / 7), "week");
  } else {
    return rtf.format(Math.round(daysDifference / 30), "month");
  }
};

export default function TaskCard({ task }: any) {
  const isOverdue = task.due < Date.now();
  
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-sm transition cursor-pointer flex flex-col md:flex-row md:items-center gap-4 group">
      {/* Title & Desc */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-900 leading-tight truncate">
          {task.title}
        </p>
        <p className="text-xs text-zinc-500 mt-1 truncate">
          {task.desc}
        </p>
      </div>

      {/* Meta Area */}
      <div className="flex items-center gap-6 shrink-0 md:justify-end">
        
        {/* Priority */}
        <div className="flex items-center gap-1.5 w-16 text-xs font-medium text-zinc-600">
          <Flag size={12} className={task.priority === "High" ? "text-red-500 fill-red-50" : task.priority === "Medium" ? "text-amber-500 fill-amber-50" : "text-zinc-400"} />
          {task.priority}
        </div>

        {/* Date */}
        <div className={`flex items-center justify-end gap-1.5 w-24 text-xs ${isOverdue ? "text-red-600 font-medium" : "text-zinc-500"}`}>
          <Calendar size={12} />
          {formatRelativeTime(task.due)}
        </div>

        {/* Comments Mock */}
        <div className="flex items-center gap-1 w-8 text-xs text-zinc-400 group-hover:text-zinc-600 transition">
          <MessageSquare size={12} />
          <span>{Math.floor(Math.random() * 5)}</span>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 w-32 justify-end border-l border-zinc-100 pl-4">
          <span className="text-xs text-zinc-600 truncate text-right">
            {task.assignee}
          </span>
          <img
            src={task.avatar}
            className="w-6 h-6 rounded-full shrink-0 object-cover border border-zinc-200 bg-zinc-50"
            alt={task.assignee}
          />
        </div>

      </div>
    </div>
  );
}
