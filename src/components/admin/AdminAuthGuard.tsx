"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const ADMIN_PASSWORD = "kiwiko-x-auth";
const TOKEN_KEY = "kiwiko_admin_auth_token";
const SESSION_DURATION = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const { timestamp } = JSON.parse(storedToken);
          const now = new Date().getTime();
          if (now - timestamp < SESSION_DURATION) {
            setIsAuthenticated(true);
            return;
          }
        } catch (e) {
          console.error("Invalid auth token structure");
        }
      }
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    // Simulate a bit of loading for premium feel
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        const token = JSON.stringify({
          authenticated: true,
          timestamp: new Date().getTime(),
        });
        localStorage.setItem(TOKEN_KEY, token);
        setIsAuthenticated(true);
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setIsVerifying(false);
    }, 800);
  };

  // Prevent flash of content during check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={32} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" /> */}
      
      <div className="w-full max-w-sm animate-in fade-in zoom-in duration-500">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-900 p-8 rounded-lg shadow-2xl relative z-10 group">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center text-orange-500 mb-4">
              <Lock size={20} strokeWidth={1.5} className="group-hover:rotate-20 group-hover:scale-110 duration-300" />
            </div>
            <h1 className="text-xl font-semibold text-white special-font tracking-wide">Admin Access</h1>
            <p className="text-zinc-500 text-xs mt-2 text-center">
              Please enter your password to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-950/50 border placeholder:text-zinc-700 border-zinc-900 focus:border-orange-900/40 outline-none text-zinc-100 px-5 py-2 rounded-lg transition-all group-hover:border-zinc-700"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium bg-red-500/10 border border-red-500/20 py-2.5 px-4 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || !password}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm py-2 rounded-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                "Unlock Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-[10px] font-medium tracking-wide mt-8">
            Session active for 48 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthGuard;
