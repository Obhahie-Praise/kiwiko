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
} from "lucide-react";
import Link from "next/link";
import UploadDropzone from "../ui/upload/UploadDropZone";

interface Member {
  id: string;
  email: string;
  role: string;
  status: "active" | "invited";
}

interface OrgControlCenterProps {
  initialData: {
    name: string;
    slug: string;
    niche: string;
    description: string;
    logoUrl: string;
    members: Member[];
  };
}

const OrgControlCenter = ({ initialData }: OrgControlCenterProps) => {
  const [name, setName] = useState(initialData.name);
  const [slug, setSlug] = useState(initialData.slug);
  const [niche, setNiche] = useState(initialData.niche);
  const [description, setDescription] = useState(initialData.description);
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl);
  const [members, setMembers] = useState<Member[]>(initialData.members);
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");

  const [hasChanges, setHasChanges] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setHasChanges(true);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
    setHasChanges(true);
  };

  const addMember = () => {
    if (!inviteEmail) return;
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
    };
    setMembers([...members, newMember]);
    setInviteEmail("");
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMemberRole = (id: string, role: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center p-3 shadow-xl shadow-zinc-200">
               {logoUrl ? (
                 <img src={logoUrl} alt="logo" className="w-full h-full object-contain" />
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
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <button 
              onClick={() => {
                setName(initialData.name);
                setSlug(initialData.slug);
                setNiche(initialData.niche);
                setDescription(initialData.description);
                setHasChanges(false);
              }}
              className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Discard Changes
            </button>
            <button className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2">
              <Zap size={14} className="fill-white" />
              Save Modifications
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Essential Config */}
        <div className="lg:col-span-2 space-y-8">
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
                          {member.status}
                        </span>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{member.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.id, e.target.value)}
                      className="bg-transparent text-[10px] font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer hover:text-zinc-900 transition-colors"
                    >
                      <option value="OWNER">Owner</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
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

            <div className="pt-6 border-t border-dotted border-zinc-200">
               <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      placeholder="Enter personnel email..."
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                    />
                  </div>
                  <div className="sm:w-32">
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full h-full px-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                  </div>
                  <button 
                    onClick={addMember}
                    className="px-6 py-3 bg-zinc-900 text-white rounded-2xl text-sm font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} />
                    <span>Invite</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Side */}
        <div className="space-y-8">
           <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <ShieldCheck className="absolute -top-10 -right-10 w-48 h-48 opacity-5 text-white group-hover:rotate-12 transition-transform duration-1000" />
              <h3 className="text-xl font-black mb-6 uppercase italic tracking-tighter">Visual Identity</h3>
              <p className="text-zinc-500 font-bold mb-8 text-xs uppercase tracking-widest leading-relaxed">
                Your logo is the first thing investors and talent see. Authenticity is paramount.
              </p>
              
              <UploadDropzone
                endpoint="orgLogoUploader"
                onUploadSuccess={(url) => {
                  setLogoUrl(url);
                  setHasChanges(true);
                }}
                className="bg-white/5 border-white/10 hover:border-white/20 transition-all rounded-3xl"
                label="Modify Logo"
              />
           </div>

           <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
              <h3 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck size={16} />
                Audit Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-200/50 pb-3">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Data Integrity</span>
                  <span className="text-xs font-black text-emerald-900 italic">VERIFIED</span>
                </div>
                <div className="flex items-center justify-between border-b border-emerald-200/50 pb-3">
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Last Sync</span>
                  <span className="text-xs font-black text-emerald-900 italic">JUST NOW</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrgControlCenter;
