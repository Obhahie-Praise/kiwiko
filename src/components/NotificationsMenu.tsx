"use client";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getNotificationsAction, markNotificationAsReadAction } from "@/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";

const NotificationsMenu = ({ projectId }: { projectId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen) return; // Fetch when opening or periodically
    const fetchNotifications = async () => {
      const res = await getNotificationsAction(projectId || "");
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    };
    fetchNotifications();
  }, [isOpen, projectId]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsReadAction(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg relative transition-colors ${
          isOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-700"
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
            <span className="font-semibold text-zinc-700">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {/* List */}
          <ul className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-zinc-500 text-sm">
                No new notifications
              </li>
            ) : null}
            {notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => handleMarkAsRead(n.id)}
                className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-zinc-50 transition-colors ${
                  !n.read ? "bg-zinc-50/80" : ""
                }`}
              >
                {!n.read && (
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                )}
                <div className={`flex-1 min-w-0 ${n.read ? "pl-[18px]" : ""}`}>
                  <p className={`text-sm leading-snug ${n.read ? "text-zinc-500" : "font-semibold text-zinc-800"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-semibold">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-100">
            <button className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
