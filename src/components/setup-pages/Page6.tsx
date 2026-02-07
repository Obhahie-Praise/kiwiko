import { ChevronLeft, ChevronRight, Users, ShieldCheck, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page6 = ({
  position,
  userRole,
  teamSize,
  setTeamSize,
  leaderStatus,
  setLeaderStatus,
}: {
  position: string;
  userRole: string;
  teamSize: string;
  setTeamSize: React.Dispatch<React.SetStateAction<string>>;
  leaderStatus: string | null;
  setLeaderStatus: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const isComplete = teamSize && leaderStatus;
  const teamSizes = ["Solo", "2-3", "4+"];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black">P6</div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            Human <br /> <span className="text-zinc-500">Capital.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Define your operational unit. The strength of the architecture is limited by the talent of its builders.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <Users size={16} className="text-emerald-500" />
              Organizational Blueprint
           </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Step 06 / 08</span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">Team Structure.</h1>
          </div>

          <div className="space-y-10">
            {/* Team Size */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} /> Unit Count
              </label>
              <div className="grid grid-cols-3 gap-3">
                {teamSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setTeamSize(size)}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-center ${
                      teamSize === size 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Leader Status */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} /> Development Protocol Lead
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLeaderStatus("Yes")}
                  className={`px-6 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between group ${
                    leaderStatus === "Yes" 
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                      : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block">Yes, I lead</span>
                    <span className="text-[8px] opacity-60 normal-case">Operational Commander</span>
                  </div>
                  <Crown size={16} className={leaderStatus === "Yes" ? "text-emerald-500" : "text-zinc-200 group-hover:text-zinc-400"} />
                </button>

                <button
                  onClick={() => setLeaderStatus("No")}
                  className={`px-6 py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between group ${
                    leaderStatus === "No" 
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                      : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block">No, I support</span>
                    <span className="text-[8px] opacity-60 normal-case">Core Contributor</span>
                  </div>
                  <Users size={16} className={leaderStatus === "No" ? "text-emerald-500" : "text-zinc-200 group-hover:text-zinc-400"} />
                </button>
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

export default Page6;

