'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { Search, Heart, CircleDollarSign, CheckCircle2, UserPlus, Star } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LatestUpdates() {
  const [tab, setTab] = useState('Today');
  const { data: transactions, isLoading } = useSWR<any[]>('/api/transactions', fetcher);

  const activities = (transactions || []).slice(0, 10).map((txn, idx) => {
    const parsedAmount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g,"")) : txn.amount;
    const currency = txn.currencySymbol || '$';
    
    // Choose an icon based on designation or status
    let icon = <Heart className="w-4 h-4 text-emerald-500" />;
    let iconBg = 'bg-emerald-50 border-emerald-100';
    
    if (txn.designation === 'Emergency Relief') {
      icon = <CheckCircle2 className="w-4 h-4 text-black" />;
      iconBg = 'bg-red-50 border-red-100';
    } else if (txn.designation === 'General Fund') {
      icon = <CircleDollarSign className="w-4 h-4 text-blue-500" />;
      iconBg = 'bg-blue-50 border-blue-100';
    }

    return {
      id: txn.id,
      title: 'New Donation Received',
      desc: `${txn.isAnonymous ? 'Anonymous' : txn.name} donated ${currency}${(parsedAmount || 0).toFixed(2)}`,
      time: new Date(txn.date || txn.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      icon,
      iconBg
    };
  });

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-50/50 p-1 rounded-full border border-gray-100 mb-4">
        {['Today', 'Yesterday', 'This week'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-[12px] font-semibold rounded-full transition-all ${tab === t ? 'bg-[#0ea5e9] text-white shadow-sm' : 'text-gray-500 hover:text-[#0ea5e9] hover:bg-gray-100'}`}
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
          placeholder="Search activities"
          className="w-full pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-full text-[13px] outline-none focus:ring-1 focus:ring-[#0ea5e9]/30 focus:border-[#0ea5e9] transition-shadow"
        />
      </div>

      <div className="text-[12px] font-medium text-gray-500 mb-4">
        <span className="font-bold text-[#0ea5e9]">{activities.length}</span> new activities {tab.toLowerCase()}
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
              <div className="flex flex-col gap-2 w-full pt-1">
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))
        ) : activities.map((activity, idx) => (
          <div key={activity.id} className="flex gap-3 group">
            {/* Timeline Line & Icon */}
            <div className="relative flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border ${activity.iconBg} flex items-center justify-center shrink-0 z-10`}>
                {activity.icon}
              </div>
              {idx !== activities.length - 1 && (
                <div className="w-px h-full bg-gray-100 absolute top-8 bottom-[-20px]"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 pb-1 pt-1.5">
              <div className="flex justify-between items-start mb-0.5">
                <span className="text-[13px] font-bold text-[#0ea5e9] leading-none">{activity.title}</span>
                <span className="text-[11px] font-medium text-gray-400">{activity.time}</span>
              </div>
              <span className="text-[12px] font-medium text-gray-500">{activity.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
