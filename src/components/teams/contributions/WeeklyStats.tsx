"use client";

export default function WeeklyStats() {
  const stats = [
    { label: "Tasks Completed", value: 42 },
    { label: "Messages Sent", value: 180 },
    { label: "Features Shipped", value: 9 },
    { label: "Reviews Done", value: 21 },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white border rounded-2xl p-4"
        >
          <p className="text-xs text-zinc-500">
            {s.label}
          </p>
          <p className="text-xl font-semibold">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
