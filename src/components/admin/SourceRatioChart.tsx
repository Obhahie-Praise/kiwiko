"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreVertical } from "lucide-react";

interface SourceRatioChartProps {
  data: { name: string, value: number }[];
}

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#71717a"];

const SourceRatioChart = ({ data }: SourceRatioChartProps) => {
  const hasData = data.some(entry => entry.value > 0);
  const chartData = hasData ? data : data.map(entry => ({ ...entry, renderValue: 1 }));

  return (
    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-zinc-100 text-lg font-bold special-font tracking-tight">Source Ratio</h3>
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={hasData ? "value" : "renderValue"}
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "12px", color: "#f4f4f5" }}
              formatter={(value: any, name: any, props: any) => [props.payload.value, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="text-zinc-400 text-xs font-medium capitalize">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceRatioChart;
