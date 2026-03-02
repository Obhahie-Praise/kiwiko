"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateData = (count: number, startValue: number, volatility: number, labelPrefix: string = "") => {
  let current = startValue;
  return Array.from({ length: count }, (_, i) => {
    // Increase volatility and add occasional "shocks"
    const change = (Math.random() - 0.5) * volatility * (Math.random() > 0.8 ? 2.5 : 1);
    current += change;
    // ensure value doesn't go below a reasonable floor for funding
    current = Math.max(current, startValue * 0.5); 
    return {
      name: labelPrefix ? `${labelPrefix} ${i + 1}` : `${i + 1}`,
      value: Math.round(current)
    };
  });
};

const dataSets = {
  Monthly: generateData(30, 3100, 200, "Mar"),
  Quarterly: generateData(90, 12000, 800, "Day"),
  Annually: [
    { name: "Jan", value: 45000 }, { name: "Feb", value: 52000 },
    { name: "Mar", value: 48000 }, { name: "Apr", value: 61000 },
    { name: "May", value: 55000 }, { name: "Jun", value: 72000 },
    { name: "Jul", value: 68000 }, { name: "Aug", value: 85000 },
    { name: "Sep", value: 79000 }, { name: "Oct", value: 92000 },
    { name: "Nov", value: 88000 }, { name: "Dec", value: 105000 },
  ],
};

export function PortfolioPerformanceChart() {
  const [activeRange, setActiveRange] = useState<keyof typeof dataSets>("Monthly");
  const data = dataSets[activeRange];

  return (
    <div className="bg-white border-[0.2px] border-zinc-200 rounded-3xl p-8 shadow-none flex flex-col min-h-[450px]">
      <div className="flex items-start justify-between mb-10">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 hero-font tracking-tight">Portfolio Performance</h3>
          <p className="text-sm text-zinc-500 font-medium mt-1">Tracks funds wired into your account over time</p>
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 shadow-inner">
          {["Monthly", "Quarterly", "Annually"].map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range as keyof typeof dataSets)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeRange === range
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[350px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#000" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#000" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 9, fontWeight: 500 }}
              dy={10}
              interval={activeRange === "Monthly" ? 0 : activeRange === "Quarterly" ? 29 : 0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
              width={60}
            />
            <Tooltip
              formatter={(value: any) => {
                const numValue = Number(value || 0);
                return [`$${numValue.toLocaleString()}`, "Amount"];
              }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #e4e4e7",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
                fontWeight: "600",
              }}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="#000"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 4, fill: "#000", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
