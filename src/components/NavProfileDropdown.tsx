"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { User, Building2, UserRoundPen, LogOut, GithubIcon } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavProfileDropdownProps {
  session: any;
  orgSlug?: string;
}

const NavProfileDropdown = ({ session, orgSlug }: NavProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  const user = session?.user;
  const account = session?.account;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 p-1 pr-3 rounded-full hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-200 group"
      >
        <img 
          src={user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=f4f4f5&color=71717a`} 
          className="w-8 h-8 rounded-full border border-zinc-200 shadow-sm transition-transform group-hover:scale-105" 
          alt="Avatar" 
        />
        <div className="flex flex-col items-start md:flex">
          <span className="text- font-semibold hero-font text-zinc-900 leading-none mb-0.5">{user?.name || "Member"}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-white border border-zinc-200 rounded-xl shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200 z-[100]">
          <div className="px-3 py-3 border-b border-zinc-100 mb-1">
             <div className="flex items-center gap-3 mb-2">
                <img 
                  src={user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=f4f4f5&color=71717a`} 
                  className="w-10 h-10 rounded-full border border-zinc-200" 
                  alt="" 
                />
                <div className="overflow-hidden">
                  <p className="font-bold text-sm text-zinc-900 truncate">{user?.name}</p>
                  <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-100 inline-block">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{user?.role || "Founder"}</span>
                </div>
                {account?.provider && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-50 border border-zinc-100">
                    {account.provider === "github" ? (
                      <GithubIcon size={10} className="text-zinc-600" />
                    ) : (
                      <Image src="/google.png" width={10} height={10} alt="Google" />
                    )}
                    <span className="text-[9px] font-bold text-zinc-400 capitalize">{account.provider}</span>
                  </div>
                )}
             </div>
          </div>
          
          <div className="py-1">
            <Link 
              href="/profile" 
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="text-zinc-400 group-hover:text-zinc-600" />
              <span>Account Settings</span>
            </Link>
            {orgSlug && (
              <Link 
                href={`/${orgSlug}/settings`} 
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <Building2 size={16} className="text-zinc-400 group-hover:text-zinc-600" />
                <span>Organization Settings</span>
              </Link>
            )}
            {/* Removed Subscription button per user request */}
          </div>

          <div className="h-px bg-zinc-100 my-1 px-1" />
          
          <div className="py-1">
            <button 
              onClick={async () => {
                const { signOut } = await import("@/lib/auth-client");
                await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/sign-in");
                    }
                  }
                });
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            >
              <LogOut size={16} className="text-red-400 group-hover:text-red-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavProfileDropdown;
