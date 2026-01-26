"use client";

import { useState, useRef } from "react";
import {
  LogOut,
  Settings,
  User,
  Building2,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";

const HomeNavProfileBtn = ({
  session,
  truncateEmail,
  startup,
}: {
  session: any;
  truncateEmail: string;
  startup: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-zinc-100 transition"
      >
        <img
          src={session?.user.image as string}
          width={35}
          height={35}
          alt="profile-image"
          className="rounded-full border-2 border-zinc-200"
        />
        <div className="text-left">
          <p className="text-sm text-zinc-900 font-medium leading-none">
            {startup?.startupName}
          </p>
          <span className="text-xs text-zinc-500 font-medium capitalize">
            {startup.userRole}
          </span>
        </div>
        <ChevronDown
          width={15}
          height={15}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-zinc-200 bg-white shadow-lg p-2 z-50">
          {/* Identity */}
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-zinc-900">
              {startup?.startupName}
            </p>
            <p className="text-xs text-zinc-500">Founder • Pre-seed</p>
          </div>

          <div className="my-2 h-px bg-zinc-200" />

          {/* Actions */}
          <DropdownItem icon={User} label="View profile" />
          <DropdownItem icon={Settings} label="Account settings" />
          <DropdownItem icon={Building2} label="Startup settings" />
          <DropdownItem icon={ArrowRightLeft} label="Switch startup" />

          <div className="my-2 h-px bg-zinc-200" />

          {/* Context */}
          <div className="px-3 py-2 text-xs text-zinc-500 space-y-1">
            <p>
              Role: <span className="text-zinc-700">Founder</span>
            </p>
            <p>
              Visibility: <span className="text-zinc-700">Public</span>
            </p>
          </div>

          <div className="my-2 h-px bg-zinc-200" />

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
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
        ${
          destructive
            ? "text-red-600 hover:bg-red-50"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
