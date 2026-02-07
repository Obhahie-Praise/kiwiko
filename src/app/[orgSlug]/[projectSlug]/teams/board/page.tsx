import TeamBoardClient from "@/components/teams/board/TeamBoardClient";
import { teamMembers } from "@/constants";

export default function TeamsBoardPage() {
  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Team Board</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage your founding team and their project roles.</p>
      </div>
      <TeamBoardClient members={teamMembers} />
    </div>
  );
}
