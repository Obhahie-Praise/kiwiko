"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaitlistEntry {
  id: string;
  email: string;
  joinedAt: string;
  source: string;
}

interface WaitlistTableProps {
  entries: WaitlistEntry[];
}

const WaitlistTable = ({ entries }: WaitlistTableProps) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto special-scroll-bar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-900/60">
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 tracking-wider hidden md:table-cell">Joined At</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 tracking-wider hidden md:table-cell">Source</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs">
                        {entry.email[0].toUpperCase()}
                      </div>
                      <span className="text-zinc-200 text-sm font-medium">{entry.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm hidden md:table-cell">
                    {new Date(entry.joinedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-zinc-500 text-xs bg-zinc-800/50 px-2 py-1 rounded border border-zinc-700">
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-zinc-500 italic">
                  No waitlist entries found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WaitlistTable;
