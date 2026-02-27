"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import { editProjectMemberAction } from "@/actions/project.actions";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedAt: string;
  status?: string;
}

export default function TeamBoardClient({
  members,
  projectId
}: {
  members: TeamMember[];
  projectId: string;
}) {
  const founder = members.find(
    (m) => m.role === "FOUNDER" || m.role === "OWNER" || m.role === "Founder",
  );

  const others = members.filter(
    (m) => m.role !== "FOUNDER" && m.role !== "OWNER" && m.role !== "Founder",
  );

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleEditClick = (member: TeamMember) => {
      setSelectedMember(member);
  };

  return (
    <div className="space-y-8 p-6">
      {/* FOUNDER */}
      {founder && (
        <div className="border rounded-2xl p-6 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-4 relative">
            <img src={founder.avatar} className="w-14 h-14 rounded-full" />
            <div className="bg-yellow-50 rounded-full p-1 absolute -top-1 -left-1 ">
              {" "}
              <Crown size={15} className="text-yellow-500 " />
            </div>

            <div>
              <p className="font-semibold text-xl">{founder.name}</p>
              <p className="text-sm opacity-80">
                Founder • Joined {founder.joinedAt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TEAM GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {others.map((m) => (
          <button
            key={m.id}
            onClick={() => handleEditClick(m)}
            className="border rounded-2xl p-4 bg-white hover:shadow-md transition text-left relative focus:outline-none focus:ring-2 focus:ring-zinc-200"
          >
            <div className="flex items-center gap-3">
              <img
                src={m.avatar}
                className={`w-10 h-10 rounded-full ${m.status === "Pending" ? "opacity-60 grayscale" : ""}`}
                alt={m.name}
              />
              <div>
                <p
                  className={`font-semibold capitalize text-lg ${m.status === "Pending" ? "text-zinc-600" : "text-zinc-900"}`}
                >
                  {m.name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-zinc-500 capitalize">{m.role.toLowerCase()}</p>
                  {m.status === "Pending" && (
                    <span className="px-2 mx-1 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-500">
                      Pending Invite
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-500 mt-3">
              {m.status === "Pending" ? "Invited on" : "Joined"} {m.joinedAt}
            </p>
          </button>
        ))}
      </div>

      {selectedMember && (
          <EditMemberModal 
              member={selectedMember} 
              projectId={projectId}
              onClose={() => setSelectedMember(null)} 
          />
      )}
    </div>
  );
}

function EditMemberModal({ member, projectId, onClose }: { member: TeamMember, projectId: string, onClose: () => void }) {
    const [role, setRole] = useState(member.role);
    const [email, setEmail] = useState(member.email);
    const [isPending, setIsPending] = useState(false);

    const hasChanges = role !== member.role || email !== member.email;

    const handleSave = async () => {
        setIsPending(true);
        const res = await editProjectMemberAction(
            projectId,
            member.id,
            member.status === "Pending",
            { role, email }
        );

        if (!res.success) {
            console.error(res.error);
        }

        setIsPending(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg text-zinc-900">Edit Team Member</h3>
                    <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-500 transition">
                       ✕
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <img src={member.avatar} className="w-16 h-16 rounded-full" alt="avatar" />
                        <div>
                            <p className="font-bold text-lg">{member.name}</p>
                            {member.status === "Pending" && (
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-500 border border-amber-200">
                                    Pending Invite
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-800 transition"
                            />
                            {/* <p className="text-[11px] text-zinc-500">Changing an active member's email will resend an invite and remove their current access.</p> */}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Project Role</label>
                            <div className="relative">
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-black uppercase tracking-widest text-zinc-500 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-size-[24px_24px] bg-no-repeat bg-position-[right_8px_center]"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="ADVISOR">Advisor</option>
                                    <option value="CO_FOUNDER">Co-founder</option>
                                    <option value="CONSULTANT">Consultant</option>
                                    <option value="DESIGNER">Designer</option>
                                    <option value="DEVELOPER">Developer</option>
                                    <option value="FOUNDER">Founder</option>
                                    <option value="HR">HR</option>
                                    <option value="MARKETER">Marketer</option>
                                    <option value="SPECTATOR">Spectator</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-zinc-50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isPending || !hasChanges}
                        className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-zinc-800 transition disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
