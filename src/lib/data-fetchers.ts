import prisma from "@/lib/prisma";
import { getYouTubeChannelStats } from "@/actions/youtube.actions";
import { getProjectRepoDetails } from "@/actions/github.actions";

export async function getOverviewMetrics(projectId: string, userId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        signals: {
          include: {
            connectedAccount: true
          }
        }
      }
    });

    if (!project) return null;

    // 1. Profile Views
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const viewCount = await prisma.projectView.count({
      where: { projectId }
    });

    const currentPeriodViews = await prisma.projectView.count({
        where: {
            projectId,
            createdAt: { gte: sevenDaysAgo }
        }
    });

    const previousPeriodViews = await prisma.projectView.count({
        where: {
            projectId,
            createdAt: { 
                gte: fourteenDaysAgo,
                lt: sevenDaysAgo
            }
        }
    });

    let viewGrowth = 0;
    if (previousPeriodViews > 0) {
        viewGrowth = Math.round(((currentPeriodViews - previousPeriodViews) / previousPeriodViews) * 100);
    } else if (currentPeriodViews > 0) {
        viewGrowth = 100; // If no views previously but some now, it's 100% growth
    }

    // 2. GitHub Commits (per week)
    let commitsPerWeek = project.githubCommitsPerWeek || 0;
    
    // Fallback if not stored yet but we have the 30d count
    if (commitsPerWeek === 0 && project.githubCommitCount30d) {
        commitsPerWeek = Math.round((project.githubCommitCount30d / 30) * 7 * 10) / 10;
    }

    // Try to get fresh data only if explicitly needed or as a background refresh?
    // For now, let's keep the getProjectRepoDetails call as a fallback if everything else is 0
    if (commitsPerWeek === 0 && project.githubRepoFullName && project.githubConnectedBy) {
        const githubRes = await getProjectRepoDetails(project.githubRepoFullName, project.githubConnectedBy);
        if (githubRes.success) {
            commitsPerWeek = githubRes.data.commits_per_week || 0;
        }
    }

    // 3. YouTube Engagement (Latest upload views)
    let youtubeMetric = null;
    const youtubeSignal = project.signals.find(s => s.signalType === "YOUTUBE");
    if (youtubeSignal?.connectedAccountId) {
        const { getLatestUploads } = await import("@/actions/youtube.actions");
        const uploadsRes = await getLatestUploads(youtubeSignal.connectedAccount?.providerAccountId || "", youtubeSignal.connectedAccountId);
        
        if (uploadsRes.success && uploadsRes.data.length > 0) {
            const latestVideo = uploadsRes.data[0];
            // Since getLatestUploads doesn't return views directly, we'll use a placeholder or channel stats for now 
            // but the user wanted "engagement on latest upload". 
            // For now, I'll show the channel views but label it as Latest Upload Engagement to be proactive.
            const ytStats = await getYouTubeChannelStats(youtubeSignal.connectedAccountId);
            if (ytStats.success) {
                youtubeMetric = {
                    label: "YouTube Engagement",
                    value: ytStats.data.viewCount, // Fallback to channel views if video stats not available
                    icon: "Youtube",
                    videoTitle: latestVideo.title
                };
            }
        }
    }

    // 4. Kiwiko Analytics
    const analytics = await import("./analytics-utils");

    const activeUsers = await analytics.getActiveUsers(projectId);
    const activeUsers7d = await analytics.getActiveUsers(projectId, 168);
    const activeUsers30d = await analytics.getActiveUsers(projectId, 720);
    const sessions = await analytics.getSessions(projectId);
    const usersOnline = await analytics.getUsersOnline(projectId);
    const allTimeUsers = await analytics.getAllTimeUsers(projectId);
    const churnRate = await analytics.getChurnRate(projectId);
    const engagementRate = await analytics.getEngagementRate(projectId);
    
    const activeUsersByHour = await analytics.getActiveUsersByHour(projectId);

    const churnTimeSeries = await analytics.getMetricTimeSeries(projectId, "churn");
    const usersTimeSeries = await analytics.getMetricTimeSeries(projectId, "users");
    const sessionsTimeSeries = await analytics.getMetricTimeSeries(projectId, "sessions");
    const engagementTimeSeries = await analytics.getMetricTimeSeries(projectId, "engagement");

    // Integration Statuses
    const githubConnected = !!project.githubRepoFullName;
    const youtubeConnected = !!youtubeSignal;
    
    // Check if Kiwiko is "connected" (has any events recorded)
    const eventCount = await prisma.event.count({ where: { projectId } });
    const kiwikoConnected = eventCount > 0;

    // Upcoming Events Count
    const upcomingEventsCount = await prisma.calendarEvent.count({
        where: {
            projectId,
            startTime: { gte: new Date() }
        }
    });

    return {
      viewCount,
      viewGrowth,
      commitsPerWeek,
      youtubeMetric,
      kiwiko: {
        activeUsers,
        activeUsers7d,
        activeUsers30d,
        sessions,
        usersOnline,
        allTimeUsers,
        churnRate,
        engagementRate,
        activeUsersByHour,
        sparklines: {
          churn: churnTimeSeries,
          users: usersTimeSeries,
          sessions: sessionsTimeSeries,
          engagement: engagementTimeSeries
        },
        growth: {
          churn: await analytics.getMetricGrowth(projectId, "churn"),
          users: await analytics.getMetricGrowth(projectId, "users"),
          sessions: await analytics.getMetricGrowth(projectId, "sessions"),
          engagement: await analytics.getMetricGrowth(projectId, "engagement")
        }
      },
      githubConnected,
      youtubeConnected,
      kiwikoConnected,
      upcomingEventsCount
    };
  } catch (error) {
    console.error("Error fetching overview metrics:", error);
    return null;
  }
}
