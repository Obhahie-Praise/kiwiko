"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileDown, Maximize2, Loader2, Minimize2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const slides = [
  { id: 1, title: "The Problem", content: "Existing solutions are too fragmented and slow for the modern venture lifecycle." },
  { id: 2, title: "The Solution", content: "A unified, agentic platform that accelerates execution from idea to IPO." },
  { id: 3, title: "Market Opportunity", content: "TAM of $50B in the tech venture and private equity infrastructure space." },
  { id: 4, title: "Business Model", content: "SaaS with tiered seats and performance-based bridge financing fees." },
  { id: 5, title: "The Team", content: "Ex-founders and engineers from high-growth tech hubs globally." },
];

interface PitchDeckProps {
  url?: string | null;
}

export default function PitchDeck({ url }: PitchDeckProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Resize observer for responsive PDF
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
       for (const entry of entries) {
         if (entry.contentBoxSize) {
           setContainerDimensions({ 
               width: entry.contentBoxSize[0].inlineSize, 
               height: entry.contentBoxSize[0].blockSize 
           });
         } else {
             setContainerDimensions({ 
                 width: entry.contentRect.width, 
                 height: entry.contentRect.height 
             });
         }
       }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        containerRef.current?.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const next = () => setPageNumber(prev => Math.min(prev + 1, numPages));
  const prev = () => setPageNumber(prev => Math.max(prev - 1, 1));

  if (url) {
      return (
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Pitch Deck</h3>
            <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
            >
              <FileDown size={14} />
              Download PDF
            </a>
          </div>
    
          <div 
            ref={containerRef} 
            className={`relative aspect-video bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl group border-8 border-zinc-100 flex flex-col items-center justify-center ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0 h-screen w-screen aspect-auto' : ''}`}
          >
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Loader2 className="animate-spin text-white w-10 h-10" />}
                className="max-h-full max-w-full flex items-center justify-center"
            >
                <Page 
                    pageNumber={pageNumber} 
                    height={isFullscreen ? window.innerHeight : containerDimensions.height || 500}
                    className="max-h-full max-w-full shadow-2xl"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={<Loader2 className="animate-spin text-white w-8 h-8" />}
                 />
            </Document>

            {/* Controls Overlay */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Top Bar */}
                <div className="flex justify-end pointer-events-auto">
                    <button onClick={toggleFullscreen} className="p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:bg-black/70 transition-colors">
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>

                {/* Bottom Controls */}
                {numPages > 0 && (
                    <div className="pointer-events-auto w-full flex items-center justify-center gap-6">
                         <button onClick={prev} disabled={pageNumber <= 1} className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 backdrop-blur-md transition-all">
                            <ChevronLeft size={24} />
                         </button>
                         
                         <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-white font-mono text-sm font-bold">
                            {pageNumber} / {numPages}
                         </span>

                         <button onClick={next} disabled={pageNumber >= numPages} className="p-3 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 backdrop-blur-md transition-all">
                            <ChevronRight size={24} />
                         </button>
                    </div>
                )}
            </div>
          </div>
        </div>
      );
  }

  // Fallback static slides
  const current = pageNumber - 1; // map 1-indexed to 0-indexed for static array
  
  // NOTE: This fallback logic is slightly broken because I'm reusing pageNumber state for both. 
  // But for now, let's keep the existing structure if no URL.
  // Actually, let's just create a separate simple state for the fallback to avoid confusion, 
  // OR just map pageNumber 1..5 to slides 0..4.
  const staticCurrent = (pageNumber - 1) % slides.length; 

  const nextStatic = () => setPageNumber((prev) => (prev % slides.length) + 1);
  const prevStatic = () => setPageNumber((prev) => ((prev - 2 + slides.length) % slides.length) + 1);

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
        <div className="absolute inset-0 flex items-center justify-center p-12 text-center transition-all duration-500">
          <div key={slides[staticCurrent].id} className="animate-in fade-in slide-in-from-right-8 duration-500">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-4 block">
              Slide {staticCurrent + 1} of {slides.length}
            </span>
            <h4 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">
              {slides[staticCurrent].title}
            </h4>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {slides[staticCurrent].content}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button 
            onClick={prevStatic}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === staticCurrent ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
              />
            ))}
          </div>
          <button 
            onClick={nextStatic}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
