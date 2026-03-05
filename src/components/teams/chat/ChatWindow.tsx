"use client";

import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Phone, Video, MoreVertical, Loader2 } from "lucide-react";
import { getAblyChat } from "@/lib/ably";

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
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kiwiko",
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<any>(null);
  const subRef = useRef<any>(null);

  // ── Ably / mock integration ──────────────────────────────────
  useEffect(() => {
    if (!activeContact) return;

    // Teardown previous room
    subRef.current?.unsubscribe?.();
    roomRef.current?.detach?.().catch(() => {});
    subRef.current = null;
    roomRef.current = null;

    // Mock contacts — no real-time needed
    if (
      activeContact.id === "ai-agent" ||
      !projectId ||
      !currentUserId
    ) {
      setMessages(generateMockHistory(activeContact));
      return;
    }

    const chat = getAblyChat();
    if (!chat) {
      // Ably key not configured — graceful mock fallback
      setMessages(generateMockHistory(activeContact));
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setMessages([]);

    const setupRoom = async () => {
      try {
        const roomId =
          activeContact.id === "group"
            ? `project-${projectId}-group`
            : `project-${projectId}-dm-${[currentUserId, activeContact.id]
                .sort()
                .join("-")}`;

        const room = await chat.rooms.get(roomId);
        roomRef.current = room;

        // Attach is required before reading history or subscribing
        await room.attach();

        // Fetch prior messages
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
      // Local mock only for now
      setMessages((prev: any[]) => [
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
            <h3 className="font-semibold text-lg text-zinc-900 leading-tight capitalize">
              {activeContact.name}
            </h3>
            <p className="text-sm text-zinc-500">{activeContact.role}</p>
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
