import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ProjectSettingsForm from "@/components/projects/ProjectSettingsForm";
import { getFullUserContext, getProject } from "@/lib/dal";

interface PageProps {
  params: Promise<{
    orgSlug: string;
    projectSlug: string;
  }>;
}

export default async function ProjectSettingsPage({ params }: PageProps) {
  const { orgSlug, projectSlug } = await params;
  
  const userContext = await getFullUserContext();
  if (!userContext) redirect("/sign-in");

  const organizations = userContext.memberships.map((m: any) => m.organization);
  const currentOrg = organizations.find((o: any) => o.slug === orgSlug);

  if (!currentOrg) return notFound();

  // Fetch Project using DAL
  const project = await getProject(projectSlug, currentOrg.id);

  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-zinc-50/50">
       <Navbar 
         organizations={organizations} 
         currentOrg={currentOrg} 
         user={userContext} 
       />
       
       <main className="flex justify-center pt-10 px-6">
          <ProjectSettingsForm project={project} />
       </main>
    </div>
  );
}
