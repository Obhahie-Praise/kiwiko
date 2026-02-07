export default function MessageBubble({ message }: any) {
  return (
    <div
      className={`flex gap-3 ${
        message.mine ? "justify-end" : ""
      }`}
    >
      {!message.mine && (
        <img
          src={message.avatar}
          className="w-8 h-8 rounded-full"
        />
      )}

      <div
        className={`max-w-xs px-4 py-2 rounded-2xl text-sm
        ${
          message.mine
            ? "bg-black text-white"
            : "bg-zinc-100"
        }`}
      >
        {!message.mine && (
          <p className="text-xs font-medium mb-1">
            {message.user}
          </p>
        )}
        {message.text}
      </div>
    </div>
  );
}
