"use client";

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
    const now = new Date();
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    
    if (activePeriod === 'Monthly') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return `${months[first.getMonth()]} 1 to ${months[last.getMonth()]} ${last.getDate()}`;
    }
    if (activePeriod === 'Quarterly') {
      const start = new Date(now);
      start.setDate(now.getDate() - 90);
      return `${months[start.getMonth()]} ${start.getDate()} to ${months[now.getMonth()]} ${now.getDate()}`;
    }
    return `jan ${now.getFullYear()} to dec ${now.getFullYear()}`;
  };

  return (
    <div className="bg-[#12141c] border border-white/5 px-8 pt-8 rounded-[2rem] w-full shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h3 className="text-white text-xl font-bold tracking-tight font-sans">Source Statistics</h3>
          <p className="text-zinc-500 text-sm font-medium mt-1 font-sans italic opacity-80">Acquisition sources comparison filtered by {activePeriod.toLowerCase()}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#1a1c26] border border-white/5 rounded-2xl p-1 shadow-inner">
            {(['Monthly', 'Quarterly', 'Annually'] as ChartPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={`px-4 py-2 text-[11px] font-bold rounded-xl transition-all font-sans ${
                  activePeriod === p 
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-600/20" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-3 bg-[#1a1c26] border border-white/5 px-4 py-2.5 rounded-2xl text-white text-[11px] font-bold hover:bg-[#20232e] transition-all font-sans shadow-md">
            <Calendar size={15} className="text-[#3b82f6]" />
            <span className="capitalize">{getDateRangeLabel()}</span>
            <ChevronDown size={15} className="text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.length === 0 ? [
            { name: "Start", youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 },
            { name: "End", youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 }
          ] : data}
          margin={{ bottom: 20 }}>
              <defs>
                <linearGradient id="colorYoutube" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorX" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorWhatsapp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600, fontFamily: 'sans-serif' }}
                dy={20}
                interval={activePeriod === 'Annually' ? 0 : 4}
                height={60}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 600, fontFamily: 'sans-serif' }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#1a1c26", 
                  border: "none", 
                  borderRadius: "16px", 
                  color: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  fontFamily: 'sans-serif'
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ 
                  paddingBottom: '30px', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  color: '#a1a1aa',
                  fontFamily: 'sans-serif' 
                }}
              />
              <Area
                type="monotone"
                dataKey="youtube"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeLinecap="round"
                fillOpacity={1}
                fill="url(#colorYoutube)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="x"
                stroke="#6366f1"
                strokeWidth={2.5}
                strokeLinecap="round"
                fillOpacity={1}
                fill="url(#colorX)"
                animationDuration={1800}
              />
               <Area
                type="monotone"
                dataKey="whatsapp"
                stroke="#10b981"
                strokeWidth={2.5}
                strokeLinecap="round"
                fillOpacity={1}
                fill="url(#colorWhatsapp)"
                animationDuration={2100}
              />
               <Area
                type="monotone"
                dataKey="Direct"
                stroke="#71717a"
                strokeWidth={1.5}
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
