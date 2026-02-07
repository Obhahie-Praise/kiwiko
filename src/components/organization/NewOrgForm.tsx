"use client";

import React, { useState } from "react";
import { ArrowLeft, Building2, Upload, Link as LinkIcon, Check, Users, UserPlus, Tag, Briefcase } from "lucide-react";
import Link from "next/link";

const NewOrgForm = () => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [type, setType] = useState("Startup");
    const [niche, setNiche] = useState("");

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, "-"));
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            <div className="mb-8">
                <Link 
                    href="/projects" 
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-semibold text-zinc-900">Create New Organization</h1>
                <p className="text-zinc-500 mt-1">Establish the parent company and define its core industry focus.</p>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                {/* Section: Basic Identity */}
                <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Briefcase size={16} className="text-zinc-400" />
                        Company Identity
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-zinc-50 border border-dashed border-zinc-300 flex items-center justify-center text-zinc-400">
                                {name ? (
                                    <span className="text-2xl font-bold text-zinc-300">{name.charAt(0).toUpperCase()}</span>
                                ) : (
                                    <Building2 size={24} />
                                )}
                            </div>
                            <div>
                                <button className="text-xs font-medium text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-white px-3 py-1.5 rounded-md hover:bg-zinc-50 transition-colors mb-1 shadow-sm">
                                    Upload Brand Logo
                                </button>
                                <p className="text-[10px] text-zinc-400">SQUARE, PNG or SVG. Max 5MB.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Organization Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Acme Industries"
                                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                />
                            </div>

                            <div className="col-span-2">
                                <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                    Organization URL Slug
                                </label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 text-zinc-400 text-sm flex items-center gap-1">
                                        <LinkIcon size={14} />
                                        <span>kiwiko.io/</span>
                                    </div>
                                    <input
                                        type="text"
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                        className="w-full pl-24 pr-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 focus:border-zinc-400 transition-all placeholder:text-zinc-400"
                                    />
                                    {slug && (
                                        <div className="absolute right-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-medium flex items-center gap-1 uppercase tracking-tight">
                                            <Check size={10} /> Available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Industry & Focus */}
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/30">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Tag size={16} className="text-zinc-400" />
                        Industry & Focus
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="niche" className="block text-sm font-medium text-zinc-700 mb-1.5">
                                General Niche / Industry <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="niche"
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                placeholder="e.g. Enterprise Software, DeepTech, ClimateTech"
                                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-3">
                                Organization Type
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {['Startup', 'Enterprise', 'Personal'].map((t) => (
                                    <div 
                                        key={t}
                                        onClick={() => setType(t)}
                                        className={`cursor-pointer rounded-lg border p-3 flex flex-col gap-1 transition-all ${
                                            type === t 
                                            ? 'bg-zinc-900 border-zinc-900 shadow-md' 
                                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs font-semibold uppercase tracking-wider ${type === t ? 'text-white' : 'text-zinc-400'}`}>{t}</span>
                                            {type === t && <Check size={14} className="text-white" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Core Team */}
                <div className="p-6">
                    <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Users size={16} className="text-zinc-400" />
                        Founding Team / Members
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="founder@example.com"
                                className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                            />
                            <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
                                <UserPlus size={16} />
                                Invite Member
                            </button>
                        </div>
                        
                        <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Users size={14} className="text-zinc-400" />
                                <p className="text-xs font-medium text-zinc-500">Member Import</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button className="text-[11px] px-2 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 transition-colors shadow-sm">
                                    Import from LinkedIn
                                </button>
                                <button className="text-[11px] px-2 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 transition-colors shadow-sm">
                                    Import from CSV
                                </button>
                                <button className="text-[11px] px-2 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-50 text-zinc-600 transition-colors shadow-sm">
                                    Sync from Slack
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-zinc-200">
                    <Link
                        href="/projects"
                        className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-lg transition-colors shadow-sm"
                    >
                        Cancel
                    </Link>
                    <button className="px-6 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors shadow-sm flex items-center gap-2">
                        Create Organization
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewOrgForm;
