import React from "react";
import { Users, ShieldCheck, TrendingUp, Github, Share2 } from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    verified: number;
    views: number;
    recent: number; // Used for git commits
    topSource: string;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const cards = [
    {
      label: "Verified Signups",
      value: stats.verified,
      icon: ShieldCheck,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Git Commits/Week",
      value: stats.recent,
      icon: Github,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Waitlist Page Views",
      value: stats.views,
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Top Acquisition Source",
      value: stats.topSource,
      icon: Share2,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      isString: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}>
                <Icon className={`${card.color}`} size={20} />
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{card.label}</p>
            <h3 className={`text-zinc-100 ${card.isString ? 'text-xl' : 'text-3xl'} font-bold tracking-tight mt-1 capitalize`}>
              {card.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
