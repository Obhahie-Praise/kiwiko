"use client";

import ContributionCard from "./ContributionsCard";

export default function Leaderboard({
  members,
  contributions,
}: any) {
  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">
      <h2 className="font-semibold">
        Team Contributions
      </h2>

      {members.map((m: any) => (
        <ContributionCard
          key={m.id}
          member={m}
          stats={
            contributions.find(
              (c: any) => c.memberId === m.id
            )
          }
        />
      ))}
    </div>
  );
}
