import { redirect } from "next/navigation";
import { getFullUserContext } from "@/lib/dal";

export default async function ProjectsRedirect() {
  const userContext = await getFullUserContext();

  if (!userContext) {
      redirect("/sign-in");
  }

  if (userContext.memberships.length === 0) {
      redirect("/new-organisation");
  }

  // Redirect to the first organization's projects page
  const firstOrg = userContext.memberships[0].organization;
  redirect(`/${firstOrg.slug}/projects`);
}
