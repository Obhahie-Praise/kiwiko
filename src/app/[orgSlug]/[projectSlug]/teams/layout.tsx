// app/[orgSlug]/[projectSlug]/teams/layout.tsx
import { ReactNode } from "react";
import TeamHeader from "@/components/teams/board/TeamHeader";
import TeamTabs from "@/components/teams/board/TeamTabs";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function TeamsLayout(
  props: {
    children: ReactNode;
    params: Promise<{ orgSlug: string; projectSlug: string }>;
  }
) {
  const { orgSlug, projectSlug } = await props.params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return redirect("/sign-in");

  const res = await getProjectHomeDataAction(orgSlug, projectSlug);
  if (!res.success || !res.data) return notFound();

  const { project, membership } = res.data;

  // Derive Team Properties required by the UI
  const team = {
    id: project.id,
    name: project.name,
    role: project.members.find((m: any) => m.userId === session.user.id)?.role || "Member",
    membersCount: project.members.length,
    rawProjectData: project // Passing the full project tree for children
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <TeamHeader team={team} orgSlug={orgSlug} />

      <div className="border-b bg-white">
        <TeamTabs />
      </div>

      {/* CONTENT */}
      <main className="p-6 max-w-7xl mx-auto">
        {props.children}
      </main>
    </div>
  );
}