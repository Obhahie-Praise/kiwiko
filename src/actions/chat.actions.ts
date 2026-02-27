"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getChatMessagesAction(projectId: string, receiverId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const messages = await prisma.chatMessage.findMany({
      where: receiverId 
        ? {
            projectId,
            OR: [
              { senderId: session.user.id, receiverId },
              { senderId: receiverId, receiverId: session.user.id }
            ]
          }
        : { projectId, receiverId: null },
      include: {
        sender: { select: { id: true, name: true, image: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    return { success: true, data: messages };
  } catch (error) {
    return { success: false, error: "Failed to fetch messages" };
  }
}

export async function sendChatMessageAction(
  projectId: string, 
  text: string, 
  receiverId?: string,
  attachments?: { file?: any, link?: any, folder?: any, image?: string }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const msg = await prisma.chatMessage.create({
      data: {
        projectId,
        senderId: session.user.id,
        receiverId,
        text,
        file: attachments?.file ?? null,
        link: attachments?.link ?? null,
        folder: attachments?.folder ?? null,
        image: attachments?.image ?? null,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } }
      }
    });

    // Notify receivers
    if (receiverId) {
      await prisma.notification.create({
         data: {
             projectId,
             userId: receiverId,
             type: "chat_message",
             title: "New Message",
             message: `${session.user.name || "A team member"} sent you a message.`,
             metadata: { messageId: msg.id }
         }
      });
    } else {
      // Group chat -> notify all project members except sender
      const members = await prisma.projectMember.findMany({
         where: { projectId, userId: { not: session.user.id } },
         select: { userId: true }
      });
      await Promise.all(
          members.map(m => prisma.notification.create({
             data: {
                 projectId,
                 userId: m.userId,
                 type: "chat_message",
                 title: "New Message in Team Chat",
                 message: `${session.user.name || "A team member"} posted in team chat.`,
                 metadata: { messageId: msg.id }
             }
          }))
      );
    }

    return { success: true, data: msg };
  } catch (error) {
    return { success: false, error: "Failed to send message" };
  }
}
