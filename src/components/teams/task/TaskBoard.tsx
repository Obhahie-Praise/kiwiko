"use client";

import TaskColumn from "./TaskColumn";

const columns = [
  "Backlog",
  "In Progress",
  "Review",
  "Completed",
];

export default function TaskBoard({ tasks }: any) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {columns.map((col) => (
        <TaskColumn
          key={col}
          title={col}
          tasks={tasks.filter(
            (t: any) => t.status === col
          )}
        />
      ))}
    </div>
  );
}
