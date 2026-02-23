import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import OrgControlCenter from "@/components/organization/OrgControlCenter";
import ProjectPublicView from "@/components/projects/ProjectPublicView";
import prisma from "@/lib/prisma";
import { organizations, projects } from "@/constants";
import { auth } from "@/lib/auth"; // Assuming auth is available here
import { headers } from "next/headers";
import { 
  getProjectRepoDetails, 
  getProjectGithubBranches, 
  getProjectGithubCommits 
} from "@/actions/github.actions";

export async function generateMetadata({ params }: any) {
  const { orgSlug } = await params;
  return {
    title: `${orgSlug} | Kiwiko`,
    description: `View and manage the ${orgSlug} ecosystem on Kiwiko.`,
  };
}

export default async function PublicProjectProfilePage({ params }: any) {
  const { orgSlug } = await params;

  const session = await auth.api.getSession({
     headers: await headers()
  });

  // Fetch user's organizations for Navbar - Only owned ones!
  let userOrgs: any[] = [];
  if (session?.user?.id) {
    userOrgs = await prisma.organization.findMany({
        where: { ownerId: session.user.id }
    });
  }
  
  // 1. Try to find Organization in DB
  const org = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    include: {
      memberships: true,
      invites: true,
    },
  });

  if (org) {
    // SECURITY: Only allow owner to see the control center
    if (!session?.user?.id || org.ownerId !== session.user.id) {
        // If it's not the owner, we check if it's a project slug (handled below)
        // or redirect to projects if they are logged in, or sign-in if not.
        if (session?.user?.id) {
            // Redirect to their own dashboard or projects
            // But wait, let's let the project check run first in case the orgSlug is actually a project slug
        } else {
            return redirect("/sign-in");
        }
    } else {
        // Owner access - Render OrgControlCenter
        const userIds = org.memberships.map((m) => m.userId);
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true, image: true },
        });

        const members = [
          ...org.memberships.map((m) => {
            const u = users.find((user) => user.id === m.userId);
            return {
              id: m.userId,
              email: u?.email || "Unknown",
              name: u?.name || "Member",
              image: u?.image || "",
              role: m.role,
              joinedAt: m.joinedAt,
              status: "active" as const,
            };
          }),
          ...org.invites.map((i) => ({
            id: i.id,
            email: i.email,
            role: i.role,
            status: "invited" as const,
          })),
        ];

        const initialData = {
            name: org.name,
            slug: org.slug,
            niche: org.niche || "",
            description: org.description || "",
            logoUrl: org.logoUrl || "",
            bannerUrl: org.bannerUrl || "",
            members: members,
        };

        return (
          <div className="min-h-screen bg-white">
            <Navbar organizations={userOrgs} currentOrg={org} user={session?.user} />
            <main className="pt-12 px-6">
              <OrgControlCenter orgId={org.id} initialData={initialData} />
            </main>
          </div>
        );
    }
  }

  // 2. Try to find Project in DB
  const projectDB = await prisma.project.findFirst({
    where: { slug: orgSlug },
    include: {
      organization: true,
      members: {
        include: { user: true }
      },
      invites: true,
      signals: true,
    }
  });

  // Fetch organization separately if project found (already included above)
  let projectOrg = null;
  if (projectDB) {
      projectOrg = (projectDB as any).organization;
  }

  if (projectDB) {
      let githubData = null;
      let branches: any[] = [];
      let initialCommits: any[] = [];

      const projectAny = projectDB as any;

      if (projectAny.githubRepoFullName && projectAny.githubConnectedBy) {
        const [repoRes, branchesRes, commitsRes] = await Promise.all([
          getProjectRepoDetails(projectAny.githubRepoFullName, projectAny.githubConnectedBy),
          getProjectGithubBranches(projectAny.githubRepoFullName, projectAny.githubConnectedBy),
          getProjectGithubCommits(projectAny.githubRepoFullName, projectAny.githubConnectedBy)
        ]);

        if (repoRes.success) githubData = repoRes.data;
        if (branchesRes.success) branches = branchesRes.data;
        if (commitsRes.success) initialCommits = commitsRes.data;
      }

      // Enrich project members
      const org = projectAny.organization as any;

      const members = [
        ...(projectAny.members || []).map((m: any) => ({
          id: m.userId,
          email: m.user?.email || "Unknown",
          name: m.user?.name || "Member",
          image: m.user?.image || "",
          role: m.role,
          joinedAt: m.joinedAt,
          status: "active" as const,
        })),
        ...(projectAny.invites || []).filter((i: any) => !i.accepted).map((i: any) => ({
          id: i.id,
          email: i.email,
          name: i.email.split('@')[0],
          image: "",
          role: i.role,
          joinedAt: i.createdAt,
          status: "invited" as const,
        })),
      ];

      const enrichedOrg = {
        ...org,
        members: members
      };

      return (
        <ProjectPublicView 
          project={{
            ...projectAny,
            signals: projectAny.signals || []
          }} 
          organization={enrichedOrg} 
          orgSlug={orgSlug}
          githubData={githubData}
          branches={branches}
          initialCommits={initialCommits}
        />
      );
  }


  // 3. Fallback to mock data (Constants)
  // Find the project - mapping name to slug
  const projectMock = projects.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-") === orgSlug
  );
  
  // If it's a mock organization
  const isMockOrg = organizations.some((o) => o.slug === orgSlug);
  const mockOrg = organizations.find((o) => o.slug === orgSlug);

  if (isMockOrg && !projectMock) {
     // Mock Data Rendering for Org
     // We can just redirect to projects or show 404 since we want "Real Data" primarily?
     // But for "Open AI" etc in the mock list, we should probably keep showing something.
     // However, OrgControlCenter expects specific prop structure now.
     // I'll skip rendering OrgControlCenter for mock orgs to avoid breaking it with mismatched datatypes
     // unless I map it correctly.
     // Given the user wants "Real Data", they probably create new orgs.
     // I will Render a placeholder or just 404 for mock orgs if not in DB, 
     // OR map the mock data to OrgJson.
     
     const mockDataMapped = {
        name: mockOrg?.name || "Org",
        slug: mockOrg?.slug || orgSlug,
        niche: "Tech",
        description: "Mock Organization Description",
        logoUrl: "",
        bannerUrl: "",
        members: [{ id: "m1", email: "demo@example.com", role: "ADMIN", status: "active" as const }]
     };
     
     // We don't have an ID for mock org, pass slug?
     return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-12 px-6">
          <OrgControlCenter orgId={mockOrg?.id || "mock-id"} initialData={mockDataMapped} />
        </main>
      </div>
    );
  }

  if (projectMock) {
    const orgForMock = organizations.find(o => o.slug === (projectMock.orgSlug || orgSlug));
    return <ProjectPublicView project={projectMock} organization={orgForMock} orgSlug={orgSlug} />;
  }

  // 404
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <h1 className="text-4xl font-black text-zinc-900 mb-4">404</h1>
        <p className="text-zinc-500 font-medium tracking-tight">
          Venture not found.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
