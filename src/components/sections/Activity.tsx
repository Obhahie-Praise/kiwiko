import React from "react";
import { getDiscoverProjectsAction } from "@/actions/project.actions";
import { recentActivity } from "@/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Activity = async () => {
  // Fetch real projects from DB
  const res = await getDiscoverProjectsAction();
  const dbStartups = res.success ? res.data : [];
  
  // Merge and display the first 8 startups
  const displayedStartups = [...dbStartups, ...recentActivity].slice(0, 8);

  return (
    <section id="activity" className="w-full py-20">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12 px-6">
        <div className="px-3 py-1 text-xs font-bold tracking-[0.09em] bg-black text-white rounded-full border border-zinc-200 mb-4">
          Startups
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase text-zinc-900 mb-4 hero-font">
          A lot is going down.
        </h2>
        <p className="text-zinc-500 font-semibold max-w-lg">
          Track the high-momentum ventures shipping critical infrastructure in real-time.
        </p>
      </div>

      {/* Startup Grid */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedStartups.map((s: any, index: number) => {
            return (
              <Link
                href={s.profileLink}
                key={index}
                className="group bg-white border border-zinc-200 rounded-4xl pb-7 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden relative"
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Image Section */}
                <div className="relative h-44 w-full rounded-t-3xl rounded-b-xl overflow-hidden mb-8 shadow-sm">
                   <img
                      src={s.logo}
                      alt={s.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition duration-700"
                   />
                   <div className="absolute top-4 right-4 text-[9px] font-black bg-zinc-900/80 text-white backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {s.stage}
                   </div>
                </div>

                {/* Content */}
                <div className="flex-1 relative z-10 px-7">
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{s.niche}</span>
                    {/* Removed Verified Signal */}
                  </div>
                  
                  <h3 className="text-2xl font-black text-zinc-900 mb-3 tracking-tighter uppercase italic group-hover:text-black transition-colors flex items-center gap-2">
                     <img 
                        src={s.logo || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=100&auto=format&fit=crop"} 
                        alt="" 
                        className="w-6 h-6 rounded-md object-cover border border-zinc-100"
                      />
                    {s.name}
                  </h3>
                  
                  <p className="text-sm text-zinc-500 leading-relaxed font-bold line-clamp-2">
                    {s.tagline}
                  </p>
                </div>

                {/* Metrics Footer */}
                <div className="mt-2 pt-4 px-7 border-t border-zinc-50 flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Funding</span>
                         <span className="text-xs font-black text-zinc-900 uppercase italic">{s.funding}</span>
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Traction</span>
                         <span className="text-xs font-black text-zinc-900 uppercase italic">{s.traction}</span>
                      </div>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all scale-75 group-hover:scale-100 duration-500 shadow-sm shadow-zinc-100">
                      <ChevronRight size={16} />
                   </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* See More Button */}
        <div className="flex justify-center mt-20">
          <Link
            href="/discover"
            className="group flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-2xl text-xs font-bold tracking-[0.15em] shadow-2xl shadow-zinc-300 hover:bg-black transition-all active:scale-95"
          >
            See more
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Activity;
