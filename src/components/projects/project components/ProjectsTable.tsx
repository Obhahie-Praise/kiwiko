"use client";

import { MoreHorizontal, ExternalLink, GitBranch, Clock } from "lucide-react";
import React, { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRouter, useParams } from "next/navigation";

type Project = {
  id: string;
  name: string;
  branch: string
  stage: string;
  status: string;
  progress: number;
  invested: string;
  valuation: string;
  roi: string;
  lastUpdate: string;
};

const ProjectsTable = ({ projects }: { projects: Project[] }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const orgSlug = params?.orgSlug as string;

  const handleRowClick = (projectName: string) => {
    const projectSlug = projectName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${orgSlug}/${projectSlug}/home`);
  };
  
  return (
    <div className="w-full overflow-visible">
      {/* Updated Grid Header: 12 columns -> adjusted spans or use more columns */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b text-xs font-medium text-zinc-500 bg-zinc-50/50 rounded-t-xl">
        <div className="col-span-4">Project Name</div>
        <div className="col-span-2">Domain</div>
        <div className="col-span-1">Stage</div>
        <div className="col-span-1">Valuation</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1 text-nowrap">Last Updated</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      <div className="flex flex-col">
        {projects.map((project, index) => {
          // Generate a mock domain and simplified name for avatar/display
          const domain = `${project.name.toLowerCase().replace(/\s+/g, "")}.kiwiko.io`;
          const logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.name)}&background=random&color=fff&rounded=true&bold=true`;

          return (
            <div
              key={project.id}
              onClick={() => handleRowClick(project.name)}
              className={`grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm border-b hover:bg-zinc-50/50 transition-colors cursor-pointer ${
                index === projects.length - 1 ? "border-b-0" : ""
              }`}
            >
              {/* Project Name */}
              <div className="col-span-4 flex items-center gap-3">
                <img
                  src={logo}
                  alt={project.name}
                  className="w-8 h-8 rounded-full border shadow-sm"
                />
                <div>
                  <p className="text-sm font-medium text-zinc-800">{project.name}</p>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <GitBranch size={10} />
                    <span>{project.branch}</span>
                  </div>
                </div>
              </div>

              {/* Domain (Generated) */}
              <div className="col-span-2">
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-transparent hover:border-zinc-200 transition-all truncate max-w-full"
                >
                  <span className="truncate">{domain}</span>
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              </div>

               {/* Stage */}
               <div className="col-span-1 text-zinc-600 font-medium">
                {project.stage}
              </div>

              {/* Valuation */}
              <div className="col-span-1 text-zinc-600">
                {project.valuation}
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    project.status === "Active" || project.status === "Live"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      project.status === "Active" || project.status === "Live"
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  />
                  {project.status}
                </span>
              </div>

              {/* Last Updated */}
              <div className="col-span-1 text-zinc-500 text-xs flex items-center gap-1.5 truncate">
                <Clock size={12} className="shrink-0" />
                <span className="truncate">{project.lastUpdate}</span>
              </div>

              {/* Actions */}
              <div className="col-span-1 flex justify-end relative" onClick={(e) => e.stopPropagation()}>
                <ActionMenu 
                  projectId={project.id} 
                  isOpen={openMenuId === project.id} 
                  onToggle={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                  onClose={() => setOpenMenuId(null)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Extracted ActionMenu component to properly use the hook per instance
const ActionMenu = ({ 
  projectId, 
  isOpen, 
  onToggle, 
  onClose 
}: { 
  projectId: string; 
  isOpen: boolean; 
  onToggle: () => void;
  onClose: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(menuRef, () => {
    if (isOpen) onClose();
  });

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={onToggle}
        className={`z-10 p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all ${
          isOpen ? "bg-zinc-100 text-zinc-600 ring-2 ring-zinc-200" : ""
        }`}
      >
        <MoreHorizontal size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-9 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl z-50 p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors text-left w-full">
            View Project Settings
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors text-left w-full">
            Manage Domains
          </button>
          <div className="h-px bg-zinc-100 my-1" />
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left w-full">
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
