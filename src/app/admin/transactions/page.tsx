import React from 'react';
import TransactionsTable from '@/components/admin/transactions/TransactionsTable';
import { LayoutGrid, Bell, Settings as SettingsIcon } from 'lucide-react';

export default function AdminTransactionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      {/* Top Header */}
      {/* <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Finance</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Transactions</span>
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

      <div className="p-8 flex-1">
        <TransactionsTable />
      </div>
    </div>
  );
}
