"use server";

import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getNotificationsAction(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        projectId,
        userId: session.user.id,
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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
