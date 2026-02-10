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
} from "lucide-react";
import Link from "next/link";
import UploadDropzone from "../ui/upload/UploadDropZone";

const NewOrgForm = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [niche, setNiche] = useState("SaaS");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [members, setMembers] = useState([{ email: "", role: "Admin" }]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleMemberChange = (
    index: number,
    field: "email" | "role",
    value: string,
  ) => {
    const newMembers = [...members];
    // @ts-ignore - typing helper
    newMembers[index][field] = value;

    // If typing in the last email input, add a new empty row
    if (
      field === "email" &&
      index === members.length - 1 &&
      value.trim() !== ""
    ) {
      newMembers.push({ email: "", role: "Member" });
    }

    setMembers(newMembers);
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
        <h1 className="text-2xl font-semibold text-zinc-900">
          Create New Organization
        </h1>
        <p className="text-zinc-500 mt-1">
          Establish the parent company and define its core industry focus.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Brand Banner Upload */}
        <div className="relative h-48 bg-zinc-50 border-b border-zinc-100">
          <UploadDropzone
            endpoint="brandBannerUploader"
            label="Upload Organization Banner"
            onUploadSuccess={(url) => {
              console.log("Banner Uploaded:", url);
              setBannerUrl(url);
            }}
            className="h-full border-none rounded-none"
            showPreview={true}
          />
          <div className="absolute top-4 right-4 z-20">
            <span className="px-2 py-1 bg-black/50 backdrop-blur-md text-[10px] text-white rounded-md font-bold uppercase tracking-widest">
              Brand Banner
            </span>
          </div>
        </div>

        {/* Section: Basic Identity */}
        <div className="p-6 border-b border-zinc-100">
          <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Briefcase size={16} className="text-zinc-400" />
            Company Identity
          </h2>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div>
                <UploadDropzone
                  endpoint="orgLogoUploader"
                  label="Organization Logo"
                  onUploadSuccess={(url) => {
                    console.log("Logo Uploaded:", url);
                    setLogoUrl(url);
                  }}
                  className="max-w-[280px]"
                />
                <p className="text-[10px] text-zinc-400 mt-2">
                  SQUARE, PNG or SVG. Max 5MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 mb-1.5"
                >
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
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-zinc-700 mb-1.5"
                >
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
                    onChange={(e) =>
                      setSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      )
                    }
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
              <label
                htmlFor="description"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Organization Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your organization's mission and goals..."
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400 min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-3">
                Organization Niche / Industry
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["SaaS", "FinTech", "HealthTech", "AI/ML", "E-commerce", "CleanTech"].map((n) => (
                  <div
                    key={n}
                    onClick={() => setNiche(n)}
                    className={`cursor-pointer rounded-lg border p-3 flex flex-col gap-1 transition-all ${
                      niche === n
                        ? "bg-zinc-900 border-zinc-900 shadow-md"
                        : "bg-white border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${niche === n ? "text-white" : "text-zinc-400"}`}
                      >
                        {n}
                      </span>
                      {niche === n && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="niche"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Custom Niche (if not above)
              </label>
              <input
                type="text"
                id="niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g. DeepTech, BioTech, etc."
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
              />
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
            {members.map((member, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      handleMemberChange(index, "email", e.target.value)
                    }
                    placeholder="teammate@example.com"
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 transition-all placeholder:text-zinc-400"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleMemberChange(index, "role", e.target.value)
                    }
                    className="w-full h-10 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-zinc-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[24px_24px] bg-no-repeat bg-position-[right_8px_center]"
                  >
                    <option value="Admin">Admin / Founder</option>
                    <option value="Co-founder">Co-founder</option>
                    <option value="Member">General Member</option>
                    <option value="Investor">Investor / Advisor</option>
                    <option value="Viewer">Viewer Only</option>
                  </select>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-zinc-400" />
                <p className="text-xs font-medium text-zinc-500">Member Ops</p>
              </div>
              <div className="flex flex-wrap gap-2">
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
