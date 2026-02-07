import React from "react";
import { UsersRound, Settings2, ShieldCheck } from "lucide-react";

const TeamsBasePage = () => {
  return (
    <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-zinc-100 rounded-3xl flex items-center justify-center mb-8 text-zinc-400">
        <UsersRound size={40} />
      </div>
      
      <h1 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
        Manage your team's workings
      </h1>
      
      <p className="text-zinc-500 max-w-lg mb-12 text-lg leading-relaxed font-medium">
        Coordinate your founding team, manage active tasks, and track high-signal contributions all in one unified workspace.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left hover:border-zinc-300 transition-colors">
          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-600 mb-4">
            <UsersRound size={20} />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Founding Team</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Manage members, roles, and project permissions.</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left hover:border-zinc-300 transition-colors">
          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-600 mb-4">
            <Settings2 size={20} />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Task Pipeline</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Keep track of what's being shipped and what's next.</p>
        </div>

        <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm text-left hover:border-zinc-300 transition-colors">
          <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-600 mb-4">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-zinc-900 mb-1">Contributions</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Visualize ownership and impact across the venture.</p>
        </div>
      </div>
    </div>
  );
};

export default TeamsBasePage;
