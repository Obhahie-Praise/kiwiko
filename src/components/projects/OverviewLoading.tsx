"use client";

import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 p-6 w-full auto-rows-min max-w-7xl mx-auto animate-pulse">
      <div className="grid grid-cols-4 gap-4 col-span-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border-[0.1px] border-zinc-100 rounded-2xl p-5 h-[110px]" />
        ))}
      </div>
      <div className="col-span-12 h-64 bg-white border border-zinc-100 rounded-2xl" />
      <div className="col-span-4 h-96 bg-white border border-zinc-100 rounded-2xl" />
      <div className="col-span-8 h-96 bg-white border border-zinc-100 rounded-2xl" />
    </div>
  );
}
