"use client";

import React, { useState, useEffect } from "react";
import UploadDropzone from "@/components/ui/upload/UploadDropZone";
import { Loader2, Plus, X, Save, Zap, Building2, ArrowLeft, AlertTriangle, Briefcase, Link as LinkIcon, Users, Github, Instagram, Linkedin, Twitter, Youtube, Check, Search, Sparkles, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateProjectSettingsAction, inviteProjectMemberAction } from "@/actions/project.actions";
import { getUserGithubRepos } from "@/actions/github.actions";
import { getLinkIcon } from "@/lib/url-utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip } from "../lightswind/tooltip";
import { SignalType } from "@/generated/prisma";

interface ProjectSettingsFormProps {
  project: any;
  orgSlug: string;
}

const ProjectSettingsForm = ({ project, orgSlug }: ProjectSettingsFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Form State
  const [name, setName] = useState(project.name);
  const [slug, setSlug] = useState(project.slug);
  const [description, setDescription] = useState(project.description || "");
  const [problem, setProblem] = useState(project.problem || "");
  const [solution, setSolution] = useState(project.solution || "");
  const [stage, setStage] = useState(project.stage || "Idea");
  const [currentRevenue, setCurrentRevenue] = useState(project.currentRevenue || "");
  const [postMoneyValuation, setPostMoneyValuation] = useState(project.postMoneyValuation || "");
  const [logoUrl, setLogoUrl] = useState(project.logoUrl || "");
  const [bannerUrl, setBannerUrl] = useState(project.bannerUrl || "");
  const [links, setLinks] = useState<{ url: string }[]>(
    project.links && project.links.length > 0 
      ? project.links.map((l: string) => ({ url: l })) 
      : [{ url: "" }]
  );
  
  // Invite State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const [selectedSignals, setSelectedSignals] = useState<SignalType[]>(
    project.integrations?.map((i: any) => i.type) || []
  );

  // GitHub Integration State
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(project.githubRepoFullName || null);
  const [repoSearch, setRepoSearch] = useState("");
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
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
    if (selectedSignals.includes("GITHUB")) {
        fetchRepos();
    }
  }, [selectedSignals.includes("GITHUB")]);

  const allFilteredRepos = githubRepos.filter(repo => 
    repo.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  );
  const filteredRepos = showAllRepos ? allFilteredRepos : allFilteredRepos.slice(0, 5);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("projectId", project.id);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("problem", problem);
    formData.append("solution", solution);
    formData.append("stage", stage);
    formData.append("currentRevenue", currentRevenue);
    formData.append("postMoneyValuation", postMoneyValuation);
    formData.append("logoUrl", logoUrl);
    formData.append("bannerUrl", bannerUrl);
    
    const validLinks = links
        .map(l => l.url.trim())
        .filter(link => link !== "");

    formData.append("links", JSON.stringify(validLinks));
    formData.append("signals", JSON.stringify(selectedSignals));
    if (selectedRepo) formData.append("githubRepoFullName", selectedRepo);

    try {
        const result = await updateProjectSettingsAction(formData);
        
        if (result.success) {
            setSuccess("Project settings updated successfully.");
            setHasChanges(false);
            
            // Redirect if slug has changed
            if (slug !== project.slug) {
                router.push(`/${orgSlug}/${slug}`);
            } else {
                router.refresh();
            }
        } else {
            setError((result as any).error);
        }
    } catch (err) {
        setError("An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  const handleLinkChange = (index: number, value: string) => {
      const newLinks = [...links];
      newLinks[index].url = value;
      setLinks(newLinks);
      setHasChanges(true);

      if (index === links.length - 1 && value.trim() !== "") {
          setLinks([...newLinks, { url: "" }]);
      }
  };

  const handleRemoveLink = (index: number) => {
      const newLinks = [...links];
      newLinks.splice(index, 1);
      setLinks(newLinks.length > 0 ? newLinks : [{ url: "" }]);
      setHasChanges(true);
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    setInviteSuccess(null);
    setError(null);
    
    try {
        const result = await inviteProjectMemberAction(project.id, inviteEmail);
        
        if (result.success && (result as any).data) {
            setInviteSuccess(`Invitation sent to ${inviteEmail}`);
            setInviteEmail("");
        } else {
            setError((result as any).error);
        }
    } catch (err) {
        console.error(err);
        setError("Failed to create invite.");
    } finally {
        setInviteLoading(false);
    }
  };

  const handleDiscard = () => {
      setName(project.name);
      setSlug(project.slug);
      setDescription(project.description || "");
      setProblem(project.problem || "");
      setSolution(project.solution || "");
      setStage(project.stage || "Idea");
      setCurrentRevenue(project.currentRevenue || "");
      setPostMoneyValuation(project.postMoneyValuation || "");
      setLogoUrl(project.logoUrl || "");
      setBannerUrl(project.bannerUrl || "");
      setLinks(
          project.links && project.links.length > 0 
            ? project.links.map((l: string) => ({ url: l })) 
            : [{ url: "" }]
      );
      setHasChanges(false);
      setError(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link
            href={`/${orgSlug}`}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center p-3 justify-center shadow-xl shadow-zinc-200">
               {logoUrl ? (
                 <img src={logoUrl} alt="logo" className="w-full h-full rounded-xl object-cover" />
               ) : (
                 <Building2 className="text-white w-full h-full" />
               )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 italic uppercase tracking-tighter leading-none">
                Control Center
              </h1>
              <p className="text-zinc-500 font-medium mt-1">
                Refining {project.name}'s architecture and team access.
              </p>
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3">
                <button 
                  onClick={handleDiscard}
                  className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  Discard Changes
                </button>
                <button 
                  disabled={loading}
                  onClick={() => handleSubmit()}
                  className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} className="fill-white text-white" />}
                  {loading ? "Syncing..." : "Save Modifications"}
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Hero: Banner & Logo Editing */}
      <div className="relative mb-24 md:mb-20">
          {/* Banner Dropzone */}
          <div className="w-full h-64 md:h-80 relative rounded-[2.5rem] overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm hover:shadow-md transition-all group/banner">
             <UploadDropzone
                endpoint="projectBannerUploader" 
                label="Add Cover Image"
                initialImage={bannerUrl}
                onUploadSuccess={(url) => {
                    setBannerUrl(url);
                    setHasChanges(true);
                }}
                className="w-full h-full border-none rounded-none min-h-0 !p-0 bg-transparent"
                containerClassName="h-full"
                showPreview={false}
             />
             <div className="absolute inset-0 bg-black/0 group-hover/banner:bg-black/10 transition-colors pointer-events-none" />
          </div>

          {/* Logo Dropzone */}
          <div className="absolute -bottom-1/2 -translate-y-1/2 left-8 md:left-12 z-20">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-300 shadow-2xl shadow-zinc-200/50 relative group/logo hover:shadow-3xl transition-all border-4 border-white overflow-hidden">
                 <UploadDropzone 
                    endpoint="projectLogoUploader"
                    label="Logo"
                    initialImage={logoUrl}
                    onUploadSuccess={(url) => {
                        setLogoUrl(url);
                        setHasChanges(true);
                    }}
                    className="w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-none rounded-full min-h-0 p-0 bg-zinc-50"
                    icon={Building2}
                 />
                 {!logoUrl && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <Building2 className="text-zinc-300 w-12 h-12" />
                     </div>
                 )}
             </div>
          </div>
          
          {/* Dynamic Info next to Logo */}
          <div className="absolute -bottom-20 left-44 md:left-56 right-8 hidden md:block">
              <h1 className="text-4xl font-black text-zinc-900 italic uppercase tracking-tighter mb-1 truncate">
                {name || project.name}
              </h1>
              <p className="text-zinc-500 font-bold text-sm tracking-wide truncate max-w-xl">
                {stage} &bull; {links.filter(l => l.url.trim()).length} Active Links
              </p>
          </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle size={18} />
            <p className="text-sm font-bold uppercase tracking-tight italic">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <Save size={18} />
            <p className="text-sm font-bold uppercase tracking-tight italic">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto"><X size={16} /></button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Briefcase size={14} />
                Project Architecture
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                <AlertTriangle size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  {2 - project.dataChangeCount} Updates Remaining
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">Display Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => { setName(e.target.value); setHasChanges(true); }}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">Stage</label>
                  <select 
                    value={stage} 
                    onChange={(e) => { setStage(e.target.value); setHasChanges(true); }}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[24px_24px] bg-no-repeat bg-position-[right_12px_center]"
                  >
                    <option value="Idea">Idea</option>
                    <option value="MVP">MVP</option>
                    <option value="Early Traction">Early Traction</option>
                    <option value="Growth">Growth</option>
                    <option value="Scale">Scale</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">Project URL (Slug)</label>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-bold text-sm">kiwiko.io/{orgSlug}/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => { setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); setHasChanges(true); }}
                    className="flex-1 px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                    placeholder="project-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">The Mission (Description)</label>
                <textarea 
                  value={description} 
                  onChange={(e) => { setDescription(e.target.value); setHasChanges(true); }}
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none resize-none"
                  placeholder="The definitive mission of this project..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dotted border-zinc-100">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">The Problem</label>
                  <textarea 
                    value={problem} 
                    onChange={(e) => { setProblem(e.target.value); setHasChanges(true); }}
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">The Solution</label>
                  <textarea 
                    value={solution} 
                    onChange={(e) => { setSolution(e.target.value); setHasChanges(true); }}
                    rows={3}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">Current Revenue</label>
                  <input 
                    type="text" 
                    value={currentRevenue} 
                    onChange={(e) => { setCurrentRevenue(e.target.value); setHasChanges(true); }}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                    placeholder="e.g. $50k ARR"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">Post-Money Valuation</label>
                  <input 
                    type="text" 
                    value={postMoneyValuation} 
                    onChange={(e) => { setPostMoneyValuation(e.target.value); setHasChanges(true); }}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                    placeholder="e.g. $5M"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <LinkIcon size={14} />
              Relevant Infrastructure (Links)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link, index) => (
                <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                      {getLinkIcon(link.url)}
                    </div>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkChange(index, e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none placeholder:text-zinc-300"
                    />
                  </div>
                  {links.length > 1 && link.url && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={14} />
              Operational Team
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 items-end bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
              <div className="flex-1 w-full">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1 mb-2 block">Grant Access via Email</label>
                <input 
                  type="email" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="personnel@kiwiko.io"
                  className="w-full px-4 py-3 bg-white border border-zinc-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                />
              </div>
              <button 
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail}
                className="w-full md:w-auto bg-zinc-900 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {inviteLoading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Deploy Invite</>}
              </button>
            </div>
            
            {inviteSuccess && (
              <div className="text-xs font-black uppercase tracking-widest text-emerald-600 animate-in fade-in slide-in-from-left-2">
                {inviteSuccess}
              </div>
            )}

            </div>

          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles size={14} />
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
                                } else {
                                    setSelectedSignals([...selectedSignals, "GITHUB"]);
                                }
                                setHasChanges(true);
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
                                setHasChanges(true);
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
                                        //@ts-ignore - signIn is handled via auth-client but we use standard login flow in settings if needed
                                        onClick={() => window.location.href = '/api/auth/signin'}
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
                                            onClick={() => {
                                                setSelectedRepo(selectedRepo === repo.full_name ? null : repo.full_name);
                                                setHasChanges(true);
                                            }}
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
      </div>
    </div>
  );
};

export default ProjectSettingsForm;

