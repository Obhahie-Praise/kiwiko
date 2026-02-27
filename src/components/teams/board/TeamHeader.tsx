import { Crown } from "lucide-react";
import InviteMember from "../InviteModal";

export default function TeamHeader({ team, orgSlug }: { team: any; orgSlug: string }) {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {team.name}
          {team.role === "OWNER" || team.role === "FOUNDER" ? (
            <Crown size={16} className="text-yellow-500" />
          ) : null}
        </h1>
        <p className="font-medium text-zinc-500">
          {team.membersCount} members
        </p>
      </div>

      {/* Client-controlled action passing DB identifiers */}
      <InviteMember projectId={team.id} orgSlug={orgSlug} />
    </header>
  );
}
