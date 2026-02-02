"use client";

import { useState } from "react";
import { emails } from "@/constants/index";

const InboxLayout = () => {
  const [activeEmail, setActiveEmail] = useState(emails[0]);

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden  border-t-2 border-l-2 rounded-tl-2xl py-4 px-0 bg-zinc-50 min-h-screen">

      {/* LEFT — EMAIL LIST */}
      <div className="w-[25%] border-r px-2">
        <div className="p-3 border-b">
          <input
            placeholder="Search mail..."
            className="w-full border-b border-zinc-400 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="overflow-y-auto space-y-2">
          {emails.map((mail) => (
            <div
              key={mail.id}
              onClick={() => setActiveEmail(mail)}
              className={`p-4 cursor-pointer transition rounded-2xl
                ${activeEmail.id === mail.id ? "bg-zinc-200/50" : "hover:bg-white"}
              `}
            >
              <div className="flex justify-between">
                <p className="font-medium">{mail.sender}</p>
                <span className="text-xs text-zinc-400">{mail.date}</span>
              </div>

              <p className="text-sm font-semibold">{mail.subject}</p>

              <p className="text-xs text-zinc-500 truncate">
                {mail.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — OPENED EMAIL */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-3 border-b">
          <h2 className="font-semibold text-xl">
            {activeEmail.subject}
          </h2>
          <p className="text-sm text-zinc-500">
            {activeEmail.sender} — {activeEmail.email}
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 p-5 overflow-y-auto whitespace-pre-line text-zinc-800">
          {activeEmail.body}
        </div>

        {/* Reply */}
        <div className="border-t p-4">
          <textarea
            placeholder="Write a reply..."
            className="w-full border rounded-lg p-3 text-sm resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button className="bg-black text-white px-5 py-2 rounded-lg text-sm">
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InboxLayout;
