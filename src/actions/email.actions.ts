"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendTeamInviteEmail } from "@/app/api/send/send";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string };

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function createOrganizationAction(formData: FormData): Promise<ActionResponse<{ orgId: string }>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  // 14-day limit removed as per request

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const niche = formData.get("niche") as string;
  const logoUrl = formData.get("logoUrl") as string || null;
  const bannerUrl = formData.get("bannerUrl") as string || null;
  const invitesJson = formData.get("invites") as string; 

  if (!name || !slug || !description || !niche) {
    return { success: false, error: "Name, slug, description, and niche are required" };
  }

  let inviteList: { email: string, role: string }[] = [];
  try {
    const members = JSON.parse(invitesJson || "[]");
    inviteList = Array.isArray(members) 
      ? members.filter((m: any) => m.email && isValidEmail(m.email)).map((m: any) => ({
          email: m.email,
          role: mapRole(m.role)
      }))
      : [];
  } catch (e) {
    console.error("Failed to parse invites:", e);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Create Organization
      const org = await tx.organization.create({
        data: {
          name,
          slug,
          description,
          niche,
          logoUrl,
          bannerUrl,
          ownerId: userId,
          memberships: {
            create: {
              userId: userId,
              role: "OWNER",
            }
          }
        },
      });

      // Create invite records
      const invites = await Promise.all(
        inviteList.map(async (invite) => {
          const token = crypto.randomBytes(32).toString("hex");
          return tx.organizationInvite.create({
            data: {
              email: invite.email,
              role: invite.role as "ADMIN" | "MEMBER" | "VIEWER" | "OWNER", // Cast to match Prisma enum
              orgId: org.id,
              invitedById: userId,
              token,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
          });
        })
      );

      return { org, invites };
    });

    // Send emails (keep logic in API route helper)
    if (result.invites.length > 0) {
      for (const invite of result.invites) {
        await sendTeamInviteEmail({
          email: invite.email,
          orgName: name,
          inviterName: session.user.name || "Someone",
          inviteLink: `${process.env.BETTER_AUTH_URL}/invite/${invite.token}`,
          logoUrl,
          bannerUrl
        });
      }
    }

    revalidatePath("/organizations");
    
    // Redirect to the new organization's control center (the slug page)
    redirect(`/${result.org.slug}`);

  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
    }
    console.error("Failed to create organization:", error);
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        return { success: false, error: "Organization with this slug already exists" };
    }
    return { success: false, error: "Failed to create organization" };
  }
}

// Helper to map UI roles to DB roles
function mapRole(uiRole: string): string {
    switch (uiRole) {
        case "Admin":
        case "Admin / Founder":
        case "Co-founder":
            return "ADMIN";
        case "Investor":
        case "Investor / Advisor":
        case "Viewer":
        case "Viewer Only":
            return "VIEWER";
        case "Member":
        case "General Member":
        default:
            return "MEMBER";
    }
}

export async function inviteTeamMembersAction(orgId: string, invites: { email: string, role: string }[]): Promise<ActionResponse<boolean>> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    // Validate requester has permissions (Owner or Admin) - for now just check membership
    const membership = await prisma.membership.findUnique({
        where: {
            userId_orgId: {
                userId,
                orgId
            }
        }
    });

    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        return { success: false, error: "Insufficient permissions to invite members" };
    }
    
    // Fetch org details for email
    const org = await prisma.organization.findUnique({
        where: { id: orgId },
        select: { name: true, logoUrl: true, bannerUrl: true }
    });
    
    if (!org) return { success: false, error: "Organization not found" };

    try {
        const processedInvites = await prisma.$transaction(async (tx) => {
             return Promise.all(
                invites.map(async (invite) => {
                    if (!isValidEmail(invite.email)) return null;
                    
                    const dbRole = mapRole(invite.role) as "ADMIN" | "MEMBER" | "VIEWER";
                    const token = crypto.randomBytes(32).toString("hex");
                    
                    return tx.organizationInvite.create({
                        data: {
                            email: invite.email,
                            role: dbRole,
                            orgId,
                            invitedById: userId,
                            token,
                            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        }
                    });
                })
             );
        });
        
        const validInvites = processedInvites.filter((i): i is NonNullable<typeof i> => i !== null);

        if (validInvites.length > 0) {
            for (const invite of validInvites) {
                await sendTeamInviteEmail({
                    email: invite.email,
                    orgName: org.name,
                    inviterName: session.user.name || "Someone",
                    inviteLink: `${process.env.BETTER_AUTH_URL}/invite/${invite.token}`,
                    logoUrl: org.logoUrl,
                    bannerUrl: org.bannerUrl
                });
            }
        }
        
        revalidatePath(`/organizations/${orgId}`); // Revalidate wherever necessary
        return { success: true, data: true };

    } catch (error) {
        console.error("Failed to invite members:", error);
        return { success: false, error: "Failed to send invites" };
    }
}

export async function createProjectAction(formData: FormData): Promise<ActionResponse<{ projectId: string }>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const orgId = formData.get("orgId") as string;
  const description = formData.get("description") as string;
  const logoUrl = formData.get("logoUrl") as string || null;
  const bannerUrl = formData.get("bannerUrl") as string || null;

  if (!name || !slug || !orgId) {
    return { success: false, error: "Name, slug, and organization are required" };
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        orgId,
        description,
        logoUrl,
        bannerUrl,
      }
    });

    revalidatePath("/projects");
    return { success: true, data: { projectId: project.id } };
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateOrganizationSettingsAction(orgId: string, formData: FormData): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const niche = formData.get("niche") as string;
  const logoUrl = formData.get("logoUrl") as string || null;
  const bannerUrl = formData.get("bannerUrl") as string || null;

  try {
    const updated = await prisma.organization.update({
      where: { id: orgId, ownerId: session.user.id },
      data: {
        name,
        description,
        niche,
        logoUrl,
        bannerUrl,
      }
    });

    revalidatePath(`/${updated.slug}`);
    return { success: true, data: true };
  } catch (error: any) {
    console.error("Failed to update organization:", error);
    return { success: false, error: "Failed to update organization" };
  }
}

export async function deleteOrganizationAction(orgId: string): Promise<ActionResponse<boolean>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.$transaction(async (tx) => {
        // Cascade delete should ideally be handled by Prisma schema if specified, 
        // but we'll be explicit or rely on schema. 
        // memberships and projects have relation to org.
        
        // Delete invites
        await tx.organizationInvite.deleteMany({ where: { orgId } });
        // Delete memberships
        await tx.membership.deleteMany({ where: { orgId } });
        // Delete projects
        await tx.project.deleteMany({ where: { orgId } });
        // Delete organization
        await tx.organization.delete({
            where: { id: orgId, ownerId: session.user.id }
        });
    });

    revalidatePath("/organizations");
    redirect("/new-organisation");
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
    }
    console.error("Failed to delete organization:", error);
    return { success: false, error: "Failed to delete organization" };
  }
}
