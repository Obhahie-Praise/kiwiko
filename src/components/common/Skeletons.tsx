
import React from 'react';
import { Skeleton } from "@/components/lightswind/skeleton";
import Navbar from "@/components/common/Navbar";

export function OrgDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 px-6 w-full max-w-5xl mx-auto space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
                 {/* Back Link */}
                <Skeleton className="h-4 w-32 mb-4" />
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <Skeleton className="w-16 h-16 rounded-2xl" />
                    <div>
                        {/* Title */}
                        <Skeleton className="h-8 w-48 mb-2" />
                        {/* Subtitle */}
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>
            {/* Buttons area */}
            <div className="flex gap-2">
                 <Skeleton className="h-10 w-32 rounded-full" />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
                 {/* Identity Card */}
                <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
                    <div className="flex justify-between">
                         <Skeleton className="h-4 w-32" />
                         <Skeleton className="h-6 w-48 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-24 w-full rounded-2xl" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-3 w-24" />
                        <div className="flex gap-2">
                             <Skeleton className="h-8 w-20 rounded-xl" />
                             <Skeleton className="h-8 w-24 rounded-xl" />
                             <Skeleton className="h-8 w-16 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Members Card */}
                <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
                     <Skeleton className="h-4 w-40 mb-4" />
                     <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="flex items-center gap-4">
                                     <Skeleton className="w-10 h-10 rounded-xl" />
                                     <div>
                                         <Skeleton className="h-4 w-32 mb-1" />
                                          <div className="flex gap-2">
                                              <Skeleton className="h-4 w-16 rounded-md" />
                                              <Skeleton className="h-4 w-12" />
                                          </div>
                                     </div>
                                </div>
                                 <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                {/* Visual Identity */}
                <div className="bg-zinc-900 rounded-[2.5rem] p-8 h-64 relative overflow-hidden">
                     <Skeleton className="h-6 w-32 mb-6 bg-zinc-800" />
                     <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
                     <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                </div>
                 {/* Audit Status */}
                <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 h-48">
                    <Skeleton className="h-4 w-32 mb-4 bg-emerald-100" />
                     <div className="space-y-4">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24 bg-emerald-100" />
                            <Skeleton className="h-3 w-16 bg-emerald-100" />
                        </div>
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24 bg-emerald-100" />
                            <Skeleton className="h-3 w-16 bg-emerald-100" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
       <Navbar showNewOrgButton={false} />
       <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-y-auto w-full">
           <div className="w-full max-w-3xl mx-auto space-y-8">
               <div className="mb-8">
                   {/* Back Link */}
                   <Skeleton className="h-4 w-32 mb-4" />
                   {/* Title */}
                   <Skeleton className="h-8 w-64 mb-2" />
                   {/* Subtitle */}
                   <Skeleton className="h-4 w-96" />
               </div>

                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                    {/* Banner */}
                    <div className="h-48 bg-zinc-50 border-b border-zinc-100 relative">
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Skeleton className="h-12 w-12 rounded-full" />
                         </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 border-b border-zinc-100 space-y-6">
                        {/* Section Header */}
                        <Skeleton className="h-5 w-40" />

                        <div className="flex items-center gap-4">
                             {/* Logo Upload */}
                             <Skeleton className="w-24 h-24 rounded-lg" />
                             <div className="space-y-2 flex-1">
                                 <Skeleton className="h-4 w-full" />
                                 <Skeleton className="h-4 w-2/3" />
                             </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                             <div className="col-span-2 space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Another Section */}
                    <div className="p-6 border-b border-zinc-100 space-y-6">
                        <Skeleton className="h-5 w-40" />
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-32" />
                             <Skeleton className="h-24 w-full rounded-lg" />
                        </div>
                    </div>
                </div>
           </div>
       </div>
    </div>
  );
}

export function ProjectsDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                     <Skeleton className="h-8 w-48" />
                     <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm h-64 p-6 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-lg" />
                                <div>
                                    <Skeleton className="h-5 w-32 mb-1" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="pt-4 mt-auto">
                                <Skeleton className="h-8 w-full rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
