"use client";

import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  Mail,
  Users,
  Globe,
  Activity,
  Check,
  Trash2,
  Heart,
  Lock,
  Search,
  PhoneCall,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useConfirm } from "@/components/ui/ConfirmDialogProvider";
import {
  usePrayerRequests,
  deletePrayerRequest,
  type PrayerRequestItem,
} from "@/lib/usePrayerRequests";
import PrayerRequestDetailsSidebar, {
  getPrayerStatusBadge,
  getCategoryBadge,
} from "./PrayerRequestDetailsSidebar";

const CATEGORIES = ["All", "Healing", "Guidance", "Thanksgiving", "Other"];

export default function PrayerRequestsTable({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const { prayerRequests, isLoading, mutate } = usePrayerRequests();
  const [selected, setSelected] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeRequest, setActiveRequest] = useState<PrayerRequestItem | null>(
    null
  );
  const { confirm } = useConfirm();

  const filteredRequests = useMemo(() => {
    return prayerRequests.filter((item) => {
      const matchesCat =
        activeCategory === "All" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const q = search.toLowerCase().trim();
      const fullName = `${item.title} ${item.firstName} ${item.lastName}`.toLowerCase();
      const matchesSearch =
        !q ||
        fullName.includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.request.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [prayerRequests, activeCategory, search]);

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.includes(id)) {
      setSelected(selected.filter((i) => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredRequests.length && filteredRequests.length > 0) {
      setSelected([]);
    } else {
      setSelected(filteredRequests.map((r) => r.id));
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Prayer Request",
      message: "Are you sure you want to delete this prayer request?",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!isConfirmed) return;

    setDeletingId(id);
    try {
      await deletePrayerRequest(id);
      await mutate();
      if (activeRequest?.id === id) {
        setActiveRequest(null);
      }
      toast.success("Prayer request deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete prayer request");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    const isConfirmed = await confirm({
      title: "Delete Prayer Requests",
      message: `Are you sure you want to delete ${selected.length} selected prayer requests? This cannot be undone.`,
      confirmText: `Delete (${selected.length})`,
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!isConfirmed) return;

    try {
      await Promise.all(selected.map((id) => deletePrayerRequest(id)));
      if (activeRequest && selected.includes(activeRequest.id)) {
        setActiveRequest(null);
      }
      setSelected([]);
      toast.success(`${selected.length} prayer requests deleted`);
    } catch {
      toast.error("Failed to delete selected prayer requests");
    }
  };

  const activeIndex = activeRequest
    ? filteredRequests.findIndex((r) => r.id === activeRequest.id)
    : -1;

  const confidentialCount = prayerRequests.filter((r) => r.isConfidential).length;
  const followUpCount = prayerRequests.filter(
    (r) => r.contactPreference === "yes"
  ).length;

  return (
    <div className={`w-full flex flex-col ${embedded ? "pt-2" : "pt-4"} pb-12`}>
      {/* Right Slide-Over Detail Sidebar */}
      <PrayerRequestDetailsSidebar
        isOpen={Boolean(activeRequest)}
        onClose={() => setActiveRequest(null)}
        prayerRequest={activeRequest}
        hasPrev={activeIndex > 0}
        hasNext={
          activeIndex >= 0 && activeIndex < filteredRequests.length - 1
        }
        onPrev={() => {
          if (activeIndex > 0) {
            setActiveRequest(filteredRequests[activeIndex - 1]);
          }
        }}
        onNext={() => {
          if (activeIndex >= 0 && activeIndex < filteredRequests.length - 1) {
            setActiveRequest(filteredRequests[activeIndex + 1]);
          }
        }}
        onUpdated={(updated) => {
          setActiveRequest(updated);
          mutate();
        }}
        onDeleted={(id) => handleDelete(id)}
      />

      {/* Header Area (Cloned from SubscribersTable) */}
      {!embedded && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-black tracking-tight flex items-center gap-3">
              Prayer Requests Management
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-gray-500" />
              </div>
            </h1>
            <p className="text-[15px] font-medium text-gray-500 mt-1">
              Manage congregation prayer requests, intercession status, and
              pastoral follow-ups. Click any row to view full details.
            </p>
          </div>

          <Link
            href="/prayer-request"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors w-max shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Public Prayer Form
          </Link>
        </div>
      )}

      {/* Stats & Filter Row (Cloned from SubscribersTable pill style) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full">
            <div className="flex -space-x-1.5">
              <img
                className="w-5 h-5 rounded-full border-2 border-white relative z-20"
                src="https://ui-avatars.com/api/?name=V+H&background=0ea5e9&color=fff&size=20"
                alt="Avatar"
              />
              <img
                className="w-5 h-5 rounded-full border-2 border-white relative z-10"
                src="https://ui-avatars.com/api/?name=D+O&background=10b981&color=fff&size=20"
                alt="Avatar"
              />
              <img
                className="w-5 h-5 rounded-full border-2 border-white relative z-0"
                src="https://ui-avatars.com/api/?name=E+W&background=6366f1&color=fff&size=20"
                alt="Avatar"
              />
            </div>
            <span className="text-[13px] font-semibold text-gray-700">
              {prayerRequests.length} Prayer Requests
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full text-[13px] font-semibold text-gray-700">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
            {followUpCount} Request Contact
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200/80 rounded-full text-[13px] font-semibold text-gray-700">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            {confidentialCount} Confidential
          </div>

          {selected.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Selected ({selected.length})
            </button>
          )}
        </div>

        {/* Category Pills & Search */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                  activeCategory === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200/80 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-60 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, city..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200/80 rounded-full text-xs font-medium text-gray-900 focus:outline-none focus:border-[#0ea5e9] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Table Content (Cloned from SubscribersTable striped container) */}
      <div
        className="rounded-[20px] p-2 bg-[#f8f9fa] border border-gray-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)",
        }}
      >
        <div className="bg-white rounded-[14px] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-200/80 bg-[#fafafa]">
                  <th
                    onClick={toggleSelectAll}
                    className="py-3 pl-4 pr-3 border-r border-gray-200/60 font-medium text-gray-500 text-[13px] w-10 cursor-pointer"
                  >
                    <div className="flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${
                          selected.length === filteredRequests.length &&
                          filteredRequests.length > 0
                            ? "bg-[#0ea5e9] border-[#0ea5e9]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selected.length === filteredRequests.length &&
                          filteredRequests.length > 0 && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                      </div>
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[14%]">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-gray-400" /> Category
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[22%]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" /> Requester
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[22%]">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" /> Email
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[18%]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" /> Location
                    </div>
                  </th>
                  <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px] w-[10%]">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-gray-400" /> Contact
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-[13px] w-[10%] border-r border-gray-200/60">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" /> Status
                    </div>
                  </th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-[13px] w-[4%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors animate-pulse"
                      >
                        <td className="py-3.5 pl-4 pr-3 border-r border-gray-100">
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-200 rounded-[4px]" />
                          </div>
                        </td>
                        <td className="py-3.5 px-4 border-r border-gray-100">
                          <div className="w-20 h-4 bg-gray-200 rounded" />
                        </td>
                        <td className="py-3.5 px-4 border-r border-gray-100">
                          <div className="w-36 h-4 bg-gray-200 rounded" />
                        </td>
                        <td className="py-3.5 px-4 border-r border-gray-100">
                          <div className="w-44 h-4 bg-gray-200 rounded" />
                        </td>
                        <td className="py-3.5 px-4 border-r border-gray-100">
                          <div className="w-28 h-4 bg-gray-200 rounded" />
                        </td>
                        <td className="py-3.5 px-4 border-r border-gray-100">
                          <div className="w-14 h-4 bg-gray-200 rounded" />
                        </td>
                        <td className="py-3.5 px-4 border-r border-gray-100">
                          <div className="w-20 h-6 bg-gray-200 rounded-full" />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-4 h-4 bg-gray-200 rounded" />
                        </td>
                      </tr>
                    ))
                  : filteredRequests.map((reqItem) => {
                      const statusStyle = getPrayerStatusBadge(reqItem.status);
                      const catStyle = getCategoryBadge(reqItem.category);
                      const isRowActive = activeRequest?.id === reqItem.id;
                      const fullName = [
                        reqItem.title,
                        reqItem.firstName,
                        reqItem.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <tr
                          key={reqItem.id}
                          onClick={() => setActiveRequest(reqItem)}
                          className={`border-b border-gray-100 hover:bg-sky-50/40 transition-colors cursor-pointer group ${
                            isRowActive
                              ? "bg-sky-50/70"
                              : selected.includes(reqItem.id)
                              ? "bg-gray-50"
                              : ""
                          }`}
                        >
                          <td
                            onClick={(e) => toggleSelect(reqItem.id, e)}
                            className="py-3.5 pl-4 pr-3 border-r border-gray-100"
                          >
                            <div className="flex items-center justify-center">
                              <div
                                className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                                  selected.includes(reqItem.id)
                                    ? "bg-[#0ea5e9] border-[#0ea5e9]"
                                    : "border-gray-300 bg-white group-hover:border-gray-400"
                                }`}
                              >
                                {selected.includes(reqItem.id) && (
                                  <Check
                                    className="w-3 h-3 text-white"
                                    strokeWidth={3}
                                  />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 border-r border-gray-100">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-bold border ${catStyle.bg} ${catStyle.color}`}
                            >
                              {reqItem.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 border-r border-gray-100">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#f4f8f4] border border-gray-200 flex items-center justify-center text-[11px] font-bold text-gray-800 shrink-0">
                                {reqItem.firstName?.[0]}
                                {reqItem.lastName?.[0]}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-semibold text-gray-900 group-hover:text-[#0ea5e9] transition-colors">
                                    {fullName}
                                  </span>
                                  {reqItem.isConfidential && (
                                    <span
                                      title="Confidential Request"
                                      className="inline-flex items-center text-amber-600"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                                  {reqItem.request}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 border-r border-gray-100">
                            <span className="text-[14px] font-medium text-gray-600">
                              {reqItem.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 border-r border-gray-100">
                            <span className="text-[13px] font-medium text-gray-600">
                              {reqItem.city}, {reqItem.state}
                            </span>
                            <span className="text-[11px] text-gray-400 block">
                              {reqItem.country}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 border-r border-gray-100">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                reqItem.contactPreference === "yes"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-gray-50 text-gray-500 border-gray-200"
                              }`}
                            >
                              {reqItem.contactPreference === "yes"
                                ? "Yes"
                                : "No"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 border-r border-gray-100">
                            <div
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold border ${statusStyle.bg} ${statusStyle.color}`}
                            >
                              {reqItem.status}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(reqItem.id);
                              }}
                              disabled={deletingId === reqItem.id}
                              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Delete request"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                {!isLoading && filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Sparkles className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                          No prayer requests found
                        </h3>
                        <p className="text-[13px] text-gray-500 max-w-sm">
                          When users submit a prayer request on /prayer-request,
                          it will appear here.
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
    </div>
  );
}

