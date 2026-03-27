import { getProjectHomeDataAction, getProjectUpdatesAction } from "@/actions/project.actions";
import { getSession, setContextCookie } from "@/lib/dal";
import { redirect } from "next/navigation";
import UpdateForm from "@/components/projects/UpdateForm";
import UpdateList from "@/components/projects/UpdateList";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProjectUpdatesPage({ params }: { params: Promise<{ orgSlug: string, projectSlug: string }> }) {
    const { orgSlug, projectSlug } = await params;
    const session = await getSession();
    
    if (!session?.user) {
        await setContextCookie(orgSlug, projectSlug);
        redirect("/sign-in?updates");
    }

    const contextRes = await getProjectHomeDataAction(orgSlug, projectSlug);

    if (!contextRes.success) {
        redirect(`/${orgSlug}/projects`);
    }

    const { project } = contextRes.data;
    
    const updatesRes = await getProjectUpdatesAction(project.id);
    const updates = updatesRes.success ? updatesRes.data : [];

    return (
        <div className="flex flex-col h-full bg-zinc-50 relative min-h-screen">
            <div className="max-w-4xl mx-auto p-6 w-full">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* <Link 
                            href={`/${orgSlug}/${projectSlug}/overview`}
                            className="p-2 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors shadow-sm text-zinc-600"
                        >
                            <ArrowLeft size={18} />
                        </Link> */}
                        <div className="flex items-center gap-3">
                            {/* <div className="p-2.5 bg-zinc-900 rounded-xl shadow-lg shadow-zinc-200">
                                <Sparkles className="text-white" size={20} />
                            </div> */}
                            <div>
                                <h1 className="text-xl font-semibold text-zinc-900 special-font tracking-wide">Project Updates</h1>
                                <p className="text-zinc-500 text-sm font-medium">Post and view progress updates for {project.name}.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <section>
                        <UpdateForm projectId={project.id} />
                    </section>

                    <section className="pb-12">
                        <UpdateList updates={updates as any[]} />
                    </section>
                </div>
            </div>
        </div>
    );
}
