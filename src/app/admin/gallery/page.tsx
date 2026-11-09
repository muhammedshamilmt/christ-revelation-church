"use client";

import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Film,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Loader2,
  Play,
  FileCheck,
  Maximize2,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";

import {
  GALLERY_CATEGORIES,
  GALLERY_ITEM_CATEGORIES,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_VIDEO_EXTENSIONS,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  type GalleryItem,
  type GalleryMediaType,
} from "@/lib/gallery";
import {
  useGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  validateGalleryFile,
  formatFileSize,
  getFileExtension,
  saveMediaBlobToIDB,
  uploadGalleryMediaToSupabase,
  extractVideoMetadata,
  extractImageAspectRatio,
} from "@/lib/useGallery";
import { useConfirm } from "@/components/ui/ConfirmDialogProvider";
import toast from "react-hot-toast";

const VENUE_PRESETS = [
  "Main Sanctuary",
  "Main Auditorium",
  "Youth Center",
  "Fellowship Hall",
  "Prayer Chapel",
  "Altar Platform",
];

function formatCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function createEmptyGalleryItem(mediaType: GalleryMediaType = "image"): GalleryItem {
  return {
    id: `gal-${Date.now()}`,
    title: "",
    category: "Worship",
    mediaType,
    imageUrl: "",
    videoUrl: "",
    date: formatCurrentMonthYear(),
    location: "Main Sanctuary",
    description: "",
    aspectRatio: "wide",
    featured: false,
  };
}

export default function AdminGalleryPage() {
  const { confirm } = useConfirm();
  const { items, isLoading, mutate } = useGallery();

  // Views & Filters
  const [view, setView] = useState<"list" | "form">("list");
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [mediaFilter, setMediaFilter] = useState<"all" | "image" | "video">("all");
  const [previewModalItem, setPreviewModalItem] = useState<GalleryItem | null>(null);

  // Upload & Validation state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customThumbFile, setCustomThumbFile] = useState<File | null>(null);
  const [localMediaPreviewUrl, setLocalMediaPreviewUrl] = useState<string>("");
  const [localThumbPreviewUrl, setLocalThumbPreviewUrl] = useState<string>("");
  const [validationStatus, setValidationStatus] = useState<{
    valid: boolean;
    message: string;
    extension?: string;
    sizeText?: string;
    sizeRatio?: number;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const stats = useMemo(() => {
    const total = items.length;
    const imagesCount = items.filter((i) => (i.mediaType || "image") === "image").length;
    const videosCount = items.filter((i) => i.mediaType === "video").length;
    const featuredCount = items.filter((i) => i.featured).length;
    return { total, imagesCount, videosCount, featuredCount };
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const itemMedia = item.mediaType || "image";
      const matchesMedia = mediaFilter === "all" || itemMedia === mediaFilter;
      const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
      const q = search.toLowerCase().trim();
      if (!q) return matchesMedia && matchesCat;

      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.fileName && item.fileName.toLowerCase().includes(q));

      return matchesMedia && matchesCat && matchesSearch;
    });
  }, [items, mediaFilter, categoryFilter, search]);

  const resetUploadState = () => {
    if (localMediaPreviewUrl) URL.revokeObjectURL(localMediaPreviewUrl);
    if (localThumbPreviewUrl && localThumbPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(localThumbPreviewUrl);
    }
    setSelectedFile(null);
    setCustomThumbFile(null);
    setLocalMediaPreviewUrl("");
    setLocalThumbPreviewUrl("");
    setValidationStatus(null);
    setFormError(null);
  };

  const handleAddNew = (initialMediaType: GalleryMediaType = "image") => {
    resetUploadState();
    setIsNewItem(true);
    setEditingItem(createEmptyGalleryItem(initialMediaType));
    setView("form");
    setFormTab("edit");
  };

  const handleEdit = (item: GalleryItem) => {
    resetUploadState();
    setIsNewItem(false);
    setEditingItem({
      ...item,
      mediaType: item.mediaType || "image",
      aspectRatio: item.aspectRatio || "wide",
    });
    if (item.fileName && item.fileSize) {
      const maxBytes = item.mediaType === "video" ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
      setValidationStatus({
        valid: true,
        message: `Validated ${item.mediaType === "video" ? "video" : "image"} file (${item.fileName})`,
        extension: getFileExtension(item.fileName).toUpperCase(),
        sizeText: `${formatFileSize(item.fileSize)} / ${item.mediaType === "video" ? "50 MB" : "5 MB"}`,
        sizeRatio: Math.min(100, Math.round((item.fileSize / maxBytes) * 100)),
      });
    }
    setView("form");
    setFormTab("edit");
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Gallery Item",
      message: "Are you sure you want to permanently delete this gallery item? This action will remove the media archive from the website.",
      confirmText: "Delete Item",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await deleteGalleryItem(id);
      await mutate();
      toast.success("Gallery item deleted successfully");
    } catch (err) {
      console.error("Failed to delete gallery item:", err);
      toast.error("Failed to delete item. Please try again.");
    }
  };

  // Handle Main File Selection / Drop with Strict Extension & Size Validation
  const processSelectedFile = async (file: File) => {
    if (!editingItem) return;
    setFormError(null);

    // Validate against rules:
    // Image: .png, .jpg, .jpeg, .svg, .webp, .gif, .avif up to 5 MB
    // Video: .mp4, .mkv, .webm, .mov, .avi, .m4v up to 50 MB
    const result = validateGalleryFile(file);

    if (!result.valid || !result.mediaType) {
      setSelectedFile(null);
      setValidationStatus({
        valid: false,
        message: result.error || "Invalid file.",
        extension: result.extension?.toUpperCase(),
        sizeText: formatFileSize(file.size),
      });
      setFormError(result.error || "Invalid file selected.");
      return;
    }

    const detectedType = result.mediaType;
    const maxBytes = detectedType === "video" ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
    const maxLabel = detectedType === "video" ? "50 MB" : "5 MB";

    if (localMediaPreviewUrl) URL.revokeObjectURL(localMediaPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setLocalMediaPreviewUrl(previewUrl);

    setValidationStatus({
      valid: true,
      message: `Valid ${detectedType.toUpperCase()} file — passes format (${result.extension}) and size (${formatFileSize(
        file.size
      )} ≤ ${maxLabel}) checks.`,
      extension: result.extension?.toUpperCase(),
      sizeText: `${formatFileSize(file.size)} / ${maxLabel}`,
      sizeRatio: Math.min(100, Math.max(2, Math.round((file.size / maxBytes) * 100))),
    });

    // Auto-fill title from filename if title is currently blank
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    if (detectedType === "image") {
      const ratio = await extractImageAspectRatio(file);
      setEditingItem((prev) =>
        prev
          ? {
              ...prev,
              mediaType: "image",
              title: prev.title.trim() ? prev.title : baseName,
              imageUrl: previewUrl,
              videoUrl: undefined,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type || `image/${result.extension?.replace(".", "")}`,
              aspectRatio: ratio,
            }
          : prev
      );
    } else {
      // Video file (.mp4, .mkv, .webm, etc.)
      const { thumbnailDataUrl, aspectRatio } = await extractVideoMetadata(file);
      const fallbackPoster =
        thumbnailDataUrl ||
        "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg";
      setLocalThumbPreviewUrl(fallbackPoster);

      setEditingItem((prev) =>
        prev
          ? {
              ...prev,
              mediaType: "video",
              title: prev.title.trim() ? prev.title : baseName,
              imageUrl: fallbackPoster,
              videoUrl: previewUrl,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type || `video/${result.extension?.replace(".", "")}`,
              aspectRatio,
            }
          : prev
      );
    }
  };

  // Handle Custom Video Thumbnail Upload (Validated as Image <= 5MB)
  const handleCustomThumbSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    const check = validateGalleryFile(file, "image");
    if (!check.valid) {
      setFormError(`Thumbnail Error: ${check.error}`);
      return;
    }

    setFormError(null);
    setCustomThumbFile(file);
    const thumbUrl = URL.createObjectURL(file);
    setLocalThumbPreviewUrl(thumbUrl);
    setEditingItem({
      ...editingItem,
      imageUrl: thumbUrl,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || saving) return;

    if (validationStatus && !validationStatus.valid) {
      setFormError(validationStatus.message);
      setFormTab("edit");
      return;
    }

    if (!editingItem.title.trim()) {
      setFormError("Please enter a title for this gallery moment.");
      setFormTab("edit");
      return;
    }

    const mediaType = editingItem.mediaType || "image";
    if (mediaType === "image" && !selectedFile && !editingItem.imageUrl.trim()) {
      setFormError("Please upload an image file (up to 5 MB) or provide a valid image URL.");
      setFormTab("edit");
      return;
    }

    if (mediaType === "video" && !selectedFile && !editingItem.videoUrl?.trim()) {
      setFormError("Please upload a video file (.mp4, .mkv, .webm, .mov up to 50 MB) or provide a video URL.");
      setFormTab("edit");
      return;
    }

    if (!editingItem.description.trim()) {
      setFormError("Please provide a short description for this gallery archive.");
      setFormTab("edit");
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const itemId = editingItem.id.trim() || `gal-${Date.now()}`;
      let finalImageUrl = editingItem.imageUrl;
      let finalVideoUrl = editingItem.videoUrl;
      let finalFileName = editingItem.fileName;
      let finalFileSize = editingItem.fileSize;
      let finalMimeType = editingItem.mimeType;

      // Upload directly to Supabase Storage bucket 'gallery'
      if (selectedFile) {
        finalFileName = selectedFile.name;
        finalFileSize = selectedFile.size;
        finalMimeType = selectedFile.type;

        try {
          if (mediaType === "image") {
            const uploaded = await uploadGalleryMediaToSupabase(selectedFile, itemId, "media");
            finalImageUrl = uploaded.publicUrl;
          } else {
            const uploaded = await uploadGalleryMediaToSupabase(selectedFile, itemId, "media");
            finalVideoUrl = uploaded.publicUrl;
            if (customThumbFile) {
              const uploadedThumb = await uploadGalleryMediaToSupabase(customThumbFile, itemId, "thumb");
              finalImageUrl = uploadedThumb.publicUrl;
            } else if (!finalImageUrl || finalImageUrl.startsWith("blob:")) {
              finalImageUrl =
                localThumbPreviewUrl && !localThumbPreviewUrl.startsWith("blob:")
                  ? localThumbPreviewUrl
                  : "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg";
            }
          }
        } catch (uploadErr) {
          console.warn("Supabase storage upload failed, falling back to local IDB:", uploadErr);
          if (mediaType === "image") {
            finalImageUrl = await saveMediaBlobToIDB(`media:${itemId}`, selectedFile);
          } else {
            finalVideoUrl = await saveMediaBlobToIDB(`media:${itemId}`, selectedFile);
            if (customThumbFile) {
              finalImageUrl = await saveMediaBlobToIDB(`thumb:${itemId}`, customThumbFile);
            }
          }
        }
      } else if (customThumbFile) {
        try {
          const uploadedThumb = await uploadGalleryMediaToSupabase(customThumbFile, itemId, "thumb");
          finalImageUrl = uploadedThumb.publicUrl;
        } catch {
          finalImageUrl = await saveMediaBlobToIDB(`thumb:${itemId}`, customThumbFile);
        }
      }

      const payload: GalleryItem = {
        ...editingItem,
        id: itemId,
        title: editingItem.title.trim(),
        description: editingItem.description.trim(),
        location: editingItem.location?.trim() || "Main Sanctuary",
        date: editingItem.date.trim() || formatCurrentMonthYear(),
        mediaType,
        imageUrl:
          finalImageUrl ||
          "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg",
        videoUrl: mediaType === "video" ? finalVideoUrl : undefined,
        fileName: finalFileName,
        fileSize: finalFileSize,
        mimeType: finalMimeType,
      };

      if (isNewItem) {
        await addGalleryItem(payload);
        toast.success("Gallery item published successfully!");
      } else {
        await updateGalleryItem(payload.id, payload);
        toast.success("Gallery item updated successfully!");
      }

      await mutate();
      setView("list");
      setEditingItem(null);
    } catch (err: any) {
      console.error("Failed to save gallery item:", err);
      const msg = err?.message || "Failed to save gallery item. Please try again.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      <div className="p-8 flex-1">
        <AnimatePresence mode="wait">
          {/* ─── LIST VIEW ───────────────────────────────────────────────────── */}
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-8"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h1 className="text-[26px] font-medium text-gray-900 tracking-tight">
                    Gallery & Media Archive
                  </h1>
                  <p className="text-[14px] text-gray-500 font-medium mt-1">
                    Upload and manage church photos (up to 5 MB) and ministry videos (up to 50 MB) for /gallery.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      id="admin-gallery-search"
                      name="search"
                      aria-label="Search gallery items"
                      placeholder="Search moments, location..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>

                  <Link
                    href="/gallery"
                    target="_blank"
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <ExternalLink size={14} /> View Live
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleAddNew("image")}
                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Plus size={16} /> Upload Media
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    label: "Total Archive Items",
                    value: stats.total,
                    sub: "Live on /gallery",
                    icon: LayoutGrid,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Photos (.png, .jpeg, .svg)",
                    value: stats.imagesCount,
                    sub: "Max 5 MB per image",
                    icon: ImageIcon,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "Videos (.mp4, .mkv, .webm)",
                    value: stats.videosCount,
                    sub: "Max 50 MB per video",
                    icon: Film,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Categories Active",
                    value: GALLERY_ITEM_CATEGORIES.length,
                    sub: `${stats.featuredCount} featured moments`,
                    icon: Sparkles,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-[20px] p-5 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-1">{stat.sub}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}
                    >
                      <stat.icon size={22} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter Bar: Media Type + Categories */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-3">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {GALLERY_CATEGORIES.map((cat) => {
                    const active = categoryFilter === cat;
                    const count =
                      cat === "All"
                        ? items.length
                        : items.filter((i) => i.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          active
                            ? "bg-gray-900 text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] ${active ? "text-white/70" : "text-gray-400"}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Media Type Switcher */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full self-start md:self-auto shrink-0">
                  {[
                    { id: "all", label: "All Media" },
                    { id: "image", label: "Images" },
                    { id: "video", label: "Videos" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setMediaFilter(tab.id as "all" | "image" | "video")}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        mediaFilter === tab.id
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-100 rounded-3xl overflow-hidden h-[320px] flex flex-col"
                    >
                      <div className="w-full aspect-[4/3] bg-gray-200" />
                      <div className="p-4 flex flex-col gap-2">
                        <div className="w-2/3 h-4 bg-gray-200 rounded" />
                        <div className="w-full h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredItems.map((item) => {
                    const isVideo = item.mediaType === "video";
                    return (
                      <div
                        key={item.id}
                        className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md hover:border-gray-200 transition-all flex flex-col"
                      >
                        {/* Thumbnail / Video Preview */}
                        <div
                          onClick={() => setPreviewModalItem(item)}
                          className="relative aspect-[4/3] w-full bg-gray-900 overflow-hidden cursor-pointer"
                        >
                          {isVideo && item.videoUrl ? (
                            <video
                              src={item.videoUrl}
                              poster={item.imageUrl}
                              muted
                              playsInline
                              onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          )}

                          {/* Category & Type Badges */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                            <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                              {item.category}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1 shadow-sm ${
                                isVideo ? "bg-purple-600/90" : "bg-[#0ea5e9]/90"
                              }`}
                            >
                              {isVideo ? <Film size={10} /> : <ImageIcon size={10} />}
                              {isVideo ? "Video" : "Photo"}
                            </span>
                          </div>

                          {/* Aspect Ratio Badge */}
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-white uppercase">
                            {item.aspectRatio || "wide"}
                          </div>

                          {/* Center Play / Expand Overlay */}
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="w-11 h-11 rounded-full bg-white/90 text-gray-900 flex items-center justify-center shadow-lg transform scale-95 group-hover:scale-100 transition-transform">
                              {isVideo ? <Play size={18} className="ml-0.5" /> : <Maximize2 size={16} />}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                            {item.description}
                          </p>

                          {item.fileName && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg mb-3 truncate">
                              <FileCheck size={12} className="text-emerald-500 shrink-0" />
                              <span className="truncate">{item.fileName}</span>
                              {item.fileSize && (
                                <span className="ml-auto text-gray-400 shrink-0">
                                  ({formatFileSize(item.fileSize)})
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex flex-col text-[11px] text-gray-500 min-w-0">
                              <span className="font-semibold text-gray-700 truncate">
                                {item.location || "Main Sanctuary"}
                              </span>
                              <span className="text-[10px] text-gray-400">{item.date}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                title="Edit item"
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                title="Delete item"
                                className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-gray-200 border-dashed rounded-3xl bg-white">
                      <ImageIcon size={36} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600 text-sm font-semibold mb-1">No gallery items found</p>
                      <p className="text-gray-400 text-xs mb-5">
                        Upload a new photo or video or reset your active filters.
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleAddNew("image")}
                          className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Plus size={14} /> Upload Image
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddNew("video")}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                        >
                          <Film size={14} /> Upload Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── UPLOAD / EDIT FORM VIEW ────────────────────────────────────── */}
          {view === "form" && editingItem && (
            <motion.form
              key="form"
              onSubmit={handleSave}
              noValidate
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-6xl mx-auto w-full flex flex-col gap-6"
            >
              {/* Sticky Action Bar */}
              <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 rounded-full p-3 sticky top-4 z-20 shadow-sm gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetUploadState();
                    setView("list");
                    setEditingItem(null);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-50"
                >
                  <ArrowLeft size={16} /> Back to Gallery
                </button>

                <div className="flex bg-gray-100 border border-gray-200 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setFormTab("edit")}
                    className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      formTab === "edit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Upload & Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormTab("preview")}
                    className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      formTab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Live Preview (/gallery)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-60 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving..." : isNewItem ? "Publish to Gallery" : "Save Changes"}
                </button>
              </div>

              {/* Error Banner */}
              <div aria-live="polite">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start justify-between gap-3 text-sm font-medium">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Validation Error</p>
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

              {/* ─── Edit Form Grid ─────────────────────────────────────────── */}
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${formTab === "preview" ? "hidden" : "grid"}`}>
                {/* Left Column (2/3): Upload Zone & Moment Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* File Upload Card with Strict Format & Size Validation */}
                  <fieldset className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                      <legend className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Upload size={20} className="text-[#0ea5e9]" /> Media Upload & Validation
                      </legend>

                      {/* Media Type Switcher */}
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({
                              ...editingItem,
                              mediaType: "image",
                            })
                          }
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            editingItem.mediaType !== "video"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <ImageIcon size={13} /> Image (Max 5 MB)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({
                              ...editingItem,
                              mediaType: "video",
                            })
                          }
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            editingItem.mediaType === "video"
                              ? "bg-white text-purple-700 shadow-sm"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <Film size={13} /> Video (Max 50 MB)
                        </button>
                      </div>
                    </div>

                    {/* Validation Rules Info Pill */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div
                        className={`p-3.5 rounded-2xl border ${
                          editingItem.mediaType !== "video"
                            ? "bg-sky-50/70 border-sky-200 text-sky-950"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <ImageIcon size={14} className="text-[#0ea5e9]" /> Image Rules
                          </span>
                          <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-sky-200 text-[#0284c7]">
                            Up to 5 MB
                          </span>
                        </div>
                        <p className="text-[11px] opacity-80">
                          Formats: {ALLOWED_IMAGE_EXTENSIONS.join(", ")}
                        </p>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl border ${
                          editingItem.mediaType === "video"
                            ? "bg-purple-50/70 border-purple-200 text-purple-950"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold mb-1">
                          <span className="flex items-center gap-1.5">
                            <Film size={14} className="text-purple-600" /> Video Rules
                          </span>
                          <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-purple-200 text-purple-700">
                            Up to 50 MB
                          </span>
                        </div>
                        <p className="text-[11px] opacity-80">
                          Formats: {ALLOWED_VIDEO_EXTENSIONS.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const droppedFile = e.dataTransfer.files?.[0];
                        if (droppedFile) {
                          processSelectedFile(droppedFile);
                        }
                      }}
                      onClick={() => mediaInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                        isDragging
                          ? "border-[#0ea5e9] bg-sky-50/50"
                          : validationStatus?.valid === false
                          ? "border-red-300 bg-red-50/30"
                          : validationStatus?.valid === true
                          ? "border-emerald-300 bg-emerald-50/20"
                          : "border-gray-200 bg-gray-50/60 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <input
                        ref={mediaInputRef}
                        type="file"
                        accept={
                          editingItem.mediaType === "video"
                            ? ".mp4,.mkv,.webm,.mov,.avi,.m4v,video/*"
                            : ".png,.jpg,.jpeg,.webp,.gif,.avif,image/*"
                        }
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) processSelectedFile(file);
                          e.target.value = "";
                        }}
                        className="hidden"
                      />

                      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-[#0ea5e9]">
                        {editingItem.mediaType === "video" ? (
                          <Film size={24} className="text-purple-600" />
                        ) : (
                          <Upload size={24} />
                        )}
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        Click to select or drag & drop your{" "}
                        {editingItem.mediaType === "video" ? "video" : "image"} file here
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {editingItem.mediaType === "video"
                          ? "Supports .mp4, .mkv, .webm, .mov, .avi, .m4v (Max 50 MB)"
                          : "Supports .png, .jpg, .jpeg, .svg, .webp, .gif, .avif (Max 5 MB)"}
                      </p>
                    </div>

                    {/* Validation Result Card */}
                    {validationStatus && (
                      <div
                        className={`p-4 rounded-2xl border flex flex-col gap-2 ${
                          validationStatus.valid
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold">
                            {validationStatus.valid ? (
                              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                            ) : (
                              <AlertCircle size={16} className="text-red-600 shrink-0" />
                            )}
                            <span>{validationStatus.message}</span>
                          </div>
                          {validationStatus.extension && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white border border-current/20 shrink-0">
                              {validationStatus.extension}
                            </span>
                          )}
                        </div>

                        {validationStatus.valid && validationStatus.sizeRatio !== undefined && (
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[11px] font-medium opacity-80">
                              <span>File: {editingItem.fileName || selectedFile?.name}</span>
                              <span>{validationStatus.sizeText}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${validationStatus.sizeRatio}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Or External URL Input */}
                    <div className="pt-2 border-t border-gray-100 space-y-4">
                      {editingItem.mediaType === "video" ? (
                        <>
                          <div>
                            <label
                              htmlFor="gallery-video-url"
                              className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5"
                            >
                              Or Direct Video URL (.mp4 / .mkv / .webm)
                            </label>
                            <input
                              id="gallery-video-url"
                              name="videoUrl"
                              type="url"
                              value={editingItem.videoUrl?.startsWith("blob:") ? "" : editingItem.videoUrl || ""}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  videoUrl: e.target.value,
                                })
                              }
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck={false}
                              placeholder="https://example.com/worship-night.mp4"
                              className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label
                                htmlFor="gallery-poster-url"
                                className="block text-xs font-semibold text-gray-500 uppercase tracking-widest"
                              >
                                Video Cover Thumbnail (Auto-captured or Custom Image ≤ 5 MB)
                              </label>
                              <button
                                type="button"
                                onClick={() => thumbInputRef.current?.click()}
                                className="text-xs font-semibold text-[#0ea5e9] hover:underline flex items-center gap-1"
                              >
                                <Upload size={12} /> Upload Cover Image
                              </button>
                              <input
                                ref={thumbInputRef}
                                type="file"
                                accept=".png,.jpg,.jpeg,.svg,.webp,.gif,.avif,image/*"
                                onChange={handleCustomThumbSelect}
                                className="hidden"
                              />
                            </div>
                            <input
                              id="gallery-poster-url"
                              name="imageUrl"
                              type="url"
                              value={
                                editingItem.imageUrl.startsWith("blob:") ||
                                editingItem.imageUrl.startsWith("data:")
                                  ? ""
                                  : editingItem.imageUrl
                              }
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  imageUrl: e.target.value,
                                })
                              }
                              autoCorrect="off"
                              autoCapitalize="off"
                              spellCheck={false}
                              placeholder="Or paste cover image URL (https://...)"
                              className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <label
                            htmlFor="gallery-image-url"
                            className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5"
                          >
                            Or Direct Image URL (.png / .jpeg / .svg / .webp)
                          </label>
                          <input
                            id="gallery-image-url"
                            name="imageUrl"
                            type="url"
                            value={editingItem.imageUrl.startsWith("blob:") ? "" : editingItem.imageUrl}
                            onChange={(e) =>
                              setEditingItem({
                                ...editingItem,
                                imageUrl: e.target.value,
                              })
                            }
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                            placeholder="https://christrevelationchurch.theglobalpeacemakers.org/..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </fieldset>

                  {/* Moment Metadata Details */}
                  <fieldset className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-5">
                    <legend className="text-lg font-semibold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-4 w-full">
                      <Sparkles size={20} className="text-[#0ea5e9]" /> Moment Details
                    </legend>

                    <div>
                      <label
                        htmlFor="gallery-title"
                        className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2"
                      >
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="gallery-title"
                        name="title"
                        type="text"
                        required
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        placeholder="e.g. Sunday Celebration & Praise"
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="gallery-description"
                        className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2"
                      >
                        Description / Caption <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="gallery-description"
                        name="description"
                        required
                        rows={3}
                        value={editingItem.description}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        placeholder="Describe this moment of worship, fellowship, or ministry..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#0ea5e9] focus:bg-white resize-y"
                      />
                    </div>
                  </fieldset>
                </div>

                {/* Right Column (1/3): Live Card Preview & Classification */}
                <div className="space-y-6">
                  {/* Media Preview Box */}
                  <div className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-3">
                      <span>Media Preview</span>
                      <span className="text-[11px] font-semibold text-[#0ea5e9] uppercase">
                        {editingItem.mediaType === "video" ? "Video Player" : "Photo"}
                      </span>
                    </h3>

                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 flex items-center justify-center">
                      {editingItem.mediaType === "video" && editingItem.videoUrl ? (
                        <video
                          src={editingItem.videoUrl}
                          poster={editingItem.imageUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain bg-black"
                        />
                      ) : editingItem.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={editingItem.imageUrl}
                          alt={editingItem.title || "Preview"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-gray-400 p-4">
                          {editingItem.mediaType === "video" ? (
                            <Film size={32} className="mx-auto mb-2 opacity-60" />
                          ) : (
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-60" />
                          )}
                          <p className="text-xs font-medium">No media selected yet</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Classification & Layout Settings */}
                  <fieldset className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-5">
                    <legend className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3 w-full">
                      Archive Classification
                    </legend>

                    <div>
                      <label
                        htmlFor="gallery-category"
                        className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2"
                      >
                        Category
                      </label>
                      <select
                        id="gallery-category"
                        name="category"
                        value={editingItem.category}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            category: e.target.value as GalleryItem["category"],
                          })
                        }
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3.5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                      >
                        {GALLERY_ITEM_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
                        Masonry Aspect Ratio
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {(["wide", "square", "tall"] as const).map((ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, aspectRatio: ratio })}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                              editingItem.aspectRatio === ratio
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="gallery-date"
                          className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest"
                        >
                          Date
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({ ...editingItem, date: formatCurrentMonthYear() })
                          }
                          className="text-[10px] font-semibold text-[#0ea5e9] hover:underline"
                        >
                          This Month
                        </button>
                      </div>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="gallery-date"
                          name="date"
                          type="text"
                          value={editingItem.date}
                          onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                          placeholder="December 2025"
                          className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="gallery-location"
                        className="block text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5"
                      >
                        Location / Venue
                      </label>
                      <div className="relative mb-2">
                        <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          id="gallery-location"
                          name="location"
                          type="text"
                          value={editingItem.location || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                          placeholder="Main Sanctuary"
                          className="w-full bg-gray-50 border border-gray-200 rounded-full pl-9 pr-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {VENUE_PRESETS.map((venue) => (
                          <button
                            key={venue}
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, location: venue })}
                            className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors ${
                              editingItem.location === venue
                                ? "bg-sky-50 border-sky-300 text-[#0284c7] font-semibold"
                                : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            {venue}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(editingItem.featured)}
                        onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                        className="w-4 h-4 rounded accent-[#0ea5e9]"
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        Mark as Featured Archive Moment
                      </span>
                    </label>
                  </fieldset>
                </div>
              </div>

              {/* ─── Form Preview Mode (Matches /gallery card & player) ────── */}
              {formTab === "preview" && (
                <div className="bg-white border border-gray-200 rounded-[32px] p-8 sm:p-12 max-w-4xl mx-auto w-full">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#0048ff]">
                        Live Card & Player Preview
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">
                        How this moment appears on /gallery
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Card Hover Preview */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Gallery Grid Card ({editingItem.aspectRatio || "wide"})
                      </p>
                      <div
                        className={`relative w-full ${
                          editingItem.aspectRatio === "tall"
                            ? "aspect-[3/4]"
                            : editingItem.aspectRatio === "square"
                            ? "aspect-square"
                            : "aspect-[4/3]"
                        } overflow-hidden bg-gray-900 group border border-[#0c0c0c]/10`}
                      >
                        {editingItem.mediaType === "video" && editingItem.videoUrl ? (
                          <video
                            src={editingItem.videoUrl}
                            poster={editingItem.imageUrl}
                            muted
                            loop
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : editingItem.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={editingItem.imageUrl}
                            alt={editingItem.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}

                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0c0c0c] text-[10px] font-open-sauce font-semibold uppercase tracking-wider shadow-sm">
                            {editingItem.category}
                          </span>
                          {editingItem.mediaType === "video" && (
                            <span className="px-2.5 py-1 bg-[#0048ff] text-white text-[10px] font-open-sauce font-semibold uppercase tracking-wider shadow-sm flex items-center gap-1">
                              <Play size={10} /> Video
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white z-20">
                          <span className="text-[10px] uppercase font-open-sauce tracking-widest text-[#0048ff] bg-white px-2 py-0.5 font-semibold inline-block w-max mb-1.5">
                            {editingItem.date || formatCurrentMonthYear()}
                          </span>
                          <h4 className="font-open-sauce text-lg font-medium leading-snug">
                            {editingItem.title || "Untitled Moment"}
                          </h4>
                          <p className="font-open-sauce text-xs text-white/80 font-light mt-1 line-clamp-2 leading-relaxed">
                            {editingItem.description || "Moment description will appear here..."}
                          </p>
                          {editingItem.location && (
                            <p className="text-[11px] text-white/60 mt-2">📍 {editingItem.location}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Full Lightbox / Video Player Preview */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Lightbox Media View
                      </p>
                      <div className="bg-black rounded-2xl p-4 text-white space-y-4">
                        <div className="relative aspect-video w-full bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
                          {editingItem.mediaType === "video" && editingItem.videoUrl ? (
                            <video
                              src={editingItem.videoUrl}
                              poster={editingItem.imageUrl}
                              controls
                              playsInline
                              className="w-full h-full object-contain"
                            />
                          ) : editingItem.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={editingItem.imageUrl}
                              alt={editingItem.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-white/40">No media uploaded</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base">
                            {editingItem.title || "Untitled Moment"}
                          </h4>
                          <p className="text-xs text-white/70 mt-1">
                            {editingItem.description || "Caption text..."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Lightbox Modal in Admin List View */}
      <AnimatePresence>
        {previewModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewModalItem(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden p-4 sm:p-6 text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#0ea5e9] text-white text-xs font-bold uppercase rounded-full">
                    {previewModalItem.category}
                  </span>
                  <span className="text-xs text-white/60">{previewModalItem.date}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewModalItem(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                {previewModalItem.mediaType === "video" && previewModalItem.videoUrl ? (
                  <video
                    src={previewModalItem.videoUrl}
                    poster={previewModalItem.imageUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewModalItem.imageUrl}
                    alt={previewModalItem.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{previewModalItem.title}</h3>
                  <p className="text-xs text-white/70 mt-0.5">{previewModalItem.description}</p>
                </div>
                {previewModalItem.location && (
                  <span className="text-xs text-white/50 shrink-0">📍 {previewModalItem.location}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

