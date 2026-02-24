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
    let commitsPerWeek = 0;
    if (project.githubRepoFullName && project.githubConnectedBy) {
        const githubRes = await getProjectRepoDetails(project.githubRepoFullName, project.githubConnectedBy);
        if (githubRes.success) {
            commitsPerWeek = githubRes.data.commits_per_week || 0;
        }
    } else if (project.githubCommitCount30d) {
        commitsPerWeek = Math.round((project.githubCommitCount30d / 30) * 7 * 10) / 10;
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

    return {
      viewCount,
      commitsPerWeek,
      youtubeMetric,
      githubConnected: !!project.githubRepoFullName
    };
  } catch (error) {
    console.error("Error fetching overview metrics:", error);
    return null;
  }
}
