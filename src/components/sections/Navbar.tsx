import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-screen fixed top-0 left-0 bg-white border-b-2 z-50 flex items-center justify-between px-12 font-medium">
      <h1 className="">
        <Image src="/logo.svg" alt="Kiwiko Logo" width={170} height={110} />
      </h1>
      <nav className="space-x-8">
        <Link href="/">Home</Link>
        <Link href="/startups">Startups</Link>
        <Link href="#testimonials">Testimonials</Link>
        <Link href="/resources">Resources</Link>
      </nav>
      <div className="space-x-6">
        <Link href="/login" className="py-2 px-6 border-2 border-zinc-300 hover:border-zinc-700 rounded-lg transition-colors">Login</Link>
        <Link href="/signup" className="py-2 px-6 border-2 bg-lime-500 border-lime-500 hover:bg-lime-600 hover:border-lime-600 text-white transition-colors rounded-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
