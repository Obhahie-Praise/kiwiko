"use client";

import { useState } from "react";
import { X, Mail } from "lucide-react";

export default function InviteMember() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const sendInvite = () => {
    if (!email) return;

    // 🔜 later: call server action
    console.log("Inviting:", email);

    setEmail("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-3 py-1.5 rounded-lg border hover:bg-zinc-100"
      >
        Invite
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Invite teammate</h2>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* INPUT */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-600">
                Email address
              </label>
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                <Mail size={16} className="text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teammate@email.com"
                  className="flex-1 outline-none text-sm"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="text-sm px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={sendInvite}
                className="text-sm px-4 py-2 rounded-lg bg-black text-white"
              >
                Send invite
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
