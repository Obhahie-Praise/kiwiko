"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import prisma from "../prisma";
import { redirect } from "next/navigation";

interface SetupTypes {
  userRole: string;
  startupName: string;
  startupDesc: string;
  stage: string;
  niche: string;
  firstUpdateTitle: string;
  firstUpdateDesc: string;
  completed: boolean;
}

type SubmitSetupResult =
  | { success: true }
  | { success: false; error: string };

export const submitSetup = async ({
  userRole,
  startupName,
  startupDesc,
  stage,
  niche,
  firstUpdateTitle,
  firstUpdateDesc,
  completed,
}: SetupTypes): Promise<SubmitSetupResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = session.user.id;

    await prisma.onboardingSetup.upsert({
      where: { userId },
      update: {
        completed,
        userRole,
        startupName,
        startupDesc,
        stage,
        niche,
        firstUpdateTitle,
        firstUpdateDesc,
      },
      create: {
        completed,
        userId,
        userRole,
        startupName,
        startupDesc,
        stage,
        niche,
        firstUpdateTitle,
        firstUpdateDesc,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("submitSetup error:", error);
    return {
      success: false,
      error: "Failed to save onboarding data",
    };
  }
};

export const authCallBack = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id as string;
  const onboardingCount = await prisma.onboardingSetup.count({
    where: { userId },
  });

  if (onboardingCount === 0) {
    redirect("/onboarding/setup?page=1");
  } else {
    redirect("/home");
  }
};
