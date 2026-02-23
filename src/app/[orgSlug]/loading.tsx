import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-white pb-20 px-4 md:px-0">
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        {/* Top Navigation Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pt-12">
          <div className="space-y-4">
            <div className="w-32 h-4 bg-zinc-100 rounded-md" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100" />
              <div className="space-y-2">
                <div className="w-48 h-8 bg-zinc-100 rounded-lg" />
                <div className="w-64 h-4 bg-zinc-50 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Banner Skeleton */}
        <div className="relative mb-24 md:mb-20">
          <div className="w-full h-64 md:h-80 bg-zinc-50 rounded-[2.5rem] border border-zinc-100" />
          {/* Logo Skeleton */}
          <div className="absolute -bottom-1/2 -translate-y-1/2 left-8 md:left-12">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-100 border-4 border-white shadow-xl" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
          <div className="lg:col-span-3 space-y-8">
            <div className="h-[400px] bg-white border border-zinc-100 rounded-[2rem] p-8 space-y-6">
                <div className="w-48 h-4 bg-zinc-100 rounded-md" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-12 bg-zinc-50 rounded-2xl" />
                    <div className="h-12 bg-zinc-50 rounded-2xl" />
                </div>
                <div className="h-32 bg-zinc-50 rounded-2xl" />
            </div>
            <div className="h-64 bg-white border border-zinc-100 rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
