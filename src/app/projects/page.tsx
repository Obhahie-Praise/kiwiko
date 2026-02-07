"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { organizations } from "@/components/common/Navbar";

export default function ProjectsRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first organization's projects page
    router.replace(`/${organizations[0].slug}/projects`);
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-medium text-zinc-500">
      Redirecting to dashboard...
    </div>
  );
}
