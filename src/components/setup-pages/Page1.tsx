import { ChevronRight, Users, Briefcase } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page1 = ({
  position,
  userRole,
  setUserRole,
}: {
  position: string;
  userRole: string;
  setUserRole: React.Dispatch<React.SetStateAction<"founder" | "investor" | "">>;
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-4xl w-full space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest italic mx-auto">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Initialization Phase
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] text-zinc-900">
            Define your <br /> <span className="text-zinc-400">Alias Protocol.</span>
          </h1>
          <p className="text-zinc-500 font-bold text-xl max-w-lg mx-auto leading-relaxed">
            Specify your operational role within the Kiwiko Venture Engine.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Investor Option */}
          <Link
            href="/onboarding/setup?page=2"
            onClick={() => setUserRole("investor")}
            className="group relative bg-white border border-zinc-200 rounded-[3rem] p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-[450px] overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full blur-3xl -z-10 group-hover:bg-zinc-100 transition-colors" />
            
            <div className="space-y-6 relative z-10">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white rotate-3 group-hover:rotate-12 transition-transform duration-500">
                <Briefcase size={32} />
              </div>
              <h3 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">
                Capital <br /> <span className="text-zinc-400">Allocator</span>
              </h3>
              <p className="text-zinc-500 font-bold text-lg leading-relaxed">
                Analyze high-conviction signals, track execution, and allocate capital to verified ventures.
              </p>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Type: Investor</span>
              <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                <ChevronRight size={24} />
              </div>
            </div>
          </Link>

          {/* Founder Option */}
          <Link
            href="/onboarding/setup?page=2"
            onClick={() => setUserRole("founder")}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-[450px] overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/20 rounded-full blur-3xl -z-10 group-hover:bg-emerald-800/20 transition-colors" />

            <div className="space-y-6 relative z-10 text-white">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-900 -rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <Users size={32} />
              </div>
              <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                Venture <br /> <span className="text-zinc-500">Architect</span>
              </h3>
              <p className="text-zinc-400 font-bold text-lg leading-relaxed">
                Ship at terminal velocity, verify your reality with data, and build atop institutional infrastructure.
              </p>
            </div>

            <div className="flex items-center justify-between relative z-10 text-white">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Type: founder</span>
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:bg-white group-hover:text-zinc-900 transition-all duration-500">
                <ChevronRight size={24} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page1;

