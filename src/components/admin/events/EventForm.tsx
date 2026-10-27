'use client';

import React, { useState } from "react";
import { useFormDraft } from "@/lib/useFormDraft";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, AlignLeft, MapPin, Clock, User,
  Image as ImageIcon, Check, Plus, Trash2, X, Heart, Loader2
} from "lucide-react";
import Image from "next/image";
import { isValidImageSrc } from "@/lib/utils";

export type AdminEvent = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  date: string;
  time: string;
  location: string;
  capacity: string;
  accessibility: string;
  price: string;
  status: "Upcoming" | "Open" | "Closing" | "Past";
  images: string[];
  description: string[];
  perfectFor: string[];
  agenda: { time: string; title: string; desc: string }[];
  highlights: string[];
  host: { name: string; role: string; image: string };
  views?: number;
  createdAt?: string;
};

export const EVENT_STATUSES = ["Upcoming", "Open", "Closing", "Past"] as const;
export const EVENT_TYPES = ["COMMUNITY OUTREACH", "CONFERENCE", "WORKSHOP", "FUNDRAISER", "GENERAL"] as const;

interface EventFormProps {
  event: AdminEvent;
  onChange: (event: AdminEvent) => void;
  onSave: () => void;
  onCancel: () => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
    {children}
  </label>
);

const InputCls = "w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-2.5 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] transition-colors";

export default function EventForm({ event, onChange, onSave, onCancel }: EventFormProps) {
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<AdminEvent>) => onChange({ ...event, ...patch });

  // ── Auto-save draft to localStorage ──
  const draftKey = event?.id ? `draft:event:${event.id}` : "";
  const { hasDraft, clearDraft, lastSaved } = useFormDraft(
    draftKey,
    event,
    onChange
  );

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      clearDraft();   // wipe draft on successful save
      onSave();
      setSaving(false);
    }, 600);
  };

  return (
    <motion.div
      key="event-form"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto w-full flex flex-col gap-6"
    >
      {/* ── Sticky Action Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-[#e6ece7] rounded-full p-3 sticky top-4 z-30 shadow-lg gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
        >
          <ArrowLeft size={16} /> Discard Changes
        </button>

        <div className="flex bg-[#f4f8f4] border border-[#e6ece7] rounded-full p-1">
          <button
            onClick={() => setFormTab("edit")}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${formTab === "edit" ? "bg-white text-black shadow-sm border border-gray-200" : "text-gray-500 hover:text-black"}`}
          >
            Edit Event
          </button>
          <button
            onClick={() => setFormTab("preview")}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${formTab === "preview" ? "bg-white text-black shadow-sm border border-gray-200" : "text-gray-500 hover:text-black"}`}
          >
            Preview Mode
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-60 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Event"}
          </button>
        </div>
      </div>

      {/* ── Edit Grid ── */}
      {formTab === "edit" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Main Column ── */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic Details */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-5">
              <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-2">
                <AlignLeft size={20} className="text-black" /> Event Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Label>Title</Label>
                  <input type="text" value={event.title} onChange={(e) => set({ title: e.target.value })} className={InputCls} placeholder="Event title" />
                </div>
                <div className="md:col-span-2">
                  <Label>Subtitle / Short Description</Label>
                  <input type="text" value={event.subtitle} onChange={(e) => set({ subtitle: e.target.value })} className={InputCls} placeholder="Short description" />
                </div>
                <div>
                  <Label>URL Slug</Label>
                  <input type="text" value={event.id} onChange={(e) => set({ id: e.target.value })} className={InputCls} placeholder="my-event-slug" />
                </div>
                <div>
                  <Label>Type</Label>
                  <select value={event.type} onChange={(e) => set({ type: e.target.value })} className={InputCls}>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Description & Perfect For */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">Description Paragraphs</h3>
                {event.description.map((desc, idx) => (
                  <div key={idx} className="flex gap-2 mb-3">
                    <textarea
                      value={desc}
                      onChange={(e) => {
                        const newDesc = [...event.description];
                        newDesc[idx] = e.target.value;
                        set({ description: newDesc });
                      }}
                      rows={3}
                      className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-none transition-colors"
                      placeholder="Paragraph text…"
                    />
                    <button
                      onClick={() => {
                        const newDesc = event.description.filter((_, i) => i !== idx);
                        set({ description: newDesc.length ? newDesc : [""] });
                      }}
                      className="p-3 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-2xl shrink-0 h-fit transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => set({ description: [...event.description, ""] })}
                  className="text-sm font-bold text-black flex items-center gap-1 hover:text-black transition-colors"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>

              {/* Perfect For */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">Perfect For</h3>
                {event.perfectFor.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newArr = [...event.perfectFor];
                        newArr[idx] = e.target.value;
                        set({ perfectFor: newArr });
                      }}
                      className={InputCls}
                      placeholder="e.g. Individuals seeking support"
                    />
                    <button
                      onClick={() => {
                        const newArr = event.perfectFor.filter((_, i) => i !== idx);
                        set({ perfectFor: newArr.length ? newArr : [""] });
                      }}
                      className="p-2.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-full shrink-0 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => set({ perfectFor: [...event.perfectFor, ""] })}
                  className="text-sm font-bold text-black flex items-center gap-1 hover:text-black transition-colors"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
            </div>

            {/* Agenda / Schedule */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-5">
              <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-4">
                <Clock size={20} className="text-black" /> Event Schedule
              </h3>
              {event.agenda.map((item, idx) => (
                <div key={idx} className="bg-[#f4f8f4] border border-[#e6ece7] p-5 rounded-2xl relative mb-4">
                  <button
                    onClick={() => {
                      const newAgenda = event.agenda.filter((_, i) => i !== idx);
                      set({ agenda: newAgenda.length ? newAgenda : [{ time: "", title: "", desc: "" }] });
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="col-span-1">
                      <Label>Time</Label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const a = [...event.agenda];
                          a[idx] = { ...a[idx], time: e.target.value };
                          set({ agenda: a });
                        }}
                        className="w-full bg-white border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] transition-colors"
                        placeholder="10:00"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Title</Label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const a = [...event.agenda];
                          a[idx] = { ...a[idx], title: e.target.value };
                          set({ agenda: a });
                        }}
                        className="w-full bg-white border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] transition-colors"
                        placeholder="Session title"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea
                      value={item.desc}
                      onChange={(e) => {
                        const a = [...event.agenda];
                        a[idx] = { ...a[idx], desc: e.target.value };
                        set({ agenda: a });
                      }}
                      rows={2}
                      className="w-full bg-white border border-[#e6ece7] rounded-2xl px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] resize-none transition-colors"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => set({ agenda: [...event.agenda, { time: "", title: "", desc: "" }] })}
                className="w-full py-4 border-2 border-[#e6ece7] border-dashed rounded-2xl text-sm font-bold text-gray-500 hover:bg-[#f4f8f4] hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Schedule Item
              </button>
            </div>
          </div>

          {/* ── Sidebar Column ── */}
          <div className="space-y-6">

            {/* Logistics */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin size={16} className="text-black" /> Logistics
              </h3>

              <div>
                <Label>Status</Label>
                <select value={event.status} onChange={(e) => set({ status: e.target.value as AdminEvent["status"] })} className={InputCls}>
                  {EVENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <input type="text" value={event.date} onChange={(e) => set({ date: e.target.value })} className={InputCls} placeholder="18 Oct 2026" />
                </div>
                <div>
                  <Label>Time</Label>
                  <input type="text" value={event.time} onChange={(e) => set({ time: e.target.value })} className={InputCls} placeholder="10:00 AM" />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <input type="text" value={event.location} onChange={(e) => set({ location: e.target.value })} className={InputCls} placeholder="Venue name, City" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Capacity</Label>
                  <input type="text" value={event.capacity} onChange={(e) => set({ capacity: e.target.value })} className={InputCls} placeholder="200 attendees" />
                </div>
                <div>
                  <Label>Price</Label>
                  <input type="text" value={event.price} onChange={(e) => set({ price: e.target.value })} className={InputCls} placeholder="Free / $49" />
                </div>
              </div>
              <div>
                <Label>Accessibility</Label>
                <input type="text" value={event.accessibility} onChange={(e) => set({ accessibility: e.target.value })} className={InputCls} placeholder="Step-free & welcoming" />
              </div>
            </div>

            {/* Media */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <ImageIcon size={16} className="text-black" /> Media
              </h3>
              {event.images.map((img, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={idx === 0 ? "Main Image URL" : `Gallery Image ${idx + 1}`}
                      value={img}
                      onChange={(e) => {
                        const newImgs = [...event.images];
                        newImgs[idx] = e.target.value;
                        set({ images: newImgs });
                      }}
                      className={InputCls}
                    />
                    <button
                      onClick={() => {
                        const newImgs = event.images.filter((_, i) => i !== idx);
                        set({ images: newImgs.length ? newImgs : [""] });
                      }}
                      className="p-2.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-full shrink-0 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {isValidImageSrc(img) && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-[#e6ece7] bg-[#f4f8f4]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
              {event.images.length < 3 && (
                <button
                  onClick={() => set({ images: [...event.images, ""] })}
                  className="text-xs font-bold text-black hover:text-black transition-colors"
                >
                  + Add another image (Max 3)
                </button>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <Check size={16} className="text-black" /> Highlights
              </h3>
              {event.highlights.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newArr = [...event.highlights];
                      newArr[idx] = e.target.value;
                      set({ highlights: newArr });
                    }}
                    className={InputCls}
                    placeholder="e.g. Free lunch"
                  />
                  <button
                    onClick={() => {
                      const newArr = event.highlights.filter((_, i) => i !== idx);
                      set({ highlights: newArr.length ? newArr : [""] });
                    }}
                    className="p-2.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-full shrink-0 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => set({ highlights: [...event.highlights, ""] })}
                className="text-xs font-bold text-black hover:text-black transition-colors"
              >
                + Add Highlight
              </button>
            </div>

            {/* Host Profile */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <User size={16} className="text-black" /> Host Profile
              </h3>
              <div>
                <Label>Name</Label>
                <input type="text" value={event.host.name} onChange={(e) => set({ host: { ...event.host, name: e.target.value } })} className={InputCls} />
              </div>
              <div>
                <Label>Role</Label>
                <input type="text" value={event.host.role} onChange={(e) => set({ host: { ...event.host, role: e.target.value } })} className={InputCls} />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <input type="text" value={event.host.image} onChange={(e) => set({ host: { ...event.host, image: e.target.value } })} className={InputCls} />
              </div>
              {isValidImageSrc(event.host.image) && (
                <div className="w-14 h-14 rounded-full overflow-hidden border border-[#e6ece7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.host.image} alt={event.host.name} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Mode ── */}
      {formTab === "preview" && (
        <div className="bg-[#fcfbf8] border border-gray-200 rounded-[40px] p-10 md:p-14 w-full shadow-lg text-[#18251e]">

          {/* Header */}
          <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173b2b]">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-[#526158]">{event.type}</p>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl leading-tight">
                {event.title || "Event Title Placeholder"}
              </h1>
              {event.subtitle && (
                <p className="mt-3 text-lg text-[#526158] max-w-xl">{event.subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-[#0ea5e9] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0284c7] transition">
                Reserve space
              </button>
            </div>
          </div>

          {/* Image Grid */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 mb-16" style={{ height: 400 }}>
              <div className="relative col-span-1 lg:col-span-2 lg:row-span-2 overflow-hidden rounded-[2rem] bg-[#eef5ed]">
                {isValidImageSrc(event.images[0]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.images[0]} alt="Main" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#f4f8f4]">
                {isValidImageSrc(event.images[1]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.images[1]} alt="Gallery 1" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#e8efe9]">
                {isValidImageSrc(event.images[2]) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.images[2]} alt="Gallery 2" className="w-full h-full object-cover" />
                )}
              </div>
            </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left — Overview & Schedule */}
            <div className="lg:col-span-7 pr-0 xl:pr-6">
              <h2 className="text-2xl font-bold text-black mb-4">Overview</h2>
              <div className="space-y-4 text-base leading-relaxed text-[#526158]">
                {event.description.map((p, i) => <p key={i}>{p}</p>)}
              </div>

              {event.perfectFor.filter(Boolean).length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-base font-bold text-black">🚀 Perfect for:</h3>
                  <ul className="space-y-2">
                    {event.perfectFor.filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-base text-black font-medium">
                        <span className="text-[#68776d]">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schedule */}
              {event.agenda.filter(a => a.title).length > 0 && (
                <div className="mt-12 border-t border-[#dbe4dc] pt-10">
                  <h2 className="text-2xl font-bold text-black mb-8">Event Schedule</h2>
                  <div className="space-y-0">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-6 group">
                        <div className="w-14 shrink-0 text-right pt-0.5">
                          <span className="text-sm font-bold text-black">{item.time}</span>
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span className="z-10 h-3 w-3 rounded-full bg-[#173b2b] ring-4 ring-white" />
                          {index !== event.agenda.length - 1 && (
                            <div className="absolute top-4 bottom-[-24px] w-px bg-[#e6ece7]" />
                          )}
                        </div>
                        <div className="pb-8">
                          <h4 className="text-base font-bold text-black">{item.title}</h4>
                          <p className="mt-1 text-sm text-[#68776d] leading-relaxed max-w-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — Highlights + Host + Stats */}
            <div className="lg:col-span-5">
              {event.highlights.filter(Boolean).length > 0 && (
                <>
                  <h3 className="text-2xl font-bold text-black mb-6">Highlights</h3>
                  <ul className="space-y-0 mb-8">
                    {event.highlights.filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-black py-3 border-b border-[#e6ece7] last:border-0">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#173b2b] text-white shrink-0">
                          <Check size={12} />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Host */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#eef5ed]">
                  {isValidImageSrc(event.host.image) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={event.host.image} alt={event.host.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-black">{event.host.name}</p>
                  <p className="text-xs text-[#68776d]">{event.host.role}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 border-t border-[#e6ece7] pt-6">
                <div>
                  <p className="text-xl font-bold text-black">{event.capacity || "—"}</p>
                  <p className="text-xs text-[#68776d] font-medium mt-1">Capacity</p>
                </div>
                <div className="w-px h-8 bg-[#e6ece7]" />
                <div>
                  <p className="text-xl font-bold text-black">{event.price || "—"}</p>
                  <p className="text-xs text-[#68776d] font-medium mt-1">Ticket cost</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
