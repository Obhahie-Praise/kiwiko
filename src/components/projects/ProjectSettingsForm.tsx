"use client";

import React, { useState } from "react";
import { UploadDropzone } from "@/components/common/UploadDropzone";
import { Loader2, Plus, X, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateProjectSettingsAction, inviteProjectMemberAction } from "@/actions/project.actions"; // Need to create these

interface ProjectSettingsFormProps {
  project: any;
  orgSlug: string;
}

const ProjectSettingsForm = ({ project, orgSlug }: ProjectSettingsFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [problem, setProblem] = useState(project.problem || "");
  const [solution, setSolution] = useState(project.solution || "");
  const [stage, setStage] = useState(project.stage || "Idea");
  const [currentRevenue, setCurrentRevenue] = useState(project.currentRevenue || "");
  const [postMoneyValuation, setPostMoneyValuation] = useState(project.postMoneyValuation || "");
  const [logoUrl, setLogoUrl] = useState(project.logoUrl || "");
  const [links, setLinks] = useState(project.links || []);
  
  // Invite State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("projectId", project.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("problem", problem);
    formData.append("solution", solution);
    formData.append("stage", stage);
    formData.append("currentRevenue", currentRevenue);
    formData.append("postMoneyValuation", postMoneyValuation);
    formData.append("logoUrl", logoUrl);
    formData.append("links", JSON.stringify(links));

    try {
        // We'll implementing this action next
        const result = await updateProjectSettingsAction(formData);
        
        if (result.success) {
            setSuccess("Project settings updated successfully.");
            router.refresh();
        } else {
            setError(result.error);
        }
    } catch (err) {
        setError("An unexpected error occurred.");
    } finally {
        setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    setInviteSuccess(null);
    setError(null);
    
    try {
        const result = await inviteProjectMemberAction(project.id, inviteEmail);
        
        if (result.success && result.data) {
            // Trigger email sending client-side
            await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "project-invite",
                    invites: [{
                        email: result.data.email,
                        token: result.data.token,
                        project: result.data.project
                    }]
                })
            });

            setInviteSuccess(`Invitation sent to ${inviteEmail}`);
            setInviteEmail("");
        } else {
            setError(result.error);
        }
    } catch (err) {
        console.error(err);
        setError("Failed to create invite.");
    } finally {
        setInviteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Project Settings</h1>
        <p className="text-zinc-500">Manage your project details and team configuration.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
            <X size={16} />
            {error}
        </div>
      )}

    {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
            <Save size={16} />
            {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Info */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-zinc-900 border-b pb-2 border-zinc-100">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Project Logo</label>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center overflow-hidden">
                            {logoUrl ? <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <div className="text-zinc-300 text-xs">No Logo</div>}
                        </div>
                        <div className="flex-1">
                             <UploadDropzone
                                endpoint="projectLogoUploader"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]) setLogoUrl(res[0].url);
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                                config={{ mode: "auto" }}

                             />
                        </div>
                    </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Project Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none"
                    />
                </div>

                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Stage</label>
                    <select 
                        value={stage} 
                        onChange={(e) => setStage(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none bg-white"
                    >
                        <option value="Idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="Early Traction">Early Traction</option>
                        <option value="Growth">Growth</option>
                        <option value="Scale">Scale</option>
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none resize-none"
                    />
                </div>
            </div>
        </div>

        {/* Pitch Data */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
             <h2 className="text-lg font-semibold mb-4 text-zinc-900 border-b pb-2 border-zinc-100">Pitch Data</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">The Problem</label>
                    <textarea 
                        value={problem} 
                        onChange={(e) => setProblem(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">The Solution</label>
                    <textarea 
                        value={solution} 
                        onChange={(e) => setSolution(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none resize-none"
                    />
                </div>
                 <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Current Revenue</label>
                    <input 
                        type="text" 
                        value={currentRevenue} 
                        onChange={(e) => setCurrentRevenue(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none"
                        placeholder="e.g. $50k ARR"
                    />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Valuation</label>
                    <input 
                        type="text" 
                        value={postMoneyValuation} 
                        onChange={(e) => setPostMoneyValuation(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none"
                        placeholder="e.g. $5M"
                    />
                </div>
             </div>
        </div>
        
        {/* Links */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
             <h2 className="text-lg font-semibold mb-4 text-zinc-900 border-b pb-2 border-zinc-100">Relevant Links</h2>
             <div className="space-y-4">
                {links.map((link: any, index: number) => (
                    <div key={index} className="flex gap-4 items-center">
                        <input 
                            type="text" 
                            placeholder="Label (e.g. Website)"
                            value={link.label}
                            onChange={(e) => {
                                const newLinks = [...links];
                                newLinks[index].label = e.target.value;
                                setLinks(newLinks);
                            }}
                            className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none"
                        />
                        <input 
                            type="text" 
                            placeholder="URL (https://...)"
                            value={link.url}
                            onChange={(e) => {
                                const newLinks = [...links];
                                newLinks[index].url = e.target.value;
                                setLinks(newLinks);
                            }}
                            className="flex-[2] px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none"
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                const newLinks = links.filter((_: any, i: number) => i !== index);
                                setLinks(newLinks);
                            }}
                            className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
                
                <button 
                    type="button"
                    onClick={() => setLinks([...links, { label: "", url: "" }])}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                    <Plus size={16} />
                    Add Link
                </button>
             </div>
        </div>
        
        {/* Submit Actions */}
        <div className="flex justify-end pt-4">
            <button
                type="submit"
                disabled={loading}
                className="bg-zinc-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
            </button>
        </div>
      </form>

      {/* Team Invites */}
      <div className="mt-12 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 border-b pb-2 border-zinc-100 flex items-center justify-between">
            <span>Team Members</span>
            <span className="text-xs font-normal text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">Unlimited Invites</span>
        </h2>
        
        <div className="flex gap-4 items-end mb-6">
            <div className="flex-1">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Invite by Email</label>
                <input 
                    type="email" 
                    value={inviteEmail} 
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-zinc-900/10 outline-none"
                />
            </div>
            <button 
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail}
                className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors md:mb-[1px] h-[42px] flex items-center gap-2 disabled:opacity-50"
            >
                {inviteLoading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Invite</>}
            </button>
        </div>
        
        {inviteSuccess && (
            <div className="mb-4 text-sm text-emerald-600 font-medium">
                {inviteSuccess}
            </div>
        )}

        <div className="space-y-3">
            {/* List existing members/invites here if updated project data includes them */}
            {/* For now we just allow sending invites */}
             <div className="p-4 bg-zinc-50 rounded-xl text-center text-sm text-zinc-500 italic">
                Existing team members list will appear here.
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettingsForm;
