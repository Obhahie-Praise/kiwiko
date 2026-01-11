import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-screen fixed top-0 left-0 backdrop-blur-xl border-b-2 border-zinc-300 z-50 flex items-center justify-between py-2 px-12 font-medium">
      <h1 className="flex items-center gap-2 text-3xl text-zinc-950">
        <Image src="/neutral-logo.svg" alt="Kiwiko Logo" width={40} height={40} className="" />
        <p className="">kiwiko</p>
      </h1>
      <nav className="space-x-8">
        <Link className="hover:text-zinc-500 transition-colors" href="/">Home</Link>
        <Link className="hover:text-zinc-500 transition-colors" href="#activity">Activity</Link>
        <Link className="hover:text-zinc-500 transition-colors" href="#features">Features</Link>
        <Link className="hover:text-zinc-500 transition-colors" href="#testimonials">Testimonials</Link>
        <Link className="hover:text-zinc-500 transition-colors" href="/resources">Resources</Link>
      </nav>
      <div className="space-x-6">
        <Link href="/sign-in" className="py-2 px-4 border-2 border-zinc-200 hover:border-zinc-400 text-black hover:text-zinc-500 rounded-lg transition-colors">Login</Link>
        <Link href="/sign-up" className="py-2 px-4 border-2 bg-black border-black hover:bg-zinc-800 hover:border-zinc-800 text-white hover:text-zinc-400 transition-colors rounded-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
