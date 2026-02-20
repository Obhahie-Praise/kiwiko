"use client";

import { getSession } from "@/constants/getSession";
import { ChevronsUpDown, Check, Building2, Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useParams, useRouter, usePathname } from "next/navigation";
import NavProfileDropdown from "../NavProfileDropdown";
import { GithubIcon } from "lucide-react";

// Mock organizations data REMOVED

interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

interface NavbarProps {
  showNewOrgButton?: boolean;
  organizations?: Organization[];
  currentOrg?: Organization;
  user?: {
      name?: string | null;
      image?: string | null;
      email?: string | null;
  };
}

const Navbar = ({ 
    showNewOrgButton = true, 
    organizations = [], 
    currentOrg, 
    user 
}: NavbarProps) => {
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [internalUser, setInternalUser] = useState<any>(null); // Fallback for client-side only usage
  
  const router = useRouter();
  
  // Use passed currentOrg or default to first in list or a placeholder
  const activeOrg = currentOrg || organizations[0] || { id: "0", name: "Select Org", slug: "" };
  
  const orgMenuRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(orgMenuRef, () => {
    setIsOrgMenuOpen(false);
  });

  useEffect(() => {
    // Only fetch session if user prop is not provided
    if (!user) {
        const fetchSession = async () => {
        const session = await getSession();
        setInternalUser(session?.user);
        };
        fetchSession();
    }
  }, [user]);

  const displayUser = user || internalUser;

  const toggleOrgMenu = () => setIsOrgMenuOpen(!isOrgMenuOpen);
  
  const switchOrg = (org: Organization) => {
    setIsOrgMenuOpen(false);
    // Dynamically change URL to /[orgSlug]/projects
    router.push(`/${org.slug}/projects`);
  };

  return (
    <nav className="bg-white py-2 px-6 flex items-center justify-between border-b relative z-50">
      <div className="flex items-center gap-2">
        <Link href={activeOrg.slug ? `/${activeOrg.slug}/projects` : '/'} className="flex items-center gap-2">
          <Image
            src="/neutral-logo.svg"
            height={30}
            width={30}
            alt="kiwiko-logo"
          />
        </Link>
        <span className="text-zinc-300">/</span>
        
        {/* Org Switcher */}
        <div className="relative" ref={orgMenuRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={toggleOrgMenu}
          >
            <p className="text-sm font-medium group-hover:text-zinc-800 transition-colors">
              {activeOrg.name}
            </p>
            <div className={`bg-zinc-100 rounded-sm text-zinc-500 p-0.5 group-hover:bg-zinc-200 transition-colors ${isOrgMenuOpen ? 'bg-zinc-200 text-zinc-800' : ''}`}>
              <ChevronsUpDown size={14} />
            </div>
          </div>

          {/* Org Dropdown */}
          {isOrgMenuOpen && (
            <div className="absolute top-8 left-0 w-64 bg-white border border-zinc-200 rounded-lg shadow-xl z-20 p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Switch Organization
              </div>
              
              {organizations.length > 0 ? (
                  organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => switchOrg(org)}
                      className="flex items-center justify-between px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors text-left w-full group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:shadow-sm">
                           {org.logoUrl ? (
                               <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover rounded" />
                           ) : (
                               <Building2 size={12} />
                           )}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-sm">{org.name}</span>
                        </div>
                      </div>
                      {activeOrg.slug === org.slug && (
                        <Check size={14} className="text-emerald-600" />
                      )}
                    </button>
                  ))
              ) : (
                  <div className="px-3 py-2 text-sm text-zinc-400">No organizations found</div>
              )}
              
              <div className="h-px bg-zinc-100 my-1" />
              
              <Link href="/new-organisation">
                <button className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 rounded-md transition-colors text-left w-full">
                  <div className="w-5 h-5 rounded border border-dashed border-zinc-300 flex items-center justify-center">
                    <Plus size={12} />
                  </div>
                  <span>Create Organization</span>
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {activeOrg.slug && (
          <Link href={`/${activeOrg.slug}`}>
            <button className="bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-medium text-sm py-1.5 px-3 rounded-md transition-colors flex items-center gap-2 group border border-zinc-100">
              <Settings size={14} className="group-hover:rotate-45 transition-transform" />
              <p className="text-xs">Org Settings</p>
            </button>
          </Link>
        )}
        {showNewOrgButton && (
          <div className="">
            <Link href="/new-organisation">
              <button className="bg-white hover:bg-zinc-100 text-black font-medium text-sm py-1.5 px-4 rounded-md shadow-sm transition-colors flex items-center gap-2">
                <Plus size={16} />
                <p className="text-xs">New Organization</p>
              </button>
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2 pl-4 border-l">
          <NavProfileDropdown 
            session={{ user: displayUser, account: (internalUser as any)?.account }} 
            orgSlug={activeOrg.slug}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
