"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { sendTeamInviteEmail } from "@/app/api/send/send";

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createProjectAction(formData: FormData): Promise<ActionResponse<{ projectId: string; slug: string; invites: any[] }>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;
  const orgId = formData.get("orgId") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const tagline = formData.get("tagline") as string;
  const stage = formData.get("stage") as string;
  const niche = formData.get("niche") as string;
  const problem = formData.get("problem") as string;
  const solution = formData.get("solution") as string;
  const logoUrl = formData.get("logoUrl") as string || null;
  const bannerUrl = formData.get("bannerUrl") as string || null;
  const pitchDeckUrl = formData.get("pitchDeckUrl") as string || null;
  const currentRevenue = formData.get("currentRevenue") as string || null;
  const postMoneyValuation = formData.get("postMoneyValuation") as string || null;

  if (!name || !slug || !orgId) {
    return { success: false, error: "Name, slug, and organization ID are required" };
  }

  // Verify the user is a member of the organization
  const membership = await prisma.membership.findUnique({
    where: {
      userId_orgId: {
        userId,
        orgId,
      },
    },
  });

  if (!membership) {
    return { success: false, error: "You are not a member of this organization" };
  }
  
  // Check role permissions if needed (e.g. only OWNER/ADMIN can create projects?)
  // For now, allow any member to create a project, or maybe restrict to ADMIN/OWNER.
  // Let's allow all members for now as per "user wants to populate db".

  const invitesJson = formData.get("invites") as string;
  let inviteEmails: string[] = [];
  try {
      inviteEmails = JSON.parse(invitesJson) || [];
  } catch (e) {
      console.error("Failed to parse invites:", e);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
        data: {
            name,
            slug,
            orgId,
            description,
            tagline,
            stage,
            niche,
            problem,
            solution,
            logoUrl,
            bannerUrl,
            pitchDeckUrl,
            currentRevenue,
            postMoneyValuation,
        },
        });

        const createdInvites = await Promise.all(
            inviteEmails.map(async (email) => {
                const token = crypto.randomBytes(32).toString("hex");
                // Check if invite already exists? For now just create.
                return tx.projectInvite.create({
                    data: {
                        email,
                        role: "CONTRIBUTOR", // Default role
                        projectId: project.id,
                        invitedById: userId,
                        token,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    },
                });
            })
        );
        
        return { project, createdInvites };
    });

    // Send emails
    if (result.createdInvites.length > 0) {
        for (const invite of result.createdInvites) {
            // We need to fetch the org name if not available, but for project invites usually project name is enough?
            // sendTeamInviteEmail allows orgName to be optional if projectName is there? 
            // Looking at send.ts interface: orgName is string (required). 
            // We should fetch org name or use a placeholder if valid.
            // Actually, we can fetch org name earlier or use the one from formData if we had it (we don't, only orgId).
            // Let's resolve this by fetching org if needed, or just passing a placeholder if the email template handles it.
            // The template uses `contextName = orgName || projectName`.
            // But `sendTeamInviteEmail` signature requires `orgName`.
            // I'll update `sendTeamInviteEmail` signature to make `orgName` optional if `projectName` is provided, 
            // OR I can just pass "Kiwiko" or fetch the org.
            // Fetching org is safer. But we are inside a transaction result... actually we are outside transaction now.
            // checking `createProjectAction` arguments... we have `orgId`.
            
            // Let's optimize: checking if we can get org name easily.
            // We don't have it.
            // I will pass "Kiwiko" as orgName for now or fetch it.
            // To be safe and clean, I will first fetch the org name at the start of the action or just pass "Kiwiko".
            // Actually, `sendTeamInviteEmail` requires `orgName`.
            // I'll pass "Kiwiko" for now to avoid extra DB call if acceptable, 
            // OR better: I'll make `orgName` in `sendTeamInviteEmail` optional or allow it to be empty string if projectName is there.
            // `send.ts` interface says `orgName: string`.
            
             await sendTeamInviteEmail({
                email: invite.email,
                // orgName is optional now, allowing projectName to be the context
                inviterName: session.user.name || "Someone",
                inviteLink: `${process.env.BETTER_AUTH_URL}/invite/${invite.token}`,
                logoUrl,
                bannerUrl,
                projectName: name
            });
        }
    }

    revalidatePath(`/organizations/${orgId}`); 
    revalidatePath(`/${slug}`);

    return { 
        success: true, 
        data: { 
            projectId: result.project.id, 
            slug: result.project.slug,
            invites: result.createdInvites 
        } 
    };
  } catch (error: any) {
    console.error("Failed to create project:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Project with this slug already exists in this organization" };
    }
    return { success: false, error: "Failed to create project" };
  }
}

export async function deleteProjectAction(projectId: string, orgSlug: string): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { organization: true }
  });

  if (!project) {
      return { success: false, error: "Project not found" };
  }

  const membership = await prisma.membership.findUnique({
      where: {
          userId_orgId: {
              userId: session.user.id,
              orgId: project.orgId
          }
      }
  });

  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
      return { success: false, error: "Insufficient permissions to delete project" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
        // Delete invites
        await tx.projectInvite.deleteMany({ where: { projectId } });
        // Delete project
        await tx.project.delete({ where: { id: projectId } });
        return true;
    });

    revalidatePath(`/${orgSlug}/projects`);
    return { success: true, data: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function updateProjectSettingsAction(formData: FormData): Promise<ActionResponse<boolean>> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const projectId = formData.get("projectId") as string;
    
    // Fetch project to check limits
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { organization: true }
    });

    if (!project) return { success: false, error: "Project not found" };

    // Verify permissions
    const membership = await prisma.membership.findUnique({
        where: { userId_orgId: { userId: session.user.id, orgId: project.orgId } }
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        return { success: false, error: "Insufficient permissions" };
    }

    // Check 14-day limit
    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    let currentCount = project.dataChangeCount;
    const lastUpdate = project.lastDataChangeAt;

    // Reset if last update was more than 14 days ago
    if (lastUpdate && lastUpdate < fourteenDaysAgo) {
        currentCount = 0;
    }

    if (currentCount >= 2) {
        return { 
            success: false, 
            error: "Update limit reached. You can only update project data twice every 14 days." 
        };
    }

    // Prepare update data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;
    const stage = formData.get("stage") as string;
    const currentRevenue = formData.get("currentRevenue") as string;
    const postMoneyValuation = formData.get("postMoneyValuation") as string;
    const logoUrl = formData.get("logoUrl") as string;

    try {
        await prisma.project.update({
            where: { id: projectId },
            data: {
                name,
                description,
                problem,
                solution,
                stage,
                currentRevenue,
                postMoneyValuation,
                logoUrl,
                dataChangeCount: currentCount + 1,
                lastDataChangeAt: now
            }
        });

        revalidatePath(`/${project.orgId}/projects`);
        revalidatePath(`/${project.orgId}/${project.slug}`);
        
        return { success: true, data: true };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error: "Failed to update project settings" };
    }
}

export async function inviteProjectMemberAction(projectId: string, email: string): Promise<ActionResponse<{email: string; token: string; project: any}>> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { organization: true }
    });

    if (!project) return { success: false, error: "Project not found" };

    // Verify permissions
    const membership = await prisma.membership.findUnique({
        where: { userId_orgId: { userId: session.user.id, orgId: project.orgId } }
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        return { success: false, error: "Insufficient permissions" };
    }

    try {
        const token = crypto.randomBytes(32).toString("hex");
        
        // Create invite
        await prisma.projectInvite.create({
            data: {
                email,
                role: "CONTRIBUTOR",
                projectId,
                invitedById: session.user.id,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        // Send email
        await sendTeamInviteEmail({
            email,
            orgName: project.organization.name,
            inviterName: session.user.name || "Someone",
            inviteLink: `${process.env.BETTER_AUTH_URL}/invite/${token}`,
            logoUrl: project.logoUrl || project.organization.logoUrl,
            bannerUrl: project.bannerUrl || project.organization.bannerUrl,
            projectName: project.name
        });

        return { 
            success: true, 
            data: { 
                email, 
                token, 
                project: { name: project.name, id: project.id } 
            } 
        };
    } catch (error) {
        console.error("Invite failed:", error);
        return { success: false, error: "Failed to send invite" };
    }
}
