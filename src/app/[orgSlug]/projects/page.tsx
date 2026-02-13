import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import ProjectsTable from "@/components/projects/project components/ProjectsTable";
import Navbar from "@/components/common/Navbar";
import Link from "next/link";
import { Plus, FolderPlus, Search, Building2 } from "lucide-react";
import React from "react";

interface PageProps {
  params: Promise<{
    orgSlug: string;
  }>;
}

export default async function OrgProjectsPage({ params }: PageProps) {
  const { orgSlug } = await params;
  
  const session = await auth.api.getSession({
     headers: await headers()
  });

  if (!session?.user?.id) {
     redirect("/sign-in");
  }

  // Fetch user with organizations
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

  if (!currentOrg) {
      return notFound();
  }

  // Fetch projects
  const projects = await prisma.project.findMany({
      where: { orgId: currentOrg.id },
      orderBy: { updatedAt: 'desc' }
  });

  // Map to Table format (preserving mock fields for UI compatibility for now)
  // Map to Table format
  const mappedProjects = projects.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      logoUrl: p.logoUrl,
      branch: "main", 
      stage: p.stage || "Idea", 
      status: "Active", 
      progress: 0, 
      invested: "$0", 
      valuation: p.postMoneyValuation ? `$${p.postMoneyValuation}` : "$0", 
      roi: "0%", 
      lastUpdate: new Date(p.updatedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
  }));

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Navbar 
        organizations={organizations} 
        currentOrg={currentOrg} 
        user={session.user} 
      />

      <main className="flex mt-10 items-center justify-center pb-20">
        <div className="min-w-4xl w-full max-w-5xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               {/* Logo + Text Header */}
               <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                   {currentOrg.logoUrl ? (
                       <img src={currentOrg.logoUrl} alt={currentOrg.name} className="w-full h-full object-cover" />
                   ) : (
                       <Building2 className="text-zinc-400" size={20} />
                   )}
               </div>
               <div>
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2 capitalize">
                      {currentOrg.name + "'s"}  
                      <span className="text-zinc-500 font-medium">projects</span>
                  </h1>
               </div>
               
               <span className="ml-2 text-zinc-500 text-xs bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-sm font-medium">
                {mappedProjects.length} {mappedProjects.length === 1 ? 'project' : 'projects'}
               </span>
            </div>
            
            <Link href={`/${orgSlug}/new-project`}>
              <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2 active:scale-95">
                <Plus size={18} />
                New Project
              </button>
            </Link>
          </div>
          
          {mappedProjects.length > 0 ? (
            <div className="w-full p-0 border border-zinc-200 rounded-2xl bg-white shadow-xl overflow-visible">
              <ProjectsTable projects={mappedProjects} />
            </div>
          ) : (
            <div className="w-full py-20 border-2 border-dashed border-zinc-200 rounded-3xl bg-white/50 flex flex-col items-center justify-center text-center px-10">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 text-zinc-400">
                <FolderPlus size={32} />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">No projects found</h2>
              <p className="text-zinc-500 max-w-sm mb-8">
                This organization doesn't have any projects yet. Start by creating your first startup venture.
              </p>
              <Link href={`/${orgSlug}/new-project`}>
                <button className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95">
                  <Plus size={18} />
                  Create First Project
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
