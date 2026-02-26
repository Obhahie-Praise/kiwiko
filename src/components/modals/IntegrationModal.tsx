"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../lightswind/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../lightswind/tabs";
import { Check, Copy, Terminal, Code2, Globe, Server } from "lucide-react";
import { buttonVariants } from "../lightswind/button";
import { cn } from "@/lib/utils";

interface IntegrationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  publicKey: string;
  secretKey: string;
  projectId: string;
}

export const IntegrationModal = ({
  isOpen,
  onOpenChange,
  publicKey,
  secretKey,
  projectId,
}: IntegrationModalProps) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const domain = typeof window !== "undefined" ? window.location.origin : "https://kiwiko.io";

  const snippets = {
    html: `<script
  src="${domain}/api/tracker.js"
  data-project="${publicKey}"
  defer
></script>`,
    nextjs: `import Script from "next/script";

<Script
  src="${domain}/api/tracker.js"
  data-project="${publicKey}"
  strategy="afterInteractive"
/>`,
    react: `// Add this to your public/index.html before </body>
<script
  src="${domain}/api/tracker.js"
  data-project="${publicKey}"
  defer
></script>`,
    backend: `// Tracking custom events from your backend
fetch("${domain}/api/ingest", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${secretKey}"
  },
  body: JSON.stringify({
    eventName: "user_signup",
    userId: "user_123",
    metadata: { plan: "pro" }
  })
});`
  };

  const SnippetBox = ({ code, id, label }: { code: string; id: string; label: string }) => (
    <div className="mt-4 space-y-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</p>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          {copied === id ? (
            <>
              <Check size={12} className="text-emerald-500" />
              <span className="text-emerald-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy snippet</span>
            </>
          )}
        </button>
      </div>
      <div className="relative group">
        <pre className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl overflow-x-auto text-xs font-mono text-zinc-800 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-4">
            <Code2 size={24} className="text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold hero-font">Connect Kiwiko to your website</DialogTitle>
          <DialogDescription className="text-zinc-500 mt-2">
            Install the tracking script to start collecting real-time analytics. Your keys are unique to this project.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-8">
          <Tabs defaultValue="nextjs">
            <TabsList className="bg-zinc-100 p-1 rounded-xl w-full justify-start gap-1">
              <TabsTrigger value="html" className="flex items-center gap-2 text-zinc-600 data-[state=active]:text-zinc-900">
                <Globe size={14} /> HTML
              </TabsTrigger>
              <TabsTrigger value="nextjs" className="flex items-center gap-2 text-zinc-600 data-[state=active]:text-zinc-900">
                <Code2 size={14} /> Next.js
              </TabsTrigger>
              <TabsTrigger value="react" className="flex items-center gap-2 text-zinc-600 data-[state=active]:text-zinc-900">
                <Terminal size={14} /> React / Vite
              </TabsTrigger>
              <TabsTrigger value="backend" className="flex items-center gap-2 text-zinc-600 data-[state=active]:text-zinc-900">
                <Server size={14} /> Backend
              </TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-zinc-900">Integrate Kiwiko</p>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    The Kiwiko tracker is a lightweight script that collects anonymous usage data. 
                    Paste it inside your HTML's <code className="px-1 bg-zinc-100 rounded text-zinc-900">&lt;head&gt;</code> or just before the closing <code className="px-1 bg-zinc-100 rounded text-zinc-900">&lt;/body&gt;</code> tag.
                  </p>
                </div>
                <SnippetBox code={snippets.html} id="html" label="Integration Script" />
              </div>
            </TabsContent>

            <TabsContent value="nextjs" className="mt-6 space-y-6">
              <div className="space-y-4">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Add the Kiwiko tracking component to your <code className="px-1 bg-zinc-100 rounded text-zinc-900">layout.tsx</code> or root component to track all routes automatically.
                </p>
                <SnippetBox code={snippets.nextjs} id="nextjs" label="Next.js Component" />
              </div>
            </TabsContent>

            <TabsContent value="react" className="mt-6 space-y-6">
              <div className="space-y-4">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  For React apps (CRA, Vite), add the script to your <code className="px-1 bg-zinc-100 rounded text-zinc-900">public/index.html</code>.
                </p>
                <SnippetBox code={snippets.react} id="react" label="index.html Snippet" />
              </div>
            </TabsContent>

            <TabsContent value="backend" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-1">Warning</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Never expose your <code className="font-bold">Secret Key</code> in client-side code. Use it only for server-to-server tracking.
                  </p>
                </div>
                <SnippetBox code={snippets.backend} id="backend" label="Direct API Call" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-900">Project ID: <span className="font-mono text-zinc-500 ml-2">{projectId}</span></p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Copy and keep your keys secure</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className={cn(buttonVariants({ variant: "default" }), "bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl px-8")}
          >
            I've Installed It
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
