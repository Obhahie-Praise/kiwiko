import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { GravityStarsBackground } from "../animate-ui/components/backgrounds/gravity-stars";
import StatsSemiCircle from "../StatsSemiCircle";
import FloatingCards from "../FloatingCards";

const Hero = () => {
  return (
    <div className="mt-50 text-center space-y-4">
      <div className="absolute -top-50 left-0 w-full h-400 -z-1 overflow-hidden">
        <GravityStarsBackground starsSize={2} starsCount={100} color="#9CCF44" />
      </div>
      <div className="capitalize text-6xl font-semibold mx-70">
        Discover <span className="bg-linear-to-b from-zinc-600 to-zinc-200 bg-clip-text text-transparent"> real data</span> from real startups.
      </div>
      <div className="">
        <p className="font-medium text-zinc-500 mx-90">
          Kiwiko connects founders with investors who care about what you've
          built, not what you've said. Real execution. Real metrics. Real
          funding.
        </p>
      </div>
      <div className="">
        <Link
          href="#startups"
          className="mx-auto w-fit flex items-center gap-1 text-white bg-black rounded-lg hover:bg-zinc-800 py-2 px-4 font-medium transition-colors"
        >
          <p className="">Explore Data</p>
          <ArrowDownIcon widths={20} height={20} />
        </Link>
      </div>
      <div className="">
        
      </div>
      <StatsSemiCircle />
      <FloatingCards />
    </div>
  );
};

export default Hero;
