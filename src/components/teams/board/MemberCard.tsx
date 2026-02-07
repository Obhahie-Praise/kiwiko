import { Circle } from "lucide-react";

export default function MemberCard({ member }: any) {
  return (
    <div className="border rounded-2xl p-4 hover:shadow transition">
      <div className="flex items-center gap-3">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <p className="font-medium text-sm">
            {member.name}
          </p>
          <p className="text-xs text-zinc-500">
            {member.role}
          </p>
        </div>

        <Circle
          size={10}
          className={
            member.online
              ? "text-green-500 fill-green-500"
              : "text-zinc-300 fill-zinc-300"
          }
        />
      </div>
    </div>
  );
}
