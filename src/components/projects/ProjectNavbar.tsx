"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import { 
  Bell, 
  Settings, 
  ChevronDown, 
  Search, 
  Plus, 
  Building2, 
  Check, 
  User, 
  LogOut,
  ExternalLink,
  ChevronRight,
  UserRoundPen
} from "lucide-react";
import { getUserContextAction } from "@/actions/project.actions";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSession } from "@/lib/auth-client";

const ProjectNavbar = () => {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const orgSlug = params?.orgSlug as string;
  const projectSlug = params?.projectSlug as string;

  const [userOrgs, setUserOrgs] = useState<any[]>([]);
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const orgMenuRef = useRef<HTMLDivElement>(null);
  const projectMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(orgMenuRef, () => setIsOrgMenuOpen(false));
  useClickOutside(projectMenuRef, () => setIsProjectMenuOpen(false));
  useClickOutside(notifRef, () => setIsNotifOpen(false));
  useClickOutside(profileRef, () => setIsProfileOpen(false));

  useEffect(() => {
    const fetchContext = async () => {
      const res = await getUserContextAction();
      if (res.success) {
        setUserOrgs(res.data.organizations);
      }
    };
    fetchContext();
  }, []);

  const currentOrg = userOrgs.find((o) => o.slug === orgSlug);
  const currentProject = currentOrg?.projects.find((p: any) => p.slug === projectSlug);

  const handleSwitchOrg = (newOrg: any) => {
    setIsOrgMenuOpen(false);
    if (newOrg.projects.length > 0) {
      router.push(`/${newOrg.slug}/${newOrg.projects[0].slug}/home`);
    } else {
      router.push(`/${newOrg.slug}/projects`);
    }
  };

  const handleSwitchProject = (newProjectSlug: string) => {
    setIsProjectMenuOpen(false);
    router.push(`/${orgSlug}/${newProjectSlug}/home`);
  };

  // Mock Notifications
  const mockNotifs = [
    { id: 1, text: "New contributor joined your project", time: "2m ago", read: false },
    { id: 2, text: "Data sync completed successfully", time: "1h ago", read: true },
    { id: 3, text: "Pitch deck updated by moderator", time: "5h ago", read: true },
  ];

  return (
    <nav className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 sticky top-0 z-[100] w-full shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-4 h-full">
        {/* Logo */}
        <Link href={`/${orgSlug}/${projectSlug}/home`} className="flex items-center gap-2 hover:opacity-80 transition-opacity pr-2">
          <Image src="/neutral-logo.svg" width={28} height={28} alt="Kiwiko" className="rounded-md shadow-sm" />
          <span className="font-black text-lg tracking-tight text-zinc-900 hidden sm:inline-block">kiwiko</span>
        </Link>

        <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />

        {/* Org Selector */}
        <div className="relative" ref={orgMenuRef}>
          <button 
            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-600 font-bold text-sm border border-transparent hover:border-zinc-200"
          >
            <Building2 size={16} className="text-zinc-400" />
            <span className="max-w-[120px] truncate">{currentOrg?.name || orgSlug}</span>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isOrgMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOrgMenuOpen && (
            <div className="absolute top-11 left-0 w-64 bg-white border border-zinc-200 rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-1">
                Organizations
              </div>
              <div className="space-y-0.5">
                {userOrgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrg(org)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                      org.slug === orgSlug 
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <span className="truncate">{org.name}</span>
                    {org.slug === orgSlug && <Check size={14} className="text-white" />}
                  </button>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <Link 
                  href="/new-organisation" 
                  onClick={() => setIsOrgMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Plus size={14} />
                  <span>New Organization</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <ChevronRight size={14} className="text-zinc-300 mx-1 hidden sm:block" />

        {/* Project Selector */}
        <div className="relative" ref={projectMenuRef}>
          <button 
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors text-zinc-900 font-black text-sm border border-transparent hover:border-zinc-200"
          >
            <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center border border-zinc-200 shrink-0">
               {currentProject?.logoUrl ? (
                 <img src={currentProject.logoUrl} className="w-full h-full object-cover rounded-[3px]" alt="" />
               ) : (
                 <span className="text-[10px] font-black">{currentProject?.name.charAt(0) || "P"}</span>
               )}
            </div>
            <span className="max-w-[150px] truncate">{currentProject?.name || projectSlug}</span>
            <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isProjectMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProjectMenuOpen && (
            <div className="absolute top-11 left-0 w-64 bg-white border border-zinc-200 rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-1">
                Select Venture
              </div>
              <div className="space-y-0.5">
                {currentOrg?.projects.map((proj: any) => (
                  <button
                    key={proj.id}
                    onClick={() => handleSwitchProject(proj.slug)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                      proj.slug === projectSlug 
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                      proj.slug === projectSlug ? "border-zinc-700 bg-zinc-800" : "bg-white border-zinc-200"
                    }`}>
                      {proj.logoUrl ? (
                        <img src={proj.logoUrl} className="w-full h-full object-cover rounded" alt="" />
                      ) : (
                        <span className="text-[10px] uppercase">{proj.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="truncate">{proj.name}</span>
                    {proj.slug === projectSlug && <Check size={14} className="ml-auto text-white" />}
                  </button>
                ))}
                <div className="h-px bg-zinc-100 my-1" />
                <Link 
                  href={`/${orgSlug}/new-project`} 
                  onClick={() => setIsProjectMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <Plus size={14} />
                  <span>New Venture</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Settings */}
        <Link 
          href={`/${orgSlug}/${projectSlug}`}
          className={`p-2 rounded-lg transition-all ${
            pathname === `/${orgSlug}/${projectSlug}` 
              ? "bg-zinc-100 text-zinc-900 shadow-inner" 
              : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
          title="Project Settings"
        >
          <Settings size={20} />
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`p-2 rounded-lg relative transition-all ${
              isNotifOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
          >
            <Bell size={20} />
            {mockNotifs.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 border-2 border-white rounded-full" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-11 right-0 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-50 mb-1">
                <span className="font-black text-sm uppercase tracking-tight">Updates</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Live</span>
              </div>
              <div className="space-y-1 py-1">
                {mockNotifs.map((n) => (
                  <button key={n.id} className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors group">
                    <p className="text-sm font-bold text-zinc-900 leading-tight mb-1">{n.text}</p>
                    <span className="text-[10px] font-medium text-zinc-400">{n.time}</span>
                    {!n.read && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-2" />}
                  </button>
                ))}
              </div>
              <button className="w-full py-2 text-xs font-black text-zinc-400 hover:text-zinc-900 transition-colors border-t border-zinc-50 mt-1 uppercase tracking-widest text-center">
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-zinc-200 mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 p-1 pr-3 rounded-full hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-200 group"
          >
            <img 
              src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'U'}&background=f4f4f5&color=71717a`} 
              className="w-8 h-8 rounded-full border border-zinc-200 shadow-sm transition-transform group-hover:scale-105" 
              alt="Avatar" 
            />
            <div className="flex flex-col items-start hidden md:flex">
              <span className="text-xs font-black text-zinc-900 leading-none mb-0.5">{session?.user?.name || "Member"}</span>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Verified</span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute top-11 right-0 w-64 bg-white border border-zinc-200 rounded-2xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-4 bg-zinc-50/50 rounded-xl mb-2 flex items-center gap-3 border border-zinc-100/50">
                 <img src={session?.user?.image || ""} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                 <div className="overflow-hidden">
                   <p className="font-black text-sm text-zinc-900 truncate">{session?.user?.name}</p>
                   <p className="text-[10px] text-zinc-400 truncate font-bold">{session?.user?.email}</p>
                 </div>
              </div>
              
              <div className="space-y-0.5">
                <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-all group">
                  <User size={18} className="text-zinc-400 group-hover:text-zinc-900" />
                  <span>Your Profile</span>
                </Link>
                <Link href="/billing" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-all group">
                  <UserRoundPen size={18} className="text-zinc-400 group-hover:text-zinc-900" />
                  <span>Subscription</span>
                </Link>
                <div className="h-px bg-zinc-100 my-1.5 mx-2" />
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all group">
                  <LogOut size={18} className="text-red-400 group-hover:text-red-900" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProjectNavbar;
