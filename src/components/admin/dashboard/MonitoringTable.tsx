'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { Search, Filter, MoreVertical, Check, Circle, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MonitoringTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const { data: transactions, isLoading } = useSWR<any[]>('/api/transactions', fetcher);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const actionableTransactions = (transactions || []).filter(t => t.status !== 'Completed');

  return (
    <div className="w-full flex flex-col h-full rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
      style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

      {/* Header Actions (Outer Grey Area) */}
      <div className="flex justify-between items-center px-4 pt-2 pb-3">
        <h3 className="text-[15px] font-semibold text-gray-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Transaction Monitoring
        </h3>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-full  text-[13px] outline-none w-56 focus:ring-1 focus:ring-gray-300"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 bg-white  rounded-full text-[13px] font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-400" /> Filter
          </button>
          <button className="w-[34px] h-[34px] flex items-center justify-center border border-gray-200 bg-white  rounded-full text-gray-500 hover:bg-gray-50">
            <MoreVertical className="w-4 h-4" />
          </button>
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
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">ID ↑↓</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Donor ↑↓</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Amount ↑↓</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Designation ↑↓</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Status ↑↓</th>
                <th className="py-4 px-4 font-semibold text-gray-500 text-[12px]">Date ↑↓</th>
                <th className="py-4 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-50/80 bg-white animate-pulse">
                    <td className="py-3.5 pl-6 pr-2"><div className="w-[18px] h-[18px] bg-gray-200 rounded-md"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-3.5 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-3.5 px-4"></td>
                  </tr>
                ))
              ) : actionableTransactions.map((txn, idx) => {
                const parsedAmount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g,"")) : txn.amount;
                const currency = txn.currencySymbol || '$';
                const statusIcon = txn.status === 'Failed' ? <XCircle className="w-4 h-4 text-red-500" /> : <Circle className="w-4 h-4 text-orange-500" />;

                return (
                  <tr key={txn.id} className="border-b border-gray-50/80 hover:bg-gray-50/50 transition-colors group bg-white">
                    <td className="py-3.5 pl-6 pr-2">
                      <div
                        onClick={() => toggleSelect(txn.id)}
                        className={`w-[18px] h-[18px] rounded-md border cursor-pointer flex items-center justify-center transition-colors ${selected.includes(txn.id) ? 'bg-black border-black' : 'border-gray-200 bg-gray-50'}`}
                      >
                        {selected.includes(txn.id) && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-500">{txn.id.substring(0,8).toUpperCase()}</td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-black">{txn.isAnonymous ? 'Anonymous' : txn.name}</td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-black">
                      {currency}{(parsedAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-700">
                      {txn.designation}
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-600">
                      <div className="flex items-center gap-2">
                        {statusIcon}
                        {txn.status}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[13px] font-medium text-gray-500">{new Date(txn.date || txn.created_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!isLoading && actionableTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[13px] text-gray-500 font-medium">
                    No transactions require attention.
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
