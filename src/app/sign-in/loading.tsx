import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-zinc-900 animate-spin mb-4" />
      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest animate-pulse">
        Please wait while we populate the screen
      </p>
    </div>
  );
}
