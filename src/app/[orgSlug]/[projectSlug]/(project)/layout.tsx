import Sidebar from "@/components/Sidebar";
import React from "react";

export default function ProjectGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr]">
      <aside className="sticky top-0 h-screen">
        <Sidebar />
      </aside>
      <div className="overflow-y-auto min-h-screen">{children}</div>
    </div>
  );
}
