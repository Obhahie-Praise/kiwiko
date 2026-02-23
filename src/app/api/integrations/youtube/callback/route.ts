import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return new NextResponse("No code provided", { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id || session.user.id !== state) {
    return new NextResponse("Unauthorized or Invalid State", { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BETTER_AUTH_URL}/api/integrations/youtube/callback`
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const channelsRes = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channels = channelsRes.data.items;
    if (!channels || channels.length === 0) {
      return new NextResponse("No YouTube channel found", { status: 400 });
    }

    const channel = channels[0];
    const providerAccountId = channel.id!;
    const channelTitle = channel.snippet?.title;
    const thumbnail = channel.snippet?.thumbnails?.default?.url;
    const subscriberCount = channel.statistics?.subscriberCount;

    // Use findFirst + create/update instead of upsert to avoid potential P2022 with composite keys
    const existing = await prisma.connectedAccount.findFirst({
      where: {
        userId: session.user.id,
        provider: "YOUTUBE",
      }
    });

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data: {
          providerAccountId,
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token || undefined,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          metadata: {
            channelId: providerAccountId,
            channelTitle,
            thumbnail,
            subscriberCount,
          },
        }
      });
    } else {
      await prisma.connectedAccount.create({
        data: {
          userId: session.user.id,
          provider: "YOUTUBE",
          providerAccountId,
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          metadata: {
            channelId: providerAccountId,
            channelTitle,
            thumbnail,
            subscriberCount,
          },
        }
      });
    }

    return NextResponse.redirect(`${process.env.BETTER_AUTH_URL}/onboarding?success=youtube`);
  } catch (error) {
    console.error("YouTube OAuth Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
