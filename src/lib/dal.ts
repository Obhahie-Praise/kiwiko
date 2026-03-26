"use server";

import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

/**
 * Request-memoized session fetcher.
 */
export const getSession = cache(async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session;
    } catch (error) {
        console.error("Error fetching session:", error);
        return null;
    }
});

/**
 * Request-memoized user fetcher. 
 * Use this to get the current authenticated user and their metadata.
 */
export const getCurrentUser = cache(async () => {
    const session = await getSession();
    if (!session?.user) return null;
    return session.user;
});

/**
 * Request-memoized user fetcher with full context (memberships and organizations).
 */
export const getFullUserContext = cache(async () => {
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
});

/**
 * Request-memoized user fetcher with project memberships.
 */
export const getUserWithProjectMemberships = cache(async () => {
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
});

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
export const getOrganization = cache(async (orgIdOrSlug: string) => {
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
});

/**
 * Request-memoized project fetcher.
 */
export const getProject = cache(async (projectIdOrSlug: string, orgId?: string) => {
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
});

/**
 * Checks if user is a member of an organization and returns their role.
 */
export const getOrgMembership = cache(async (orgIdOrSlug: string) => {
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
});

/**
 * Request-memoized organization projects fetcher.
 */
export const getOrganizationProjects = cache(async (orgId: string) => {
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
});
