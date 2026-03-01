"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import crypto from "node:crypto";

export async function teamInviteSignInAction(email: string) {
    try {
        console.log(`Team sign-in request for: ${email}`);

        // 1. Check for pending project invite
        const invite = await prisma.projectInvite.findFirst({
            where: {
                email: email.toLowerCase(),
                accepted: false
            },
            include: {
                project: {
                    include: {
                        organization: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!invite) {
            return { success: false, error: "No pending invite found for this email." };
        }

        // 2. Find or create user
        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            console.log(`Creating new user for team member: ${email}`);
            // Generate a random ID as required by the schema
            user = await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    email: email.toLowerCase(),
                    name: email.split('@')[0],
                    emailVerified: true
                }
            });
        }

        // 3. Ensure user is a ProjectMember and Org Member (with the role from invite)
        // First check organization membership
        const existingOrgMembership = await prisma.membership.findUnique({
            where: {
                userId_orgId: {
                    userId: user.id,
                    orgId: invite.project.orgId
                }
            }
        });

        if (!existingOrgMembership) {
            await prisma.membership.create({
                data: {
                    userId: user.id,
                    orgId: invite.project.orgId,
                    role: "DEVELOPER" // Default org role
                }
            });
        }

        // Then check project membership
        const existingProjectMember = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: user.id,
                    projectId: invite.projectId
                }
            }
        });

        if (!existingProjectMember) {
            await prisma.projectMember.create({
                data: {
                    userId: user.id,
                    projectId: invite.projectId,
                    role: invite.role
                }
            });
        }

        // 4. Mark invite as accepted
        await prisma.projectInvite.update({
            where: { id: invite.id },
            data: { accepted: true }
        });

        // 5. Create session via better-auth
        // We use the internal adapter to create a session programmatically
        const authContext = await auth.$context;
        const session = await authContext.internalAdapter.createSession(user.id);

        if (!session) {
            return { success: false, error: "Failed to create session." };
        }

        // 6. Set the session cookie manually
        // We use the getCookies utility from better-auth to get the correct cookie configuration
        const { getCookies } = await import("better-auth/cookies");
        const { cookies } = await import("next/headers");
        const cookieConfig = getCookies(auth.options);
        const cookieStore = await cookies();
        
        cookieStore.set(
            cookieConfig.sessionToken.name,
            session.token,
            {
                ...cookieConfig.sessionToken.options,
                sameSite: (cookieConfig.sessionToken.options.sameSite?.toLowerCase() as any) || "lax",
                expires: session.expiresAt,
            }
        );

        return { 
            success: true, 
            data: { 
                orgSlug: invite.project.organization.slug, 
                projectSlug: invite.project.slug,
                redirectToParticipation: true
            } 
        };
    } catch (error) {
        console.error("Team sign-in error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
