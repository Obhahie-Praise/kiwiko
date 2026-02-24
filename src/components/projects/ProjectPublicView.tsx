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
  Gem,
  Crown,
  CheckCircle2,
  FileText,
  Lock
} from "lucide-react";
import PitchDeck from "@/components/projects/PitchDeck";
import Link from "next/link";
import { getLinkIcon, getLinkLabel } from "@/lib/url-utils";
import GithubRepoStats from "@/components/projects/GithubRepoStats";
import GithubCommitList from "@/components/projects/GithubCommitList";
import { Github as GithubIcon, Youtube } from "lucide-react";
import { format } from "date-fns";

interface ProjectPublicViewProps {
    project: any; 
    organization: any;
    orgSlug: string;
    githubData?: any;
    initialCommits?: any[];
    branches?: any[];
}

const ProjectPublicView = ({ 
  project, 
  organization, 
  orgSlug,
  githubData,
  initialCommits,
  branches
}: ProjectPublicViewProps) => {

  const activity = [
    { id: 1, type: "commit", text: "Refactored core engine for concurrency", meta: "v2.1.0", time: "2h ago", icon: Terminal },
    { id: 2, type: "growth", text: "New milestone: 10k monthly active users", meta: "+15% WoW", time: "1d ago", icon: Users },
    { id: 3, type: "feature", text: "Live: Multi-tenant database partitioning", meta: "Production", time: "3d ago", icon: Zap },
    { id: 4, type: "metric", text: "Valuation signal increased to " + (project.postMoneyValuation || "$10M"), meta: "Market adjusted", time: "1w ago", icon: TrendingUp },
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
          className="flex items-center gap-2 p-3 md:px-5 md:py-2 bg-zinc-900 text-white rounded-full text-xs font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-zinc-200 group active:scale-95"
        >
          <Mail size={14} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline" >Connect with Founders</span>
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
        <section className="px-6 max-w-7xl mx-auto mb-32">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="flex-1 min-w-0">
                <div>
                    <h2 className="text-3xl font-black text-zinc-900 tracking-tighter italic capitalize mb-12">Proof of Execution</h2>
                </div>

                {project.githubRepoFullName ? (
                  <>
                    <GithubRepoStats 
                      repoData={githubData} 
                      branchCount={branches?.length || 0} 
                    />
                    <GithubCommitList 
                      repoFullName={project.githubRepoFullName}
                      connectedByUserId={project.githubConnectedBy || ""}
                      initialCommits={initialCommits || []}
                      branches={branches || []}
                    />
                  </>
                ) : (
                  <div className="p-12 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
                    <GithubIcon size={32} className="mx-auto text-zinc-300 mb-4" />
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                      No GitHub repository connected to this project yet.
                    </p>
                  </div>
                )}
            </div>

            <div className="md:w-1/3">
                <div className="p-8 bg-zinc-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <Gem className="absolute -top-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:scale-110 transition-transform duration-700" />
                    <h3 className="text-2xl font-black mb-6 uppercase italic tracking-tighter">Execution Signal</h3>
                    <p className="text-zinc-400 font-medium mb-12 text-sm leading-relaxed">
                        Continuous verification of venture growth through real-time development activity and team contribution metrics.
                    </p>

                    {/* Verified Signals Section */}
                    {project.signals && project.signals.length > 0 && (
                        <div className="mb-12 space-y-4">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={10} className="text-amber-400" />
                                Verified Signals
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {project.signals.map((signal: any) => (
                                    <div 
                                        key={signal.id}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl"
                                    >
                                        {signal.signalType === "GITHUB" && <GithubIcon size={12} className="text-zinc-400" />}
                                        {signal.signalType === "YOUTUBE" && <Youtube size={12} className="text-zinc-400" />}
                                        {signal.signalType === "MANUAL" && <FileText size={12} className="text-zinc-400" />}
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                            {signal.signalType === "GITHUB" ? "Github" : signal.signalType === "YOUTUBE" ? "Youtube" : "Manual"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6 mb-12">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Engineers</span>
                            <span className="text-xl font-black italic tracking-tighter">{githubData?.active_engineers || 1}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Git Momentum</span>
                            <div className="text-right">
                              <span className={`text-xl font-black italic tracking-tighter ${
                                (githubData?.commits_per_week || 0) >= 5 ? "text-emerald-400" :
                                (githubData?.commits_per_week || 0) >= 2 ? "text-blue-400" :
                                "text-zinc-400"
                              }`}>
                                {(githubData?.commits_per_week || 0) >= 5 ? "EXCEPTIONAL" :
                                 (githubData?.commits_per_week || 0) >= 2 ? "HIGH" :
                                 (githubData?.commits_per_week || 0) >= 0.5 ? "STEADY" : "DORMANT"}
                              </span>
                              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">{githubData?.commits_per_week || 0} commits / week</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Weekly Velocity</span>
                            <span className="text-xl font-black italic tracking-tighter text-zinc-100">{githubData?.commits_per_week || 0} units</span>
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
                        <Lock size={14} className="shrink-0" />
                        <span className="hidden md:inline">Secure Access Inquiry</span>
                    </Link>
                </div>
            </div>
          </div>
        </section>

        {/* Meet the Team Section - Full Width */}
        <section className="px-6 max-w-7xl mx-auto mb-32">
           <div className="mb-12">
                <h2 className="text-3xl font-bold text-zinc-900 tracking-tighter flex items-center gap-3"><Users size={24} className="text-zinc-700" /> The Team</h2>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {organization?.members?.sort((a: any, b: any) => {
                 if (a.id === project.createdById) return -1;
                 if (b.id === project.createdById) return 1;
                 return 0;
               }).map((member: any) => (
                <div key={member.id} className={`group p-8 bg-white border border-zinc-200 rounded-2xl transition-all hover:shadow-2xl hover:shadow-zinc-200/50 relative overflow-hidden flex flex-col items-center text-center ${
                  member.status === 'invited' ? 'opacity-70 border-dashed hover:opacity-100' : ''
                }`}>
                   <div className="mb-6 relative">
                      <div className="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50">
                            <Users size={32} />
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="w-full">
                      <h4 className="text-xl font-bold text-zinc-900 tracking-tight capitalize mb-1">{member.name?.toLowerCase()}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 tracking-widest mb-6">
                        {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase() : "Member"}
                      </p>

                      <div className="pt-4 border-t border-zinc-50 flex items-center justify-center w-full">
                        <div className="text-center">
                          <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest leading-none mb-1">{member.status === 'invited' ? 'Status' : 'Joined'}</p>
                          <p className="text-[10px] font-bold text-zinc-500 tracking-widest">
                            {member.status === 'invited' ? 'Pending' : (member.joinedAt ? format(new Date(member.joinedAt), "MMM yyyy") : "Feb 2026")}
                          </p>
                        </div>
                      </div>
                   </div>
                </div>
               ))}
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
