import MemberCard from "./MemberCard";

export default function MemberGrid({ members }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {members.map((m: any) => (
        <MemberCard key={m.id} member={m} />
      ))}
    </div>
  );
}
