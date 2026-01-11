"use client";
import { Ban, ThumbsUp, User2Icon } from "lucide-react";
import Image from "next/image";
import { ScrollParallax } from "react-just-parallax";
import MagneticCursor from "../Magnetic";

const Features = () => {
  return (
    <section id="features" className="mt-40 mx-20 relative">
      <div className="flex items-center justify-center mb-4">
        <div className="px-1.5 py-0.5 text-sm border-2 border-zinc-300 bg-zinc-300 text-black rounded-lg ">
          Features
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-4xl font-medium">Whats in it for you?</h2>
        <p className="text-zinc-500">
          Get access to 'state of the art' insight tools
        </p>
      </div>
      <div className="grid grid-cols-12 gap-4 mt-12">
        <div className="col-span-7 h-40 border-2 border-zinc-300 rounded-2xl relative p-4">
          <div className="h-12 w-12 rounded-full border-2 border-zinc-300 absolute top-3 left-3 bg-black flex items-center justify-center text-3xl font-semibold text-white">
            1
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div className="ml-16 text-2xl font-medium">
                Track Execution in Real-Time
              </div>
              <div className="ml-16 text-zinc-500">
                See which startups are shipping and updating.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mx-5 mt-10">
            <MagneticCursor className="border border-zinc-300 text-sm font-medium px-2 py-0.5 rounded-full text-zinc-500">
              git commits
            </MagneticCursor>
            <MagneticCursor className="border border-zinc-300 text-sm font-medium px-2 py-0.5 rounded-full text-zinc-500">
              progress updates
            </MagneticCursor>
            <MagneticCursor className="border border-zinc-300 text-sm font-medium px-2 py-0.5 rounded-full text-zinc-500">
              features shipping
            </MagneticCursor>
            <MagneticCursor className="border border-zinc-300 text-sm font-medium px-2 py-0.5 rounded-full text-zinc-500">
              outreach
            </MagneticCursor>
            <MagneticCursor className="border border-zinc-300 text-sm font-medium px-2 py-0.5 rounded-full text-zinc-500">
              milestone
            </MagneticCursor>
          </div>
        </div>
        <div className="col-span-5 h-fit border-2 border-zinc-300 relative p-4 rounded-2xl">
          <div className="h-12 w-12 rounded-full border-2 border-zinc-300 absolute top-8 left-3 bg-black flex items-center justify-center text-3xl font-semibold text-white">
            2
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div className="ml-16 mt-2 text-2xl font-medium">
                Metrics That Matter
              </div>
              <div className="ml-16 text-zinc-500">
                Track user growth, engagement, and milestones.
              </div>
            </div>
          </div>
          <div className="flex justify-center relative">
            <Image
              src="/areachart.png"
              alt="areachart"
              width={500}
              height={500}
              className="grayscale"
            />
            <MagneticCursor className="absolute top-33 left-3 border border-zinc-300 text-xs font-medium px-2 py-0.5 rounded-full text-zinc-500 bg-zinc-300/20">
              +12% new users
            </MagneticCursor>
            <MagneticCursor className="border absolute top-55 right-5 border-zinc-300 text-sm font-medium px-2 py-0.5 rounded-full text-zinc-500 bg-zinc-300/20">
              +$500 MRR
            </MagneticCursor>
            <MagneticCursor className="border absolute top-30 border-zinc-300 text-[10px] font-medium px-2 py-0.5 rounded-full text-zinc-500 bg-zinc-300/20">
              -2% churn rate
            </MagneticCursor>
          </div>
          <div className=" flex items-center justify-between space-x-2 mx-3 mt-3">
            <div className=" flex items-center space-x-2 mx-3 mt-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1572/1572748.png"
                alt="novapay"
                className="h-10 w-10 border border-blue-500 p-1 rounded-full"
              />
              <p className="">Nova Pay</p>
            </div>
            <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="col-span-7 h-71.5 border-2 border-zinc-300 relative p-4 rounded-2xl -mt-75">
          <div className="h-12 w-12 rounded-full border-2 border-zinc-300 absolute top-5 right-5 bg-black flex items-center justify-center text-3xl font-semibold text-white">
            3
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div className="ml-6 mt-2 text-2xl font-medium">
                Visibility without the noise
              </div>
              <div className="ml-6 pr-20 text-zinc-500">
                No engagement farming, no algorithms rewarding hype, just real
                updates from founders.
              </div>
            </div>
          </div>
          <MagneticCursor className="absolute left-30 top-30">
            <div className="relative flex items-center justify-center mt-10 w-24 h-24 border-2 border-zinc-300 rounded-full p-4">
              <ThumbsUp width={80} height={80} className="text-zinc-500" />
              <Ban
                className="absolute top-0 right-0 text-red-500/50"
                width={15}
                height={15}
              />
            </div>
          </MagneticCursor>
          <MagneticCursor className="absolute right-30">
            <div className="relative flex items-center justify-center mt-10 w-30 h-30 border-2 border-zinc-300 rounded-full p-4">
              <User2Icon width={100} height={100} className="text-zinc-600" />
              <Ban
                className="absolute top-0 right-0 text-red-500/80"
                width={15}
                height={15}
              />
            </div>
          </MagneticCursor>
        </div>
        <div className="col-span-12 h-40 border-2 border-zinc-300 relative p-4 -mt-4 rounded-2xl">
          <div className="h-12 w-12 rounded-full border-2 border-zinc-300 absolute top-4 left-4 bg-black flex items-center justify-center text-3xl font-semibold text-white">
            4
          </div>
          <div className="flex items-center justify-between">
            <div className="">
              <div className="ml-16 text-2xl font-medium">
                Shared Reality, Not Curated Stories
              </div>
              <div className="ml-16 pr-20 text-zinc-500">
                Updates aren’t polished narratives. They’re factual snapshots of
                progress — visible to everyone, unchanged.
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollParallax isAbsolutelyPositioned strength={0.099}>
        <MagneticCursor className="absolute top-20 left-5 bg-zinc-300/30 backdrop-blur-xl border border-zinc-400 text-black rounded-lg text-sm px-3 py-1.5 font-medium">
          No Likes / No Followers
        </MagneticCursor>
      </ScrollParallax>

      <ScrollParallax isAbsolutelyPositioned strength={0.099}>
        <MagneticCursor className="absolute top-62 -right-15 bg-zinc-300/30 backdrop-blur-xl border border-zinc-400 text-black rounded-lg text-sm px-3 py-1.5 font-medium">
          Progress Is Public
        </MagneticCursor>
      </ScrollParallax>
      <ScrollParallax isAbsolutelyPositioned strength={0.099}>
        <MagneticCursor className="absolute top-120 -left-30 bg-zinc-300/30 backdrop-blur-xl border border-zinc-400 text-black rounded-lg text-sm px-3 py-1.5 font-medium">
          Founder-First Environment
        </MagneticCursor>
      </ScrollParallax>
    </section>
  );
};

export default Features;
