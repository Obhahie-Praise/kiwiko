"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileDown, Maximize2 } from "lucide-react";

const slides = [
  { id: 1, title: "The Problem", content: "Existing solutions are too fragmented and slow for the modern venture lifecycle." },
  { id: 2, title: "The Solution", content: "A unified, agentic platform that accelerates execution from idea to IPO." },
  { id: 3, title: "Market Opportunity", content: "TAM of $50B in the tech venture and private equity infrastructure space." },
  { id: 4, title: "Business Model", content: "SaaS with tiered seats and performance-based bridge financing fees." },
  { id: 5, title: "The Team", content: "Ex-founders and engineers from high-growth tech hubs globally." },
];

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Pitch Deck</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200">
          <FileDown size={14} />
          Download PDF
        </button>
      </div>

      <div className="relative aspect-video bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl group border-8 border-zinc-100">
        {/* Slides */}
        <div className="absolute inset-0 flex items-center justify-center p-12 text-center transition-all duration-500">
          <div key={slides[current].id} className="animate-in fade-in slide-in-from-right-8 duration-500">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-4 block">
              Slide {current + 1} of {slides.length}
            </span>
            <h4 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
              {slides[current].title}
            </h4>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {slides[current].content}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button 
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
              />
            ))}
          </div>
          <button 
            onClick={next}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Fullscreen hint */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
