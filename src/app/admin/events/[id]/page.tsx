"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Zap,
  CheckCircle2,
  Mail,
  Phone,
  Info,
  Calendar,
  Search,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Check,
  Activity,
  X,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EventForm, { type AdminEvent } from "@/components/admin/events/EventForm";
import { useEvent, updateEvent, deleteEvent } from "@/lib/useEvents";
import {
  useEventRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  type RegistrationData,
} from "@/lib/useRegistrations";
import { isValidImageSrc } from "@/lib/utils";
import { useConfirm } from "@/components/ui/ConfirmDialogProvider";
import toast from "react-hot-toast";

const STATUS_CFG = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-600",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-500",
  },
};

function isUnoptimizedImg(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.endsWith(".svg")
  );
}

// ── Local Button ──
const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
}) => {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#0ea5e9] text-white hover:bg-[#0284c7] px-4 py-2 text-sm",
    outline:
      "border border-[#e6ece7] text-black hover:bg-[#f4f8f4] px-4 py-2 text-sm bg-white",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ── Skeleton UI ──
function DetailSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-[14px] bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-32 rounded bg-gray-200" />
          <div className="h-8 w-64 rounded-lg bg-gray-200" />
        </div>
      </div>
      <div className="h-64 rounded-3xl bg-gray-200" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-5/6 bg-gray-200 rounded" />
          <div className="h-4 w-4/6 bg-gray-200 rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          <div className="h-32 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function EventAdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { confirm } = useConfirm();

  const { event, isLoading, isError, mutate } = useEvent(id);

  const [localEvent, setLocalEvent] = useState(event);
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");
  const [tab, setTab] = useState<"general" | "registrations">("general");
  const [search, setSearch] = useState("");
  const [toggling, setToggling] = useState(false);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sidebarApplicant, setSidebarApplicant] =
    useState<RegistrationData | null>(null);

  // Sync local state when SWR data arrives
  React.useEffect(() => {
    if (event) setLocalEvent(event);
  }, [event]);

  // Fetch dynamic registrations
  const {
    registrations,
    isLoading: regsLoading,
    mutate: mutateRegs,
  } = useEventRegistrations(id);

  const filteredApps = registrations.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  const appStats = {
    total: registrations.length,
    pending: registrations.filter((a) => a.status === "pending").length,
    confirmed: registrations.filter((a) => a.status === "confirmed").length,
    cancelled: registrations.filter((a) => a.status === "cancelled").length,
  };

  const toggleStatus = async () => {
    if (!localEvent) return;
    const newStatus = localEvent.status === "Open" ? "Closing" : "Open";
    setToggling(true);
    try {
      await updateEvent(id, { status: newStatus });
      setLocalEvent({ ...localEvent, status: newStatus });
      await mutate();
      toast.success(`Event status changed to ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setToggling(false);
    }
  };

  const handleSaveEvent = async (finalEvent?: AdminEvent) => {
    const payload = finalEvent || localEvent;
    if (!payload) return;
    try {
      await updateEvent(id, payload);
      await mutate();
      setLocalEvent(payload);
      setViewMode("preview");
      toast.success("Event updated successfully");
      if (payload.id && payload.id !== id) {
        router.replace(`/admin/events/${payload.id}`);
      }
    } catch {
      toast.error("Failed to save event. Please try again.");
    }
  };

  const handleDeleteEvent = async () => {
    if (!localEvent) return;
    const ok = await confirm({
      title: "Delete Event",
      message: `Are you sure you want to delete "${localEvent.title}" permanently? All attendees and registrations will also be removed.`,
      confirmText: "Delete Event",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await deleteEvent(localEvent.id);
      toast.success("Event deleted permanently");
      router.push("/admin/events");
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  const handleApplicantStatusChange = async (
    regId: string,
    newStatus: RegistrationData["status"]
  ) => {
    await updateRegistrationStatus(id, regId, newStatus);
    await mutateRegs();
    if (sidebarApplicant && sidebarApplicant._id === regId) {
      setSidebarApplicant({ ...sidebarApplicant, status: newStatus });
    }
    toast.success(`Registration status updated to ${newStatus}`);
  };

  const handleDeleteApplicant = async (regId: string) => {
    const ok = await confirm({
      title: "Remove Registration",
      message: "Are you sure you want to remove this applicant from the event registration list?",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await deleteRegistration(id, regId);
      await mutateRegs();
      setSidebarApplicant(null);
      toast.success("Registration removed");
    } catch {
      toast.error("Failed to remove registration.");
    }
  };

  const toggleSelectRow = (rowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(rowId) ? prev.filter((i) => i !== rowId) : [...prev, rowId]
    );
  };

  // ── Loading ──
  if (isLoading) return <DetailSkeleton />;

  // ── Error ──
  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <Calendar className="w-12 h-12 text-red-300" />
        <p className="text-red-500 font-semibold">Failed to load event.</p>
        <button
          onClick={() => mutate()}
          className="text-sm text-gray-500 underline"
        >
          Retry
        </button>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );

  // ── Not found ──
  if (!event || !localEvent)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Calendar className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 font-semibold">Event not found.</p>
        <Button variant="outline" onClick={() => router.push("/admin/events")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
        </Button>
      </div>
    );

  const heroImg = localEvent.images?.[0] || "/images/hero-bg.png";

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 relative overflow-hidden">
      {/* ── Sidebar Overlay ── */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          sidebarApplicant ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarApplicant(null)}
      />

      {/* ── Registration Details Sidebar ── */}
      <div
        className={`fixed top-4 bottom-4 right-4 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-[#e6ece7] z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform ${
          sidebarApplicant ? "translate-x-0" : "translate-x-[120%]"
        }`}
      >
        {sidebarApplicant &&
          (() => {
            const cfg = STATUS_CFG[sidebarApplicant.status];
            return (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-[#fcfdfc]">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#f4f8f4] flex items-center justify-center text-xl font-bold text-black border border-[#e6ece7]">
                        {sidebarApplicant.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-xl tracking-tight">
                          {sidebarApplicant.name}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${cfg.bg} border ${cfg.border} ${cfg.text} mt-1.5 inline-block`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSidebarApplicant(null)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Contact Information
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f4f8f4] flex items-center justify-center border border-[#e6ece7] shrink-0">
                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-black truncate">
                            {sidebarApplicant.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#f4f8f4] flex items-center justify-center border border-[#e6ece7] shrink-0">
                            <Phone className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <p className="text-sm font-medium text-black">
                            {sidebarApplicant.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-100" />

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Registration Details
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4">
                          <p className="text-[11px] font-medium text-gray-400 mb-1">
                            Guests
                          </p>
                          <p className="text-sm font-bold text-black">
                            {sidebarApplicant.guests}
                          </p>
                        </div>
                        <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4">
                          <p className="text-[11px] font-medium text-gray-400 mb-1">
                            Dietary
                          </p>
                          <p className="text-sm font-bold text-black">
                            {sidebarApplicant.dietary}
                          </p>
                        </div>
                        <div className="bg-[#fcfdfc] border border-gray-100 rounded-2xl p-4 col-span-2">
                          <p className="text-[11px] font-medium text-gray-400 mb-1">
                            Registered On
                          </p>
                          <p className="text-sm font-bold text-black">
                            {new Date(
                              sidebarApplicant.appliedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {sidebarApplicant.message && (
                      <>
                        <div className="w-full h-px bg-gray-100" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Additional Notes
                          </h4>
                          <div className="bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl p-4 text-sm text-black leading-relaxed">
                            &ldquo;{sidebarApplicant.message}&rdquo;
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-[#fcfdfc] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Update Status
                    </h4>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteApplicant(sidebarApplicant._id)
                      }
                      className="text-xs font-bold text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["pending", "confirmed", "cancelled"] as const).map(
                      (s) => {
                        const scfg = STATUS_CFG[s];
                        const isSelected = sidebarApplicant.status === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              handleApplicantStatusChange(
                                sidebarApplicant._id,
                                s
                              )
                            }
                            className={`py-2 px-2 rounded-[14px] text-xs font-bold transition-all border ${
                              isSelected
                                ? `${scfg.bg} ${scfg.border} ${scfg.text}`
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            {scfg.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </>
            );
          })()}
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {viewMode === "preview" ? (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => router.push("/admin/events")}
                  className="mt-1 w-10 h-10 rounded-[14px] border border-[#e6ece7] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-black" />
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-black uppercase tracking-wider">
                      {localEvent.type}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs font-semibold text-gray-500">
                      Created{" "}
                      {localEvent.createdAt
                        ? new Date(localEvent.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-black">
                    {localEvent.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap pl-14 md:pl-0">
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-bold text-white ${
                    localEvent.status === "Open"
                      ? "bg-[#22c55e]"
                      : localEvent.status === "Upcoming"
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }`}
                >
                  {localEvent.status === "Open"
                    ? "Open for Registration"
                    : localEvent.status}
                </span>
                <button
                  onClick={toggleStatus}
                  disabled={toggling}
                  title="Toggle status"
                  className="w-10 h-10 rounded-[14px] border border-[#e6ece7] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {localEvent.status === "Open" ? (
                    <ToggleRight className="w-5 h-5 text-[#22c55e]" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                <Link
                  href={`/events/${localEvent.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6ece7] bg-white hover:bg-[#f4f8f4] px-4 py-2 text-sm font-semibold text-black transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Public Page
                </Link>
                <Button variant="outline" onClick={() => setViewMode("edit")}>
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Details
                </Button>
                <button
                  onClick={handleDeleteEvent}
                  title="Delete Event"
                  className="w-10 h-10 rounded-xl border border-red-100 bg-red-50/70 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            {(isValidImageSrc(heroImg) || isUnoptimizedImg(heroImg)) && (
              <div className="relative w-full h-[320px] rounded-[32px] overflow-hidden bg-[#f4f8f4]">
                {isUnoptimizedImg(heroImg) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={heroImg}
                    alt={localEvent.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={heroImg}
                    alt={localEvent.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 border-b border-[#e6ece7] pb-px">
              {(["general", "registrations"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-6 py-3 text-sm font-bold capitalize transition-all border-b-2 ${
                    tab === t
                      ? "border-[#0ea5e9] text-[#0ea5e9]"
                      : "border-transparent text-gray-400 hover:text-[#0ea5e9] hover:border-gray-200"
                  }`}
                >
                  {t === "registrations"
                    ? `Registrations (${registrations.length})`
                    : "General Overview"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* GENERAL TAB */}
              {tab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid lg:grid-cols-3 gap-6"
                >
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                      <h3 className="text-lg font-bold text-black mb-4">
                        About the Event
                      </h3>
                      <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                        {localEvent.description.map((desc, i) => (
                          <p key={i}>{desc}</p>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                      <h3 className="text-lg font-bold text-black mb-6">
                        Agenda
                      </h3>
                      <div className="space-y-6">
                        {localEvent.agenda.map((item, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="w-20 flex-shrink-0 text-sm font-bold text-gray-400 pt-0.5">
                              {item.time}
                            </div>
                            <div className="flex-1 pb-6 border-b border-[#e6ece7] last:border-0 last:pb-0">
                              <h4 className="text-base font-bold text-black mb-1">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                        <h3 className="text-lg font-bold text-black mb-5">
                          Highlights
                        </h3>
                        <ul className="space-y-4">
                          {localEvent.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm font-medium text-gray-600"
                            >
                              <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                        <h3 className="text-lg font-bold text-black mb-5">
                          Perfect For
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {localEvent.perfectFor.map((p, i) => (
                            <span
                              key={i}
                              className="px-3.5 py-1.5 bg-[#f4f8f4] text-black text-xs font-bold rounded-full border border-[#e6ece7]"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-6">
                      <h3 className="text-lg font-bold text-black">
                        Event Details
                      </h3>
                      <div className="space-y-5">
                        {[
                          {
                            icon: Calendar,
                            label: "Date",
                            value: localEvent.date,
                          },
                          {
                            icon: Clock,
                            label: "Time",
                            value: localEvent.time,
                          },
                          {
                            icon: MapPin,
                            label: "Location",
                            value: localEvent.location,
                          },
                          {
                            icon: Users,
                            label: "Capacity",
                            value: localEvent.capacity,
                          },
                          {
                            icon: Zap,
                            label: "Price",
                            value: localEvent.price,
                          },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#f4f8f4] border border-[#e6ece7] flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-black" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-0.5">
                                {label}
                              </p>
                              <p className="text-sm font-bold text-black">
                                {value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                      <h3 className="text-lg font-bold text-black mb-5">
                        Registration Stats
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            label: "Total",
                            value: appStats.total,
                            color: "text-black",
                            bg: "bg-gray-100",
                          },
                          {
                            label: "Pending",
                            value: appStats.pending,
                            color: "text-yellow-600",
                            bg: "bg-yellow-100",
                          },
                          {
                            label: "Confirmed",
                            value: appStats.confirmed,
                            color: "text-[#22c55e]",
                            bg: "bg-green-100",
                          },
                          {
                            label: "Cancelled",
                            value: appStats.cancelled,
                            color: "text-red-500",
                            bg: "bg-red-100",
                          },
                        ].map((s) => (
                          <div
                            key={s.label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-sm font-bold text-gray-500">
                              {s.label}
                            </span>
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-bold ${s.bg} ${s.color}`}
                            >
                              {s.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* REGISTRATIONS TAB */}
              {tab === "registrations" && (
                <motion.div
                  key="registrations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full flex flex-col pb-12"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search applicant or email..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-[#e6ece7] text-black text-sm font-semibold placeholder:font-normal placeholder:text-gray-400 focus:outline-none focus:border-[#0ea5e9]"
                      />
                    </div>
                  </div>

                  {regsLoading ? (
                    <div className="p-8 space-y-4 bg-white border border-gray-200 rounded-[20px]">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-gray-100 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : registrations.length === 0 ? (
                    <div className="py-28 flex flex-col items-center justify-center text-center border-2 border-gray-200 border-dashed rounded-[32px] bg-white">
                      <Users className="w-12 h-12 text-gray-200 mb-5" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No registrations yet
                      </h3>
                      <p className="text-gray-400 text-sm max-w-xs">
                        Registrations will appear here once attendees sign up on
                        the public event page.
                      </p>
                    </div>
                  ) : (
                    <div
                      className="rounded-[20px] p-2 bg-[#f8f9fa] border border-[#e6ece7] shadow-sm w-full"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.01) 4px, rgba(0,0,0,0.01) 8px)",
                      }}
                    >
                      <div className="bg-white rounded-[14px] border border-gray-100 overflow-hidden flex flex-col">
                        <div className="overflow-x-auto w-full">
                          <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                              <tr className="border-b border-gray-200/80 bg-[#fafafa]">
                                <th className="py-3 pl-4 pr-3 border-r border-gray-200/60 w-10">
                                  <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-[4px] border border-gray-300 bg-white" />
                                  </div>
                                </th>
                                <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px]">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />{" "}
                                    Applicant
                                  </div>
                                </th>
                                <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px]">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-400" />{" "}
                                    Email
                                  </div>
                                </th>
                                <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px]">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-400" />{" "}
                                    Guests
                                  </div>
                                </th>
                                <th className="py-3 px-4 border-r border-gray-200/60 font-semibold text-gray-600 text-[13px]">
                                  <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-gray-400" />{" "}
                                    Dietary
                                  </div>
                                </th>
                                <th className="py-3 px-4 font-semibold text-gray-600 text-[13px]">
                                  <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-gray-400" />{" "}
                                    Status
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredApps.map((app, idx) => {
                                const cfg = STATUS_CFG[app.status];
                                return (
                                  <tr
                                    key={idx}
                                    onClick={() => setSidebarApplicant(app)}
                                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
                                  >
                                    <td
                                      className="py-3 pl-4 pr-3 border-r border-gray-100"
                                      onClick={(e) =>
                                        toggleSelectRow(app._id, e)
                                      }
                                    >
                                      <div className="flex items-center justify-center">
                                        <div
                                          className={`w-4 h-4 rounded-[4px] border flex items-center justify-center ${
                                            selectedRows.includes(app._id)
                                              ? "bg-[#0ea5e9] border-[#0ea5e9]"
                                              : "border-gray-300 bg-white"
                                          }`}
                                        >
                                          {selectedRows.includes(app._id) && (
                                            <Check
                                              className="w-3 h-3 text-white"
                                              strokeWidth={3}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 border-r border-gray-100">
                                      <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-full bg-[#f4f8f4] border border-[#e6ece7] flex items-center justify-center text-xs font-bold text-black shrink-0">
                                          {app.name[0]}
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-800">
                                          {app.name}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 border-r border-gray-100">
                                      <span className="text-[13px] font-medium text-gray-600">
                                        {app.email}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 border-r border-gray-100">
                                      <span className="text-[13px] font-bold text-gray-800">
                                        {app.guests}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 border-r border-gray-100">
                                      <span className="text-[13px] font-medium text-gray-600">
                                        {app.dietary}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border}`}
                                      >
                                        <span
                                          className={`text-[11px] font-bold uppercase tracking-wide ${cfg.text}`}
                                        >
                                          {cfg.label}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {filteredApps.length === 0 && (
                                <tr>
                                  <td
                                    colSpan={6}
                                    className="py-12 text-center text-gray-500 font-medium"
                                  >
                                    No applicants found matching your search.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* ── EDIT MODE — shared EventForm component ── */
          <EventForm
            event={localEvent}
            isNew={false}
            onChange={setLocalEvent}
            onSave={handleSaveEvent}
            onCancel={() => {
              setLocalEvent(event);
              setViewMode("preview");
            }}
          />
        )}
      </div>
    </div>
  );
}
