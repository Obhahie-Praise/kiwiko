import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.BETTER_AUTH_URL}/api/integrations/youtube/callback`;

  if (!clientId || !clientSecret) {
    console.error("YouTube Connect: Missing environment variables (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)");
    return new NextResponse("Internal Server Error: Missing OAuth Credentials", { status: 500 });
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    state: session.user.id,
  });

  return NextResponse.redirect(url);
}
