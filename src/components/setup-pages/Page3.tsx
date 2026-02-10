import { ChevronLeft, ChevronRight, AlertCircle, Lightbulb } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page3 = ({
  position,
  userRole,
  theProblem,
  setTheProblem,
  theSolution,
  setTheSolution,
}: {
  position: string;
  userRole: string;
  theProblem: string;
  theSolution: string;
  setTheProblem: React.Dispatch<React.SetStateAction<string>>;
  setTheSolution: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const isComplete = theProblem && theSolution;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black">P3</div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            Startup <br /> <span className="text-zinc-500">Thesis.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Distill your operational mission. Every great startup begins with a clear gap in reality.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <AlertCircle size={16} className="text-emerald-500" />
              Critical Value Vector
           </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Step 03 / 08</span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">Product  Definition.</h1>
          </div>

          <div className="space-y-10">
            {/* Problem Area */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={12} /> Real-world Problem
              </label>
              <textarea
                value={theProblem}
                onChange={(e) => setTheProblem(e.target.value)}
                placeholder="What specific problem in the market are you solving?"
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-zinc-900 min-h-[140px] resize-none"
              />
            </div>

            {/* Solution Area */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Lightbulb size={12} /> Proferred Solution
              </label>
              <textarea
                value={theSolution}
                onChange={(e) => setTheSolution(e.target.value)}
                placeholder="How does your product uniquely solve this problem?"
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-zinc-900 min-h-[140px] resize-none"
              />
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

export default Page3;

