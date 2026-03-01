"use server";

import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import * as React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function revalidateInboxAction(orgSlug: string, projectSlug: string) {
  revalidatePath(`/${orgSlug}/${projectSlug}/inbox`);
  return { success: true };
}

export async function toggleStarEmailAction(emailId: string, isStarred: boolean) {
  try {
    await prisma.email.update({
      where: { id: emailId },
      data: { isStarred }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update star status" };
  }
}

export async function moveEmailsToTrashAction(emailIds: string[], projectId: string) {
  try {
    const emails = await prisma.email.findMany({
      where: { id: { in: emailIds }, projectId }
    });

    if (emails.length === 0) return { success: false, error: "No emails found" };

    // Move to TrashedEmail
    await prisma.trashedEmail.createMany({
      data: emails.map(e => ({
        projectId: e.projectId,
        senderName: e.senderName,
        senderEmail: e.senderEmail,
        subject: e.subject,
        content: e.content,
        read: e.read,
        isOutgoing: e.isOutgoing,
        recipientEmail: e.recipientEmail,
        recipientName: e.recipientName,
        attachments: e.attachments || [],
        isImportant: e.isImportant,
        isStarred: e.isStarred,
        label: e.label,
        originalId: e.id,
      }))
    });

    // Delete from Email
    await prisma.email.deleteMany({
      where: { id: { in: emailIds }, projectId }
    });

    return { success: true };
  } catch (error) {
    console.error("Move to trash error:", error);
    return { success: false, error: "Failed to move emails to trash" };
  }
}

export async function getProjectTrashedEmailsAction(projectId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  try {
    const emails = await prisma.trashedEmail.findMany({
      where: { projectId },
      orderBy: { deletedAt: "desc" }
    });
    return { success: true, data: emails };
  } catch (error) {
    return { success: false, error: "Failed to fetch trashed emails" };
  }
}

export async function getInboxCountsAction(projectId: string) {
  try {
    const [starred, trashed, inbox, sent] = await Promise.all([
      prisma.email.count({ where: { projectId, isStarred: true } }),
      prisma.trashedEmail.count({ where: { projectId } }),
      prisma.email.count({ where: { projectId, isOutgoing: false } }),
      prisma.email.count({ where: { projectId, isOutgoing: true } }),
    ]);
    return { 
      success: true, 
      data: { 
        starred, 
        trashed,
        inbox,
        sent,
        drafts: 0 // Placeholder as drafts aren't implemented in DB yet
      } 
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch counts" };
  }
}

export async function sendProjectEmailAction(
  projectId: string,
  senderName: string,
  senderEmail: string,
  subject: string,
  content: string,
  attachments?: { name: string; url: string }[]
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
        attachments: attachments || [],
        label: "Public Outreach",
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
            React.createElement('h2', { style: { color: '#18181b' } }, `New Message from ${senderName}`),
            React.createElement('p', null, React.createElement('strong', null, 'Email: '), senderEmail),
            React.createElement('p', null, React.createElement('strong', null, 'Subject: '), subject),
            React.createElement('hr', { style: { margin: '20px 0', border: 'none', borderTop: '1px solid #e4e4e7' } }),
            React.createElement('div', { style: { whiteSpace: 'pre-wrap', color: '#3f3f46', lineHeight: '1.6' } }, content),
            attachments && attachments.length > 0 && React.createElement('div', { style: { marginTop: '30px' } },
                React.createElement('h4', { style: { fontSize: '12px', textTransform: 'uppercase', tracking: '0.1em', color: '#a1a1aa', marginBottom: '10px' } }, 'Attachments'),
                React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px' } },
                    attachments.map((file, i) => 
                        React.createElement('a', { 
                            key: i,
                            href: file.url,
                            style: { 
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '8px 12px',
                                background: '#f4f4f5',
                                borderRadius: '8px',
                                fontSize: '12px',
                                color: '#18181b',
                                textDecoration: 'none',
                                border: '1px solid #e4e4e7'
                            }
                        }, file.name)
                    )
                )
            ),
            React.createElement('hr', { style: { margin: '20px 0', border: 'none', borderTop: '1px solid #e4e4e7' } }),
            React.createElement('p', { style: { fontSize: '11px', color: '#a1a1aa' } }, 'This message was sent via the Kiwiko Project Mail page.')
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

export async function recoverEmailsFromTrashAction(trashedIds: string[], projectId: string) {
    try {
        const trashed = await prisma.trashedEmail.findMany({
            where: { id: { in: trashedIds }, projectId }
        });

        if (trashed.length === 0) return { success: false, error: "No emails found in trash" };

        await prisma.email.createMany({
            data: trashed.map(e => ({
                projectId: e.projectId,
                senderName: e.senderName,
                senderEmail: e.senderEmail,
                subject: e.subject,
                content: e.content,
                read: e.read,
                isOutgoing: e.isOutgoing,
                recipientEmail: e.recipientEmail,
                recipientName: e.recipientName,
                attachments: e.attachments || [],
                isImportant: e.isImportant,
                isStarred: e.isStarred,
                label: e.label,
            }))
        });

        await prisma.trashedEmail.deleteMany({
            where: { id: { in: trashedIds }, projectId }
        });

        revalidatePath(`/inbox`); // General revalidation
        return { success: true };
    } catch (error) {
        console.error("Recovery error:", error);
        return { success: false, error: "Failed to recover emails" };
    }
}

export async function permanentlyDeleteEmailsAction(trashedIds: string[], projectId: string) {
    try {
        await prisma.trashedEmail.deleteMany({
            where: { id: { in: trashedIds }, projectId }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to permanently delete emails" };
    }
}
