import prisma from "./prisma";

/**
 * Get the number of unique users who had at least one event in the last X hours.
 */
export async function getActiveUsers(projectId: string, hours: number = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  const result = await prisma.event.groupBy({
    by: ["userId"],
    where: {
      projectId,
      timestamp: { gte: since },
      userId: { not: null },
    },
  });
  return result.length;
}

/**
 * Get the number of users currently online (sent a heartbeat in the last 60 seconds).
 */
export async function getUsersOnline(projectId: string) {
  const since = new Date(Date.now() - 60 * 1000);
  const result = await prisma.event.groupBy({
    by: ["userId"],
    where: {
      projectId,
      eventName: "heartbeat",
      timestamp: { gte: since },
      userId: { not: null },
    },
  });
  return result.length;
}

/**
 * Get the total number of sessions started within a timeframe.
 */
export async function getSessions(projectId: string, timeframeHours: number = 24) {
  const since = new Date(Date.now() - timeframeHours * 60 * 60 * 1000);
  return await prisma.event.count({
    where: {
      projectId,
      eventName: "session_start",
      timestamp: { gte: since },
    },
  });
}

/**
 * Get total number of unique users ever seen for this project.
 */
export async function getAllTimeUsers(projectId: string) {
  const result = await prisma.event.groupBy({
    by: ["userId"],
    where: {
      projectId,
      userId: { not: null },
    },
  });
  return result.length;
}

/**
 * Weekly Churn Rate calculation for Visitors.
 * Formula: (Visitors active 7-14 days ago who did NOT return in the last 7 days) / (Total Visitors 7-14 days ago)
 */
export async function getChurnRate(projectId: string) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Users active in the last 7 days
  const activeNow = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: { gte: sevenDaysAgo },
      userId: { not: null },
    },
    select: { userId: true },
    distinct: ["userId"],
  });
  const nowSet = new Set(activeNow.map((u) => u.userId));

  // Users active 7-14 days ago
  const activePrev = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: {
        gte: fourteenDaysAgo,
        lt: sevenDaysAgo,
      },
      userId: { not: null },
    },
    select: { userId: true },
    distinct: ["userId"],
  });

  if (activePrev.length === 0) return 0;

  const lostUsers = activePrev.filter((u) => !nowSet.has(u.userId)).length;
  
  return (lostUsers / activePrev.length) * 100;
}

/**
 * Engagement Rate: Percentage of total users who have visited in the last 7 days.
 */
export async function getEngagementRate(projectId: string) {
  const totalUsers = await getAllTimeUsers(projectId);
  if (totalUsers === 0) return 0;

  const activeLast7d = await getActiveUsers(projectId, 168); // 168h = 7d
  return (activeLast7d / totalUsers) * 100;
}

/**
 * Get active users count grouped by hour for the last X hours.
 */
export async function getActiveUsersByHour(projectId: string, hours: number = 24) {
  const data = [];
  const now = new Date();
  
  for (let i = hours - 1; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
    const end = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // Using count instead of findMany/distinct for performance on large sets if possible, 
    // but for "active users" we need unique count.
    const uniqueUsers = await prisma.event.groupBy({
      by: ["userId"],
      where: {
        projectId,
        timestamp: {
          gte: start,
          lt: end,
        },
        userId: { not: null },
      },
    });
    
    data.push({
      timestamp: end.toISOString(),
      count: uniqueUsers.length,
    });
  }
  
  return data;
}

/**
 * Get the percentage change for a metric (This 7d vs Previous 7d).
 */
export async function getMetricGrowth(projectId: string, metric: "users" | "sessions" | "churn" | "engagement") {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  let currentVal = 0;
  let previousVal = 0;

  if (metric === "users") {
    currentVal = await getActiveUsers(projectId, 168);
    // Previous 7d
    const res = await prisma.event.groupBy({
      by: ["userId"],
      where: {
        projectId,
        timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        userId: { not: null },
      },
    });
    previousVal = res.length;
  } else if (metric === "sessions") {
    currentVal = await getSessions(projectId, 168);
    previousVal = await prisma.event.count({
      where: {
        projectId,
        eventName: "session_start",
        timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
      },
    });
  } else if (metric === "churn") {
     // Churn is already a rate, so maybe we show the difference in % points or the trend
     currentVal = await getChurnRate(projectId);
     // Previous churn (14-21 vs 7-14)
     const twentyOneDaysAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
     const active7_14 = await prisma.event.findMany({
       where: { projectId, timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo }, userId: { not: null } },
       select: { userId: true }, distinct: ["userId"],
     });
     const set7_14 = new Set(active7_14.map(u => u.userId));
     const active14_21 = await prisma.event.findMany({
       where: { projectId, timestamp: { gte: twentyOneDaysAgo, lt: fourteenDaysAgo }, userId: { not: null } },
       select: { userId: true }, distinct: ["userId"],
     });
     if (active14_21.length === 0) previousVal = 0;
     else {
       const lost = active14_21.filter(u => !set7_14.has(u.userId)).length;
       previousVal = (lost / active14_21.length) * 100;
     }
  } else if (metric === "engagement") {
    currentVal = await getEngagementRate(projectId);
    // Previous engagement
    const totalPrevious = await prisma.event.groupBy({
      by: ["userId"],
      where: { projectId, timestamp: { lt: sevenDaysAgo }, userId: { not: null } },
    });
    const activePrevious = await prisma.event.groupBy({
      by: ["userId"],
      where: { projectId, timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo }, userId: { not: null } },
    });
    previousVal = totalPrevious.length > 0 ? (activePrevious.length / totalPrevious.length) * 100 : 0;
  }

  if (previousVal === 0) return currentVal > 0 ? 100 : 0;
  return ((currentVal - previousVal) / previousVal) * 100;
}

/**
 * Get time series data for miniature sparklines.
 * Points are daily for the last 14 days.
 */
export async function getMetricTimeSeries(projectId: string, metric: "churn" | "users" | "sessions" | "engagement") {
  const data = [];
  const now = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const targetDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const targetDayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
    
    let value = 0;

    if (metric === "users") {
      const res = await prisma.event.groupBy({
        by: ["userId"],
        where: {
          projectId,
          timestamp: { gte: targetDayStart, lt: targetDayEnd },
          userId: { not: null },
        },
      });
      value = res.length;
    } else if (metric === "sessions") {
      value = await prisma.event.count({
        where: {
          projectId,
          eventName: "session_start",
          timestamp: { gte: targetDayStart, lt: targetDayEnd },
        },
      });
    } else if (metric === "engagement") {
       const activeThatDay = await prisma.event.groupBy({
         by: ["userId"],
         where: {
           projectId,
           timestamp: { gte: targetDayStart, lt: targetDayEnd },
           userId: { not: null },
         },
       });
       const totalUpToThatDay = await prisma.event.groupBy({
         by: ["userId"],
         where: {
           projectId,
           timestamp: { lt: targetDayEnd },
           userId: { not: null },
         },
       });
       value = totalUpToThatDay.length > 0 ? (activeThatDay.length / totalUpToThatDay.length) * 100 : 0;
    } else if (metric === "churn") {
      // Churn per day (Users from day i-1 who didn't return on day i)
      const prevDayStart = new Date(targetDayStart.getTime() - 24 * 60 * 60 * 1000);
      const prevDayUsers = await prisma.event.findMany({
        where: { projectId, timestamp: { gte: prevDayStart, lt: targetDayStart }, userId: { not: null } },
        select: { userId: true }, distinct: ["userId"],
      });
      const currentDayUsers = await prisma.event.findMany({
        where: { projectId, timestamp: { gte: targetDayStart, lt: targetDayEnd }, userId: { not: null } },
        select: { userId: true }, distinct: ["userId"],
      });
      const currentSet = new Set(currentDayUsers.map(u => u.userId));
      if (prevDayUsers.length === 0) value = 0;
      else {
        const lost = prevDayUsers.filter(u => !currentSet.has(u.userId)).length;
        value = (lost / prevDayUsers.length) * 100;
      }
    }

    data.push({
      timestamp: targetDayEnd.toISOString(),
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
}
