"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Request-memoized session fetcher.
 */
export const getSession = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session;
    } catch (error) {
        console.error("Error fetching session:", error);
        return null;
    }
};

/**
 * Request-memoized user fetcher. 
 * Use this to get the current authenticated user and their metadata.
 */
export const getCurrentUser = async () => {
    const session = await getSession();
    if (!session?.user) return null;
    return session.user;
};

/**
 * Request-memoized user fetcher with full context (memberships and organizations).
 */
export const getFullUserContext = async () => {
    const session = await getSession();
    if (!session?.user?.id) return null;

    return prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            memberships: {
                include: {
                    organization: true
                }
            }
        }
    });
};

/**
 * Request-memoized user fetcher with project memberships.
 */
export const getUserWithProjectMemberships = async () => {
    const session = await getSession();
    if (!session?.user?.id) return null;

    return prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            projectMemberships: {
                include: {
                    project: {
                        include: {
                            organization: true
                        }
                    }
                }
            }
        }
    });
};

/**
 * Ensures user is authenticated, otherwise redirects or returns null.
 */
export const verifyAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    return user;
};

/**
 * Request-memoized organization fetcher.
 */
export const getOrganization = async (orgIdOrSlug: string) => {
    const user = await getCurrentUser();
    if (!user) return null;

    return prisma.organization.findFirst({
        where: {
            OR: [
                { id: orgIdOrSlug },
                { slug: orgIdOrSlug }
            ],
            memberships: {
                some: {
                    userId: user.id
                }
            }
        },
        include: {
            memberships: {
                where: { userId: user.id }
            },
            invites: true
        }
    });
};

/**
 * Request-memoized project fetcher.
 */
export const getProject = async (projectIdOrSlug: string, orgId?: string) => {
    const user = await getCurrentUser();
    if (!user) return null;

    return prisma.project.findFirst({
        where: {
            OR: [
                { id: projectIdOrSlug },
                { slug: projectIdOrSlug }
            ],
            ...(orgId ? { orgId } : {}),
            organization: {
                memberships: {
                    some: {
                        userId: user.id
                    }
                }
            }
        },
        include: {
            organization: true,
            members: {
                include: {
                    user: true
                }
            },
            signals: true,
            invites: true
        }
    });
};

/**
 * Checks if user is a member of an organization and returns their role.
 */
export const getOrgMembership = async (orgIdOrSlug: string) => {
    const user = await getCurrentUser();
    if (!user) return null;

    return prisma.membership.findFirst({
        where: {
            userId: user.id,
            organization: {
                OR: [
                    { id: orgIdOrSlug },
                    { slug: orgIdOrSlug }
                ]
            }
        },
        include: {
            organization: true
        }
    });
};

/**
 * Request-memoized organization projects fetcher.
 */
export const getOrganizationProjects = async (orgId: string) => {
    const user = await getCurrentUser();
    if (!user) return [];

    return prisma.project.findMany({
        where: {
            orgId,
            organization: {
                memberships: {
                    some: {
                        userId: user.id
                    }
                }
            }
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });
};

/**
 * Sets a context cookie for the current organization and project.
 * This is used for aesthetic sign-in redirects.
 */
export const setContextCookie = async (orgSlug: string, projectSlug?: string) => {
    const { cookies } = await import("next/headers");
    (await cookies()).set("last_context", JSON.stringify({ orgSlug, projectSlug }), {
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });
};

/**
 * Gets the last stored context from cookies.
 */
export const getContextCookie = async () => {
    const { cookies } = await import("next/headers");
    const cookie = (await cookies()).get("last_context");
    if (!cookie) return null;
    try {
        return JSON.parse(cookie.value);
    } catch {
        return null;
    }
};
