"use client";
import { ArrowLeft, GithubIcon, LoaderCircle, Zap, ShieldCheck, Globe, Rocket, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthClient from "./auth-client";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

const StartUpOnboarding = () => {
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);
  const [isGithubAuthenticating, setIsGithubAuthenticating] = useState(false);
  const [ongoingRequest, setOngoingRequest] = useState(0);
  const [error, setError] = useState<string | null>();

  const handleSocial = async (provider: "google" | "github") => {
    try {
      if (provider === "google") {
        setIsGoogleAuthenticating(true);
      } else {
        setIsGithubAuthenticating(true);
      }

      await signIn.social({
        provider,
        callbackURL: "/onboarding/setup?page=1",
      });
    } catch (error) {
      console.error("Social authentication failed",error);
      setError("Social authentication failed");
      setOngoingRequest(0);
    } finally {
      setIsGoogleAuthenticating(false);
      setIsGithubAuthenticating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Panel: Protocol Initialization */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 overflow-hidden relative flex-col justify-between p-16">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-800 rounded-full blur-[140px] -z-10 opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] -z-10 opacity-30 animate-pulse" />
        
        {/* Top Section */}
        <div className="relative z-10 flex items-center gap-2 group">
           <Image src="/neutral-logo.svg" alt="logo" width={32} height={32} className="invert group-hover:rotate-12 transition-transform duration-500" />
           <p className="text-2xl font-black italic tracking-tighter uppercase text-white">Kiwiko</p>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 text-white rounded-full border border-zinc-700 text-[10px] font-black uppercase tracking-widest italic">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Initialization Sequence
          </div>
          <h2 className="text-6xl font-black text-white leading-[0.85] uppercase italic tracking-tighter">
            Deploy your <br /> <span className="text-zinc-500">Venture Alias.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-xl leading-relaxed">
            Join the global network of high-momentum builders. Your execution is your only credential.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-zinc-800">
             <div className="space-y-2">
                <Rocket className="text-emerald-500" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Atomic Deployment</p>
             </div>
             <div className="space-y-2">
                <Shield className="text-zinc-400" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity Guard</p>
             </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">
           <span>Protocol Initialization Layer</span>
           <span>SECURE NODE 04</span>
        </div>
      </div>

      {/* Right Panel: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <Link
          href="/"
          className="absolute top-10 left-10 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl hover:bg-zinc-100 transition-all active:scale-95 text-zinc-900 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>

        {<div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter leading-none">
              Get Started.
            </h1>
            <p className="font-bold text-zinc-500">
              Already a verified founder?{" "}
              <Link href="/sign-in" className="text-zinc-900 underline decoration-zinc-200 underline-offset-4 hover:decoration-zinc-900 transition-all">
                Sign In
              </Link>
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              className="relative w-full group overflow-hidden disabled:opacity-60"
              disabled={isGithubAuthenticating || ongoingRequest === 1}
              onClick={() => {
                if (ongoingRequest === 1) return;
                setOngoingRequest(1);
                handleSocial("github");
              }}
            >
              <div className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-3 py-4 border-2 border-zinc-900 rounded-2xl transition-colors group-hover:text-white">
                <GithubIcon size={20} />
                <span className="text-[11px] font-black uppercase tracking-widest">Continue with Github</span>
                {isGithubAuthenticating && <LoaderCircle className="animate-spin" size={16} />}
              </div>
            </button>

            <button
              className="relative w-full group overflow-hidden disabled:opacity-60"
              disabled={isGoogleAuthenticating || ongoingRequest === 1}
              onClick={() => {
                if (ongoingRequest === 1) return;
                setOngoingRequest(1);
                handleSocial("google");
              }}
            >
              <div className="relative flex items-center justify-center gap-3 py-4 border-2 border-zinc-200 rounded-2xl hover:border-zinc-900 transition-all group-hover:bg-zinc-50">
                <Image src="/google.png" alt="google" width={20} height={20} />
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Continue with Google</span>
                {isGoogleAuthenticating && <LoaderCircle className="animate-spin" size={16} />}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="h-px bg-zinc-100 flex-1" />
             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">or continue with</span>
             <div className="h-px bg-zinc-100 flex-1" />
          </div>

          <div className="bg-zinc-50/50 p-2 rounded-[2.5rem] border border-zinc-100">
             <div className="bg-white p-6 rounded-[2rem] border border-zinc-200 shadow-sm">
                <AuthClient />
             </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl">
               <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>
            </div>
          )}
        </div>}
      </div>
    </div>
  );
};

export default StartUpOnboarding;

