import { getProjectRepoDetails } from "@/actions/github.actions";
import { unstable_cache } from "next/cache";

export const getOverviewMetrics = unstable_cache(
  async (projectId: string, userId: string) => {
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

    // Start all independent fetches in parallel after getting project
    const analytics = await import("./analytics-utils");
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      viewCount,
      currentPeriodViews,
      previousPeriodViews,
      eventCount,
      upcomingEventsCount,
      activeUsers,
      activeUsers7d,
      activeUsers30d,
      sessions,
      usersOnline,
      allTimeUsers,
      churnRate,
      engagementRate,
      activeUsersByHour,
      churnTimeSeries,
      usersTimeSeries,
      sessionsTimeSeries,
      engagementTimeSeries,
      churnGrowth,
      usersGrowth,
      sessionsGrowth,
      engagementGrowth,
      onlineTeamMembers
    ] = await Promise.all([
      prisma.projectView.count({ where: { projectId } }),
      prisma.projectView.count({ where: { projectId, createdAt: { gte: sevenDaysAgo } } }),
      prisma.projectView.count({ where: { projectId, createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
      prisma.event.count({ where: { projectId } }),
      prisma.calendarEvent.count({ where: { projectId, startTime: { gte: now } } }),
      analytics.getActiveUsers(projectId),
      analytics.getActiveUsers(projectId, 168),
      analytics.getActiveUsers(projectId, 720),
      analytics.getSessions(projectId),
      analytics.getUsersOnline(projectId),
      analytics.getAllTimeUsers(projectId),
      analytics.getChurnRate(projectId),
      analytics.getEngagementRate(projectId),
      analytics.getActiveUsersByHour(projectId),
      analytics.getMetricTimeSeries(projectId, "churn"),
      analytics.getMetricTimeSeries(projectId, "users"),
      analytics.getMetricTimeSeries(projectId, "sessions"),
      analytics.getMetricTimeSeries(projectId, "engagement"),
      analytics.getMetricGrowth(projectId, "churn"),
      analytics.getMetricGrowth(projectId, "users"),
      analytics.getMetricGrowth(projectId, "sessions"),
      analytics.getMetricGrowth(projectId, "engagement"),
      analytics.getOnlineTeamMembers(projectId)
    ]);

    // Handle GitHub Commits & Sync
    let commitsPerWeek = project.githubCommitsPerWeek || 0;
    
    // Trigger background sync if stale (6 hours) or never synced
    if (project.githubRepoFullName) {
      const lastSynced = project.githubLastSyncedAt;
      const hoursSinceSync = lastSynced ? (now.getTime() - lastSynced.getTime()) / (1000 * 60 * 60) : Infinity;
      
      if (hoursSinceSync > 1) {
        // Trigger background sync - we don't await this to keep the overview page fast
        (async () => {
          try {
            const { syncProjectGithubMetrics } = await import("@/actions/github.actions");
            await syncProjectGithubMetrics(projectId);
          } catch (e) {
            console.error("Background GitHub sync failed:", e);
          }
        })();
      }
    }

    if (commitsPerWeek === 0 && project.githubCommitCount30d) {
      commitsPerWeek = Math.round((project.githubCommitCount30d / 30) * 7 * 10) / 10;
    }

    // Handle YouTube
    let youtubeMetric = null;
    const youtubeSignal = project.signals.find(s => s.signalType === "YOUTUBE");
    
    // Potentially parallelize these external API calls too if project structure allowed, 
    // but for now let's focus on the bulk of the internal DB/util calls above.

    if (youtubeSignal?.connectedAccountId) {
      const { getLatestUploads } = await import("@/actions/youtube.actions");
      const uploadsRes = await getLatestUploads(youtubeSignal.connectedAccount?.providerAccountId || "", youtubeSignal.connectedAccountId);
      
      if (uploadsRes.success && uploadsRes.data.length > 0) {
        const latestVideo = uploadsRes.data[0];
        const ytStats = await getYouTubeChannelStats(youtubeSignal.connectedAccountId);
        if (ytStats.success) {
          youtubeMetric = {
            label: "YouTube Engagement",
            value: ytStats.data.viewCount,
            icon: "Youtube",
            videoTitle: latestVideo.title
          };
        }
      }
    }

    let viewGrowth = 0;
    if (previousPeriodViews > 0) {
      viewGrowth = Math.round(((currentPeriodViews - previousPeriodViews) / previousPeriodViews) * 100);
    } else if (currentPeriodViews > 0) {
      viewGrowth = 100;
    }

    const githubConnected = !!project.githubRepoFullName;
    const youtubeConnected = !!youtubeSignal;
    const kiwikoConnected = eventCount > 0;

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
        onlineTeamMembers,
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
          churn: churnGrowth,
          users: usersGrowth,
          sessions: sessionsGrowth,
          engagement: engagementGrowth
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
},
["overview-metrics"],
{ revalidate: 300, tags: ["metrics"] }
);
