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
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  // Fetch all relevant events in a single query
  const events = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: { gte: since },
      userId: { not: null },
    },
    select: {
      timestamp: true,
      userId: true,
    }
  });

  const now = new Date();
  const data = [];

  for (let i = hours - 1; i >= 0; i--) {
    const start = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
    const end = new Date(now.getTime() - i * 60 * 60 * 1000);
    
    // Optimized: The index on [projectId, timestamp] makes this fetch faster
    const hourEvents = events.filter(e => 
      e.timestamp >= start && e.timestamp < end
    );
    
    // Count unique users
    const uniqueUsers = new Set(hourEvents.map(e => e.userId)).size;
    
    data.push({
      timestamp: end.toISOString(),
      count: uniqueUsers,
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
    const [curr, prev] = await Promise.all([
      getActiveUsers(projectId, 168),
      prisma.event.groupBy({
        by: ["userId"],
        where: {
          projectId,
          timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
          userId: { not: null },
        },
      })
    ]);
    currentVal = curr;
    previousVal = prev.length;
  } else if (metric === "sessions") {
    const [curr, prev] = await Promise.all([
      getSessions(projectId, 168),
      prisma.event.count({
        where: {
          projectId,
          eventName: "session_start",
          timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        },
      })
    ]);
    currentVal = curr;
    previousVal = prev;
  } else if (metric === "churn") {
     const [churnCurr, active7_14, active14_21] = await Promise.all([
       getChurnRate(projectId),
       prisma.event.findMany({
         where: { projectId, timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo }, userId: { not: null } },
         select: { userId: true }, distinct: ["userId"],
       }),
       prisma.event.findMany({
         where: { projectId, timestamp: { gte: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), lt: fourteenDaysAgo }, userId: { not: null } },
         select: { userId: true }, distinct: ["userId"],
       })
     ]);
     
     currentVal = churnCurr;
     if (active14_21.length === 0) {
       previousVal = 0;
     } else {
       const set7_14 = new Set(active7_14.map(u => u.userId));
       const lost = active14_21.filter(u => !set7_14.has(u.userId)).length;
       previousVal = (lost / active14_21.length) * 100;
     }
  } else if (metric === "engagement") {
    const [curr, totalPrev, activePrev] = await Promise.all([
      getEngagementRate(projectId),
      prisma.event.groupBy({
        by: ["userId"],
        where: { projectId, timestamp: { lt: sevenDaysAgo }, userId: { not: null } },
      }),
      prisma.event.groupBy({
        by: ["userId"],
        where: { projectId, timestamp: { gte: fourteenDaysAgo, lt: sevenDaysAgo }, userId: { not: null } },
      })
    ]);
    currentVal = curr;
    previousVal = totalPrev.length > 0 ? (activePrev.length / totalPrev.length) * 100 : 0;
  }

  if (previousVal === 0) return currentVal > 0 ? 100 : 0;
  return ((currentVal - previousVal) / previousVal) * 100;
}

/**
 * Get time series data for miniature sparklines.
 * Points are daily for the last 14 days.
 */
export async function getMetricTimeSeries(projectId: string, metric: "churn" | "users" | "sessions" | "engagement") {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14); // 14 days + buffer
  
  const data = [];

  if (metric === "users" || metric === "sessions" || metric === "engagement") {
    const events = await prisma.event.findMany({
      where: {
        projectId,
        timestamp: { gte: startDate },
        ...(metric === "sessions" ? { eventName: "session_start" } : { userId: { not: null } })
      },
      select: {
        timestamp: true,
        userId: true,
      }
    });

    const allUsersCount = metric === "engagement" ? await getAllTimeUsers(projectId) : 0;

    for (let i = 13; i >= 0; i--) {
      const targetDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const targetDayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
      
      const dayEvents = events.filter(e => e.timestamp >= targetDayStart && e.timestamp < targetDayEnd);
      
      let value = 0;
      if (metric === "users") {
        value = new Set(dayEvents.map(e => e.userId)).size;
      } else if (metric === "sessions") {
        value = dayEvents.length;
      } else if (metric === "engagement") {
        const activeCount = new Set(dayEvents.map(e => e.userId)).size;
        // Optimization: totalUpToThatDay could also be pre-calculated if we had better tracking,
        // but for now let's use the allTimeUsers as an approximation or fetch specifically if needed.
        // Actually the original code did a DB call per day for totalPrevious.
        // Let's stick with the most accurate version but minimized.
        value = allUsersCount > 0 ? (activeCount / allUsersCount) * 100 : 0;
      }

      data.push({
        timestamp: targetDayEnd.toISOString(),
        value: Math.round(value * 100) / 100,
      });
    }
  } else if (metric === "churn") {
     const churnStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15);
     const events = await prisma.event.findMany({
       where: { projectId, timestamp: { gte: churnStartDate }, userId: { not: null } },
       select: { timestamp: true, userId: true }
     });

     for (let i = 13; i >= 0; i--) {
        const targetDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const targetDayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i + 1);
        const prevDayStart = new Date(targetDayStart.getTime() - 24 * 60 * 60 * 1000);

        const prevDayUsers = new Set(events.filter(e => e.timestamp >= prevDayStart && e.timestamp < targetDayStart).map(e => e.userId));
        const currentDayUsers = new Set(events.filter(e => e.timestamp >= targetDayStart && e.timestamp < targetDayEnd).map(e => e.userId));
        
        let value = 0;
        if (prevDayUsers.size > 0) {
          let lostCount = 0;
          prevDayUsers.forEach(u => { if (!currentDayUsers.has(u)) lostCount++; });
          value = (lostCount / prevDayUsers.size) * 100;
        }

        data.push({
          timestamp: targetDayEnd.toISOString(),
          value: Math.round(value * 100) / 100,
        });
     }
  }
  
  return data;
}

/**
 * Get the number of team members currently in session (logged into the dashboard).
 */
export async function getOnlineTeamMembers(projectId: string) {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  
  // Find project members
  const projectMembers = await prisma.projectMember.findMany({
    where: { projectId },
    select: { userId: true }
  });

  const memberIds = projectMembers.map(m => m.userId);
  if (memberIds.length === 0) return 0;

  // Count unique users who have a valid session updated in the last 5 minutes
  const activeSessions = await prisma.session.groupBy({
    by: ["userId"],
    where: {
      userId: { in: memberIds },
      expiresAt: { gte: now },
      updatedAt: { gte: fiveMinutesAgo }
    }
  });

  return activeSessions.length;
}
