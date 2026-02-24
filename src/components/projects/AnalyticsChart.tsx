"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getProjectViewAnalyticsAction } from "@/actions/project.actions";
import { Loader2 } from "lucide-react";

interface AnalyticsChartProps {
  projectId: string;
}

type Range = "weekly" | "monthly" | "quarterly" | "yearly";

const AnalyticsChart = ({ projectId }: AnalyticsChartProps) => {
  const [range, setRange] = useState<Range>("monthly");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getProjectViewAnalyticsAction(projectId, range);
      if (res.success) {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, [projectId, range]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-zinc-200 shadow-xl rounded-xl">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">
            {range === "weekly" ? "Date" : range === "monthly" ? "Date" : range === "quarterly" ? "Week Starting" : "Month"}
          </p>
          <p className="text-sm font-bold text-zinc-900">{payload[0].value} Views</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Analytics</h3>
          <p className="text-sm text-zinc-500 font-medium">
            Visitor analytics of last {range === "weekly" ? "7 days" : range === "monthly" ? "30 days" : range === "quarterly" ? "3 months" : "year"}
          </p>
        </div>

        <div className="flex items-center bg-zinc-50 p-1 rounded-xl border border-zinc-100">
          {(["weekly", "monthly", "quarterly", "yearly"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                range === r
                  ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
            <Loader2 className="w-6 h-6 text-zinc-300 animate-spin" />
          </div>
        ) : data.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm text-zinc-400 font-medium italic">No view data available for this range</p>
            </div>
        ) : null}

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f4f4f5" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 500 }}
              dy={10}
              tickFormatter={(val) => {
                  if (range === "yearly") {
                      const [year, month] = val.split("-");
                      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
                      return monthName;
                  }
                  if (range === "quarterly" || range === "monthly") {
                      return val.split("-")[2] || val; // Just show day or part of it
                  }
                  return val;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 11, fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar
              dataKey="value"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              barSize={range === "weekly" ? 40 : range === "monthly" ? 12 : range === "quarterly" ? 24 : 32}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={data.length > 20 ? "#4f46e5" : "#4f46e5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
