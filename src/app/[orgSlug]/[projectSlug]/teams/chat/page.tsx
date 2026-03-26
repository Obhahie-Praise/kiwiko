import ChatLayout from "@/components/teams/chat/ChatLayout";
import { mockMessages } from "@/constants/index";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import { getSession } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function TeamsChatPage(
  props: { params: Promise<{ orgSlug: string; projectSlug: string }> }
) {
  const { orgSlug, projectSlug } = await props.params;

  const res = await getProjectHomeDataAction(orgSlug, projectSlug);
  if (!res.success || !res.data) return notFound();

  const session = await getSession();
  const currentUserId = session?.user?.id;

  const activeMembers = res.data.project.members
    .filter((m: any) => m.userId !== currentUserId)
    .map((m: any, idx: number) => {
      const date = new Date();
      date.setMinutes(date.getMinutes() - (idx + 1) * 15);
      return {
          id: m.userId,
          name: m.user.name || m.user.email?.split("@")[0] || "Unknown",
          role: m.role,
          avatar: m.user.image || "https://api.dicebear.com/7.x/notionists/svg?seed=" + m.userId,
          isOnline: idx === 0 || Math.random() > 0.5,
          time: `${(idx + 1) * 15} mins ago`,
          lastMessageAt: date.getTime()
      }
  });

  const pendingInvites = res.data.project.invites
      .filter((i: any) => !i.accepted)
      .map((i: any, idx: number) => {
          const date = new Date();
          date.setDate(date.getDate() - (idx + 1));
          return {
              id: i.id,
              name: i.email?.split("@")[0] || "Invited User",
              role: i.role,
              avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=" + i.email + "&backgroundColor=f1f5f9",
              isOnline: false,
              time: `${idx + 1} days ago`,
              lastMessageAt: date.getTime()
          }
      });

  const groupChatDate = new Date();
  groupChatDate.setMinutes(groupChatDate.getMinutes() - 2);

  const contacts = [
    {
        id: "ai-agent",
        name: "Kiwiko Agent",
        role: "AI Bot",
        avatar: "/kiwiko-agent.svg",
        isOnline: true,
        time: "Now",
        lastMessageAt: Date.now()
    },
    {
      id: "group",
      name: "Team Group Chat",
      role: "All Members",
      avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=128&h=128&fit=crop",
      isOnline: true,
      time: "2 mins ago",
      lastMessageAt: groupChatDate.getTime()
    },
    ...activeMembers, 
    ...pendingInvites
  ].sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  return (
    <div className="min-h-[85vh] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        {/* <div>
          <h2 className="text-2xl font-bold text-zinc-900">Chats</h2>
          <p className="text-sm text-zinc-500 mt-1">Real-time collaboration across your team.</p>
        </div> */}
      </div>
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <ChatLayout
          initialMessages={mockMessages}
          contacts={contacts}
          currentUserId={currentUserId}
          projectId={res.data.project.id}
        />
      </div>
    </div>
  );
}
