"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical } from "lucide-react";

interface PageViewsChartProps {
  data: { date: string, views: number }[];
}

const PageViewsChart = ({ data }: PageViewsChartProps) => {
  // Calculate stats securely
  const total = data && data.length > 0 ? data.reduce((acc, curr) => acc + curr.views, 0) : 0;
  const count = data && data.length > 0 ? data.length : 1;
  
  const avgDaily = Math.round(total / count);
  const avgWeekly = Math.round(total / (count / 7 || 1));
  const avgMonthly = total; // Assuming total is for 30 days

  const formatNumber = (num: number) => {
    if (isNaN(num)) return "0";
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    return num.toString();
  };

  return (
    <div className="bg-[#12141c] border border-white/5 p-8 rounded-[2rem] h-full flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-white text-xl font-bold tracking-tight font-sans">Active Users</h3>
        <button className="text-zinc-600 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-white text-4xl font-bold tracking-tighter font-sans">
            {formatNumber(data && data.length > 0 ? data[data.length - 1].views : 0)}
          </span>
          <span className="text-zinc-400 text-base font-medium font-sans">Live visitors</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px] mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis 
              dataKey="date" 
              hide={true}
            />
            <YAxis hide={true} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#1a1c26", 
                border: "1px solid rgba(255,255,255,0.05)", 
                borderRadius: "16px", 
                color: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
              }}
              itemStyle={{ color: "#3b82f6" }}
              cursor={{ stroke: '#3b82f633', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#3b82f6"
              strokeWidth={4}
              strokeLinecap="round"
              fillOpacity={1}
              fill="url(#colorViews)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-0 mt-auto pt-8 border-t border-white/5">
        <div className="flex flex-col items-center">
          <p className="text-white text-2xl font-bold font-sans mb-1">{formatNumber(avgDaily)}</p>
          <p className="text-zinc-500 text-[11px] font-semibold font-sans tracking-wide">Avg, Daily</p>
        </div>
        <div className="flex flex-col items-center border-x border-white/5">
          <p className="text-white text-2xl font-bold font-sans mb-1">{formatNumber(avgWeekly)}</p>
          <p className="text-zinc-500 text-[11px] font-semibold font-sans tracking-wide">Avg, Weekly</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-white text-2xl font-bold font-sans mb-1">{formatNumber(avgMonthly)}</p>
          <p className="text-zinc-500 text-[11px] font-semibold font-sans tracking-wide">Avg, Monthly</p>
        </div>
      </div>
    </div>
  );
};

export default PageViewsChart;
