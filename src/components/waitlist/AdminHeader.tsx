"use client";

import React from "react";
import { CircleDollarSign, House, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab = "home" | "users" | "investors";

interface AdminHeaderProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

const AdminHeader = ({ currentTab, onTabChange }: AdminHeaderProps) => {
  const tabs = [
    { id: "home" as const, icon: House, label: "Overview" },
    { id: "users" as const, icon: Users, label: "Waitlist" },
    { id: "investors" as const, icon: CircleDollarSign, label: "Investors" },
  ];

  return (
    <header className="text-zinc-200 flex items-center justify-center py-10">
      <div className="flex items-center justify-between gap-1 bg-zinc-900/50 backdrop-blur-md p-0.5 rounded-2xl border border-zinc-800 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "py-2 px-3 sm:px-2.5 rounded-xl transition-all duration-300 group relative flex items-center gap-2",
                isActive 
                  ? "bg-orange-500/50 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <Icon strokeWidth={isActive ? 1.6 : 1.4} size={20} />
              {/* <span className={cn(
                "text-xs font-medium pr-1 transition-all duration-300 hidden sm:inline",
                isActive ? "opacity-100" : "opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto"
              )}>
                {tab.label}
              </span> */}
              {!isActive && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700">
                  {tab.label}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default AdminHeader;
