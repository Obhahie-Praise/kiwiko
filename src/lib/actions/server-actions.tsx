"use server";

import { headers } from "next/headers";
import { auth } from "../auth";
import prisma from "../prisma";
import { redirect } from "next/navigation";
import React, { SetStateAction } from "react";

export interface StartupOnboarding {
  consent: boolean;
  userRole: string;
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

    if (!data.consent) {
      return { success: false, error: "Consent is required" };
    }

    if (!data.userRole) {
      return { success: false, error: "User role is required" };
    }

    const userId = session.user.id;
    const userName = session.user.name || "User";
    const orgName = `${userName}'s Workspace`;
    const orgSlug = `${userName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

    await prisma.$transaction(async (tx) => {
      // 1. Update user onboarding status and role
      await tx.user.update({
        where: { id: userId },
        data: { 
          onboardingCompleted: true,
          role: data.userRole
        },
      });

      // 2. Save detailed onboarding record
      // @ts-ignore - prisma client might not be generated with StartupOnboarding yet
      await tx.startupOnboarding.upsert({
        where: { userId },
        update: {
          userRole: data.userRole,
          consent: data.consent,
          updatedAt: new Date(),
        },
        create: {
          userId,
          userRole: data.userRole,
          consent: data.consent,
        },
      });

      // 3. Create default organization
      const org = await tx.organization.create({
        data: {
          name: orgName,
          slug: orgSlug,
          ownerId: userId,
        },
      });

      // 4. Create membership
      await tx.membership.create({
        data: {
          userId: userId,
          orgId: org.id,
          role: "OWNER",
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to finalize onboarding" };
  }
};

export const authCallBack = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingCompleted: true },
  });

  if (!user?.onboardingCompleted) {
    redirect("/onboarding/setup?page=finished");
  } else {
    redirect("/dashboard");
  }
};
