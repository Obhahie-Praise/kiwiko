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
    <div className="min-h-screen bg-zinc-50/30">
      {/* Header Section */}
      <nav className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b bg-white/50 backdrop-blur-md sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-zinc-900 text-white rounded-xl">
              <BookOpen size={20} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Venture Resources</h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-12">
            The mission-critical infrastructure and tools powering this venture.
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tools, platforms, or repos..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-zinc-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-400 transition-all font-medium"
          />
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <a 
              key={resource.id}
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-zinc-200 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl shadow-sm ${resource.color}`}>
                  <resource.icon size={24} />
                </div>
                <div className="p-2 rounded-full bg-zinc-50 text-zinc-300 group-hover:text-zinc-900 group-hover:bg-zinc-100 transition-all duration-300">
                  <ExternalLink size={14} />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{resource.category}</span>
                  <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                  <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase">{resource.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-zinc-900 transition-colors uppercase tracking-tight">
                  {resource.name}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                  {resource.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">Launch Resource</span>
                <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all scale-0 group-hover:scale-100">
                  <Zap size={14} fill="currentColor" />
                </div>
              </div>
            </a>
          ))}

          {/* New Resource Suggestion Card */}
          <div className="border-2 border-dashed border-zinc-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-zinc-400 transition-all">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-400 mb-6 group-hover:scale-110 transition-transform">
              <Layers size={32} />
            </div>
            <h4 className="text-lg font-bold text-zinc-900 mb-2">Add New Resource</h4>
            <p className="text-xs text-zinc-500 font-medium">
              Integrate another tool or platform into your venture stack.
            </p>
          </div>
        </div>

        {/* Footer info box */}
        <div className="mt-16 bg-zinc-900 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Proprietary Stack Control</h2>
            <p className="text-zinc-400 max-w-xl text-lg font-medium leading-relaxed">
              These resources are strictly audited and managed by the founding team. 
              The infrastructure is optimized for extreme execution and radical transparency.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <button className="bg-white text-black font-bold px-6 py-3 rounded-2xl text-sm hover:bg-zinc-200 transition-colors shadow-xl">
                Audit Entire Stack
              </button>
              <button className="border border-zinc-700 text-zinc-300 font-bold px-6 py-3 rounded-2xl text-sm hover:bg-zinc-800 transition-colors">
                View Access Logs
              </button>
            </div>
          </div>
          
          <div className="md:w-1/3 flex justify-center opacity-20 relative z-0">
             <Cpu size={240} className="text-white" />
          </div>

          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage;
