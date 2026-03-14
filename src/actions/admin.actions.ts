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
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    
    if (period === 'Monthly') {
      // Current month: 1st to last day
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of month
    } else if (period === 'Quarterly') {
      // Last 90 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
      endDate = new Date(now);
    } else {
      // Annually: Jan to Dec of current year
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    }

    const entries = await prisma.waitlist.findMany({
      where: {
        joinedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        source: true,
        joinedAt: true,
      },
    });

    const statsDataMap: Record<string, any> = {};

    // Helper to format date for display
    const formatDate = (date: Date) => `${months[date.getMonth()]} ${date.getDate()}`;

    // 2a. Initialize with zero data (Zero-filling)
    if (period === 'Monthly') {
      const daysInMonth = endDate.getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(startDate.getFullYear(), startDate.getMonth(), i);
        const key = formatDate(d);
        statsDataMap[key] = { name: key, youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 };
      }
    } else if (period === 'Quarterly') {
      // For 90 days, we'll show every 3rd or 5th day to avoid cluttering, 
      // OR just show all days if Recharts handled it. Let's do daily but label sparingly in UI.
      // Actually, for 90 days, daily might be okay if UI handles ticks.
      for (let i = 0; i <= 90; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        if (d > endDate) break;
        const key = formatDate(d);
        statsDataMap[key] = { name: key, youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 };
      }
    } else {
      // Annually: All 12 months
      for (let i = 0; i < 12; i++) {
        const key = months[i];
        statsDataMap[key] = { name: key, youtube: 0, x: 0, whatsapp: 0, facebook: 0, Direct: 0 };
      }
    }

    // 2b. Aggregate real data
    entries.forEach(entry => {
      const date = new Date(entry.joinedAt);
      let key = "";
      
      if (period === 'Monthly' || period === 'Quarterly') {
        key = formatDate(date);
      } else {
        key = months[date.getMonth()];
      }

      if (statsDataMap[key]) {
        const source = (entry.source || "Direct").toLowerCase();
        if (source === 'youtube') statsDataMap[key].youtube++;
        else if (source === 'x') statsDataMap[key].x++;
        else if (source === 'whatsapp') statsDataMap[key].whatsapp++;
        else if (source === 'facebook') statsDataMap[key].facebook++;
        else statsDataMap[key].Direct++;
      }
    });

    // Format final array
    const sourceStatsData = Object.values(statsDataMap);

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
        date: `${months[d.getMonth()]} ${d.getDate()}`,
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
