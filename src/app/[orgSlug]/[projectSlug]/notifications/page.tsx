import NotificationsPage from "@/components/NotificationsPage";
import { getProjectHomeDataAction } from "@/actions/project.actions";
import { getNotificationsAction } from "@/actions/notification.actions";
import { redirect } from "next/navigation";
import React from "react";

export default async function UpdatesPage({
  params,
}: {
  params: { orgSlug: string; projectSlug: string };
}) {
  const { orgSlug, projectSlug } = await params;
  
  const contextRes = await getProjectHomeDataAction(orgSlug, projectSlug);
  if (!contextRes.success) {
    redirect(`/${orgSlug}/projects`);
  }

  const projectId = contextRes.data.project.id;
  const notifRes = await getNotificationsAction(projectId);
  const initialNotifications = notifRes.success && notifRes.data ? notifRes.data : [];

  return (
    <div className="">
      <nav className="px-3 py-2 flex items-center justify-between w-full">
        <div className="">
          <h1 className="text-xl uppercase font-bold italic text-zinc-900">Notifications</h1>
        </div>
      </nav>
      <NotificationsPage initialNotifications={initialNotifications} />
    </div>
  );
}