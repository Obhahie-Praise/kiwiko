"use server";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import * as React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function sendProjectEmailAction(
  projectId: string,
  senderName: string,
  senderEmail: string,
  subject: string,
  content: string
) {
  try {
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

    // 1. Save message to DB (using the new Email model)
    const emailRecord = await prisma.email.create({
      data: {
        projectId,
        senderName,
        senderEmail,
        subject,
        content,
        recipientEmail: adminEmails.join(", "),
        isOutgoing: false,
      },
    });

    if (adminEmails.length === 0) {
      return { success: false, error: "No admins found for this project." };
    }

    // Push notification to admins
    await Promise.all(
      admins.map((admin) => 
        prisma.notification.create({
          data: {
            projectId,
            userId: admin.userId,
            type: "email_received",
            title: `New Message from ${senderName}`,
            message: subject,
            metadata: {
              emailId: emailRecord.id,
              senderEmail,
            }
          }
        })
      )
    );

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

    return { success: true, data: emailRecord };
  } catch (error: any) {
    console.error("Error sending project email:", error);
    return { success: false, error: error.message || "Failed to send message." };
  }
}

export async function sendComposeEmailAction(
  projectId: string,
  recipientEmail: string,
  subject: string,
  content: string
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    // 1. Create Email record
    const emailRecord = await prisma.email.create({
      data: {
        projectId,
        senderName: session.user.name || "Team Member",
        senderEmail: session.user.email || "",
        recipientEmail,
        subject,
        content,
        isOutgoing: true,
      }
    });

    // 2. Create Notification for the project (so team sees it in activity)
    // We notify other project members that an email was sent
    const members = await prisma.projectMember.findMany({
      where: { projectId, userId: { not: session.user.id } },
      select: { userId: true }
    });

    await Promise.all(
      members.map(m => prisma.notification.create({
        data: {
          projectId,
          userId: m.userId,
          type: "email_sent",
          title: `Email Sent to ${recipientEmail}`,
          message: subject,
          metadata: { emailId: emailRecord.id }
        }
      }))
    );

    // 3. Send via Resend
    const EmailTemplate = () => {
      return React.createElement('div', { style: { fontFamily: 'sans-serif', padding: '20px' } },
        React.createElement('div', { style: { whiteSpace: 'pre-wrap' } }, content),
        React.createElement('hr', { style: { margin: '20px 0' } }),
        React.createElement('p', { style: { fontSize: '12px', color: '#666' } }, `Sent from ${session.user.name} via Kiwiko.`)
      );
    };

    await sendEmail({
      to: [recipientEmail],
      subject: subject,
      react: EmailTemplate(),
    });

    return { success: true, data: emailRecord };
  } catch (error: any) {
    console.error("Error in sendComposeEmailAction:", error);
    return { success: false, error: error.message || "Failed to send email." };
  }
}

export async function getProjectEmailsAction(projectId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const emails = await prisma.email.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: emails };
  } catch (error) {
    return { success: false, error: "Failed to fetch emails" };
  }
}
