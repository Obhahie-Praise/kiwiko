"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import ActivityPanel from "../contributions/ActivityPanel";

const TABS = ["Backlog", "In Progress", "Review", "Completed", "Team Activity"];

export default function TasksLayout({
  tasks,
  activity,
}: any) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const filteredTasks = tasks.filter((t: any) => t.status === activeTab);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      {/* Tabs Header */}
      <div className="flex items-center gap-6 px-6 border-b border-zinc-100 shrink-0 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 text-sm font-medium transition-colors relative whitespace-nowrap
              ${activeTab === tab ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}
            `}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
        {activeTab === "Team Activity" ? (
          <div className="max-w-3xl mx-auto">
            <ActivityPanel activity={activity} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTasks.length > 0 ? (
                filteredTasks.map((t: any) => (
                    <TaskCard key={t.id} task={t} />
                ))
            ) : (
                <div className="py-12 text-center text-zinc-500 text-sm">
                    No tasks found in {activeTab}.
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
