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
    const [total, views] = await Promise.all([
      prisma.waitlist.count(),
      prisma.platformMetric.findUnique({
        where: { key: "waitlist-page-views" },
      }),
    ]);

    // Calculate top source
    const sources = await prisma.waitlist.groupBy({
      by: ['source'],
      _count: {
        _all: true,
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

    console.log("[AdminStats] Data fetched:", {
      total,
      views: views?.value || 0,
      recent: commitsCount,
      topSource: topSource,
    });

    const stats = {
      total,
      views: views?.value || 0,
      recent: commitsCount, 
      topSource: topSource,
    };

    console.log("[AdminStats] Data fetched:", stats);
    return stats;
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
export async function getAdminChartDataAction(period: 'Monthly' | 'Quarterly' | 'Annually' = 'Monthly') {
  try {
    // 1. Source Ratio (Distribution) - Keep total distribution for now
    const sourceGroups = await prisma.waitlist.groupBy({
      by: ['source'],
      _count: {
        _all: true,
      },
    });

    let sourceRatioData = sourceGroups.map(group => ({
      name: group.source || "Direct",
      value: group._count._all || 0,
    }));

    if (sourceRatioData.length === 0) {
      sourceRatioData = [
        { name: "X", value: 0 },
        { name: "YouTube", value: 0 },
        { name: "WhatsApp", value: 0 },
        { name: "Facebook", value: 0 },
        { name: "Direct", value: 0 },
      ];
    }

    // 2. Source Statistics over time
    let startDate = new Date();
    if (period === 'Monthly') {
      startDate.setMonth(startDate.getMonth() - 6);
    } else if (period === 'Quarterly') {
      startDate.setFullYear(startDate.getFullYear() - 2); // 2 years for quarterly trend
    } else {
      startDate.setFullYear(startDate.getFullYear() - 5); // 5 years for annual trend
    }
    startDate.setDate(1);

    const entries = await prisma.waitlist.findMany({
      where: {
        joinedAt: {
          gte: startDate,
        },
      },
      select: {
        source: true,
        joinedAt: true,
      },
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const statsDataMap: Record<string, any> = {};

    entries.forEach(entry => {
      const date = new Date(entry.joinedAt);
      let key = "";
      
      if (period === 'Monthly') {
        key = months[date.getMonth()];
      } else if (period === 'Quarterly') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `Q${quarter} ${date.getFullYear()}`;
      } else {
        key = `${date.getFullYear()}`;
      }

      if (!statsDataMap[key]) {
        statsDataMap[key] = { name: key, youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 };
      }
      
      const source = (entry.source || "Direct").toLowerCase();
      if (source === 'youtube') statsDataMap[key].youtube++;
      else if (source === 'x') statsDataMap[key].x++;
      else if (source === 'whatsapp') statsDataMap[key].whatsapp++;
      else if (source === 'facebook') statsDataMap[key].facebook++;
      else statsDataMap[key].Direct++;
    });

    // Format final array
    let sourceStatsData = Object.values(statsDataMap);

    // If data is empty for current period, provide some defaults for UI
    if (sourceStatsData.length === 0) {
       sourceStatsData = period === 'Monthly' 
        ? months.slice(-6).map(m => ({ name: m, youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 }))
        : [];
    }

    // 3. Page Views simulated trend
    const viewsMetric = await prisma.platformMetric.findUnique({
      where: { key: "waitlist-page-views" },
    });
    const totalViews = viewsMetric?.value || 0;
    
    const pageViewsData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const base = totalViews / 30;
      const noise = Math.sin(i * 0.5) * (base * 0.4) + (Math.random() * base * 0.2);
      pageViewsData.push({
        date: `${d.getDate()} ${months[d.getMonth()]}`,
        views: Math.max(0, Math.floor(base + noise)),
      });
    }

    return {
      sourceRatioData,
      sourceStatsData,
      pageViewsData,
    };
  } catch (error) {
    console.error("Failed to fetch admin chart data:", error);
    throw new Error("Failed to fetch chart data");
  }
}
