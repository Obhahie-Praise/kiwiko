"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Users, MessageSquare, ListTodo, BarChart3 } from "lucide-react";

const tabs = [
  { label: "Board", segment: "board", icon: Users },
  { label: "Chat", segment: "chat", icon: MessageSquare },
  { label: "Tasks", segment: "tasks", icon: ListTodo },
  { label: "Contributions", segment: "contributions", icon: BarChart3 },
];

// Re-checking the paths based on actual files found in previous step:
// board, chat, contributions, tasks
// Wait, listing showed: board, chat, contributions, tasks. 
// Ah, my bad, I missed 'chat' in the summary but it was there in the JSON.
// Wait, looking at Step Id 457: {"name":"board","isDir":true}, {"name":"chat","isDir":true}, {"name":"contributions","isDir":true}, {"name":"tasks","isDir":true}
// Okay, so chat exists.

export default function TeamTabs() {
  const pathname = usePathname();
  const params = useParams();
  
  const orgSlug = params?.orgSlug as string;
  const projectSlug = params?.projectSlug as string;

  const getHref = (segment: string) => `/${orgSlug}/${projectSlug}/teams/${segment}`;

  return (
    <nav className="flex gap-8 px-8 border-b border-zinc-100 bg-white sticky top-0 z-10 overflow-x-auto no-scrollbar">
      {tabs.map(({ label, segment, icon: Icon }) => {
        const href = getHref(segment);
        // Special case for board as it might be the default or specifically labeled
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={segment}
            href={href}
            className={`flex items-center gap-2.5 py-4 text-sm font-semibold transition-all relative whitespace-nowrap
              ${
                isActive
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <Icon size={18} className={isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-500"} />
            <span>{label}</span>
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
