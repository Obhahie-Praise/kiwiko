import React from "react";
import { 
  Star, 
  GitBranch, 
  GitCommit, 
  Calendar, 
  ExternalLink,
  Globe,
  Github,
  ShieldCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GithubRepoStatsProps {
  repoData: any;
  branchCount: number;
}

const GithubRepoStats = ({ repoData, branchCount }: GithubRepoStatsProps) => {
  if (!repoData) return null;

  const createdAt = new Date(repoData.created_at);
  const deploymentLink = repoData.homepage;
  
  // Detect deployment platform
  let platform = "Cloud";
  if (deploymentLink) {
    if (deploymentLink.includes("vercel.app")) platform = "Vercel";
    else if (deploymentLink.includes("netlify.app")) platform = "Netlify";
    else if (deploymentLink.includes("railway.app")) platform = "Railway";
    else if (deploymentLink.includes("github.io")) platform = "GitHub Pages";
  }

  return (
    <div className="mb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-zinc-900 text-white rounded-lg">
                <Github size={20} />
             </div>
             <a 
               href={repoData.html_url} 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-2xl font-black text-zinc-900 tracking-tighter hover:underline flex items-center gap-2"
             >
               {repoData.full_name}
               <ExternalLink size={14} className="text-zinc-400" />
             </a>
          </div>
          
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>Created {formatDistanceToNow(createdAt)} ago</span>
            </div>
            {deploymentLink && (
              <a 
                href={deploymentLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-zinc-900 hover:text-blue-600 transition-colors"
              >
                <div className="w-4 h-4 rounded-full bg-zinc-900 flex items-center justify-center">
                  <Globe size={10} className="text-white" />
                </div>
                <span>{platform} Deployment</span>
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Star size={10} /> Stars
            </span>
            <span className="text-lg font-black tracking-tighter">{repoData.stargazers_count}</span>
          </div>
          <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <GitBranch size={10} /> Branches
            </span>
            <span className="text-lg font-black tracking-tighter">{branchCount}</span>
          </div>
          <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <GitCommit size={10} /> Commits
            </span>
            <span className="text-lg font-black tracking-tighter">{repoData.total_commits || 0}</span>
          </div>
          <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1">
              <ShieldCheck size={10} /> Status
            </span>
            <span className="text-lg font-black tracking-tighter text-emerald-600">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubRepoStats;
