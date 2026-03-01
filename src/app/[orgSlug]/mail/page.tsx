"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProjectSlugs } from "@/hooks/useProjectSlugs";
import { getPublicProjectAction } from "@/actions/project.actions";
import { 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  Lock, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  Loader2,
  Paperclip,
  ChevronDown,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  X
} from "lucide-react";
import { useUploadThing } from "@/utils/uploadthing";
import { sendProjectEmailAction } from "@/actions/mail.actions";
import Link from "next/link";

const ProjectMailPage = () => {
  const { orgSlug } = useProjectSlugs();
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [attachments, setAttachments] = useState<{ name: string; url: string; size?: number; type?: string }[]>([]);
  const [uploadType, setUploadType] = useState<"image" | "pdf" | "blob">("blob");

  const { startUpload, isUploading } = useUploadThing("publicMailAttachmentUploader", {
    onClientUploadComplete: (res) => {
      const newAttachments = res.map(file => ({
        name: file.name,
        url: file.url,
        size: file.size,
        type: file.type
      }));
      setAttachments(prev => [...prev, ...newAttachments]);
      setIsSubmitting(false);
      setError(null);
    },
    onUploadError: (error) => {
      setError(`Upload failed: ${error.message}`);
      setIsSubmitting(false);
    }
  });

  const isFormValid = formData.name && formData.email && formData.subject && formData.message;

  useEffect(() => {
    const fetchProject = async () => {
      if (!orgSlug) return;
      const res = await getPublicProjectAction(orgSlug);
      if (res.success) {
        setProject(res.data);
      }
      setLoading(false);
    };
    fetchProject();
  }, [orgSlug]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAttachments(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError(null);
    setIsSubmitting(true);
    await startUpload(files);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting || isUploading) return;

    setError(null);
    setIsSubmitting(true);
    try {
      const res = await sendProjectEmailAction(
        project.id,
        formData.name,
        formData.email,
        formData.subject,
        formData.message,
        attachments.map(a => ({ name: a.name, url: a.url }))
      );

      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-200" />
      </div>
    );
  }

  if (!project) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="text-center">
            <h1 className="text-4xl font-black text-zinc-900 mb-4 uppercase italic tracking-tighter">404</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Venture not found</p>
            <Link
              href="/"
              className="mt-8 inline-block text-[10px] font-black text-zinc-900 border-b-2 border-zinc-900 pb-1 uppercase tracking-widest hover:text-zinc-500 hover:border-zinc-500 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col items-center selection:bg-zinc-900 selection:text-white pt-20 pb-20">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileSelect}
        accept={uploadType === 'pdf' ? '.pdf' : uploadType === 'image' ? 'image/*' : '*'}
        multiple
      />

      {/* Back Button */}
      <Link 
        href={`/${orgSlug}`}
        className="fixed top-8 left-8 flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors group z-50 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-zinc-100 shadow-sm"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Profile
      </Link>

      <div className="max-w-3xl w-full px-6">
        {!submitted ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Professional Header */}
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-200/60">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
                        {project.logoUrl && project.logoUrl.startsWith('http') ? (
                            <img src={project.logoUrl} alt={project.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white font-bold text-2xl">
                              {project.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Reach out to {project.name}</h1>
                        <p className="text-xs font-medium text-zinc-500 tracking-widest">Official Venture Outreach</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span className="text-xs font-medium text-zinc-500">Encrypted</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Inputs */}
              <div className="bg-white p-8 rounded-2xl border border-zinc-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-medium tracking-widest text-zinc-600 ml-1">Your Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-100 py-2 text-sm font-medium focus:border-zinc-900 transition-all outline-none placeholder:text-zinc-300 placeholder:font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium tracking-widest text-zinc-600 ml-1">Email</label>
                        <input 
                            required
                            type="email" 
                            placeholder="Work Email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full bg-transparent border-b border-zinc-100 py-2 text-sm font-medium focus:border-zinc-900 transition-all outline-none placeholder:text-zinc-300 placeholder:font-medium"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-medium tracking-widest text-zinc-600 ml-1">Subject</label>
                    <input 
                        required
                        type="text" 
                        placeholder="Subject of inquiry"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-100 py-2 text-sm font-medium focus:border-zinc-900 transition-all outline-none placeholder:text-zinc-300 placeholder:font-medium"
                    />
                </div>
              </div>

              {/* Message Container */}
              <div className="group/container">
                <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-zinc-900/5 transition-all flex flex-col min-h-[400px]">
                    <textarea 
                        required
                        placeholder="Compose your message here..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="w-full bg-transparent p-10 text-sm font-medium leading-relaxed outline-none resize-none placeholder:text-zinc-300 flex-1"
                    />
                    
                    {/* Attachment Previews */}
                    {attachments.length > 0 && (
                        <div className="px-8 pb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Paperclip size={14} className="text-zinc-400" />
                                <span className="text-xs font-semibold text-zinc-500">{attachments.length} {attachments.length === 1 ? 'Attachment' : 'Attachments'}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {attachments.map((file, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-xl shadow-sm group/att min-w-[200px] hover:border-zinc-300 transition-all">
                                        <div className="w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center">
                                            {file.name.toLowerCase().endsWith('.pdf') ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText size={18} className="text-red-500" />
                                                    <span className="text-[6px] font-bold text-red-500 mt-0.5">PDF</span>
                                                </div>
                                            ) : file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name) ? (
                                                <ImageIcon size={18} className="text-blue-500" />
                                            ) : (
                                                <FileIcon size={18} className="text-zinc-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-bold text-zinc-900 truncate">{file.name}</p>
                                            <p className="text-[10px] text-zinc-400 font-medium">
                                                {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Media'} • <button type="button" onClick={() => removeAttachment(i)} className="text-red-400 hover:text-red-600 transition-colors">Remove</button>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Error Message UI */}
                    {error && (
                        <div className="px-10 py-4 bg-red-50/50 border-t border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
                            <p className="text-xs font-bold text-red-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                {error}
                            </p>
                        </div>
                    )}
                    
                    {/* Attachment Section */}
                    <div className="px-8 pb-6 flex justify-end items-center gap-3" ref={dropdownRef}>
                        <button 
                            type="button"
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-400 cursor-not-allowed opacity-60"
                        >
                            <Sparkles size={14} />
                            <span>AI Review</span>
                        </button>

                        <div className="relative">
                            <button 
                                type="button"
                                disabled={isUploading || attachments.length >= 5}
                                onClick={() => setShowAttachments(!showAttachments)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <Loader2 size={14} className="animate-spin text-zinc-400" />
                                ) : (
                                    <Paperclip size={14} className="text-zinc-500 group-hover:text-zinc-900 transition-colors" />
                                )}
                                <span>{isUploading ? 'Uploading...' : 'Attach'}</span>
                                <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${showAttachments ? "rotate-180" : ""}`} />
                            </button>

                            {/* Attachment Dropdown */}
                            {showAttachments && (
                                <div className="absolute bottom-full right-0 mb-3 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl p-2 animate-in slide-in-from-bottom-2 duration-200 z-10">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setUploadType('pdf');
                                            setShowAttachments(false);
                                            setTimeout(() => fileInputRef.current?.click(), 100);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl text-xs font-medium text-zinc-600 tracking-widest transition-colors"
                                    >
                                        <FileText size={14} className="text-zinc-400" /> PDF Document
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setUploadType('image');
                                            setShowAttachments(false);
                                            setTimeout(() => fileInputRef.current?.click(), 100);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl text-xs font-medium text-zinc-600 tracking-widest transition-colors"
                                    >
                                        <ImageIcon size={14} className="text-zinc-400" /> Image
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setUploadType('blob');
                                            setShowAttachments(false);
                                            setTimeout(() => fileInputRef.current?.click(), 100);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-50 rounded-xl text-xs font-medium text-zinc-600 tracking-widest transition-colors"
                                    >
                                        <FileIcon size={14} className="text-zinc-400" /> Other Formats
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              </div>

              {/* Submit Area */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-semibold text-zinc-400 tracking-widest mb-1">Status</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-semibold text-zinc-600 tracking-tight">Active Startup</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-zinc-200" />
                    <div className="flex items-center gap-1.5 opacity-40 grayscale">
                        <Sparkles size={12} />
                        <span className="text-xs font-semibold tracking-tight">Priority Check</span>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={!isFormValid || isSubmitting || isUploading}
                    className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                    {isSubmitting ? "Sending..." : "Send"}
                </button>
              </div>
            </form>

            <div className="mt-20 flex items-center justify-center gap-12 text-zinc-400">
                <div className="flex items-center gap-2">
                    <Lock size={16} strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">End-to-End</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">Venture Signal</span>
                </div>
            </div>
          </div>
        ) : (
          <div className="text-center animate-in zoom-in-95 duration-500 py-20">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200">
                <CheckCircle2 size={48} strokeWidth={1} />
            </div>
            <h2 className="text-5xl font-semibold text-zinc-900 tracking-tighter hero-font  leading-[0.9] mb-6">Email <br /><span className="text-zinc-300">Sent</span></h2>
            <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-12">
                Your message has been encrypted and prioritized. Someone from the {project.name} founding team will reach out to you via email.
            </p>
            <button 
              onClick={() => router.push(`/${orgSlug}`)}
              className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-semibold text-xs hover:bg-black transition-all active:scale-95 shadow-2xl shadow-zinc-200"
            >
                Return to Venture Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMailPage;
