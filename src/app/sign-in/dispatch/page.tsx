import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export default async function SignInDispatchPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // If no session is found, something went wrong with the authentication flow
    // Redirect back to sign-in instead of onboarding
    if (!session?.user?.id) {
        console.error("SignInDispatchPage: No session found after sign-in");
        return redirect("/sign-in");
    }

    const userId = session.user.id;

    try {
        // Fetch organizations where the user is a member
        const memberships = await prisma.membership.findMany({
            where: {
                userId: userId
            },
            include: {
                organization: {
                    select: {
                        slug: true
                    }
                }
            },
            orderBy: {
                joinedAt: 'asc'
            }
        });

        if (memberships.length === 0) {
            // User exists but has no organizations (new user or deleted orgs)
            return redirect("/onboarding");
        }

        // Redirect to the first organization's projects page
        const firstOrg = memberships[0].organization;
        return redirect(`/${firstOrg.slug}/projects`);

    } catch (error) {
        console.error("SignInDispatchPage: Failed to fetch memberships:", error);
        // On error, fallback to onboarding as a safe harbor
        return redirect("/onboarding");
    }
}
