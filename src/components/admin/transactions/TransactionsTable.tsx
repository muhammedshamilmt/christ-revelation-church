'use client';
import React, { useState } from 'react';
import useSWR from 'swr';
import { CreditCard, Activity, Search, Mail, Check, Circle, CheckCircle2, XCircle, ArrowUpRight, Filter, DollarSign, Calendar } from 'lucide-react';
import TransactionDetailsSidebar, { TransactionDetails } from '@/components/admin/transactions/TransactionDetailsSidebar';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TransactionsTable() {
  const { data: transactions, error, isLoading } = useSWR<any[]>('/api/transactions', fetcher);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [sidebarTxn, setSidebarTxn] = useState<TransactionDetails | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = (txn: TransactionDetails) => {
    setSidebarTxn(txn);
    setTimeout(() => setIsSidebarOpen(true), 10);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setSidebarTxn(null), 300);
  };

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const displayTransactions = Array.isArray(transactions) ? transactions : [];
  const filteredTransactions = displayTransactions.filter(txn => {
    if (activeTab === 'Completed') return txn.status === 'Completed';
    if (activeTab === 'Pending') return txn.status === 'Pending';
    if (activeTab === 'Failed') return txn.status === 'Failed';
    return true;
  });

  const totalRaised = displayTransactions.reduce((acc, curr) => {
    const amt = typeof curr.amount === 'string' ? parseFloat(curr.amount.replace(/[^0-9.-]+/g,"")) : curr.amount;
    return acc + (amt || 0);
  }, 0);

  const completedCount = displayTransactions.filter(t => t.status === 'Completed').length;

  return (
    <div className="w-full flex flex-col pt-4 pb-12">

      {/* Header Area */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-black tracking-tight flex items-center gap-3">
          Transactions & Donations
          <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
            <CreditCard className="w-3.5 h-3.5 text-gray-500" />
          </div>
        </h1>
        <p className="text-[15px] font-medium text-gray-500 mt-1">
          Monitor your incoming donations, view donor details, and track financial designations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700 ">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          {displayTransactions[0]?.currencySymbol || '$'}{totalRaised.toFixed(2)} Total Raised
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700 ">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          {displayTransactions.length} Total Transactions
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full  text-[13px] font-semibold text-gray-700 ">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          {completedCount} Completed
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-full border border-gray-200/60 w-fit mb-6">
        {['All Transactions', 'Completed', 'Pending', 'Failed'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 text-[13px] font-semibold rounded-full transition-all ${activeTab === t ? 'bg-white text-black border border-gray-200/50 ' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 border border-transparent'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full"
        style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>

        <div className="bg-white rounded-[14px]  border border-gray-100 overflow-hidden flex flex-col">

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200/80 bg-[#fafafa]">
                  <th className="py-3 pl-4 pr-3 border-r border-gray-200/60 font-medium text-gray-500 text-[13px] w-10">
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 rounded-[4px] border border-gray-300 bg-white"></div>
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[20%]">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-400" /> Transaction
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[20%]">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" /> Amount
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[25%]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> Donor Info
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[15%]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" /> Date
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-[13px] w-[20%]">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" /> Status
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors animate-pulse">
                      <td className="py-3.5 pl-4 pr-3 border-r border-gray-100">
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-200 rounded-[4px]"></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="flex flex-col gap-1">
                          <div className="w-24 h-4 bg-gray-200 rounded"></div>
                          <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="w-20 h-5 bg-gray-200 rounded"></div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="flex flex-col gap-1">
                          <div className="w-32 h-4 bg-gray-200 rounded"></div>
                          <div className="w-40 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 border-r border-gray-100">
                        <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredTransactions.map((txn, idx) => {
                  const statusBg = txn.status === 'Completed' ? 'bg-emerald-50 border-emerald-200' : txn.status === 'Failed' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200';
                  const statusColor = txn.status === 'Completed' ? 'text-emerald-500' : txn.status === 'Failed' ? 'text-red-500' : 'text-orange-500';
                  const parsedAmount = typeof txn.amount === 'string' ? parseFloat(txn.amount.replace(/[^0-9.-]+/g,"")) : txn.amount;
                  const dateStr = new Date(txn.date || txn.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  
                  return (
                    <tr
                      key={txn.id}
                      onClick={() => openSidebar(txn)}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 pl-4 pr-3 border-r border-gray-100" onClick={(e) => { e.stopPropagation(); toggleSelect(txn.id); }}>
                        <div className="flex items-center justify-center">
                          <div
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${selected.includes(txn.id) ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}
                          >
                            {selected.includes(txn.id) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-black">{txn.id.substring(0, 8).toUpperCase()}</span>
                          <span className="text-[12px] font-medium text-gray-500">{txn.designation || 'General'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-black">{txn.currencySymbol || '$'}{parsedAmount?.toFixed(2) || '0.00'}</span>
                          <span className="text-[11px] font-medium text-gray-500 uppercase">{txn.currency || 'USD'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-black">{txn.name} {txn.isAnonymous && <span className="text-gray-400 font-normal italic">(Anonymous)</span>}</span>
                          <span className="text-[12px] text-gray-500">{txn.email || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-r border-gray-100">
                        <span className="text-[13px] font-medium text-gray-600">{dateStr}</span>
                      </td>
                      <td className="py-2 px-3">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-gray-200/80 ${statusBg} ${statusColor}`}>
                          {txn.status === 'Completed' && <Check className="w-3 h-3" strokeWidth={3.5} />}
                          {txn.status === 'Pending' && <Circle className="w-3 h-3 fill-current" />}
                          {txn.status === 'Failed' && <XCircle className="w-3 h-3" strokeWidth={2.5} />}
                          <span className="text-[13px] font-medium text-gray-700 leading-none">{txn.status || 'Completed'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!isLoading && filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <CreditCard className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">No transactions found</h3>
                        <p className="text-[13px] text-gray-500 max-w-sm">
                          {activeTab !== 'All Transactions' ? `There are no transactions in the "${activeTab}" status.` : 'When a donation is processed, it will appear here.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransactionDetailsSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        transaction={sidebarTxn}
      />
    </div>
  );
}
