// components/teams/TeamHeader.tsx
import { Crown, Users } from "lucide-react";

type TeamHeaderProps = {
  team: {
    id: string
    name: string;
    role: string //"Founder" | "Admin" | "Member";
    membersCount: number;
  };
};

export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          {team.name}
          {team.role === "Founder" && (
            <Crown size={16} className="text-yellow-500" />
          )}
        </h1>
        <p className="text-sm text-zinc-500">
          {team.membersCount} members
        </p>
      </div>

      {/* Right-side actions (future) */}
      <div className="flex items-center gap-3">
        <button className="text-sm px-3 py-1.5 rounded-lg border hover:bg-zinc-100">
          Invite
        </button>
      </div>
    </header>
  );
}
