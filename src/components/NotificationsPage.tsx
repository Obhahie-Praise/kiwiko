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
  Target,
  FileText,
  AlertTriangle,
  Zap,
  Activity,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { markNotificationAsReadAction } from "@/actions/notification.actions";

type NotificationType = 
  | "WELCOME"
  | "POLICY"
  | "git_commit"
  | "email_received"
  | "email_sent"
  | "invite"
  | "invite_accepted"
  | "milestone"
  | string;

const iconMap: Record<string, any> = {
  WELCOME: Sparkles,
  POLICY: ShieldCheck,
  git_commit: Github,
  email_received: Mail,
  email_sent: MessageSquare,
  invite: UserPlus,
  invite_accepted: CheckCircle,
  milestone: Target,
  achievement: Zap,
  announcement: Bell,
  meeting: Users,
  calendar_event: Calendar,
  project_update: Sparkles,
  event_created: Activity,
};

const typeColors: Record<string, string> = {
  WELCOME: "bg-amber-50 text-amber-600 border-amber-100",
  POLICY: "bg-blue-50 text-blue-600 border-blue-100",
  git_commit: "bg-zinc-50 text-zinc-600 border-zinc-100",
  email_received: "bg-emerald-50 text-emerald-600 border-emerald-100",
  email_sent: "bg-zinc-50 text-zinc-600 border-zinc-100",
  invite_accepted: "bg-indigo-50 text-indigo-600 border-indigo-100",
  meeting: "bg-sky-50 text-sky-600 border-sky-100",
  calendar_event: "bg-zinc-50 text-zinc-600 border-zinc-100",
  project_update: "bg-violet-50 text-violet-600 border-violet-100",
  milestone: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
  achievement: "bg-amber-50 text-amber-600 border-amber-100",
  event_created: "bg-orange-50 text-orange-600 border-orange-100",
};

export default function NotificationsPage({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.read);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    await markNotificationAsReadAction(id);
  };

  const markAllAsRead = async () => {
       const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
       if (unreadIds.length === 0) return;

       setNotifications(prev => prev.map(n => ({...n, read: true})));
       
       // Bulk update logic or sequential for now
       await Promise.all(unreadIds.map(id => markNotificationAsReadAction(id)));
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-semibold special-font tracking-wide">Notifications</h1>
          <p className="text-zinc-500 text-sm font-medium">See your activity and alerts.</p>
        </div>
        
        <div className="flex items-center gap-1 bg-zinc-100 p-px rounded-xl w-fit">
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("unread")}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${filter === "unread" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>
      </div>

      {notifications.length > 0 && notifications.some(n => !n.read) && filter === 'all' && (
           <div className="mb-4 flex justify-end">
                <button 
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-all border border-transparent hover:border-zinc-200"
                >
                    <Check size={14} />
                    Mark all as read
                </button>
           </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => {
            const Icon = iconMap[n.type] || Bell || (() => <div />);
            const colors = typeColors[n.type] || "bg-zinc-50 text-zinc-600 border-zinc-100";
            let date = new Date();
            let isValidDate = false;
            try {
              date = new Date(n.createdAt);
              isValidDate = !isNaN(date.getTime());
            } catch (e) {
              isValidDate = false;
            }

            return (
              <div
                key={n.id}
                className={`group relative overflow-hidden transition-all duration-300 rounded-2xl border ${
                  n.read
                    ? "bg-white border-zinc-200"
                    : "bg-white border-zinc-900/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                }`}
              >
                {!n.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900" />
                )}
                
                <div className="p-4 flex items-start gap-5">
                  {/* Icon Area */}
                  <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 shadow-sm mr-2 ${colors}`}>
                    <Icon size={16} />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className={`text-sm font-semibold tracking-wide special-font transition-colors ${n.read ? "text-zinc-700" : "text-zinc-900"}`}>
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-3 shrink-0">
                        <span suppressHydrationWarning className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">
                          <Clock size={12} className="mr-1" />
                          {isValidDate ? formatDistanceToNow(date, { addSuffix: false }) : "Recently"}
                        </span>
                        {!n.read && (
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="bg-zinc-900 text-white p-1.2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                            title="Mark as read"
                          >
                            <Check size={12} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-3 ${n.read ? "text-zinc-400" : "text-zinc-600 font-medium"}`}>
                      {n.message}
                    </p>

                    {/* Metadata / Actions if any */}
                    {n.metadata && typeof n.metadata === 'object' && Object.keys(n.metadata).length > 0 && n.metadata.url && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            <a 
                                href={n.metadata.url} 
                                target="_blank" 
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lx bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                View Details
                                <ExternalLink size={10} />
                            </a>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-zinc-100">
                <Bell size={32} className="text-zinc-200" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2 special-font">All clear!</h3>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              {filter === 'unread' ? "You've caught up with everything. There are no unread notifications." : "Your inbox is empty. We'll notify you when something important happens."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
