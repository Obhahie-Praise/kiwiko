"use client";

import { TeamMember } from "@/constants";
import { Crown } from "lucide-react";

export default function TeamBoardClient({ members }: { members: TeamMember[] }) {
  const founder = members.find(
    (m) => m.role === "Founder"
  );

  const others = members.filter(
    (m) => m.role !== "Founder"
  );

  return (
    <div className="space-y-8 p-6">

      {/* FOUNDER */}
      {founder && (
        <div className="border rounded-2xl p-6 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-4 relative">
            <img
              src={founder.avatar}
              className="w-14 h-14 rounded-full"
            />
            <div className="bg-yellow-50 rounded-full p-1 absolute -top-1 -left-1 ">                      <Crown size={15} className="text-yellow-500 " />
</div>

            <div>
              <p className="font-semibold text-lg">
                {founder.name}
              </p>
              <p className="text-sm opacity-80">
                Founder • Joined {founder.joinedAt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TEAM GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {others.map((m) => (
          <div
            key={m.id}
            className="border rounded-2xl p-4 bg-white hover:shadow-md transition"
          >
            <div className="flex items-center gap-3">
              <img
                src={m.avatar}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">
                  {m.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {m.role}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mt-3">
              Joined {m.joinedAt}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
