import React from "react";
import { 
  BookOpen, 
  Search, 
  Cpu, 
  Globe, 
  Code2, 
  Share2, 
  Database, 
  Zap, 
  Github, 
  Twitter, 
  ExternalLink,
  Layers,
  Terminal,
  Cloud,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const resources = [
  {
    id: "r1",
    name: "Antigravity",
    category: "Development",
    description: "Primary agentic AI coding assistant and IDE choice for high-speed ship cycles.",
    icon: Terminal,
    link: "https://antigravity.ai",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    badge: "Active IDE"
  },
  {
    id: "r2",
    name: "GitHub Repository",
    category: "Development",
    description: "Main source code repository housing the kiwiko monorepo and microservices.",
    icon: Github,
    link: "https://github.com",
    color: "bg-zinc-900 text-white border-zinc-800",
    badge: "Connected"
  },
  {
    id: "r3",
    name: "Neon Database",
    category: "Infrastructure",
    description: "Serverless Postgres database powering real-time analytics and persistence.",
    icon: Database,
    link: "https://neon.tech",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    badge: "Production"
  },
  {
    id: "r4",
    name: "Vercel Edge",
    category: "Infrastructure",
    description: "Deployment pipeline and edge network for global low-latency delivery.",
    icon: Cloud,
    link: "https://vercel.com",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    badge: "Deployed"
  },
  {
    id: "r5",
    name: "X (Social Presence)",
    category: "Social",
    description: "Main channel for product updates, changelogs, and community engagement.",
    icon: Twitter,
    link: "https://x.com",
    color: "bg-sky-50 text-sky-600 border-sky-100",
    badge: "Official"
  },
  {
    id: "r6",
    name: "Slack Connect",
    category: "Operations",
    description: "Cross-functional communication hub for founders and early investors.",
    icon: MessageSquare,
    link: "https://slack.com",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    badge: "Internal"
  },
  {
    id: "r7",
    name: "Stripe Connect",
    category: "Infrastructure",
    description: "Financial infrastructure for processing global payouts and funding rounds.",
    icon: Zap,
    link: "https://stripe.com",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    badge: "Verified"
  },
  {
    id: "r8",
    name: "PostHog",
    category: "Operations",
    description: "All-in-one product suite for event tracking and session recording.",
    icon: Layers,
    link: "https://posthog.com",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    badge: "Tracking"
  }
];

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50/20">
      <main className="p-8 max-w-7xl mx-auto">
        {/* New Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-zinc-900 special-font tracking-tight">
              Venture Resources
            </h1>
            <p className="text-zinc-500 font-medium max-w-md">
              Manage your technical stack, infrastructure, and social presence.
            </p>
          </div>

          <div className="relative group w-full md:w-96">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search tools, platforms, or repos..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all font-medium shadow-sm hover:border-zinc-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <a 
              key={resource.id}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-zinc-200 rounded-[2.5rem] p-7 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full animate-in fade-in zoom-in-95 duration-700"
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`p-5 rounded-2xl shadow-sm ${resource.color} transition-transform group-hover:scale-110 duration-500`}>
                  <resource.icon size={28} />
                </div>
                <div className="p-2.5 rounded-full bg-zinc-50 text-zinc-300 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-all duration-300">
                  <ExternalLink size={16} />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{resource.category}</span>
                  <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full" />
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase border border-emerald-100 bg-emerald-50/50 px-2 py-0.5 rounded-full">{resource.badge}</span>
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 mb-4 group-hover:text-zinc-900 transition-colors special-font tracking-tight">
                  {resource.name}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  {resource.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between">
                <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-900 transition-all duration-300 italic group-hover:not-italic">Launch Resource</span>
                <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all scale-0 group-hover:scale-100 duration-500 shadow-xl shadow-zinc-900/20">
                  <Zap size={16} fill="currentColor" />
                </div>
              </div>
            </a>
          ))}

          {/* New Resource Suggestion Card */}
          <div className="border-2 border-dashed border-zinc-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/10 transition-all duration-500 animate-in fade-in zoom-in-95 duration-1000">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-emerald-500/20">
              <Plus size={36} />
            </div>
            <h4 className="text-xl font-bold text-zinc-900 mb-2 special-font">New Resource</h4>
            <p className="text-xs text-zinc-500 font-medium max-w-[180px]">
              Integrate another tool or platform into your venture stack.
            </p>
          </div>
        </div>

        {/* Footer info box */}
        <div className="mt-20 bg-zinc-950 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative shadow-2xl shadow-zinc-900/30">
          <div className="relative z-10 w-full md:w-2/3">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight special-font italic">
              Proprietary Stack Control
            </h2>
            <p className="text-zinc-400 max-w-xl text-lg font-medium leading-relaxed opacity-80">
              These resources are strictly audited and managed by the founding team. 
              The infrastructure is optimized for extreme execution and radical transparency.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <button className="w-full sm:w-auto bg-white text-zinc-950 font-bold px-8 py-4 rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Audit Entire Stack
              </button>
              <button className="w-full sm:w-auto border border-zinc-800 text-zinc-400 font-bold px-8 py-4 rounded-2xl text-sm hover:bg-zinc-900 hover:text-white transition-all">
                View Access Logs
              </button>
            </div>
          </div>
          
          <div className="md:w-1/3 flex justify-center opacity-10 relative z-0 transition-all group-hover:opacity-20">
             <Cpu size={280} className="text-white animate-pulse duration-[4000ms]" />
          </div>

          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
