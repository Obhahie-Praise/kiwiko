// app/teams/layout.tsx
import { ReactNode } from "react";
import TeamHeader from "@/components/teams/board/TeamHeader";
import TeamTabs from "@/components/teams/board/TeamTabs";

export default async function TeamsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const team = {
    id: "team_1",
    name: "Nova AI",
    role: "Founder",
    membersCount: 6,
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TeamHeader team={team} />

      <div className="border-b bg-white">
        <TeamTabs />
      </div>

      {/* CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}