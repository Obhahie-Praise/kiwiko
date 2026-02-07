"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Globe, Wallet, ChevronDown, Check, UserPlus, FileText, Target, Tag, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const NewProjectForm = () => {
    const params = useParams();
    const orgSlug = params?.orgSlug as string;
    
    const [name, setName] = useState("");
    const [tagline, setTagline] = useState("");
    const [domain, setDomain] = useState("");
    const [stage, setStage] = useState("Discovery");
    const [niche, setNiche] = useState("");
    
    // Auto-generate domain preview
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        setDomain(val.toLowerCase().replace(/[^a-z0-9]/g, "") + ".kiwiko.io");
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
                {/* Section: Basic Info */}
                <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <FileText size={16} className="text-zinc-400" />
                        Basic Information
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-zinc-50 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400">
                                {name ? (
                                    <span className="text-2xl font-bold text-zinc-300">{name.charAt(0).toUpperCase()}</span>
                                ) : (
                                    <Upload size={20} />
                                )}
                            </div>
                            <div>
                                <button className="text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-white px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors mb-1 shadow-sm">
                                    Upload Logo
                                </button>
                                <p className="text-[10px] text-zinc-400">PNG, JPG or SVG. Max 2MB.</p>
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
                                placeholder="How does your project solve this problem uniquely?"
                                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="col-span-2">
                                <label htmlFor="domain" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Project Internal URL
                                </label>
                                <div className="relative flex items-center">
                                    <Globe size={16} className="absolute left-3 text-zinc-400" />
                                    <input
                                        type="text"
                                        id="domain"
                                        value={domain}
                                        readOnly
                                        className="w-full pl-9 pr-3 py-2 bg-zinc-100 border border-zinc-300 rounded-lg text-sm text-zinc-500 outline-none cursor-not-allowed"
                                    />
                                    {name && (
                                        <div className="absolute right-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-medium flex items-center gap-1 uppercase tracking-tight">
                                            <Check size={10} /> Available
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
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="colleague@example.com"
                                className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                            />
                            <button className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-zinc-200">
                                <UserPlus size={16} />
                                Invite
                            </button>
                        </div>
                        
                        <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50">
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
                    <button className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewProjectForm;
