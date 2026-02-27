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
        },
      });

      // Create owner membership
      await tx.membership.create({
        data: {
          userId: userId,
          orgId: org.id,
          role: "OWNER",
        },
      });

      // Create invite records
      const invites = await Promise.all(
        inviteList.map(async (invite) => {
          const token = crypto.randomBytes(32).toString("hex");
          return tx.organizationInvite.create({
            data: {
              email: invite.email,
              role: invite.role as any, // Cast to match Prisma enum
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
    const roles: Record<string, string> = {
        "Admin": "ADMIN",
        "Advisor": "ADVISOR",
        "Co-founder": "CO_FOUNDER",
        "Consultant": "CONSULTANT",
        "Designer": "DESIGNER",
        "Developer": "DEVELOPER",
        "Founder": "FOUNDER",
        "HR": "HR",
        "Marketer": "MARKETER",
        "Spectator": "SPECTATOR"
    };

    return roles[uiRole] || "DEVELOPER"; // Default to Developer if not specified
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

    if (!membership) {
        return { success: false, error: "Membership not found" };
    }

    const isAdmin = ["OWNER", "ADMIN", "FOUNDER", "CO_FOUNDER"].includes(membership.role);

    if (!isAdmin) {
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
                    
                    const dbRole = mapRole(invite.role) as any;
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

export async function acceptInviteAction(token: string): Promise<ActionResponse<string>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please sign in first." };
  }

  const userId = session.user.id;

  try {
    // 1. Try to find Organization Invite
    const orgInvite = await prisma.organizationInvite.findUnique({
      where: { token },
      include: { organization: true }
    });

    if (orgInvite) {
      if (orgInvite.accepted) {
        return { success: false, error: "Invite already accepted" };
      }
      if (orgInvite.expiresAt < new Date()) {
        return { success: false, error: "Invite expired" };
      }

      await prisma.$transaction([
        prisma.membership.create({
          data: {
            userId,
            orgId: orgInvite.orgId,
            role: orgInvite.role,
          }
        }),
        prisma.organizationInvite.update({
          where: { id: orgInvite.id },
          data: { accepted: true }
        })
      ]);

      revalidatePath(`/${orgInvite.organization.slug}`);
      return { success: true, data: `/${orgInvite.organization.slug}` };
    }

    // 2. Try to find Project Invite
    const projectInvite = await prisma.projectInvite.findUnique({
      where: { token },
      include: { project: { include: { organization: true } } }
    });

    if (projectInvite) {
      if (projectInvite.accepted) {
        return { success: false, error: "Invite already accepted" };
      }
      if (projectInvite.expiresAt < new Date()) {
        return { success: false, error: "Invite expired" };
      }

      await (prisma as any).$transaction([
        (prisma as any).projectMember.create({
          data: {
            userId,
            projectId: projectInvite.projectId,
            role: projectInvite.role,
          }
        }),
        prisma.projectInvite.update({
          where: { id: projectInvite.id },
          data: { accepted: true }
        })
      ]);

      const admins = await prisma.projectMember.findMany({
          where: { projectId: projectInvite.projectId, role: { in: ["OWNER", "ADMIN", "FOUNDER", "CO_FOUNDER"] } },
          select: { userId: true }
      });
      await Promise.all(
          admins.map(admin =>
              prisma.notification.create({
                  data: {
                      projectId: projectInvite.projectId,
                      userId: admin.userId,
                      type: "invite_accepted",
                      title: "Invite Accepted",
                      message: `${session.user.name || session.user.email} joined the project as ${projectInvite.role}.`,
                      metadata: {
                          joinedUserId: userId,
                          role: projectInvite.role
                      }
                  }
              })
          )
      );

      revalidatePath(`/${projectInvite.project.organization.slug}/${projectInvite.project.slug}/home`);
      return { success: true, data: `/${projectInvite.project.organization.slug}/${projectInvite.project.slug}/home` };
    }

    return { success: false, error: "Invalid invitation token" };
  } catch (error) {
    console.error("Failed to accept invite:", error);
    return { success: false, error: "Failed to accept invite" };
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
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const niche = formData.get("niche") as string;
  const logoUrl = formData.get("logoUrl") as string || null;
  const bannerUrl = formData.get("bannerUrl") as string || null;

  try {
    const org = await prisma.organization.findUnique({
      where: { id: orgId, ownerId: session.user.id }
    });

    if (!org) {
      return { success: false, error: "Organization not found or you are not the owner" };
    }

    // Check slug uniqueness if changed
    if (slug && slug !== org.slug) {
      const existing = await prisma.organization.findUnique({
        where: { slug }
      });
      if (existing) {
        return { success: false, error: "Username/Slug is already taken." };
      }
    }

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: {
        name,
        slug: slug || org.slug,
        description,
        niche,
        logoUrl,
        bannerUrl,
      }
    });

    revalidatePath(`/${org.slug}`);
    if (updated.slug !== org.slug) {
        redirect(`/${updated.slug}`);
    }
    
    return { success: true, data: true };
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
    }
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
