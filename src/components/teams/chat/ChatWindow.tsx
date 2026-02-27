"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Phone, Video, MoreVertical } from "lucide-react";

// Robust mock data generation mimicking the screenshot variations
const generateMockHistory = (contact: any) => {
    if (!contact) return [];
    
    // For group chat
    if (contact.id === "group") {
        return [
            {
                id: "1",
                user: "Sarah Jenkins",
                avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
                text: "Hey team, here's the latest project brief for the Q3 campaign.",
                file: { name: "Q3_Campaign_Brief.pdf", size: "2.4 MB" },
                time: "2 hours ago",
                mine: false,
            },
            {
                id: "2",
                user: "Mike Chen",
                avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mike",
                text: "Looks good! I've also set up the shared folder for design assets.",
                folder: { name: "Design Assets Q3", itemsCount: 42 },
                time: "1 hour ago",
                mine: false,
            },
            {
                id: "3",
                user: "You",
                avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
                text: "Thanks both. I'll review and get back to you by EOD.",
                time: "30 mins ago",
                mine: true,
            }
        ];
    }

    // Default 1-on-1 chat
    return [
        {
            id: "1",
            user: contact.name,
            avatar: contact.avatar,
            text: `Hi! I wanted to follow up on the updates we discussed.`,
            time: "Yesterday",
            mine: false,
        },
        {
            id: "2",
            user: "You",
            avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
            text: "Yes, I've got the mockups ready.",
            time: "Yesterday",
            mine: true,
        },
        {
            id: "3",
            user: "You",
            avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
            text: "Here's the link to the Figma file:",
            link: { title: "App Redesign - Phase 2", url: "figma.com/file/xyz123..." },
            time: "Yesterday",
            mine: true,
        },
        {
            id: "4",
            user: contact.name,
            avatar: contact.avatar,
            text: "Awesome, these look great! Especially this one:",
            image: "https://images.unsplash.com/photo-1506744626753-1fa44df31c78?q=80&w=2000&auto=format&fit=crop",
            time: "2 hours ago",
            mine: false,
        },
        {
            id: "5",
            user: "You",
            avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
            text: "Thanks! Let me know if you need any changes.",
            time: "Just now",
            mine: true,
        }
    ];
};

export default function ChatWindow({
  activeContactId,
  contacts
}: any) {
  const activeContact = contacts.find((c: any) => c.id === activeContactId) || contacts[0];
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset mock messages when switching contacts
    setMessages(generateMockHistory(activeContact));
  }, [activeContact?.id]);

  useEffect(() => {
    if (bottomRef.current) {
         bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    setMessages((prev: any) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        user: "You",
        avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        text,
        time: "Just now",
        mine: true,
      },
    ]);
  };

  if (!activeContact) {
      return <div className="flex-1 flex items-center justify-center bg-zinc-50 text-zinc-400">Select a chat to start messaging</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white z-10 shrink-0">
         <div className="flex items-center gap-3">
             <div className="relative">
                 <img src={activeContact.avatar} className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 object-cover" alt="avatar" />
                 {activeContact.isOnline && (
                     <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                 )}
             </div>
             <div>
                <h3 className="font-semibold text-lg text-zinc-900 leading-tight capitalize">{activeContact.name}</h3>
                <p className="text-sm text-zinc-500">{activeContact.role}</p>
             </div>
         </div>
         
         <div className="flex items-center gap-4 text-zinc-500">
             <button className="hover:text-zinc-900 transition"><Phone size={18} /></button>
             <button className="hover:text-zinc-900 transition"><Video size={20} /></button>
             <button className="hover:text-zinc-900 transition"><MoreVertical size={20} /></button>
         </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white min-h-0">
        {messages.map((m: any) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} className="h-1" />
      </div>

      {/* INPUT */}
      <div className="shrink-0 p-4 bg-white border-t border-zinc-100">
          <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
