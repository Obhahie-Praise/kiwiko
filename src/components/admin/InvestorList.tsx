"use client";

import React from "react";
import { Briefcase, DollarSign, PieChart, Calendar, MoreVertical } from "lucide-react";

interface Investor {
  id: string;
  name: string;
  firm: string;
  amountInvested: number;
  percentageOwnership: number;
  onboardedAt: string;
}

interface InvestorListProps {
  investors: Investor[];
}

const InvestorList = ({ investors }: InvestorListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {investors.length > 0 ? (
        investors.map((investor) => (
          <div 
            key={investor.id}
            className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-zinc-500 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Briefcase size={22} />
              </div>
              <div>
                <h3 className="text-zinc-100 font-bold text-lg leading-none mb-1">{investor.name}</h3>
                <p className="text-zinc-500 text-sm font-medium">{investor.firm}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <DollarSign size={14} />
                  <span>Investment</span>
                </div>
                <span className="text-zinc-200 font-semibold">
                  ${investor.amountInvested.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <PieChart size={14} />
                  <span>Ownership</span>
                </div>
                <span className="text-zinc-200 font-semibold">
                  {investor.percentageOwnership}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar size={14} />
                  <span>Onboarded</span>
                </div>
                <span className="text-zinc-400">
                  {new Date(investor.onboardedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800/50">
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full" 
                  style={{ width: `${Math.min(investor.percentageOwnership * 2, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-20 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl text-center">
          <p className="text-zinc-500 italic">No investors registered yet.</p>
        </div>
      )}
    </div>
  );
};

export default InvestorList;
