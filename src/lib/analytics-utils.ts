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
 * Monthly Churn Rate calculation.
 * Formula: (Users active last month BUT NOT active this month) / (Total active users last month)
 */
export async function getChurnRate(projectId: string) {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Users active this month
  const activeThisMonth = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: { gte: firstDayThisMonth },
      userId: { not: null },
    },
    select: { userId: true },
    distinct: ["userId"],
  });
  const thisMonthSet = new Set(activeThisMonth.map((u) => u.userId));

  // Users active last month
  const activeLastMonth = await prisma.event.findMany({
    where: {
      projectId,
      timestamp: {
        gte: firstDayLastMonth,
        lte: lastDayLastMonth,
      },
      userId: { not: null },
    },
    select: { userId: true },
    distinct: ["userId"],
  });

  if (activeLastMonth.length === 0) return 0;

  const lostUsers = activeLastMonth.filter((u) => !thisMonthSet.has(u.userId)).length;
  
  return (lostUsers / activeLastMonth.length) * 100;
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
    
    const count = await prisma.event.groupBy({
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
      count: count.length,
    });
  }
  
  return data;
}
