import { ArrowDownIcon, Zap, Globe, Shield } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GravityStarsBackground } from "../animate-ui/components/backgrounds/gravity-stars";
import StatsSemiCircle from "../StatsSemiCircle";
import FloatingCards from "../FloatingCards";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="pt-18 pb-40 text-center relative overflow-hidden bg-white">
      {/* Hero Content */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Headline */}
        <h1 className="hero-font text-5xl md:text-[5rem] tracking-tighter  leading-16 text-black mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Discover <span className="text-orange-600 special-font tracking-tighter">Real Data</span> from <br />
          <span className="bg-linear-to-r from-orange-800 tracking-tighter via-orange-600 to-orange-400 bg-clip-text text-transparent special-font">
            Real Startups
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-zinc-500 font-medium text-lg max-w-2xl mx-auto mb-4 leading-snug animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Kiwiko connects founders with investors through verifiable proof of
          work. Real-time execution. Hard metrics. Shared reality.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center gap-4 items-center mb-24 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link
            href="/onboarding"
            className="bg-white text-black border hover:text-zinc-600 border-zinc-300 text-base font-semibold px-8 py-2 rounded-lg transition-all active:scale-95"
          >
            Learn more
          </Link>
          <Link
            href="/onboarding"
            className="bg-orange-600 backdrop: text-white text-base font-semibold px-8 py-2 rounded-lg hover:opacity-80 transition-all active:scale-95"
          >
            Get started
          </Link>
        </div>

        {/* Dashboard Snapshot & Arcs Wrapper */}
        <div className="relative mt-6 animate-in fade-in slide-in-from-bottom-24 duration-1000 delay-500">
          {/* Background Arcs - Moved here to be relative to the image */}
          {/* <div className="absolute inset-0 -top-20 -z-10">
            <StatsSemiCircle />
          </div> */}

          <div className="rounded-xl p-0.5 bg-zinc-100/50 backdrop-blur-sm border border-zinc-200 shadow-2xl overflow-hidden relative z-10">
            <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-inner bg-white">
              <Image 
                src="/dashboard-snapshot-light-mode.png" 
                width={1000} 
                height={1000} 
                alt="Kiwiko Dashboard Overview" 
                className=""
                priority
              />
            </div>
          </div>
          
          {/* Decorative Glow behind image */}
          <div className="absolute top-  -inset-10 bg-orange-100/30 blur-[100px] -z-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
