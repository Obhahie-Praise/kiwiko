"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { executionEvents } from "@/constants/index";
export type ExecutionType =
  | "github_commit"
  | "social_post"
  | "milestone"
  | "investor_view"
  | "investor_message"
  | "funding_event"
  | "product_release";

const ExecutionsHeatmap = () => {
  const EXECUTION_PRIORITY = [
    "github_commit",
    "product_release",
    "milestone",
    "funding_event",
    "investor_message",
    "investor_view",
    "social_post",
  ];

  return (
    <div className="w-full border border-zinc-200 rounded-2xl p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-500">
          Executions Heatmap
        </h3>
        <span className="text-xs text-zinc-500">
          Proof of execution over time
        </span>
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border border-zinc-200 p-3">
        <CalendarHeatmap
          startDate={new Date("2025-01-01")}
          endDate={new Date()}
          values={executionEvents}
          classForValue={(value) => {
            if (!value) return "color-empty";

            const dominantType = EXECUTION_PRIORITY.find((t) =>
              value.types.includes(t),
            );

            return dominantType ? `exec-${dominantType}` : "color-empty";
          }}
          tooltipDataAttrs={(value) => {
            if (!value || !Array.isArray(value.events)) {
              return { "data-tip": "" } as any;
            }

            return {
              "data-tip": `${value.count} executions:\n${value.events.join(", ")}`,
            } as any;
          }}
          showWeekdayLabels
        />
        <div className="absolute bottom-3 right-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Less</span>

            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-sm bg-gray-100 border" />
              <span className="w-3 h-3 rounded-sm bg-gray-200" />
              <span className="w-3 h-3 rounded-sm bg-gray-300" />
              <span className="w-3 h-3 rounded-sm bg-gray-500" />
              <span className="w-3 h-3 rounded-sm bg-black" />
            </div>

            <span>More</span>
          </div>{" "}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200" />

      {/* Table */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-700">Execution log</h4>

        <div className="divide-y divide-zinc-200">
          {[...executionEvents]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((item) => (
              <div
                key={item.date}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-zinc-900">{item.date}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.types.map((type) => (
                      <span
                        key={type}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-zinc-300 text-zinc-600"
                      >
                        {type.replace("_", " ")}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="text-xs text-zinc-600">
                  {item.count} activities
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionsHeatmap;
