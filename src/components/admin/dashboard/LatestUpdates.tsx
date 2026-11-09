'use client';

import React, { useState, useMemo } from 'react';
import { Search, Heart, CircleDollarSign, CheckCircle2, UserPlus, Sparkles, Calendar } from 'lucide-react';
import { useTransactions } from '@/lib/useTransactions';
import { useAllRegistrations } from '@/lib/useRegistrations';
import { usePrayerRequests } from '@/lib/usePrayerRequests';

export default function LatestUpdates() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const { transactions, isLoading: loadingTxns } = useTransactions();
  const { registrations, isLoading: loadingRegs } = useAllRegistrations();
  const { prayerRequests, isLoading: loadingPrayers } = usePrayerRequests();

  const isLoading = loadingTxns || loadingRegs || loadingPrayers;

  const activities = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      desc: string;
      timestamp: number;
      time: string;
      icon: React.ReactNode;
      iconBg: string;
      type: 'donation' | 'registration' | 'prayer';
    }> = [];

    // Donations
    (transactions || []).forEach(txn => {
      const parsedAmount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g, "")) : txn.amount;
      const currency = txn.currencySymbol || '£';
      const d = new Date(txn.date || txn.created_at || Date.now());

      let icon = <Heart className="w-4 h-4 text-emerald-500" />;
      let iconBg = 'bg-emerald-50 border-emerald-100';

      if (txn.designation === 'Emergency Relief') {
        icon = <CheckCircle2 className="w-4 h-4 text-rose-500" />;
        iconBg = 'bg-rose-50 border-rose-100';
      } else if (txn.designation?.includes('Building')) {
        icon = <CircleDollarSign className="w-4 h-4 text-amber-500" />;
        iconBg = 'bg-amber-50 border-amber-100';
      }

      list.push({
        id: `txn-${txn.id}`,
        title: 'New Donation Received',
        desc: `${txn.isAnonymous ? 'Anonymous' : txn.name} contributed ${currency}${(parsedAmount || 0).toFixed(2)} to ${txn.designation || 'Ministry'}`,
        timestamp: d.getTime(),
        time: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        icon,
        iconBg,
        type: 'donation',
      });
    });

    // Registrations
    (registrations || []).forEach(reg => {
      const d = new Date(reg.appliedAt || Date.now());
      list.push({
        id: `reg-${reg._id}`,
        title: 'Event Registration',
        desc: `${reg.name} registered for an upcoming church gathering (${reg.guests || 1} guest${reg.guests === '1' ? '' : 's'})`,
        timestamp: d.getTime(),
        time: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        icon: <UserPlus className="w-4 h-4 text-blue-500" />,
        iconBg: 'bg-blue-50 border-blue-100',
        type: 'registration',
      });
    });

    // Prayer Requests
    (prayerRequests || []).forEach(pr => {
      const d = new Date(pr.createdAt || Date.now());
      list.push({
        id: `pr-${pr.id}`,
        title: 'Prayer Intercession',
        desc: `${pr.firstName} ${pr.lastName} requested prayer for "${pr.category || 'General'}"`,
        timestamp: d.getTime(),
        time: d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        icon: <Sparkles className="w-4 h-4 text-purple-500" />,
        iconBg: 'bg-purple-50 border-purple-100',
        type: 'prayer',
      });
    });

    // Sort descending by timestamp
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [transactions, registrations, prayerRequests]);

  const filteredActivities = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    return activities.filter(act => {
      // Tab filter
      if (tab === 'Today') {
        if (now - act.timestamp > oneDay) return false;
      } else if (tab === 'This week') {
        if (now - act.timestamp > sevenDays) return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          act.title.toLowerCase().includes(q) ||
          act.desc.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [activities, tab, search]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100 mb-4">
        {['All', 'Today', 'This week'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-[12px] font-semibold rounded-full transition-all ${
              tab === t ? 'bg-[#0ea5e9] text-white shadow-sm' : 'text-gray-500 hover:text-[#0ea5e9] hover:bg-gray-100'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search activities & prayers"
          className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 focus:border-[#0ea5e9] transition-shadow"
        />
      </div>

      <div className="text-[12px] font-medium text-gray-500 mb-4">
        <span className="font-bold text-[#0ea5e9]">{filteredActivities.length}</span> live church updates {tab !== 'All' ? tab.toLowerCase() : ''}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-5 max-h-[380px]">
        {isLoading && activities.length === 0 ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
              <div className="flex flex-col gap-2 w-full pt-1">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-xs">
            No activities recorded for this period.
          </div>
        ) : (
          filteredActivities.slice(0, 10).map((activity, idx) => (
            <div key={activity.id} className="flex gap-3 group">
              {/* Timeline Line & Icon */}
              <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border ${activity.iconBg} flex items-center justify-center shrink-0 z-10`}>
                  {activity.icon}
                </div>
                {idx !== Math.min(filteredActivities.length, 10) - 1 && (
                  <div className="w-px h-full bg-gray-100 absolute top-8 bottom-[-20px]"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 pb-1 pt-1.5">
                <div className="flex justify-between items-start mb-0.5">
                  <span className="text-[13px] font-bold text-gray-900 leading-none">{activity.title}</span>
                  <span className="text-[11px] font-medium text-gray-400">{activity.time}</span>
                </div>
                <span className="text-[12px] font-medium text-gray-500 line-clamp-2">{activity.desc}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
