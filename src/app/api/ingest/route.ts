import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Simple in-memory rate limiter (per instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute per IP

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 1. Basic Rate Limiting
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };
    
    if (now - rateLimit.lastReset > RATE_LIMIT_WINDOW) {
      rateLimit.count = 0;
      rateLimit.lastReset = now;
    }

    rateLimit.count++;
    rateLimitMap.set(ip, rateLimit);

    if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // 2. Payload size validation
    const contentLength = parseInt(req.headers.get("content-length") || "0");
    if (contentLength > 1024 * 50) { // 50KB limit
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await req.json();

    // 3. Basic Bot Filtering (log for now)
    if (userAgent.toLowerCase().includes("bot") || userAgent.toLowerCase().includes("spider")) {
        console.warn(`[Kiwiko Analytics] Bot detected: ${userAgent} from IP: ${ip}`);
        // Optionally reject, but we'll just log and continue for now
    }

    const { 
      publicKey, 
      secretKey: secretKeyAuth, 
      userId, 
      sessionId, 
      eventName, 
      url, 
      metadata, 
      timestamp 
    } = body;

    // 1. Authenticate Request
    // secretKey comes in either via Authorization header (sk_...) or body
    const authHeader = req.headers.get("authorization");
    const secretKey = secretKeyAuth || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

    let project = null;

    if (secretKey) {
      project = await prisma.project.findUnique({
        where: { secretKey },
        select: { id: true }
      });
    } else if (publicKey) {
      project = await prisma.project.findUnique({
        where: { publicKey },
        select: { id: true }
      });
    }

    if (!project) {
      return NextResponse.json({ error: "Invalid API Project Key" }, { status: 401 });
    }

    // 2. Validate Event Data
    if (!eventName) {
      return NextResponse.json({ error: "Missing eventName" }, { status: 400 });
    }

    // 3. Store Event
    const event = await prisma.event.create({
      data: {
        projectId: project.id,
        userId: userId || null,
        sessionId: sessionId || null,
        eventName,
        url: url || null,
        metadata: metadata || {},
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      }
    });

    return NextResponse.json({ success: true, id: event.id });

  } catch (error) {
    console.error("[Kiwiko Ingest Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// OPTIONS for CORS (necessary if used as an external script)
export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}
