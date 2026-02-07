"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { projects } from "@/constants";
import { 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

const ProjectMailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orgSlug = params?.orgSlug as string;
  const project = projects.find(p => p.name.toLowerCase().replace(/\s+/g, "-") === orgSlug);

  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 selection:bg-zinc-900 selection:text-white">
      {/* Back Button */}
      <Link 
        href={`/${orgSlug}`}
        className="fixed top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </Link>

      <div className="max-w-xl w-full">
        {!submitted ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                <Lock size={32} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none mb-2">Connect with {project.name}</h1>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12} className="text-emerald-500" /> Secure Founder Inquiry Line
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-zinc-900 transition-all outline-none focus:ring-4 focus:ring-zinc-900/5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Work Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="jane@partners.vc"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-zinc-900 transition-all outline-none focus:ring-4 focus:ring-zinc-900/5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Inquiry Context</label>
                <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-zinc-900 transition-all outline-none appearance-none">
                    <option>Investment Inquiry</option>
                    <option>Strategic Partnership</option>
                    <option>Media & PR</option>
                    <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Tell us about your background and how you'd like to collaborate..."
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-zinc-900 transition-all outline-none focus:ring-4 focus:ring-zinc-900/5 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] group"
              >
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Dispatch Message
              </button>
            </form>

            <div className="mt-12 flex items-center justify-center gap-12 border-t border-zinc-100 pt-12">
                <div className="flex flex-col items-center gap-2">
                    <Sparkles size={20} className="text-zinc-300" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center">AI Prioritized</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Lock size={20} className="text-zinc-300" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center">End-to-End Encrypted</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <MessageSquare size={20} className="text-zinc-300" />
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest text-center">High Certainty</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
                <CheckCircle2 size={48} strokeWidth={1} />
            </div>
            <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none mb-4">Message Dispatched</h2>
            <p className="text-zinc-500 font-bold max-w-sm mx-auto mb-10">
                Your inquiry has been encrypted and prioritized. Someone from the {project.name} founding team will reach out shortly.
            </p>
            <button 
              onClick={() => router.push(`/${orgSlug}`)}
              className="px-12 py-4 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all active:scale-95"
            >
                Return to Venture Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMailPage;
