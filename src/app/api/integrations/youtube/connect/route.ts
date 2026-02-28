import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo");
  
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

  // Encode state as JSON to pass multiple values (userId + optional returnTo)
  const stateData = JSON.stringify({
    userId: session.user.id,
    returnTo: returnTo || undefined
  });
  
  const encodedState = Buffer.from(stateData).toString("base64");

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    state: encodedState,
  });

  return NextResponse.redirect(url);
}
