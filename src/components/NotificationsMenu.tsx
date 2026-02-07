"use client";
import { notifications } from "@/constants";
import { Bell } from "lucide-react";
import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  Eye,
  Rocket,
  Mail,
  TrendingUp,
  AlertTriangle,
  Banknote,
} from "lucide-react";

const NotificationsMenu = () => {
  const iconMap: Record<string, any> = {
    eye: Eye,
    rocket: Rocket,
    mail: Mail,
    "trending-up": TrendingUp,
    alert: AlertTriangle,
    banknote: Banknote,
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  return (
      <div className="relative" ref={menuRef}>
        <div 
          className={`p-1.5 rounded-full cursor-pointer transition-colors relative ${isOpen ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900'}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell width={15} height={15} />
          <div className="absolute h-1.5 w-1.5 bg-red-500 -top-0.5 -right-0.5 rounded-full border border-white" />
        </div>
      
        {isOpen && (
          <div className="z-[100] w-90 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden absolute right-0 top-10 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
              <span className="text-[10px] font-bold bg-zinc-900 text-white px-2 py-0.5 rounded-full">
                {notifications.filter(n => !n.seen).length} NEW
              </span>
            </div>

            {/* List */}
            <ul className="max-h-96 overflow-y-auto p-1.5 space-y-1 bg-white">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.icon] || Eye;

                return (
                  <li
                    key={notification.id}
                    className={`flex gap-4 px-4 py-3 cursor-pointer transition-all rounded-xl border border-transparent
                    ${
                      notification.seen
                        ? "bg-white hover:bg-zinc-50"
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-100"
                    }
                  `}
                  >
                    {/* Icon */}
                    <div className={`mt-0.5 p-2 rounded-lg h-fit ${notification.seen ? 'bg-zinc-100 text-zinc-500' : 'bg-zinc-900 text-white'}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm tracking-tight truncate ${
                            notification.seen
                              ? "font-medium text-zinc-600"
                              : "font-bold text-zinc-900"
                          }`}
                        >
                          {notification.title}
                        </p>

                        {!notification.seen && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        )}
                      </div>

                      <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${notification.seen ? 'text-zinc-500' : 'text-zinc-600'}`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-medium text-zinc-400">
                          {notification.createdAt}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-zinc-100 text-center bg-zinc-50/50">
              <button className="text-xs font-bold text-zinc-900 hover:text-black transition-colors">
                Mark all as read
              </button>
            </div>
          </div>
        )}
      </div>
  );
};

export default NotificationsMenu;
