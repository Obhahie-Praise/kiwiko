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

      <div className="space-y-4 relative min-h-[400px]">
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
          commits.map((commit: any) => (
            <div 
              key={commit.sha} 
              className="group p-6 bg-white border border-zinc-100 rounded-3xl hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-xl hover:shadow-zinc-100 overflow-hidden relative"
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className="relative">
                    {commit.author?.avatar_url ? (
                        <img 
                          src={commit.author.avatar_url} 
                          alt={commit.commit.author.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-100 group-hover:border-zinc-900 transition-colors"
                        />
                    ) : (
                        <div className="p-3 bg-zinc-50 text-zinc-400 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
                            <User size={20} />
                        </div>
                    )}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 leading-tight mb-1 group-hover:text-zinc-900 transition-colors">
                    {commit.commit.message.split('\n')[0]}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span className="text-zinc-900">{commit.commit.author.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(commit.commit.author.date))} ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 md:mt-0 relative z-10">
                <a 
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-zinc-50 text-zinc-500 rounded-lg text-[10px] font-mono hover:bg-zinc-900 hover:text-white transition-all flex items-center gap-2 border border-zinc-100"
                >
                  {commit.sha.substring(0, 7)}
                  <ExternalLink size={10} />
                </a>
                <ChevronRight size={16} className="text-zinc-300 group-hover:text-zinc-900 transition-colors hidden md:block" />
              </div>

              {/* Background Decoration */}
              <div className="absolute right-0 top-0 h-full w-32 bg-linear-to-l from-zinc-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GithubCommitList;
