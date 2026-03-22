"use client";
import { ArrowRight, InboxIcon, Triangle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentCommitsAction } from "@/actions/github.actions";

const UpdatesUI = () => {
  const [isDroped, setIsDroped] = useState(false);
  const [commitData, setCommitData] = useState<{ date: string; commit_message: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isDroped && commitData.length === 0) {
      fetchCommits();
    }
  }, [isDroped]);

  const fetchCommits = async () => {
    setIsLoading(true);
    try {
      const data = await getRecentCommitsAction();
      setCommitData(data);
    } catch (error) {
      console.error("Failed to fetch commits");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative transition-all hidden md:inline">
      {!isDroped ? (
        <button
          onClick={() => setIsDroped(!isDroped)}
          className="text-zinc-200 bg-zinc-800/60 flex items-center gap-2 px-6 py-2 rounded-lg transition-all cursor-pointer"
        >
          <p className="">Updates</p>
          <InboxIcon size={14} strokeWidth={1.8} />
        </button>
      ) : (
        <div className="text-zinc-200 bg-neutral-900 relative flex items-center gap-2 p-3 rounded-lg transition-all">
          <X
            strokeWidth={1.8}
            size={18}
            onClick={() => setIsDroped(!isDroped)}
            className="cursor-pointer"
          />
          <Triangle
            size={14}
            fill="#171717"
            className="absolute -bottom-[10px] -z-10 left-1/2 -translate-x-1/2 rotate-180 text-neutral-900"
          />
        </div>
      )}

      {isDroped && (
        <div
          className={`absolute top-15 -left-80 w-90 h-fit bg-zinc-800/40 backdrop-blur-lg border border-zinc-800 rounded-xl py-5 px-4 overflow-hidden z-50`}
        >
          <div className="relative">
            <h3 className="text-zinc-200 flex items-center gap-3 rounded-lg text-xl pb-5">
              <InboxIcon
                size={25}
                strokeWidth={1.7}
                className="text-zinc-300"
              />
              <p className="special-font font-semibold tracking-wider">
                Updates
              </p>
            </h3>
            <ul className="space-y-3 relative pb-3 max-h-100 overflow-y-auto special-scroll-bar">
              {isLoading ? (
                  <p className="text-zinc-500 text-center py-10 font-medium">Loading updates...</p>
              ) : commitData.length > 0 ? (
                commitData.slice(0, 5).map((data, index) => {
                  return (
                    <li
                      key={index}
                      className="p-3 rounded-lg bg-neutral-800/50 backdrop-blur-md border border-neutral-700"
                    >
                      <p className="font-medium text-sm text-zinc-500">{data.date}</p>
                      <p className="text-zinc-300 text-xs">
                        {data.commit_message}
                      </p>
                    </li>
                  );
                })
              ) : (
                <p className="text-zinc-500 text-center py-10 font-medium">No updates found.</p>
              )}
            </ul>
            <button className="py-2 rounded-lg text-sm relative border border-zinc-900 bg-zinc-800 font-medium text-white w-full">
                <p className="">See All</p>
                <ArrowRight strokeWidth={1.4} size={20} className="top-1/2 -translate-y-1/2 right-4 absolute" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatesUI;

