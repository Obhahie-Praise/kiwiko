import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?error=missing_token", request.url));
  }

  try {
    const entry = await prisma.waitlist.findFirst({
      where: {
        verificationToken: token,
        verificationExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!entry) {
      return NextResponse.redirect(new URL("/?error=invalid_token", request.url));
    }

    await prisma.waitlist.update({
      where: { id: entry.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationExpiresAt: null,
        verifiedAt: new Date(),
      },
    });

    // Successfully verified, redirect to homepage with success flag
    return NextResponse.redirect(new URL("/?verified=true", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/?error=server_error", request.url));
  }
}
