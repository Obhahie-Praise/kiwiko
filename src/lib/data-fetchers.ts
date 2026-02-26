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
    const viewCount = await prisma.projectView.count({
      where: { projectId }
    });

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
    const { 
        getActiveUsers, 
        getSessions, 
        getUsersOnline, 
        getAllTimeUsers, 
        getChurnRate 
    } = await import("./analytics-utils");

    const activeUsers = await getActiveUsers(projectId);
    const activeUsers7d = await getActiveUsers(projectId, 168);
    const activeUsers30d = await getActiveUsers(projectId, 720);
    const sessions = await getSessions(projectId);
    const usersOnline = await getUsersOnline(projectId);
    const allTimeUsers = await getAllTimeUsers(projectId);
    const churnRate = await getChurnRate(projectId);
    const activeUsersByHour = await import("./analytics-utils").then(m => m.getActiveUsersByHour(projectId));

    return {
      viewCount,
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
        activeUsersByHour
      },
      githubConnected: !!project.githubRepoFullName
    };
  } catch (error) {
    console.error("Error fetching overview metrics:", error);
    return null;
  }
}
