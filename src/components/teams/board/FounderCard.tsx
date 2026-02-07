import FounderCard from "./FounderCard";
import MemberGrid from "./MemberGrid";

export default function TeamBoard({ team, members }: any) {
  const founder = members.find(
    (m: any) => m.role === "Founder"
  );
  const rest = members.filter(
    (m: any) => m.role !== "Founder"
  );

  return (
    <div className="p-6 space-y-8">
      {/* FOUNDER */}
      <section>
        <h2 className="text-sm font-medium text-zinc-500 mb-3">
          Founder
        </h2>
        <FounderCard member={founder} />
      </section>

      {/* TEAM */}
      <section>
        <h2 className="text-sm font-medium text-zinc-500 mb-3">
          Team members
        </h2>
        <MemberGrid members={rest} />
      </section>
    </div>
  );
}
