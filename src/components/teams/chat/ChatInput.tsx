"use client";

import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

export default function ChatInput({ onSend }: any) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-full flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-black focus-within:bg-white transition-all">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-zinc-400"
          />
          <div className="flex items-center gap-3 text-zinc-400 pr-1">
             <button className="hover:text-zinc-700 transition"><Paperclip size={18} /></button>
             <button className="hover:text-zinc-700 transition"><Mic size={18} /></button>
          </div>
      </div>

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="w-12 h-12 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white flex items-center justify-center shrink-0 disabled:opacity-50 transition shadow-sm"
      >
        <Send size={18} className="translate-x-px translate-y-px" />
      </button>
    </div>
  );
}
