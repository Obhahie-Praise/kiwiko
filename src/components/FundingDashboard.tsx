"use client";

import { useState } from "react";
import { X, Plus, AlertTriangle, Banknote, Users, Globe } from "lucide-react";
import { FundingLineChart } from "./FundingLineChart";
import { InvestorPieChart } from "./FundingPieChart";

export default function FundingDashboard() {
  const [showStart, setShowStart] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  // mock data
  const raised = 42000;
  const goal = 50000;
  const percent = (raised / goal) * 100;

  const goalMet = raised >= goal;
  /* -------------------- */
  /* FUNDING METRICS */
  /* -------------------- */

  const metrics = [
    {
      label: "Total Raised",
      value: "$128,000",
      sub: "All-time",
      icon: Banknote,
      positive: true,
    },
    {
      label: "Investors",
      value: "34",
      sub: "Across rounds",
      icon: Users,
      positive: true,
    },
    {
      label: "Avg Ticket",
      value: "$3,764",
      sub: "Per investor",
      icon: Banknote,
      positive: true,
    },
    {
      label: "Funding Type",
      value: "Public",
      sub: "Open to everyone",
      icon: Globe,
      positive: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-6 bg-zinc-50">
        {/*
      <div>
        <h1 className="text-2xl font-semibold">Funding Control</h1>
        <p className="text-zinc-500 text-sm">
          Monitor and manage your fundraising
        </p>
      </div> */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-white border-[0.1px] border-zinc-200 rounded-2xl p-5 flex flex-col justify-between min-h-[110px] relative overflow-hidden shadow-none hover:shadow-md transition-shadow"
          >
            {/* Top row: label + icon */}
            <div className="flex items-start justify-between">
                <p className="text-sm text-zinc-600 font-medium tracking-wider hero-font">{m.label}</p>
                <div className="p-1.5 bg-zinc-100 rounded-lg border border-zinc-100">
                <m.icon className="w-3.5 h-3.5 text-zinc-500" strokeWidth={1.5} />
                </div>
            </div>

            {/* Bottom row: value + change pill */}
            <div className="flex items-end justify-between mt-4">
                <p className="text-2xl font-bold hero-font text-zinc-900 tracking-tight">{m.value}</p>
                <div className="flex items-center gap-1.5 text-right">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    m.positive
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}>
                    {m.sub}
                </span>
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6 mt-6">
  <FundingLineChart />
  <InvestorPieChart />
</div>
      {/* ACTIVE ROUND */}
      <div className="border rounded-2xl p-5 space-y-4">
        <div className="flex justify-between">
          <h3 className="font-medium">Active Round</h3>
          <span className="text-xs bg-black text-white px-2 py-1 rounded">
            Live
          </span>
        </div>

        {/* progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <p>${raised.toLocaleString()}</p>
            <p>${goal.toLocaleString()}</p>
          </div>

          <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div style={{ width: `${percent}%` }} className="h-full bg-black rounded-full" />
          </div>

          <p className="text-xs text-zinc-500">{percent.toFixed(1)}% funded</p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-3">
          <button
            onClick={() => setShowStart(true)}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Start New Round
          </button>

          {goalMet ? (
            <button className="px-4 py-2 border rounded-lg text-sm">
              End Round
            </button>
          ) : (
            <button
              onClick={() => setShowCancel(true)}
              className="px-4 py-2 border border-red-400 text-red-500 rounded-lg text-sm"
            >
              Cancel Round
            </button>
          )}
        </div>
      </div>
      {/* HISTORY */}
      <div className="border rounded-2xl p-5">
        <h3 className="font-medium mb-4">Funding History</h3>

        <div className="text-sm text-zinc-600">No past rounds yet</div>
      </div>
      {/* START MODAL */}
      {showStart && (
        <Modal onClose={() => setShowStart(false)} title="Start Funding Round">
          <input placeholder="Goal Amount ($)" className="input" />
          <input placeholder="Equity (%)" className="input" />
          <input placeholder="Minimum Ticket ($)" className="input" />
          <select className="input">
            <option>Public Funding</option>
            <option>Serious Investors Only</option>
          </select>

          <textarea placeholder="Pitch note" className="input h-24" />

          <button className="btn-primary">Launch Round</button>
        </Modal>
      )}
      {/* CANCEL MODAL */}
      {showCancel && (
        <Modal onClose={() => setShowCancel(false)} title="Cancel Round">
          <div className="flex gap-2 text-red-500 text-sm items-center">
            <AlertTriangle size={16} />
            Explain why you're canceling
          </div>

          <textarea placeholder="Reason..." className="input h-28" />

          <button className="btn-danger">Confirm Cancel</button>
        </Modal>
      )}
    </div>
  );
}

/* -------------------- */
/* REUSABLE MODAL */
/* -------------------- */

function Modal({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-105 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{title}</h3>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        {children}
      </div>
    </div>
  );
}
