"use client";

import React, { useState, useMemo } from "react";
import { 
  startups, 
  niches, 
  discoveryTabs, 
  nicheIcons, 
  StartupCategory, 
  StartupNiche 
} from "@/constants";
import { getDiscoverProjectsAction } from "@/actions/project.actions";
import { 
  Search, 
  Filter, 
  Zap, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ChevronRight,
  ArrowUpRight,
  Globe,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";

const DiscoveryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StartupCategory | "all">("trending");
  const [activeNiche, setActiveNiche] = useState<StartupNiche | "All">("All");
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      const res = await getDiscoverProjectsAction();
      if (res.success) {
        setDbProjects(res.data);
      }
      setIsLoading(false);
    };
    fetchProjects();
  }, []);

  const filteredStartups = useMemo(() => {
    // Merge curated startups with DB projects
    const allStartups = [...dbProjects, ...startups];
    return allStartups.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || s.category === activeTab;
      const matchesNiche = activeNiche === "All" || s.niche === activeNiche;
      
      return matchesSearch && matchesTab && matchesNiche;
    });
  }, [searchQuery, activeTab, activeNiche]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest italic">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Execution Feed
            </div> */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
              Discovery <br /> <span className="text-zinc-400">Feed.</span>
            </h1>
            <p className="text-zinc-500 font-bold max-w-md text-lg italic">
              The high-conviction map of verifiable startup progress and execution signals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search ventures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Main Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === "all" ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              All Signals
            </button>
            {discoveryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StartupCategory)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Niches */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-zinc-100">
            <button
              onClick={() => setActiveNiche("All")}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeNiche === "All" ? "bg-emerald-500 text-white" : "bg-zinc-50 text-zinc-400 hover:text-zinc-900"
              }`}
            >
              All Niches
            </button>
            {niches.map((niche) => {
              const Icon = nicheIcons[niche];
              return (
                <button
                  key={niche}
                  onClick={() => setActiveNiche(niche)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeNiche === niche ? "bg-emerald-500 text-white" : "bg-zinc-50 text-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  <Icon size={12} />
                  {niche}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feed Grid */}
        {filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-700">
            {filteredStartups.map((s, i) => {
              const profileSlug = s.name.toLowerCase().replace(/\s+/g, '-');
              
              return (
                <Link 
                  href={s.profileLink || `/${profileSlug}`} 
                  key={s.id}
                  className="group bg-white border border-zinc-200 rounded-4xl pb-7 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden relative"
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Image Section */}
                  <div className="relative h-44 w-full rounded-t-3xl rounded-b-xl overflow-hidden mb-8 shadow-sm">
                    <img 
                      src={s.image} 
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
                      {s.desc}
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
        ) : (
          <div className="py-40 text-center space-y-4 bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Search size={32} className="text-zinc-200" />
            </div>
            <h3 className="text-2xl font-black text-zinc-900 uppercase italic tracking-tighter">No Ventures Found</h3>
            <p className="text-zinc-500 font-bold max-w-sm mx-auto">
              No ventures match your current protocol filters. Try adjusting your search query or niche selectors.
            </p>
          </div>
        )}
      </main>

      {/* Footer Decoration */}
      <footer className="py-20 border-t border-zinc-100 text-center">
        <div className="flex items-center justify-center gap-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] italic">
          <span>Synced with Venture Engine v4.0</span>
          <span className="w-2 h-2 bg-zinc-200 rounded-full" />
          <span>Institutional Integrity Protocol</span>
        </div>
      </footer>
    </div>
  );
};

export default DiscoveryPage;
