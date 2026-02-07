import { Activity } from "lucide-react";

export default function ActivityPanel({
  activity,
}: any) {
  return (
    <div className="bg-white border rounded-2xl p-4 space-y-4">
      <h3 className="text-sm font-semibold flex gap-2 items-center">
        <Activity size={16} />
        Team Activity
      </h3>

      {activity.map((a: any) => (
        <div key={a.id}>
          <p className="text-sm">{a.text}</p>
          <span className="text-xs text-zinc-500">
            {a.time}
          </span>
        </div>
      ))}
    </div>
  );
}
