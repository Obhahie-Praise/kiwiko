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
