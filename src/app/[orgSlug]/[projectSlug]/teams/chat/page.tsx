import ChatLayout from "@/components/teams/chat/ChatLayout";
import { mockMessages, mockRooms } from "@/constants/index";

export default function TeamsChatPage() {
  return (
    <div className="min-h-[80vh] flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Team Chat</h2>
        <p className="text-sm text-zinc-500 mt-1">Real-time communication for rapid execution.</p>
      </div>
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <ChatLayout
          initialMessages={mockMessages}
          rooms={mockRooms}
        />
      </div>
    </div>
  );
}
