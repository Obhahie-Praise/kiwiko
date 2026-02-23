import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import ProjectSettingsForm from "@/components/projects/ProjectSettingsForm";

interface PageProps {
  params: Promise<{
    orgSlug: string;
    projectSlug: string;
  }>;
}

export default async function ProjectSettingsPage({ params }: PageProps) {
  const { orgSlug, projectSlug } = await params;
  
  const session = await auth.api.getSession({
     headers: await headers()
  });

  if (!session?.user?.id) {
     redirect("/sign-in");
  }

  // Fetch user details for Navbar
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

  if (!user) redirect("/sign-in");
  const organizations = user.memberships.map(m => m.organization);
  const currentOrg = organizations.find(o => o.slug === orgSlug);

  if (!currentOrg) return notFound();

  // Fetch Project
  const project = await prisma.project.findUnique({
      where: {
          orgId_slug: {
              orgId: currentOrg.id,
              slug: projectSlug
          }
      },
      include: {
          invites: true,
          members: {
              include: {
                  user: true
              }
          },
          signals: true
      }
  });

  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-zinc-50/50">
       <Navbar 
         organizations={organizations} 
         currentOrg={currentOrg} 
         user={session.user} 
       />
       
       <main className="flex justify-center pt-10 px-6">
          <ProjectSettingsForm project={project} orgSlug={orgSlug} />
       </main>
    </div>
  );
}
