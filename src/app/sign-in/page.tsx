"use client";
import { ArrowLeft, GithubIcon, LoaderCircle, ShieldCheck, Zap, Globe, Fingerprint, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import AuthClient from "./auth-client";
import { useRouter } from "next/navigation";
import { organizations } from "@/constants";
import TeamSignInForm from "@/components/auth/TeamSignInForm";

const SignInPage = () => {
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);
  const [isGithubAuthenticating, setIsGithubAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<"standard" | "team">("standard");
  const router = useRouter();

  const handleSocial = async (provider: "google" | "github") => {
    try {
      if (provider === "google") {
        setIsGoogleAuthenticating(true);
      } else {
        setIsGithubAuthenticating(true);
      }
      
      const result = await signIn.social({ 
        provider,
        callbackURL: "/sign-in/dispatch"
      });
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsGoogleAuthenticating(false);
      setIsGithubAuthenticating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Left Panel: Institutional Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 overflow-hidden relative flex-col justify-between p-16">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zinc-800 rounded-full blur-[140px] -z-10 opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] -z-10 opacity-30" />
        
        {/* Top Section */}
        <div className="relative z-10 flex items-center gap-2 group">
           <Image src="/neutral-logo.svg" alt="logo" width={32} height={32} className="invert group-hover:rotate-12 transition-transform duration-500" />
           <p className="text-2xl font-black italic tracking-tighter uppercase text-white">Kiwiko</p>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <h2 className="text-6xl font-black text-white leading-[0.85] uppercase italic tracking-tighter">
            Welcome back to <br /> <span className="text-zinc-500">Kiwiko.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-xl leading-relaxed">
            Access the global network of high-momentum builders. Your execution is your only credential.
          </p>
          
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-zinc-800">
             <div className="space-y-2">
                <ShieldCheck className="text-emerald-500" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verified Reality</p>
             </div>
             <div className="space-y-2">
                <Fingerprint className="text-zinc-400" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cryptographic Proof</p>
             </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest italic" />
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
        <Link
          href="/"
          className="absolute top-10 left-10 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl hover:bg-zinc-100 transition-all active:scale-95 text-zinc-900 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>

        <div className="w-full max-w-md space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter leading-none">
              {activeTab === "standard" ? "Welcome Back." : "Team Access."}
            </h1>
            <p className="font-bold text-zinc-500">
              {activeTab === "standard" ? (
                <>
                  Don't have an account?{" "}
                  <Link href="/onboarding" className="text-zinc-900 underline decoration-zinc-200 underline-offset-4 hover:decoration-zinc-900 transition-all">
                    Create Account
                  </Link>
                </>
              ) : (
                "Enter your email to access your project dashboard."
              )}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-zinc-100 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
            <button
              onClick={() => setActiveTab("standard")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 relative ${
                activeTab === "standard" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Fingerprint size={14} />
              Standard
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all z-10 relative ${
                activeTab === "team" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <Users size={14} />
              Team Member
            </button>
            <div 
              className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm transition-all duration-300 ease-out z-0"
              style={{ 
                left: activeTab === "standard" ? "4px" : "50%", 
                width: "calc(50% - 4px)" 
              }}
            />
          </div>

          {activeTab === "standard" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col space-y-3">
                <button
                  className="relative w-full group overflow-hidden disabled:opacity-60"
                  disabled={isGithubAuthenticating || isGoogleAuthenticating}
                  onClick={() => handleSocial("github")}
                >
                  <div className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-3 py-4 border-2 border-zinc-900 rounded-2xl transition-all group-hover:text-white">
                    <GithubIcon size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Continue with Github</span>
                    {isGithubAuthenticating && <LoaderCircle className="animate-spin" size={16} />}
                  </div>
                </button>

                <button
                  className="relative w-full group overflow-hidden disabled:opacity-60"
                  disabled={isGithubAuthenticating || isGoogleAuthenticating}
                  onClick={() => handleSocial("google")}
                >
                  <div className="relative flex items-center justify-center gap-3 py-4 border-2 border-zinc-200 rounded-2xl hover:border-zinc-900 hover:bg-zinc-50 transition-all">
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

              <div className="bg-white p-6 rounded-[2rem] border-0.5 border-zinc-200 shadow-sm">
                 <AuthClient />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white p-6 rounded-[2rem] border-0.5 border-zinc-200 shadow-sm">
                <TeamSignInForm />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;

