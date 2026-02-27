"use client";

import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout({
  initialMessages,
  contacts,
}: any) {
  const [activeContactId, setActiveContactId] = useState(contacts[0]?.id || null);

  return (
    <div className="flex h-[85vh] bg-white rounded-2xl overflow-hidden">
      <ChatSidebar contacts={contacts} active={activeContactId} setActive={setActiveContactId} />
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <ChatWindow 
          initialMessages={initialMessages} 
          activeContactId={activeContactId} 
          contacts={contacts} 
        />
      </div>
    </div>
  );
}
