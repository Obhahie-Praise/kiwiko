"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCalendarEventsAction(projectId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const [events, emails] = await Promise.all([
      prisma.calendarEvent.findMany({
        where: { projectId },
        orderBy: { startTime: "asc" }
      }),
      prisma.email.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" }
      })
    ]);

    const mappedEmails = emails.map(email => ({
      id: email.id,
      projectId: email.projectId,
      title: email.isOutgoing ? (email.recipientName || email.recipientEmail || "Unknown Recipient") : (email.senderName || email.senderEmail),
      description: email.content, // Truncation can happen on frontend or here
      startTime: email.createdAt,
      endTime: email.createdAt,
      location: null,
      attendees: { kind: "email" },
      createdAt: email.createdAt,
      updatedAt: email.createdAt,
    }));

    const allEvents = [...events, ...mappedEmails].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return { success: true, data: allEvents };
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
        category: data.kind || "meeting",
      }
    });

    // Notify all project members about the new event
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      select: { userId: true }
    });

    // Map kind to notification type
    const kind = (data.kind || "meeting").toLowerCase();
    const notificationType = ["meeting", "milestone", "achievement"].includes(kind) 
      ? kind 
      : "calendar_event";

    await Promise.all(
      members.map(m => prisma.notification.create({
        data: {
          projectId,
          userId: m.userId,
          type: notificationType,
          title: data.title,
          message: `${session.user.name || "A user"} added a ${kind}: ${data.title}`,
          read: m.userId === session.user.id,
          metadata: { eventId: event.id }
        }
      }))
    );

    return { success: true, data: event };
  } catch (error) {
    return { success: false, error: "Failed to add event" };
  }
}
