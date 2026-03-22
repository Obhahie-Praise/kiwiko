"use client";

import React, { useState } from "react";
import { Search, Download, RotateCcw, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaitlistEntry {
  id: string;
  email: string;
  joinedAt: string;
  source: string;
}

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  totalSignups?: number;
  onReload?: () => void;
  onDelete?: (id: string) => void;
  onDownloadPdf?: () => void;
}

const WaitlistTable = ({ 
  entries, 
  totalSignups = 0, 
  onReload, 
  onDelete, 
  onDownloadPdf 
}: WaitlistTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEntries = entries.filter(entry => 
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const currentEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + ", " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-zinc-100 text-4xl font-bold special-font tracking-tight mb-2">Waitlist Users</h2>
          <p className="text-zinc-500 text-sm">Manage early access signups and track recruitment sources.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0a0a0a] border border-zinc-800/50 rounded-xl py-2.5 pl-10 pr-4 text-zinc-300 text-sm focus:outline-none focus:border-orange-500/50 transition-all w-[240px]"
            />
          </div>
          <button 
            onClick={onDownloadPdf}
            className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-orange-600/10 active:scale-95"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="bg-[#0a0a0a]/40 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-zinc-200 font-bold text-sm">Total Signups:</span>
            <span className="text-zinc-200 font-bold text-sm">{totalSignups}</span>
          </div>
          <button 
            onClick={onReload}
            className="p-2 hover:bg-zinc-800/50 rounded-lg text-zinc-500 hover:text-orange-500 transition-all active:rotate-180 duration-500"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900/80 bg-zinc-900/20">
                <th className="px-6 py-4 w-10">
                  <div className="w-4 h-4 rounded border border-zinc-700 bg-zinc-800/50" />
                </th>
                <th className="px-6 py-4 text-sm font-bold text-zinc-400">User</th>
                <th className="px-6 py-4 text-sm font-bold text-zinc-400">Time Joined</th>
                <th className="px-6 py-4 text-sm font-bold text-zinc-400">Source</th>
                <th className="px-6 py-4 text-sm font-bold text-zinc-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/80">
              {currentEntries.length > 0 ? (
                currentEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-zinc-900/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="w-4 h-4 rounded border border-zinc-700 bg-zinc-800/50 group-hover:border-orange-500/50 transition-colors" />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-zinc-100 font-bold text-sm leading-tight mb-0.5">{entry.email.split('@')[0]}</span>
                        <span className="text-zinc-500 text-xs">Waitlist Registered</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-zinc-400 text-sm tabular-nums">
                      {formatDate(entry.joinedAt)}
                    </td>
                    <td className="px-6 py-5">
                      <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {entry.source}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button 
                        onClick={() => onDelete?.(entry.id)}
                        className="text-zinc-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-zinc-600 italic font-medium">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm font-medium">
            Showing <span className="text-zinc-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-zinc-200 font-bold">{Math.min(currentPage * itemsPerPage, filteredEntries.length)}</span> of <span className="text-zinc-200 font-bold">{filteredEntries.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-zinc-800 rounded-lg flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex items-center">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-bold transition-all",
                    currentPage === i + 1 
                      ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                      : "text-zinc-500 hover:text-zinc-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors border border-zinc-800 rounded-lg flex items-center gap-1 text-xs font-bold"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistTable;
