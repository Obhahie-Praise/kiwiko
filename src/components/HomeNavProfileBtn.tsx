"use client";

import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  LogOut,
  Settings,
  User,
  Building2,
  ArrowRightLeft,
  ChevronDown,
  GithubIcon
} from "lucide-react";

const HomeNavProfileBtn = ({
  session,
  truncateEmail,
  project,
  userRole,
}: {
  session: any;
  truncateEmail: string;
  project: any;
  userRole: string;
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setOpen(false);
  });

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all active:scale-95 ${open ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`}
      >
        <div className="relative">
          <img
            src={session?.user?.image as string}
            width={32}
            height={32}
            alt="profile-image"
            className="rounded-full border border-zinc-200 shadow-sm"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm text-zinc-900 font-bold tracking-tight leading-none">
            {project?.name || "My Project"}
          </p>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
            {userRole}
          </span>
        </div>
        <ChevronDown
          width={14}
          height={14}
          className={`text-zinc-400 transition-transform duration-200 ${open ? "rotate-180 text-zinc-900" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-zinc-200 bg-white shadow-2xl p-2 z-[100] animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* Identity */}
          <div className="px-4 py-3 bg-zinc-50 rounded-xl mb-2">
            <p className="text-sm font-bold text-zinc-900 leading-none">
              {session?.user?.name || "Member"}
            </p>
            <p className="text-[10px] text-zinc-400 mt-1 truncate">{session?.user?.email}</p>
            <div className="mt-3 flex items-center gap-2">
               <div className="px-2 py-0.5 rounded-md bg-white border border-zinc-200 inline-block shadow-sm">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{userRole || "Founder"}</span>
               </div>
               {session?.account?.provider && (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-zinc-200 shadow-sm">
                    {session.account.provider === "github" ? (
                      <GithubIcon size={10} className="text-zinc-600" />
                    ) : (
                      <img src="/google.png" className="w-2.5 h-2.5" alt="Google" />
                    )}
                    <span className="text-[9px] font-bold text-zinc-400 capitalize">{session.account.provider}</span>
                  </div>
                )}
            </div>
          </div>

          <div className="space-y-0.5">
            <DropdownItem icon={User} label="View profile" />
            <DropdownItem icon={Settings} label="Account settings" />
            <DropdownItem icon={Building2} label="Startup settings" />
            <DropdownItem icon={ArrowRightLeft} label="Switch startup" />
          </div>

          <div className="my-2 px-2">
            <div className="h-px bg-zinc-100" />
          </div>

          <div className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest space-y-2">
            <p className="flex justify-between">
              Current Role: <span className="text-zinc-600">{userRole}</span>
            </p>
            <p className="flex justify-between">
              Visibility: <span className="text-emerald-600">Public</span>
            </p>
          </div>

          <div className="my-2 px-2">
            <div className="h-px bg-zinc-100" />
          </div>

          {/* Sign out */}
          <DropdownItem icon={LogOut} label="Sign out" destructive />
        </div>
      )}
    </div>
  );
};

export default HomeNavProfileBtn;

/* -------------------------------- */

function DropdownItem({
  icon: Icon,
  label,
  destructive = false,
}: {
  icon: any;
  label: string;
  destructive?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
        ${
          destructive
            ? "text-red-500 hover:bg-red-50"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        }`}
    >
      <Icon className={`h-4 w-4 transition-colors ${destructive ? 'text-red-400 group-hover:text-red-600' : 'text-zinc-400 group-hover:text-zinc-900'}`} />
      {label}
    </button>
  );
}
