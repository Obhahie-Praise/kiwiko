"use client";
import { notifications } from "@/constants";
import { Bell } from "lucide-react";
import { useState } from "react";
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
  return (
      <div className="relative p-1.5 bg-zinc-200 text-zinc-700 rounded-full cursor-pointer scroll-mod" onClick={() => {
        setIsOpen(!isOpen)
      }}>
        <Bell width={15} height={15} className="" />
        <div className="absolute h-2 w-2 bg-red-500 -top-0.5 -right-0.5 rounded-full" />
      
      <div className={`z-1 w-90 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden absolute -left-91 ${isOpen ? "block" : "hidden"}`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-200">
          <h3 className="text-sm font-semibold text-zinc-900">Notifications</h3>
        </div>

        {/* List */}
        <ul className="max-h-90 overflow-y-auto p-1 space-y-0.5">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.icon];

            return (
              <li
                key={notification.id}
                className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-zinc-200 rounded-xl
                ${
                  notification.seen
                    ? "bg-zinc-200 hover:bg-zinc-100"
                    : "bg-white hover:bg-zinc-50"
                }
              `}
              >
                {/* Icon */}
                <div className="mt-1">
                  <Icon className="w-4 h-4 text-zinc-800" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm ${
                        notification.seen
                          ? "font-semibold text-zinc-900"
                          : "font-medium text-zinc-900"
                      }`}
                    >
                      {notification.title}
                    </p>

                    {notification.seen && (
                      <span className="w-2 h-2 rounded-full bg-black" />
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>

                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    {notification.createdAt}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-200 text-center">
          <button className="text-xs font-medium text-zinc-800 hover:underline">
            View all notifications
          </button>
        </div>
        </div>
      </div>
  );
};

export default NotificationsMenu;
