"use client";

import React from "react";
import { 
  ArrowUpRight, 
  GitCommit, 
  Users, 
  TrendingUp, 
  Terminal, 
  Mail, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Download,
  Gem
} from "lucide-react";
import PitchDeck from "@/components/projects/PitchDeck";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { getLinkIcon, getLinkLabel } from "@/lib/url-utils";

interface ProjectPublicViewProps {
    project: any; // TODO: Type this properly based on DB or Constant
    organization: any;
    orgSlug: string;
}

const ProjectPublicView = ({ project, organization, orgSlug }: ProjectPublicViewProps) => {

  const activity = [
    { id: 1, type: "commit", text: "Refactored core engine for concurrency", meta: "v2.1.0", time: "2h ago", icon: Terminal },
    { id: 2, type: "growth", text: "New milestone: 10k monthly active users", meta: "+15% WoW", time: "1d ago", icon: Users },
    { id: 3, type: "feature", text: "Live: Multi-tenant database partitioning", meta: "Production", time: "3d ago", icon: Zap },
    { id: 4, type: "metric", text: "Valuation signal increased to " + project.valuation, meta: "Market adjusted", time: "1w ago", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Dynamic Header */}
      <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-white/70 border-b border-zinc-100">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-lg p-1 shadow-inner overflow-hidden relative">
                {project.logoUrl ? (
                    <img 
                      src={project.logoUrl} 
                      alt={project.name} 
                      className="w-full h-full object-cover"
                    />
                ) : (
                    project.name.charAt(0)
                )}
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">{organization?.name || "Independent"}</p>
                <h2 className="text-sm font-bold tracking-tight leading-none text-zinc-900">{project.name}</h2>
            </div>
        </div>

        <Link 
          href={`/${orgSlug}/mail`}
          className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white rounded-full text-xs font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-zinc-200 group active:scale-95"
        >
          <Mail size={14} className="group-hover:rotate-12 transition-transform" />
          <span>Connect with Founders</span>
        </Link>
      </header>

      {/* Hero Section with Prominent Banner */}
      <main className="pt-20 pb-20 overflow-x-hidden">
        {/* Banner Section */} 
        <section className="relative w-full h-[600px] mb-16 overflow-hidden bg-zinc-50">
          {/* Background Image/Banner - Clean and Clear */}
          <div className="absolute inset-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000"
              style={{ 
                backgroundImage: `url(${project.bannerUrl || 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop'})`,
              }}
            />
          </div>

          {/* Tagline Overlay - Bottom Left */}
          <div className="absolute bottom-0 left-0 z-10 w-full max-w-4xl">
            <div className="bg-white/70 p-10 md:p-14 rounded-tr-[4rem] shadow-2xl border-t border-r border-white/30">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white rounded-full mb-8 shadow-xl italic">
                {/* <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> */}
                <span className="text-[10px] font-extrabold uppercase tracking-widest">{project.stage || "Growth"}</span>
              </div>
              
              <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-zinc-900 leading-[0.85] italic uppercase">
                {(project.tagline || project.description) ? (
                  <>
                    {(project.tagline || project.description).split(" ").slice(0, 3).join(" ")} <br />
                    <span className="text-zinc-500">
                      {(project.tagline || project.description).split(" ").slice(3).join(" ")}
                    </span>
                  </>
                ) : (
                  <>
                    The future of <span className="text-zinc-500">Infrastructure</span> <br /> is built here.
                  </>
                )}
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section - Below Banner */}
        <section className="px-6 max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-900">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-300" />
                    The Problem
                  </h3>
                  <p className="text-xl font-bold leading-relaxed italic">
                    {project.problem || "Venture data is siloed, fragmented, and lacks real-time verification. Investors fly blind while founders drown in reporting."}
                  </p>
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-300" />
                    The Solution
                  </h3>
                  <p className="text-xl font-bold leading-relaxed">
                    {project.solution || "A verifiable, agent-driven infrastructure that provides ground-truth metrics of execution at every stage of the lifecycle."}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between p-8 bg-zinc-50 rounded-[3rem] border border-zinc-200/60 shadow-inner">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-2">
                  Current Valuation <ShieldCheck size={12} className="text-emerald-500" />
                </h3>
                <p className="text-6xl font-black text-zinc-900 tracking-tighter mb-2">{project.postMoneyValuation ? `$${project.postMoneyValuation}` : "$10M"}</p>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-tight">Post-Money Market Signal</p>
              </div>
              <div className="mt-12 flex gap-2 overflow-x-auto no-scrollbar">
                  <span className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-black text-zinc-800 whitespace-nowrap shadow-sm lowercase tracking-tight">bootstrapped</span>
                  <span className="px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-black text-zinc-800 whitespace-nowrap shadow-sm lowercase tracking-tight">series {project.id === 'p1' ? 'A' : 'seed'}</span>
                  <span className="px-3 py-1.5 bg-zinc-900 rounded-xl text-[10px] font-black text-white whitespace-nowrap shadow-sm lowercase tracking-tight">+20% mom</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pitch Deck Section */}
        <section className="bg-zinc-50 py-24 mb-20 overflow-hidden">
          <div className="px-6 max-w-7xl mx-auto">
            <PitchDeck url={project.pitchDeckUrl} />
          </div>
        </section>

        {/* Proof of Concept / Activity Section */}
        <section className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 shadow-inner">
                        <Terminal size={24} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase italic">Live Execution Logs</h2>
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Real-time Proof of Concept</p>
                    </div>
                </div>

                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="group p-6 bg-white border border-zinc-100 rounded-3xl hover:border-zinc-300 transition-all flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-zinc-100 overflow-hidden relative">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="p-3 bg-zinc-50 text-zinc-400 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-zinc-900 leading-tight mb-1">{item.text}</p>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.meta} • {item.time}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute right-0 top-0 h-full w-32 bg-linear-to-l from-zinc-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
            </div>

            <div className="md:w-1/3">
                <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <Gem className="absolute -top-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:scale-110 transition-transform duration-700" />
                    <h3 className="text-2xl font-black mb-6 uppercase italic tracking-tighter">Venture Integrity</h3>
                    <p className="text-zinc-400 font-medium mb-12 text-sm leading-relaxed">
                        Every log entry and metric on this page is cryptographically verified by the Kiwiko protocol. We believe in high-certainty venture infrastructure.
                    </p>

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Engineers</span>
                            <span className="text-xl font-black italic tracking-tighter">12</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Git Momentum</span>
                            <span className="text-xl font-black italic tracking-tighter text-emerald-400">EXCEPTIONAL</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">User Sentiment</span>
                            <span className="text-xl font-black italic tracking-tighter text-emerald-400">98%</span>
                        </div>
                    </div>

                    {/* Dynamic Relevant Links */}
                    {project.links && project.links.length > 0 && (
                        <div className="mb-12">
                             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Relevant Resources</h4>
                             <div className="grid grid-cols-2 gap-3">
                                {project.links.map((url: string, idx: number) => (
                                    <a 
                                        key={idx} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group/link"
                                    >
                                        <span className="text-zinc-400 group-hover/link:text-white transition-colors">
                                            {getLinkIcon(url)}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-300 truncate group-hover/link:text-white transition-colors">
                                            {getLinkLabel(url)}
                                        </span>
                                    </a>
                                ))}
                             </div>
                        </div>
                    )}

                    <Link 
                      href={`/${orgSlug}/mail`}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-zinc-100 transition-all active:scale-[0.98]"
                    >
                        Secure Access Inquiry
                    </Link>
                </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white italic">K</div>
            <p className="text-xs font-bold text-zinc-400">Built atop the Kiwiko Engine</p>
        </div>
        <div className="flex items-center gap-8">
            <Link href="#" className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest">Audited Data Only</Link>
            <Link href="#" className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 uppercase tracking-widest">Report Venture</Link>
        </div>
      </footer>
    </div>
  );
};

export default ProjectPublicView;
