"use client";

import React, { useState, useMemo } from "react";
import {
  Inbox,
  Send,
  File,
  Trash2,
  Star,
  Info,
  Tag,
  Search,
  RotateCw,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Paperclip,
  Reply,
  ReplyAll,
  Forward,
  Mail,
  PenLine
} from "lucide-react";

// --- Types & Mock Data ---

type Label = "Personal" | "Work" | "Payments" | "Invoices" | "Blank";
type Folder = "Inbox" | "Sent" | "Drafts" | "Trash";
type FilterType = "Starred" | "Important" | null;

interface EmailItem {
  id: string;
  folder: Folder;
  sender: string;
  email: string;
  avatar: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  isStarred: boolean;
  isImportant: boolean;
  label?: Label;
  attachments?: { name: string; type: string; size: string }[];
}

const LABELS: { id: Label; color: string; labelClass: string }[] = [
  { id: "Personal", color: "#22c55e", labelClass: "bg-green-100 text-green-700" }, // Green
  { id: "Work", color: "#ef4444", labelClass: "bg-red-100 text-red-700" }, // Red
  { id: "Payments", color: "#f97316", labelClass: "bg-orange-100 text-orange-700" }, // Orange
  { id: "Invoices", color: "#0ea5e9", labelClass: "bg-sky-100 text-sky-700" }, // Cyan
  { id: "Blank", color: "#3b82f6", labelClass: "bg-blue-100 text-blue-700" }, // Blue
];

const mockEmails: EmailItem[] = [
  // INBOX (10)
  {
    id: "1", folder: "Inbox", sender: "Material UI", email: "hello@mui.com", avatar: "https://images.unsplash.com/photo-1622675363311-3e1904dc1885?q=80&w=100&auto=format&fit=crop",
    subject: "New Components Released", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse...",
    body: "Hello,\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Praesent ut rutrum mi. Aenean ac leo non justo suscipit consectetur.\n\nBest,\nMaterial UI Team.",
    date: "12:16 pm", isStarred: true, isImportant: true, label: "Work"
  },
  {
    id: "2", folder: "Inbox", sender: "Wise", email: "noreply@wise.com", avatar: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100&auto=format&fit=crop",
    subject: "Your transfer is complete", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "Hello Praise,\n\nYour transfer has been successfully processed. Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n\nCheers,\nWise Team",
    date: "12:16 pm", isStarred: true, isImportant: false
  },
  {
    id: "3", folder: "Inbox", sender: "Search Console", email: "sc-noreply@google.com", avatar: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=100&auto=format&fit=crop",
    subject: "Performance report for your site", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi n...",
    body: "Hi there,\n\nHere is your performance report for the last month. Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n\n- Google Search Console",
    date: "Apr, 24", isStarred: true, isImportant: false, label: "Blank"
  },
  {
    id: "4", folder: "Inbox", sender: "Paypal", email: "service@paypal.com", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=100&auto=format&fit=crop",
    subject: "Payment received from John Doe", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "Hello,\n\nYou received a payment. Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n\nThanks,\nPaypal",
    date: "Apr, 30", isStarred: false, isImportant: false, label: "Payments"
  },
  {
    id: "5", folder: "Inbox", sender: "Google Meet", email: "meetings-noreply@google.com", avatar: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=100&auto=format&fit=crop",
    subject: "Invitation: Product Sync", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "You have been invited to a meeting. Lorem ipsum dolor sit amet, consectetur adipisicing elit.\n\nJoin link: https://meet.google.com/xxx-xxxx-xxx",
    date: "Apr, 16", isStarred: false, isImportant: false, label: "Work"
  },
  {
    id: "6", folder: "Inbox", sender: "Contact For Website Design", email: "hello@example.com", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    subject: "Proposal for website redesign", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "Hello Dear Alexander,\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit. Praesent ut rutrum mi. Aenean ac leo non justo suscipit consectetur. Nam vestibulum eleifend magna quis porta. \n\nPraesent ut rutrum mi. Aenean ac leo non justo suscipit consectetur. Nam vestibulum eleifend magna quis porta.\n\nNullam tincidunt sodales diam, quis rhoncus dolor aliquet a. Nulla a rhoncus lectus. In nunc neque, pellentesque non massa ornare, accumsan ornare massa. odales diam, quis rhoncus dolor aliquet a. Nulla a rhoncus lectus. In nunc neque\n\nSuspendisse semper vel turpis vitae aliquam. Aenean semper dui in consequat ullamcorper.",
    date: "Apr, 24", isStarred: false, isImportant: false, label: "Invoices",
    attachments: [
      { name: "Guidelines.pdf", type: "PDF", size: "2.4 MB" },
      { name: "Branding Assets", type: "Media", size: "14 MB" }
    ]
  },
  {
    id: "7", folder: "Inbox", sender: "Airbnb", email: "automated@airbnb.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    subject: "Your upcoming reservation", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "Hi Praise,\n\nYour reservation is confirmed. Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    date: "Mar, 05", isStarred: false, isImportant: false, label: "Personal"
  },
  {
    id: "8", folder: "Inbox", sender: "Facebook", email: "notification@facebook.com", avatar: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100&auto=format&fit=crop",
    subject: "You have new notifications", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "Hello,\n\nYou have 5 new notifications. Lorem ipsum dolor sit amet.",
    date: "Feb, 25", isStarred: false, isImportant: false
  },
  {
    id: "9", folder: "Inbox", sender: "Instagram", email: "no-reply@instagram.com", avatar: "https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=100&auto=format&fit=crop",
    subject: "See what your friends are up to", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse m...",
    body: "Hi there,\n\nCheck out the latest posts from your friends. Lorem ipsum dolor sit amet.",
    date: "Feb, 20", isStarred: false, isImportant: false, label: "Blank"
  },
  {
    id: "10", folder: "Inbox", sender: "Google", email: "alerts@google.com", avatar: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?q=80&w=100&auto=format&fit=crop",
    subject: "Security alert for your account", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse modi nesciunt, no...",
    body: "Hello,\n\nWe noticed a new login from a recognized device. Lorem ipsum dolor sit amet.",
    date: "Feb, 25", isStarred: false, isImportant: false, label: "Personal"
  },
  {
    id: "11", folder: "Inbox", sender: "LinkedIn", email: "updates@linkedin.com", avatar: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100&auto=format&fit=crop",
    subject: "You appeared in 12 searches this week", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse...",
    body: "Hi Praise,\n\nYou appeared in 12 searches this week. Keep up the good work on your profile.",
    date: "Feb, 15", isStarred: false, isImportant: false
  },
  {
    id: "12", folder: "Inbox", sender: "Netflix", email: "info@mailer.netflix.com", avatar: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=100&auto=format&fit=crop",
    subject: "New arrivals tailored for you", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse...",
    body: "Hello,\n\nCheck out the new movies and TV shows arriving this week.",
    date: "Feb, 10", isStarred: false, isImportant: false, label: "Blank"
  },
  {
    id: "13", folder: "Inbox", sender: "Spotify", email: "no-reply@spotify.com", avatar: "https://images.unsplash.com/photo-1614680376573-047b19b7f525?q=80&w=100&auto=format&fit=crop",
    subject: "Your Weekly Discover is ready", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse...",
    body: "Hi,\n\nWe made a playlist just for you containing 30 new tracks.",
    date: "Feb, 08", isStarred: false, isImportant: false
  },
  {
    id: "14", folder: "Inbox", sender: "Amazon", email: "shipment-tracking@amazon.com", avatar: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=100&auto=format&fit=crop",
    subject: "Your package has been delivered", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse...",
    body: "Hello,\n\nYour recent Amazon order has been successfully delivered.",
    date: "Feb, 01", isStarred: false, isImportant: false, label: "Invoices"
  },
  {
    id: "15", folder: "Inbox", sender: "Vercel", email: "support@vercel.com", avatar: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=100&auto=format&fit=crop",
    subject: "Deployment successful for kiwiko-app", preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda dolor dolore esse...",
    body: "Hi Praise,\n\nYour deployment to Production was successful. You can view the build logs online.",
    date: "Jan, 28", isStarred: false, isImportant: false, label: "Work"
  },

  // SENT (5)
  ...Array.from({length: 5}).map((_, i) => ({
    id: `s${i}`, folder: "Sent" as Folder, sender: "You", email: "you@kiwiko.com", avatar: "",
    subject: `Outgoing message ${i+1}`, preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    body: "Message body sent to someone else.", date: "Jan, 15", isStarred: false, isImportant: false
  })),

  // DRAFTS (3)
  ...Array.from({length: 3}).map((_, i) => ({
    id: `d${i}`, folder: "Drafts" as Folder, sender: "Draft", email: "", avatar: "",
    subject: `Untitled Draft ${i+1}`, preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    body: "Draft content.", date: "Jan, 10", isStarred: false, isImportant: false
  })),

  // TRASH (2)
  ...Array.from({length: 2}).map((_, i) => ({
    id: `t${i}`, folder: "Trash" as Folder, sender: "Spammer", email: "spam@spam.com", avatar: "",
    subject: `Spam Subject ${i+1}`, preview: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    body: "Spam content.", date: "Jan, 05", isStarred: false, isImportant: false
  }))
];

export default function InboxLayout() {
  const [emails, setEmails] = useState<EmailItem[]>(mockEmails);
  const [activeFolder, setActiveFolder] = useState<Folder>("Inbox");
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [activeLabel, setActiveLabel]   = useState<Label | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  
  // New States for Validation Array & Pagination
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Derive counts
  const folderCounts = {
    Inbox: emails.filter(m => m.folder === "Inbox").length,
    Sent: emails.filter(m => m.folder === "Sent").length,
    Drafts: emails.filter(m => m.folder === "Drafts").length,
    Trash: emails.filter(m => m.folder === "Trash").length,
  };

  // 1. Filter emails based on the current selection state (ALL items in filter)
  const filteredEmails = useMemo(() => {
    let list = emails;

    if (activeFilter === "Starred") {
      list = list.filter(m => m.isStarred);
    } else if (activeFilter === "Important") {
      list = list.filter(m => m.isImportant);
    } else if (activeLabel) {
      list = list.filter(m => m.label === activeLabel);
    } else {
      list = list.filter(m => m.folder === activeFolder);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => 
        m.subject.toLowerCase().includes(q) || 
        m.sender.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q)
      );
    }

    return list;
  }, [emails, activeFolder, activeFilter, activeLabel, searchQuery]);
  
  // 2. Pagination derivation
  const totalPages = Math.ceil(filteredEmails.length / ITEMS_PER_PAGE);
  const displayedEmails = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEmails.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEmails, currentPage]);

  // Derive active email for detail view
  const activeEmailIndex = filteredEmails.findIndex(m => m.id === selectedEmailId);
  const activeEmail = activeEmailIndex >= 0 ? filteredEmails[activeEmailIndex] : null;

  // Handlers for selection
  const handleSelectFolder = (folder: Folder) => {
    setActiveFolder(folder);
    setActiveFilter(null);
    setActiveLabel(null);
    setSelectedEmailId(null);
    setSelectedEmails(new Set());
    setCurrentPage(1);
  };

  const handleSelectFilter = (filter: FilterType) => {
    setActiveFilter(filter);
    setActiveLabel(null);
    setSelectedEmailId(null);
    setSelectedEmails(new Set());
    setCurrentPage(1);
  };

  const handleSelectLabel = (label: Label) => {
    setActiveLabel(label);
    setActiveFilter(null);
    setSelectedEmailId(null);
    setSelectedEmails(new Set());
    setCurrentPage(1);
  };

  // Handlers for Checkbox Selection
  const isAllSelected = filteredEmails.length > 0 && selectedEmails.size === filteredEmails.length;
  const isSomeSelected = selectedEmails.size > 0 && selectedEmails.size < filteredEmails.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedEmails(new Set());
    } else {
      setSelectedEmails(new Set(filteredEmails.map(e => e.id)));
    }
  };

  const handleToggleEmailSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSet = new Set(selectedEmails);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEmails(newSet);
  };

  // Handler for Starring
  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setEmails(prev => prev.map(em => em.id === id ? { ...em, isStarred: !em.isStarred } : em));
  };

  // Pagination inside Detail View
  const handleNextEmail = () => {
    if (activeEmailIndex < filteredEmails.length - 1) {
      setSelectedEmailId(filteredEmails[activeEmailIndex + 1].id);
    }
  };

  const handlePrevEmail = () => {
    if (activeEmailIndex > 0) {
      setSelectedEmailId(filteredEmails[activeEmailIndex - 1].id);
    }
  };
  
  // Handlers for List Pagination inside List View 
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(c => c + 1);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(c => c - 1);
  };


  return (
    <div className="flex max-w-7xl mx-auto h-[calc(100vh)] bg-zinc-50 font-sans p-6 pb-0 pt-2 text-zinc-800 hero-font">

      {/* --- LEFT SIDEBAR --- */}
      <div className="w-64 shrink-0 flex flex-col pt-4 pr-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-zinc-900 mb-6">Inbox</h1>
          <button className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm tracking-wide">
            <PenLine size={16} /> Compose
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8 pb-10">
          
          {/* Folders */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 hidden">Mailbox</p>
            {(["Inbox", "Sent", "Drafts", "Trash"] as Folder[]).map(folder => {
              const isActive = !activeFilter && !activeLabel && activeFolder === folder;
              const icons = {
                Inbox: Inbox, Sent: Send, Drafts: File, Trash: Trash2
              };
              const Icon = icons[folder];
              return (
                <button
                  key={folder}
                  onClick={() => handleSelectFolder(folder)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors ${isActive ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-100 font-medium'}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-zinc-600' : 'text-zinc-500'} />
                    <span>{folder}</span>
                  </div>
                  {folderCounts[folder] > 0 && (
                    <span className={`text-xs ${isActive ? 'text-zinc-600' : 'text-zinc-400'}`}>{folderCounts[folder]}</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Filters */}
          <div>
            <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Filter</p>
            <div className="space-y-1">
              <button
                onClick={() => handleSelectFilter("Starred")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeFilter === "Starred" ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-100 font-medium'}`}
              >
                <Star size={18} className="text-zinc-500" /> Starred
              </button>
              <button
                onClick={() => handleSelectFilter("Important")}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeFilter === "Important" ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-100 font-medium'}`}
              >
                <Tag size={18} className="text-zinc-500" /> Important
              </button>
            </div>
          </div>

          {/* Labels */}
          <div>
            <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Label</p>
            <div className="space-y-1">
              {LABELS.map(lbl => (
                <button
                  key={lbl.id}
                  onClick={() => handleSelectLabel(lbl.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${activeLabel === lbl.id ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-600 hover:bg-zinc-100 font-medium'}`}
                >
                  <div className="w-3 h-3 rounded-[3px] shadow-sm ml-0.5" style={{ backgroundColor: lbl.color }}></div>
                  <span>{lbl.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT MAIN VIEW --- */}
      <div className="flex-1 flex flex-col bg-white rounded-t-3xl border border-zinc-200 shadow-sm overflow-hidden mb-[-1px]">
        
        {/* Top Breadcrumb Header Equivalent */}
        {/* <div className="px-6 py-4 flex justify-end items-center text-sm font-medium text-zinc-500 border-b border-zinc-100 bg-white">
          <span>Home</span>
          <ChevronRight size={14} className="mx-2 text-zinc-300" />
          <span className="text-zinc-900">{activeEmail ? "Inbox Details" : "Inbox"}</span>
        </div> */}

        {!activeEmail ? (
          /* --- LIST VIEW --- */
          <div className="flex flex-col h-full bg-white relative">
            
            {/* Toolbar */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleToggleSelectAll}
                  className={`w-5 h-5 rounded border transition-colors flex items-center justify-center 
                    ${isAllSelected ? "bg-blue-600 border-blue-600 text-white" : isSomeSelected ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-300 text-transparent hover:border-zinc-500"}`}
                >
                  <ChevronRight size={12} className={isSomeSelected && !isAllSelected ? "hidden" : "rotate-90"}/>
                  {isSomeSelected && !isAllSelected && <div className="w-2.5 h-0.5 bg-white rounded-full"></div>}
                </button>
                <div className="h-5 w-px bg-zinc-200"></div>
                <button className="text-zinc-500 hover:text-zinc-800 transition-colors"><RotateCw size={18} /></button>
                <button className="text-red-500 hover:text-red-800 transition-colors"><Trash2 size={18} /></button>
                <button className="text-zinc-500 hover:text-zinc-800 transition-colors"><Mail size={18} /></button>
                <button className="text-zinc-500 hover:text-zinc-800 transition-colors"><MoreVertical size={18} /></button>
              </div>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400/20 w-64 transition-all"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {displayedEmails.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                  <Inbox size={48} className="mb-4 opacity-20" />
                  <p>No emails found</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-50">
                  {displayedEmails.map(email => {
                    const isSelected = selectedEmails.has(email.id);
                    return (
                    <div 
                      key={email.id}
                      onClick={() => setSelectedEmailId(email.id)}
                      className={`group flex items-center gap-4 px-6 py-4 hover:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:z-10 relative transition-all cursor-pointer border-l-4 ${isSelected ? "bg-blue-50/50 border-l-blue-600" : "bg-white border-transparent hover:border-l-blue-500"}`}
                    >
                      <button 
                        onClick={(e) => handleToggleEmailSelect(e, email.id)}
                        className={`shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center
                          ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-300 text-transparent group-hover:border-zinc-500 text-transparent hover:border-zinc-500"}`}
                      >
                         <ChevronRight size={12} className="rotate-90"/>
                      </button>
                      
                      <button 
                        onClick={(e) => handleToggleStar(e, email.id)}
                        className={`shrink-0 transition-colors ${email.isStarred ? 'text-yellow-400' : 'text-zinc-300 hover:text-zinc-500'}`}
                      >
                        <Star size={18} className={email.isStarred ? 'fill-yellow-400' : ''} />
                      </button>
                      
                      <div className={`w-48 shrink-0 font-medium truncate pr-4 ${!email.isStarred && !isSelected ? "text-zinc-900" : "text-zinc-900"}`}>
                        {email.sender}
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-4 flex items-center gap-3">
                        <span className="text-zinc-600 truncate">
                          {email.subject} <span className="text-zinc-400 ml-1 font-normal">- {email.preview}</span>
                        </span>
                        
                        {email.isImportant && (
                          <span className="shrink-0 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">Important</span>
                        )}
                        {email.label && LABELS.find(l=>l.id===email.label) && (
                           <span className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${LABELS.find(l=>l.id===email.label)?.labelClass}`}>
                             {email.label}
                           </span>
                        )}
                      </div>

                      <div className="w-20 shrink-0 text-right text-sm text-zinc-500 font-medium">
                        {email.date}
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-500">
               <span>Showing {displayedEmails.length > 0 ? currentPage : 0} of {Math.max(1, totalPages)}</span>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={handlePrevPage}
                   disabled={currentPage === 1}
                   className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 ><ChevronLeft size={16} /></button>
                 <button 
                   onClick={handleNextPage}
                   disabled={currentPage === totalPages}
                   className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 ><ChevronRight size={16} /></button>
               </div>
            </div>

          </div>
        ) : (
          /* --- DETAIL VIEW --- */
          <div className="flex flex-col h-full bg-white relative">
            
            {/* Detail Toolbar */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-100">
               <div className="flex items-center gap-4">
                 <button onClick={() => setSelectedEmailId(null)} className="p-1.5 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors flex items-center justify-center">
                   <ArrowLeft size={16} />
                 </button>
                 <div className="h-5 w-px bg-zinc-200"></div>
                 <button className="p-1.5 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors"><Trash2 size={16} /></button>
                 <button className="p-1.5 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors"><Info size={16} /></button>
                 <button className="p-1.5 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors"><Mail size={16} /></button>
               </div>

               <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium">
                 <span>{activeEmailIndex + 1} of {filteredEmails.length}</span>
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={handlePrevEmail}
                     disabled={activeEmailIndex === 0}
                     className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   ><ChevronLeft size={16} /></button>
                   <button 
                     onClick={handleNextEmail}
                     disabled={activeEmailIndex === filteredEmails.length - 1}
                     className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   ><ChevronRight size={16} /></button>
                 </div>
               </div>
            </div>

            {/* Email Body Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               <div className="mb-6">
                 <h2 className="text-2xl font-semibold text-zinc-900">{activeEmail.subject}</h2>
               </div>

               <div className="flex items-start justify-between mb-8">
                 <div className="flex items-center gap-4">
                   {activeEmail.avatar ? (
                     <img src={activeEmail.avatar} alt="Sender" className="w-12 h-12 rounded-full object-cover border border-zinc-200" />
                   ) : (
                     <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-200">
                       {activeEmail.sender.charAt(0)}
                     </div>
                   )}
                   <div>
                     <h2 className="text-base font-bold text-zinc-900">{activeEmail.sender}</h2>
                     <p className="text-sm font-medium text-zinc-500">
                        {activeEmail.email}
                     </p>
                   </div>
                 </div>
                 <div className="text-sm font-medium text-zinc-400">
                   {activeEmail.date}
                 </div>
               </div>

               <div className="text-zinc-700 leading-relaxed whitespace-pre-line text-[15px] max-w-4xl">
                 {activeEmail.body}
               </div>

               {/* Attachments */}
               {activeEmail.attachments && activeEmail.attachments.length > 0 && (
                 <div className="mt-10 border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 max-w-4xl">
                   <p className="flex items-center gap-2 text-sm font-bold text-zinc-700 mb-4">
                     <Paperclip size={16} className="text-zinc-400"/> {activeEmail.attachments.length} Attachments
                   </p>
                   <div className="flex flex-wrap gap-4">
                     {activeEmail.attachments.map((att, i) => (
                        <div key={i} className="flex flex-col bg-white border border-zinc-200 rounded-xl p-4 w-60 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                             <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100 font-bold text-xs">
                               {att.type}
                             </div>
                          </div>
                          <p className="text-sm font-semibold text-zinc-900 truncate">{att.name}</p>
                          <p className="text-xs text-zinc-500 flex items-center justify-between mt-1">
                            {att.type} • {att.size} <span className="text-blue-600 font-medium cursor-pointer hover:underline">Download</span>
                          </p>
                        </div>
                     ))}
                   </div>
                 </div>
               )}

            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 border-t border-zinc-100 flex items-center gap-3">
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                 <Reply size={16} className="text-zinc-400"/> Reply
               </button>
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                 <ReplyAll size={16} className="text-zinc-400"/> Reply all
               </button>
               <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
                 <Forward size={16} className="text-zinc-400"/> Forward
               </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
