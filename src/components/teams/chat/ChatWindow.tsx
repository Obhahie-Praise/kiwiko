"use client";

import { useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  initialMessages,
}: any) {
  const [messages, setMessages] =
    useState(initialMessages);

  const sendMessage = (text: string) => {
    setMessages((prev: any) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        user: "You",
        avatar:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        text,
        time: "now",
        mine: true,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b font-medium">
        Team Chat
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m: any) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
