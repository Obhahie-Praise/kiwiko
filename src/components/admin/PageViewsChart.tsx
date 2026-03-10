"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical } from "lucide-react";

interface PageViewsChartProps {
  data: { date: string, views: number }[];
}

const PageViewsChart = ({ data }: PageViewsChartProps) => {
  // Calculate stats
  const total = data.reduce((acc, curr) => acc + curr.views, 0);
  const avgDaily = Math.round(total / data.length);
  const avgWeekly = Math.round(total / (data.length / 7));
  const avgMonthly = total; // Mocking monthly as total for 30 days

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-zinc-100 text-lg font-bold special-font tracking-tight">Page Views</h3>
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-zinc-100 text-2xl font-bold tracking-tight">
          {formatNumber(data[data.length - 1]?.views || 0)}
        </span>
        <span className="text-zinc-500 text-sm font-medium">Daily visitors</span>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }}
              itemStyle={{ color: "#f97316" }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#f97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800/50">
        <div className="text-center">
          <p className="text-zinc-100 text-lg font-bold">{formatNumber(avgDaily)}</p>
          <p className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Avg. Daily</p>
        </div>
        <div className="text-center border-x border-zinc-800/50">
          <p className="text-zinc-100 text-lg font-bold">{formatNumber(avgWeekly)}</p>
          <p className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Avg. Weekly</p>
        </div>
        <div className="text-center">
          <p className="text-zinc-100 text-lg font-bold">{formatNumber(avgMonthly)}</p>
          <p className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">Avg. Monthly</p>
        </div>
      </div>
    </div>
  );
};

export default PageViewsChart;
