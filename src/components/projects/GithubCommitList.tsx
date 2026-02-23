import React, { useState, useEffect } from "react";
import { 
  GitCommit, 
  ChevronRight, 
  Terminal,
  User,
  ExternalLink,
  GitBranch,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getProjectGithubCommits } from "@/actions/github.actions";

interface GithubCommitListProps {
  repoFullName: string;
  connectedByUserId: string;
  initialCommits: any[];
  branches: any[];
}

const GithubCommitList = ({ 
  repoFullName, 
  connectedByUserId, 
  initialCommits, 
  branches 
}: GithubCommitListProps) => {
  const [currentBranch, setCurrentBranch] = useState(branches[0]?.name || "main");
  const [commits, setCommits] = useState(initialCommits);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchCommits = async (branch: string) => {
    setLoading(true);
    setCurrentBranch(branch);
    try {
      const result = await getProjectGithubCommits(repoFullName, connectedByUserId, branch);
      if (result.success) {
        setCommits(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch commits:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="relative mb-8">
        <div className="flex items-center gap-8 border-b border-zinc-100 overflow-x-auto no-scrollbar scroll-smooth">
          {branches.map((branch) => (
            <button
              key={branch.name}
              onClick={() => fetchCommits(branch.name)}
              className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative group whitespace-nowrap ${
                currentBranch === branch.name
                  ? "text-zinc-900 border-b-2 border-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <GitBranch size={14} className={currentBranch === branch.name ? "text-zinc-900" : "text-zinc-400"} />
                {branch.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 relative min-h-[100px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-[3rem]">
            <Loader2 className="animate-spin text-zinc-900" size={32} />
          </div>
        )}

        {commits.length === 0 ? (
          <div className="p-12 text-center bg-zinc-50 rounded-[3rem] border border-dashed border-zinc-200">
             <GitCommit size={32} className="mx-auto text-zinc-300 mb-4" />
             <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No commits found for this branch</p>
          </div>
        ) : (
          <div className="space-y-4">
            {commits.slice(0, visibleCount).map((commit: any) => (
              <div 
                key={commit.sha} 
                className="group p-5 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-300 transition-all flex items-start gap-4 shadow-sm hover:shadow-lg hover:shadow-zinc-100 overflow-hidden relative"
              >
                {/* Avatar — fixed size, never squishes */}
                <div className="shrink-0 w-9 h-9">
                    {commit.author?.avatar_url ? (
                        <img 
                          src={commit.author.avatar_url} 
                          alt={commit.commit.author.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-zinc-100"
                        />
                    ) : (
                        <div className="w-9 h-9 bg-zinc-100 text-zinc-400 rounded-xl flex items-center justify-center">
                            <User size={16} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-900 leading-snug mb-1 truncate">
                    {commit.commit.message.split('\n')[0]}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="text-zinc-600 capitalize">{commit.commit.author.name.toLowerCase()}</span>
                    <span>·</span>
                    <span className="lowercase">{formatDistanceToNow(new Date(commit.commit.author.date))} ago</span>
                  </div>
                </div>

                {/* SHA link */}
                <a 
                  href={commit.html_url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shrink-0 px-2.5 py-1.5 bg-zinc-50 text-zinc-400 rounded-lg text-[10px] font-mono hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-1.5 border border-zinc-100"
                >
                  {commit.sha.substring(0, 7)}
                  <ExternalLink size={9} />
                </a>
              </div>
            ))}

            {commits.length > 5 && (
              <div className="flex items-center justify-between pt-8 border-t border-zinc-100">
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
                          <Terminal size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Showing {Math.min(visibleCount, commits.length)} of {commits.length} proofs
                      </span>
                  </div>
                  <div className="flex gap-2">
                      {visibleCount < commits.length && (
                          <button 
                              onClick={() => setVisibleCount(v => v + 5)}
                              className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                          >
                              Load More
                          </button>
                      )}
                      {visibleCount > 5 && (
                          <button 
                              onClick={() => setVisibleCount(5)}
                              className="px-4 py-2 bg-zinc-50 text-zinc-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-95"
                          >
                              Collapse
                          </button>
                      )}
                  </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubCommitList;
