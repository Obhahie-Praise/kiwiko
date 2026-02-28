"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  ArrowRight, 
  Mail, 
  Users, 
  GitCommit, 
  Globe, 
  ChevronDown,
  Calendar,
  MessageSquare,
  Bell,
  Target,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import { getNotificationsAction } from "@/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";

import { useProjectSlugs } from "@/hooks/useProjectSlugs";

export default function RecentActivityTable() {
  const { orgSlug, projectSlug } = useProjectSlugs();
  const [filter, setFilter] = useState<string>("Most Recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const contextRes = await getProjectHomeDataAction(orgSlug, projectSlug);
    if (contextRes.success) {
      const notifRes = await getNotificationsAction(contextRes.data.project.id);
      if (notifRes.success && notifRes.data) {
        setActivities(notifRes.data);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen for custom refresh events
    const handleRefresh = () => {
      loadData();
    };

    window.addEventListener("refresh-activities", handleRefresh);
    return () => window.removeEventListener("refresh-activities", handleRefresh);
  }, [orgSlug, projectSlug]);

  const filteredActivities = activities.filter((item) => {
    const itemType = item.type;
    const itemMetadataCat = item.metadata?.category?.toLowerCase();

    if (filter === "Most Recent") return true;
    
    // Mapping logic
    if (filter === "Meetings") {
      // If the user wants meetings under "Emails", this filter might be redundant, 
      // but let's keep it for items specifically typed as meeting if they aren't metadata-categorized.
      return itemType === "meeting" && itemMetadataCat !== "meeting";
    }
    if (filter === "Milestones") return itemType === "milestone" || itemMetadataCat === "milestone";
    if (filter === "Achievements") return itemType === "achievement" || itemMetadataCat === "achievement";
    if (filter === "External Activity") return itemType === "git_commit";
    if (filter === "Emails") {
      return itemType === "email_received" || 
             itemType === "email_sent" || 
             itemType === "email" || 
             itemMetadataCat === "meeting" || 
             itemMetadataCat === "email";
    }
    if (filter === "Team") return itemType.startsWith("invite") || itemMetadataCat === "team";
    if (filter === "Chat") return itemType === "chat_message";
    return true;
  });

  const getIconForType = (type: string, item?: any) => {
    const itemMetadataCat = item?.metadata?.category?.toLowerCase();
    
    if (itemMetadataCat === "meeting" || itemMetadataCat === "email") return Mail;
    if (itemMetadataCat === "team") return Users;
    if (itemMetadataCat === "milestone") return Target;
    if (itemMetadataCat === "achievement") return Sparkles;

    switch (type) {
      case "git_commit": return GitCommit;
      case "email_received": 
      case "email_sent": 
      case "email": return Mail;
      case "invite_sent":
      case "invite_accepted": return Users;
      case "chat_message": return MessageSquare;
      case "meeting": return Users; // Default for non-metadata meeting
      case "milestone": return Target;
      case "achievement": return Sparkles;
      case "calendar_event":
      case "calendar_reminder": return Users;
      default: return Bell;
    }
  };

  const getCategoryForType = (item: any) => {
    const { type, metadata } = item;
    const cat = metadata?.category?.toLowerCase();
    
    if (cat === "meeting" || cat === "email") return "Email";
    if (cat === "team") return "Team";
    if (cat) return cat.charAt(0).toUpperCase() + cat.slice(1);

    switch (type) {
      case "git_commit": return "External";
      case "email":
      case "email_received": 
      case "email_sent": return "Email";
      case "invite_sent":
      case "invite_accepted": return "Team";
      case "chat_message": return "Chat";
      case "meeting": return "Meeting";
      case "milestone": return "Milestone";
      case "achievement": return "Achievement";
      case "calendar_event":
      case "calendar_reminder": return "Calendar";
      default: return "System";
    }
  };

  const getStatusColor = (item: any) => {
    const { type, metadata } = item;
    const isReminder = (metadata as any)?.isReminder;
    const threshold = (metadata as any)?.threshold;
    const cat = metadata?.category?.toLowerCase();

    if (isReminder) {
      if (threshold === "ended") return "bg-zinc-100 text-zinc-500";
      if (threshold === "now") return "bg-red-50 text-red-600 animate-pulse";
      return "bg-blue-50 text-blue-600";
    }

    if (cat === "meeting" || cat === "email" || type === "email" || type === "email_received" || type === "email_sent") {
        return "bg-emerald-50 text-emerald-600";
    }

    switch (type) {
      case "milestone": return "bg-amber-50 text-amber-600";
      case "achievement": return "bg-purple-50 text-purple-600";
      case "meeting": return "bg-zinc-50 text-zinc-600";
      case "git_commit": return "bg-blue-50 text-blue-600";
      default: return "bg-zinc-50 text-zinc-600";
    }
  };
   
  const getStatusLabel = (item: any) => {
    const { type, metadata } = item;
    const isReminder = (metadata as any)?.isReminder;
    const threshold = (metadata as any)?.threshold;
    const cat = metadata?.category?.toLowerCase();

    if (isReminder) {
      switch (threshold) {
        case "24h": return "starting in 24h";
        case "12h": return "starting in 12h";
        case "1h": return "starting in 1h";
        case "5m": return "starting in 5m";
        case "now": return "live now";
        case "ended": return "ended";
        default: return "upcoming";
      }
    }

    if (cat === "meeting" || cat === "email" || type === "email" || type === "email_received" || type === "email_sent") {
        return "delivered";
    }

    switch (type) {
      case "milestone": return "pending";
      case "achievement": return "unlocked";
      case "meeting": return "scheduled";
      case "git_commit": return "completed";
      default: return "completed";
    }
  };

  const handleFilterSelect = (newFilter: string) => {
    setFilter(newFilter);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white border-[0.2px] border-zinc-200 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-semibold text-zinc-900 hero-font">Recent Activity</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {filter}
              <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="py-1">
                  {["Most Recent", "Meetings", "Milestones", "Achievements", "External Activity", "Emails", "Team", "Chat"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(option)}
                      className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Link 
            href={`/${orgSlug}/${projectSlug}/notifications`}
            className="px-4 py-1.5 border border-zinc-200 rounded-lg text-sm font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
          >
            See all
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 pb-4">
              <th className="text-xs tracking-wider font-medium text-zinc-600 pb-4">Activity</th>
              <th className="text-xs tracking-wider font-medium text-zinc-600 pb-4">Category</th>
              <th className="text-xs tracking-wider font-medium text-zinc-600 pb-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {loading ? (
              <tr>
                <td colSpan={3} className="py-12 text-center text-zinc-400 italic text-sm">
                  Loading activities...
                </td>
              </tr>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map((item) => {
                const ActivityIcon = getIconForType(item.type);
                return (
                  <tr key={item.id} className="group hover:bg-zinc-50 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-zinc-100 rounded-xl group-hover:bg-white transition-colors">
                          <ActivityIcon className="w-5 h-5 text-zinc-600" />
                        </div>
                        <p className="text-[15px] text-zinc-900 hero-font">
                          {item.title}
                        </p>
                      </div>
                    </td>
                     <td className="py-4">
                      <div className="flex items-center gap-2">
                         <span className="text-sm text-zinc-600">{getCategoryForType(item)}</span>
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getStatusColor(item)}`}>
                           {getStatusLabel(item)}
                         </span>
                      </div>
                    </td>
                    <td className="py-4 text-right text-xs text-zinc-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-zinc-400 italic text-sm">
                  No activities found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
