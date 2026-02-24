import Image from "next/image";
import Link from "next/link";
import React from "react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SetupProgress from "@/components/setup-pages/SetupProgress";

export default async function OnboardingSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user?.id) {
    const memberships = await prisma.membership.findMany({
      where: { userId: session.user.id },
      take: 1
    });

    if (memberships.length > 0) {
      // User has already completed onboarding and has an organization
      console.log("OnboardingSetupLayout: User has memberships, redirecting to dispatch");
      redirect("/sign-in/dispatch");
    } else {
        console.log("OnboardingSetupLayout: No memberships found, staying on onboarding");
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Institutional Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-[120px] -z-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50/30 rounded-full blur-[120px] -z-10 opacity-30" />

      {/* Top Bar Branding */}
      <div className="fixed top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-2 group">
           <Image src="/neutral-logo.svg" alt="logo" width={28} height={28} className="group-hover:rotate-12 transition-transform duration-500" />
           <p className="text-xl font-black italic tracking-tighter uppercase text-zinc-900">Kiwiko</p>
        </Link>
      </div>

      <div className="relative z-10">
        {children}
      </div>

      {/* Progress Tracking Layer (Client Component) */}
      <SetupProgress />
    </div>
  );
}

