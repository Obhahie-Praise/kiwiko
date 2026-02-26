"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Search, 
  Filter, 
  ArrowRight, 
  Mail, 
  Users, 
  GitCommit, 
  Globe, 
  ChevronDown 
} from "lucide-react";
import Link from "next/link";

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  type: "external" | "email" | "team" | "system";
  timestamp: string;
  icon: any;
  status: "delivered" | "pending" | "canceled" | "completed";
}

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    title: "New Git Commit: 'Refactor auth logic'",
    category: "External",
    type: "external",
    timestamp: "2 hours ago",
    icon: GitCommit,
    status: "completed",
  },
  {
    id: "2",
    title: "Email received from investor@jpmorgan.com",
    category: "Email",
    type: "email",
    timestamp: "5 hours ago",
    icon: Mail,
    status: "delivered",
  },
  {
    id: "3",
    title: "New team member: Sarah Chen joined as Designer",
    category: "Team",
    type: "team",
    timestamp: "1 day ago",
    icon: Users,
    status: "completed",
  },
  {
    id: "4",
    title: "Weekly report generated",
    category: "System",
    type: "system",
    timestamp: "2 days ago",
    icon: Globe,
    status: "completed",
  },
  {
    id: "5",
    title: "X post: 'Launch update' is trending",
    category: "External",
    type: "external",
    timestamp: "3 days ago",
    icon: Activity,
    status: "pending",
  },
  {
    id: "6",
    title: "Follow-up email sent to Sequoia Capital",
    category: "Email",
    type: "email",
    timestamp: "4 days ago",
    icon: Mail,
    status: "delivered",
  },
  {
    id: "7",
    title: "Meeting scheduled: Q2 Roadmap",
    category: "Team",
    type: "team",
    timestamp: "5 days ago",
    icon: Users,
    status: "pending",
  },
];

export default function RecentActivityTable({ 
  orgSlug, 
  projectSlug 
}: { 
  orgSlug: string; 
  projectSlug: string; 
}) {
  const [filter, setFilter] = useState<string>("Most Recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredActivities = mockActivities.filter((item) => {
    if (filter === "Most Recent") return true;
    if (filter === "External Activity") return item.type === "external";
    if (filter === "Emails") return item.type === "email";
    if (filter === "Team") return item.type === "team";
    return true;
  }).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-emerald-50 text-emerald-600";
      case "pending": return "bg-amber-50 text-amber-600";
      case "canceled": return "bg-red-50 text-red-600";
      case "completed": return "bg-blue-50 text-blue-600";
      default: return "bg-zinc-50 text-zinc-600";
    }
  };

  const handleFilterSelect = (newFilter: string) => {
    setFilter(newFilter);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 h-full">
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
                  {["Most Recent", "External Activity", "Emails", "Team"].map((option) => (
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
              <th className="text-xs tracking-wider font-medium text-zinc-600 pb-4">Category</th>
              <th className="text-xs tracking-wider font-medium text-zinc-600 pb-4">Activity</th>
              <th className="text-xs tracking-wider font-medium text-zinc-600 pb-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((item) => (
                <tr key={item.id} className="group hover:bg-zinc-50 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-zinc-100 rounded-xl group-hover:bg-white transition-colors">
                        <item.icon className="w-5 h-5 text-zinc-600" />
                      </div>
                      <p className="text-[15px] text-zinc-900 hero-font">
                        {item.title}
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-sm text-zinc-600">{item.category}</span>
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${getStatusColor(item.status)}`}>
                         {item.status}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 text-right text-xs text-zinc-500 whitespace-nowrap">
                    {item.timestamp}
                  </td>
                </tr>
              ))
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
