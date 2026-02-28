"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { revalidatePathAction } from "@/actions/revalidate.actions";

interface RefreshButtonProps {
    path: string;
}

export default function RefreshButton({ path }: RefreshButtonProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await revalidatePathAction(path);
            window.dispatchEvent(new Event("refresh-activities"));
            router.refresh();
        } finally {
            // Add a small delay for the animation to be visible
            setTimeout(() => {
                setIsRefreshing(false);
            }, 600);
        }
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="absolute top-4 left-6 z-40 p-2 bg-white/80 backdrop-blur-sm border border-zinc-200 rounded-xl shadow-sm hover:bg-white hover:border-zinc-300 transition-all text-zinc-500 hover:text-zinc-900 group active:scale-95 disabled:opacity-50"
            title="Refresh dashboard data"
        >
            <RefreshCw 
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} 
            />
        </button>
    );
}
