import NewProjectForm from '@/components/projects/project components/NewProjectForm';
import Navbar from '@/components/common/Navbar';
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getFullUserContext, getOrganization } from "@/lib/dal";

interface PageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

const NewProjectPage = async ({ params }: PageProps) => {
  const { orgSlug } = await params;
  
  const userContext = await getFullUserContext();
  if (!userContext) {
    await setContextCookie(orgSlug);
    redirect("/sign-in?projects"); 
  }

  const userOrgs = userContext.memberships.map((m: any) => m.organization) || [];

  const org = await getOrganization(orgSlug);

  if (!org) {
      return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar showNewOrgButton={false} organizations={userOrgs} currentOrg={org} user={userContext} />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-y-auto">
        <NewProjectForm orgId={org.id} />
      </div>
    </div>
  );
};

export default NewProjectPage;
