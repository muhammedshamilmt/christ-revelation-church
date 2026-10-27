import React from 'react';
import { X, User, Calendar, CreditCard, CheckCircle2, FileText, Download, ExternalLink, Mail, Phone, ChevronLeft, ChevronRight, Maximize2, MoreHorizontal, DollarSign, Heart, Hash } from 'lucide-react';

export interface TransactionDetails {
  id: string;
  name: string;
  email: string;
  amount: number | string;
  currency: string;
  currencySymbol?: string;
  designation: string;
  date: string;
  status: string;
  statusColor: string;
  statusBg: string;
  type: string;
  isAnonymous: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionDetails | null;
}

export default function TransactionDetailsSidebar({ isOpen, onClose, transaction }: SidebarProps) {
  if (!transaction) return null;

  const initials = transaction.name === 'Anonymous' ? 'A' : transaction.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const parsedAmount = typeof transaction.amount === 'string' ? parseFloat(transaction.amount.replace(/[^0-9.-]+/g,"")) : transaction.amount;
  const currencySymbol = transaction.currencySymbol || '$';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-white/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed top-4 bottom-4 right-4 w-[700px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-black">Transaction Details</h2>
            <div className="flex items-center gap-2 text-gray-400">
              <button className="hover:text-gray-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <span className="text-sm">Previous</span>
              <span className="text-sm ml-2">Next</span>
              <button className="hover:text-gray-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <Maximize2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-white  flex items-center justify-center bg-[#0ea5e9] text-white text-2xl font-bold">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  {transaction.name}
                  {transaction.isAnonymous && <span className="text-gray-400 text-lg font-normal ml-2 italic">(Anonymous)</span>}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm font-medium">
                  <CreditCard className="w-4 h-4" /> {transaction.id}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-full text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" /> Receipt
              </button>
              <button className="px-4 py-2 bg-[#0ea5e9] text-white font-semibold rounded-full text-sm hover:bg-[#0284c7] transition-colors flex items-center gap-2 ">
                <Mail className="w-4 h-4" /> Email Donor
              </button>
              <button className="p-2 text-gray-400 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex gap-3 mb-6">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${transaction.statusBg} ${transaction.statusColor}`}>
              <CheckCircle2 className="w-4 h-4" /> {transaction.status}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-semibold border border-gray-200">
              <Calendar className="w-4 h-4" /> {transaction.date}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm font-semibold border border-gray-200">
              <Heart className="w-4 h-4 text-black" /> {transaction.type}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-gray-500 font-medium mb-1">Amount</p>
              <p className="text-xl font-bold text-black">{currencySymbol}{(parsedAmount || 0).toFixed(2)}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-gray-500 font-medium mb-1">Currency</p>
              <p className="text-sm font-bold text-black">{transaction.currency || 'USD'}</p>
            </div>
            <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
              <p className="text-xs text-gray-500 font-medium mb-1">Fee (Est.)</p>
              <p className="text-sm font-bold text-black">{currencySymbol}{((parsedAmount || 0) * 0.029 + 0.30).toFixed(2)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-100 mb-8">
            <button className="pb-3 text-sm font-bold text-[#0ea5e9] border-b-2 border-[#0ea5e9]">Overview</button>
            <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-700">Timeline</button>
            <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-700">Notes</button>
          </div>

          {/* Application Details */}
          <div className="space-y-8">

            {/* Designation */}
            <section>
              <h3 className="text-base font-bold text-black mb-3">Donation Designation</h3>
              <div className="p-4 bg-[#f8f9fa] border border-gray-200/80 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{transaction.designation}</p>
                  <p className="text-sm text-gray-500 mt-1">This donation is allocated specifically towards the {transaction.designation} fund.</p>
                </div>
              </div>
            </section>

            {/* Donor Information */}
            <section>
              <h3 className="text-base font-bold text-black mb-3">Donor Contact Info</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">Email Address</p>
                      <p className="text-xs text-gray-500">{transaction.email}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-pink-50">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Payment Details */}
            <section>
              <h3 className="text-base font-bold text-black mb-3">Payment Details</h3>
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Payment Method</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-black">•••• 4242</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white border-b border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">Transaction ID</span>
                  <span className="text-sm font-bold text-black uppercase tracking-wider">{transaction.id}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white">
                  <span className="text-sm text-gray-500 font-medium">Date & Time</span>
                  <span className="text-sm font-bold text-black">{transaction.date}</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}
