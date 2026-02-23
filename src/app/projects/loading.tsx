import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Navbar Skeleton */}
      <div className="h-14 border-b bg-white flex items-center justify-between px-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-zinc-100 rounded-lg" />
          <div className="w-24 h-4 bg-zinc-100 rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-32 h-8 bg-zinc-100 rounded-md" />
          <div className="w-8 h-8 bg-zinc-100 rounded-full" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="px-6 pt-12 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="space-y-4">
            <div className="w-48 h-10 bg-zinc-100 rounded-xl" />
            <div className="w-96 h-4 bg-zinc-50 rounded-md" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-zinc-50 border border-zinc-100 rounded-[2rem]" />
            ))}
        </div>

        {/* Search & Tabs Skeleton */}
        <div className="flex items-center justify-between pt-12 border-b border-zinc-100 pb-4">
            <div className="flex gap-8">
                <div className="w-20 h-4 bg-zinc-100 rounded-md" />
                <div className="w-20 h-4 bg-zinc-50 rounded-md" />
            </div>
            <div className="w-64 h-10 bg-zinc-50 rounded-xl" />
        </div>

        {/* Table/Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white border border-zinc-100 rounded-3xl" />
            ))}
        </div>
      </div>
    </div>
  );
}
