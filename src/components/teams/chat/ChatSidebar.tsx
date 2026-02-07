"use client";

import { Hash, Users } from "lucide-react";
import { useState } from "react";

export default function ChatSidebar({ rooms }: any) {
  const [active, setActive] = useState(rooms[0]?.id);

  return (
    <div className="border-r bg-zinc-50 p-4 space-y-1">
      <h2 className="text-sm font-semibold flex items-center gap-2 mb-5">
        <Users size={16} />
        Channels
      </h2>

      {rooms.map((r: any) => (
        <button
          key={r.id}
          onClick={() => setActive(r.id)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex gap-2 items-center
          ${
            active === r.id
              ? "bg-black text-white"
              : "hover:bg-zinc-200"
          }`}
        >
          <Hash size={14} />
          {r.name}
        </button>
      ))}
    </div>
  );
}
