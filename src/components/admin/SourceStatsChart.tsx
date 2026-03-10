"use client";

import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calendar, ChevronDown } from "lucide-react";

export type ChartPeriod = 'Monthly' | 'Quarterly' | 'Annually';

interface SourceStatsChartProps {
  data: {
    name: string;
    youtube: number;
    x: number;
    whatsapp: number;
    facebook: number;
    Direct: number;
  }[];
  onPeriodChange: (period: ChartPeriod) => void;
  activePeriod: ChartPeriod;
}

const SourceStatsChart = ({ data, onPeriodChange, activePeriod }: SourceStatsChartProps) => {
  const getDateRangeLabel = () => {
    if (activePeriod === 'Monthly') return "Sep 2025 to Mar 2026";
    if (activePeriod === 'Quarterly') return "2024 to 2026";
    return "2021 to 2026";
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-zinc-100 text-lg font-bold special-font tracking-tight">Source Statistics</h3>
          <p className="text-zinc-500 text-xs font-medium mt-1">Acquisition sources comparison filtered by {activePeriod.toLowerCase()}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1">
            {(['Monthly', 'Quarterly', 'Annually'] as ChartPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  activePeriod === p 
                    ? "bg-zinc-800 text-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-100 text-[10px] font-bold hover:bg-zinc-900 transition-colors">
            <Calendar size={14} className="text-zinc-500" />
            <span>{getDateRangeLabel()}</span>
            <ChevronDown size={14} className="text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.length === 0 ? [
            { name: "Start", youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 },
            { name: "End", youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 }
          ] : data}>
              <defs>
                <linearGradient id="colorYoutube" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 600, color: '#a1a1aa' }}
              />
              <Area
                type="monotone"
                dataKey="youtube"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorYoutube)"
              />
              <Area
                type="monotone"
                dataKey="x"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorX)"
              />
               <Area
                type="monotone"
                dataKey="whatsapp"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWhatsapp)"
              />
               <Area
                type="monotone"
                dataKey="Direct"
                stroke="#71717a"
                strokeWidth={1}
                strokeDasharray="5 5"
                fill="none"
              />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SourceStatsChart;
