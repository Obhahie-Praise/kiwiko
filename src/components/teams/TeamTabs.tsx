"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, MessageSquare, ListTodo, BarChart3 } from "lucide-react";

const tabs = [
  { label: "Board", href: "/teams/board", icon: Users },
  { label: "Chat", href: "/teams/chat", icon: MessageSquare },
  { label: "Tasks", href: "/teams/tasks", icon: ListTodo },
  { label: "Contributions", href: "/teams/contributions", icon: BarChart3 },
];

export default function TeamTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-6 px-6 py-3">
      {tabs.map(({ label, href, icon: Icon }) => {
        const active = pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 text-sm font-medium transition
              ${
                active
                  ? "text-black border-b-2 border-black pb-2"
                  : "text-zinc-500 hover:text-black"
              }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
