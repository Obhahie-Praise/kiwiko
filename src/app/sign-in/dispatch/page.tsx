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
    console.log("SignInDispatchPage: Checking memberships for user", userId);
    
    // Fetch organizations where the user is a member
    const memberships = await prisma.membership.findMany({
        where: { userId: userId },
        include: { organization: { select: { slug: true } } },
        orderBy: { joinedAt: 'asc' }
    });

    console.log(`SignInDispatchPage: Found ${memberships.length} memberships`);

    if (memberships.length === 0) {
        // User exists but has no organizations (new user or deleted orgs)
        console.log("SignInDispatchPage: No memberships found, redirecting to onboarding/setup");
        return redirect("/onboarding/setup?page=1");
    }

    // Redirect to the first organization's projects page
    const firstOrg = memberships[0].organization;
    console.log(`SignInDispatchPage: Redirecting to organization: ${firstOrg.slug}`);
    return redirect(`/${firstOrg.slug}/projects`);
}
