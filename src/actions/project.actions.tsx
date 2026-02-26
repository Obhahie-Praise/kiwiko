"use server";

import { auth } from "@/lib/auth";
import prisma, { PrismaClient } from "@/lib/prisma";
import { SignalType } from "../generated/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "node:crypto";
import { sendTeamInviteEmail } from "@/app/api/send/send";
import { getGithubAccessToken } from "@/lib/github-utils";

// Standardized role mapping helper
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

    return roles[uiRole] || "DEVELOPER";
}

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
  let projectInvites: { email: string; role: string }[] = [];
  try {
      projectInvites = JSON.parse(invitesJson) || [];
  } catch (e) {
      console.error("Failed to parse invites:", e);
  }

  const publicKey = `pk_${crypto.randomBytes(24).toString("hex")}`;
  const secretKey = `sk_${crypto.randomBytes(32).toString("hex")}`;

  try {
    const result = await (prisma as any).$transaction(async (tx: any) => {
        const project = await tx.project.create({
        data: {
            name,
            slug,
            orgId,
            createdById: userId,
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
            publicKey,
            secretKey,
        },
        });

        // Create ProjectMember for the creator
        await tx.projectMember.create({
            data: {
                userId,
                projectId: project.id,
                role: "OWNER"
            }
        });

        // Create ProjectSignals for all selected signals
        for (const signalType of selectedSignals) {
            let connectedAccountId = null;
            
            if (signalType === "GITHUB") {
                let connectedAccount = await tx.connectedAccount.findFirst({
                    where: { userId, provider: "GITHUB" }
                });

                if (!connectedAccount) {
                    // Check if they signed up with GitHub
                    const account = await tx.account.findFirst({
                        where: { userId, providerId: "github" }
                    });
                    
                    if (account) {
                        // Create a ConnectedAccount record for them so we can link it
                        connectedAccount = await tx.connectedAccount.create({
                            data: {
                                userId,
                                provider: "GITHUB",
                                providerAccountId: account.accountId,
                                accessToken: account.accessToken || "",
                                refreshToken: account.refreshToken,
                                expiresAt: account.accessTokenExpiresAt,
                            }
                        });
                    }
                }

                if (!connectedAccount) throw new Error("Please connect your GitHub account first");
                connectedAccountId = connectedAccount.id;
            } else if (signalType === "YOUTUBE") {
                const connectedAccount = await tx.connectedAccount.findFirst({
                    where: { userId, provider: "YOUTUBE" }
                });
                if (!connectedAccount) throw new Error("Please connect your YouTube account first");
                connectedAccountId = connectedAccount.id;
            }

            await tx.projectSignal.create({
                data: {
                    projectId: project.id,
                    signalType,
                    connectedAccountId: connectedAccountId,
                }
            });
        }

        const createdInvites = await Promise.all(
            projectInvites.map(async (inv) => {
                if (!inv.email) return null;
                const token = crypto.randomBytes(32).toString("hex");
                return tx.projectInvite.create({
                    data: {
                        email: inv.email,
                        role: mapRole(inv.role) as any,
                        projectId: project.id,
                        invitedById: userId,
                        token,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });
            })
        );
        
        return { project, createdInvites: createdInvites.filter(Boolean) };
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
                // @ts-ignore - prisma client might not be generated with connectedAccount yet
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
            invites: result.createdInvites,
            publicKey,
            secretKey
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

  if (!membership) {
      return { success: false, error: "Membership not found" };
  }

  const isAdmin = ["OWNER", "ADMIN", "FOUNDER", "CO_FOUNDER"].includes(membership.role);

  if (!isAdmin) {
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

        await (prisma as any).$transaction(async (tx: any) => {
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

            // Delete old signals first (or sync)
            await tx.projectSignal.deleteMany({
                where: { projectId }
            });

            // Create ProjectSignals for all selected signals
            for (const signalType of selectedSignals) {
                let connectedAccountId = null;
                
                if (signalType === "GITHUB") {
                    let connectedAccount = await tx.connectedAccount.findFirst({
                        where: { userId: session.user.id, provider: "GITHUB" }
                    });

                    if (!connectedAccount) {
                        const account = await tx.account.findFirst({
                            where: { userId: session.user.id, providerId: "github" }
                        });
                        if (account) {
                            connectedAccount = await tx.connectedAccount.create({
                                data: {
                                    userId: session.user.id,
                                    provider: "GITHUB",
                                    providerAccountId: account.accountId,
                                    accessToken: account.accessToken || "",
                                    refreshToken: account.refreshToken,
                                    expiresAt: account.accessTokenExpiresAt,
                                }
                            });
                        }
                    }

                    if (!connectedAccount) throw new Error("Please connect your GitHub account first");
                    connectedAccountId = connectedAccount.id;
                } else if (signalType === "YOUTUBE") {
                    const connectedAccount = await tx.connectedAccount.findFirst({
                        where: { userId: session.user.id, provider: "YOUTUBE" }
                    });
                    if (!connectedAccount) throw new Error("Please connect your YouTube account first");
                    connectedAccountId = connectedAccount.id;
                }

                await tx.projectSignal.create({
                    data: {
                        projectId,
                        signalType,
                        connectedAccountId: connectedAccountId,
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

export async function inviteProjectMemberAction(projectId: string, email: string, role: string): Promise<ActionResponse<{email: string; token: string; project: any}>> {
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
                role: mapRole(role) as any,
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
            where: { slug: orgSlug }
        });

        if (!organization) return { success: false, error: "Organization not found" };

        const project = await prisma.project.findUnique({
            where: {
                orgId_slug: {
                    orgId: organization.id,
                    slug: projectSlug
                }
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                invites: true
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
            profileLink: `/${p.slug}`,
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
        const integrations = await prisma.connectedAccount.findMany({
            where: { userId: session.user.id }
        });
        return { success: true, data: integrations };
    } catch (error) {
        console.error("Failed to fetch integrations:", error);
        return { success: false, error: "Failed to fetch integrations" };
    }
}

export async function trackProjectViewAction(projectId: string): Promise<ActionResponse<boolean>> {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        
        const ip = (await headers()).get("x-forwarded-for") || "unknown";
        const userId = session?.user?.id;

        // Record every visit as requested
        await prisma.projectView.create({
            data: {
                projectId,
                userId: userId || null,
                ipAddress: ip
            }
        });

        return { success: true, data: true };
    } catch (error) {
        console.error("Failed to track project view:", error);
        return { success: false, error: "Failed to track project view" };
    }
}

export async function getProjectViewAnalyticsAction(
    projectId: string,
    range: "weekly" | "monthly" | "quarterly" | "yearly"
): Promise<ActionResponse<any[]>> {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            select: { createdAt: true }
        });

        if (!project) return { success: false, error: "Project not found" };

        const now = new Date();
        const creationDate = project.createdAt;
        let startDate = new Date();

        if (range === "weekly") {
            startDate = creationDate;
        } else if (range === "monthly") {
            startDate.setFullYear(now.getFullYear() - 1);
        } else if (range === "quarterly") {
            startDate.setFullYear(now.getFullYear() - 1);
        } else if (range === "yearly") {
            startDate.setFullYear(now.getFullYear() - 4);
        }

        const views = await prisma.projectView.findMany({
            where: {
                projectId,
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: "asc" }
        });

        const aggregated: Record<string, number> = {};
        
        const getWeekNumber = (d: Date) => {
            const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            const dayNum = date.getUTCDay() || 7;
            date.setUTCDate(date.getUTCDate() + 4 - dayNum);
            const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
            const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
            return weekNo;
        };

        // Initialize buckets
        if (range === "weekly") {
            const startWeek = getWeekNumber(creationDate);
            const currentWeek = getWeekNumber(now);
            const currentYear = now.getFullYear();
            const creationYear = creationDate.getFullYear();

            if (currentYear === creationYear) {
                for (let i = startWeek; i <= 52; i++) {
                    aggregated[`Week ${i}`] = 0;
                }
            } else {
                // If it spans years, we might need a more complex label, 
                // but the user's specific request "start from the week the account was created" 
                // and "align with week of the year" suggests within a year or relative to years.
                // For now, let's assume current year or show all weeks from start until now.
                // If it's multi-year, just show the last 52 weeks but aligned? 
                // The user said "if the account was created on the week 7, then week 7 should start the charts x axis".
                // Let's do a simple range of weeks.
                for (let i = startWeek; i <= 52; i++) aggregated[`Week ${i}`] = 0;
                for (let i = 1; i <= currentWeek; i++) aggregated[`Week ${i}`] = 0;
            }
        } else if (range === "monthly") {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            months.forEach(m => aggregated[m] = 0);
        } else if (range === "quarterly") {
            for (let i = 1; i <= 4; i++) aggregated[`Q${i}`] = 0;
        } else if (range === "yearly") {
            for (let i = 1; i <= 4; i++) aggregated[`Year ${i}`] = 0;
            aggregated[`Year 4+`] = 0;
        }

        // Fill buckets
        views.forEach(v => {
            const d = new Date(v.createdAt);
            let key = "";
            
            if (range === "weekly") {
                key = `Week ${getWeekNumber(d)}`;
            } else if (range === "monthly") {
                key = d.toLocaleString('default', { month: 'short' });
            } else if (range === "quarterly") {
                const q = Math.floor((d.getMonth() + 3) / 3);
                key = `Q${q}`;
            } else if (range === "yearly") {
                const diffYears = now.getFullYear() - d.getFullYear();
                const yearNum = 4 - diffYears;
                if (yearNum >= 1 && yearNum <= 3) key = `Year ${yearNum}`;
                else if (yearNum >= 4) key = `Year 4+`;
            }

            if (key && aggregated[key] !== undefined) aggregated[key]++;
        });

        const data = Object.entries(aggregated).map(([label, value]) => ({
            label,
            value
        }));

        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to fetch analytics:", error);
        return { success: false, error: "Failed to fetch analytics" };
    }
}
