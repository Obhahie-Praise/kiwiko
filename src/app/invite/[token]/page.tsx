"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { acceptInviteAction } from "@/actions/email.actions";
import { Loader2, CheckCircle2, XCircle, Users } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    if (token) {
      handleAccept();
    }
  }, [token]);

  const handleAccept = async () => {
    try {
      const result = await acceptInviteAction(token);
      if (result.success) {
        setStatus("success");
        setRedirectUrl(result.data);
        // Automatically redirect after 3 seconds
        setTimeout(() => {
          router.push(result.data);
        }, 3000);
      } else {
        setStatus("error");
        setErrorMsg(result.error);
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
      setErrorMsg("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-zinc-200 shadow-xl p-10 text-center">
          {status === "loading" && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                <Loader2 className="animate-spin" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic text-zinc-900">Validating Invite</h1>
                <p className="text-sm font-medium text-zinc-400 mt-2 uppercase tracking-widest">Securely processing your access...</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic text-zinc-900 leading-tight">Welcome to the Team</h1>
                <p className="text-sm font-medium text-zinc-500 mt-2 uppercase tracking-widest leading-relaxed">
                  Your invitation has been verified. Redirecting you to your venture...
                </p>
              </div>
              <Link 
                href={redirectUrl}
                className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-black tracking-widest uppercase text-[10px] hover:shadow-xl transition-all"
              >
                Go to Workspace Now
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
                <XCircle size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic text-zinc-900">Invite Invalid</h1>
                <p className="text-sm font-medium text-rose-500 mt-2 uppercase tracking-widest">
                  {errorMsg}
                </p>
              </div>
              <div className="space-y-3 w-full">
                <Link 
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-2xl font-black tracking-widest uppercase text-[10px] hover:shadow-xl transition-all"
                >
                  Return Home
                </Link>
                <Link 
                  href="/sign-in"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-black tracking-widest uppercase text-[10px] hover:bg-zinc-50 transition-all"
                >
                  Sign in with another account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
