import Sidebar from "@/components/Sidebar";
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full overflow-hidden hero-font">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-zinc-50">
        {children}
      </main>
    </div>
  );
}