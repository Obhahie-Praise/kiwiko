import Link from "next/link";
import React from "react";

const Page4 = () => {
  return (
    <div className="flex justify-center my-20 overflow-y-hidden h-screen">
      <div className="flex flex-col">
        <h1 className="mt-50 font-bold text-6xl text-shadow-xs bg-linear-to-b text-center from-zinc-300 to-zinc-700 bg-clip-text text-transparent">Welcome to Kiwiko</h1>
        <Link href="/home" className="text-center bg-black rounded-lg text-white font-medium w-ful py-3 mt-10 hover:bg-zinc-800 transition-colors" >Continue to Kiwiko</Link>
      </div>
    </div>
  );
};

export default Page4;
