"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "py-2" : "py-2"
    }`}>
      <div className={`max-w-[1400px] mx-auto transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-zinc-200/70 shadow-sm rounded-2xl h-14" 
          : "bg-transparent border-transparent rounded-none h-16"
      } border flex items-center justify-between px-10 relative`}>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group z-10">
           <Image 
              src="/neutral-logo.svg" 
              alt="Kiwiko Logo" 
              width={28} 
              height={28} 
              className="group-hover:rotate-12 transition-transform duration-500" 
           />
           <p className="text-xl font-bold tracking-tighter hero-font text-zinc-900">Kiwiko</p>
        </Link>

        {/* Navigation - Centered */}
        <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {["Product", "Customer", "Pricing", "Resources", "Company"].map((item) => (
            <Link 
              key={item}
              className="relative text-sm font-medium text-zinc-500 hover:text-orange-500 transition-colors" 
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Actions - Right */}
        <div className="flex items-center gap-4 z-10">
          <Link 
            href="/sign-in" 
            className="text-xs font-bold uppercase tracking-widest text-white bg-zinc-900 px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

