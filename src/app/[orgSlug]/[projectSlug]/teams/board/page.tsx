import TeamBoardClient from "@/components/teams/board/TeamBoardClient";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import { notFound } from "next/navigation";

export default async function TeamsBoardPage(
  props: { params: Promise<{ orgSlug: string; projectSlug: string }> }
) {
  const { orgSlug, projectSlug } = await props.params;

  const res = await getProjectHomeDataAction(orgSlug, projectSlug);
  if (!res.success || !res.data) return notFound();

  const activeMembers = res.data.project.members.map((m: any) => ({
      id: m.userId,
      name: m.user.name || m.user.email?.split("@")[0] || "Unknown",
      email: m.user.email || "",
      role: m.role,
      avatar: m.user.image || "https://api.dicebear.com/7.x/notionists/svg?seed=" + m.userId,
      joinedAt: new Date(m.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }),
  }));

  const pendingInvites = res.data.project.invites
      .filter((i: any) => !i.accepted)
      .map((i: any) => ({
          id: i.id,
          name: i.email?.split("@")[0] || "Invited User",
          email: i.email,
          role: i.role,
          avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=" + i.email + "&backgroundColor=f1f5f9",
          joinedAt: new Date(i.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric", day: "numeric" }),
          status: "Pending"
      }));

  const allMembers = [...activeMembers, ...pendingInvites];

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-900">Team Board</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage your founding team and their project roles.</p>
      </div>
      <TeamBoardClient members={allMembers} projectId={res.data.project.id} />
    </div>
  );
}
