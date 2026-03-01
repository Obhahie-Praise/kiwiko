"use client";

import React, { useState } from "react";
import { LoaderCircle, Mail, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { teamInviteSignInAction } from "@/actions/auth.actions";

export default function TeamSignInForm() {
    const [email, setEmail] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);
        setError(null);

        try {
            const res = await teamInviteSignInAction(email);
            if (res.success && res.data) {
                // Check if we should redirect to participation or overview
                if ((res.data as any).redirectToParticipation) {
                    router.push(`/project-participation`);
                } else {
                    router.push(`/${res.data.orgSlug}/${res.data.projectSlug}/overview`);
                }
            } else {
                setError(res.error || "Failed to sign in. Please check your email.");
                setIsAuthenticating(false);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setIsAuthenticating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="team-email" className="text-sm font-black uppercase tracking-widest text-zinc-500">
                    Invited Email
                </label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                    <input
                        id="team-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@invited-email.com"
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:border-zinc-900 focus:bg-white transition-all outline-none text-sm font-bold placeholder:text-zinc-400"
                        required
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-red-600 animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isAuthenticating || !email}
                className="relative w-full group overflow-hidden bg-zinc-900 text-white rounded-2xl py-4 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
                <div className="relative flex items-center justify-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest">
                        {isAuthenticating ? "Verifying Invite..." : "Sign in as Team Member"}
                    </span>
                    {isAuthenticating ? (
                        <LoaderCircle className="animate-spin" size={16} />
                    ) : (
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    )}
                </div>
            </button>
            
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center px-4">
                This is a development shortcut for invited team members.
            </p>
        </form>
    );
}
