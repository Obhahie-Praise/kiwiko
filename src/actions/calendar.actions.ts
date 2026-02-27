"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCalendarEventsAction(projectId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const events = await prisma.calendarEvent.findMany({
      where: { projectId },
      orderBy: { startTime: "asc" }
    });

    return { success: true, data: events };
  } catch (error) {
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function addCalendarEventAction(
  projectId: string,
  data: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    kind?: string;
    location?: string;
  }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const event = await prisma.calendarEvent.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        attendees: { kind: data.kind || "team" }, 
      }
    });

    // Notify all project members about the new event
    const members = await prisma.projectMember.findMany({
      where: { projectId, userId: { not: session.user.id } },
      select: { userId: true }
    });

    await Promise.all(
      members.map(m => prisma.notification.create({
        data: {
          projectId,
          userId: m.userId,
          type: "calendar_event",
          title: "New Calendar Event",
          message: `${session.user.name || "A user"} added an event: ${data.title}`,
          metadata: { eventId: event.id }
        }
      }))
    );

    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: "Failed to add event" };
  }
}
