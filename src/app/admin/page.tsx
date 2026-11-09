'use client';

import React, { useMemo, useState } from 'react';
import { 
  DollarSign, Heart, Activity, Calendar, Users, 
  Sparkles, BookOpen, Image as ImageIcon, ArrowUpRight, 
  TrendingUp, Clock
} from 'lucide-react';
import Link from 'next/link';

import StatCard from '@/components/admin/dashboard/StatCard';
import VolumeChart from '@/components/admin/dashboard/VolumeChart';
import LatestUpdates from '@/components/admin/dashboard/LatestUpdates';
import MonitoringTable from '@/components/admin/dashboard/MonitoringTable';

import { useTransactions } from '@/lib/useTransactions';
import { useEvents } from '@/lib/useEvents';
import { useAllRegistrations } from '@/lib/useRegistrations';
import { usePrayerRequests } from '@/lib/usePrayerRequests';
import { useAllBlogPosts } from '@/lib/useBlogPosts';
import { useGallery } from '@/lib/useGallery';

export default function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = useState<'All' | 'Month' | 'Week'>('All');

  const { transactions, isLoading: loadingTxns } = useTransactions();
  const { events, isLoading: loadingEvents } = useEvents();
  const { registrations, isLoading: loadingRegs } = useAllRegistrations();
  const { prayerRequests, isLoading: loadingPrayers } = usePrayerRequests();
  const { posts, isLoading: loadingPosts } = useAllBlogPosts();
  const { items: galleryItems, isLoading: loadingGallery } = useGallery();

  const { totalDonations, totalRaised, avgDonation, recentDonationsGrowth } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { totalDonations: 0, totalRaised: 0, avgDonation: 0, recentDonationsGrowth: 0 };
    }
    const count = transactions.length;
    let sum = 0;
    transactions.forEach(txn => {
      const amount = typeof txn.rawAmount === 'number'
        ? txn.rawAmount
        : typeof txn.amount === 'string'
        ? parseFloat(txn.amount.replace(/[^0-9.-]+/g, ""))
        : txn.amount;
      sum += (amount || 0);
    });

    return {
      totalDonations: count,
      totalRaised: sum,
      avgDonation: count > 0 ? sum / count : 0,
      recentDonationsGrowth: 7.1,
    };
  }, [transactions]);

  const upcomingEventsCount = useMemo(() => {
    return (events || []).filter(e => e.status === 'Upcoming' || e.status === 'Open').length;
  }, [events]);

  const pendingPrayerCount = useMemo(() => {
    return (prayerRequests || []).filter(p => p.status === 'New' || p.status === 'Praying').length;
  }, [prayerRequests]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      <div className="p-6 md:p-8 flex-1 max-w-[1600px] w-full mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 flex items-center gap-2.5 tracking-tight">
              Welcome back, Pastor David <span className="text-2xl animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">
              Live ministry overview, kingdom giving, upcoming conferences, and community prayer activity.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-full p-1 shadow-xs self-start md:self-auto">
            {(['All', 'Month', 'Week'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeFilter(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  timeFilter === tab 
                    ? 'bg-[#0ea5e9] text-white shadow-xs' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab === 'All' ? 'All Time' : tab === 'Month' ? 'This Month' : 'This Week'}
              </button>
            ))}
          </div>
        </div>

        {/* Ministry Pulse Summary Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/admin/events"
            className="group bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-4 transition-all hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Upcoming Events</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {loadingEvents ? '...' : upcomingEventsCount}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
              {loadingRegs ? '...' : `${registrations.length} registered`} →
            </span>
          </Link>

          <Link
            href="/admin/prayer-requests"
            className="group bg-white border border-gray-100 hover:border-purple-200 rounded-2xl p-4 transition-all hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Prayer Requests</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {loadingPrayers ? '...' : prayerRequests.length}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-purple-600 font-semibold">
              {loadingPrayers ? '...' : `${pendingPrayerCount} active`} →
            </span>
          </Link>

          <Link
            href="/admin/blog"
            className="group bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl p-4 transition-all hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Sermons & Insights</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {loadingPosts ? '...' : posts.length}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-emerald-600 transition-colors">
              Manage →
            </span>
          </Link>

          <Link
            href="/admin/gallery"
            className="group bg-white border border-gray-100 hover:border-amber-200 rounded-2xl p-4 transition-all hover:shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Gallery Media</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">
                  {loadingGallery ? '...' : galleryItems.length}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-amber-600 transition-colors">
              Archive →
            </span>
          </Link>
        </div>

        {/* Main Grid: Charts & Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Total Raised"
                value={`£${totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                percentage={`${recentDonationsGrowth}%`}
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
            <div 
              className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}
            >
              <div className="flex justify-between items-center px-3 pt-2 pb-3">
                <h3 className="text-[14px] font-semibold text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0ea5e9]" />
                  Giving & Tithes Volume
                </h3>
                <Link
                  href="/admin/analytics"
                  className="text-xs font-semibold text-[#0ea5e9] hover:underline flex items-center gap-1"
                >
                  Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white rounded-[14px] h-[360px] p-6 flex flex-col shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 leading-none">
                      £{totalRaised.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +{recentDonationsGrowth}% live church contribution trend
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">Last 7 Days</span>
                </div>
                <div className="flex-1 mt-4">
                  <VolumeChart />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Ministry Timeline */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full flex flex-col h-full min-h-[500px]"
              style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}
            >
              <div className="flex items-center justify-between px-3 pt-2 pb-3">
                <h3 className="text-[14px] font-semibold text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  Live Church Activity
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Realtime
                </span>
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
