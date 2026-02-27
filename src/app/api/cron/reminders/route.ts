import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "development_cron_secret"}` && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const events = await prisma.calendarEvent.findMany({
      where: {
        endTime: {
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Within last 24h or future
        },
      },
    });

    const thresholds = [
      { key: "24h", ms: 24 * 60 * 60 * 1000 },
      { key: "12h", ms: 12 * 60 * 60 * 1000 },
      { key: "1h", ms: 60 * 60 * 1000 },
      { key: "5m", ms: 5 * 60 * 1000 },
      { key: "now", ms: 0 },
      { key: "ended", isEnded: true },
    ];

    let notificationsCreated = 0;

    for (const event of events) {
      const eventId = event.id;
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);
      const timeUntilStart = startTime.getTime() - now.getTime();
      const hasEnded = now.getTime() >= endTime.getTime();

      // Get project members to notify
      const members = await prisma.projectMember.findMany({
        where: { projectId: event.projectId },
        select: { userId: true },
      });

      if (members.length === 0) continue;

      // Get existing reminders for this event
      const existingReminders = await prisma.notification.findMany({
        where: { 
            projectId: event.projectId,
            type: "calendar_reminder",
            // We just fetch all for this project and filter in JS to avoid complex JSON querying
        }
      });

      for (const threshold of thresholds) {
        let shouldNotify = false;

        if (threshold.key === "ended" && hasEnded) {
            // Event has ended, within the last 2 hours 
            if (now.getTime() - endTime.getTime() <= 2 * 60 * 60 * 1000) {
              shouldNotify = true;
            }
        } else if (!threshold.isEnded && timeUntilStart > -60000) {
            // Upcoming event (hasn't started yet, or just started)
            const targetMs = threshold.ms || 0;
            // If time passes the threshold, we should notify (unless we're too late, > 1h past the target)
            if (timeUntilStart <= targetMs && targetMs - timeUntilStart < 60 * 60 * 1000) {
                shouldNotify = true;
            }
        }

        if (shouldNotify) {
            // Check if reminder was already sent
            const alreadySent = existingReminders.some((n) => {
                const meta = n.metadata as any;
                return meta && meta.eventId === eventId && meta.threshold === threshold.key;
            });

            if (!alreadySent) {
                const title = threshold.key === "ended" ? `Event Ended: ${event.title}` 
                    : threshold.key === "now" ? `Event Starting Now: ${event.title}`
                    : `Upcoming Event in ${threshold.key}: ${event.title}`;

                // Map kind to notification type
                const kind = (event.category || "meeting").toLowerCase();
                const notificationType = ["meeting", "milestone", "achievement"].includes(kind) 
                    ? kind 
                    : "calendar_event";

                // Create notifications for all members
                const newNotifications = await Promise.all(members.map(member => 
                    prisma.notification.create({
                        data: {
                            projectId: event.projectId,
                            userId: member.userId,
                            type: notificationType,
                            title,
                            message: `The ${kind} "${event.title}" is ${threshold.key === "ended" ? "now over" : threshold.key === "now" ? "starting now" : `starting in ${threshold.key}`}.`,
                            metadata: {
                                eventId,
                                threshold: threshold.key,
                                isReminder: true
                            }
                        }
                    })
                ));

                existingReminders.push(...newNotifications);
                notificationsCreated += newNotifications.length;
            }
        }
      }
    }

    return NextResponse.json({ success: true, count: notificationsCreated });
  } catch (error: any) {
    console.error("Cron reminders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
