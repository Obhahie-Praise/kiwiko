import Sidebar from "@/components/Sidebar";
import ProjectInnerNav from "@/components/projects/ProjectInnerNav";
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen hero-font bg-zinc-50 relative">
      <aside className="sticky top-0 h-screen shrink-0 z-40">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 relative">
        <ProjectInnerNav />
        <main className="flex-1 w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}