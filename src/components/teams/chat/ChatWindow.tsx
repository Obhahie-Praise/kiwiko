"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Phone, Video, MoreVertical, Loader2, Sparkles } from "lucide-react";
import { getAblyChat } from "@/lib/ably";
import { chatWithKiwikoAgentAction, getKiwikoAgentHistoryAction } from "@/actions/ai.actions";
import AIToolModal from "./AIToolModal";
import Image from "next/image";

// ----------------------------------------------------------------
// Mock history generator (used as fallback and for the AI agent)
// ----------------------------------------------------------------
const generateMockHistory = (contact: any) => {
  if (!contact) return [];

  if (contact.id === "group") {
    return [
      {
        id: "g1",
        user: "Sarah Jenkins",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
        text: "Hey team, here's the latest project brief for the Q3 campaign.",
        file: { name: "Q3_Campaign_Brief.pdf", size: "2.4 MB" },
        time: "2 hours ago",
        mine: false,
      },
      {
        id: "g2",
        user: "Mike Chen",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Mike",
        text: "Looks good! I've also set up the shared folder for design assets.",
        folder: { name: "Design Assets Q3", itemsCount: 42 },
        time: "1 hour ago",
        mine: false,
      },
      {
        id: "g3",
        user: "You",
        avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        text: "Thanks both. I'll review and get back to you by EOD.",
        time: "30 mins ago",
        mine: true,
      },
    ];
  }

  if (contact.id === "ai-agent") {
    return [
      {
        id: "ai1",
        user: "Kiwiko Agent",
        avatar: "/kiwiko-agent.svg",
        text: "Hi! I'm Kiwiko Agent. I can help you with project insights, drafts, and more. What do you need today?",
        time: "Just now",
        mine: false,
      },
    ];
  }

  return [
    {
      id: "p1",
      user: contact.name,
      avatar: contact.avatar,
      text: "Hi! I wanted to follow up on the updates we discussed.",
      time: "Yesterday",
      mine: false,
    },
    {
      id: "p2",
      user: "You",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      text: "Yes, I've got the mockups ready.",
      time: "Yesterday",
      mine: true,
    },
    {
      id: "p3",
      user: "You",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      text: "Here's the link to the Figma file:",
      link: { title: "App Redesign - Phase 2", url: "figma.com/file/xyz123..." },
      time: "Yesterday",
      mine: true,
    },
    {
      id: "p4",
      user: contact.name,
      avatar: contact.avatar,
      text: "Awesome, these look great! Especially this one:",
      image:
        "https://images.unsplash.com/photo-1506744626753-1fa44df31c78?q=80&w=2000&auto=format&fit=crop",
      time: "2 hours ago",
      mine: false,
    },
    {
      id: "p5",
      user: "You",
      avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
      text: "Thanks! Let me know if you need any changes.",
      time: "Just now",
      mine: true,
    },
  ];
};

// ----------------------------------------------------------------
// Helper to convert an Ably Chat message to UI format
// ----------------------------------------------------------------
const toUiMsg = (msg: any, currentUserId: string, contact: Contact): Message => ({
  id: msg.serial ?? msg.id,
  user: msg.clientId === currentUserId ? "You" : (contact.name ?? "User"),
  avatar:
    msg.clientId === currentUserId
      ? "https://images.unsplash.com/photo-1607746882042-944635dfe10e"
      : contact.avatar,
  text: msg.text,
  time: new Date(msg.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  mine: msg.clientId === currentUserId,
});

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------
interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  time: string;
  lastMessageAt: number;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  mine: boolean;
  file?: { name: string; size: string };
  folder?: { name: string; itemsCount: number };
  link?: { title: string; url: string };
  image?: string;
}

// ----------------------------------------------------------------
// Component
// ----------------------------------------------------------------
interface ChatWindowProps {
  activeContactId: string | null;
  contacts: Contact[];
  currentUserId: string | null;
  projectId: string | null;
  initialMessages?: any[];
}

export default function ChatWindow({
  activeContactId,
  contacts,
  currentUserId,
  projectId,
}: ChatWindowProps) {
  const activeContact =
    contacts.find((c) => c.id === activeContactId) || contacts[0];

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [botStatus, setBotStatus] = useState<"thinking" | "preparing_tools" | "performing_task" | null>(null);
  const [activeToolCall, setActiveToolCall] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<any>(null);
  const subRef = useRef<any>(null);

  // ── Ably / mock integration ──────────────────────────────────
  useEffect(() => {
    if (!activeContact) return;
    let isMounted = true;

    // Teardown previous room
    subRef.current?.unsubscribe?.();
    roomRef.current?.detach?.().catch(() => {});
    subRef.current = null;
    roomRef.current = null;

    const setupRoom = async () => {
      // If AI Agent, load custom server-side history and skip Ably
      if (activeContact?.id === "ai-agent") {
        if (isMounted) setMessages([]);
        if (projectId) {
          getKiwikoAgentHistoryAction(projectId).then(res => {
            if (isMounted && res.success && res.data) {
              const historyMessages: Message[] = res.data.map((m: any) => ({
                id: m.id,
                user: m.role === "user" ? "You" : "Kiwiko Agent",
                avatar: m.role === "user" ? "https://images.unsplash.com/photo-1607746882042-944635dfe10e" : activeContact.avatar,
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mine: m.role === "user"
              }));
              
              setMessages(historyMessages);
            }
          });
        }
        return;
      }

      // Mock contacts — no real-time needed (for non-AI, non-Ably cases)
      if (!projectId || !currentUserId) {
        if (isMounted) setMessages(generateMockHistory(activeContact));
        return;
      }

      // 1) Set up Ably client & room (Only for real users)
      const chat = getAblyChat();
      if (!chat) {
        // Ably key not configured — graceful mock fallback
        if (isMounted) setMessages(generateMockHistory(activeContact));
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setMessages([]);
      }

      try {
        const roomId =
          activeContact.id === "group"
            ? `project-${projectId}-group`
            : `project-${projectId}-dm-${[currentUserId, activeContact.id]
                .sort()
                .join("-")}`;

        const room = await chat.rooms.get(roomId);
        if (!isMounted) return;
        roomRef.current = room;

        // Attach is required before reading history or subscribing
        await room.attach();

        // Fetch prior messages
        const { items } = await (room.messages as any).get({ limit: 50 });

        if (isMounted) {
          setMessages(
            items.length > 0
              ? items.map((m: any) => toUiMsg(m, currentUserId, activeContact))
              : generateMockHistory(activeContact)
          );
          setIsLoading(false);
        }

        // Live subscription — the SDK returns a subscription object
        const subscription = room.messages.subscribe((event: any) => {
          if (!isMounted) return;
          const msg = event.message ?? event;
          setMessages((prev: any[]) => [
            ...prev,
            {
              ...toUiMsg(msg, currentUserId, activeContact),
              time: "Just now",
            },
          ]);
        });
        subRef.current = subscription;
      } catch (err) {
        console.error("[Ably Chat] room setup error:", err);
        if (isMounted) {
          setMessages(generateMockHistory(activeContact));
          setIsLoading(false);
        }
      }
    };

    setupRoom();

    return () => {
      isMounted = false;
      subRef.current?.unsubscribe?.();
      roomRef.current?.detach?.().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact?.id, projectId, currentUserId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  // ── Send ────────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (activeContact.id === "ai-agent") {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        user: "You",
        avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        text,
        time: "Just now",
        mine: true,
      };
      
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);
      setBotStatus("thinking");

      try {
        if (!projectId) throw new Error("Missing projectId");
        const res = await chatWithKiwikoAgentAction(projectId, text);
        if (activeContact.id !== "ai-agent") return;

        if (res.success && res.text) {
          if (res.toolCall) {
            setBotStatus("preparing_tools");
            setTimeout(() => {
              if (activeContact.id === "ai-agent") {
                setIsTyping(false);
                setBotStatus(null);
                setMessages(prev => [...prev, {
                  id: crypto.randomUUID(),
                  user: "Kiwiko Agent",
                  avatar: activeContact.avatar,
                  text: res.text!,
                  time: "Just now",
                  mine: false,
                }]);
                setActiveToolCall(res.toolCall);
              }
            }, 800);
          } else {
            setIsTyping(false);
            setBotStatus(null);
            setMessages(prev => [...prev, {
              id: crypto.randomUUID(),
              user: "Kiwiko Agent",
              avatar: activeContact.avatar,
              text: res.text!,
              time: "Just now",
              mine: false,
            }]);
          }
        } else {
          throw new Error(res.error || "Failed to get response");
        }
      } catch (error) {
        console.error("AI Chat Error:", error);
        if (activeContact.id === "ai-agent") {
          setIsTyping(false);
          setBotStatus(null);
          setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            user: "Kiwiko Agent",
            avatar: activeContact.avatar,
            text: "Sorry, I encountered an error. Please try again or check your connection.",
            time: "Just now",
            mine: false,
          }]);
        }
      }
      return;
    }

    if (roomRef.current) {
      try {
        await roomRef.current.messages.send({ text });
      } catch (err) {
        console.error("[Ably Chat] send error:", err);
      }
    } else {
      // Offline / no-key fallback
      setMessages((prev: Message[]) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          user: "You",
          avatar:
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
          text,
          time: "Just now",
          mine: true,
        },
      ]);
    }
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-50 text-zinc-400">
        Select a chat to start messaging
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activeContact.avatar}
              className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 object-cover"
              alt={activeContact.name}
            />
            {activeContact.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
            )}
          </div>
          <div>
            <h3 className="special-font tracking-wide font-semibold text-zinc-900 leading-tight capitalize">
              {activeContact.name}
            </h3>
            <p className="text-xs text-zinc-500">{activeContact.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          {/* Non-functional by design */}
          <button className="cursor-not-allowed opacity-40" disabled>
            <Phone size={18} />
          </button>
          <button className="cursor-not-allowed opacity-40" disabled>
            <Video size={20} />
          </button>
          <button className="cursor-not-allowed opacity-40" disabled>
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white min-h-0 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        )}
        {/* Empty State for AI Agent */}
        {!isLoading && activeContact.id === 'ai-agent' && messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500 bg-white z-10">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-zinc-200/50 flex items-center justify-center border border-zinc-100 mb-6">
              {/* <Sparkles className="w-8 h-8 text-indigo-500" /> */}
              <Image src="/neutral-logo.svg" alt="Kiwiko Agent" width={64} height={64} className="rounded-full" />
            </div>
            <h2 className="text-3xl font-semibold text-zinc-900 mb-2 special-font">
              Meet the Kiwiko Agent
            </h2>
            <p className="text-xs font-medium text-zinc-500 max-w-[400px] mb-8 leading-tight">
              I'm an AI assistant built right into your workspace. I can help analyze your metrics, compose emails, draft project updates, and schedule meetings. What shall we tackle today?
            </p>
            <div className="flex justify-center flex-wrap gap-2">
               {/* <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-200 bg-zinc-50 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-1.5"><Sparkles size={12} className="text-indigo-500"/> Context Aware</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-200 bg-zinc-50 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">Agentic Tools</span>
               <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border border-zinc-200 bg-zinc-50 shadow-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">Secure Memory</span> */}
               <p className="text-sm font-semibold text-zinc-500 max-w-[400px] mb-8">Ask about your startup</p>
            </div>
          </div>
        )}

        {messages.map((m: any) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {isTyping && (
          <div className="flex gap-3 mb-4 max-w-[80%] opacity-90 animate-in slide-in-from-left-2 duration-300">
             <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1 border border-zinc-200">
                <img src={activeContact.avatar} alt="Bot" className="w-full h-full object-cover" />
             </div>
             <div className="bg-zinc-100 text-zinc-900 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex flex-col gap-2 min-w-[140px]">
                <div className="flex items-center gap-2">
                   <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-700" />
                   <span className="text-xs font-semibold tracking-wider text-zinc-600">
                      {botStatus === "thinking" && "Kiwiko is thinking..."}
                      {botStatus === "preparing_tools" && "Preparing tools..."}
                      {botStatus === "performing_task" && "Performing task..."}
                      {!botStatus && "Typing..."}
                   </span>
                </div>
                <div className="flex gap-1.5 ml-0.5">
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                </div>
             </div>
          </div>
        )}
        <div ref={bottomRef} className="h-1" />
      </div>

      <AIToolModal 
        isOpen={!!activeToolCall}
        toolCall={activeToolCall}
        projectId={projectId || ""}
        onClose={() => setActiveToolCall(null)}
      />

      {/* INPUT */}
      <div className="shrink-0 p-4 bg-white border-t border-zinc-100">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}
