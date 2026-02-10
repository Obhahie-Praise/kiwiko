import { ChevronLeft, ChevronRight, Activity, Link as LinkIcon, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page4 = ({
  position,
  userRole,
  stage,
  setStage,
  setLinkToProduct,
  linkToProduct,
}: {
  stage: string;
  position: string;
  userRole: string;
  setStage: React.Dispatch<React.SetStateAction<string>>;
  setLinkToProduct: React.Dispatch<React.SetStateAction<string>>;
  linkToProduct: string;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const isComplete = stage && linkToProduct;
  const stages = ["Idea", "MVP built", "Live users", "Revenue"];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black">P4</div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            Current <br /> <span className="text-zinc-500">Progress.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Tell us what you've built and how far you've come.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <Activity size={16} className="text-emerald-500" />
              Live Momentum Sensor
           </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Step 04 / 08</span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">Current stage.</h1>
          </div>

          <div className="space-y-10">
            {/* Stage Selection */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} />Stage
              </label>
              <div className="grid grid-cols-2 gap-3">
                {stages.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStage(s)}
                    className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-left flex items-center justify-between ${
                      stage === s 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {s}
                    {stage === s && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Link */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <LinkIcon size={12} /> Project link
              </label>
              <div className="relative group">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                <input
                  type="text"
                  value={linkToProduct}
                  onChange={(e) => setLinkToProduct(e.target.value)}
                  placeholder="e.g. protocol.kiwiko.io"
                  className="w-full pl-14 pr-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-zinc-900"
                />
              </div>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Public access link to your current build or repository.</p>
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

export default Page4;

