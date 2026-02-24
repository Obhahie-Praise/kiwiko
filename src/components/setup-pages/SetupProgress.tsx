"use client";

import ProgressLine from "@/components/ProgressLine";
import { useSearchParams } from "next/navigation";
import React from "react";

const SetupProgress = () => {
  const currentPage = useSearchParams().get("page") || "1";
  
  return (
    <div
      className={`fixed z-50 transition-all duration-700 ${
        currentPage === '1'
          ? "top-5 left-1/2 -translate-x-1/2" 
          : "top-5 right-12"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[1rem] border border-zinc-200/50 shadow-2xl shadow-zinc-100 flex flex-col items-center gap-2">
         <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Protocol Progress</span>
         <ProgressLine />
      </div>
    </div>
  );
};

export default SetupProgress;
