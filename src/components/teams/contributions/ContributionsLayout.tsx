import Leaderboard from "./LeaderBoard";
import WeeklyStats from "./WeeklyStats";
import ActivityFeed from "./ActivityFeed";

export default function ContributionsLayout({
  members,
  contributions,
  activity,
}: any) {
  return (
    <div className="space-y-6">
      <WeeklyStats />
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <Leaderboard
          members={members}
          contributions={contributions}
        />
        <ActivityFeed activity={activity} />
      </div>
    </div>
  );
}
