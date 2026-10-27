'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2,
  Calendar, CalendarDays,
  User, Image as ImageIcon,
  LayoutGrid, Bell, Settings as SettingsIcon,
  Clock, Eye, Activity, ArrowRight
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EventForm, { type AdminEvent } from "@/components/admin/events/EventForm";
import { useEvents, addEvent, updateEvent, deleteEvent } from "@/lib/useEvents";
import { isValidImageSrc } from "@/lib/utils";

const emptyEvent: AdminEvent = {
  id: "",
  title: "",
  subtitle: "",
  type: "GENERAL",
  date: "",
  time: "",
  location: "",
  capacity: "",
  accessibility: "",
  price: "Free",
  status: "Upcoming",
  images: [""],
  description: [""],
  perfectFor: [""],
  agenda: [{ time: "", title: "", desc: "" }],
  highlights: [""],
  host: { name: "", role: "", image: "" },
  views: 0,
};

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
  const { events, isLoading, isError, mutate } = useEvents();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.status === "Upcoming" || e.status === "Open").length,
    totalViews: events.reduce((acc, curr) => acc + (curr.views || 0), 0),
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingEvent({ ...emptyEvent, id: `event-${Date.now()}` });
    setView("form");
  };

  const handleEdit = (event: AdminEvent) => {
    setEditingEvent({ ...event });
    setView("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setDeletingId(id);
    try {
      await deleteEvent(id);
      await mutate();
    } catch (err) {
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!editingEvent) return;
    setSaving(true);
    try {
      const isNew = !events.find(e => e.id === editingEvent.id);
      if (isNew) {
        await addEvent(editingEvent);
      } else {
        await updateEvent(editingEvent.id, editingEvent);
      }
      await mutate();
      setView("list");
      setEditingEvent(null);
    } catch (err) {
      alert("Failed to save event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      {/* ── Header ── */}
      {/* <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Overview</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Event Management</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#173b2b] rounded-full border border-white" />
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header> */}

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
                  <h1 className="text-[26px] font-medium text-black tracking-tight">Events</h1>
                  <p className="text-[14px] text-[#526158] font-medium mt-1">Manage your upcoming and past events.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleAddNew}
                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Plus size={16} /> New Event
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-2">
                {isLoading ? (
                  [0, 1, 2].map(i => <StatSkeleton key={i} />)
                ) : (
                  [
                    { label: "Total Events", value: stats.totalEvents, icon: CalendarDays, color: "text-black", bg: "bg-[#eef5ed]" },
                    { label: "Upcoming / Open", value: stats.upcomingEvents, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Total Page Views", value: stats.totalViews, icon: Eye, color: "text-black", bg: "bg-pink-50" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-[20px] p-6 flex items-center justify-between">
                      <div>
                        <p className="text-[15px] font-medium text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                        <stat.icon size={22} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Event Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                  [0, 1, 2, 3, 4, 5].map(i => <EventCardSkeleton key={i} />)
                ) : isError ? (
                  <div className="col-span-full py-20 text-center border-2 border-red-100 border-dashed rounded-[32px] bg-white">
                    <CalendarDays size={32} className="mx-auto text-red-300 mb-4" />
                    <p className="text-red-500 text-sm font-semibold mb-1">Failed to load events</p>
                    <button onClick={() => mutate()} className="text-sm text-gray-500 underline">Try again</button>
                  </div>
                ) : events.length === 0 ? (
                  /* ── Empty State ── */
                  <div className="col-span-full py-28 flex flex-col items-center justify-center text-center border-2 border-gray-200 border-dashed rounded-[32px] bg-white">
                    <CalendarDays size={48} className="text-gray-200 mb-5" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No events yet</h3>
                    <p className="text-gray-400 text-sm mb-8 max-w-xs">
                      Create your first event to get started. It will appear here once published.
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
                    <CalendarDays size={32} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-sm font-medium">No events match your search.</p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => router.push(`/admin/events/${event.id}`)}
                      className="bg-white rounded-[32px] p-3.5 border border-gray-100 flex flex-col transition-all duration-300 group cursor-pointer hover:border-gray-300 hover:shadow-lg"
                    >
                      {/* Image */}
                      <div className="relative w-full h-[240px] rounded-[24px] overflow-hidden mb-6 bg-[#f4f8f4]">
                        {isValidImageSrc(event.images[0]) ? (
                          <Image
                            src={event.images[0]}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <ImageIcon size={32} />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-[#0ea5e9] px-3 py-1.5 rounded-full">
                          <span className="text-[13px] font-bold text-white tracking-tight">{event.status}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-3 pb-2 flex-grow flex flex-col">
                        <div className="flex items-baseline gap-2 mb-1">
                          <h3 className="text-[22px] font-bold text-gray-900 tracking-tight line-clamp-1">{event.title}</h3>
                          <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap truncate">{event.type}</span>
                        </div>
                        <p className="text-[14px] text-gray-600 font-medium mb-5 flex items-center gap-1.5">
                          <span className="text-gray-900 font-semibold">{event.host.name}</span>
                          <span className="text-gray-300">•</span>
                          {event.location}
                        </p>

                        <div className="w-full h-px bg-gray-100 mb-5" />

                        <div className="flex items-center justify-center gap-6 mb-5 px-2">
                          <div className="flex items-center gap-2 text-gray-600 flex-1 justify-center">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-[13px] font-semibold">{event.date}</span>
                          </div>
                          <div className="h-6 w-px bg-gray-200" />
                          <div className="flex items-center gap-2 text-gray-600 flex-1 justify-center">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-[13px] font-semibold">{event.time}</span>
                          </div>
                        </div>

                        <div className="w-full h-px bg-gray-100 mb-5" />

                        <div className="flex items-center justify-between mt-auto px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 relative border border-gray-200">
                              {isValidImageSrc(event.host.image) ? (
                                <Image src={event.host.image} alt={event.host.name} fill className="object-cover" />
                              ) : (
                                <User size={14} className="m-auto text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <span className="text-xs font-semibold text-gray-900">{event.host.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                              disabled={deletingId === event.id}
                              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-black transition-colors disabled:opacity-40"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ── FORM VIEW ── */}
          {view === "form" && editingEvent && (
            <EventForm
              event={editingEvent}
              onChange={setEditingEvent}
              onSave={handleSave}
              onCancel={() => { setView("list"); setEditingEvent(null); }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
