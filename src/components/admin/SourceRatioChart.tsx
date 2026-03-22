"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreVertical } from "lucide-react";

interface SourceRatioChartProps {
  data: { name: string, value: number }[];
}

const COLORS = ["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"];

const SourceRatioChart = ({ data }: SourceRatioChartProps) => {
  const hasData = data && data.length > 0 && data.some(entry => entry.value > 0);
  const chartData = hasData ? data : [
    { name: "Desktop", value: 1 },
    { name: "Mobile", value: 1 },
    { name: "Tablet", value: 1 }
  ];

  return (
    <div className="bg-[#12141c] border border-white/5 p-8 rounded-[2rem] h-full flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white text-xl font-bold tracking-tight font-sans">Sessions By Device</h3>
        <button className="text-zinc-600 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-[250px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              nameKey="name"
              stroke="none"
              animationDuration={1500}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: "#1a1c26", 
                border: "none", 
                borderRadius: "16px", 
                color: "#fff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)" 
              }}
              formatter={(value: any, name: any) => [hasData ? value : "0", name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-8 font-sans">
        {(hasData ? data : chartData).map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <span className="text-zinc-400 text-sm font-medium">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceRatioChart;
