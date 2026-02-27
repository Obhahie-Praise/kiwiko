import { FileText, Link as LinkIcon, Folder, Download } from "lucide-react";

export default function MessageBubble({ message }: any) {
  return (
    <div
      className={`flex gap-3 group ${
        message.mine ? "justify-end" : ""
      }`}
    >
      {!message.mine && (
        <img
          src={message.avatar}
          className="w-8 h-8 rounded-full shrink-0 mt-1 object-cover"
          alt={message.user}
        />
      )}

      <div className={`flex flex-col ${message.mine ? "items-end" : "items-start"}`}>
        {message.text && (
            <div
            className={`max-w-md px-4 py-2.5 text-[14px] leading-relaxed mb-1
            ${
                message.mine
                ? "bg-black text-white rounded-2xl rounded-tr-sm"
                : "bg-zinc-100 text-zinc-900 rounded-2xl rounded-tl-sm"
            }`}
            >
            <div>{message.text}</div>
            </div>
        )}

        {message.image && (
          <div className="mt-1 rounded-xl overflow-hidden shadow-sm border border-zinc-200 bg-white p-1">
              <img src={message.image} alt="attachment" className="w-full max-w-[280px] h-auto object-cover rounded-lg" />
          </div>
        )}

        {message.file && (
          <div className="mt-1 flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white shadow-sm max-w-[280px] cursor-pointer hover:bg-zinc-50 transition">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                  <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{message.file.name}</p>
                  <p className="text-xs text-zinc-500">{message.file.size}</p>
              </div>
              <button className="text-zinc-400 hover:text-black transition">
                 <Download size={18} />
              </button>
          </div>
        )}

        {message.link && (
          <div className="mt-1 flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white shadow-sm max-w-[280px] cursor-pointer hover:bg-zinc-50 transition">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                  <LinkIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{message.link.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{message.link.url}</p>
              </div>
          </div>
        )}

        {message.folder && (
          <div className="mt-1 flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white shadow-sm max-w-[280px] cursor-pointer hover:bg-zinc-50 transition">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600 shrink-0">
                  <Folder size={20} />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">{message.folder.name}</p>
                  <p className="text-xs text-zinc-500">{message.folder.itemsCount} items</p>
              </div>
          </div>
        )}

        
        <span className="text-[11px] font-medium text-zinc-400 mt-1 opacity-100 transition-opacity">
            {!message.mine && message.user && <span className="mr-1">{message.user} •</span>}
            {message.time || "Just now"}
        </span>
      </div>
    </div>
  );
}
