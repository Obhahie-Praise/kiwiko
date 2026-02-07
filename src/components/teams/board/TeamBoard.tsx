type Props = {
  team?: any;
  members?: any[];
};

export default function TeamBoard(props: Props) {
  const members = Array.isArray(props.members)
    ? props.members
    : [];

  const founder = members.find(
    (m: any) => m.role === "Founder"
  );

  const rest = members.filter(
    (m: any) => m.role !== "Founder"
  );

  return (
    <div className="p-6">
      {founder && <div>Founder: {founder.name}</div>}
      <div>Members: {rest.length}</div>
    </div>
  );
}
