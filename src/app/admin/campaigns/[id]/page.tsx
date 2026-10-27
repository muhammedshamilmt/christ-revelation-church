"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Users, CheckCircle2,
  Mail, X, DollarSign, CreditCard, Calendar, Target,
  ToggleLeft, ToggleRight, Pencil, Search, Activity
} from "lucide-react";
import CampaignForm from "@/components/admin/campaigns/CampaignForm";
import type { AdminCampaign } from "@/components/admin/campaigns/CampaignForm";
import { useCampaign, updateCampaign } from "@/lib/useCampaigns";
import useSWR from "swr";

// ── Mock Types ──
type TransactionData = {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  date: string;
  status: "Completed" | "Pending" | "Failed";
  type: string;
  isAnonymous: boolean;
};

// We will dynamically fetch transactions using SWR instead of mock data

const STATUS_CFG = {
  Completed: { label: "Completed", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-500" },
  Pending: { label: "Pending", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-500" },
  Failed: { label: "Failed", bg: "bg-red-50", border: "border-red-200", text: "text-red-500" },
};

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#0ea5e9] text-white hover:bg-[#0284c7] px-4 py-2 text-sm",
    outline: "border border-[#e6ece7] text-black hover:bg-[#f4f8f4] px-4 py-2 text-sm",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-black px-3 py-2 text-sm",
  };
  return (
    <button className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function CampaignAdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const { campaign, isLoading, isError, mutate } = useCampaign(resolvedParams.id);
  
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [tab, setTab] = useState<'general' | 'transactions'>('general');
  const [search, setSearch] = useState('');
  
  const { data: fetchedTxns, isLoading: txnsLoading, mutate: mutateTxns } = useSWR<TransactionData[]>(
    campaign ? `campaign-txns-${campaign.id}` : null,
    async () => {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      return (data || []).map((t: any) => ({
        id: t.id.toString(),
        name: t.name,
        email: t.email,
        amount: typeof t.amount === 'string' ? parseFloat(t.amount.replace(/[^0-9.-]+/g, '')) || 0 : (Number(t.amount) || 0),
        currency: t.currency || 'GBP',
        date: new Date(t.date || t.created_at || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: t.status || 'Completed',
        type: 'One-time',
        isAnonymous: t.isAnonymous || false
      }));
    }, { revalidateOnFocus: true }
  );

  const transactions = fetchedTxns || [];
  
  // Compute live fundraising stats from actual transactions
  const totalRaisedFromTxns = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const donorCount = transactions.filter(t => t.status === 'Completed').length;
  
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sidebarTxn, setSidebarTxn] = useState<TransactionData | null>(null);

  const [localCampaign, setLocalCampaign] = useState<AdminCampaign | null>(null);

  React.useEffect(() => {
    if (campaign && !localCampaign) {
      setLocalCampaign(campaign);
    }
  }, [campaign, localCampaign]);

  const toggleStatus = async () => {
    if (!campaign) return;
    const newStatus = campaign.status === 'Active' ? 'Completed' : 'Active';
    try {
      await updateCampaign(campaign.id, { status: newStatus });
      setLocalCampaign({ ...localCampaign!, status: newStatus });
      await mutate();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const handleUpdateTxnStatus = async (txnId: string, status: TransactionData['status']) => {
    try {
      if (sidebarTxn && sidebarTxn.id === txnId) {
        setSidebarTxn({ ...sidebarTxn, status });
      }
      await mutateTxns();
    } catch (e) {
      alert("Failed to update status.");
    }
  };

  const toggleSelectRow = (rowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  const handleSaveCampaign = async () => {
    if (!localCampaign) return;
    try {
      await updateCampaign(localCampaign.id, localCampaign);
      await mutate();
      setViewMode('preview');
    } catch {
      alert("Failed to save campaign.");
    }
  };

  const filteredTxns = transactions.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-[14px] bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 rounded-lg bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
      </div>
      <div className="h-64 rounded-3xl bg-gray-200" />
    </div>
  );

  if (isError) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Calendar className="w-12 h-12 text-red-300" />
      <p className="text-red-500 font-medium">Failed to load campaign.</p>
      <Button variant="outline" onClick={() => mutate()}>Try again</Button>
    </div>
  );

  if (!campaign) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Target className="w-12 h-12 text-gray-300" />
      <p className="text-gray-500 font-medium">Campaign not found.</p>
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />Go Back
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 relative overflow-hidden">
      
      {/* ── Sidebar Overlay ── */}
      <div
        className={`fixed inset-0 bg-white/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${sidebarTxn ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarTxn(null)}
      />

      {/* ── Transaction Details Sidebar ── */}
      <div className={`fixed top-4 bottom-4 right-4 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] shadow-lg border border-[#e6ece7] z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform ${sidebarTxn ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        {sidebarTxn && (() => {
          const cfg = STATUS_CFG[sidebarTxn.status];
          return (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-[#fcfdfc]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#f4f8f4] flex items-center justify-center text-xl font-bold text-black border border-[#e6ece7]">
                      {sidebarTxn.name === 'Anonymous' ? 'A' : sidebarTxn.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-black text-xl tracking-tight">{sidebarTxn.name}</h3>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${cfg.bg} border ${cfg.border} ${cfg.text} mt-1.5 inline-block`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSidebarTxn(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Transaction Info</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4">
                        <p className="text-[11px] font-medium text-gray-400 mb-1">Amount</p>
                        <p className="text-lg font-bold text-black">{sidebarTxn.currency === 'GBP' ? '£' : '$'}{sidebarTxn.amount.toFixed(2)}</p>
                      </div>
                      <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4">
                        <p className="text-[11px] font-medium text-gray-400 mb-1">Type</p>
                        <p className="text-sm font-bold text-black mt-1">{sidebarTxn.type}</p>
                      </div>
                      <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4 col-span-2">
                        <p className="text-[11px] font-medium text-gray-400 mb-1">Date</p>
                        <p className="text-sm font-bold text-black">{sidebarTxn.date}</p>
                      </div>
                      <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4 col-span-2">
                        <p className="text-[11px] font-medium text-gray-400 mb-1">Transaction ID</p>
                        <p className="text-sm font-bold text-black font-mono">{sidebarTxn.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100" />

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Donor Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f4f8f4] flex items-center justify-center border border-[#e6ece7] shrink-0">
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-black truncate">{sidebarTxn.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-[#fcfdfc]">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Update Status</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['Completed', 'Pending', 'Failed'] as const).map(s => {
                    const scfg = STATUS_CFG[s];
                    return (
                      <button 
                        key={s} 
                        onClick={() => handleUpdateTxnStatus(sidebarTxn.id, s)}
                        className={`py-2 px-2 rounded-[14px] text-xs font-bold transition-all border 
                          ${sidebarTxn.status === s ? `${scfg.bg} border-${scfg.border} ${scfg.text}` : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                      >
                        {scfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          );
        })()}
      </div>

      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* ── View Mode: PREVIEW ── */}
        {viewMode === 'preview' ? (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <button onClick={() => router.push('/admin/campaigns')} className="mt-1 w-10 h-10 rounded-[14px] border border-[#e6ece7] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors flex-shrink-0">
                  <ArrowLeft className="w-4 h-4 text-black" />
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-black uppercase tracking-wider">{campaign.org}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs font-semibold text-gray-500">Created {new Date(campaign.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-black">{campaign.title}</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3 flex-wrap pl-14 md:pl-0">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold text-white
                  ${campaign.status === 'Active' ? 'bg-[#22c55e]' : 'bg-gray-500'}`}>
                  {campaign.status}
                </span>
                <button onClick={toggleStatus} title="Toggle status"
                  className="w-10 h-10 rounded-[14px] border border-[#e6ece7] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
                  {campaign.status === 'Active' ? <ToggleRight className="w-5 h-5 text-[#22c55e]" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </button>
                <Button variant="outline" onClick={() => setViewMode('edit')}>
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Details
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[#e6ece7] pb-px">
              {(['general', 'transactions'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-6 py-3 text-sm font-bold capitalize transition-all border-b-2
                    ${tab === t ? 'border-[#0ea5e9] text-[#0ea5e9]' : 'border-transparent text-gray-400 hover:text-[#0ea5e9] hover:border-gray-200'}`}>
                  {t === 'transactions' ? `Transactions (${transactions.length})` : 'General Overview'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* GENERAL TAB */}
              {tab === 'general' && (
                <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="grid lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                      <h3 className="text-lg font-bold text-black mb-4">About the Campaign</h3>
                      <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                        {campaign.description.map((desc: string, i: number) => (
                          <p key={i}>{desc}</p>
                        ))}
                      </div>
                    </div>

                    {campaign.updates.length > 0 && (
                      <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                        <h3 className="text-lg font-bold text-black mb-6">Recent Updates</h3>
                        <div className="space-y-6">
                          {campaign.updates.map((item: any, i: number) => (
                            <div key={i} className="flex items-start gap-4">
                              <div className="w-24 flex-shrink-0 text-sm font-bold text-gray-400 pt-0.5">{item.date}</div>
                              <div className="flex-1 pb-6 border-b border-[#e6ece7] last:border-0 last:pb-0">
                                <h4 className="text-base font-bold text-black mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-6">
                      <h3 className="text-lg font-bold text-black">Fundraising Goal</h3>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <span className="text-3xl font-bold text-black">${totalRaisedFromTxns > 0 ? totalRaisedFromTxns.toLocaleString() : (campaign.raised?.toLocaleString() || 0)}</span>
                            <span className="text-gray-500 text-sm font-medium ml-2">raised</span>
                          </div>
                          <span className="text-gray-900 font-bold text-sm">Target: ${campaign.goal?.toLocaleString() || 0}</span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#0ea5e9] rounded-full" 
                            style={{ width: `${Math.min(((totalRaisedFromTxns > 0 ? totalRaisedFromTxns : (campaign.raised || 0)) / (campaign.goal || 1)) * 100, 100)}%` }} 
                          />
                        </div>
                        <p className="text-xs text-gray-400 font-medium pt-1">
                          {Math.round(((totalRaisedFromTxns > 0 ? totalRaisedFromTxns : (campaign.raised || 0)) / (campaign.goal || 1)) * 100)}% funded
                        </p>
                      </div>

                      <div className="space-y-5 pt-4">
                        {[
                          { icon: Calendar, label: 'Days Left', value: campaign.daysLeft > 0 ? `${campaign.daysLeft} days` : 'Ended' },
                          { icon: Users, label: 'Total Donors', value: txnsLoading ? 'Loading...' : `${donorCount.toLocaleString()} donation${donorCount !== 1 ? 's' : ''}` },
                          { icon: Users, label: 'Organization', value: campaign.org },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#f4f8f4] border border-[#e6ece7] flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-black" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
                              <p className="text-sm font-bold text-black">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TRANSACTIONS TAB - TransactionsTable UI */}
              {tab === 'transactions' && (
                <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full flex flex-col pb-12">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transaction, name, email..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#e6ece7] text-black text-sm font-semibold placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#0ea5e9]" />
                    </div>
                  </div>

                  {/* Table Content */}
                  <div className="rounded-[20px] p-2 bg-[#f8f9fa] border border-[#e6ece7] shadow-lg w-full"
                    style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)' }}>
                    
                    <div className="bg-white rounded-[14px] border border-gray-100 overflow-hidden flex flex-col">
                      <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                          <thead>
                            <tr className="border-b border-gray-200/80 bg-[#fafafa]">
                              <th className="py-2 pl-4 pr-3 border-r border-gray-200/60 font-medium text-gray-500 text-[13px] w-10">
                                <div className="flex items-center justify-center">
                                  <div className="w-4 h-4 rounded-[4px] border border-gray-300 bg-white"></div>
                                </div>
                              </th>
                              <th className="py-2 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[15%]">
                                <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Txn ID</div>
                              </th>
                              <th className="py-2 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[20%]">
                                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Donor</div>
                              </th>
                              <th className="py-2 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[20%]">
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> Email</div>
                              </th>
                              <th className="py-2 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[15%]">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Date</div>
                              </th>
                              <th className="py-2 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[15%]">
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" /> Amount</div>
                              </th>
                              <th className="py-2 px-4 font-semibold text-gray-600 text-[13px] w-[15%]">
                                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-gray-400" /> Status</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {txnsLoading ? (
                              <tr><td colSpan={7} className="py-12 text-center text-gray-400 font-medium animate-pulse">Loading transactions...</td></tr>
                            ) : filteredTxns.length === 0 ? (
                              <tr><td colSpan={7} className="py-12 text-center text-gray-400 font-medium">No transactions found.</td></tr>
                            ) : (
                              filteredTxns.map((txn, idx) => {
                                const cfg = STATUS_CFG[txn.status];
                                return (
                                  <tr
                                    key={idx}
                                    onClick={() => setSidebarTxn(txn)}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                  >
                                    <td className="py-2 pl-4 pr-3 border-r border-gray-100" onClick={(e) => toggleSelectRow(txn.id, e)}>
                                      <div className="flex items-center justify-center">
                                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${selectedRows.includes(txn.id) ? 'bg-[#0ea5e9] border-[#0ea5e9]' : 'border-gray-300 bg-white'}`}>
                                          {selectedRows.includes(txn.id) && <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2 px-4 border-r border-gray-100">
                                      <span className="text-[13px] font-bold text-black truncate max-w-[100px] block">{txn.id}</span>
                                    </td>
                                    <td className="py-2 px-4 border-r border-gray-100">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#f4f8f4] border border-[#e6ece7] flex items-center justify-center text-xs font-bold text-black shrink-0">
                                          {txn.name === 'Anonymous' ? 'A' : txn.name[0]}
                                        </div>
                                        <span className="text-[13px] font-bold text-black truncate">{txn.name} {txn.isAnonymous && <span className="text-gray-400 font-normal italic">(Anonymous)</span>}</span>
                                      </div>
                                    </td>
                                    <td className="py-2 px-4 border-r border-gray-100">
                                      <span className="text-[13px] text-gray-500 truncate">{txn.email || 'N/A'}</span>
                                    </td>
                                    <td className="py-2 px-4 border-r border-gray-100">
                                      <span className="text-[13px] text-gray-600 font-medium">{txn.date}</span>
                                    </td>
                                    <td className="py-2 px-4 border-r border-gray-100">
                                      <span className="text-[14px] font-bold text-black">{txn.currency === 'GBP' ? '£' : '$'}{txn.amount.toFixed(2)}</span>
                                    </td>
                                    <td className="py-2 px-4">
                                      <div className={`inline-flex items-center px-2.5 py-1 rounded-md border ${cfg.bg} ${cfg.border}`}>
                                        <span className={`text-[11px] font-bold uppercase tracking-wide ${cfg.text}`}>{cfg.label}</span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* ── View Mode: EDIT ── */
          <div className="pt-4">
            {localCampaign && (
              <CampaignForm
                campaign={localCampaign}
                onChange={setLocalCampaign}
                onSave={handleSaveCampaign}
                onCancel={() => setViewMode('preview')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
