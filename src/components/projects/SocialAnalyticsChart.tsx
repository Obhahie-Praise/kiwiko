"use client";

import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Filter } from "lucide-react";

interface SocialAnalyticsChartProps {
  projectId?: string;
}

type TimeRange = "Weekly" | "Monthly" | "Quarterly" | "Annually";
type Platform = "All" | "X" | "Facebook" | "YouTube";
type MetricType = "Views" | "Uploads (Likes)" | "Uploads (Comments)" | "Uploads (Subs/Followers)";

// Mock data generator for smooth area charts
const generateMockData = (range: TimeRange, metric: MetricType, platform: Platform) => {
  const data = [];
  
  let points = 12;
  let labels: string[] = [];

  if (range === "Weekly") {
    points = 52;
    labels = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
  } else if (range === "Monthly") {
    points = 12;
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  } else if (range === "Quarterly") {
    points = 4;
    labels = ["Q1", "Q2", "Q3", "Q4"];
  } else if (range === "Annually") {
    points = 4;
    labels = ["Year 1", "Year 2", "Year 3", "Year 4+"];
  }
  
  let baseValue = metric === "Views" ? 15000 : metric === "Uploads (Likes)" ? 500 : 200;

  for (let i = 0; i < points; i++) {
    const xVariation = Math.sin(i * 0.5) * (baseValue / 10) + Math.random() * (baseValue / 20);
    const fbVariation = Math.cos(i * 0.5) * (baseValue / 20) + Math.random() * (baseValue / 40);
    const ytVariation = Math.sin(i * 1.2) * (baseValue / 15) + Math.random() * (baseValue / 30);
    
    data.push({
      label: labels[i],
      X: platform === "All" || platform === "X" ? Math.max(0, Math.floor(baseValue + xVariation + (i * 100))) : 0,
      Facebook: platform === "All" || platform === "Facebook" ? Math.max(0, Math.floor((baseValue / 1.5) + fbVariation + (i * 50))) : 0,
      YouTube: platform === "All" || platform === "YouTube" ? Math.max(0, Math.floor((baseValue / 1.2) + ytVariation + (i * 80))) : 0,
    });
  }
  return data;
};

const SocialAnalyticsChart = ({ projectId }: SocialAnalyticsChartProps) => {
  const [range, setRange] = useState<TimeRange>("Monthly");
  const [platform, setPlatform] = useState<Platform>("All");
  const [metric, setMetric] = useState<MetricType>("Views");

  const data = useMemo(() => generateMockData(range, metric, platform), [range, metric, platform]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border-[0.2px] border-zinc-200 rounded-xl min-w-[120px]">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1 border-b border-zinc-50 pb-1 last:border-0 last:pb-0">
                <span className="text-xs text-zinc-600 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    {entry.name}
                </span>
                <span className="text-sm font-bold text-zinc-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-[0.2px] border-zinc-200 shadow-sm rounded-2xl p-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 hero-font tracking-tight">Social Media Statistics</h3>
          <p className="text-sm text-zinc-500 font-medium mt-1">
            All time stats for each {range === "Annually" ? "month" : range === "Quarterly" ? "week" : "day"}
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
             <div className="flex items-center bg-zinc-50 p-1 rounded-xl border border-zinc-100 w-fit">
               {(["All", "X", "Facebook", "YouTube"] as Platform[]).map((p) => (
                 <button
                   key={p}
                   onClick={() => setPlatform(p)}
                   className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                     platform === p
                       ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                       : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                   }`}
                 >
                   {p}
                 </button>
               ))}
             </div>
             
             <div className="flex items-center bg-zinc-50 rounded-xl border border-zinc-100 px-2 py-1 w-fit">
                <Filter size={14} className="text-zinc-400 mr-2" />
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as MetricType)}
                  className="bg-transparent text-xs font-semibold text-zinc-700 outline-none cursor-pointer pr-2 appearance-none"
                >
                  <option value="Views">Views</option>
                  <option value="Uploads (Likes)">Uploads (Likes)</option>
                  <option value="Uploads (Comments)">Uploads (Comments)</option>
                  <option value="Uploads (Subs/Followers)">Uploads (Subs/Followers)</option>
                </select>
             </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-zinc-50 p-1 rounded-xl border border-zinc-200 shadow-sm">
            {(["Weekly", "Monthly", "Quarterly", "Annually"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  range === r
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-xl text-xs font-semibold text-zinc-700 shadow-sm transition-colors">
            <Calendar size={14} className="text-zinc-500" />
            <span>
              {range === "Weekly" ? "All Time (52 Weeks)" : 
               range === "Monthly" ? "All Time (12 Months)" : 
               range === "Quarterly" ? "All Time (4 Quarters)" : 
               "All Time (4+ Years)"}
            </span>
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-[300px] w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#000000" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1877F2" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorYouTube" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF0000" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f4f4f5" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
              dy={15}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e4e4e7', strokeWidth: 1, strokeDasharray: '3 3', fill: 'transparent' }} />
            {(platform === "All" || platform === "X") && (
              <Area
                type="monotone"
                dataKey="X"
                stroke="#000000"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorX)"
                activeDot={{ r: 6, fill: "#000000", stroke: "#fff", strokeWidth: 2 }}
              />
            )}
            {(platform === "All" || platform === "Facebook") && (
              <Area
                type="monotone"
                dataKey="Facebook"
                stroke="#1877F2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFacebook)"
                activeDot={{ r: 6, fill: "#1877F2", stroke: "#fff", strokeWidth: 2 }}
              />
            )}
            {(platform === "All" || platform === "YouTube") && (
               <Area
                type="monotone"
                dataKey="YouTube"
                stroke="#FF0000"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorYouTube)"
                activeDot={{ r: 6, fill: "#FF0000", stroke: "#fff", strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SocialAnalyticsChart;
