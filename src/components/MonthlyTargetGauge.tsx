"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { MoreVertical, TrendingUp, TrendingDown } from "lucide-react";

const gaugeData = [
  { value: 85.33 },
  { value: 14.67 },
];

const COLORS = ["#000", "#f4f4f5"];

export function MonthlyTargetGauge() {
  const raised = 128000;
  const target = 150000;
  
  return (
    <div className="bg-white border-[0.2px] border-zinc-200 rounded-3xl overflow-hidden shadow-none flex flex-col min-h-[450px]">
      <div className="p-8 pb-4">
        <div className="flex items-start justify-between mb-2">
            <div>
                <h3 className="text-xl font-semibold text-zinc-900 hero-font tracking-tight">Monthly Target</h3>
                <p className="text-sm text-zinc-500 font-medium mt-1">Funding goal for current period</p>
            </div>
            <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <MoreVertical size={20} />
            </button>
        </div>

        <div className="relative h-[160px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={95}
                        outerRadius={100}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    >
                        {gaugeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? "#000" : "#f4f4f5"} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-center flex flex-col items-center">
                <span className="text-3xl font-bold text-zinc-900 tracking-tight">85.33%</span>
                <div className="mt-2 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    +12%
                </div>
            </div>
        </div>

        <div className="text-center px-4 mt-7 mb-8">
            <p className="text-sm text-zinc-600 font-medium leading-relaxed">
                You've raised <span className="text-zinc-900 font-bold">$128,000</span> this round. 
                <br />Almost at your goal!
            </p>
        </div>
      </div>

      <div className="mt-auto bg-zinc-50/80 border-t border-zinc-100 p-6 flex items-center justify-between">
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target</span>
            <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-zinc-900">$150K</span>
                <TrendingUp size={14} className="text-emerald-500" />
            </div>
        </div>
        <div className="w-px h-8 bg-zinc-200"></div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Revenue</span>
            <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-zinc-900">$128K</span>
                <TrendingUp size={14} className="text-emerald-500" />
            </div>
        </div>
        <div className="w-px h-8 bg-zinc-200"></div>
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Left</span>
            <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-zinc-900">$22K</span>
                <TrendingDown size={14} className="text-red-500" />
            </div>
        </div>
      </div>
    </div>
  );
}
