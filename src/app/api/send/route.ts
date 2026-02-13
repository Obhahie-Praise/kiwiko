import { NextRequest, NextResponse } from "next/server";
import { sendTeamInviteEmail } from "./send";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, orgName, inviterName, inviteLink, logoUrl, bannerUrl, projectName } = body;

    if (!email || !orgName || !inviterName || !inviteLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendTeamInviteEmail({
      email,
      orgName,
      inviterName,
      inviteLink,
      logoUrl,
      bannerUrl,
      projectName
    });

    if (result.success) {
      return NextResponse.json({ success: true, data: result.data });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (error) {
    console.error("API send email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
