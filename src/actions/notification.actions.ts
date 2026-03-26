"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getSession } from "@/lib/dal";

export async function getNotificationsAction(projectId: string) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        OR: [
          { projectId: projectId },
          { projectId: null }
        ]
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: notifications };
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: "Failed to fetch notifications" };
  }
}

export async function markNotificationAsReadAction(id: string) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await prisma.notification.update({
      where: {
        id,
        userId: session.user.id, // Security check
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error marking notification read:", error);
    return { success: false, error: "Failed to mark read" };
  }
}

export async function createNotificationAction(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  projectId?: string;
  metadata?: any;
}) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        projectId: data.projectId || null,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata || {},
      },
    });

    return { success: true, data: notification };
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}
