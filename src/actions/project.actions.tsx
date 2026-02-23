"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SignalType } from "@/generated/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { sendTeamInviteEmail } from "@/app/api/send/send";
import { getGithubAccessToken } from "@/lib/github-utils";

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
  const linksJson = formData.get("links") as string;
  let links = null;
  try {
      if (linksJson) links = JSON.parse(linksJson);
  } catch (e) {
      console.error("Failed to parse links:", e);
  }


  const githubRepoFullName = formData.get("githubRepoFullName") as string || null;
  const signalsJson = formData.get("signals") as string;
  let selectedSignals: SignalType[] = [];
  try {
      if (signalsJson) selectedSignals = JSON.parse(signalsJson);
  } catch (e) {
      console.error("Failed to parse signals:", e);
  }

  // If no signal selected -> auto-select MANUAL
  if (selectedSignals.length === 0) {
      selectedSignals = ["MANUAL"];
  }

  // If GITHUB selected -> validate GitHub integration exists
    if (selectedSignals.includes("GITHUB")) {
        try {
            await getGithubAccessToken(userId);
        } catch (e) {
            return { success: false, error: "Please connect your GitHub account first" };
        }
        
        if (!githubRepoFullName) {
            return { success: false, error: "GitHub signal selected but no repository provided" };
        }
    }

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
            links,
            githubRepoFullName,
            githubConnectedBy: githubRepoFullName ? userId : null,
        },
        });

        // Create ProjectIntegrations for all selected signals
        for (const signalType of selectedSignals) {
            let integrationId = null;
            
            if (signalType === "GITHUB") {
                const integration = await tx.integration.findFirst({
                    where: { userId, provider: "GITHUB" }
                });
                if (!integration) throw new Error("Please connect your GitHub account first");
                integrationId = integration.id;
            } else if (signalType === "YOUTUBE") {
                const integration = await tx.integration.findFirst({
                    where: { userId, provider: "YOUTUBE" }
                });
                if (!integration) throw new Error("Please connect your YouTube account first");
                integrationId = integration.id;
            }

            await (tx as any).projectIntegration.create({
                data: {
                    projectId: project.id,
                    signalType,
                    integrationId,
                }
            });
        }

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

    // Trigger initial GitHub sync if repo is linked
    if (githubRepoFullName) {
        try {
            const { syncProjectGithubMetrics } = await import("@/actions/github.actions");
            await syncProjectGithubMetrics(result.project.id);
        } catch (syncError) {
            console.error("Initial GitHub sync failed:", syncError);
            // Don't fail the whole action if sync fails
        }
    }

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
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const problem = formData.get("problem") as string;
    const solution = formData.get("solution") as string;
    const stage = formData.get("stage") as string;
    const currentRevenue = formData.get("currentRevenue") as string;
    const postMoneyValuation = formData.get("postMoneyValuation") as string;
    const logoUrl = formData.get("logoUrl") as string;
    const bannerUrl = formData.get("bannerUrl") as string;
    const signalsJson = formData.get("signals") as string;
    const linksJson = formData.get("links") as string;
    const githubRepoFullName = formData.get("githubRepoFullName") as string;
    
    let links = undefined;
    try {
        if (linksJson) links = JSON.parse(linksJson);
    } catch (e) {
        console.error("Failed to parse links:", e);
    }

    let selectedSignals: SignalType[] = [];
    try {
        if (signalsJson) selectedSignals = JSON.parse(signalsJson);
    } catch (e) {
        console.error("Failed to parse signals:", e);
    }

    // Auto-select MANUAL if none
    if (selectedSignals.length === 0) {
        selectedSignals = ["MANUAL"];
    }

    // GitHub validation
    if (selectedSignals.includes("GITHUB")) {
        try {
            await getGithubAccessToken(session.user.id);
        } catch (e) {
            return { success: false, error: "Please connect your GitHub account first" };
        }
    }

    try {
        // Check if slug is taken by another project in the same organization
        if (slug && slug !== project.slug) {
            const existingSlug = await prisma.project.findFirst({
                where: {
                    slug,
                    orgId: project.orgId,
                    id: { not: projectId }
                }
            });
            if (existingSlug) return { success: false, error: "Project URL is already taken in this organization." };
        }

        await prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: {
                    name,
                    slug: slug || project.slug,
                    description,
                    problem,
                    solution,
                    stage,
                    currentRevenue,
                    postMoneyValuation,
                    logoUrl,
                    bannerUrl,
                    links,
                    githubRepoFullName: githubRepoFullName || project.githubRepoFullName,
                    githubConnectedBy: githubRepoFullName ? session.user.id : project.githubConnectedBy,
                    dataChangeCount: currentCount + 1,
                    lastDataChangeAt: now
                }
            });

            // Delete old ones first (or sync)
            await (tx as any).projectIntegration.deleteMany({
                where: { projectId }
            });

            // Create ProjectIntegrations for all selected signals
            for (const signalType of selectedSignals) {
                let integrationId = null;
                
                if (signalType === "GITHUB") {
                    const integration = await tx.integration.findFirst({
                        where: { userId: session.user.id, provider: "GITHUB" }
                    });
                    if (!integration) throw new Error("Please connect your GitHub account first");
                    integrationId = integration.id;
                } else if (signalType === "YOUTUBE") {
                    const integration = await tx.integration.findFirst({
                        where: { userId: session.user.id, provider: "YOUTUBE" }
                    });
                    if (!integration) throw new Error("Please connect your YouTube account first");
                    integrationId = integration.id;
                }

                await (tx as any).projectIntegration.create({
                    data: {
                        projectId,
                        signalType,
                        integrationId,
                    }
                });
            }
        });

        revalidatePath(`/${project.organization.slug}/projects`);
        revalidatePath(`/${project.organization.slug}/${project.slug}`);
        if (slug) revalidatePath(`/${project.organization.slug}/${slug}`);
        
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

export async function getUserContextAction(): Promise<ActionResponse<{ organizations: any[] }>> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const organizations = await prisma.organization.findMany({
            where: {
                memberships: {
                    some: {
                        userId: session.user.id
                    }
                }
            },
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logoUrl: true
                    },
                    orderBy: {
                        updatedAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return { success: true, data: { organizations } };
    } catch (error) {
        console.error("Failed to fetch user context:", error);
        return { success: false, error: "Failed to fetch organizations and projects" };
    }
}

export async function getProjectHomeDataAction(orgSlug: string, projectSlug: string): Promise<ActionResponse<{ project: any; organization: any; membership: any }>> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const organization = await prisma.organization.findUnique({
            where: { slug: orgSlug },
            include: {
                memberships: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!organization) return { success: false, error: "Organization not found" };

        const project = await prisma.project.findUnique({
            where: {
                orgId_slug: {
                    orgId: organization.id,
                    slug: projectSlug
                }
            }
        });

        if (!project) return { success: false, error: "Project not found" };

        const membership = await prisma.membership.findUnique({
            where: {
                userId_orgId: {
                    userId: session.user.id,
                    orgId: organization.id
                }
            }
        });

        return { 
            success: true, 
            data: { 
                project, 
                organization,
                membership
            } 
        };
    } catch (error) {
        console.error("Failed to fetch project home data:", error);
        return { success: false, error: "Failed to fetch project data" };
    }
}

export async function getDiscoverProjectsAction(): Promise<ActionResponse<any[]>> {
    try {
        const projects = await prisma.project.findMany({
            include: {
                organization: true
            },
            take: 20,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const mappedProjects = projects.map(p => ({
            id: p.id,
            name: p.name,
            desc: p.tagline || p.description || "No description provided.",
            tagline: p.tagline || p.description || "No description provided.",
            category: "latest", 
            niche: (p.niche as any) || "SaaS",
            stage: (p.stage as any) || "Idea",
            funding: p.postMoneyValuation ? `Val: ${p.postMoneyValuation}` : (p.currentRevenue ? `Rev: ${p.currentRevenue}` : "Seed"),
            traction: p.currentRevenue ? `${p.currentRevenue} rev` : "Stealth",
            image: p.bannerUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
            logo: p.logoUrl || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
            profileLink: `/${p.organization.slug}/${p.slug}`,
            lastUpdate: "New on Kiwiko",
            tags: [p.niche || "Startup"],
            isLive: true
        }));

        return { success: true, data: mappedProjects };
    } catch (error) {
        console.error("Failed to fetch discover projects:", error);
        return { success: false, error: "Failed to fetch discover projects" };
    }
}

export async function getUserIntegrationsAction(): Promise<ActionResponse<any[]>> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const integrations = await prisma.integration.findMany({
            where: { userId: session.user.id }
        });
        return { success: true, data: integrations };
    } catch (error) {
        console.error("Failed to fetch integrations:", error);
        return { success: false, error: "Failed to fetch integrations" };
    }
}

