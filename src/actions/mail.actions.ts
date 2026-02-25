"use server";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import * as React from "react";

export async function sendProjectEmailAction(
  projectId: string,
  senderName: string,
  senderEmail: string,
  subject: string,
  content: string
) {
  try {
    // 1. Save message to DB
    const message = await prisma.projectMessage.create({
      data: {
        projectId,
        senderName,
        senderEmail,
        subject,
        content,
      },
    });

    // 2. Find admins/founders for this project
    const admins = await prisma.projectMember.findMany({
      where: {
        projectId,
        role: {
          in: ["OWNER", "ADMIN", "FOUNDER", "CO_FOUNDER"],
        },
      },
      include: {
        user: true,
      },
    });

    const adminEmails = admins
      .map((member) => member.user?.email)
      .filter((email): email is string => Boolean(email));

    if (adminEmails.length === 0) {
      return { success: false, error: "No admins found for this project." };
    }

    // 3. Send email to admins
    const EmailTemplate = () => {
        return React.createElement('div', { style: { fontFamily: 'sans-serif', padding: '20px' } },
            React.createElement('h2', null, `New Message from ${senderName}`),
            React.createElement('p', null, React.createElement('strong', null, 'Email: '), senderEmail),
            React.createElement('p', null, React.createElement('strong', null, 'Subject: '), subject),
            React.createElement('hr', { style: { margin: '20px 0' } }),
            React.createElement('div', { style: { whiteSpace: 'pre-wrap' } }, content),
            React.createElement('hr', { style: { margin: '20px 0' } }),
            React.createElement('p', { style: { fontSize: '12px', color: '#666' } }, 'This message was sent via the Kiwiko Project Mail page.')
        );
    };

    const emailRes = await sendEmail({
      to: adminEmails,
      subject: `[Kiwiko] Project Inquiry: ${subject}`,
      react: EmailTemplate(),
      replyTo: senderEmail,
    });

    if (!emailRes.success) {
      console.error("Failed to send email via Resend:", emailRes.error);
      // We still return success: true for the DB save, or maybe warn about email failure
    }

    return { success: true, data: message };
  } catch (error: any) {
    console.error("Error sending project email:", error);
    return { success: false, error: error.message || "Failed to send message." };
  }
}
