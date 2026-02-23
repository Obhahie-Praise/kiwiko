"use server";

import { google } from "googleapis";
import prisma from "@/lib/prisma";
import { ActionResponse } from "./project.actions";

/**
 * Refreshes the YouTube access token if expired.
 */
export async function refreshYouTubeToken(integrationId: string): Promise<string> {
  const integration = await prisma.integration.findUnique({
    where: { id: integrationId },
  });

  if (!integration || !integration.refreshToken) {
    throw new Error("No refresh token available");
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: integration.refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  const accessToken = credentials.access_token!;
  const expiresAt = credentials.expiry_date ? new Date(credentials.expiry_date) : null;

  await prisma.integration.update({
    where: { id: integrationId },
    data: {
      accessToken,
      expiresAt,
    },
  });

  return accessToken;
}

/**
 * Gets YouTube channel statistics (subscribers, views, etc.).
 */
export async function getYouTubeChannelStats(integrationId: string): Promise<ActionResponse> {
  try {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
    });

    if (!integration) return { success: false, error: "Integration not found" };

    let accessToken = integration.accessToken;
    if (integration.expiresAt && integration.expiresAt < new Date()) {
      accessToken = await refreshYouTubeToken(integrationId);
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const response = await youtube.channels.list({
      part: ["statistics", "snippet"],
      id: [integration.providerAccountId],
    });

    const channel = response.data.items?.[0];
    if (!channel) return { success: false, error: "Channel not found" };

    return { 
      success: true, 
      data: {
        subscriberCount: channel.statistics?.subscriberCount,
        viewCount: channel.statistics?.viewCount,
        videoCount: channel.statistics?.videoCount,
        thumbnail: channel.snippet?.thumbnails?.default?.url,
        title: channel.snippet?.title
      } 
    };
  } catch (error: any) {
    console.error("getYouTubeChannelStats error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets the latest uploads for a channel.
 */
export async function getLatestUploads(channelId: string, integrationId: string): Promise<ActionResponse> {
  try {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
    });

    if (!integration) return { success: false, error: "Integration not found" };

    let accessToken = integration.accessToken;
    if (integration.expiresAt && integration.expiresAt < new Date()) {
        accessToken = await refreshYouTubeToken(integrationId);
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    
    // First get the "uploads" playlist ID
    const channelRes = await youtube.channels.list({
        part: ["contentDetails"],
        id: [channelId]
    });

    const uploadsPlaylistId = channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) return { success: false, error: "Uploads playlist not found" };

    const response = await youtube.playlistItems.list({
      part: ["snippet", "contentDetails"],
      playlistId: uploadsPlaylistId,
      maxResults: 5,
    });

    const videos = response.data.items?.map(item => ({
      id: item.contentDetails?.videoId,
      title: item.snippet?.title,
      thumbnail: item.snippet?.thumbnails?.medium?.url,
      publishedAt: item.snippet?.publishedAt,
    }));

    return { success: true, data: videos || [] };
  } catch (error: any) {
    console.error("getLatestUploads error:", error);
    return { success: false, error: error.message };
  }
}
