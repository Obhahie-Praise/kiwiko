import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProjectsRedirect() {
  const session = await auth.api.getSession({
      headers: await headers()
  });

  if (!session?.user?.id) {
      redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
          memberships: {
              include: {
                  organization: true 
              } 
          } 
      }
  });

  if (!user || user.memberships.length === 0) {
      redirect("/new-organisation");
  }

  // Redirect to the first organization's projects page
  const firstOrg = user.memberships[0].organization;
  redirect(`/${firstOrg.slug}/projects`);
}
