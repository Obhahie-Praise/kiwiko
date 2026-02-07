"use client";

import { Search, Plus, FolderPlus } from "lucide-react";
import React from "react";
import { projects } from "@/constants";
import { organizations } from "@/components/common/Navbar";
import ProjectsTable from "@/components/projects/project components/ProjectsTable";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";

const OrgProjectsPage = () => {
  const params = useParams();
  const orgSlug = params?.orgSlug as string;

  // Find the current organization
  const currentOrg = organizations.find((o) => o.slug === orgSlug) || organizations[0];

  // Filter projects by the current organization's slug
  const filteredProjects = projects.filter((p: any) => p.orgSlug === orgSlug);

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Navbar />

      <main className="flex mt-10 items-center justify-center pb-20">
        <div className="min-w-4xl w-full max-w-5xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div>
                  <h1 className="text-2xl font-semibold text-zinc-900">{currentOrg.name} Projects</h1>
                  <p className="text-zinc-500 text-sm mt-0.5">Manage and monitor all startup ventures within this organization.</p>
               </div>
               <span className="text-zinc-500 text-xs bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-sm font-medium">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
               </span>
            </div>
            
            <Link href={`/${orgSlug}/new-project`}>
              <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95">
                <Plus size={18} />
                New Project
              </button>
            </Link>
          </div>
          
          {filteredProjects.length > 0 ? (
            <div className="w-full p-0 border border-zinc-200 rounded-2xl bg-white shadow-xl overflow-hidden">
                <div className="p-4 border-b bg-zinc-50/30 flex items-center justify-between gap-4">
                  <div className="relative flex-1 w-full">
                      <Search size={16} className="text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search projects by name, stage, or domain..." 
                        className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400" 
                      />
                  </div>
              </div>
              <ProjectsTable projects={filteredProjects} />
            </div>
          ) : (
            <div className="w-full py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white/50 flex flex-col items-center justify-center text-center px-10">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 text-zinc-400">
                <FolderPlus size={32} />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">No projects found</h2>
              <p className="text-zinc-500 max-w-sm mb-8">
                This organization doesn't have any projects yet. Start by creating your first startup venture.
              </p>
              <Link href={`/${orgSlug}/new-project`}>
                <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95">
                  <Plus size={18} />
                  Create First Project
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrgProjectsPage;
