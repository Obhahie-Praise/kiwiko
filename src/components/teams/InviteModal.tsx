"use client";

import { useState } from "react";
import { X, Mail, ChevronDown } from "lucide-react";

import { inviteProjectMemberAction } from "@/actions/project.actions";

export default function InviteMember({ projectId, orgSlug }: { projectId: string; orgSlug: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");
  const [isPending, setIsPending] = useState(false);

  const sendInvite = async () => {
    if (!email) return;
    setIsPending(true);

    try {
        const result = await inviteProjectMemberAction(projectId, email, role);
        if (result.success) {
            setEmail("");
            setRole("Developer");
            setOpen(false);
        } else {
            alert(result.error);
        }
    } catch (e) {
        console.error(e);
        alert("Failed to send invite");
    } finally {
        setIsPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg border font-medium border-zinc-500 bg-black text-white hover:bg-zinc-900"
      >
        Invite Member
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

            {/* INPUTS */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <div className="flex items-center gap-2 bg-white border border-zinc-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-zinc-200 transition-all">
                  <Mail size={16} className="text-zinc-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@example.com"
                    className="flex-1 outline-none text-sm placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Project Role
                </label>
                <div className="relative">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[24px_24px] bg-no-repeat bg-position-[right_8px_center]"
                    >
                        <option value="Admin">Admin</option>
                        <option value="Advisor">Advisor</option>
                        <option value="Co-founder">Co-founder</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Designer">Designer</option>
                        <option value="Developer">Developer</option>
                        <option value="Founder">Founder</option>
                        <option value="HR">HR</option>
                        <option value="Marketer">Marketer</option>
                        <option value="Spectator">Spectator</option>
                    </select>
                </div>
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
                disabled={isPending}
                className="text-sm px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
              >
                {isPending ? "Sending..." : "Send invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
