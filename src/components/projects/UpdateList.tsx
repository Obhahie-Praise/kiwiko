"use client";

import React from "react";
import { Calendar, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectUpdate {
    id: string;
    title: string;
    details: string;
    imageUrl?: string | null;
    createdAt: Date | string;
}

interface UpdateListProps {
    updates: ProjectUpdate[];
}

const UpdateList = ({ updates }: UpdateListProps) => {
    if (updates.length === 0) {
        return (
            <div className="bg-white border-[0.1px] border-zinc-200 rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 special-font tracking-wide">No updates yet</h3>
                <p className="text-zinc-500 text-sm mt-1 max-w-xs mx-auto">
                    Start posting manual updates to keep your team and investors informed about your progress.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest px-1">Previous Updates</h3>
            <div className="grid grid-cols-1 gap-6">
                {updates.map((update) => (
                    <div 
                        key={update.id} 
                        className="bg-white border-[0.1px] border-zinc-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h4 className="text-lg font-bold text-zinc-900 special-font tracking-wide group-hover:text-zinc-700 transition-colors">
                                        {update.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                                        <Calendar size={12} />
                                        <span>{formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {update.details}
                            </p>

                            {update.imageUrl && (
                                <div className="mt-6 rounded-lg overflow-hidden border border-zinc-100 relative max-h-[400px]">
                                    <img 
                                        src={update.imageUrl} 
                                        alt={update.title} 
                                        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="px-6 py-3 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400">Shipped</span>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpdateList;
