"use client";

import { Search, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function ChatSidebar({ contacts, active, setActive }: { contacts: any[], active: string, setActive: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[320px] border-r border-zinc-200 bg-white flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">Chats</h2>
        <button className="text-zinc-400 hover:text-zinc-600 transition">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-zinc-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-black focus:bg-white transition"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredContacts.map((c: any) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`w-full text-left p-3 rounded-2xl flex items-start gap-3 transition
            ${
              active === c.id
                ? "bg-zinc-100"
                : "hover:bg-zinc-50 bg-white"
            }`}
          >
             {/* Avatar with Status */}
            <div className="relative shrink-0 mt-1">
              <img 
                src={c.avatar} 
                className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                alt={c.name}
              />
              {c.isOnline && (
                 <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-center mb-0.5">
                  <h3 className="capitalize font-medium text-zinc-900 truncate pr-2">{c.name}</h3>
                  <span className="text-[11px] font-medium text-zinc-400 whitespace-nowrap">{c.time}</span>
               </div>
               <p className="text-xs text-zinc-500 truncate">{c.role}</p>
            </div>
          </button>
        ))}

        {filteredContacts.length === 0 && (
          <div className="text-center py-10 text-zinc-500 text-sm">
            No contacts found match your search.
          </div>
        )}
      </div>
    </div>
  );
}
