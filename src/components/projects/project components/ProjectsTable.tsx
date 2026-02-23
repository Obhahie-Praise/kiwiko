"use client";

import { MoreHorizontal, ExternalLink, GitBranch, Clock, Search, Plus, Instagram, Linkedin, Twitter } from "lucide-react";
import React, { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRouter, useParams } from "next/navigation";
import DeleteProjectModal from "../DeleteProjectModal";

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
  slug: string;
  logoUrl?: string; // Add optional logoUrl
};

const ProjectsTable = ({ projects }: { projects: any[] }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const orgSlug = params?.orgSlug as string;

  const handleRowClick = (projectSlug: string) => {
    router.push(`/${orgSlug}/${projectSlug}/home`);
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase();
    const domain = `kiwiko.io/${project.slug}`; // Changed: Public profile is /slug
    
    return (
      project.name.toLowerCase().includes(query) ||
      domain.toLowerCase().includes(query) ||
      project.stage?.toLowerCase().includes(query) ||
      project.valuation?.toLowerCase().includes(query) ||
      project.status?.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="w-full">
      {/* Search Bar - Moved inside component to control state */}
      <div className="p-4 border-b bg-zinc-50/30 flex items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
              <Search size={16} className="text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search projects by name, stage, valuation..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all placeholder:text-zinc-400" 
              />
          </div>
      </div>

      <div className="w-full overflow-visible">
        {/* Updated Grid Header: 12 columns -> adjusted spans or use more columns */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b text-xs font-medium text-zinc-500 bg-zinc-50/50">
          <div className="col-span-4 pl-2">Project Name</div>
          <div className="col-span-2">Domain</div>
          <div className="col-span-1">Stage</div>
          <div className="col-span-1">Valuation</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-nowrap">Last Updated</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="flex flex-col">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => {
            const domain = `kiwiko.io/${orgSlug}/${project.slug}`;
            
            return (
              <div
                key={project.id}
                onClick={() => handleRowClick(project.slug)}
                className={`grid grid-cols-12 gap-4 px-4 py-3 items-center text-sm border-b hover:bg-zinc-50/50 transition-colors cursor-pointer group ${
                  index === filteredProjects.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Project Name */}
                <div className="col-span-4 flex items-center gap-3 pl-2">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0">
                    {project.logoUrl ? (
                         <img
                            src={project.logoUrl}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                    ) : (
                        <span className="text-xs font-bold text-zinc-400">{project.name ? project.name.substring(0, 2).toUpperCase() : "??"}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 group-hover:text-black transition-colors">{project.name}</p>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <GitBranch size={10} />
                      <span>{project.branch}</span>
                    </div>
                  </div>
                </div>

                {/* Domain */}
                <div className="col-span-2">
                  <a
                    href={`/${project.slug}`} // Changed: Public profile is /slug
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-zinc-50 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all truncate max-w-full"
                  >
                    <span className="truncate">kiwiko.io/{project.slug}</span>
                    <ExternalLink size={10} className="shrink-0 opacity-50" />
                  </a>
                </div>

                 {/* Stage */}
                 <div className="col-span-1">
                   <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                    {project.stage}
                   </span>
                </div>

                {/* Valuation */}
                <div className="col-span-1 text-zinc-600 font-mono text-xs">
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
                    onDelete={() => {
                        setOpenMenuId(null);
                        setProjectToDelete({ id: project.id, name: project.name });
                        setIsDeleteModalOpen(true);
                      }}
                      onSettings={() => router.push(`/${orgSlug}/${project.slug}`)} 
                  />
                </div>
              </div>
            );
          })
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-500">
                <Search size={24} className="mb-2 opacity-20" />
                <p>No projects match your search.</p>
            </div>
          )}

        </div>
      </div>
      
      {projectToDelete && (
        <DeleteProjectModal 
            isOpen={isDeleteModalOpen} 
            onClose={() => setIsDeleteModalOpen(false)} 
            projectId={projectToDelete.id}
            orgSlug={orgSlug}
        />
      )}
    </div>
  );
};

// Extracted ActionMenu component to properly use the hook per instance
const ActionMenu = ({ 
  projectId, 
  isOpen, 
  onToggle, 
  onClose,
  onDelete,
  onSettings
}: { 
  projectId: string; 
  isOpen: boolean; 
  onToggle: () => void;
  onClose: () => void;
  onDelete: () => void;
  onSettings: () => void;
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
          <button 
             onClick={(e) => { e.stopPropagation(); onSettings(); }}
             className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors text-left w-full"
          >
            View Project Settings
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors text-left w-full">
            Manage Domains
          </button>
          <div className="h-px bg-zinc-100 my-1" />
          <button 
             onClick={(e) => { e.stopPropagation(); onDelete(); }}
             className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors text-left w-full"
          >
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
