import Sidebar from "@/components/Sidebar";
import ProjectInnerNav from "@/components/projects/ProjectInnerNav";
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden hero-font">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 relative">
        <ProjectInnerNav />
        <main className="flex-1 overflow-y-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}