"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminHeader, { AdminTab } from "@/components/waitlist/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import WaitlistTable from "@/components/admin/WaitlistTable";
import InvestorList from "@/components/admin/InvestorList";
import AddInvestorModal from "@/components/admin/AddInvestorModal";
import { 
  getWaitlistStatsAction, 
  getWaitlistEntriesAction, 
  getInvestorsAction 
} from "@/actions/admin.actions";
import { Loader2, Plus, Users, Landmark, Download } from "lucide-react";

interface WaitlistStats {
  total: number;
  verified: number;
  views: number;
  recent: number;
  topSource: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
  emailVerified: boolean;
  joinedAt: string;
  source: string;
}

interface Investor {
  id: string;
  name: string;
  firm: string;
  amountInvested: number;
  percentageOwnership: number;
  onboardedAt: string;
}

const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState<AdminTab>("home");
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddInvestorOpen, setIsAddInvestorOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, entriesData, investorsData] = await Promise.all([
        getWaitlistStatsAction(),
        getWaitlistEntriesAction(),
        getInvestorsAction(),
      ]);
      setStats(statsData);
      setEntries(entriesData);
      setInvestors(investorsData);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <AdminHeader currentTab={currentTab} onTabChange={setCurrentTab} />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="text-orange-500 animate-spin" size={40} />
            <p className="text-zinc-500 font-medium">Loading dashboard...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            {currentTab === "home" && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-zinc-100 text-2xl font-semibold tracking-normal special-font">Platform Overview</h2>
                  <div className="text-xs text-zinc-500 font-medium bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live Metrics
                  </div>
                </div>
                
                {stats && <AdminStats stats={stats} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-zinc-200 text-lg font-medium mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Users size={16} />
                      </div>
                      Recent Signups
                    </h3>
                    <WaitlistTable entries={entries.slice(0, 5)} />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 h-fit">
                      <h3 className="text-zinc-200 text-lg font-medium mb-4">Dashboard Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm py-2.5 rounded-xl transition-colors border border-zinc-700 flex items-center justify-center gap-2">
                          Export Waitlist CSV
                        </button>
                        <button 
                          onClick={() => setCurrentTab("users")}
                          className="w-full bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 text-sm py-2.5 rounded-xl transition-colors border border-orange-500/20"
                        >
                          View Full Waitlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentTab === "users" && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-zinc-100 text-2xl font-semibold tracking-wide special-font">Waitlist</h2>
                  <div className="flex gap-3">
                    <div className="text-white flex items-center gap-3 py-2 px-5 text-sm rounded-lg border border-zinc-800 bg-orange-500/50">
                      <p className="">Export</p>
                      <Download size={18} strokeWidth={1.4} />
                    </div>
                     <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-400">
                        {stats?.total || 0} total members
                     </div>
                  </div>
                </div>
                <WaitlistTable entries={entries} />
              </>
            )}

            {currentTab === "investors" && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                      <Landmark size={20} />
                    </div>
                    <h2 className="text-zinc-100 text-2xl font-bold special-font">Investors</h2>
                  </div>
                  <button 
                    onClick={() => setIsAddInvestorOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
                  >
                    <Plus size={18} />
                    Add New Investor
                  </button>
                </div>
                
                <InvestorList investors={investors} />
                
                {isAddInvestorOpen && (
                  <AddInvestorModal 
                    onClose={() => setIsAddInvestorOpen(false)}
                    onSuccess={fetchData}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
