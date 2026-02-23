import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ChevronRight } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed top-4 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto backdrop-blur-2xl bg-white/60 border border-zinc-200/70 rounded-[2rem] h-16 flex items-center justify-between px-10 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
           <Image 
              src="/neutral-logo.svg" 
              alt="Kiwiko Logo" 
              width={25} 
              height={25} 
              className="group-hover:rotate-12 transition-transform duration-500" 
           />
           <p className="text-lg font-black italic tracking-tighter uppercase">Kiwiko</p>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Activity", "Features", "Testimonials", "Resources"].map((item) => (
            <Link 
              key={item}
              className="relative text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors" 
              href={item === "Resources" ? "/resources" : `#${item.toLowerCase()}`}
            >
              {item}
              {item === "Resources" && (
                <span className="absolute -top-3 -right-6 px-1.5 py-0.5 bg-zinc-100 text-zinc-400 text-[8px] rounded font-bold uppercase tracking-tighter">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/sign-in" 
            className="text-[10px] font-black uppercase tracking-widest text-zinc-900 px-4 py-2 hover:bg-zinc-100 rounded-xl transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/onboarding" 
            className="bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-zinc-200"
          >
            Get Started
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

