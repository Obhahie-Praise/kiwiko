import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, Globe, Shield, Users } from "lucide-react";
import { getSession, getUserWithProjectMemberships } from "@/lib/dal";

export default async function MyProjectsPage() {
    const session = await getSession();
    if (!session?.user?.id) {
        redirect("/sign-in?callbackUrl=/my-projects");
    }

    const userWithProjects = await getUserWithProjectMemberships();

    const projects = userWithProjects?.projectMemberships.map((m: any) => ({
        ...m.project,
        role: m.role
    })) || [];

    return (
        <div className="min-h-screen bg-zinc-50/50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/neutral-logo.svg" alt="Kiwiko" width={28} height={28} className="rotate-12" />
                        <span className="text-xl font-black uppercase tracking-tighter italic">Kiwiko</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt={session.user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-xs font-black uppercase">{session.user.name.charAt(0)}</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="space-y-12">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-zinc-900 uppercase italic tracking-tighter leading-none">
                            My <span className="text-zinc-400">Projects.</span>
                        </h1>
                        <p className="font-bold text-zinc-500 max-w-xl">
                            All your active project collaborations and authorized environments in one place.
                        </p>
                    </div>

                    {projects.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-zinc-200 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-300">
                                <Box size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tight">No active projects</h3>
                                <p className="text-zinc-500 font-bold max-w-xs mx-auto">
                                    You haven't been invited to any projects yet or your invites have expired.
                                </p>
                            </div>
                            <Link 
                                href="/discover"
                                className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all active:scale-[0.98]"
                            >
                                Explore Opportunities
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((p) => (
                                <Link 
                                    key={p.id}
                                    href={`/${p.organization.slug}/${p.slug}/overview`}
                                    className="group bg-white border border-zinc-200 rounded-[2rem] p-8 hover:border-zinc-900 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Background Decor */}
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-zinc-50 rounded-full group-hover:bg-zinc-100 transition-colors z-0" />
                                    
                                    <div className="relative z-10 flex flex-col h-full space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="h-14 w-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                                                {p.logoUrl ? (
                                                    <img src={p.logoUrl} alt={p.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <Box className="text-zinc-300" size={24} />
                                                )}
                                            </div>
                                            <div className="px-3 py-1 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full group-hover:bg-emerald-500 transition-colors">
                                                {p.role}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 group-hover:text-zinc-900 transition-colors leading-none">
                                                {p.name}
                                            </h3>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                {p.organization.name}
                                            </p>
                                        </div>

                                        <p className="text-zinc-500 font-bold text-sm line-clamp-2 flex-1">
                                            {p.description || "No project description available. This project is in active development."}
                                        </p>

                                        <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="h-6 w-6 rounded-full bg-zinc-100 border-2 border-white ring-1 ring-zinc-50" />
                                                ))}
                                            </div>
                                            <div className="group-hover:translate-x-1 transition-transform duration-300 text-zinc-900">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Sign-out / Quick Access */}
            <footer className="py-12 px-6 border-t border-zinc-200 mt-auto">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed">
                        &copy; 2026 Kiwiko Institutional. All rights reserved. <br /> Cryptographically secured execution layer.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/profile" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors">Profile Settings</Link>
                        <Link href="/sign-out" className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">Terminate Session</Link>
                    </div>
                 </div>
            </footer>
        </div>
    );
}
