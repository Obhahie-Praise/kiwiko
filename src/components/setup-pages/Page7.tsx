import { ChevronLeft, ChevronRight, Landmark, PieChart, Banknote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Page7 = ({
  position,
  userRole,
  fundsSeekingStatus,
  setFundsSeekingStatus,
  fundingStage,
  setFundingStage,
}: {
  position: string;
  userRole: string;
  fundsSeekingStatus: string;
  setFundsSeekingStatus: React.Dispatch<React.SetStateAction<string>>;
  fundingStage: string;
  setFundingStage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const isComplete = fundsSeekingStatus && fundingStage;
  const seekingOptions = ["Yes", "Soon", "Not currently"];
  const stageOptions = ["Pre-seed", "Seed", "Not decided"];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black">P7</div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            Capital <br /> <span className="text-zinc-500">Inbound.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Verify your capitalization strategy. Fueling the engine requires precise coordination of venture resources.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <Landmark size={16} className="text-emerald-500" />
              Resource Allocation Protocol
           </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Step 07 / 08</span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">Venture Capital.</h1>
          </div>

          <div className="space-y-10">
            {/* Seeking Status */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Banknote size={12} /> Resource Acquisition
              </label>
              <div className="grid grid-cols-3 gap-3">
                {seekingOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFundsSeekingStatus(opt)}
                    className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-center ${
                      fundsSeekingStatus === opt 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Funding Stage */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <PieChart size={12} /> Capital Series
              </label>
              <div className="grid grid-cols-3 gap-3">
                {stageOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFundingStage(opt)}
                    className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border text-center ${
                      fundingStage === opt 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {opt}
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

export default Page7;

