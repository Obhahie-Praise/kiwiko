"use client";
import { notifications } from "@/constants";
import { Bell } from "lucide-react";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

const NotificationsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const unreadCount = notifications.filter((n) => !n.seen).length;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg relative transition-colors ${
          isOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700"
        }`}
      >
        <Bell size={15} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        )}
      </button>

      {isOpen && (
        <div className="z-[100] w-72 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden absolute right-0 top-9 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-700">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* List */}
          <ul className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-zinc-50 transition-colors ${
                  !n.seen ? "bg-zinc-50/80" : ""
                }`}
              >
                {!n.seen && (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                )}
                <div className={`flex-1 min-w-0 ${n.seen ? "pl-[18px]" : ""}`}>
                  <p className={`text-xs leading-snug truncate ${n.seen ? "text-zinc-500" : "font-semibold text-zinc-800"}`}>
                    {n.title}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{n.createdAt}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-100">
            <button className="text-[11px] text-zinc-400 hover:text-zinc-700 transition-colors">
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
