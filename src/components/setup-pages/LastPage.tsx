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

const LastPage = ({
  position,
  userRole,
  catergory,
  projectDesc,
  projectName,
  theProblem,
  theSolution,
  stage,
  linkToProduct,
  userCount,
  revenue,
  teamSize,
  leaderStatus,
  fundsSeekingStatus,
  fundingStage,
  consent,
  setConsent,
}: StartupOnboarding) => {
  const [infoisaccurate, setinfoisaccurate] = useState(false);
  const [sharingisallowed, setsharingisallowed] = useState(false);
  const [fundingsnotguaranteed, setfundingsnotguaranteed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const router = useRouter();

  const isComplete =
    infoisaccurate && sharingisallowed && fundingsnotguaranteed;

  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const handleFinalSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await submitStartupOnboarding({
        userRole,
        projectName,
        projectDesc,
        catergory,
        theProblem,
        theSolution,
        stage,
        linkToProduct,
        userCount,
        revenue,
        teamSize,
        leaderStatus,
        fundsSeekingStatus,
        fundingStage,
        consent,
      });

      if (!result.success) {
        console.error(result.error);
        setIsLoading(false);
        setError("Something went wrong. Please try again");
        return;
      }

      router.push("/kiwiko-corp/projects");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
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
            Final <br /> <span className="text-zinc-500">Validation.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            One last step to initialize your protocol into the Kiwiko ecosystem.
            Clarity is the final signal.
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
              Initialization.
            </h1>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-500 font-bold text-lg mb-8 leading-relaxed">
              Please confirm the following to complete your onboarding into the
              Kiwiko Venture Engine.
            </p>

            {[
              {
                id: "info-is-accurate",
                label: "I confirm this project information is accurate",
                state: infoisaccurate,
                setState: setinfoisaccurate,
              },
              {
                id: "sharing-is-allowed",
                label:
                  "I consent to sharing this project with verified investors",
                state: sharingisallowed,
                setState: setsharingisallowed,
              },
              {
                id: "funding-not-guaranteed",
                label: "I understand funding is not guaranteed",
                state: fundingsnotguaranteed,
                setState: setfundingsnotguaranteed,
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => item.setState(!item.state)}
                className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                  item.state
                    ? "bg-zinc-900 border-zinc-900 shadow-xl shadow-zinc-200"
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    item.state
                      ? "bg-emerald-500 text-white"
                      : "bg-white border border-zinc-300"
                  }`}
                >
                  {item.state && <CheckCircle2 size={14} />}
                </div>
                <span
                  className={`text-[11px] font-black uppercase tracking-tight transition-colors ${
                    item.state ? "text-white" : "text-zinc-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest italic">
              <Info size={14} />
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="pt-10 flex items-center justify-between border-t border-zinc-100">
            <Link
              href={`/onboarding/setup?page=8`}
              className="group flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                <ChevronLeft size={16} />
              </div>
              Back
            </Link>

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
                  Finish
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
