import ContributionsLayout from "@/components/teams/contributions/ContributionsLayout";
import {
  members,
  contributions,
  activityFeed,
} from "@/constants/index";

export default function ContributionsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-zinc-900">Team Contributions</h2>
        <p className="text-sm text-zinc-500 mt-1">Ownership and impact visualization across the startup.</p>
      </div>
      <ContributionsLayout
        members={members}
        contributions={contributions}
        activity={activityFeed}
      />
    </div>
  );
}
