import { recentActivity } from "@/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Activity = () => {
  // Only display the first 8 startups
  const displayedStartups = recentActivity.slice(0, 8);

  return (
    <section id="activity" className="w-full">
      {/* Header */}
      <div className="flex items-center justify-center mb-4">
        <div className="px-1.5 py-0.5 text-sm border-2 border-zinc-300 bg-zinc-300 text-black rounded-lg ">
          Recent Activity
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-4xl font-medium">Alots going down!</h2>
        <p className="text-zinc-500">Checkout startups that ship</p>
      </div>

      {/* Startup List */}
      <div className="mt-8 mx-20">
        {displayedStartups.map((startup, index) => (
          <Link href={startup.profileLink} key={index}>
            <div className="flex items-center justify-between py-4 px-8 border border-zinc-700 rounded-lg mb-4 hover:bg-zinc-600/5 transition-colors">
              <div className="flex items-center gap-4">
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium text-lg">{startup.name}</h3>
                  <p className="text-zinc-500">{startup.tagline}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {startup.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-[12px] px-2 py-1 bg-zinc-200 text-zinc-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-6">
                <div>
                  <p className="text-sm text-zinc-600">{startup.lastUpdate}</p>
                  <p className="text-sm font-medium text-black">
                    {startup.miniMetric}
                  </p>
                </div>
                <ChevronRight className="text-zinc-800" />
              </div>
            </div>
          </Link>
        ))}

        {/* See More Button */}
        {recentActivity.length > 8 && (
          <div className="flex justify-center mt-6">
            <Link
              href="/startups/all" // the full startups page
              className="text-black font-medium flex items-center gap-1 hover:underline"
            >
              <p className=""> See more</p>
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Activity;
