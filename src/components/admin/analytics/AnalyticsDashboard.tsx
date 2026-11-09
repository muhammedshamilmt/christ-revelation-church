'use client';

import React, { useState, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Users, Clock, Target,
  Calendar, Sparkles, BookOpen, Heart, ArrowUpRight,
  Filter, DollarSign, Activity, CheckCircle2
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { useTransactions } from '@/lib/useTransactions';
import { useEvents } from '@/lib/useEvents';
import { useAllRegistrations } from '@/lib/useRegistrations';
import { usePrayerRequests } from '@/lib/usePrayerRequests';
import { useAllBlogPosts } from '@/lib/useBlogPosts';

const chartConfig = {
  views: {
    label: "Total Giving",
  },
  emergency: {
    label: "Tithes & Offerings",
    color: "#0ea5e9",
  },
  general: {
    label: "Building & Missions",
    color: "#3b82f6",
  },
  all: {
    label: "Total Church Giving",
    color: "#10b981",
  },
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'Weekly' | 'Monthly' | 'Annual'>('Weekly');
  const [activeChart, setActiveChart] = useState<'emergency' | 'general' | 'all'>('emergency');
  
  const { transactions, isLoading: loadingTxns } = useTransactions();
  const { events, isLoading: loadingEvents } = useEvents();
  const { registrations, isLoading: loadingRegs } = useAllRegistrations();
  const { prayerRequests, isLoading: loadingPrayers } = usePrayerRequests();
  const { posts, isLoading: loadingPosts } = useAllBlogPosts();

  const isLoading = loadingTxns || loadingEvents || loadingRegs || loadingPrayers || loadingPosts;

  const {
    totalAmount,
    dailyAvg,
    salesData,
    segmentData,
    emergencyShare,
    uniqueDonorsCount,
    avgDonation,
    completedTxnCount,
  } = useMemo(() => {
    const list = transactions || [];
    let total = 0;
    let emergencyTotal = 0;
    let generalTotal = 0;
    const donorSet = new Set<string>();
    let completedCount = 0;

    const categoryMap = new Map<string, number>();

    list.forEach(txn => {
      const amount = typeof txn.rawAmount === 'number'
        ? txn.rawAmount
        : typeof txn.amount === 'string'
        ? parseFloat(txn.amount.replace(/[^0-9.-]+/g, ""))
        : txn.amount;
      const validAmount = amount || 0;
      total += validAmount;

      if (txn.name && !txn.isAnonymous) {
        donorSet.add(txn.name.toLowerCase());
      } else if (txn.email) {
        donorSet.add(txn.email.toLowerCase());
      }

      if (txn.status === 'Completed') {
        completedCount++;
      }

      const des = txn.designation || 'Tithe & Offering';
      categoryMap.set(des, (categoryMap.get(des) || 0) + validAmount);

      if (
        des.toLowerCase().includes('tithe') || 
        des.toLowerCase().includes('offering') ||
        des.toLowerCase().includes('emergency')
      ) {
        emergencyTotal += validAmount;
      } else {
        generalTotal += validAmount;
      }
    });

    // Time range grouping
    let computedSalesData: Array<{ name: string; emergency: number; general: number; all: number }> = [];

    if (timeRange === 'Weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const volumeMap = new Map<string, { emergency: number; general: number }>();
      days.forEach(d => volumeMap.set(d, { emergency: 0, general: 0 }));

      list.forEach(txn => {
        const d = new Date(txn.date || txn.created_at || Date.now());
        const dayName = days[d.getDay()];
        const amt = typeof txn.rawAmount === 'number' ? txn.rawAmount : parseFloat(String(txn.amount || '0').replace(/[^0-9.-]+/g, '')) || 0;
        const entry = volumeMap.get(dayName) || { emergency: 0, general: 0 };
        const des = (txn.designation || '').toLowerCase();
        if (des.includes('tithe') || des.includes('offering') || des.includes('emergency')) {
          entry.emergency += amt;
        } else {
          entry.general += amt;
        }
      });

      computedSalesData = days.map(d => {
        const item = volumeMap.get(d) || { emergency: 0, general: 0 };
        return {
          name: d,
          emergency: item.emergency,
          general: item.general,
          all: item.emergency + item.general,
        };
      });
    } else if (timeRange === 'Monthly') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const volumeMap = new Map<string, { emergency: number; general: number }>();
      weeks.forEach(w => volumeMap.set(w, { emergency: 0, general: 0 }));

      list.forEach(txn => {
        const d = new Date(txn.date || txn.created_at || Date.now());
        const dayOfMonth = d.getDate();
        const weekIndex = Math.min(3, Math.floor((dayOfMonth - 1) / 7));
        const weekName = weeks[weekIndex];
        const amt = typeof txn.rawAmount === 'number' ? txn.rawAmount : parseFloat(String(txn.amount || '0').replace(/[^0-9.-]+/g, '')) || 0;
        const entry = volumeMap.get(weekName) || { emergency: 0, general: 0 };
        const des = (txn.designation || '').toLowerCase();
        if (des.includes('tithe') || des.includes('offering') || des.includes('emergency')) {
          entry.emergency += amt;
        } else {
          entry.general += amt;
        }
      });

      computedSalesData = weeks.map(w => {
        const item = volumeMap.get(w) || { emergency: 0, general: 0 };
        return {
          name: w,
          emergency: item.emergency,
          general: item.general,
          all: item.emergency + item.general,
        };
      });
    } else {
      // Annual
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const volumeMap = new Map<string, { emergency: number; general: number }>();
      months.forEach(m => volumeMap.set(m, { emergency: 0, general: 0 }));

      list.forEach(txn => {
        const d = new Date(txn.date || txn.created_at || Date.now());
        const monthName = months[d.getMonth()];
        const amt = typeof txn.rawAmount === 'number' ? txn.rawAmount : parseFloat(String(txn.amount || '0').replace(/[^0-9.-]+/g, '')) || 0;
        const entry = volumeMap.get(monthName) || { emergency: 0, general: 0 };
        const des = (txn.designation || '').toLowerCase();
        if (des.includes('tithe') || des.includes('offering') || des.includes('emergency')) {
          entry.emergency += amt;
        } else {
          entry.general += amt;
        }
      });

      computedSalesData = months.map(m => {
        const item = volumeMap.get(m) || { emergency: 0, general: 0 };
        return {
          name: m,
          emergency: item.emergency,
          general: item.general,
          all: item.emergency + item.general,
        };
      });
    }

    // Dynamic segments
    const palette = ['#0ea5e9', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    let colorIdx = 0;
    const computedSegmentData: Array<{ name: string; value: number; color: string }> = [];

    categoryMap.forEach((val, key) => {
      computedSegmentData.push({
        name: key,
        value: val,
        color: palette[colorIdx % palette.length],
      });
      colorIdx++;
    });

    if (computedSegmentData.length === 0) {
      computedSegmentData.push(
        { name: 'Tithes & Offerings', value: 0, color: '#0ea5e9' },
        { name: 'Building & Missions', value: 0, color: '#3b82f6' }
      );
    }

    const computedEmergencyShare = total > 0 ? Math.round((emergencyTotal / total) * 100) : 0;
    const uniqueDonors = donorSet.size > 0 ? donorSet.size : list.length;

    return {
      totalAmount: total,
      dailyAvg: list.length > 0 ? total / 7 : 0,
      salesData: computedSalesData,
      segmentData: computedSegmentData,
      emergencyShare: computedEmergencyShare,
      uniqueDonorsCount: uniqueDonors,
      avgDonation: list.length > 0 ? total / list.length : 0,
      completedTxnCount: completedCount,
    };
  }, [transactions, timeRange]);

  const cardStyle = "bg-white border border-gray-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] p-6 lg:p-8";

  return (
    <div className="w-full flex flex-col gap-6 pt-2 pb-12">
      {/* Top Header & Overview Stats */}
      <div className={`${cardStyle}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Ministry Analytics & Intelligence
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Real-time church giving, donor retention, event engagement, and intercession metrics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-full self-start sm:self-auto">
            {(['Weekly', 'Monthly', 'Annual'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeRange(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  timeRange === tab 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div>
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Total Giving Volume</p>
            <div className="flex items-baseline gap-2.5">
              {isLoading && (transactions || []).length === 0 ? (
                <div className="h-8 w-28 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    £{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-1" /> +7.1%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Confirmed kingdom tithes & seeds</p>
          </div>

          {/* Stat 2 */}
          <div className="md:border-l md:border-gray-100 md:pl-6">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Average Contribution</p>
            <div className="flex items-baseline gap-2.5">
              {isLoading && (transactions || []).length === 0 ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    £{avgDonation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-1" /> +4%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Average per donation transaction</p>
          </div>

          {/* Stat 3 */}
          <div className="md:border-l md:border-gray-100 md:pl-6">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Active Donors</p>
            <div className="flex items-baseline gap-2.5">
              {isLoading && (transactions || []).length === 0 ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{uniqueDonorsCount}</h2>
                  <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Identified & anonymous partners</p>
          </div>

          {/* Stat 4 */}
          <div className="md:border-l md:border-gray-100 md:pl-6">
            <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fulfillment Rate</p>
            <div className="flex items-baseline gap-2.5">
              {isLoading && (transactions || []).length === 0 ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              ) : (
                <>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {transactions.length > 0 ? Math.round((completedTxnCount / transactions.length) * 100) : 100}%
                  </h2>
                  <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> High
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">{completedTxnCount} successful settlements</p>
          </div>
        </div>
      </div>

      {/* Main Volume Trend Chart */}
      <div className={`${cardStyle} flex flex-col gap-0 p-0 overflow-hidden`}>
        <div className="flex flex-col sm:flex-row border-b border-gray-100">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <h3 className="text-lg font-bold text-gray-900">Giving Flow & Allocation</h3>
            <p className="text-xs font-medium text-gray-500">
              Interactive timeline comparing fund designations across {timeRange.toLowerCase()} periods
            </p>
          </div>
          <div className="flex border-t border-gray-100 sm:border-t-0">
            {[
              { key: 'emergency', label: 'Tithes & Offerings' },
              { key: 'general', label: 'Building & Missions' },
              { key: 'all', label: 'All Funds' },
            ].map(({ key, label }) => {
              const isActive = activeChart === key;
              const total = salesData.reduce((acc, curr) => acc + (curr[key as keyof typeof curr] as number), 0);
              
              return (
                <button
                  key={key}
                  data-active={isActive}
                  className="flex flex-1 flex-col justify-center gap-1 border-l border-gray-100 px-5 py-4 text-left transition-colors hover:bg-gray-50 data-[active=true]:bg-gray-50/80 sm:px-6 sm:py-5"
                  onClick={() => setActiveChart(key as any)}
                >
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {label}
                  </span>
                  <span className="text-lg font-bold text-gray-900 sm:text-xl">
                    £{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[360px] w-full p-6 pt-8">
          <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
            <LineChart
              accessibilityLayer
              data={salesData}
              margin={{ top: 10, right: 15, left: 15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }} 
                tickMargin={12}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(val) => `£${val}`}
                orientation="right"
              />
              <ChartTooltip
                cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                content={
                  <ChartTooltipContent
                    className="w-[190px] bg-white border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-2xl p-3"
                    nameKey="views"
                  />
                }
              />
              <Line 
                dataKey={activeChart}
                type="monotone" 
                stroke={(chartConfig as any)[activeChart]?.color || "#0ea5e9"}
                strokeWidth={3}
                dot={{ r: 4, fill: (chartConfig as any)[activeChart]?.color || "#0ea5e9", strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: (chartConfig as any)[activeChart]?.color || "#0ea5e9", strokeWidth: 3, stroke: '#fff' }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Grid: Fund Breakdown & Community Reach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Fund Allocation Segments */}
        <div className={`${cardStyle} flex flex-col gap-6`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Donation Segments & Funds
              </h3>
              <span className="text-xs font-bold text-emerald-600">+5.8% growth</span>
            </div>
            <p className="text-xs text-gray-400 font-medium mb-6">
              Distribution of incoming tithes, building projects, and mission offerings
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-[140px] h-[140px] relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={segmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 w-full flex flex-col gap-3">
                {segmentData.map(segment => (
                  <div key={segment.name} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 truncate max-w-[200px]">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                      <span className="font-semibold text-gray-700 truncate">{segment.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-gray-900">
                        £{segment.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="font-medium text-gray-400 w-9 text-right text-xs">
                        {totalAmount > 0 ? Math.round((segment.value / totalAmount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full h-px border-b border-dashed border-gray-200" />

          {/* Emergency & Relief Share */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">Tithe & Relational Giving Share</span>
              <span className="text-xs font-bold text-[#0ea5e9]">{emergencyShare}% of overall giving</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#0ea5e9] rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(100, Math.max(0, emergencyShare))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Ministry Impact & Community Growth */}
        <div className={`${cardStyle} flex flex-col gap-6`}>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Church Ministry Reach & Engagement
            </h3>
            <p className="text-xs text-gray-400 font-medium mb-6">
              Dynamic tracking across community gatherings, intercession, and discipleship content
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Conferences & Events</span>
                  <Calendar className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingEvents ? '...' : events.length}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {loadingRegs ? '...' : `${registrations.length} registered guests`}
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Intercession</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingPrayers ? '...' : prayerRequests.length}
                </p>
                <p className="text-xs text-purple-600 font-medium mt-1">
                  {loadingPrayers ? '...' : `${prayerRequests.filter(p => p.status === 'Answered').length} answered`}
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Messages & Sermons</span>
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingPosts ? '...' : posts.length}
                </p>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  Live discipleship archive
                </p>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Donation Transactions</span>
                  <DollarSign className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingTxns ? '...' : transactions.length}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {completedTxnCount} completed
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  CRC
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Real-time Ministry Cloud Synchronization</p>
                  <p className="text-[11px] text-gray-500">Live Postgres database listeners active across all metrics</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
