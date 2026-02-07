import { CheckCircle, MessageSquare } from "lucide-react";

export default function ContributionCard({
  member,
  stats,
}: any) {
  if (!stats) return null;

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <img
          src={member.avatar}
          className="w-10 h-10 rounded-full"
        />

        <div>
          <p className="font-medium text-sm">
            {member.name}
          </p>
          <span className="text-xs text-zinc-500">
            {member.role}
          </span>
        </div>
      </div>

      <div className="flex gap-6 text-xs">
        <span className="flex gap-1 items-center">
          <CheckCircle size={14} />
          {stats.tasks}
        </span>

        <span className="flex gap-1 items-center">
          <MessageSquare size={14} />
          {stats.messages}
        </span>

        <span className="font-semibold">
          {stats.score}
        </span>
      </div>
    </div>
  );
}
