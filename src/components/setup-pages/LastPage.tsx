"use client";

import {
  StartupOnboarding,
  submitStartupOnboarding,
} from "@/lib/actions/server-actions";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const LastPage = ({ userRole }: { userRole: string }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  const isComplete = termsAccepted && privacyAccepted;

  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await submitStartupOnboarding({
        consent: isComplete,
        userRole,
      });

      if (!result.success) {
        console.error(result.error);
        setIsLoading(false);
        setError(result.error || "Something went wrong. Please try again");
        return;
      }

      router.push(`/${result.orgSlug}/new-project`);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />

        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black text-xl">
            FIN
          </div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            One Last <br /> <span className="text-zinc-500">Step.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Accept our terms and initialize your protocol into the Kiwiko ecosystem.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
            <ShieldCheck size={16} className="text-emerald-500" />
            Institutional Security Layer
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-y-auto">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">
              Verification Protocol
            </span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">
              Legal Consent.
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-500 font-bold text-lg mb-8 leading-relaxed">
              Please review and accept our legal agreements to proceed.
            </p>

            <div
              onClick={() => setTermsAccepted(!termsAccepted)}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                termsAccepted
                  ? "bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-200"
                  : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  termsAccepted
                    ? "bg-emerald-500 text-white"
                    : "bg-white border border-zinc-300"
                }`}
              >
                {termsAccepted && <CheckCircle2 size={14} />}
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-tight transition-colors ${
                  termsAccepted ? "text-white" : "text-zinc-500"
                }`}
              >
                I accept the Terms of Service
              </span>
            </div>

            <div
              onClick={() => setPrivacyAccepted(!privacyAccepted)}
              className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                privacyAccepted
                  ? "bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-200"
                  : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  privacyAccepted
                    ? "bg-emerald-500 text-white"
                    : "bg-white border border-zinc-300"
                }`}
              >
                {privacyAccepted && <CheckCircle2 size={14} />}
              </div>
              <span
                className={`text-[11px] font-black uppercase tracking-tight transition-colors ${
                  privacyAccepted ? "text-white" : "text-zinc-500"
                }`}
              >
                I accept the Privacy Policy
              </span>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest italic">
              <Info size={14} />
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="pt-10 flex items-center justify-end border-t border-zinc-100">
            <button
              disabled={!isComplete || isLoading}
              onClick={handleFinalSubmit}
              className={`group flex items-center gap-3 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isComplete && !isLoading
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200 hover:bg-black scale-105 active:scale-95"
                  : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  Initializing...
                  <Loader2 size={16} className="animate-spin" />
                </>
              ) : (
                <>
                  Get Started
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastPage;
