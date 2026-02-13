"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Globe, Wallet, ChevronDown, Check, UserPlus, FileText, Target, Tag, Users, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import UploadDropzone from "../../ui/upload/UploadDropZone";
import { createProjectAction } from "@/actions/project.actions";

interface NewProjectFormProps {
    orgId: string; // This might be passed from a parent or we might need to derive it/fetch it if not available directly, but usually for this form we assume we have it or the slug. 
    // Wait, the previous file used `orgSlug` from params. `orgId` was passed as prop?
    // Checking step 524: `const NewProjectForm = ({ orgId }: NewProjectFormProps) => {`
    // Yes, it expects orgId.
}

const NewProjectForm = ({ orgId }: NewProjectFormProps) => {
    const params = useParams();
    const router = useRouter();
    const orgSlug = params?.orgSlug as string;
    
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [stage, setStage] = useState("Discovery");
    const [niche, setNiche] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [currentRevenue, setCurrentRevenue] = useState("");
    const [postMoneyValuation, setPostMoneyValuation] = useState("");
    
    // Dynamic invites state
    const [invites, setInvites] = useState<{ email: string }[]>([{ email: "" }]);

    const [pitchDeckUrl, setPitchDeckUrl] = useState("");

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleInviteChange = (index: number, value: string) => {
        const newInvites = [...invites];
        newInvites[index].email = value;
        setInvites(newInvites);

        if (index === invites.length - 1 && value.trim() !== "") {
            setInvites([...newInvites, { email: "" }]);
        }
    };

    const handleRemoveInvite = (index: number) => {
        const newInvites = [...invites];
        newInvites.splice(index, 1);
        setInvites(newInvites.length > 0 ? newInvites : [{ email: "" }]);
    };

    const handleSubmit = async () => {
        setIsPending(true);
        setError("");

        try {
            const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const description = tagline; 

            const validInvites = invites
                .map(i => i.email.trim())
                .filter(email => email !== "");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("slug", slug);
            formData.append("orgId", orgId);
            formData.append("description", description);
            formData.append("tagline", tagline);
            formData.append("stage", stage);
            formData.append("niche", niche);
            formData.append("problem", problem);
            formData.append("solution", solution);
            if (currentRevenue) formData.append("currentRevenue", currentRevenue);
            if (postMoneyValuation) formData.append("postMoneyValuation", postMoneyValuation);
            formData.append("invites", JSON.stringify(validInvites));

            if (logoUrl) formData.append("logoUrl", logoUrl);
            if (bannerUrl) formData.append("bannerUrl", bannerUrl);
            if (pitchDeckUrl) formData.append("pitchDeckUrl", pitchDeckUrl);

            const result = await createProjectAction(formData);

            if (result.success) {
                // Trigger emails client-side
                if (result.data.invites && result.data.invites.length > 0) {
                    await Promise.all(result.data.invites.map(async (invite: any) => {
                         try {
                            await fetch("/api/send", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    email: invite.email,
                                    orgName: "Global", // TODO: Fetch legit org name
                                    inviterName: "Founder", // TODO: active user name
                                    inviteLink: `${window.location.origin}/project-invite/${invite.token}`,
                                    logoUrl: logoUrl,
                                    bannerUrl: bannerUrl,
                                    projectName: name
                                })
                            });
                         } catch (e) {
                             console.error("Failed to send invite email", e);
                         }
                    }));
                }
                router.push(`/${result.data.slug}`); 
            } else {
                setError(result.error);
            }

        } catch (err: any) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            <div className="mb-8">
                <Link 
                    href={`/${orgSlug}/projects`} 
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to Projects
                </Link>
                <h1 className="text-2xl font-semibold text-zinc-900">Create New Project</h1>
                <p className="text-zinc-500 mt-1">Define your startup's core vision and assemble your dream team.</p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                {/* Project Banner Upload */}
                <div className="relative h-48 bg-zinc-50 border-b border-zinc-100">
                    <UploadDropzone
                        endpoint="brandBannerUploader"
                        label="Upload Project Banner"
                        onUploadSuccess={(url) => {
                            console.log("Banner Uploaded:", url);
                            setBannerUrl(url);
                        }}
                        className="h-full border-none rounded-none"
                        showPreview={true}
                    />
                    <div className="absolute top-4 right-4 z-20">
                        <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-[10px] text-white rounded-md font-bold uppercase tracking-widest">
                            Project Banner
                        </span>
                    </div>
                </div>

                {/* Section: Basic Info */}
                <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <FileText size={16} className="text-zinc-400" />
                        Basic Information
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div>
                                <UploadDropzone
                                    endpoint="orgLogoUploader"
                                    label="Project Logo"
                                    onUploadSuccess={(url) => {
                                        console.log("Logo Uploaded:", url);
                                        setLogoUrl(url);
                                    }}
                                    className="max-w-[280px]"
                                />
                                <p className="text-[10px] text-zinc-400 mt-2">
                                    SQUARE, PNG or SVG. Max 2MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="tagline" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Catch Phrase (Tagline) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="tagline"
                                    value={tagline}
                                    onChange={(e) => setTagline(e.target.value)}
                                    placeholder="e.g. Dreaming in high definition"
                                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                />
                                <p className="text-[10px] text-zinc-400 mt-1">This will be the main headline on your public profile.</p>
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="stage" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Stage
                                </label>
                                <div className="relative">
                                    <select
                                        id="stage"
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Discovery">Discovery</option>
                                        <option value="Idea">Idea</option>
                                        <option value="MVP">MVP</option>
                                        <option value="Growth">Growth</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="col-span-1">
                                <label htmlFor="niche" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Niche <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        id="niche"
                                        value={niche}
                                        onChange={(e) => setNiche(e.target.value)}
                                        placeholder="e.g. FinTech, AI, SaaS"
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Startup Metadata */}
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Target size={16} className="text-zinc-400" />
                        Startup Core
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="problem" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                The Problem <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="problem"
                                rows={3}
                                value={problem}
                                onChange={(e) => setProblem(e.target.value)}
                                placeholder="What profound problem are you solving?"
                                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400 resize-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="solution" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                The Solution <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="solution"
                                rows={3}
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                placeholder="How does your project solve this problem uniquely?"
                                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="revenue" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Current Revenue (if any)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                    <input
                                        type="text"
                                        id="revenue"
                                        value={currentRevenue}
                                        onChange={(e) => setCurrentRevenue(e.target.value)}
                                        placeholder="e.g. 50,000 ARR"
                                        className="w-full pl-7 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label htmlFor="valuation" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Post-Money Valuation
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                    <input
                                        type="text"
                                        id="valuation"
                                        value={postMoneyValuation}
                                        onChange={(e) => setPostMoneyValuation(e.target.value)}
                                        placeholder="e.g. 5M"
                                        className="w-full pl-7 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Pitch Deck (PDF)
                                </label>
                                <div className="h-48">
                                    <UploadDropzone
                                        endpoint="projectPitchDeckUploader"
                                        label="Upload Pitch Deck (PDF)"
                                        onUploadSuccess={(url) => {
                                            console.log("Pitch Deck Uploaded:", url);
                                            setPitchDeckUrl(url);
                                        }}
                                        className="h-full"
                                        showPreview={true}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 mt-2">
                                    PDF only. Max 8MB. Investors will view this securely.
                                </p>
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="domain" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Project Internal URL
                                </label>
                                <div className="relative flex items-center">
                                    <Globe size={16} className="absolute left-3 text-zinc-400" />
                                    <div className="w-full pl-9 pr-3 py-2 bg-zinc-100 border border-zinc-300 rounded-lg text-sm text-zinc-500 outline-none cursor-not-allowed flex items-center gap-1">
                                        <span>kiwiko.io/{orgSlug}/</span>
                                        <span className="font-bold text-zinc-900">{name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}</span>
                                    </div>
                                    {name && (
                                        <div className="absolute right-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-medium flex items-center gap-1 uppercase tracking-tight">
                                            <Check size={10} /> Validated
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Assemblers / Team */}
                <div className="p-6">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Users size={16} className="text-zinc-400" />
                        Project Team
                    </h2>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-700">
                             Invite Members
                        </label>
                        {invites.map((invite, index) => (
                             <div key={index} className="flex gap-3">
                                <input
                                    type="email"
                                    value={invite.email}
                                    onChange={(e) => handleInviteChange(index, e.target.value)}
                                    placeholder="colleague@example.com"
                                    className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                                />
                                {invites.length > 1 && (
                                    <button 
                                        onClick={() => handleRemoveInvite(index)}
                                        className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 mt-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-zinc-500">Quick Import</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button className="text-[11px] px-2 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 transition-colors">
                                    Import from Organization
                                </button>
                                <button className="text-[11px] px-2 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 transition-colors">
                                    Import from other Projects
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-zinc-200">
                    <Link
                        href={`/${orgSlug}/projects`}
                        className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-lg transition-colors shadow-sm"
                    >
                        Cancel
                    </Link>
                    <button 
                         onClick={handleSubmit}
                         disabled={isPending}
                         className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? "Creating..." : "Create Project"}
                    </button>
                </div>
                 {error && (
                    <div className="px-6 py-3 bg-red-50 border-t border-red-100">
                        <p className="text-xs text-red-600 font-medium">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewProjectForm;
