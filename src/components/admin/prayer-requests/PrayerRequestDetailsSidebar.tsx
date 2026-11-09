"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  MapPin,
  Calendar,
  Heart,
  CheckCircle2,
  FileText,
  Mail,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Lock,
  Globe,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  updatePrayerRequest,
  type PrayerRequestItem,
  type PrayerRequestStatus,
} from "@/lib/usePrayerRequests";

interface PrayerRequestDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  prayerRequest: PrayerRequestItem | null;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  onUpdated?: (updated: PrayerRequestItem) => void;
  onDeleted?: (id: string) => void;
}

const STATUS_OPTIONS: PrayerRequestStatus[] = [
  "New",
  "Praying",
  "Answered",
  "Followed Up",
];

export function getPrayerStatusBadge(status: string) {
  switch (status) {
    case "New":
      return {
        color: "text-blue-600",
        bg: "bg-blue-50 border-blue-200",
      };
    case "Praying":
      return {
        color: "text-purple-600",
        bg: "bg-purple-50 border-purple-200",
      };
    case "Answered":
      return {
        color: "text-emerald-600",
        bg: "bg-emerald-50 border-emerald-200",
      };
    case "Followed Up":
      return {
        color: "text-amber-600",
        bg: "bg-amber-50 border-amber-200",
      };
    default:
      return {
        color: "text-gray-600",
        bg: "bg-gray-50 border-gray-200",
      };
  }
}

export function getCategoryBadge(category: string) {
  const normalized = category.toLowerCase();
  if (normalized === "healing") {
    return {
      color: "text-rose-600",
      bg: "bg-rose-50 border-rose-200",
    };
  }
  if (normalized === "guidance") {
    return {
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-200",
    };
  }
  if (normalized === "thanksgiving") {
    return {
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
    };
  }
  return {
    color: "text-gray-700",
    bg: "bg-gray-100 border-gray-200",
  };
}

export default function PrayerRequestDetailsSidebar({
  isOpen,
  onClose,
  prayerRequest,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  onUpdated,
  onDeleted,
}: PrayerRequestDetailsSidebarProps) {
  // Keep last non-null prayerRequest in state so exit animation renders full content smoothly
  const [cachedRequest, setCachedRequest] = useState<PrayerRequestItem | null>(
    prayerRequest
  );
  const [activeTab, setActiveTab] = useState<"Request" | "Address" | "Notes">(
    "Request"
  );
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (prayerRequest) {
      setCachedRequest(prayerRequest);
      setNotesDraft(prayerRequest.notes || "");
    }
  }, [prayerRequest]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const item = prayerRequest || cachedRequest;

  const handleStatusChange = async (newStatus: PrayerRequestStatus) => {
    if (!item) return;
    try {
      await updatePrayerRequest(item.id, { status: newStatus });
      const updated = { ...item, status: newStatus };
      setCachedRequest(updated);
      onUpdated?.(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSaveNotes = async () => {
    if (!item) return;
    setSavingNotes(true);
    try {
      await updatePrayerRequest(item.id, { notes: notesDraft.trim() });
      const updated = { ...item, notes: notesDraft.trim() };
      setCachedRequest(updated);
      onUpdated?.(updated);
      toast.success("Pastoral notes saved");
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Smooth Backdrop Overlay */}
          <motion.div
            key="prayer-sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Smooth Right Slide-Over Sidebar */}
          <motion.aside
            key="prayer-sidebar-panel"
            initial={{ x: "105%", opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "105%", opacity: 0.6 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 280,
              mass: 0.85,
            }}
            className="fixed top-4 bottom-4 right-4 w-[680px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
          >
            {(() => {
              const fullName = [item.title, item.firstName, item.lastName]
                .filter(Boolean)
                .join(" ");

              const initials =
                `${item.firstName?.[0] || ""}${
                  item.lastName?.[0] || ""
                }`.toUpperCase() || "PR";

              const fullAddress = [
                item.street,
                item.apt,
                `${item.city}, ${item.state} ${item.zip}`,
                item.country,
              ]
                .filter(Boolean)
                .join(", ");

              const statusStyles = getPrayerStatusBadge(item.status);
              const categoryStyles = getCategoryBadge(item.category);

              return (
                <>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#fcfdfc]">
                    <div className="flex items-center gap-4">
                      <h2 className="text-lg font-bold text-black">
                        Prayer Request Details
                      </h2>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <button
                          type="button"
                          onClick={onPrev}
                          disabled={!hasPrev}
                          className="p-1 rounded-lg hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                          title="Previous request"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-medium">Prev / Next</span>
                        <button
                          type="button"
                          onClick={onNext}
                          disabled={!hasNext}
                          className="p-1 rounded-lg hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                          title="Next request"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onDeleted && (
                        <button
                          type="button"
                          onClick={() => onDeleted(item.id)}
                          title="Delete Prayer Request"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-7">
                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white flex items-center justify-center text-xl font-bold shadow-sm shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold text-black">
                              {fullName}
                            </h1>
                            {item.isConfidential && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                <Lock className="w-3 h-3" /> Confidential
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>
                              {item.city}, {item.state} • {item.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <a
                          href={`mailto:${item.email}?subject=${encodeURIComponent(
                            `Standing in Prayer with You — Christ Revelation Church`
                          )}`}
                          className="px-4 py-2 bg-[#0ea5e9] text-white font-semibold rounded-full text-xs sm:text-sm hover:bg-[#0284c7] transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <Mail className="w-4 h-4" /> Email Requester
                        </a>
                      </div>
                    </div>

                    {/* Quick Pill Badges */}
                    <div className="flex flex-wrap gap-2.5">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${categoryStyles.bg} ${categoryStyles.color}`}
                      >
                        <Heart className="w-3.5 h-3.5" /> Category:{" "}
                        {item.category}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyles.bg} ${statusStyles.color}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Status:{" "}
                        {item.status}
                      </div>
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                          item.contactPreference === "yes"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />{" "}
                        {item.contactPreference === "yes"
                          ? "Follow-Up Contact Requested"
                          : "No Contact Requested"}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold border border-gray-200">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* 3 Summary Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                        <p className="text-xs text-gray-400 font-medium mb-1">
                          Prayer Category
                        </p>
                        <p className="text-sm font-bold text-black">
                          {item.category}
                        </p>
                      </div>
                      <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                        <p className="text-xs text-gray-400 font-medium mb-1">
                          Contact Preference
                        </p>
                        <p className="text-sm font-bold text-black">
                          {item.contactPreference === "yes"
                            ? "Yes — Please Contact"
                            : "No Follow-up Needed"}
                        </p>
                      </div>
                      <div className="border border-gray-100 rounded-2xl p-4 bg-white shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                        <p className="text-xs text-gray-400 font-medium mb-1">
                          Confidentiality
                        </p>
                        <p className="text-sm font-bold text-black flex items-center gap-1.5">
                          {item.isConfidential ? (
                            <>
                              <Lock className="w-3.5 h-3.5 text-amber-600" />{" "}
                              Confidential
                            </>
                          ) : (
                            <>
                              <Globe className="w-3.5 h-3.5 text-emerald-600" />{" "}
                              Open to Prayer Team
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Inner Tabs */}
                    <div className="flex items-center gap-6 border-b border-gray-100">
                      {(["Request", "Address", "Notes"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`pb-3 text-sm font-semibold transition-colors ${
                            activeTab === tab
                              ? "text-[#0ea5e9] border-b-2 border-[#0ea5e9] font-bold"
                              : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                          }`}
                        >
                          {tab === "Request"
                            ? "Prayer Request & Contact"
                            : tab === "Address"
                            ? "Address & Location"
                            : "Pastoral Notes"}
                        </button>
                      ))}
                    </div>

                    {/* TAB 1: Request & Contact */}
                    <AnimatePresence mode="wait">
                      {activeTab === "Request" && (
                        <motion.div
                          key="tab-request"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-6"
                        >
                          {/* Prayer Request Text */}
                          <section>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#0ea5e9]" />{" "}
                                Submitted Prayer Request
                              </h3>
                              <span className="text-xs text-gray-400 font-medium">
                                ID: {item.id}
                              </span>
                            </div>
                            <div className="p-5 bg-[#f8f9fa] border border-gray-200/80 rounded-2xl text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
                              &ldquo;{item.request}&rdquo;
                            </div>
                          </section>

                          {/* Requester Identity & Contact */}
                          <section>
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-3">
                              Requester Information
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-400">
                                      Full Name (with Title)
                                    </p>
                                    <p className="text-sm font-bold text-black">
                                      {fullName}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-gray-400 px-2.5 py-1 bg-gray-100 rounded-full">
                                  {item.title || "Member"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between p-3.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-[#0ea5e9] flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-400">
                                      Email Address
                                    </p>
                                    <p className="text-sm font-bold text-black truncate">
                                      {item.email}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopy("Email", item.email)
                                  }
                                  className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
                                >
                                  {copiedField === "Email" ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </section>
                        </motion.div>
                      )}

                      {/* TAB 2: Full Address Details */}
                      {activeTab === "Address" && (
                        <motion.div
                          key="tab-address"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                              Submitted Mailing Address
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy("Address", fullAddress)
                              }
                              className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
                            >
                              {copiedField === "Address" ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />{" "}
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Copy Full
                                  Address
                                </>
                              )}
                            </button>
                          </div>

                          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                            {[
                              {
                                label: "Street Address",
                                value: item.street || "—",
                              },
                              {
                                label: "Apt / Suite / Others",
                                value: item.apt || "—",
                              },
                              { label: "City", value: item.city || "—" },
                              {
                                label: "State / Province",
                                value: item.state || "—",
                              },
                              {
                                label: "Zip / Postal Code",
                                value: item.zip || "—",
                              },
                              { label: "Country", value: item.country || "—" },
                            ].map((row, idx, arr) => (
                              <div
                                key={row.label}
                                className={`flex justify-between items-center p-4 bg-white ${
                                  idx !== arr.length - 1
                                    ? "border-b border-gray-100"
                                    : ""
                                }`}
                              >
                                <span className="text-sm text-gray-500 font-medium">
                                  {row.label}
                                </span>
                                <span className="text-sm font-bold text-black text-right">
                                  {row.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* TAB 3: Pastoral Notes */}
                      {activeTab === "Notes" && (
                        <motion.div
                          key="tab-notes"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-base font-bold text-black">
                                Pastoral &amp; Intercession Notes
                              </h3>
                              <p className="text-xs text-gray-500">
                                Record follow-up calls, prayer assignments, or
                                testimony updates.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleSaveNotes}
                              disabled={savingNotes}
                              className="px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                            >
                              <Save className="w-3.5 h-3.5" />
                              {savingNotes ? "Saving..." : "Save Notes"}
                            </button>
                          </div>

                          <textarea
                            rows={5}
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            placeholder="Write pastoral follow-up notes or prayer team updates here..."
                            className="w-full bg-[#f8f9fa] border border-gray-200 rounded-2xl p-4 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-y"
                          />

                          {!notesDraft && (
                            <div className="p-6 border border-dashed border-gray-200 rounded-2xl text-center">
                              <FileText className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                              <p className="text-xs font-semibold text-gray-500">
                                No pastoral notes recorded yet for this request.
                              </p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer: Update Prayer Request Status */}
                  <div className="p-5 border-t border-gray-100 bg-[#fcfdfc]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Update Prayer Status
                      </span>
                      <span className="text-xs text-gray-400">
                        Submitted{" "}
                        {new Date(item.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {STATUS_OPTIONS.map((st) => {
                        const stStyles = getPrayerStatusBadge(st);
                        const isCurrent = item.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(st)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                              isCurrent
                                ? `${stStyles.bg} ${stStyles.color} shadow-sm`
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
