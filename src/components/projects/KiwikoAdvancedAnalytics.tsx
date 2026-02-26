"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { MoreVertical, Users, Activity, Eye, CircleDot, TrendingUp, TrendingDown } from "lucide-react";

interface KiwikoAdvancedAnalyticsProps {
  data: {
    activeUsers: number;
    activeUsers7d: number;
    activeUsers30d: number;
    sessions: number;
    usersOnline: number;
    allTimeUsers: number;
    churnRate: number;
    activeUsersByHour: { timestamp: string; count: number }[];
  };
}

const KiwikoMiniMetricCard = ({ 
  title, 
  value, 
  description, 
  change, 
  isPositive, 
  sparklineData 
}: { 
  title: string; 
  value: string; 
  description: string; 
  change: string; 
  isPositive: boolean;
  sparklineData: { value: number }[];
}) => (
  <div className="bg-white border-[0.2px] border-zinc-200 rounded-2xl p-4 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="text-lg font-semibold text-zinc-900 hero-font">{title}</h4>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <button className="text-zinc-400 hover:text-zinc-600">
        <MoreVertical size={14} />
      </button>
    </div>
    
    <div className="flex items-end justify-between mt-auto">
      <div>
        <p className="text-xl font-bold text-zinc-900 tracking-tight">{value}</p>
        <p className={`text-[10px] font-semibold mt-1 flex items-center gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {change} <span className="text-zinc-400 font-medium ml-1">than last Week</span>
        </p>
      </div>
      
      <div className="w-20 h-10 -mr-2 -mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={title.replace(/\s+/g, '')} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#10b981" : "#ef4444"}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${title.replace(/\s+/g, '')})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const KiwikoAdvancedAnalytics = ({ data }: KiwikoAdvancedAnalyticsProps) => {
  // Generate some semi-realistic sparkline data if real time series for these aren't available yet
  const generateSparkline = (base: number, variance: number) => 
    Array.from({ length: 10 }, () => ({ value: base + (Math.random() - 0.5) * variance }));

  const metrics = [
    {
      title: "Churn Rate",
      value: `${data.churnRate.toFixed(2)}%`,
      description: "Downgrade to Free plan",
      change: "0.31%",
      isPositive: data.churnRate < 5,
      sparklineData: generateSparkline(data.churnRate, 2)
    },
    {
      title: "All-Time Users",
      value: data.allTimeUsers.toLocaleString(),
      description: "Total unique visitors",
      change: "+1.2%",
      isPositive: true,
      sparklineData: generateSparkline(data.allTimeUsers / 100, 10)
    },
    {
      title: "Sessions",
      value: data.sessions.toLocaleString(),
      description: "Total visits (24h)",
      change: "+3.85%",
      isPositive: true,
      sparklineData: generateSparkline(data.sessions / 100, 50)
    },
    {
      title: "Engagement",
      value: "84%",
      description: "Stickiness ratio",
      change: "+2.1%",
      isPositive: true,
      sparklineData: generateSparkline(80, 10)
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-6 mt-6 w-full">
      {/* Left side: 2x2 Small Cards */}
      <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <KiwikoMiniMetricCard key={i} {...m} />
        ))}
      </div>

      {/* Right side: Large Active Users Chart */}
      <div className="col-span-12 lg:col-span-7 bg-white border-[0.2px] border-zinc-200 shadow-sm rounded-2xl p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-zinc-900 hero-font">Active Users</h3>
          <button className="text-zinc-400 hover:text-zinc-600">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-3xl font-bold text-zinc-900 tracking-tight">{data.usersOnline}</span>
          <span className="text-sm text-zinc-500 font-medium">Live visitors</span>
        </div>

        <div className="flex-1 min-h-[120px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.activeUsersByHour}>
              <defs>
                <linearGradient id="activeUsersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f4f4f5" strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                hide 
              />
              <YAxis hide />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const date = new Date(payload[0].payload.timestamp);
                    return (
                      <div className="bg-white p-2 border border-zinc-100 rounded-lg">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm font-bold text-zinc-900">{payload[0].value} Users</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#activeUsersGradient)"
                activeDot={{ r: 6, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 mx-auto gap-4 mt-8 pt-6 border-t border-zinc-50">
          <div className="border-r border-zinc-100 pr-4">
            <p className="text-xl text-center font-semibold text-zinc-900 tracking-tight">{Math.round(data.activeUsers).toLocaleString()}</p>
            <p className="text-sm text-zinc-500 font-medium tracking-wider mt-1">Avg, Daily</p>
          </div>
          <div className="border-r border-zinc-100 pr-4">
            <p className="text-xl text-center font-semibold text-zinc-900 tracking-tight">{Math.round(data.activeUsers7d / 7).toLocaleString()}</p>
            <p className="text-sm text-zinc-500 font-medium tracking-wider mt-1">Avg, Weekly</p>
          </div>
          <div>
            <p className="text-xl text-center font-semibold text-zinc-900 tracking-tight">{Math.round(data.activeUsers30d / 30).toLocaleString()}</p>
            <p className="text-sm text-zinc-500 font-medium tracking-wider mt-1">Avg, Monthly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KiwikoAdvancedAnalytics;
