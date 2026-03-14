"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminHeader, { AdminTab } from "@/components/waitlist/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import dynamic from "next/dynamic";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { 
  getWaitlistStatsAction, 
  getWaitlistEntriesAction, 
  getInvestorsAction,
  getAdminChartDataAction
} from "@/actions/admin.actions";
import { Loader2, Plus, Users, Landmark, Download } from "lucide-react";

const WaitlistTable = dynamic(() => import("@/components/admin/WaitlistTable"))
const InvestorList = dynamic(() => import("@/components/admin/InvestorList"))
const AddInvestorModal = dynamic(() => import("@/components/admin/AddInvestorModal"))
const PageViewsChart = dynamic(() => import("@/components/admin/PageViewsChart"))
const SourceRatioChart = dynamic(() => import("@/components/admin/SourceRatioChart"))
const SourceStatsChart = dynamic(() => import("@/components/admin/SourceStatsChart"))
import type { ChartPeriod } from "@/components/admin/SourceStatsChart";

interface WaitlistStats {
  total: number;
  views: number;
  recent: number;
  topSource: string;
}

interface WaitlistEntry {
  id: string;
  email: string;
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
  const [chartData, setChartData] = useState<any>(null);
  const [activePeriod, setActivePeriod] = useState<ChartPeriod>('Monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [isChartsLoading, setIsChartsLoading] = useState(false);
  const [isAddInvestorOpen, setIsAddInvestorOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, entriesData, investorsData, charts] = await Promise.all([
        getWaitlistStatsAction(),
        getWaitlistEntriesAction(),
        getInvestorsAction(),
        getAdminChartDataAction(activePeriod),
      ]);
      setStats(statsData);
      setEntries(entriesData);
      setInvestors(investorsData);
      setChartData(charts);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activePeriod]);

  const handlePeriodChange = async (period: ChartPeriod) => {
    setActivePeriod(period);
    setIsChartsLoading(true);
    try {
      const charts = await getAdminChartDataAction(period);
      setChartData(charts);
    } catch (error) {
      console.error("Failed to refetch chart data:", error);
    } finally {
      setIsChartsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <AdminAuthGuard>
      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          <AdminHeader currentTab={currentTab} onTabChange={setCurrentTab} />
          
          <div className="animate-in fade-in duration-700">
            {currentTab === "home" && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-zinc-100 text-xl font-semibold tracking-normal special-font">Waitlist Overview</h2>
                  {/* <div className="hidden sm:flex text-xs text-zinc-500 font-medium bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Live Metrics
                  </div> */}
                </div> 
                
                <AdminStats stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
                  <div className="lg:col-span-8">
                    <PageViewsChart data={chartData?.pageViewsData || []} />
                  </div>
                  <div className="lg:col-span-4">
                    <SourceRatioChart data={chartData?.sourceRatioData || []} />
                  </div>
                </div>

                <div className="mb-14 relative">
                  {isChartsLoading && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                      <Loader2 className="text-orange-500 animate-spin" size={24} />
                    </div>
                  )}
                  <SourceStatsChart 
                    data={chartData?.sourceStatsData || []} 
                    activePeriod={activePeriod}
                    onPeriodChange={handlePeriodChange}
                  />
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="text-orange-500 animate-spin" size={32} />
                    <p className="text-zinc-500 text-sm font-medium">Updating activity...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-zinc-200 text-xl font-semibold special-font mb-4 flex items-center gap-3">
                        {/* <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                          <Users size={16} />
                        </div> */}
                        Recent Signups
                      </h3>
                      <WaitlistTable entries={entries.slice(0, 5)} />
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 h-fit">
                        <h3 className="text-zinc-200 text-xl special-font font-semibold mb-4">Dashboard Actions</h3>
                        <div className="space-y-3">
                          <button className="w-full text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 py-2.5 rounded-xl transition-colors border border-zinc-700 flex items-center justify-center gap-2">
                            Export Waitlist CSV
                          </button>
                          <button 
                            onClick={() => setCurrentTab("users")}
                            className="w-full text-xs font-medium bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 py-2.5 rounded-xl transition-colors border border-orange-500/20"
                          >
                            View Full Waitlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {currentTab === "users" && (
              isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="text-orange-500 animate-spin" size={40} />
                  <p className="text-zinc-500 font-medium">Loading waitlist...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-zinc-100 text-2xl font-semibold tracking-wide special-font">Waitlist</h2>
                    <div className="flex gap-3">
                      <div className="text-white cursor-pointer hover:bg-orange-500/60 transition-colors flex items-center gap-3 py-2 px-5 text-sm rounded-lg border border-zinc-800 bg-orange-500/50">
                        <p className="">Export</p>
                        <Download size={18} strokeWidth={1.6} />
                      </div>
                      <div className="hidden sm:block bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-400">
                          {stats?.total || 0} total members
                      </div>
                    </div>
                  </div>
                  <WaitlistTable entries={entries} />
                </>
              )
            )}

            {currentTab === "investors" && (
              isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="text-orange-500 animate-spin" size={40} />
                  <p className="text-zinc-500 font-medium">Loading investors...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      {/* <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                        <Landmark size={20} />
                      </div> */}
                      <h2 className="text-zinc-100 text-2xl font-bold special-font">Investors</h2>
                    </div>
                    <button 
                      onClick={() => setIsAddInvestorOpen(true)}
                      className="bg-orange-500/50 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
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
              )
            )}

            {/* {currentTab === "settings" && (
              <div className="text-zinc-400 text-center py-20 bg-zinc-900/20 rounded-2xl border border-zinc-800/50">
                Settings coming soon...
              </div>
            )} */}
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
};

export default AdminPage;
