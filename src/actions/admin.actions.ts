"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getWaitlistStatsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Basic security check - in development, we might want to skip this or ensure it works
  // if (!session?.user) {
  //   throw new Error("Unauthorized");
  // }

  try {
    const [total, verified, views] = await Promise.all([
      prisma.waitlist.count(),
      prisma.waitlist.count({ where: { emailVerified: true } }),
      prisma.platformMetric.findUnique({
        where: { key: "waitlist-page-views" },
      }),
    ]);

    // Calculate top source
    const sources = await prisma.waitlist.groupBy({
      by: ['source'],
      _count: {
        source: true,
      },
      orderBy: {
        _count: {
          source: 'desc',
        },
      },
      take: 1,
    });

    const topSource = sources[0]?.source || "Direct";

    // Calculate git commits per week (rolling 7 days) for the main project
    // Assuming we want the commits for the core project (kiwiko)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const commitsCount = await prisma.projectCommit.count({
      where: {
        committedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      total,
      verified,
      views: views?.value || 0,
      recent: commitsCount, // Using this for git commits per week
      topSource: topSource,
      conversionRate: total > 0 ? (verified / total) * 100 : 0,
    };
  } catch (error) {
    console.error("Failed to fetch waitlist stats:", error);
    throw new Error("Failed to fetch statistics");
  }
}

export async function getWaitlistEntriesAction(page = 1, pageSize = 50) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if (!session?.user) {
  //   throw new Error("Unauthorized");
  // }

  try {
    const entries = await prisma.waitlist.findMany({
      orderBy: { joinedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return entries.map(entry => ({
      id: entry.id,
      email: entry.email,
      emailVerified: entry.emailVerified,
      joinedAt: entry.joinedAt.toISOString(),
      source: entry.source || "N/A",
    }));
  } catch (error) {
    console.error("Failed to fetch waitlist entries:", error);
    throw new Error("Failed to fetch waitlist entries");
  }
}

export async function getInvestorsAction() {
  try {
    const investors = await prisma.investor.findMany({
      orderBy: { onboardedAt: "desc" },
    });
    return investors.map(investor => ({
      ...investor,
      onboardedAt: investor.onboardedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch investors:", error);
    throw new Error("Failed to fetch investors");
  }
}

export async function addInvestorAction(formData: FormData) {
  const name = formData.get("name") as string;
  const firm = formData.get("firm") as string;
  const amountInvested = parseFloat(formData.get("amountInvested") as string);
  const percentageOwnership = parseFloat(formData.get("percentageOwnership") as string);
  const onboardedAt = new Date(formData.get("onboardedAt") as string);

  try {
    const investor = await prisma.investor.create({
      data: {
        name,
        firm,
        amountInvested,
        percentageOwnership,
        onboardedAt,
      },
    });
    return { success: true, investor };
  } catch (error) {
    console.error("Failed to add investor:", error);
    return { success: false, message: "Failed to add investor" };
  }
}
