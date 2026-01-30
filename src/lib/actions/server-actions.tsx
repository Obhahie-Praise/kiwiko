"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import prisma from "../prisma";
import { redirect } from "next/navigation";
import React, { SetStateAction } from "react";

export interface StartupOnboarding {
  position?: string;
  userRole: string;
  projectName: string;
  projectDesc: string;
  catergory: string;
  theProblem: string;
  theSolution: string;
  stage: string;
  linkToProduct: string;
  userCount: string;
  revenue: string;
  teamSize: string;
  leaderStatus: string | null;
  fundsSeekingStatus: string;
  fundingStage: string;
  consent: boolean;
  setConsent?: React.Dispatch<SetStateAction<string>>;
}

type SubmitSetupResult = { success: true } | { success: false; error: string };

export const submitStartupOnboarding = async (
  data: StartupOnboarding
): Promise<SubmitSetupResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.user.id;

    await prisma.startupOnboarding.upsert({
      where: { userId },
      update: { ...data },
      create: { ...data, userId },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to save" };
  }
};


export const authCallBack = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id as string;
  const onboardingCount = await prisma.startupOnboarding.count({
    where: { userId },
  });

  if (onboardingCount === 0) {
    redirect("/onboarding/setup?page=1");
  } else {
    redirect("/home");
  }
};
