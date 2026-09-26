"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Search,
  Activity,
  Plus,
  TrendingUp,
  LayoutGrid,
  Edit3,
  Trash2,
  CalendarDays,
  ArrowUpDown,
  CheckCircle2,
  FileEdit,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import CampaignForm from "@/components/admin/campaigns/CampaignForm";
import type { AdminCampaign } from "@/components/admin/campaigns/CampaignForm";
import { useCampaigns, addCampaign, updateCampaign, deleteCampaign } from "@/lib/useCampaigns";
import { isValidImageSrc } from "@/lib/utils";

const emptyCampaign: AdminCampaign = {
  id: "",
  title: "",
  org: "Christ Revelation Church",
  raised: 0,
  goal: 1000,
  daysLeft: 30,
  status: "Draft",
  image: "",
  description: [""],
  updates: [],
};

type SortKey = "newest" | "oldest" | "most-raised" | "goal";

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Raised", value: "most-raised" },
  { label: "By Goal", value: "goal" },
];

const TABS = [
  { label: "All", value: "", icon: Layers },
  { label: "Active", value: "active", icon: CheckCircle2 },
  { label: "Drafts", value: "drafts", icon: FileEdit },
];

// ── Status badge color ──
const statusStyle: Record<string, { bg: string; text: string }> = {
  Active: { bg: "bg-emerald-100", text: "text-emerald-600" },
  Draft: { bg: "bg-gray-100", text: "text-gray-500" },
  Ended: { bg: "bg-orange-100", text: "text-orange-500" },
};

// ── Skeleton ──
function CampaignCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-[24px] overflow-hidden p-3 pb-4 border border-gray-100 animate-pulse">
      <div className="w-full aspect-[3/2] rounded-[18px] bg-gray-200 mb-5"></div>
      <div className="px-2">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full w-full mb-3"></div>
        <div className="flex justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="w-full h-px bg-gray-100 mb-3"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-100 flex items-center justify-between animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
    </div>
  );
}

// ── Empty state per tab ──
function EmptyState({ tab, onAdd }: { tab: string; onAdd: () => void }) {
  if (tab === "active") {
    return (
      <div className="col-span-full py-28 flex flex-col items-center justify-center text-center border-2 border-dashed border-emerald-100 rounded-[32px] bg-emerald-50/30">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No active campaigns</h3>
        <p className="text-gray-400 text-sm mb-8 max-w-xs">
          Activate a draft campaign or create a new one to start collecting donations.
        </p>
        <button
          onClick={onAdd}
          className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>
    );
  }

  if (tab === "drafts") {
    return (
      <div className="col-span-full py-28 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-[32px] bg-white">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <FileEdit size={32} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No drafts</h3>
        <p className="text-gray-400 text-sm mb-8 max-w-xs">
          Drafts are campaigns saved but not yet published. Create one to get started.
        </p>
        <button
          onClick={onAdd}
          className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Create Draft
        </button>
      </div>
    );
  }

  return (
    <div className="col-span-full py-28 flex flex-col items-center justify-center text-center border-2 border-gray-200 border-dashed rounded-[32px] bg-white">
      <Target size={48} className="text-gray-200 mb-5" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No campaigns yet</h3>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        Create your first fundraising campaign to start accepting donations.
      </p>
      <button
        onClick={onAdd}
        className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
      >
        <Plus size={16} /> Create First Campaign
      </button>
    </div>
  );
}

function AdminCampaignsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") ?? "").toLowerCase();

  const { campaigns, isLoading, isError, mutate } = useCampaigns();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"list" | "form">("list");
  const [editingCampaign, setEditingCampaign] = useState<AdminCampaign | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortOpen, setSortOpen] = useState(false);

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === "Active").length,
    totalRaised: campaigns.reduce((acc, curr) => acc + (curr.raised || 0), 0),
  };

  // ── Filter by tab ──
  const tabFiltered = useMemo(() => {
    if (tab === "active") return campaigns.filter((c) => c.status === "Active");
    if (tab === "drafts") return campaigns.filter((c) => c.status === "Draft");
    return campaigns;
  }, [campaigns, tab]);

  // ── Filter by search ──
  const searchFiltered = useMemo(() =>
    tabFiltered.filter(
      (c) =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.org.toLowerCase().includes(search.toLowerCase())
    ),
    [tabFiltered, search]
  );

  // ── Sort ──
  const sorted = useMemo(() => {
    const list = [...searchFiltered];
    if (sort === "oldest") return list.reverse();
    if (sort === "most-raised") return list.sort((a, b) => (b.raised ?? 0) - (a.raised ?? 0));
    if (sort === "goal") return list.sort((a, b) => (b.goal ?? 0) - (a.goal ?? 0));
    return list; // newest = default from DB
  }, [searchFiltered, sort]);

  const handleAddNew = () => {
    setEditingCampaign({ ...emptyCampaign, id: `camp-${Date.now()}` });
    setView("form");
  };

  const handleEdit = (camp: AdminCampaign) => {
    setEditingCampaign({ ...camp });
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setDeletingId(id);
    try {
      await deleteCampaign(id);
      await mutate();
    } catch {
      alert("Failed to delete campaign.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!editingCampaign) return;
    try {
      const isNew = !campaigns.find((c) => c.id === editingCampaign.id);
      if (isNew) {
        await addCampaign(editingCampaign);
      } else {
        await updateCampaign(editingCampaign.id, editingCampaign);
      }
      await mutate();
      setView("list");
      setEditingCampaign(null);
    } catch {
      alert("Failed to save campaign.");
    }
  };

  const currentTabLabel = TABS.find((t) => t.value === tab)?.label ?? "All";

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      {/* <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Overview</span>
          <span className="text-gray-300">/</span>
          <span className="text-black font-semibold">Campaigns</span>
          {tab && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-black font-semibold capitalize">{tab}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-black to-neutral-800 text-white flex items-center justify-center text-sm font-bold shadow-sm">
            A
          </div>
        </div>
      </header> */}

      <main className="flex-1 p-8">
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* Title Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-black tracking-tight mb-2">Campaigns</h1>
                  <p className="text-gray-500 font-medium">
                    Manage fundraising campaigns, track progress, and monitor donations.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Search */}
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search campaigns..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-2 text-sm rounded-full bg-white border border-gray-200 text-black focus:outline-none focus:border-black transition-colors"
                    />
                  </div>

                  {/* Sort dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setSortOpen((o) => !o)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-full hover:border-gray-300 transition-colors text-gray-700 shrink-0"
                    >
                      <ArrowUpDown size={14} />
                      {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                    </button>
                    <AnimatePresence>
                      {sortOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.97 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-[16px] shadow-xl z-30 overflow-hidden min-w-[150px]"
                        >
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => { setSort(opt.value); setSortOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${sort === opt.value ? "text-black bg-gray-100" : "text-gray-700"}`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* New Campaign */}
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center justify-center px-5 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition-colors shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Campaign
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {isLoading ? (
                  [0, 1, 2].map((i) => <StatSkeleton key={i} />)
                ) : (
                  [
                    { label: "Total Raised", value: `$${stats.totalRaised.toLocaleString()}`, icon: TrendingUp, color: "text-[#22c55e]", bg: "bg-green-50" },
                    { label: "Active Campaigns", value: stats.activeCampaigns, icon: Activity, color: "text-black", bg: "bg-gray-100" },
                    { label: "Total Campaigns", value: stats.totalCampaigns, icon: Target, color: "text-blue-500", bg: "bg-blue-50" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[20px] p-6 border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-[15px] font-medium text-gray-400 mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-black">{stat.value}</h3>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                        <stat.icon size={22} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Tab Bar */}
              {/* <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-full p-1 w-fit shadow-sm">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const count =
                    t.value === ""
                      ? campaigns.length
                      : campaigns.filter((c) =>
                          t.value === "active" ? c.status === "Active" : c.status === "Draft"
                        ).length;

                  const isSelected = tab === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() =>
                        router.push(
                          t.value ? `/admin/campaigns?tab=${t.value}` : "/admin/campaigns"
                        )
                      }
                      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        isSelected
                          ? "bg-black text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={14} />
                      {t.label}
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                          isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div> */}

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                {isLoading ? (
                  [0, 1, 2, 3, 4, 5].map((i) => <CampaignCardSkeleton key={i} />)
                ) : isError ? (
                  <div className="col-span-full py-20 text-center border-2 border-red-100 border-dashed rounded-[32px] bg-white">
                    <CalendarDays size={32} className="mx-auto text-red-300 mb-4" />
                    <p className="text-red-500 text-sm font-semibold mb-1">Failed to load campaigns.</p>
                    <button
                      onClick={() => mutate()}
                      className="mt-3 text-sm bg-white border border-gray-200 text-gray-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                ) : tabFiltered.length === 0 ? (
                  <EmptyState tab={tab} onAdd={handleAddNew} />
                ) : search && sorted.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-gray-200 border-dashed rounded-[32px] bg-white">
                    <Search size={32} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm font-medium">No campaigns match "{search}".</p>
                    <button
                      onClick={() => setSearch("")}
                      className="mt-4 text-sm text-black font-semibold underline"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  sorted.map((card, idx) => {
                    const sStyle = statusStyle[card.status] ?? { bg: "bg-gray-100", text: "text-gray-500" };
                    const progress = Math.min((card.raised / card.goal) * 100, 100);
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.25 }}
                        onClick={() => router.push(`/admin/campaigns/${card.id}`)}
                        className="flex flex-col group cursor-pointer bg-white rounded-[24px] overflow-hidden duration-300 p-3 pb-4 border border-gray-100 hover:shadow-xl hover:border-gray-200 hover:-translate-y-0.5 transition-all"
                      >
                        {/* Image */}
                        <div className="relative w-full aspect-[3/2] rounded-[18px] overflow-hidden mb-5 bg-[#f4f8f4]">
                          {isValidImageSrc(card.image) ? (
                            <Image
                              src={card.image}
                              alt={card.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Target className="w-10 h-10 text-gray-300" />
                            </div>
                          )}
                          {/* Status badge */}
                          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full border border-white/40 backdrop-blur-sm ${sStyle.bg}`}>
                            <span className={`text-[11px] font-bold uppercase tracking-wider ${sStyle.text}`}>
                              {card.status}
                            </span>
                          </div>
                          {/* Days left chip */}
                          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            <span className="text-[11px] font-semibold text-white">
                              {card.daysLeft > 0 ? `${card.daysLeft}d left` : "Ended"}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col px-2 flex-grow">
                          {/* Org */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 font-medium">
                            {card.org}
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          {/* Title */}
                          <h3 className="text-base font-bold text-black group-hover:text-black transition-colors leading-snug line-clamp-2 mb-3">
                            {card.title}
                          </h3>

                          {/* Progress */}
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-gradient-to-r from-black to-neutral-800 rounded-full transition-all duration-700"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          {/* Raised / Goal */}
                          <div className="flex justify-between items-center text-sm mb-4">
                            <span className="font-bold text-black">
                              ${card.raised.toLocaleString()}
                              <span className="text-gray-400 font-medium text-xs ml-1">raised</span>
                            </span>
                            <span className="text-gray-400 text-xs font-semibold">
                              of ${card.goal.toLocaleString()}
                              <span className="ml-1 font-bold text-gray-600">({Math.round(progress)}%)</span>
                            </span>
                          </div>

                          <div className="w-full h-px bg-gray-100 mb-3" />

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="text-[11px] font-mono font-semibold text-gray-300 truncate max-w-[100px]">
                              {card.id}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEdit(card); }}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                                title="Edit"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                disabled={deletingId === card.id}
                                onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-40"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Form view */}
          {view === "form" && editingCampaign && (
            <CampaignForm
              campaign={editingCampaign}
              onChange={setEditingCampaign}
              onSave={handleSave}
              onCancel={() => setView("list")}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function AdminCampaignsPage() {
  return (
    <React.Suspense fallback={<div className="flex-1 p-8 bg-[#f8f9fa] flex items-center justify-center animate-pulse"><div className="w-16 h-16 rounded-full bg-gray-200"></div></div>}>
      <AdminCampaignsContent />
    </React.Suspense>
  );
}
