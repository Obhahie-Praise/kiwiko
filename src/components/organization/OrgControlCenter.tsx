"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Upload,
  Link as LinkIcon,
  Check,
  Users,
  UserPlus,
  Tag,
  Briefcase,
  AlertTriangle,
  Mail,
  MoreVertical,
  Trash2,
  ShieldCheck,
  Zap,
  Trash,
} from "lucide-react";
import Link from "next/link";
import UploadDropzone from "../ui/upload/UploadDropZone";
import { updateOrganizationSettingsAction, deleteOrganizationAction } from "@/actions/email.actions";
//import { toast } from "sonner"; // Assuming sonner is used, if not I'll check
import { useRouter } from "next/navigation";

interface Member {
  id: string;
  email: string;
  role: string;
  status: "active" | "invited";
}

interface OrgControlCenterProps {
  orgId: string;
  initialData: {
    name: string;
    slug: string;
    niche: string;
    description: string;
    logoUrl: string;
    bannerUrl?: string; // Added
    members: Member[];
  };
}

const OrgControlCenter = ({ orgId, initialData }: OrgControlCenterProps) => {
  const router = useRouter();
  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug);
  const [niche, setNiche] = useState(initialData.niche);
  const [description, setDescription] = useState(initialData.description);
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl);
  const [bannerUrl, setBannerUrl] = useState(initialData.bannerUrl || "");
  const [members, setMembers] = useState<Member[]>(initialData.members);
  
  const [invites, setInvites] = useState([{ email: "", role: "Developer" }]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [deleteError, setDeleteError] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setHasChanges(true);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setHasChanges(true);
  };

  const handleInviteChange = (
    index: number,
    field: "email" | "role",
    value: string,
  ) => {
    const newInvites = [...invites];
    // @ts-ignore
    newInvites[index][field] = value;

    if (
      field === "email" &&
      index === invites.length - 1 &&
      value.trim() !== ""
    ) {
      newInvites.push({ email: "", role: "Developer" });
    }

    setInvites(newInvites);
  };

  const handleInvite = async () => {
      setIsInviting(true);
      setInviteError("");
      
      const validInvites = invites.filter(i => i.email.trim() !== "");
      if (validInvites.length === 0) {
          setIsInviting(false);
          return;
      }

      try {
          // Dynamic import to avoid circular dependency if any, though likely fine to import top level
          const { inviteTeamMembersAction } = await import("@/actions/email.actions");
          const result = await inviteTeamMembersAction(orgId, validInvites);
          
          if (result.success) {
              setInvites([{ email: "", role: "Developer" }]);
              // Ideally refresh data or show success message. 
              // Since we don't have a full refresh mechanism here without router.refresh(), 
              // we can rely on optimist update or just wait for revalidatePath from action to kick in on next nav.
              router.refresh(); 
          } else {
              setInviteError(result.error);
          }
      } catch (e) {
          console.error(e);
          setInviteError("Failed to send invites.");
      } finally {
          setIsInviting(false);
      }
  };


  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("niche", niche);
    formData.append("logoUrl", logoUrl);
    formData.append("bannerUrl", bannerUrl);

    try {
      const result = await updateOrganizationSettingsAction(orgId, formData);
      if (result.success) {
        setHasChanges(false);
        // toast.success("Organization updated successfully");
      } else {
        setSaveError(result.error);
      }
    } catch (error) {
       console.error(error);
       setSaveError("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      const result = await deleteOrganizationAction(orgId);
      if (!result.success) {
        setDeleteError(result.error);
      }
    } catch (error) {
      console.error(error);
      setDeleteError("An unexpected error occurred during deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link
            href={`/${initialData.slug}/projects`}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center p-3 justify-center  shadow-xl shadow-zinc-200">
               {logoUrl ? (
                 <img src={logoUrl} alt="logo" className="w-full h-full rounded-2xl object-contain" />
               ) : (
                 <Building2 className="text-white w-full h-full" />
               )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 italic uppercase tracking-tighter">
                Control Center
              </h1>
              <p className="text-zinc-500 font-medium">
                Manage {initialData.name}'s identity, team, and infrastructure.
              </p>
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-4">
             {saveError && (
                 <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md mb-1">{saveError}</span>
             )}
            <div className="flex items-center gap-3">
                <button 
                onClick={() => {
                    setName(initialData.name);
                    setSlug(initialData.slug);
                    setNiche(initialData.niche);
                    setDescription(initialData.description);
                    setHasChanges(false);
                    setSaveError("");
                }}
                className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                Discard Changes
                </button>
                <button 
                disabled={isSaving}
                onClick={handleSave}
                className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                <Zap size={14} className="fill-white" />
                {isSaving ? "Saving..." : "Save Modifications"}
                </button>
            </div>
          </div>
        )}
      </div>

      {/* Header / Banner and Logo Area */}
      <div className="relative mb-24 md:mb-20 rounded-[2.5rem] overflow-visible">
          {/* Banner Dropzone - Full Width */}
          <div className="w-full h-64 md:h-80 relative rounded-[2.5rem] overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm hover:shadow-md transition-all group/banner">
             <UploadDropzone
                endpoint="orgBannerUploader" 
                label="Add Cover Image"
                initialImage={bannerUrl}
                onUploadSuccess={(url) => {
                    setBannerUrl(url);
                    setHasChanges(true);
                }}
                className="w-full h-full border-none rounded-none min-h-0 p-0! bg-transparent"
                containerClassName="h-full"
                showPreview={false}
             />
          </div>

          {/* Logo Dropzone - Overlapping */}
          <div className="absolute -bottom-1/2 -translate-y-1/2 left-8 md:left-12 z-20">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-zinc-300 shadow-2xl shadow-zinc-200/50 relative group/logo hover:shadow-3xl transition-all">
                 <UploadDropzone 
                    endpoint="orgLogoUploader"
                    label="Logo"
                    initialImage={logoUrl}
                    onUploadSuccess={(url) => {
                        setLogoUrl(url);
                        setHasChanges(true);
                    }}
                    className="w-39 h-39 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-zinc-100 rounded-full min-h-0 p-0 bg-zinc-50"
                    icon={Building2}
                 />
                 {/* Decorative */}
                 {!logoUrl && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <Building2 className="text-zinc-300 w-12 h-12" />
                     </div>
                 )}
             </div>
          </div>
          
          {/* Title and Info next to Logo (only visible if scrolled? No, always visible but pushed right) */}
          <div className="absolute -bottom-20 left-44 md:left-56 right-8 hidden md:block">
              <h1 className="text-4xl font-black text-zinc-900 italic uppercase tracking-tighter mb-1 truncate">{name}</h1>
              <p className="text-zinc-500 font-bold text-sm tracking-wide truncate max-w-xl">{niche} &bull; {members.length} Members</p>
          </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* Left Column: Essential Config - Spans full width now? Or 2/3? 
            User removed "Visual Identity" and "Audit Status". 
            So we have "Identity Form", "Members", "Danger Zone".
            Maybe make it 2 columns or 1 column centered?
            Let's keep 2/3 + 1/3 if we have something for right column?
            Wait, user said "no need for audit status or visual identity".
            So the right column is GONE.
            Let's make it a single column layout or main content + sidebar for "Danger Zone"?
            Or putting "Danger Zone" at bottom full width is fine.
            I'll use a max-w-4xl centred layout for the form.
        */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Briefcase size={14} />
                Organization Identity
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                <AlertTriangle size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  2 Changes Remaining in 14 days
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                    URL Slug
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-zinc-400 text-sm font-medium">kiwiko.io/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={handleSlugChange}
                      className="w-full pl-20 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                  Core Mission / Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setHasChanges(true); }}
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none resize-none"
                  placeholder="The definitive mission of this infrastructure..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-widest pl-1">
                  Primary Niche
                </label>
                <div className="flex flex-wrap gap-2">
                  {["SaaS", "FinTech", "HealthTech", "AI/ML", "E-commerce", "CleanTech"].map((n) => (
                    <button
                      key={n}
                      onClick={() => { setNiche(n); setHasChanges(true); }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        niche === n
                          ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                          : "bg-zinc-50 text-zinc-400 hover:bg-zinc-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Member Management */}
          <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden p-8 space-y-8">
            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users size={14} />
              Personnel & Permissions
            </h2>

            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group transition-all hover:bg-white hover:shadow-lg hover:shadow-zinc-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-500">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-zinc-900 leading-tight">{member.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          member.status === 'invited' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {member.status === 'invited' ? 'pending' : 'active'}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{member.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
            // For existing members, we might want to allow role updates if we implement it.
            // But prompt focused on invites matching new org page.
                      value={member.role}
                      onChange={(e) => {
                         // Implement role update logic if needed
                      }}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer hover:text-zinc-900 transition-colors"
                    >
                      <option value="OWNER">Owner</option>
                      <option value="ADMIN">Admin</option>
                      <option value="ADVISOR">Advisor</option>
                      <option value="CO_FOUNDER">Co-founder</option>
                      <option value="CONSULTANT">Consultant</option>
                      <option value="DESIGNER">Designer</option>
                      <option value="DEVELOPER">Developer</option>
                      <option value="FOUNDER">Founder</option>
                      <option value="HR">HR</option>
                      <option value="MARKETER">Marketer</option>
                      <option value="SPECTATOR">Spectator</option>
                    </select>
                    <button 
                      onClick={() => removeMember(member.id)}
                      className="p-2 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-dotted border-zinc-200 space-y-3">
               {invites.map((invite, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                            <input
                            type="email"
                            placeholder="Enter personnel email..."
                            value={invite.email}
                            onChange={(e) => handleInviteChange(index, "email", e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                            value={invite.role}
                            onChange={(e) => handleInviteChange(index, "role", e.target.value)}
                            className="w-full h-full px-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer"
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
                        </div>
                    </div>
               ))}
               
               <div className="flex items-center justify-between pt-2">
                    {inviteError && (
                        <p className="text-xs font-bold text-red-500">{inviteError}</p>
                    )}
                    <div className="flex-1"></div>
                    <button 
                        onClick={handleInvite}
                        disabled={isInviting || invites.filter(i => i.email).length === 0}
                        className="px-6 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <UserPlus size={16} />
                        <span>{isInviting ? "Sending..." : "Send Invites"}</span>
                    </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-[2rem] border border-red-100 p-8 space-y-6">
        <div className="flex items-center gap-3 text-red-900 mb-2">
          <AlertTriangle size={20} className="text-red-600" />
          <h2 className="text-lg font-black uppercase tracking-tight italic">Danger Zone</h2>
        </div>
        <p className="text-sm font-bold text-red-700/70 max-w-2xl">
          Deleting this organization is a permanent action. All associated projects, memberships, 
          and data will be purged from the Kiwiko Engine immediately.
        </p>
        {!showDeleteConfirm ? (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="px-8 py-3 bg-red-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <Trash2 size={16} />
            Erase Organization
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in zoom-in-95 duration-200">
             <div className="flex-1">
               <p className="text-xs font-black text-red-900 uppercase tracking-widest mb-1">Are you absolutely certain?</p>
               <p className="text-[10px] font-medium text-red-600 uppercase tracking-tight">This action cannot be undone.</p>
             </div>
             <div className="flex gap-2 w-full sm:w-auto">
               <button 
                 onClick={() => setShowDeleteConfirm(false)}
                 className="flex-1 sm:flex-none px-6 py-3 bg-white border border-red-200 text-red-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
               >
                 Cancel
               </button>
               <button 
                 disabled={isDeleting}
                 onClick={handleDelete}
                 className="flex-1 sm:flex-none px-8 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                 {isDeleting ? "Processing..." : "Confirm Delete"}
               </button>
             </div>
          </div>
        )}

        {isDeleting && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-[2rem] flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                    <Trash2 className="animate-bounce text-red-500" size={24} />
                    <p className="text-xs font-black text-red-900 uppercase tracking-widest">Purging...</p>
                </div>
            </div>
        )}
        {deleteError && (
             <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={16} className="text-red-600 shrink-0" />
                <p className="text-xs font-bold text-red-800">{deleteError}</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default OrgControlCenter;
