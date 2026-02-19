import Sidebar from "@/components/Sidebar";
import ProjectNavbar from "@/components/projects/ProjectNavbar";
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ProjectNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-50/30">
          {children}
        </main>
      </div>
    </div>
  );
}