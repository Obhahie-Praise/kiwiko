"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Upload, Globe, Wallet, ChevronDown, Check, UserPlus, FileText, Target, Tag, Users, X, Github, Lock, Search, Loader2, Instagram, Linkedin, Twitter, Youtube, Info, Sparkles, Zap, Facebook } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import UploadDropzone from "../../ui/upload/UploadDropZone";
import { createProjectAction, getUserIntegrationsAction } from "@/actions/project.actions";
import { getUserGithubRepos } from "@/actions/github.actions";
import { getLinkIcon } from "@/lib/url-utils";
import { signIn } from "@/lib/auth-client";
import { Tooltip } from "../../lightswind/tooltip";
import { SignalType } from "@/generated/prisma";

interface NewProjectFormProps {
    orgId: string;
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
    
    const [invites, setInvites] = useState<{ email: string; role: string }[]>([{ email: "", role: "Developer" }]);
    const [links, setLinks] = useState<{ url: string }[]>([{ url: "" }]);
    const [pitchDeckUrl, setPitchDeckUrl] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState("");

    // GitHub Integration State
    const [githubRepos, setGithubRepos] = useState<any[]>([]);
    const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
    const [repoSearch, setRepoSearch] = useState("");
    const [isFetchingRepos, setIsFetchingRepos] = useState(false);
    const [repoError, setRepoError] = useState<string | null>(null);
    const [selectedSignals, setSelectedSignals] = useState<SignalType[]>([]);
    const [showAllRepos, setShowAllRepos] = useState(false);
    const [isYoutubeConnected, setIsYoutubeConnected] = useState(false);
    const [youtubeChannel, setYoutubeChannel] = useState<any>(null);
    const [isConnectingYoutube, setIsConnectingYoutube] = useState(false);

    // PERSISTENCE LOGIC
    const PERSISTENCE_KEY = `new-project-form-${orgId}`;

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem(PERSISTENCE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                if (parsed.name) setName(parsed.name);
                if (parsed.tagline) setTagline(parsed.tagline);
                if (parsed.stage) setStage(parsed.stage);
                if (parsed.niche) setNiche(parsed.niche);
                if (parsed.logoUrl) setLogoUrl(parsed.logoUrl);
                if (parsed.bannerUrl) setBannerUrl(parsed.bannerUrl);
                if (parsed.problem) setProblem(parsed.problem);
                if (parsed.solution) setSolution(parsed.solution);
                if (parsed.currentRevenue) setCurrentRevenue(parsed.currentRevenue);
                if (parsed.postMoneyValuation) setPostMoneyValuation(parsed.postMoneyValuation);
                if (parsed.pitchDeckUrl) setPitchDeckUrl(parsed.pitchDeckUrl);
                if (parsed.invites) setInvites(parsed.invites);
                if (parsed.links) setLinks(parsed.links);
                if (parsed.selectedSignals) setSelectedSignals(parsed.selectedSignals);
                if (parsed.selectedRepo) setSelectedRepo(parsed.selectedRepo);
            } catch (e) {
                console.error("Failed to parse saved form state", e);
            }
        }
    }, [PERSISTENCE_KEY]);

    // Save state to localStorage on any change
    useEffect(() => {
        const stateToSave = {
            name, tagline, stage, niche, logoUrl, bannerUrl,
            problem, solution, currentRevenue, postMoneyValuation,
            invites, links, pitchDeckUrl, selectedRepo, selectedSignals
        };
        localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(stateToSave));
    }, [name, tagline, stage, niche, logoUrl, bannerUrl, problem, solution, currentRevenue, postMoneyValuation, invites, links, pitchDeckUrl, selectedRepo, selectedSignals, PERSISTENCE_KEY]);

    const clearFormPersistence = () => {
        localStorage.removeItem(PERSISTENCE_KEY);
    };

    const fetchRepos = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        const fetchIntegrations = async () => {
            const res = await getUserIntegrationsAction();
            if (res.success) {
                const youtube = res.data.find(i => i.provider === "YOUTUBE");
                if (youtube) {
                    setIsYoutubeConnected(true);
                    setYoutubeChannel(youtube.metadata);
                }
            }
        };

        fetchIntegrations();
    }, []);

    const allFilteredRepos = githubRepos.filter(repo => 
        repo.full_name.toLowerCase().includes(repoSearch.toLowerCase())
    );
    const filteredRepos = showAllRepos ? allFilteredRepos : allFilteredRepos.slice(0, 5);

    const handleInviteChange = (index: number, field: "email" | "role", value: string) => {
        const newInvites = [...invites];
        // @ts-ignore
        newInvites[index][field] = value;
        setInvites(newInvites);

        if (field === "email" && index === invites.length - 1 && value.trim() !== "") {
            setInvites([...newInvites, { email: "", role: "Developer" }]);
        }
    };

    const handleRemoveInvite = (index: number) => {
        const newInvites = [...invites];
        newInvites.splice(index, 1);
        setInvites(newInvites.length > 0 ? newInvites : [{ email: "", role: "Developer" }]);
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

        if (selectedSignals.includes("YOUTUBE") && !isYoutubeConnected) {
            setError("Please connect your YouTube account before proceeding.");
            setIsPending(false);
            return;
        }

        if (selectedSignals.includes("GITHUB") && !selectedRepo) {
            setError("Please select a GitHub repository.");
            setIsPending(false);
            return;
        }

        try {
            const slug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            const validInvites = invites.filter(i => i.email.trim() !== "").map(i => ({ email: i.email.trim(), role: i.role }));
            const validLinks = links.map(l => l.url.trim()).filter(link => link !== "");

            const formData = new FormData();
            formData.append("name", name);
            formData.append("slug", slug);
            formData.append("orgId", orgId);
            formData.append("description", tagline);
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
                clearFormPersistence();
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
                        endpoint="projectBannerUploader"
                        label="Upload Project Banner"
                        onUploadSuccess={(url) => setBannerUrl(url)}
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
                                    endpoint="projectLogoUploader"
                                    label="Project Logo"
                                    onUploadSuccess={(url) => setLogoUrl(url)}
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
                                    onChange={(e) => setName(e.target.value)}
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
                                        onUploadSuccess={(url) => setPitchDeckUrl(url)}
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
                <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Users size={16} className="text-zinc-400" />
                        Project Team
                    </h2>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-700">Invite Members</label>
                        {invites.map((invite, index) => (
                             <div key={index} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={invite.email}
                                    onChange={(e) => handleInviteChange(index, "email", e.target.value)}
                                    placeholder="colleague@example.com"
                                    className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                                />
                                <div className="sm:w-48 flex gap-2">
                                    <select
                                        value={invite.role}
                                        onChange={(e) => handleInviteChange(index, "role", e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[24px_24px] bg-no-repeat bg-position-[right_8px_center]"
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Advisor">Advisor</option>
                                        <option value="Co-founder">Co-founder</option>
                                        <option value="Consultant">Consultant</option>
                                        <option value="Designer">Designer</option>
                                        <option value="Developer">Developer</option>
                                        <option value="Founder">Founder</option>
                                        <option value="HR">HR</option>
                                        <option value="Marketer">Marketer</option>
                                        <option value="Spectator">Spectator</option>
                                    </select>
                                    {invites.length > 1 && (
                                        <button 
                                            onClick={() => handleRemoveInvite(index)}
                                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Links */}
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/10">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Globe size={16} className="text-zinc-400" />
                        Relevant Links
                    </h2>
                    
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-zinc-700">URLs (GitHub, Twitter, Website, etc.)</label>
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
                <div className="p-6 bg-zinc-50/10">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Sparkles size={16} className="text-zinc-400" />
                        Connect Signals
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    if (selectedSignals.includes("GITHUB")) {
                                        setSelectedSignals(selectedSignals.filter(s => s !== "GITHUB"));
                                        setSelectedRepo(null);
                                    } else {
                                        setSelectedSignals([...selectedSignals, "GITHUB"]);
                                        fetchRepos();
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

                             <button
                                 type="button"
                                 onClick={() => {
                                     if (selectedSignals.includes("YOUTUBE")) {
                                         setSelectedSignals(selectedSignals.filter(s => s !== "YOUTUBE"));
                                     } else {
                                         setSelectedSignals([...selectedSignals, "YOUTUBE"]);
                                     }
                                 }}
                                 className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                                     selectedSignals.includes("YOUTUBE")
                                         ? "border-zinc-900 bg-zinc-900 text-white shadow-lg"
                                         : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                                 }`}
                             >
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedSignals.includes("YOUTUBE") ? "bg-white/10" : "bg-zinc-50"}`}>
                                         <Youtube size={20} className={selectedSignals.includes("YOUTUBE") ? "text-white" : "text-zinc-400"} />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold">YouTube</p>
                                         <p className={`text-[10px] ${selectedSignals.includes("YOUTUBE") ? "text-zinc-400" : "text-zinc-500"}`}>Sync video updates</p>
                                     </div>
                                 </div>
                                 {selectedSignals.includes("YOUTUBE") && <Check size={16} />}
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

                            {/* Coming Soon Signals */}
                            <Tooltip content="OAuth integration launching soon" side="top">
                                <div className="relative flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white opacity-40 cursor-not-allowed grayscale">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400"><Instagram size={20} /></div>
                                        <div><p className="text-sm font-bold text-zinc-900">Instagram</p><p className="text-[10px] text-zinc-500">Sync social activity</p></div>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] rounded font-bold uppercase tracking-tighter">Soon</span>
                                </div>
                            </Tooltip>
                            <Tooltip content="OAuth integration launching soon" side="top">
                                <div className="relative flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white opacity-40 cursor-not-allowed grayscale">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400"><Linkedin size={20} /></div>
                                        <div><p className="text-sm font-bold text-zinc-900">LinkedIn</p><p className="text-[10px] text-zinc-500">Sync social activity</p></div>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] rounded font-bold uppercase tracking-tighter">Soon</span>
                                </div>
                            </Tooltip>
                            <Tooltip content="OAuth integration launching soon" side="top">
                                <div className="relative flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white opacity-40 cursor-not-allowed grayscale">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400"><Twitter size={20} /></div>
                                        <div><p className="text-sm font-bold text-zinc-900">Twitter/X</p><p className="text-[10px] text-zinc-500">Sync social activity</p></div>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] rounded font-bold uppercase tracking-tighter">Soon</span>
                                </div>
                            </Tooltip>
                            <Tooltip content="OAuth integration launching soon" side="top">
                                <div className="relative flex items-center justify-between p-4 rounded-2xl border border-zinc-200 bg-white opacity-40 cursor-not-allowed grayscale">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400"><Facebook size={20} /></div>
                                        <div><p className="text-sm font-bold text-zinc-900">Facebook</p><p className="text-[10px] text-zinc-500">Sync social activity</p></div>
                                    </div>
                                    <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] rounded font-bold uppercase tracking-tighter">Soon</span>
                                </div>
                            </Tooltip>
                        </div>
                        
                         {/* Call to Actions */}
                         {selectedSignals.includes("YOUTUBE") && !isYoutubeConnected && (
                            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
                                 <div className="flex items-center gap-3">
                                    <Info size={16} className="text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-900">YouTube Not Connected</p>
                                        <p className="text-[10px] text-amber-700">Connect your channel to sync latest uploads.</p>
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => {
                                        setIsConnectingYoutube(true);
                                        router.push("/api/integrations/youtube/connect");
                                    }}
                                    disabled={isConnectingYoutube}
                                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                    {isConnectingYoutube ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <Youtube size={14} />
                                    )}
                                    {isConnectingYoutube ? "Redirecting..." : "Connect YouTube"}
                                 </button>
                            </div>
                         )}

                         {selectedSignals.includes("GITHUB") && repoError === "no linked github" && (
                             <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
                                 <div className="flex items-center gap-3">
                                    <Info size={16} className="text-amber-600" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-900">GitHub Not Connected</p>
                                        <p className="text-[10px] text-amber-700">Connect your account to select a repository.</p>
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => signIn.social({ provider: "github", callbackURL: window.location.href })}
                                    className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
                                 >
                                    Connect GitHub
                                 </button>
                             </div>
                         )}

                        {/* Repo Selection */}
                        {selectedSignals.includes("GITHUB") && repoError !== "no linked github" && (
                            <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                                 <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Repository</p>
                                    {selectedRepo && (
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] rounded-full font-bold uppercase tracking-tight flex items-center gap-1">
                                            <Check size={10} /> {selectedRepo}
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Search repositories..."
                                        value={repoSearch}
                                        onChange={(e) => setRepoSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    {isFetchingRepos ? (
                                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
                                            <Loader2 size={24} className="animate-spin text-zinc-900" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Scanning repositories...</span>
                                        </div>
                                    ) : repoError && repoError !== "no linked github" ? (
                                        <div className="py-8 flex flex-col items-center justify-center gap-4 text-center px-4">
                                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                                                <X size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-zinc-900">Failed to fetch</p>
                                                <p className="text-[10px] text-zinc-500 leading-relaxed">{repoError}</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => fetchRepos()}
                                                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
                                            >
                                                Retry Connection
                                            </button>
                                        </div>
                                    ) : githubRepos.length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center gap-4 text-center px-4">
                                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                                                <Github size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-zinc-900">No repositories found</p>
                                                <p className="text-[10px] text-zinc-500">Your account doesn't seem to have any code.</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => fetchRepos()}
                                                className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 flex items-center gap-1"
                                            >
                                                <Sparkles size={12} /> Refresh
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
                                                    className="w-full py-2.5 bg-zinc-100 rounded-xl text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-zinc-900 transition-all"
                                                >
                                                    See All ({allFilteredRepos.length})
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-zinc-50 px-6 py-4 flex items-center justify-end gap-3 border border-zinc-200 border-t-0 rounded-b-xl">
                <Link
                    href={`/${orgSlug}/projects`}
                    className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-300 rounded-lg shadow-sm"
                >
                    Cancel
                </Link>
                <button 
                     onClick={handleSubmit}
                     disabled={isPending}
                     className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {isPending ? "Creating..." : "Create Project"}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default NewProjectForm;
