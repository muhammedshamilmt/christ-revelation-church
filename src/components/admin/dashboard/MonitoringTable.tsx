'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, Check, Circle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useTransactions } from '@/lib/useTransactions';

export default function MonitoringTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Attention' | 'Completed'>('All');

  const { transactions, isLoading } = useTransactions();

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(txn => {
      if (statusFilter === 'Attention') {
        if (txn.status === 'Completed') return false;
      } else if (statusFilter === 'Completed') {
        if (txn.status !== 'Completed') return false;
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          txn.id.toLowerCase().includes(q) ||
          txn.name.toLowerCase().includes(q) ||
          txn.designation.toLowerCase().includes(q) ||
          txn.status.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [transactions, statusFilter, search]);

  return (
    <div className="w-full flex flex-col h-full rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

      {/* Header Actions (Outer Grey Area) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-2 pb-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[15px] font-semibold text-gray-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            Transaction Monitoring
          </h3>
          <div className="flex items-center bg-gray-200/60 p-0.5 rounded-full text-xs font-semibold">
            {(['All', 'Attention', 'Completed'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-full transition-all ${
                  statusFilter === tab 
                    ? 'bg-white text-gray-900 shadow-xs' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab === 'Attention' ? 'Needs Attention' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search donor or ID..."
              className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-full text-[13px] outline-none w-56 focus:ring-1 focus:ring-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Table (Inner White Area) */}
      <div className="bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex-1">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="py-4 pl-6 pr-2 font-medium text-gray-400 text-[12px] w-10">
                  <div className="w-[18px] h-[18px] rounded-md border border-gray-200 bg-gray-50"></div>
                </th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">ID</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Donor</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Amount</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Designation</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Status</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (transactions || []).length === 0 ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-50/80 bg-white animate-pulse">
                    <td className="py-3.5 pl-6 pr-2"><div className="w-[18px] h-[18px] bg-gray-200 rounded-md"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredTransactions.map((txn) => {
                const parsedAmount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g,"")) : (txn.rawAmount || txn.amount);
                const currency = txn.currencySymbol || '£';
                const isFailed = txn.status === 'Failed';
                const isPending = txn.status === 'Pending';
                const statusIcon = isFailed 
                  ? <XCircle className="w-4 h-4 text-red-500" /> 
                  : isPending 
                  ? <Circle className="w-4 h-4 text-amber-500" />
                  : <CheckCircle2 className="w-4 h-4 text-emerald-500" />;

                return (
                  <tr key={txn.id} className="border-b border-gray-50/80 hover:bg-gray-50/50 transition-colors group bg-white">
                    <td className="py-3.5 pl-6 pr-2">
                      <div
                        onClick={() => toggleSelect(txn.id)}
                        className={`w-[18px] h-[18px] rounded-md border cursor-pointer flex items-center justify-center transition-colors ${selected.includes(txn.id) ? 'bg-[#0ea5e9] border-[#0ea5e9]' : 'border-gray-200 bg-gray-50'}`}
                      >
                        {selected.includes(txn.id) && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-500">{txn.id.substring(0,8).toUpperCase()}</td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-black">{txn.isAnonymous ? 'Anonymous' : txn.name}</td>
                    <td className="py-3.5 px-4 text-[13px] font-bold text-gray-900">
                      {currency}{(parsedAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-700">
                      {txn.designation}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-600">
                      <div className="flex items-center gap-1.5">
                        {statusIcon}
                        <span>{txn.status}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-500">
                      {new Date(txn.date || txn.created_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                );
              })}

              {!isLoading && filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[13px] text-gray-500 font-medium">
                    No transactions match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
