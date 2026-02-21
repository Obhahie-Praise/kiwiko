"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Globe, Wallet, ChevronDown, Check, UserPlus, FileText, Target, Tag, Users, X, Github, Lock, Search, Loader2, Instagram, Linkedin, Twitter, Youtube, Info, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import UploadDropzone from "../../ui/upload/UploadDropZone";
import { createProjectAction } from "@/actions/project.actions";
import { getUserGithubRepos } from "@/actions/github.actions";
import { getLinkIcon } from "@/lib/url-utils";
import { useEffect } from "react";
import { signIn } from "@/lib/auth-client";
import { Tooltip } from "../../lightswind/tooltip";
import { SignalType } from "@/generated/prisma";

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
    
    // Dynamic links state
    const [links, setLinks] = useState<{ url: string }[]>([{ url: "" }]);

    const [pitchDeckUrl, setPitchDeckUrl] = useState("");

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    // GitHub Integration State
    const [githubRepos, setGithubRepos] = useState<any[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [repoSearch, setRepoSearch] = useState("");
    const [isFetchingRepos, setIsFetchingRepos] = useState(false);
    const [isLinkingGithub, setIsLinkingGithub] = useState(false);
    const [repoError, setRepoError] = useState<string | null>(null);
    const [selectedSignals, setSelectedSignals] = useState<SignalType[]>([]);
    const [showAllRepos, setShowAllRepos] = useState(false);

    useEffect(() => {
        const fetchRepos = async () => {
            setIsFetchingRepos(true);
            setRepoError(null);
            const res = await getUserGithubRepos();
            if (res.success) {
                setGithubRepos(res.data);
            } else {
                setRepoError(res.error);
                if (res.error === "no linked github") {
                    setGithubRepos([]);
                }
            }
            setIsFetchingRepos(false);
        };
        fetchRepos();
    }, []);

    const allFilteredRepos = githubRepos.filter(repo => 
        repo.full_name.toLowerCase().includes(repoSearch.toLowerCase())
    );
    const filteredRepos = showAllRepos ? allFilteredRepos : allFilteredRepos.slice(0, 5);

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

    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index].url = value;
        setLinks(newLinks);

        if (index === links.length - 1 && value.trim() !== "") {
            setLinks([...newLinks, { url: "" }]);
        }
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks.length > 0 ? newLinks : [{ url: "" }]);
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

            const validLinks = links
                .map(l => l.url.trim())
                .filter(link => link !== "");

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
            formData.append("links", JSON.stringify(validLinks));

            if (logoUrl) formData.append("logoUrl", logoUrl);
            if (bannerUrl) formData.append("bannerUrl", bannerUrl);
            if (pitchDeckUrl) formData.append("pitchDeckUrl", pitchDeckUrl);
            if (selectedRepo) formData.append("githubRepoFullName", selectedRepo);
            
            formData.append("signals", JSON.stringify(selectedSignals));

            const result = await createProjectAction(formData);

            if (result.success) {
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

            {/* Section: Links */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/10">
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Globe size={16} className="text-zinc-400" />
                    Relevant Links
                </h2>
                
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-zinc-700">
                        URLs (GitHub, Twitter, Website, etc.)
                    </label>
                    {links.map((link, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="relative flex-1">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                    {getLinkIcon(link.url)}
                                </div>
                                <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    placeholder="https://..."
                                    className="w-full pl-10 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                                />
                            </div>
                            {links.length > 1 && (
                                <button 
                                    onClick={() => handleRemoveLink(index)}
                                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Section: Connect Signals */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/10">
                <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Sparkles size={16} className="text-zinc-400" />
                    Connect Signals
                </h2>
                
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Available Now</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* GitHub Signal */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedSignals.includes("GITHUB")) {
                                        setSelectedSignals(selectedSignals.filter(s => s !== "GITHUB"));
                                        setSelectedRepo(null);
                                    } else {
                                        setSelectedSignals([...selectedSignals, "GITHUB"]);
                                    }
                                }}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                    selectedSignals.includes("GITHUB")
                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-lg"
                                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedSignals.includes("GITHUB") ? "bg-white/10" : "bg-zinc-50"}`}>
                                        <Github size={20} className={selectedSignals.includes("GITHUB") ? "text-white" : "text-zinc-400"} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">GitHub</p>
                                        <p className={`text-[10px] ${selectedSignals.includes("GITHUB") ? "text-zinc-400" : "text-zinc-500"}`}>Sync code activity</p>
                                    </div>
                                </div>
                                {selectedSignals.includes("GITHUB") && <Check size={16} />}
                            </button>

                            {/* Manual Signal */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedSignals.includes("MANUAL")) {
                                        setSelectedSignals(selectedSignals.filter(s => s !== "MANUAL"));
                                    } else {
                                        setSelectedSignals([...selectedSignals, "MANUAL"]);
                                    }
                                }}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                    selectedSignals.includes("MANUAL")
                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-lg"
                                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedSignals.includes("MANUAL") ? "bg-white/10" : "bg-zinc-50"}`}>
                                        <FileText size={20} className={selectedSignals.includes("MANUAL") ? "text-white" : "text-zinc-400"} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Manual Updates</p>
                                        <p className={`text-[10px] ${selectedSignals.includes("MANUAL") ? "text-zinc-400" : "text-zinc-500"}`}>Post manual progress</p>
                                    </div>
                                </div>
                                {selectedSignals.includes("MANUAL") && <Check size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* GitHub Repo Selection (Conditional) */}
                    {selectedSignals.includes("GITHUB") && (
                        <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Repository</p>
                                    <p className="text-[9px] font-medium text-zinc-400">{allFilteredRepos.length} Repositories Found</p>
                                </div>
                                {selectedRepo && (
                                    <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase tracking-tight flex items-center gap-1">
                                        <Check size={10} /> {selectedRepo}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search your repositories..."
                                    value={repoSearch}
                                    onChange={(e) => setRepoSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                                />
                            </div>

                            <div className="space-y-2">
                                {isFetchingRepos ? (
                                    <div className="py-6 flex flex-col items-center justify-center gap-2 text-zinc-400">
                                        <Loader2 size={20} className="animate-spin" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Fetching...</span>
                                    </div>
                                ) : repoError === "no linked github" ? (
                                    <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-white text-center space-y-3">
                                        <p className="text-xs text-zinc-500">Connect GitHub to see your repositories.</p>
                                        <button 
                                            type="button"
                                            onClick={() => signIn.social({ provider: 'github', callbackURL: window.location.href })}
                                            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                                        >
                                            Connect GitHub
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {filteredRepos.map((repo) => (
                                            <button
                                                key={repo.id}
                                                type="button"
                                                onClick={() => setSelectedRepo(selectedRepo === repo.full_name ? null : repo.full_name)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                                                    selectedRepo === repo.full_name
                                                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md scale-[1.01]"
                                                        : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                                                }`}
                                            >
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold truncate">{repo.full_name}</span>
                                                        {repo.private && <Lock size={10} className={selectedRepo === repo.full_name ? "text-zinc-500" : "text-zinc-400"} />}
                                                        {repo.is_deployed && (
                                                            <span className="px-1.5 py-0.5 bg-sky-100 text-sky-700 text-[8px] rounded font-bold uppercase tracking-wider flex items-center gap-0.5 ml-auto">
                                                                <Zap size={8} /> Deployed
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center gap-3 text-[10px] ${selectedRepo === repo.full_name ? "text-zinc-400" : "text-zinc-500"}`}>
                                                        <span className="flex items-center gap-1">
                                                            <Sparkles size={10} /> {repo.commit_count || 0} commits
                                                        </span>
                                                        <span className="flex items-center gap-1 font-mono bg-zinc-100 px-1 rounded text-[8px]">
                                                            {repo.default_branch}
                                                        </span>
                                                        <span>{repo.stargazers_count} stars</span>
                                                        <span>Updated {new Date(repo.pushed_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                {selectedRepo === repo.full_name && <Check size={12} />}
                                            </button>
                                        ))}
                                        {!showAllRepos && allFilteredRepos.length > 5 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAllRepos(true)}
                                                className="w-full py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-colors border border-dashed border-zinc-200 rounded-xl hover:bg-zinc-50"
                                            >
                                                See All ({allFilteredRepos.length})
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Coming Soon</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { type: "INSTAGRAM", label: "Instagram", icon: <Instagram size={18} /> },
                                { type: "LINKEDIN", label: "LinkedIn", icon: <Linkedin size={18} /> },
                                { type: "TWITTER", label: "Twitter/X", icon: <Twitter size={18} /> },
                                { type: "YOUTUBE", label: "YouTube", icon: <Youtube size={18} /> },
                            ].map((signal) => (
                                <Tooltip
                                    key={signal.type}
                                    content="OAuth integration launching soon"
                                    side="top"
                                >
                                    <div className="relative group">
                                        <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-200 bg-white opacity-40 cursor-not-allowed transition-all grayscale">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center mb-2 text-zinc-400">
                                                {signal.icon}
                                            </div>
                                            <p className="text-[10px] font-bold text-zinc-500">{signal.label}</p>
                                            <div className="absolute top-2 right-2">
                                                <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] rounded font-bold uppercase tracking-tighter">
                                                    Soon
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
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
);
};

export default NewProjectForm;
