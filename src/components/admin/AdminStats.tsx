import React from "react";
import { Users, ShieldCheck, TrendingUp, Github, Share2 } from "lucide-react";

interface AdminStatsProps {
  stats: {
    total: number;
    views: number;
    recent: number;
    topSource: string;
  } | null;
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const cards = [
    {
      label: "Total Signups",
      value: stats ? formatNumber(stats.total) : "...",
      trend: "+12%",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Git Commits/Week",
      value: stats ? formatNumber(stats.recent) : "...",
      trend: "+5%",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Waitlist Page Views",
      value: stats ? formatNumber(stats.views) : "...",
      trend: "+18%",
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Top Acquisition Source",
      value: stats ? (stats.topSource || "Direct") : "...",
      trend: null,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      isString: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
      {cards.map((card, i) => {
        return (
          <div
            key={i}
            className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/60 p-6 rounded-2xl hover:border-zinc-700/50 transition-colors group relative overflow-hidden"
          >
            <p className="text-zinc-400 text-sm font-semibold special-font tracking-wider mb-2">{card.label}</p>
            
            <div className="flex items-baseline gap-3">
              <h3 className={`text-zinc-100 ${card.isString ? 'text-lg' : 'text-3xl'} font-bold tracking-tight truncate`}>
                {card.value}
              </h3>
              
              {card.trend && (
                <div className="flex items-center gap-1.5 min-w-fit">
                  <span className={`text-[10px] font-medium ${card.color} ${card.bg} px-1.5 py-0.5 rounded-full`}>
                    {card.trend}
                  </span>
                  <span className="text-zinc-500 text-[10px] hidden xl:inline">vs last week</span>
                </div>
              )}
            </div>

            {/* Subtle bottom gradient for depth */}
            <div className={`absolute bottom-0 left-0 w-full h-[2px] ${card.bg.replace('/10', '/30')}`} />
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
