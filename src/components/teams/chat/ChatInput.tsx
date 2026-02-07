"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend }: any) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-3 border-t flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none"
      />

      <button
        onClick={handleSend}
        className="px-4 rounded-xl bg-black text-white flex items-center gap-1"
      >
        <Send size={14} />
      </button>
    </div>
  );
}
