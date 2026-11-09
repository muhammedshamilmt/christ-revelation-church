"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  CalendarDays,
  User,
  Image as ImageIcon,
  Clock,
  Eye,
  Activity,
  Users,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EventForm, {
  type AdminEvent,
  EVENT_TYPES,
} from "@/components/admin/events/EventForm";
import {
  useEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/useEvents";
import { useAllRegistrations } from "@/lib/useRegistrations";
import { isValidImageSrc } from "@/lib/utils";
import { useConfirm } from "@/components/ui/ConfirmDialogProvider";
import toast from "react-hot-toast";

const emptyEvent: AdminEvent = {
  id: "",
  title: "",
  subtitle: "",
  type: "GENERAL",
  date: "",
  time: "10:00 AM - 01:00 PM",
  location: "Main Auditorium",
  capacity: "300 Attendees",
  accessibility: "Wheelchair accessible & welcoming",
  price: "Free",
  status: "Open",
  images: ["/images/hero-bg.png"],
  description: [""],
  perfectFor: ["Families", "Youth & Adults"],
  agenda: [{ time: "10:00 AM", title: "Opening Worship & Welcome", desc: "" }],
  highlights: ["Live Worship", "Community Fellowship"],
  host: {
    name: "Pastor David Vance",
    role: "Senior Pastor",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  views: 0,
};

function isUnoptimizedImg(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.endsWith(".svg")
  );
}

// ── Skeleton card ──
function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-[32px] p-3.5 border border-gray-100 flex flex-col animate-pulse">
      <div className="w-full h-[240px] rounded-[24px] bg-gray-200 mb-6" />
      <div className="px-3 pb-2 flex flex-col gap-3">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-px bg-gray-100 my-1" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-px bg-gray-100 my-1" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="h-3 bg-gray-200 rounded w-20" />
          </div>
          <div className="flex gap-1">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="w-8 h-8 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 flex items-center justify-between animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-12" />
      </div>
      <div className="w-12 h-12 rounded-full bg-gray-200" />
    </div>
  );
}

export default function AdminEventPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const { events, isLoading, isError, mutate } = useEvents();
  const { registrations } = useAllRegistrations();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [originalEventId, setOriginalEventId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(
      (e) => e.status === "Upcoming" || e.status === "Open"
    ).length,
    totalRegistrations: registrations.length,
    totalViews: events.reduce((acc, curr) => acc + (curr.views || 0), 0),
  };

  const filteredEvents = events.filter((e) => {
    const matchesType = activeType === "All" || e.type === activeType;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.host?.name?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const handleAddNew = () => {
    setOriginalEventId(null);
    setEditingEvent({ ...emptyEvent, id: `event-${Date.now()}` });
    setView("form");
  };

  const handleEdit = (event: AdminEvent) => {
    setOriginalEventId(event.id);
    setEditingEvent({ ...event });
    setView("form");
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Event",
      message: "Are you sure you want to delete this event? This action cannot be undone and will remove all registrations.",
      confirmText: "Delete Event",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    setDeletingId(id);
    try {
      await deleteEvent(id);
      await mutate();
      toast.success("Event deleted successfully");
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async (finalEvent?: AdminEvent) => {
    const payload = finalEvent || editingEvent;
    if (!payload) return;
    try {
      const isNew = !originalEventId;
      if (isNew) {
        await addEvent(payload);
        toast.success("Event created successfully");
      } else {
        await updateEvent(originalEventId, payload);
        toast.success("Event updated successfully");
      }
      await mutate();
      setView("list");
      setEditingEvent(null);
      setOriginalEventId(null);
    } catch {
      toast.error("Failed to save event. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      <div className="p-8 flex-1">
        <AnimatePresence mode="wait">
          {/* ── LIST VIEW ── */}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* Title + actions */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                  <h1 className="text-[26px] font-medium text-black tracking-tight">
                    Events Management
                  </h1>
                  <p className="text-[14px] text-[#526158] font-medium mt-1">
                    Manage your upcoming church conferences, outreach drives,
                    and registrations.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search events or venue..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <Link
                    href="/events"
                    target="_blank"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
                  >
                    <ExternalLink size={13} /> View /events
                  </Link>
                  <button
                    onClick={handleAddNew}
                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Plus size={16} /> New Event
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                  [0, 1, 2, 3].map((i) => <StatSkeleton key={i} />)
                ) : (
                  [
                    {
                      label: "Total Events",
                      value: stats.totalEvents,
                      icon: CalendarDays,
                      color: "text-black",
                      bg: "bg-[#eef5ed]",
                    },
                    {
                      label: "Upcoming / Open",
                      value: stats.upcomingEvents,
                      icon: Activity,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Total Registrations",
                      value: stats.totalRegistrations,
                      icon: Users,
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                    {
                      label: "Total Page Views",
                      value: stats.totalViews.toLocaleString(),
                      icon: Eye,
                      color: "text-purple-600",
                      bg: "bg-purple-50",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-100 rounded-[20px] p-6 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[14px] font-medium text-gray-400 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}
                      >
                        <stat.icon size={22} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Type Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {["All", ...EVENT_TYPES].map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                      activeType === type
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Event Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                  [0, 1, 2, 3, 4, 5].map((i) => <EventCardSkeleton key={i} />)
                ) : isError ? (
                  <div className="col-span-full py-20 text-center border-2 border-red-100 border-dashed rounded-[32px] bg-white">
                    <CalendarDays
                      size={32}
                      className="mx-auto text-red-300 mb-4"
                    />
                    <p className="text-red-500 text-sm font-semibold mb-1">
                      Failed to load events
                    </p>
                    <button
                      onClick={() => mutate()}
                      className="text-sm text-gray-500 underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : events.length === 0 ? (
                  <div className="col-span-full py-28 flex flex-col items-center justify-center text-center border-2 border-gray-200 border-dashed rounded-[32px] bg-white">
                    <CalendarDays size={48} className="text-gray-200 mb-5" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No events yet
                    </h3>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs">
                      Create your first event to get started. It will appear
                      here once published.
                    </p>
                    <button
                      onClick={handleAddNew}
                      className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Plus size={16} /> Create First Event
                    </button>
                  </div>
                ) : filteredEvents.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-gray-200 border-dashed rounded-[32px] bg-white">
                    <CalendarDays
                      size={32}
                      className="mx-auto text-gray-300 mb-4"
                    />
                    <p className="text-gray-500 text-sm font-medium">
                      No events match your search or category filter.
                    </p>
                  </div>
                ) : (
                  filteredEvents.map((event) => {
                    const eventRegsCount = registrations.filter(
                      (r) => r.event_id === event.id
                    ).length;
                    const coverImg = event.images?.[0] || "/images/hero-bg.png";

                    return (
                      <div
                        key={event.id}
                        onClick={() => router.push(`/admin/events/${event.id}`)}
                        className="bg-white rounded-[32px] p-3.5 border border-gray-100 flex flex-col transition-all duration-300 group cursor-pointer hover:border-gray-300 hover:shadow-lg"
                      >
                        {/* Image */}
                        <div className="relative w-full h-[240px] rounded-[24px] overflow-hidden mb-6 bg-[#f4f8f4]">
                          {isValidImageSrc(coverImg) ||
                          isUnoptimizedImg(coverImg) ? (
                            isUnoptimizedImg(coverImg) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={coverImg}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                              />
                            ) : (
                              <Image
                                src={coverImg}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                              />
                            )
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                              <ImageIcon size={32} />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-[12px] font-bold text-white tracking-tight ${
                                event.status === "Open"
                                  ? "bg-emerald-500"
                                  : event.status === "Upcoming"
                                  ? "bg-[#0ea5e9]"
                                  : "bg-gray-600"
                              }`}
                            >
                              {event.status}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 backdrop-blur-md text-white">
                              {eventRegsCount} Regs
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="px-3 pb-2 flex-grow flex flex-col">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <h3 className="text-[20px] font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#0ea5e9] transition-colors">
                              {event.title}
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                              {event.type}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-500 font-medium mb-4 line-clamp-2">
                            {event.subtitle || event.description?.[0]}
                          </p>

                          <div className="w-full h-px bg-gray-100 mb-4" />

                          <div className="flex items-center justify-between gap-3 mb-4 px-1 text-gray-600">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Calendar className="w-3.5 h-3.5 text-[#0ea5e9] shrink-0" />
                              <span className="text-[12px] font-semibold truncate">
                                {event.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="text-[12px] font-semibold truncate">
                                {event.location}
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-px bg-gray-100 mb-4" />

                          <div className="flex items-center justify-between mt-auto px-1">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 relative border border-gray-200 shrink-0">
                                {isValidImageSrc(event.host.image) ||
                                isUnoptimizedImg(event.host.image) ? (
                                  isUnoptimizedImg(event.host.image) ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={event.host.image}
                                      alt={event.host.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src={event.host.image}
                                      alt={event.host.name}
                                      fill
                                      className="object-cover"
                                    />
                                  )
                                ) : (
                                  <User
                                    size={14}
                                    className="m-auto text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                  />
                                )}
                              </div>
                              <span className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">
                                {event.host.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Link
                                href={`/events/${event.id}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                title="View public event page"
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0ea5e9] transition-colors"
                              >
                                <ExternalLink size={14} />
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(event);
                                }}
                                title="Edit event"
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(event.id);
                                }}
                                disabled={deletingId === event.id}
                                title="Delete event"
                                className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* ── FORM VIEW ── */}
          {view === "form" && editingEvent && (
            <EventForm
              event={editingEvent}
              isNew={!originalEventId}
              onChange={setEditingEvent}
              onSave={handleSave}
              onCancel={() => {
                setView("list");
                setEditingEvent(null);
                setOriginalEventId(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
