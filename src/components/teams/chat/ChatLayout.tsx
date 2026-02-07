import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout({
  initialMessages,
  rooms,
}: any) {
  return (
    <div className="grid grid-cols-[280px_1fr] h-[80vh] bg-white rounded-br-2xl overflow-hidden">
      <ChatSidebar rooms={rooms} />
      <ChatWindow initialMessages={initialMessages} />
    </div>
  );
}
