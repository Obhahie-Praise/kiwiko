import React from 'react';
import NewProjectForm from '@/components/projects/project components/NewProjectForm';
import Navbar from '@/components/common/Navbar';
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

const NewProjectPage = async ({ params }: PageProps) => {
  const { orgSlug } = await params;
  
  const session = await auth.api.getSession({
     headers: await headers()
  });

  if (!session?.user?.id) {
     redirect("/sign-in");
  }

  // Fetch user's organizations
  const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { memberships: { include: { organization: true } } }
  });
  
  const userOrgs = user?.memberships.map(m => m.organization) || [];

  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    select: { id: true, name: true, slug: true, logoUrl: true }
  });

  if (!org) {
      return notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar showNewOrgButton={false} organizations={userOrgs} currentOrg={org} user={session.user} />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-y-auto">
        <NewProjectForm orgId={org.id} />
      </div>
    </div>
  );
};

export default NewProjectPage;
