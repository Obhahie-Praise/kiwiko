import { Crown } from "lucide-react";
import InviteMember from "../InviteModal";

export default function TeamHeader({ team }: any) {
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

      {/* Client-controlled action */}
      <InviteMember orgId={team.id} />
    </header>
  );
}
