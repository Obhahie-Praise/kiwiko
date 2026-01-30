"use client";

import { useState } from "react";
import {
  startups,
  niches,
  discoveryTabs,
  nicheIcons,
  StartupCategory,
  StartupNiche,
} from "@/constants";

import {
  Users,
  DollarSign,
  TrendingUp,
  FolderOpen,
} from "lucide-react";

export default function DiscoveryTabsFeed() {
  const [activeTab, setActiveTab] =
    useState<StartupCategory>("trending");

  const [activeNiche, setActiveNiche] =
    useState<StartupNiche | "All">("All");

  /* ---------- FILTER ---------- */
  const filtered = startups.filter((s) => {
    const tabMatch = s.category === activeTab;
    const nicheMatch =
      activeNiche === "All" || s.niche === activeNiche;

    return tabMatch && nicheMatch;
  });

  return (
    <div className="space-y-6 border-t-2 border-l-2 rounded-tl-2xl p-6">
      {/* ================= TABS ================= */}
      <div className="flex gap-2">
        {discoveryTabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition
              ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= SUB TABS ================= */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveNiche("All")}
          className={`px-3 py-1 rounded-lg text-xs
          ${
            activeNiche === "All"
              ? "bg-black text-white"
              : "bg-zinc-200"
          }`}
        >
          All
        </button>

        {niches.map((niche) => {
          const Icon = nicheIcons[niche];

          return (
            <button
              key={niche}
              onClick={() => setActiveNiche(niche)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs
              ${
                activeNiche === niche
                  ? "bg-black text-white"
                  : "bg-zinc-200"
              }`}
            >
              <Icon size={14} />
              {niche}
            </button>
          );
        })}
      </div>

      {/* ================= FEED ================= */}
      {filtered.length === 0 ? (
        /* ---------- EMPTY STATE ---------- */
        <div className="border rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <FolderOpen
            size={40}
            className="text-zinc-400 mb-3"
          />
          <p className="text-zinc-700 font-medium">
            Nothing to see here
          </p>
          <p className="text-sm text-zinc-500">
            No startups in this niche yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((s) => {
            const NicheIcon = nicheIcons[s.niche];

            return (
              <div
                key={s.id}
                className="border p-5 rounded-2xl hover:shadow-md hover:-translate-y-1 transition"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <NicheIcon size={16} />
                      {s.name}
                    </h3>

                    <p className="text-xs text-zinc-500 mt-1">
                      {s.niche}
                    </p>
                  </div>

                  <span className="text-xs bg-zinc-100 px-3 py-1 rounded-full">
                    {s.stage}
                  </span>
                </div>

                {/* DESC */}
                <p className="text-sm text-zinc-600 mt-3">
                  {s.desc}
                </p>

                {/* METRICS */}
                <div className="flex gap-6 mt-4 text-xs text-zinc-600">
                  <span className="flex items-center gap-1">
                    <DollarSign size={14} />
                    {s.funding}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {s.traction}
                  </span>

                  <span className="flex items-center gap-1">
                    <TrendingUp size={14} />
                    Growing
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
