import React from "react";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import MailForm from "@/components/projects/MailForm";

export default async function MailPage({
  params,
}: {
  params: { orgSlug: string; projectSlug: string };
}) {
  const { orgSlug, projectSlug } = await params;

  // Fetch project using prisma directly so it's public
  const project = await prisma.project.findFirst({
    where: {
      slug: projectSlug,
      organization: {
        slug: orgSlug,
      },
    },
  });

  if (!project) {
     redirect(`/${orgSlug}/projects`);
  }

  return (
    <div className="flex flex-col h-full bg-zinc-50 hero-font">
      <div className="flex-1 w-full">
        <div className="w-full max-w-4xl mx-auto py-12 px-6">
          <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight hero-font">
                Contact {project.name} Team
              </h1>
              <p className="text-zinc-500 text-sm mt-2">
                Send a direct message to the founders and administrators of this project.
              </p>
            </div>
            <MailForm projectId={project.id} />
            
          </div>
        </div>
      </div>
    </div>
  );
}
