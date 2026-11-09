"use client";

import React, { useState, useRef } from "react";
import { useFormDraft } from "@/lib/useFormDraft";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  AlignLeft,
  MapPin,
  Clock,
  User,
  Image as ImageIcon,
  Check,
  Plus,
  Trash2,
  X,
  Heart,
  Loader2,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import { isValidImageSrc } from "@/lib/utils";
import { saveMediaBlobToIDB } from "@/lib/useEvents";
import {
  validateGalleryFile,
  formatFileSize,
} from "@/lib/useGallery";
import { ALLOWED_IMAGE_EXTENSIONS } from "@/lib/gallery";

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
export const EVENT_TYPES = [
  "COMMUNITY OUTREACH",
  "CONFERENCE",
  "WORKSHOP",
  "FUNDRAISER",
  "GENERAL",
] as const;

export const EVENT_HOST_PRESETS = [
  {
    name: "Pastor David Vance",
    role: "Senior Pastor",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
  },
  {
    name: "Sarah Jenkins",
    role: "Youth Director",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3531-scaled.jpeg",
  },
  {
    name: "Emily Davis",
    role: "Community Outreach Coordinator",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3546-scaled.jpeg",
  },
  {
    name: "Elder Marcus Cole",
    role: "Christian Education Director",
    image:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3544-scaled.jpeg",
  },
];

export function slugifyEventTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isRenderableEventImage(src?: string): boolean {
  if (!src) return false;
  if (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.endsWith(".svg")
  ) {
    return true;
  }
  return isValidImageSrc(src);
}

interface EventFormProps {
  event: AdminEvent;
  isNew?: boolean;
  onChange: (event: AdminEvent) => void;
  onSave: (finalEvent?: AdminEvent) => Promise<void> | void;
  onCancel: () => void;
}

const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
  >
    {children}
  </label>
);

const InputCls =
  "w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-2.5 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] transition-colors";

export default function EventForm({
  event,
  isNew = false,
  onChange,
  onSave,
  onCancel,
}: EventFormProps) {
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [formError, setFormError] = useState<string | null>(null);

  // Uploaded files for event images (up to 3) & host avatar (max 5 MB each)
  const [selectedImageFiles, setSelectedImageFiles] = useState<
    Record<number, File>
  >({});
  const [imageValidations, setImageValidations] = useState<
    Record<number, { valid: boolean; message: string; extension?: string }>
  >({});
  const [selectedHostAvatarFile, setSelectedHostAvatarFile] =
    useState<File | null>(null);

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const hostAvatarInputRef = useRef<HTMLInputElement | null>(null);

  const set = (patch: Partial<AdminEvent>) => onChange({ ...event, ...patch });

  // ── Auto-save draft to localStorage ──
  const draftKey = event?.id
    ? `draft:event:${isNew ? "new" : event.id}`
    : "";
  const { hasDraft, clearDraft, lastSaved } = useFormDraft(
    draftKey,
    event,
    onChange
  );

  const handleTitleChange = (newTitle: string) => {
    const nextSlug =
      isNew && !slugManuallyEdited
        ? slugifyEventTitle(newTitle) || `event-${Date.now()}`
        : event.id;
    set({ title: newTitle, id: nextSlug });
  };

  // Validate & preview an Event Image file (<= 5 MB, .png/.jpg/.jpeg/.svg/.webp/.gif/.avif)
  const handleEventImageFile = (idx: number, file: File) => {
    setFormError(null);
    const check = validateGalleryFile(file, "image");
    if (!check.valid) {
      setImageValidations((prev) => ({
        ...prev,
        [idx]: {
          valid: false,
          message: check.error || "Invalid image file.",
          extension: check.extension?.toUpperCase(),
        },
      }));
      setFormError(check.error || "Invalid event image file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImageFiles((prev) => ({ ...prev, [idx]: file }));
    setImageValidations((prev) => ({
      ...prev,
      [idx]: {
        valid: true,
        message: `Valid image (${check.extension}) — ${formatFileSize(file.size)} ≤ 5 MB`,
        extension: check.extension?.toUpperCase(),
      },
    }));

    const newImgs = [...event.images];
    newImgs[idx] = previewUrl;
    set({ images: newImgs });
  };

  // Validate & preview Host Avatar file (<= 5 MB)
  const handleHostAvatarFile = (file: File) => {
    setFormError(null);
    const check = validateGalleryFile(file, "image");
    if (!check.valid) {
      setFormError(`Host Avatar Error: ${check.error}`);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setSelectedHostAvatarFile(file);
    set({
      host: {
        ...event.host,
        image: previewUrl,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    // Check file validations
    const invalidMedia = Object.values(imageValidations).find((v) => !v.valid);
    if (invalidMedia) {
      setFormError(invalidMedia.message);
      setFormTab("edit");
      return;
    }

    // Validate required fields
    if (!event.title.trim() || event.title.trim().length < 3) {
      setFormError("Please enter an event title (at least 3 characters).");
      setFormTab("edit");
      return;
    }

    const cleanSlug = event.id.trim() || slugifyEventTitle(event.title);
    if (!cleanSlug || !/^[a-zA-Z0-9-_]+$/.test(cleanSlug)) {
      setFormError(
        "Please enter a valid URL Slug using only letters, numbers, hyphens, or underscores."
      );
      setFormTab("edit");
      return;
    }

    if (!event.date.trim()) {
      setFormError("Please specify the event date (e.g. May 30 - Jun 3, 2026).");
      setFormTab("edit");
      return;
    }

    if (!event.location.trim()) {
      setFormError("Please specify the event location / venue.");
      setFormTab("edit");
      return;
    }

    const nonEmptyDescriptions = event.description.filter((d) => d.trim() !== "");
    if (nonEmptyDescriptions.length === 0) {
      setFormError("Please write at least one description paragraph.");
      setFormTab("edit");
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const finalImages = [...event.images];
      for (const [idxStr, file] of Object.entries(selectedImageFiles)) {
        const idx = Number(idxStr);
        if (file && idx < finalImages.length) {
          finalImages[idx] = await saveMediaBlobToIDB(
            `event_img:${cleanSlug}:${idx}`,
            file
          );
        }
      }

      const cleanedImages = finalImages.map((img) => img.trim()).filter(Boolean);
      if (cleanedImages.length === 0) {
        cleanedImages.push("/images/hero-bg.png");
      }

      let finalHostImage = event.host.image?.trim() || "";
      if (selectedHostAvatarFile) {
        finalHostImage = await saveMediaBlobToIDB(
          `event_host:${cleanSlug}`,
          selectedHostAvatarFile
        );
      }

      const finalEvent: AdminEvent = {
        ...event,
        id: cleanSlug,
        title: event.title.trim(),
        subtitle:
          event.subtitle.trim() ||
          nonEmptyDescriptions[0].slice(0, 140),
        date: event.date.trim(),
        time: event.time.trim() || "10:00 AM",
        location: event.location.trim(),
        capacity: event.capacity.trim() || "Open Capacity",
        accessibility:
          event.accessibility.trim() || "Wheelchair accessible & welcoming",
        price: event.price.trim() || "Free",
        images: cleanedImages,
        description: nonEmptyDescriptions,
        perfectFor: event.perfectFor.map((p) => p.trim()).filter(Boolean),
        highlights: event.highlights.map((h) => h.trim()).filter(Boolean),
        agenda: event.agenda.filter((a) => a.title.trim() || a.time.trim()),
        host: {
          name: event.host.name.trim() || "Pastor David Vance",
          role: event.host.role.trim() || "Senior Pastor",
          image:
            finalHostImage ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        },
      };

      onChange(finalEvent);
      clearDraft();
      await onSave(finalEvent);
    } catch (err) {
      console.error("Failed to save event:", err);
      setFormError("Failed to save event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      key="event-form"
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto w-full flex flex-col gap-6"
    >
      {/* ── Sticky Action Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-[#e6ece7] rounded-full p-3 sticky top-4 z-30 shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
          >
            <ArrowLeft size={16} /> Discard Changes
          </button>
          {hasDraft && lastSaved && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Draft saved{" "}
              {lastSaved.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <div className="flex bg-[#f4f8f4] border border-[#e6ece7] rounded-full p-1">
          <button
            type="button"
            onClick={() => setFormTab("edit")}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
              formTab === "edit"
                ? "bg-white text-black shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Edit Event
          </button>
          <button
            type="button"
            onClick={() => setFormTab("preview")}
            className={`px-6 py-1.5 rounded-full text-sm font-bold transition-all ${
              formTab === "preview"
                ? "bg-white text-black shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Preview Mode (/events)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-60 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving…" : "Save Event"}
          </button>
        </div>
      </div>

      {/* ── Validation Banner ── */}
      <div aria-live="polite">
        {formError && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start justify-between gap-3 text-sm font-medium"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Validation Notice</p>
                <p className="text-xs text-red-600 mt-0.5">{formError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormError(null)}
              className="text-red-400 hover:text-red-600 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Grid ── */}
      {formTab === "edit" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Main Column ── */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Details */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-5">
              <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-2">
                <AlignLeft size={20} className="text-[#0ea5e9]" /> Event Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Label htmlFor="event-title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="event-title"
                    name="title"
                    type="text"
                    required
                    value={event.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={InputCls}
                    placeholder="e.g. Annual Youth Conference 2026"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="event-subtitle">
                    Subtitle / Short Summary (Shown on /events cards)
                  </Label>
                  <input
                    id="event-subtitle"
                    name="subtitle"
                    type="text"
                    value={event.subtitle}
                    onChange={(e) => set({ subtitle: e.target.value })}
                    className={InputCls}
                    placeholder="Join thousands of young believers for five unforgettable days of worship..."
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="event-slug"
                      className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                    >
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (event.title.trim()) {
                          set({ id: slugifyEventTitle(event.title) });
                          setSlugManuallyEdited(true);
                        }
                      }}
                      className="text-[11px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={11} /> Auto-slug
                    </button>
                  </div>
                  <input
                    id="event-slug"
                    name="slug"
                    type="text"
                    required
                    value={event.id}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      set({ id: e.target.value });
                    }}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    className={`${InputCls} font-mono`}
                    placeholder="annual-youth-conference-2026"
                  />
                  <p className="text-[11px] text-gray-400 mt-1 pl-2">
                    Public route:{" "}
                    <span className="font-mono text-gray-600">
                      /events/{event.id || "..."}
                    </span>
                  </p>
                </div>
                <div>
                  <Label htmlFor="event-type">Event Category / Type</Label>
                  <select
                    id="event-type"
                    name="type"
                    value={event.type}
                    onChange={(e) => set({ type: e.target.value })}
                    className={InputCls}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description & Perfect For */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Description Paragraphs <span className="text-red-500">*</span>
                </h3>
                {event.description.map((desc, idx) => (
                  <div key={idx} className="flex gap-2 mb-3">
                    <textarea
                      aria-label={`Description paragraph ${idx + 1}`}
                      value={desc}
                      onChange={(e) => {
                        const newDesc = [...event.description];
                        newDesc[idx] = e.target.value;
                        set({ description: newDesc });
                      }}
                      rows={3}
                      className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-y transition-colors"
                      placeholder={`Paragraph ${idx + 1} text…`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newDesc = event.description.filter(
                          (_, i) => i !== idx
                        );
                        set({ description: newDesc.length ? newDesc : [""] });
                      }}
                      className="p-3 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-2xl shrink-0 h-fit transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    set({ description: [...event.description, ""] })
                  }
                  className="text-sm font-bold text-[#0ea5e9] flex items-center gap-1 hover:underline transition-colors"
                >
                  <Plus size={14} /> Add Paragraph
                </button>
              </div>

              {/* Perfect For */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Perfect For (Audience Badges)
                </h3>
                {event.perfectFor.map((item, idx) => (
                  <div key={idx} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      aria-label={`Perfect for item ${idx + 1}`}
                      value={item}
                      onChange={(e) => {
                        const newArr = [...event.perfectFor];
                        newArr[idx] = e.target.value;
                        set({ perfectFor: newArr });
                      }}
                      className={InputCls}
                      placeholder="e.g. Families, Youth & Young Adults, First-time Visitors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newArr = event.perfectFor.filter(
                          (_, i) => i !== idx
                        );
                        set({ perfectFor: newArr.length ? newArr : [""] });
                      }}
                      className="p-2.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-full shrink-0 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => set({ perfectFor: [...event.perfectFor, ""] })}
                  className="text-sm font-bold text-[#0ea5e9] flex items-center gap-1 hover:underline transition-colors"
                >
                  <Plus size={14} /> Add Audience Badge
                </button>
              </div>
            </div>

            {/* Agenda / Schedule */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-5">
              <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-4">
                <Clock size={20} className="text-[#0ea5e9]" /> Event Schedule /
                Agenda
              </h3>
              {event.agenda.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#f4f8f4] border border-[#e6ece7] p-5 rounded-2xl relative mb-4"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const newAgenda = event.agenda.filter(
                        (_, i) => i !== idx
                      );
                      set({
                        agenda: newAgenda.length
                          ? newAgenda
                          : [{ time: "", title: "", desc: "" }],
                      });
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
                        placeholder="10:00 AM"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Session Title</Label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const a = [...event.agenda];
                          a[idx] = { ...a[idx], title: e.target.value };
                          set({ agenda: a });
                        }}
                        className="w-full bg-white border border-[#e6ece7] rounded-full px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] transition-colors"
                        placeholder="Morning Glory Worship & Keynote"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Session Description</Label>
                    <textarea
                      value={item.desc}
                      onChange={(e) => {
                        const a = [...event.agenda];
                        a[idx] = { ...a[idx], desc: e.target.value };
                        set({ agenda: a });
                      }}
                      rows={2}
                      placeholder="Details about speakers, activities, or room location..."
                      className="w-full bg-white border border-[#e6ece7] rounded-2xl px-3 py-2 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] resize-none transition-colors"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  set({
                    agenda: [
                      ...event.agenda,
                      { time: "", title: "", desc: "" },
                    ],
                  })
                }
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
                <MapPin size={16} className="text-[#0ea5e9]" /> Logistics
              </h3>

              <div>
                <Label htmlFor="event-status">Status</Label>
                <select
                  id="event-status"
                  value={event.status}
                  onChange={(e) =>
                    set({ status: e.target.value as AdminEvent["status"] })
                  }
                  className={InputCls}
                >
                  {EVENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="event-date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <input
                    id="event-date"
                    type="text"
                    required
                    value={event.date}
                    onChange={(e) => set({ date: e.target.value })}
                    className={InputCls}
                    placeholder="May 30 - Jun 3, 2026"
                  />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <input
                    id="event-time"
                    type="text"
                    value={event.time}
                    onChange={(e) => set({ time: e.target.value })}
                    className={InputCls}
                    placeholder="09:00 AM - 05:00 PM"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="event-location">
                  Location / Venue <span className="text-red-500">*</span>
                </Label>
                <input
                  id="event-location"
                  type="text"
                  required
                  value={event.location}
                  onChange={(e) => set({ location: e.target.value })}
                  className={InputCls}
                  placeholder="Main Auditorium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="event-capacity">Capacity</Label>
                  <input
                    id="event-capacity"
                    type="text"
                    value={event.capacity}
                    onChange={(e) => set({ capacity: e.target.value })}
                    className={InputCls}
                    placeholder="500 Attendees"
                  />
                </div>
                <div>
                  <Label htmlFor="event-price">Price</Label>
                  <input
                    id="event-price"
                    type="text"
                    value={event.price}
                    onChange={(e) => set({ price: e.target.value })}
                    className={InputCls}
                    placeholder="Free"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="event-accessibility">Accessibility</Label>
                <input
                  id="event-accessibility"
                  type="text"
                  value={event.accessibility}
                  onChange={(e) => set({ accessibility: e.target.value })}
                  className={InputCls}
                  placeholder="Step-free & welcoming"
                />
              </div>
            </div>

            {/* Media (with 5 MB File Upload + Validation) */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-black flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#0ea5e9]" /> Event Media
                </h3>
                <span className="text-[10px] font-bold bg-sky-50 text-[#0284c7] border border-sky-200 px-2.5 py-0.5 rounded-full">
                  Max 5 MB / image
                </span>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                Allowed formats:{" "}
                <span className="font-semibold text-gray-700">
                  {ALLOWED_IMAGE_EXTENSIONS.join(", ")}
                </span>{" "}
                (up to 5 MB each).
              </p>

              {event.images.map((img, idx) => {
                const validation = imageValidations[idx];
                return (
                  <div
                    key={idx}
                    className="space-y-2.5 p-3.5 rounded-2xl bg-[#f4f8f4]/70 border border-[#e6ece7]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                        {idx === 0
                          ? "Primary Cover Image *"
                          : `Gallery Image ${idx + 1}`}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[idx] = el;
                          }}
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp,.gif,.avif,image/*"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleEventImageFile(idx, f);
                            e.target.value = "";
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 hover:border-[#0ea5e9] text-[11px] font-bold text-gray-700 transition-colors"
                        >
                          <Upload size={11} className="text-[#0ea5e9]" /> Upload
                        </button>
                        {event.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = event.images.filter(
                                (_, i) => i !== idx
                              );
                              set({
                                images: newImgs.length ? newImgs : [""],
                              });
                            }}
                            className="p-1.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder={
                        idx === 0
                          ? "/images/hero-bg.png or https://..."
                          : `Gallery Image ${idx + 1} URL`
                      }
                      value={img.startsWith("blob:") ? "" : img}
                      onChange={(e) => {
                        const newImgs = [...event.images];
                        newImgs[idx] = e.target.value;
                        set({ images: newImgs });
                      }}
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="w-full bg-white border border-[#e6ece7] rounded-full px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:border-[#0ea5e9]"
                    />

                    {validation && (
                      <div
                        className={`px-3 py-2 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 ${
                          validation.valid
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {validation.valid ? (
                          <FileCheck size={13} className="text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle size={13} className="text-red-600 shrink-0" />
                        )}
                        <span className="truncate">{validation.message}</span>
                      </div>
                    )}

                    {isRenderableEventImage(img) && (
                      <div className="w-full aspect-video rounded-xl overflow-hidden border border-[#e6ece7] bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Event preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {event.images.length < 3 && (
                <button
                  type="button"
                  onClick={() => set({ images: [...event.images, ""] })}
                  className="text-xs font-bold text-[#0ea5e9] hover:underline transition-colors"
                >
                  + Add another gallery image (Max 3)
                </button>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <Check size={16} className="text-[#0ea5e9]" /> Event Highlights
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
                    placeholder="e.g. Live Choir & Band, Free Lunch"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newArr = event.highlights.filter(
                        (_, i) => i !== idx
                      );
                      set({ highlights: newArr.length ? newArr : [""] });
                    }}
                    className="p-2.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 rounded-full shrink-0 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set({ highlights: [...event.highlights, ""] })}
                className="text-xs font-bold text-[#0ea5e9] hover:underline transition-colors"
              >
                + Add Highlight
              </button>
            </div>

            {/* Host Profile */}
            <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <h3 className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3">
                <User size={16} className="text-[#0ea5e9]" /> Host Profile
              </h3>

              {/* Quick Host Presets */}
              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Quick Select Host
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {EVENT_HOST_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSelectedHostAvatarFile(null);
                        set({ host: { ...preset } });
                      }}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-colors ${
                        event.host.name === preset.name
                          ? "bg-black text-white border-black"
                          : "bg-[#f4f8f4] text-gray-600 border-[#e6ece7] hover:bg-gray-100"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="host-name">Host Name</Label>
                <input
                  id="host-name"
                  type="text"
                  value={event.host.name}
                  onChange={(e) =>
                    set({ host: { ...event.host, name: e.target.value } })
                  }
                  className={InputCls}
                />
              </div>
              <div>
                <Label htmlFor="host-role">Host Role</Label>
                <input
                  id="host-role"
                  type="text"
                  value={event.host.role}
                  onChange={(e) =>
                    set({ host: { ...event.host, role: e.target.value } })
                  }
                  className={InputCls}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="host-avatar"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                  >
                    Host Avatar (≤ 5 MB)
                  </label>
                  <input
                    ref={hostAvatarInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.gif,.avif,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleHostAvatarFile(f);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => hostAvatarInputRef.current?.click()}
                    className="text-[11px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1"
                  >
                    <Upload size={11} /> Upload Photo
                  </button>
                </div>
                <input
                  id="host-avatar"
                  type="text"
                  value={
                    event.host.image?.startsWith("blob:")
                      ? ""
                      : event.host.image
                  }
                  onChange={(e) =>
                    set({ host: { ...event.host, image: e.target.value } })
                  }
                  placeholder="https://..."
                  className={InputCls}
                />
              </div>
              {isRenderableEventImage(event.host.image) && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#e6ece7] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={event.host.image}
                      alt={event.host.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-black">
                      {event.host.name || "Host Name"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {event.host.role || "Role"}
                    </p>
                  </div>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0048ff]">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-[#526158]">
                  {event.type} • {event.date || "Date TBA"}
                </p>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-black md:text-5xl leading-tight">
                {event.title || "Event Title Placeholder"}
              </h1>
              {event.subtitle && (
                <p className="mt-3 text-lg text-[#526158] max-w-xl">
                  {event.subtitle}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="flex items-center gap-2 rounded-full bg-[#0048ff] px-6 py-2.5 text-sm font-bold text-white">
                Reserve Space ({event.price || "Free"})
              </span>
            </div>
          </div>

          {/* Image Grid */}
          <div
            className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2 mb-16"
            style={{ height: 400 }}
          >
            <div className="relative col-span-1 lg:col-span-2 lg:row-span-2 overflow-hidden rounded-[2rem] bg-[#eef5ed]">
              {isRenderableEventImage(event.images[0]) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.images[0]}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#f4f8f4]">
              {isRenderableEventImage(event.images[1] || event.images[0]) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.images[1] || event.images[0]}
                  alt="Gallery 1"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#e8efe9]">
              {isRenderableEventImage(event.images[2] || event.images[0]) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.images[2] || event.images[0]}
                  alt="Gallery 2"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left — Overview & Schedule */}
            <div className="lg:col-span-7 pr-0 xl:pr-6">
              <h2 className="text-2xl font-bold text-black mb-4">Overview</h2>
              <div className="space-y-4 text-base leading-relaxed text-[#526158]">
                {event.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {event.perfectFor.filter(Boolean).length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-base font-bold text-black">
                    Perfect for:
                  </h3>
                  <ul className="space-y-2">
                    {event.perfectFor.filter(Boolean).map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-base text-black font-medium"
                      >
                        <span className="text-[#0048ff]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schedule */}
              {event.agenda.filter((a) => a.title).length > 0 && (
                <div className="mt-12 border-t border-[#dbe4dc] pt-10">
                  <h2 className="text-2xl font-bold text-black mb-8">
                    Event Schedule
                  </h2>
                  <div className="space-y-0">
                    {event.agenda.map((item, index) => (
                      <div key={index} className="flex gap-6 group">
                        <div className="w-20 shrink-0 text-right pt-0.5">
                          <span className="text-sm font-bold text-black">
                            {item.time}
                          </span>
                        </div>
                        <div className="relative flex flex-col items-center">
                          <span className="z-10 h-3 w-3 rounded-full bg-[#0048ff] ring-4 ring-white" />
                          {index !== event.agenda.length - 1 && (
                            <div className="absolute top-4 bottom-[-24px] w-px bg-[#e6ece7]" />
                          )}
                        </div>
                        <div className="pb-8">
                          <h4 className="text-base font-bold text-black">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm text-[#68776d] leading-relaxed max-w-sm">
                            {item.desc}
                          </p>
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
                  <h3 className="text-2xl font-bold text-black mb-6">
                    Highlights
                  </h3>
                  <ul className="space-y-0 mb-8">
                    {event.highlights.filter(Boolean).map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm font-medium text-black py-3 border-b border-[#e6ece7] last:border-0"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0048ff] text-white shrink-0">
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
                  {isRenderableEventImage(event.host.image) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.host.image}
                      alt={event.host.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-base font-bold text-black">
                    {event.host.name}
                  </p>
                  <p className="text-xs text-[#68776d]">{event.host.role}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 border-t border-[#e6ece7] pt-6">
                <div>
                  <p className="text-xl font-bold text-black">
                    {event.capacity || "—"}
                  </p>
                  <p className="text-xs text-[#68776d] font-medium mt-1">
                    Capacity
                  </p>
                </div>
                <div className="w-px h-8 bg-[#e6ece7]" />
                <div>
                  <p className="text-xl font-bold text-black">
                    {event.price || "—"}
                  </p>
                  <p className="text-xs text-[#68776d] font-medium mt-1">
                    Ticket cost
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.form>
  );
}
