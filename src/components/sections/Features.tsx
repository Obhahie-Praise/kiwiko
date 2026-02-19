"use client"
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  Activity as ActivityIcon, 
  BarChart3, 
  Code2, 
  Layers,
  Fingerprint
} from "lucide-react";
import Image from "next/image";
import { ScrollParallax } from "react-just-parallax";
import MagneticCursor from "../Magnetic";

const Features = () => {
  return (
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-zinc-100 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-50/50 rounded-full blur-[120px] -z-10 opacity-30" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-24 px-6">
        <div className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-900 text-white rounded-full border border-zinc-800 mb-4 italic">
          Features
        </div>
        <h2 className="text-5xl md:text-5xl font-black tracking-tighter text-zinc-900 mb-4 uppercase italic leading-[0.85]">
          What's in it <br /> <span className="text-zinc-400">for you?</span>
        </h2>
        <p className="text-zinc-500 font-bold max-w-2xl text-lg leading-relaxed">
          The noise-free operating system for high-momentum founders and high-conviction investors.
        </p>
      </div>

      <div className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 1. Real-time Execution (8 cols) */}
          <div className="md:col-span-8 group bg-white border border-zinc-200 rounded-[3rem] p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-[450px]">
             <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white mb-8 shadow-xl shadow-zinc-200">
                   <Code2 size={24} />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tighter uppercase italic">
                  Real-Time <br /> Execution Logs
                </h3>
                <p className="text-zinc-500 font-bold max-w-sm mb-8">
                  Verifiable proof of progress. Track git momentum, feature shipping, and technical milestones as they happen.
                </p>
             </div>

             <div className="relative h-32 flex items-center gap-4 overflow-hidden mask-fade-right">
                <ScrollParallax strength={0.09}>
                   <div className="flex gap-4 mt-4">
                      {["git commits", "deployment", "v2.1 live", "core architecture", "database migration", "auth logic"].map((tag, i) => (
                        <div key={i} className="whitespace-nowrap px-6 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 transition-all cursor-default">
                          {tag}
                        </div>
                      ))}
                   </div>
                </ScrollParallax>
             </div>

             {/* UI Element Mockup */}
             <div className="absolute top-10 -right-20 w-80 h-80 bg-linear-to-bl from-zinc-50 to-white border border-zinc-100 rounded-3xl p-6 shadow-2xl transition-transform group-hover:-translate-x-10 duration-700 rotate-12 group-hover:rotate-6">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-3 h-3 rounded-full bg-red-400" />
                   <div className="w-3 h-3 rounded-full bg-amber-400" />
                   <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="space-y-4">
                   <div className="h-2 w-3/4 bg-zinc-100 rounded-full" />
                   <div className="h-2 w-1/2 bg-zinc-100 rounded-full" />
                   <div className="h-2 w-full bg-zinc-900 rounded-full opacity-10" />
                   <div className="h-2 w-2/3 bg-zinc-100 rounded-full" />
                   <div className="h-2 w-5/6 bg-emerald-100 rounded-full" />
                </div>
             </div>
          </div>

          {/* 2. Growth Metrics (4 cols) */}
          <div className="md:col-span-4 group bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-[450px]">
             <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-zinc-900 mb-8">
                   <BarChart3 size={24} />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">
                   Hard <br /> Numbers.
                </h3>
                <p className="text-zinc-500 font-bold">
                   User growth, churn rates, and MRR signals verified by agentic analysis.
                </p>
             </div>

             <div className="mt-12">
                <div className="flex items-end gap-2 h-32">
                   {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                     <div 
                        key={i} 
                        style={{ height: `${h}%` }} 
                        className="flex-1 bg-white/10 rounded-t-lg group-hover:bg-emerald-500/50 transition-all duration-700" 
                     />
                   ))}
                </div>
                <div className="mt-4 flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                   <span>JAN</span>
                   <span>JUN</span>
                   <span>DEC</span>
                </div>
             </div>
          </div>

          {/* 3. Founder Integrity (5 cols) */}
          <div className="md:col-span-5 group bg-white border border-zinc-200 rounded-[3rem] p-10 transition-all duration-700 relative overflow-hidden flex flex-col h-[400px]">
             <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 mb-8 border border-zinc-200">
                   <Target size={24} />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tighter uppercase italic">
                  No Noise. <br /> Just Signal.
                </h3>
                <p className="text-zinc-500 font-bold">
                  No engagement farming. No followers. No algorithmic manipulation. Just progress updates from the people building the future.
                </p>
             </div>
             
             <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Layers size={300} strokeWidth={1} />
             </div>
          </div>

          {/* 4. Institutional Reality (7 cols) */}
          <div className="md:col-span-7 group bg-zinc-50 border border-zinc-200 rounded-[3rem] p-10 transition-all duration-700 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center h-[400px]">
             <div className="flex-1 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mb-8 shadow-xl shadow-emerald-100">
                   <ShieldCheck size={24} />
                </div>
                <h3 className="text-3xl font-black text-zinc-900 mb-4 tracking-tighter uppercase italic">
                  Cryptographic <br /> Integrity
                </h3>
                <p className="text-zinc-500 font-bold">
                  Every update is timestamped and verified. We create a shared reality of execution that investors can trust without the friction of reporting.
                </p>
             </div>

             <div className="w-full md:w-1/2 relative h-full flex items-center justify-center">
                <div className="relative">
                   <div className="w-40 h-40 rounded-full border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                      <Fingerprint size={80} className="text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                   </div>
                   <div className="absolute -top-4 -right-4 bg-white border border-zinc-200 p-3 rounded-2xl shadow-xl animate-bounce">
                      <ShieldCheck size={20} className="text-emerald-500" />
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* Floating Accents */}
        <ScrollParallax isAbsolutelyPositioned strength={0.1}>
          <MagneticCursor className="absolute top-1/4 -left-20 bg-white/70 backdrop-blur-xl border border-zinc-200 text-zinc-900 rounded-full font-black uppercase text-[10px] tracking-widest px-6 py-3 shadow-2xl rotate-12">
            Verified Reality
          </MagneticCursor>
        </ScrollParallax>

        <ScrollParallax isAbsolutelyPositioned strength={0.15}>
          <MagneticCursor className="absolute bottom-1/4 -right-20 bg-zinc-900 text-white rounded-full font-black uppercase text-[10px] tracking-widest px-6 py-3 shadow-2xl -rotate-12">
            Proof of Work
          </MagneticCursor>
        </ScrollParallax>
      </div>
    </section>
  );
};

export default Features;

