"use client";

import { useState } from "react";
import {
  Bell,
  Rocket,
  CheckCircle,
  Sparkles,
  Twitter,
  Linkedin,
  Github,
  Mail,
  MessageSquare,
  Calendar,
  UserPlus,
  Users,
  Target
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { markNotificationAsReadAction } from "@/actions/notification.actions";

type IconKey =
  | "startup_success"
  | "internal_activity"
  | "internal_completion"
  | "twitter"
  | "linkedin"
  | "github"
  | "email"
  | "chat"
  | "calendar"
  | "calendar_reminder"
  | "invite"
  | "commit";

const iconMap: Record<string, any> = {
  startup_success: Sparkles,
  internal_activity: Rocket,
  internal_completion: CheckCircle,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  email: Mail,
  chat: MessageSquare,
  calendar: Calendar,
  calendar_reminder: Bell,
  invite: UserPlus,
  commit: Github,
  meeting: Users,
  milestone: Target,
  achievement: Sparkles,
};

export default function NotificationsPage({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    // Server update
    await markNotificationAsReadAction(id);
  };

  return (
    <div className="p-6 space-y-6 border-t-2 border-l-2 rounded-tl-2xl bg-zinc-50 min-h-screen">
      <div className="flex items-center justify-between">
              <Bell size={20} />

        <span className="text-sm text-zinc-500">
          {notifications.filter((n) => !n.read).length} unread
        </span>
      </div> 

      {/* LIST */}
      <div className="space-y-3">
        {notifications.map((n) => {
          // Fallback to Bell if type not explicitly mapped
          const Icon = iconMap[n.type] || Bell;

          return (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              disabled={n.read}
              className={`w-full text-left border rounded-2xl p-4 transition
              ${
                n.read
                  ? "bg-white border-zinc-200 cursor-default"
                  : "bg-zinc-100 border-black hover:shadow"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div
                  className={`p-2 rounded-xl
                  ${
                    n.read
                      ? "bg-zinc-200 text-zinc-500"
                      : "bg-black text-white"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className={`font-medium text-sm ${n.read ? "text-zinc-600" : "text-black"}`}>
                      {n.title}
                    </p>
                    <span className="text-xs text-zinc-500">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <p className={`text-sm mt-1 ${n.read ? "text-zinc-500" : "text-zinc-600"}`}>
                    {n.message}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-zinc-500 text-sm">
            You have no notifications.
          </div>
        )}
      </div>
    </div>
  );
}
