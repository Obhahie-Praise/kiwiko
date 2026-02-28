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

  // Decode and parse the state parameter
  let userIdFromState: string | null = null;
  let returnTo: string | null = null;

  try {
    if (state) {
      const decodedState = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
      userIdFromState = decodedState.userId;
      returnTo = decodedState.returnTo;
    }
  } catch (e) {
    console.error("YouTube OAuth: Failed to decode state", state);
    return new NextResponse("Invalid State Format", { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id || (userIdFromState && session.user.id !== userIdFromState)) {
    console.error("YouTube OAuth: Unauthorized or Invalid State Match", { 
        userId: session?.user?.id, 
        userIdFromState 
    });
    return new NextResponse("Unauthorized or Invalid State", { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.BETTER_AUTH_URL}/api/integrations/youtube/callback`;

  if (!clientId || !clientSecret) {
    console.error("YouTube OAuth: Missing environment variables (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
    return new NextResponse("Internal Server Error: Missing OAuth Credentials", { status: 500 });
  }

  try {
    // 1. Exchange code for tokens manually to get better error visibility
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("YouTube OAuth Token Exchange Failed:", tokens);
      return new NextResponse(`OAuth Token Exchange Failed: ${tokens.error_description || tokens.error || "Unknown error"}`, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oauth2Client.setCredentials(tokens);

    const youtube = google.youtube({ version: "v3", auth: oauth2Client });
    const channelsRes = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channels = channelsRes.data.items;
    if (!channels || channels.length === 0) {
      console.error("YouTube OAuth: No YouTube channel found for this user");
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

    const metadata = {
      channelId: providerAccountId,
      channelTitle,
      thumbnail,
      subscriberCount,
    };

    if (existing) {
      await prisma.connectedAccount.update({
        where: { id: existing.id },
        data: {
          providerAccountId,
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token || undefined,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : (tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined),
          metadata,
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
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : (tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : undefined),
          metadata,
        }
      });
    }

    // Determine final redirect URL
    const finalRedirectUrl = returnTo 
        ? `${process.env.BETTER_AUTH_URL}${returnTo}${returnTo.includes("?") ? "&" : "?"}success=youtube`
        : `${process.env.BETTER_AUTH_URL}/onboarding?success=youtube`;

    return NextResponse.redirect(finalRedirectUrl);
  } catch (error: any) {
    console.error("YouTube OAuth Callback Error:", error);
    return new NextResponse(`Internal Server Error: ${error.message || "Unknown error"}`, { status: 500 });
  }
}
