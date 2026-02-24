import { ArrowDownIcon, Zap, Globe, Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GravityStarsBackground } from "../animate-ui/components/backgrounds/gravity-stars";
import StatsSemiCircle from "../StatsSemiCircle";
import FloatingCards from "../FloatingCards";

const Hero = () => {
  return (
    <div className="pt-30 pb-40 text-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <GravityStarsBackground starsSize={2} starsCount={100} color="#000" />
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-zinc-100 rounded-full blur-[140px] -z-20 opacity-40 animate-pulse" />

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Badge */}
        <Link href="#" className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-zinc-200 rounded-full shadow-xl shadow-zinc-100/50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <span className="" ><svg width={13} height={13} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"></path></svg></span>
           <span className="text-xs font-medium text-zinc-900">Engage our launch post on X 🎊</span>
        </Link>

        {/* Headline */}
        <h1 className="hero-font text-5xl md:text-[5.5rem] font-bold tracking- text-zinc-900 leading-none animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Discover <span className="text-zinc-400">Real Data</span> <br /> 
          <span className="bg-linear-to-r from-zinc-900 via-zinc-600 to-zinc-900 bg-clip-text text-transparent">from Real Startups</span>
        </h1>

        {/* Sub-headline */}
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <p className="text-xl font-semibold text-zinc-500 leading-relaxed">
            Kiwiko connects founders with investors through verifiable proof of work. 
            Real-time execution. Hard metrics. Shared reality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/discover"
              className="flex items-center gap-2 text-zinc-900 bg-white border border-zinc-200 rounded-[1.5rem] py-5 px-10 font-bold tracking-wid hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
            >
              Discover Startups
              <Globe size={16} />
            </Link>
          </div>
        </div>

        {/* Metrics/Stats Layer */}
        <div className="pt-20 -mt-20 mb-40">
          <StatsSemiCircle />
          {/* <div className="mt-12">
            <FloatingCards />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;

