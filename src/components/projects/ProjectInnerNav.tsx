"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  ChevronDown,
  ChevronRight,
  Check,
  Plus,
  Settings,
  Bolt,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserContextAction } from "@/actions/project.actions";
import { useClickOutside } from "@/hooks/useClickOutside";
import NavProfileDropdown from "../NavProfileDropdown";
import NotificationsMenu from "../NotificationsMenu";

const ProjectInnerNav = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const orgSlug = params?.orgSlug as string;
  const projectSlug = params?.projectSlug as string;

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  const orgMenuRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(orgMenuRef, () => setIsOrgMenuOpen(false));
  useClickOutside(projectMenuRef, () => setIsProjectMenuOpen(false));

  // Sync with sidebar state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    setIsSidebarCollapsed(stored === "true");

    const handle = (e: CustomEvent) => setIsSidebarCollapsed(e.detail);
    window.addEventListener("sidebar-toggle" as any, handle);
    return () => window.removeEventListener("sidebar-toggle" as any, handle);
  }, []);

  const toggleSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  };

  useEffect(() => {
    const fetchContext = async () => {
      const res = await getUserContextAction();
      if (res.success) setUserOrgs(res.data.organizations);
    };
    fetchContext();
  }, []);

  const currentOrg = userOrgs.find((o) => o.slug === orgSlug);
  const currentProject = currentOrg?.projects.find((p: any) => p.slug === projectSlug);

  const handleSwitchOrg = (newOrg: any) => {
    setIsOrgMenuOpen(false);
    router.push(
      newOrg.projects.length > 0
        ? `/${newOrg.slug}/${newOrg.projects[0].slug}/home`
        : `/${newOrg.slug}/projects`
    );
  };

  const handleSwitchProject = (newProjectSlug: string) => {
    setIsProjectMenuOpen(false);
    router.push(`/${orgSlug}/${newProjectSlug}/home`);
  };

  return (
    <nav className="flex items-center justify-between h-11 px-3 border-b border-zinc-100 bg-white sticky top-0 z-50">
      {/* Left: collapse toggle + breadcrumb */}
      <div className="flex items-center gap-2">
        {/* Sidebar collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed
            ? <PanelLeftOpen size={16} strokeWidth={1.5} />
            : <PanelLeftClose size={16} strokeWidth={1.5} />}
        </button>

        <div className="h-4 w-px bg-zinc-200" />

        {/* Org selector */}
        <div className="relative" ref={orgMenuRef}>
          <button
            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-50 transition-colors text-zinc-500 text-xs font-medium"
          >
            <Building2 size={13} strokeWidth={1.5} className="text-zinc-400" />
            <span className="max-w-[100px] truncate">{currentOrg?.name || orgSlug}</span>
            <ChevronDown size={11} className={`text-zinc-400 transition-transform duration-150 ${isOrgMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isOrgMenuOpen && (
            <div className="absolute top-9 left-0 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-1">
                Organizations
              </div>
              <div className="space-y-0.5">
                {userOrgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrg(org)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      org.slug === orgSlug
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="truncate">{org.name}</span>
                    {org.slug === orgSlug && <Check size={12} />}
                  </button>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <Link
                  href="/new-organisation"
                  onClick={() => setIsOrgMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <Plus size={12} />
                  New Organization
                </Link>
              </div>
            </div>
          )}
        </div>

        <ChevronRight size={12} className="text-zinc-300" />

        {/* Project selector */}
        <div className="relative" ref={projectMenuRef}>
          <button
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-50 transition-colors text-zinc-800 text-xs font-semibold"
          >
            <div className="w-4 h-4 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
              {currentProject?.logoUrl ? (
                <img src={currentProject.logoUrl} className="w-full h-full object-cover rounded" alt="" />
              ) : (
                <span className="text-[9px] font-black">{(currentProject?.name || projectSlug).charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="max-w-[140px] truncate">{currentProject?.name || projectSlug}</span>
            <ChevronDown size={11} className={`text-zinc-400 transition-transform duration-150 ${isProjectMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isProjectMenuOpen && (
            <div className="absolute top-9 left-0 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-100 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-1">
                Ventures
              </div>
              <div className="space-y-0.5">
                {currentOrg?.projects.map((proj: any) => (
                  <button
                    key={proj.id}
                    onClick={() => handleSwitchProject(proj.slug)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      proj.slug === projectSlug
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      proj.slug === projectSlug ? "border-zinc-700 bg-zinc-800" : "bg-white border-zinc-200"
                    }`}>
                      {proj.logoUrl
                        ? <img src={proj.logoUrl} className="w-full h-full object-cover rounded" alt="" />
                        : <span className="text-[9px]">{proj.name.charAt(0)}</span>}
                    </div>
                    <span className="truncate">{proj.name}</span>
                    {proj.slug === projectSlug && <Check size={12} className="ml-auto" />}
                  </button>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <Link
                  href={`/${orgSlug}/new-project`}
                  onClick={() => setIsProjectMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <Plus size={12} />
                  New Venture
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-1">
        <form className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
          <Search size={13} strokeWidth={1.5} className="text-zinc-400" />
          <input
            type="text"
            className="bg-transparent focus:outline-none text-xs text-zinc-600 placeholder:text-zinc-400 w-32"
            placeholder="Search..."
          />
        </form>

        <div className="h-4 w-px bg-zinc-200 mx-1" />

        <Link
          href={`/${orgSlug}/${projectSlug}`}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 transition-colors"
          title="Settings"
        >
          <Settings size={15} strokeWidth={1.5} />
        </Link>

        <NotificationsMenu />

        <div className="h-4 w-px bg-zinc-200 mx-1" />

        <NavProfileDropdown session={session} orgSlug={orgSlug} />
      </div>
    </nav>
  );
};

export default ProjectInnerNav;
