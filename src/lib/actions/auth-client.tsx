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
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const submitSetup = async ({
  userRole,
  startupName,
  startupDesc,
  stage,
  niche,
  firstUpdateTitle,
  firstUpdateDesc,
  completed,
  setError,
}: SetupTypes) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id as string;
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
  }).catch((error) => {
    setError(error as string)
    console.log(error)
  })
  redirect("/onboarding/setup?page=4");
}

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
