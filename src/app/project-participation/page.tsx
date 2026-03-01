import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectsTable from "@/components/projects/project components/ProjectsTable";
import Navbar from "@/components/common/Navbar";
import { FolderPlus, Users } from "lucide-react";
import React from "react";

export default async function ProjectParticipationPage() {
  const session = await auth.api.getSession({
     headers: await headers()
  });

  if (!session?.user?.id) {
     redirect("/sign-in");
  }

  // Fetch projects where the user is a member
  const projectMemberships = await prisma.projectMember.findMany({
      where: { userId: session.user.id },
      include: {
          project: {
              include: {
                  organization: true
              }
          }
      },
      orderBy: { project: { updatedAt: 'desc' } }
  });

  // Fetch all organizations the user is part of (for the Navbar)
  const userWithOrgs = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
          memberships: {
              include: {
                  organization: true
              }
          }
      }
  });

  const organizations = userWithOrgs?.memberships.map(m => m.organization) || [];

  // Map to Table format
  const mappedProjects = projectMemberships.map(pm => ({
      id: pm.project.id,
      name: pm.project.name,
      slug: pm.project.slug,
      orgSlug: pm.project.organization.slug, // Added for dynamic routing
      logoUrl: pm.project.logoUrl,
      branch: "main", 
      stage: pm.project.stage || "Idea", 
      status: "Active", 
      progress: 0, 
      invested: "$0", 
      valuation: pm.project.postMoneyValuation ? `$${pm.project.postMoneyValuation}` : "$0", 
      roi: "0%", 
      lastUpdate: new Date(pm.project.updatedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
  }));

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <Navbar 
        organizations={organizations} 
        user={session.user} 
        showNewOrgButton={false}
      />

      <main className="flex mt-10 items-center justify-center pb-20">
        <div className="min-w-4xl w-full max-w-5xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  <Users className="text-zinc-400" size={20} />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                      Involved  
                      <span className="text-zinc-500 font-medium">projects</span>
                  </h1>
                  <p className="text-xs text-zinc-500 font-medium">Projects you've been invited to participate in</p>
               </div>
               
               <span className="ml-2 text-zinc-500 text-xs bg-white border border-zinc-200 px-2.5 py-1 rounded-full shadow-sm font-medium">
                {mappedProjects.length} {mappedProjects.length === 1 ? 'project' : 'projects'}
               </span>
            </div>
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
                You haven't been added to any projects yet. When you're invited to a team, the projects will appear here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
