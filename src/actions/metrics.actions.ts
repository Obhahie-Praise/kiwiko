"use server";

import prisma from "@/lib/prisma";

export async function incrementWaitlistPageViewAction() {
  try {
    await prisma.platformMetric.upsert({
      where: { key: "waitlist-page-views" },
      update: { value: { increment: 1 } },
      create: { key: "waitlist-page-views", value: 1 },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to increment page view:", error);
    return { success: false };
  }
}

export async function getWaitlistPageViewAction() {
  try {
    const metric = await prisma.platformMetric.findUnique({
      where: { key: "waitlist-page-views" },
    });
    return metric?.value || 0;
  } catch (error) {
    console.error("Failed to get page view:", error);
    return 0;
  }
}
