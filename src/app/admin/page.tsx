'use client';
import React, { useMemo } from 'react';
import useSWR from 'swr';
import { Bell, Settings as SettingsIcon, LayoutGrid, Zap, Activity, Heart, DollarSign } from 'lucide-react';
import StatCard from '@/components/admin/dashboard/StatCard';
import VolumeChart from '@/components/admin/dashboard/VolumeChart';
import LatestUpdates from '@/components/admin/dashboard/LatestUpdates';
import MonitoringTable from '@/components/admin/dashboard/MonitoringTable';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboardPage() {
  const { data: transactions, isLoading } = useSWR<any[]>('/api/transactions', fetcher);

  const { totalDonations, totalRaised, avgDonation } = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) {
      return { totalDonations: 0, totalRaised: 0, avgDonation: 0 };
    }
    const count = transactions.length;
    let sum = 0;
    transactions.forEach(txn => {
      const amount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g, "")) : txn.amount;
      sum += (amount || 0);
    });
    return {
      totalDonations: count,
      totalRaised: sum,
      avgDonation: count > 0 ? sum / count : 0
    };
  }, [transactions]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Header */}
      {/* <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Overview</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header> */}

      {/* Main Content */}
      <div className="p-8 flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-[26px] font-bold text-gray-900 flex items-center gap-2 tracking-tight">
              Welcome back, Pastor David <span className="text-2xl animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-gray-500 text-[14px] mt-1.5 font-medium">
              Here are the latest ministry insights, tithes, campaigns, and church community activity.
            </p>
          </div>

          <div className="flex items-center border border-gray-200 bg-white rounded-full px-3 py-2  text-[13px] font-semibold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-gray-400 mr-2">📅</span>
            Last week
            <svg className="w-3.5 h-3.5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Total Raised"
                value={`£${totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                percentage="7.1%"
                isPositive={true}
                icon={<DollarSign className="w-4 h-4" />}
                data={[20, 35, 25, 45, 30, 60, 50]}
              />
              <StatCard
                title="Total Donations"
                value={totalDonations.toString()}
                percentage="2%"
                isPositive={true}
                icon={<Heart className="w-4 h-4" />}
                data={[10, 20, 15, 30, 25, 40, 35]}
              />
              <StatCard
                title="Average Donation"
                value={`£${avgDonation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                percentage="5%"
                isPositive={true}
                icon={<Activity className="w-4 h-4" />}
                data={[95, 96, 94, 95, 93, 91, 92]}
              />
            </div>

            {/* Chart Area */}
            <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

              <div className="flex justify-between items-center px-3 pt-2 pb-3">
                <h3 className="text-[14px] font-semibold text-gray-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  Giving & Tithes Trend
                </h3>
                <div className="flex items-center border border-gray-200 bg-white rounded-full px-2 py-1  text-[12px] font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors">
                  Last week
                  <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="bg-white rounded-[14px] h-[360px] p-6 flex flex-col shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
                <p className="text-[32px] font-bold text-gray-900 mt-2 leading-none">£{totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[13px] text-emerald-500 font-semibold ml-2">+8% vs last week</span></p>
                <div className="flex-1 mt-4">
                  <VolumeChart />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Latest Updates */}
            <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col h-full min-h-[500px]"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

              <div className="flex items-center justify-between px-3 pt-2 pb-3">
                <h3 className="text-[14px] font-semibold text-gray-600">Latest Updates</h3>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>

              <div className="bg-white rounded-[14px] h-full p-4 flex flex-col shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
                <div className="flex-1">
                  <LatestUpdates />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitoring Table */}
        <div className="w-full mb-10">
          <MonitoringTable />
        </div>

      </div>
    </div>
  );
}

// Simple internal icon for tickets
function TicketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
