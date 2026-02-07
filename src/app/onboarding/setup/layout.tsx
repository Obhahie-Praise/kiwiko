"use client"
import ProgressLine from "@/components/ProgressLine";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentPage = useSearchParams().get("page")
  
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Institutional Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/30 rounded-full blur-[120px] -z-10 opacity-30" />

      {/* Top Bar Branding */}
      <div className="fixed top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-2 group">
           <Image src="/neutral-logo.svg" alt="logo" width={28} height={28} className="group-hover:rotate-12 transition-transform duration-500" />
           <p className="text-xl font-black italic tracking-tighter uppercase text-zinc-900">Kiwiko</p>
        </Link>
      </div>

      <div className="relative z-10">
        {children}
      </div>

      {/* Progress Tracking Layer */}
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
    </div>
  );
};

export default layout;

