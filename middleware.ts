import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply restrictions if in waitlist mode
  if (process.env.NEXT_PUBLIC_APP_MODE === "waitlist") {
    // 1. Always allow the root path /
    if (pathname === "/") {
      return NextResponse.next();
    }

    // 2. List of allowed path prefixes (API, Next.js internals, Admin, etc.)
    const allowedPrefixes = [
      "/api",
      "/_next",
      "/favicon.ico",
      "/admin",
      "/images",
      "/public"
    ];

    const isAllowedPrefix = allowedPrefixes.some(prefix => 
      pathname === prefix || pathname.startsWith(prefix + "/")
    );

    // 3. Allow static assets (files with extensions)
    const isStaticFile = pathname.includes(".");

    if (!isAllowedPrefix && !isStaticFile) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};