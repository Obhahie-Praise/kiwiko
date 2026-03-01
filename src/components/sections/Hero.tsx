import { ArrowDownIcon, Zap, Globe, Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GravityStarsBackground } from "../animate-ui/components/backgrounds/gravity-stars";
import StatsSemiCircle from "../StatsSemiCircle";
import FloatingCards from "../FloatingCards";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="pt-24 pb-40 text-center relative overflow-hidden bg-white">
      {/* Hero Content */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <h1 className="hero-font text-5xl md:text-[5.5rem] leading-[1.1] tracking-[-0.03em] text-zinc-900 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Discover <span className="text-orange-500">Real Data</span> from <br />
          <span className="bg-linear-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
            Real Startups
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Kiwiko connects founders with investors through verifiable proof of
          work. Real-time execution. Hard metrics. Shared reality.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link
            href="/onboarding"
            className="bg-orange-600 text-white text-base font-bold px-8 py-4 rounded-2xl hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-200"
          >
            Get started
          </Link>
        </div>

        {/* Dashboard Snapshot & Arcs Wrapper */}
        <div className="relative mt-8 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
          {/* Background Arcs - Moved here to be relative to the image */}
          <div className="absolute inset-0 -top-20 -z-10">
            <StatsSemiCircle />
          </div>

          <div className="rounded-[2.5rem] p-3 bg-zinc-100/50 backdrop-blur-sm border border-zinc-200 shadow-2xl overflow-hidden relative z-10">
            <div className="rounded-[2rem] overflow-hidden border border-zinc-200 shadow-inner bg-white">
              <Image 
                src="/dashboard-snapshot-light-mode.png" 
                width={1400} 
                height={900} 
                alt="Kiwiko Dashboard Overview" 
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
          
          {/* Decorative Glow behind image */}
          <div className="absolute -inset-10 bg-orange-100/30 blur-[100px] -z-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
