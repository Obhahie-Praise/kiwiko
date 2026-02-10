"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { projects } from "@/constants";
import { organizations } from "@/components/common/Navbar";
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
import OrgControlCenter from "@/components/organization/OrgControlCenter";
import Navbar from "@/components/common/Navbar";

const PublicProjectProfile = () => {
  const params = useParams();
  const router = useRouter();
  const orgSlug = params?.orgSlug as string;

  // Find the project - mapping name to slug
  const project = projects.find(p => p.name.toLowerCase().replace(/\s+/g, "-") === orgSlug);
  const organization = organizations.find(o => o.slug === (project?.orgSlug || orgSlug));

  // If it's an organization (and not a project being viewed), show the Control Center
  const isOrg = organizations.some(o => o.slug === orgSlug);
  
  if (isOrg && !project) {
    // Mock data for the organization control center
    const mockOrgData = {
      name: organization?.name || "Kiwiko Corp",
      slug: orgSlug,
      niche: "AI/ML",
      description: "Building the next generation of verifiable venture infrastructure. Ground-truth metrics for the next decade of innovation.",
      logoUrl: "",
      members: [
        { id: "1", email: "praise@kiwiko.io", role: "OWNER", status: "active" as const },
        { id: "2", email: "engineering@kiwiko.io", role: "ADMIN", status: "active" as const },
        { id: "3", email: "growth@kiwiko.io", role: "MEMBER", status: "invited" as const },
      ]
    };

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-12 px-6">
          <OrgControlCenter initialData={mockOrgData} />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h1 className="text-4xl font-black text-zinc-900 mb-4">404</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Venture not found.</p>
          <Link href="/" className="mt-8 inline-block text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1">Return Home</Link>
        </div>
      </div>
    );
  }

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
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-lg p-1 shadow-inner">
                {project.name.charAt(0)}
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

      {/* Hero Section with Full-width Banner Background */}
      <main className="pt-24 pb-20 overflow-x-hidden">
        {/* Banner Container */}
        <section className="relative w-full h-[500px] flex items-center mb-20 overflow-hidden">
          {/* Background Image/Banner */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
              style={{ 
                backgroundImage: `url(${project.bannerUrl || 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop'})`,
              }}
            />
            {/* Glossy Overlay for Readability */}
            <div className="absolute inset-0 bg-linear-to-b from-white/80 via-white/40 to-white/95 backdrop-blur-[2px]" />
          </div>

          {/* Centered Content */}
          <div className="relative z-10 w-full px-6 max-w-7xl mx-auto">
            <div className="pt-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-md text-emerald-700 rounded-full border border-emerald-100/50 mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest">{project.stage}</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.85] mb-12 italic uppercase drop-shadow-sm">
                {project.tagline ? (
                  <>
                    {project.tagline.split(" ").slice(0, 3).join(" ")} <br />
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-500">
                      {project.tagline.split(" ").slice(3).join(" ")}
                    </span>
                  </>
                ) : (
                  <>
                    The future of <span className="bg-clip-text text-transparent bg-linear-to-r from-zinc-900 to-zinc-500">Infrastructure</span> <br /> is built here.
                  </>
                )}
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t pt-12 border-zinc-200/50">
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-900">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">The Problem</h3>
                      <p className="text-lg font-bold leading-relaxed italic">
                        Venture data is siloed, fragmented, and lacks real-time verification. Investors fly blind while founders drown in reporting.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">The Solution</h3>
                      <p className="text-lg  font-bold leading-relaxed">
                        A verifiable, agent-driven infrastructure that provides ground-truth metrics of execution at every stage of the lifecycle.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between p-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/20">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                      Current Valuation <ShieldCheck size={12} className="text-emerald-500" />
                    </h3>
                    <p className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">{project.valuation}</p>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-tight">Estimated Post-Money Market Signal</p>
                  </div>
                  <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
                      <span className="px-3 py-1 bg-white/60 border border-white/80 rounded-lg text-[10px] font-bold text-zinc-600 whitespace-nowrap backdrop-blur-sm">BOOTSTRAPPED</span>
                      <span className="px-3 py-1 bg-white/60 border border-white/80 rounded-lg text-[10px] font-bold text-zinc-600 whitespace-nowrap backdrop-blur-sm">SERIES {project.id === 'p1' ? 'A' : 'SEED'}</span>
                      <span className="px-3 py-1 bg-white/60 border border-white/80 rounded-lg text-[10px] font-bold text-zinc-500 whitespace-nowrap backdrop-blur-sm">+20% MOM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pitch Deck Section */}
        <section className="bg-zinc-50 py-24 mb-20 overflow-hidden">
          <div className="px-6 max-w-7xl mx-auto">
            <PitchDeck />
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
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Engineers</span>
                            <span className="text-xl font-black italic tracking-tighter">12</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Git Momentum</span>
                            <span className="text-xl font-black italic tracking-tighter text-emerald-400">EXCEPTIONAL</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">User Sentiment</span>
                            <span className="text-xl font-black italic tracking-tighter text-emerald-400">98%</span>
                        </div>
                    </div>

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

export default PublicProjectProfile;
