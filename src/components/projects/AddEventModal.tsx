"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useProjectSlugs } from "@/hooks/useProjectSlugs";

export const EVENT_CATEGORIES = [
  { id: 'achievement', label: 'Achievement', value: '#d97706' }, // text-amber-600
  { id: 'meeting',     label: 'Meeting',     value: '#0284c7' }, // text-sky-600
  { id: 'milestone',   label: 'Milestone',   value: '#7c3aed' }, // text-violet-600
  { id: 'email',       label: 'Email',       value: '#059669' }, // text-emerald-600
  { id: 'team',        label: 'Team',        value: '#52525b' }, // text-zinc-600
];

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: any) => void;
}

export default function AddEventModal({ isOpen, onClose, onAdd }: AddEventModalProps) {
  const { orgSlug, projectSlug } = useProjectSlugs();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("meeting");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;
    
    // Create Date objects from datetime-local input
    const sDate = new Date(startDate);
    const eDate = endDate ? new Date(endDate) : undefined;
    
    const past = sDate.getTime() < new Date().getTime();
    
    const selectedCat = EVENT_CATEGORIES.find(c => c.id === category);

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      kind: category,
      title,
      description,
      date: sDate,
      endDate: eDate,
      color: selectedCat?.value,
      past,
    });
    
    setTitle("");
    setDescription("");
    setCategory("meeting");
    setStartDate("");
    setEndDate("");
    onClose();
    // Handled in ProjectCalendar via window event dispatch and router.refresh()
    // This ensures RecentActivityTable and other components update without a page reload.
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl relative border-[0.5px] border-zinc-200">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full transition-colors">
          <X size={16} />
        </button>

        <h2 className="text-xl font-semibold text-zinc-800 hero-font">Add Event</h2>
        <p className="text-sm text-zinc-500 mt-1 mb-6">Plan your next big moment: schedule or edit an event to stay on track</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium text-zinc-900 mb-2 text-sm">Event Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-900 mb-2 text-sm">Event Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all text-sm resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-zinc-900 mb-2 text-sm">Event Category</label>
            <div className="flex flex-wrap items-center gap-4">
              {EVENT_CATEGORIES.map(c => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="eventCategory" 
                      value={c.id}
                      checked={category === c.id}
                      onChange={() => setCategory(c.id)}
                      className="peer sr-only"
                    />
                    <div 
                      className={`w-4 h-4 rounded-full border-2 transition-all block ${category === c.id ? "border-slate-800 ring-2 ring-white" : "border-transparent"}`}
                      style={{ backgroundColor: c.value }}
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
               <label className="block font-medium text-zinc-900 mb-2 text-sm">Start Time</label>
               <input 
                 type="datetime-local"
                 value={startDate}
                 onChange={(e) => setStartDate(e.target.value)}
                 className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all text-sm uppercase"
                 required
               />
            </div>

            <div className="flex-1">
               <label className="block font-medium text-zinc-900 mb-2 text-sm">End Time</label>
               <input 
                 type="datetime-local"
                 value={endDate}
                 onChange={(e) => setEndDate(e.target.value)}
                 className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 focus:border-zinc-500 transition-all text-sm uppercase"
               />
            </div>
          </div>

          <div className="flex gap-4 pt-4 justify-end items-center mt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              Close
            </button>
            <button 
              type="submit" 
              disabled={!title || !description || !startDate || !endDate}
              className={`px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all shadow-sm ${
                title && description && startDate && endDate 
                  ? "bg-zinc-900 hover:bg-zinc-800"
                  : "bg-zinc-300 cursor-not-allowed text-zinc-500"
              }`}
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
