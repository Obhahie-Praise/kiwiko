/* "use client";

import { useMemo, useState } from "react";
import DiscoverTabs from "./DiscoverTabs";
import StartupGrid from "./StartupGrid";

const DiscoverClient = ({ startups }: { startups: any[] }) => {
  const tabs = [
    { key: "all", label: "All" },
    { key: "funded", label: "Funded" },
    { key: "popular", label: "Popular" },
  ];

  const DiscoverTabs = ({ active, onChange }: any) => {
  return (
    <div className="flex gap-2 border-b border-zinc-200">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium transition
            ${
              active === tab.key
                ? "border-b-2 border-black text-black"
                : "text-zinc-500 hover:text-black"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};


  const [activeTab, setActiveTab] = useState<"all" | "funded" | "popular">(
    "all",
  );

  const filteredStartups = useMemo(() => {
    switch (activeTab) {
      case "funded":
        return startups.filter((s) => s.fundingAmount > 0);
      case "popular":
        return startups.filter((s) => s.views > 100);
      default:
        return startups;
    }
  }, [activeTab, startups]);

  return (
    <div className="space-y-5">
      <DiscoverTabs active={activeTab} onChange={setActiveTab} />
      <StartupGrid startups={filteredStartups} />
    </div>
  );
};

export default DiscoverClient;
 */