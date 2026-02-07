import { ChevronLeft, ChevronRight, BarChart3, Users as UsersIcon, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page5 = ({
  position,
  userRole,
  userCount,
  setUserCount,
  revenue,
  setRevenue,
}: {
  position: string;
  userRole: string;
  userCount: string;
  setUserCount: React.Dispatch<React.SetStateAction<string>>;
  revenue: string;
  setRevenue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const isComplete = revenue && userCount;
  const userRanges = ["None yet", "< 50", "50-500", "500+"];
  const revenueRanges = ["$0", "<$500/mo", "$500–$5k/mo", "$5k+/mo"];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black">P5</div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            Hard <br /> <span className="text-zinc-500">Numbers.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Initialize your traction baseline. High-conviction investors look for the delta between yesterday and today.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <BarChart3 size={16} className="text-emerald-500" />
              Traction Signal Matrix
           </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Step 05 / 08</span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">Market Proof.</h1>
          </div>

          <div className="space-y-10">
            {/* User Count */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <UsersIcon size={12} /> User Momentum
              </label>
              <div className="grid grid-cols-2 gap-3">
                {userRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setUserCount(range)}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between ${
                      userCount === range 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {range}
                    {userCount === range && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign size={12} /> Revenue Protocol
              </label>
              <div className="grid grid-cols-2 gap-3">
                {revenueRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setRevenue(range)}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between ${
                      revenue === range 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {range}
                    {revenue === range && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-10 flex items-center justify-between border-t border-zinc-100">
            <Link
              href={`/onboarding/setup?page=${Number(position) - 1}`}
              className="group flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                <ChevronLeft size={16} />
              </div>
              Back
            </Link>

            <Link
              href={isComplete ? `/onboarding/setup?page=${Number(position) + 1}` : "#"}
              className={`group flex items-center gap-3 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isComplete 
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200 hover:bg-black" 
                  : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              Next Step
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page5;

