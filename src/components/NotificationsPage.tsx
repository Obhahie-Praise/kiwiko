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
} from "lucide-react";



type NotificationContext =
  | "startup_success"
  | "internal_activity"
  | "internal_completion"
  | "social";
type Notification = {
  id: string;
  context: NotificationContext;
  iconKey: IconKey;
  title: string;
  message: string;
  time: string;
  read: boolean;
};
type SocialIcon = "twitter" | "linkedin" | "github";
type IconKey =
  | "startup_success"
  | "internal_activity"
  | "internal_completion"
  | SocialIcon;

const iconMap: Record<IconKey, React.ElementType> = {
  startup_success: Sparkles,
  internal_activity: Rocket,
  internal_completion: CheckCircle,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
};

const initialNotifications = [
  {
    id: "n1",
    context: "startup_success",
    title: "Startup milestone reached",
    message:
      "PayNest just crossed ₦100,000,000 in total funds raised.",
    time: "30m ago",
    read: false,
    iconKey: "startup_success",
  },
  {
    id: "n2",
    context: "internal_activity",
    title: "Funding round created",
    message:
      "You started a new public funding round for Nova AI.",
    time: "1h ago",
    read: false,
    iconKey: "internal_activity",
  },
  {
    id: "n3",
    context: "social",
    title: "Mentioned on X",
    message:
      "Your startup was mentioned in a trending fintech thread on X.",
    time: "2h ago",
    read: false,
    iconKey: "twitter",
  },
  {
    id: "n4",
    context: "startup_success",
    title: "User growth spike",
    message:
      "EduSpark gained 3,200 new users this week.",
    time: "4h ago",
    read: true,
    iconKey: "startup_success",
  },
  {
    id: "n5",
    context: "internal_completion",
    title: "Onboarding completed",
    message:
      "You’ve successfully completed your startup onboarding.",
    time: "6h ago",
    read: true,
    iconKey: "internal_completion",
  },
  {
    id: "n6",
    context: "social",
    title: "LinkedIn engagement",
    message:
      "An investor reacted to your pitch post on LinkedIn.",
    time: "8h ago",
    read: false,
    iconKey: "linkedin",
  },
  {
    id: "n7",
    context: "internal_activity",
    title: "Funding goal updated",
    message:
      "You updated your funding goal to ₦50,000,000.",
    time: "10h ago",
    read: true,
    iconKey: "internal_activity",
  },
  {
    id: "n8",
    context: "startup_success",
    title: "Funding round closed",
    message:
      "AgroLink successfully closed their seed round.",
    time: "12h ago",
    read: true,
    iconKey: "startup_success",
  },
  {
    id: "n9",
    context: "social",
    title: "New GitHub star",
    message:
      "Your open-source repo just received 25 new stars.",
    time: "1d ago",
    read: true,
    iconKey: "github",
  },
  {
    id: "n10",
    context: "internal_completion",
    title: "Funding round ended",
    message:
      "Your public funding round has officially ended.",
    time: "1d ago",
    read: true,
    iconKey: "internal_completion",
  },
  {
    id: "n11",
    context: "startup_success",
    title: "Investor confidence",
    message:
      "HealthSync secured backing from two new angel investors.",
    time: "2d ago",
    read: true,
    iconKey: "startup_success",
  },
  {
    id: "n12",
    context: "internal_activity",
    title: "Profile updated",
    message:
      "You updated your startup description and pitch details.",
    time: "2d ago",
    read: true,
    iconKey: "internal_activity",
  },
  {
    id: "n13",
    context: "social",
    title: "Shared on LinkedIn",
    message:
      "Your startup was reshared by a VC on LinkedIn.",
    time: "3d ago",
    read: true,
    iconKey: "linkedin",
  },
  {
    id: "n14",
    context: "startup_success",
    title: "Revenue milestone",
    message:
      "ShopWave crossed ₦10,000,000 in monthly revenue.",
    time: "4d ago",
    read: true,
    iconKey: "startup_success",
  },
  {
    id: "n15",
    context: "internal_completion",
    title: "Verification approved",
    message:
      "Your startup has been successfully verified.",
    time: "5d ago",
    read: true,
    iconKey: "internal_completion",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
  initialNotifications
);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="p-6 space-y-6 border-t-2 border-l-2 rounded-tl-2xl bg-zinc-50 min-h-screen">
      {/* HEADER */}
      {/* 
        <h1 className="text-xl font-semibold flex items-center gap-2">
          Notifications
        </h1>
        */}
<div className="flex items-center justify-between">
              <Bell size={20} />

        <span className="text-sm text-zinc-500">
          {notifications.filter((n) => !n.read).length} unread
        </span>
      </div> 

      {/* LIST */}
      <div className="space-y-3">
        {notifications.map((n) => {
          const Icon = iconMap[n.iconKey];


          return (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`w-full text-left border rounded-2xl p-4 transition
              ${
                n.read
                  ? "bg-white"
                  : "bg-zinc-100 border-black"
              } hover:shadow`}
            >
              <div className="flex items-start gap-4">
                {/* ICON */}
                <div
                  className={`p-2 rounded-xl
                  ${
                    n.read
                      ? "bg-zinc-200"
                      : "bg-black text-white"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">
                      {n.title}
                    </p>
                    <span className="text-xs text-zinc-500">
                      {n.time}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-600 mt-1">
                    {n.message}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
