"use client";

import React, { useState, useRef } from "react";
import { useFormDraft } from "@/lib/useFormDraft";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  AlignLeft,
  BookOpen,
  User,
  Image as ImageIcon,
  Plus,
  X,
  Tag,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import Image from "next/image";
import {
  BLOG_CATEGORIES,
  saveMediaBlobToIDB,
  type BlogPost,
} from "@/lib/useBlogPosts";
import {
  validateGalleryFile,
  formatFileSize,
  getFileExtension,
} from "@/lib/useGallery";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/gallery";
import { isValidImageSrc } from "@/lib/utils";

export const AUTHOR_PRESETS = [
  {
    name: "Pastor David Vance",
    role: "Senior Pastor",
    avatar:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3526-scaled.jpeg",
    bio: "Dedicated to sharing insights and stories from our vibrant community.",
  },
  {
    name: "Sarah Jenkins",
    role: "Youth Director",
    avatar:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3531-scaled.jpeg",
    bio: "Passionate about mentoring young believers and building transformative youth ministry spaces.",
  },
  {
    name: "Rev. Michael Smith",
    role: "Associate Minister",
    avatar:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3544-scaled.jpeg",
    bio: "Guiding congregations in contemplative prayer, biblical foundations, and spiritual formation.",
  },
  {
    name: "Emily Davis",
    role: "Community Outreach Coordinator",
    avatar:
      "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3546-scaled.jpeg",
    bio: "Serving local families through compassionate outreach, food drives, and community partnerships.",
  },
];

export const BLOG_IMAGE_PRESETS = [
  {
    label: "Worship Sanctuary",
    url: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-236321-scaled.jpg",
  },
  {
    label: "Youth Retreat",
    url: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3450-scaled.jpeg",
  },
  {
    label: "Bible & Prayer",
    url: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pavel-danilyuk-8814997-scaled.jpg",
  },
  {
    label: "Community Outreach",
    url: "https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/09/Pfeatured1280.webp",
  },
  { label: "Church Hero", url: "/images/hero-bg.png" },
];

export function formatTodayBlogDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function slugifyBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function calculateBlogReadTime(post: BlogPost): string {
  const words = [
    post.title,
    post.excerpt,
    post.pullQuote || "",
    ...post.content.map((c) => `${c.heading || ""} ${c.text || ""}`),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} MIN`;
}

export function countBlogWords(post: BlogPost): number {
  return [
    post.title,
    post.excerpt,
    post.pullQuote || "",
    ...post.content.map((c) => `${c.heading || ""} ${c.text || ""}`),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function createEmptyBlogPost(): BlogPost {
  return {
    id: `blog-${Date.now()}`,
    title: "",
    excerpt: "",
    content: [{ heading: "Understanding the foundation", text: "" }],
    pullQuote: "",
    category: "Faith",
    tags: ["FAITH", "COMMUNITY"],
    status: "Published",
    date: formatTodayBlogDate(),
    readTime: "5 MIN",
    image: "",
    author: {
      name: "Pastor David Vance",
      role: "Senior Pastor",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      bio: "Dedicated to sharing insights and stories from our vibrant community.",
    },
    views: 0,
    createdAt: new Date().toISOString(),
  };
}

function isBlobOrDataUrl(src?: string): boolean {
  if (!src) return false;
  return src.startsWith("blob:") || src.startsWith("data:") || src.endsWith(".svg");
}

interface BlogFormProps {
  post: BlogPost;
  isNew?: boolean;
  onChange: (post: BlogPost) => void;
  onSave: (finalPost: BlogPost) => Promise<void> | void;
  onCancel: () => void;
}

export default function BlogForm({
  post,
  isNew = false,
  onChange,
  onSave,
  onCancel,
}: BlogFormProps) {
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!isNew);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDraggingHero, setIsDraggingHero] = useState(false);

  // Uploaded file state & validation (Images up to 5 MB: .png, .jpg, .jpeg, .svg, .webp, .gif, .avif)
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [heroValidation, setHeroValidation] = useState<{
    valid: boolean;
    message: string;
    extension?: string;
    sizeText?: string;
    sizeRatio?: number;
  } | null>(
    post.fileName && post.fileSize
      ? {
          valid: true,
          message: `Validated image (${post.fileName})`,
          extension: getFileExtension(post.fileName).toUpperCase(),
          sizeText: `${formatFileSize(post.fileSize)} / 5 MB`,
          sizeRatio: Math.min(100, Math.round((post.fileSize / MAX_IMAGE_SIZE_BYTES) * 100)),
        }
      : null
  );

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save draft to localStorage
  const draftKey = post?.id ? `draft:blog:${isNew ? "new" : post.id}` : "";
  const { hasDraft, clearDraft, lastSaved } = useFormDraft(draftKey, post, (restored) => {
    if (restored) onChange(restored);
  });

  const set = (patch: Partial<BlogPost>) => onChange({ ...post, ...patch });

  const handleTitleChange = (newTitle: string) => {
    const nextSlug =
      isNew && !slugManuallyEdited
        ? slugifyBlogTitle(newTitle) || `blog-${Date.now()}`
        : post.id;
    set({ title: newTitle, id: nextSlug });
  };

  // Validate and preview Hero Image File (<= 5 MB, .png/.jpg/.jpeg/.svg/.webp/.gif/.avif)
  const processHeroImageFile = (file: File) => {
    setFormError(null);
    const check = validateGalleryFile(file, "image");
    if (!check.valid) {
      setSelectedHeroFile(null);
      setHeroValidation({
        valid: false,
        message: check.error || "Invalid image file.",
        extension: check.extension?.toUpperCase(),
        sizeText: formatFileSize(file.size),
      });
      setFormError(check.error || "Invalid hero image selected.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedHeroFile(file);
    setHeroValidation({
      valid: true,
      message: `Valid image (${check.extension}) — ${formatFileSize(file.size)} ≤ 5 MB max limit.`,
      extension: check.extension?.toUpperCase(),
      sizeText: `${formatFileSize(file.size)} / 5 MB`,
      sizeRatio: Math.min(100, Math.max(2, Math.round((file.size / MAX_IMAGE_SIZE_BYTES) * 100))),
    });
    set({
      image: previewUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  };

  // Validate and preview Author Avatar File (<= 5 MB, .png/.jpg/.jpeg/.svg/.webp/.gif/.avif)
  const processAvatarFile = (file: File) => {
    setFormError(null);
    const check = validateGalleryFile(file, "image");
    if (!check.valid) {
      setFormError(`Author Avatar Error: ${check.error}`);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setSelectedAvatarFile(file);
    set({
      author: {
        ...post.author,
        avatar: previewUrl,
      },
    });
  };

  const handleAddTag = (rawTag?: string) => {
    const candidate = (rawTag ?? tagInput).trim().toUpperCase();
    if (!candidate) return;
    const currentTags = post.tags || [];
    if (!currentTags.includes(candidate)) {
      set({ tags: [...currentTags, candidate] });
    }
    if (rawTag === undefined) {
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    set({ tags: (post.tags || []).filter((t) => t !== tagToRemove) });
  };

  const handleContentChange = (index: number, field: "heading" | "text", value: string) => {
    const newContent = [...post.content];
    newContent[index] = { ...newContent[index], [field]: value };
    set({ content: newContent });
  };

  const addContentBlock = () => {
    set({
      content: [...post.content, { heading: "Deep Dive", text: "" }],
    });
  };

  const moveContentBlock = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= post.content.length) return;
    const newContent = [...post.content];
    const temp = newContent[index];
    newContent[index] = newContent[targetIndex];
    newContent[targetIndex] = temp;
    set({ content: newContent });
  };

  const removeContentBlock = (index: number) => {
    const newContent = post.content.filter((_, i) => i !== index);
    set({
      content: newContent.length
        ? newContent
        : [{ heading: "Understanding the foundation", text: "" }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    // 1. Check file validation state
    if (heroValidation && !heroValidation.valid) {
      setFormError(heroValidation.message);
      setFormTab("edit");
      return;
    }

    // 2. Validate Title
    if (!post.title.trim() || post.title.trim().length < 3) {
      setFormError("Please enter a valid article title (at least 3 characters).");
      setFormTab("edit");
      return;
    }

    // 3. Validate Slug
    const cleanSlug = post.id.trim() || slugifyBlogTitle(post.title);
    if (!cleanSlug || !/^[a-zA-Z0-9-_]+$/.test(cleanSlug)) {
      setFormError(
        "Please enter a valid URL Slug using only letters, numbers, hyphens, or underscores."
      );
      setFormTab("edit");
      return;
    }

    // 4. Validate Excerpt
    if (!post.excerpt.trim() || post.excerpt.trim().length < 10) {
      setFormError("Please provide an article excerpt / summary (at least 10 characters).");
      setFormTab("edit");
      return;
    }

    // 5. Validate Content Sections
    const nonEmptyContent = post.content.filter((c) => c.text.trim() !== "");
    if (nonEmptyContent.length === 0) {
      setFormError("Please write at least one paragraph of article content.");
      setFormTab("edit");
      return;
    }

    // 6. Validate Author Name
    if (!post.author?.name?.trim()) {
      setFormError("Please provide the author's name.");
      setFormTab("edit");
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      let finalImageUrl = post.image.trim();
      let finalAvatarUrl = post.author.avatar?.trim() || "";

      if (selectedHeroFile) {
        finalImageUrl = await saveMediaBlobToIDB(`blog_hero:${cleanSlug}`, selectedHeroFile);
      }
      if (selectedAvatarFile) {
        finalAvatarUrl = await saveMediaBlobToIDB(`blog_avatar:${cleanSlug}`, selectedAvatarFile);
      }

      const finalTags =
        post.tags && post.tags.length > 0 ? post.tags : [post.category.toUpperCase()];

      const payload: BlogPost = {
        ...post,
        id: cleanSlug,
        title: post.title.trim(),
        excerpt: post.excerpt.trim(),
        content: nonEmptyContent,
        tags: finalTags,
        status: post.status || "Published",
        image: finalImageUrl || "/images/hero-bg.png",
        readTime: post.readTime.trim() || calculateBlogReadTime(post),
        date: post.date.trim() || formatTodayBlogDate(),
        author: {
          ...post.author,
          name: post.author.name.trim(),
          role: post.author.role?.trim() || "Senior Pastor",
          avatar: finalAvatarUrl,
          bio:
            post.author.bio?.trim() ||
            "Dedicated to sharing insights and stories from our vibrant community.",
        },
      };

      clearDraft();
      await onSave(payload);
    } catch (err) {
      console.error("Failed to save blog post:", err);
      setFormError("Failed to save blog post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      key="blog-form"
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto w-full flex flex-col gap-6"
    >
      {/* ── Sticky Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-[#e6ece7] rounded-full p-3 sticky top-4 z-30 shadow-lg gap-3">
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
              Draft saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <div className="flex bg-[#f4f8f4] border border-[#e6ece7] rounded-full p-1">
          <button
            type="button"
            onClick={() => setFormTab("edit")}
            className={`px-6 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              formTab === "edit"
                ? "bg-white text-black shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Edit Article
          </button>
          <button
            type="button"
            onClick={() => setFormTab("preview")}
            className={`px-6 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
              formTab === "preview"
                ? "bg-white text-black shadow-sm border border-gray-200"
                : "text-gray-500 hover:text-black"
            }`}
          >
            Preview Mode (/blogs)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-60 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : isNew ? "Publish Article" : "Save Article"}
          </button>
        </div>
      </div>

      {/* ── Validation Error Banner ── */}
      <div aria-live="polite">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-start justify-between gap-3 text-sm font-medium">
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

      {/* ── Edit Form Grid ── */}
      {formTab === "edit" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Main Column (2/3) ── */}
          <div className="xl:col-span-2 space-y-6">
            {/* Basic Details */}
            <fieldset className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-6">
              <legend className="text-lg font-bold text-black flex items-center gap-2 mb-2 border-b border-gray-100 pb-4 w-full">
                <AlignLeft size={20} className="text-[#0ea5e9]" /> Article Details
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label
                    htmlFor="blog-title"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                  >
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="blog-title"
                    name="title"
                    type="text"
                    required
                    value={post.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. The Power of Community Worship in Modern Times"
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-3 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="blog-slug"
                      className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                    >
                      URL Slug (ID) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (post.title.trim()) {
                          set({ id: slugifyBlogTitle(post.title) });
                          setSlugManuallyEdited(true);
                        }
                      }}
                      className="text-[11px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={11} /> Auto-slug
                    </button>
                  </div>
                  <input
                    id="blog-slug"
                    name="slug"
                    type="text"
                    required
                    value={post.id}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      set({ id: e.target.value });
                    }}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="power-of-community-worship"
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-2.5 text-sm font-mono text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] transition-colors"
                  />
                  <p className="text-[11px] text-gray-400 mt-1 pl-2">
                    Public route: <span className="font-mono text-gray-600">/blogs/{post.id || "..."}</span>
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="blog-status"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                  >
                    Publishing Status
                  </label>
                  <select
                    id="blog-status"
                    name="status"
                    value={post.status || "Published"}
                    onChange={(e) =>
                      set({ status: e.target.value as "Published" | "Draft" })
                    }
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-4 py-2.5 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] transition-colors"
                  >
                    <option value="Published">Published (Live on /blogs)</option>
                    <option value="Draft">Draft (Hidden from /blogs)</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="blog-excerpt"
                      className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                    >
                      Excerpt / Lead Summary <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {post.excerpt.length} chars
                    </span>
                  </div>
                  <textarea
                    id="blog-excerpt"
                    name="excerpt"
                    required
                    rows={3}
                    value={post.excerpt}
                    onChange={(e) => set({ excerpt: e.target.value })}
                    placeholder="Short summary displayed on the /blogs grid card and beneath the article title..."
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-y transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="blog-pull-quote"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                  >
                    Pull Quote (Highlighted Blockquote)
                  </label>
                  <textarea
                    id="blog-pull-quote"
                    name="pullQuote"
                    rows={2}
                    value={post.pullQuote || ""}
                    onChange={(e) => set({ pullQuote: e.target.value })}
                    placeholder="e.g. Worship is our highest calling and the soil in which deep community flourishes."
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-4 py-3 text-sm italic font-medium text-gray-800 focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-y transition-colors"
                  />
                </div>
              </div>
            </fieldset>

            {/* Article Content Sections */}
            <fieldset className="bg-white border border-gray-200 rounded-[24px] p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <legend className="text-lg font-bold text-black flex items-center gap-2">
                  <BookOpen size={20} className="text-[#0ea5e9]" /> Article Content Sections
                </legend>
                <span className="text-xs font-semibold text-gray-400">
                  {post.content.length} {post.content.length === 1 ? "section" : "sections"} •{" "}
                  {countBlogWords(post)} words
                </span>
              </div>

              <div className="space-y-5">
                {post.content.map((paragraph, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f4f8f4] border border-[#e6ece7] p-5 rounded-2xl space-y-4 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-black bg-white border border-[#e6ece7] px-3 py-1 rounded-full">
                        Section {idx + 1}
                        <span className="text-[10px] font-semibold text-gray-400">
                          {idx === 0 ? "(Lead H2 Heading)" : "(Subheading H3)"}
                        </span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveContentBlock(idx, -1)}
                          disabled={idx === 0}
                          title="Move section up"
                          className="p-1.5 bg-white text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors border border-[#e6ece7]"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveContentBlock(idx, 1)}
                          disabled={idx === post.content.length - 1}
                          title="Move section down"
                          className="p-1.5 bg-white text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors border border-[#e6ece7]"
                        >
                          <ArrowDown size={13} />
                        </button>
                        {post.content.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeContentBlock(idx)}
                            title="Remove section"
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor={`blog-content-heading-${idx}`}
                        className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                      >
                        Section Heading (Optional)
                      </label>
                      <input
                        id={`blog-content-heading-${idx}`}
                        name={`contentHeading_${idx}`}
                        type="text"
                        value={paragraph.heading || ""}
                        onChange={(e) => handleContentChange(idx, "heading", e.target.value)}
                        placeholder={
                          idx === 0 ? "e.g. Understanding the foundation" : "e.g. Deep Dive"
                        }
                        className="w-full bg-white border border-[#e6ece7] rounded-full px-4 py-2.5 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`blog-content-text-${idx}`}
                        className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                      >
                        Paragraph Text {idx === 0 && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        id={`blog-content-text-${idx}`}
                        name={`contentText_${idx}`}
                        required={idx === 0}
                        rows={4}
                        value={paragraph.text}
                        onChange={(e) => handleContentChange(idx, "text", e.target.value)}
                        placeholder={`Write section ${idx + 1} paragraph content...`}
                        className="w-full bg-white border border-[#e6ece7] rounded-2xl px-4 py-3 text-sm font-medium text-black focus:outline-none focus:border-[#0ea5e9] resize-y transition-colors"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addContentBlock}
                className="w-full py-4 border-2 border-[#e6ece7] border-dashed rounded-2xl text-sm font-bold text-gray-600 hover:bg-[#f4f8f4] hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Add Article Section
              </button>
            </fieldset>
          </div>

          {/* ── Sidebar Column (1/3) ── */}
          <div className="space-y-6">
            {/* Hero Cover Image Upload with 5MB & Format Validation */}
            <fieldset className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <legend className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3 w-full">
                <ImageIcon size={16} className="text-[#0ea5e9]" /> Hero Cover Image
              </legend>

              {/* Validation Rule Badge */}
              <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200 text-sky-950 text-xs">
                <div className="flex items-center justify-between font-bold mb-0.5">
                  <span>Allowed Image Formats</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-sky-200 text-[#0284c7]">
                    Max 5 MB
                  </span>
                </div>
                <p className="text-[11px] opacity-80">{ALLOWED_IMAGE_EXTENSIONS.join(", ")}</p>
              </div>

              {/* Drag & Drop File Upload Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingHero(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDraggingHero(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingHero(false);
                  const droppedFile = e.dataTransfer.files?.[0];
                  if (droppedFile) processHeroImageFile(droppedFile);
                }}
                onClick={() => heroFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                  isDraggingHero
                    ? "border-[#0ea5e9] bg-sky-50/50"
                    : heroValidation?.valid === false
                    ? "border-red-300 bg-red-50/40"
                    : heroValidation?.valid === true
                    ? "border-emerald-300 bg-emerald-50/20"
                    : "border-[#e6ece7] bg-[#f4f8f4]/70 hover:bg-[#f4f8f4]"
                }`}
              >
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.gif,.avif,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processHeroImageFile(file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <Upload size={20} className="mx-auto text-[#0ea5e9] mb-1.5" />
                <p className="text-xs font-bold text-gray-900">
                  Click or drop cover image (≤ 5 MB)
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  .png, .jpg, .jpeg, .webp, .gif, .avif
                </p>
              </div>

              {/* Validation Feedback */}
              {heroValidation && (
                <div
                  className={`p-3 rounded-2xl border text-xs ${
                    heroValidation.valid
                      ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-bold">
                    <span className="flex items-center gap-1.5">
                      {heroValidation.valid ? (
                        <FileCheck size={14} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle size={14} className="text-red-600 shrink-0" />
                      )}
                      <span className="text-[11px]">{heroValidation.message}</span>
                    </span>
                    {heroValidation.extension && (
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-current/20">
                        {heroValidation.extension}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Or Image URL */}
              <div>
                <label
                  htmlFor="blog-hero-image-url"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                >
                  Or Image URL
                </label>
                <input
                  id="blog-hero-image-url"
                  name="image"
                  type="text"
                  value={post.image.startsWith("blob:") ? "" : post.image}
                  onChange={(e) => {
                    setHeroValidation(null);
                    setSelectedHeroFile(null);
                    set({ image: e.target.value, fileName: undefined, fileSize: undefined });
                  }}
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="/images/hero-bg.png or https://..."
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>

              {/* Preset Images */}
              <div className="flex flex-wrap gap-1">
                {BLOG_IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setHeroValidation(null);
                      setSelectedHeroFile(null);
                      set({ image: preset.url, fileName: undefined, fileSize: undefined });
                    }}
                    className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-colors ${
                      post.image === preset.url
                        ? "bg-sky-50 border-sky-300 text-[#0284c7]"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* 4:3 Image Preview */}
              {(isValidImageSrc(post.image) || isBlobOrDataUrl(post.image)) && (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#e6ece7] bg-[#f4f8f4] group">
                  {isBlobOrDataUrl(post.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.image}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image src={post.image} alt="Hero Preview" fill className="object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setHeroValidation(null);
                      setSelectedHeroFile(null);
                      set({ image: "", fileName: undefined, fileSize: undefined });
                    }}
                    title="Clear image"
                    className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </fieldset>

            {/* Category, Tags & Publishing Meta */}
            <fieldset className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-5">
              <legend className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3 w-full">
                <Tag size={16} className="text-[#0ea5e9]" /> Category, Tags & Meta
              </legend>

              <div>
                <label
                  htmlFor="blog-category"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                >
                  Primary Category
                </label>
                <select
                  id="blog-category"
                  name="category"
                  value={post.category}
                  onChange={(e) => set({ category: e.target.value })}
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2.5 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags Manager */}
              <div>
                <label
                  htmlFor="blog-tag-input"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2"
                >
                  Article Tags (Shown on /blogs Cards)
                </label>

                <div className="flex flex-wrap gap-1.5 mb-2.5 min-h-[28px]">
                  {(post.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#0284c7] text-[10px] font-bold tracking-widest uppercase"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag} tag`}
                        className="hover:text-red-500"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    id="blog-tag-input"
                    name="tagInput"
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    autoCorrect="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="e.g. WORSHIP"
                    className="flex-1 bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2 text-xs font-bold uppercase text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag()}
                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-full text-xs font-bold transition-colors shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="blog-date"
                      className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                    >
                      Date
                    </label>
                    <button
                      type="button"
                      onClick={() => set({ date: formatTodayBlogDate() })}
                      className="text-[10px] font-bold text-[#0ea5e9] hover:underline"
                    >
                      Today
                    </button>
                  </div>
                  <input
                    id="blog-date"
                    name="date"
                    type="text"
                    value={post.date}
                    onChange={(e) => set({ date: e.target.value })}
                    placeholder="10 June 2026"
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="blog-read-time"
                      className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                    >
                      Read Time
                    </label>
                    <button
                      type="button"
                      onClick={() => set({ readTime: calculateBlogReadTime(post) })}
                      className="text-[10px] font-bold text-[#0ea5e9] hover:underline"
                    >
                      Auto
                    </button>
                  </div>
                  <input
                    id="blog-read-time"
                    name="readTime"
                    type="text"
                    value={post.readTime}
                    onChange={(e) => set({ readTime: e.target.value })}
                    placeholder="5 MIN"
                    className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="blog-views"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                >
                  Total Views
                </label>
                <input
                  id="blog-views"
                  name="views"
                  type="number"
                  min={0}
                  value={post.views || 0}
                  onChange={(e) =>
                    set({ views: Math.max(0, parseInt(e.target.value) || 0) })
                  }
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>
            </fieldset>

            {/* Author Profile */}
            <fieldset className="bg-white border border-gray-200 rounded-[24px] p-6 space-y-4">
              <legend className="text-sm font-bold text-black flex items-center gap-2 border-b border-gray-100 pb-3 w-full">
                <User size={16} className="text-[#0ea5e9]" /> Author Profile
              </legend>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Quick Select Author:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {AUTHOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => set({ author: { ...preset } })}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-colors ${
                        post.author.name === preset.name
                          ? "bg-sky-50 border-sky-300 text-[#0284c7]"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="blog-author-name"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                >
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="blog-author-name"
                  name="authorName"
                  type="text"
                  required
                  value={post.author.name}
                  onChange={(e) =>
                    set({ author: { ...post.author, name: e.target.value } })
                  }
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <label
                  htmlFor="blog-author-role"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                >
                  Role / Ministry Title
                </label>
                <input
                  id="blog-author-role"
                  name="authorRole"
                  type="text"
                  value={post.author.role}
                  onChange={(e) =>
                    set({ author: { ...post.author, role: e.target.value } })
                  }
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2 text-sm font-semibold text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="blog-author-avatar"
                    className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest"
                  >
                    Avatar URL or Upload (≤ 5 MB)
                  </label>
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="text-[10px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1"
                  >
                    <Upload size={10} /> Upload
                  </button>
                  <input
                    ref={avatarFileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.gif,.avif,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processAvatarFile(file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f4f8f4] border border-[#e6ece7] relative shrink-0">
                    {isBlobOrDataUrl(post.author.avatar) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-full h-full object-cover"
                      />
                    ) : isValidImageSrc(post.author.avatar) ? (
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name || "Author"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User
                        size={16}
                        className="text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    )}
                  </div>
                  <input
                    id="blog-author-avatar"
                    name="authorAvatar"
                    type="text"
                    value={post.author.avatar.startsWith("blob:") ? "" : post.author.avatar}
                    onChange={(e) =>
                      set({ author: { ...post.author, avatar: e.target.value } })
                    }
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="https://..."
                    className="flex-1 bg-[#f4f8f4] border border-[#e6ece7] rounded-full px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="blog-author-bio"
                  className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5"
                >
                  Author Bio (Sidebar on /blogs/[id])
                </label>
                <textarea
                  id="blog-author-bio"
                  name="authorBio"
                  rows={2}
                  value={post.author.bio || ""}
                  onChange={(e) =>
                    set({ author: { ...post.author, bio: e.target.value } })
                  }
                  placeholder="Dedicated to sharing insights and stories from our vibrant community."
                  className="w-full bg-[#f4f8f4] border border-[#e6ece7] rounded-2xl px-3.5 py-2 text-xs font-medium text-black focus:outline-none focus:bg-white focus:border-[#0ea5e9] resize-y"
                />
              </div>
            </fieldset>
          </div>
        </div>
      )}

      {/* ── Preview Mode (Matches /blogs/[id] layout) ── */}
      {formTab === "preview" && (
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-[40px] p-8 sm:p-12 lg:p-16 w-full text-[#0c0c0c] shadow-lg">
          <div className="max-w-[1100px] mx-auto w-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-20 mb-14">
              <div className="w-full md:w-2/3">
                <h1 className="font-open-sauce text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-6">
                  {post.title || "Article Title Placeholder"}
                </h1>
                <p className="font-open-sauce text-[#0c0c0c]/60 text-base sm:text-lg font-light leading-relaxed max-w-xl">
                  {post.excerpt || "Your short article summary will appear here..."}
                </p>
              </div>

              <div className="w-full md:w-1/3 flex flex-col gap-5 md:pl-8 md:border-l border-[#0c0c0c]/10">
                <div className="flex flex-col gap-1">
                  <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                    Date
                  </span>
                  <span className="font-open-sauce text-sm font-medium">
                    {post.date || formatTodayBlogDate()}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                    Category
                  </span>
                  <span className="font-open-sauce text-sm font-medium">
                    {post.category}
                    {post.tags?.length ? `, ${post.tags.join(", ")}` : ""}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                    Reading Time
                  </span>
                  <span className="font-open-sauce text-sm font-medium">
                    {post.readTime || calculateBlogReadTime(post)}
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full aspect-[16/9] relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5 mb-14">
              {isBlobOrDataUrl(post.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.image}
                  alt={post.title || "Preview"}
                  className="w-full h-full object-cover"
                />
              ) : isValidImageSrc(post.image) ? (
                <Image
                  src={post.image}
                  alt={post.title || "Preview"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                  <ImageIcon size={32} />
                  <span className="text-xs font-medium">
                    No Hero Image Selected (Defaults to /images/hero-bg.png)
                  </span>
                </div>
              )}
            </div>

            {/* Content & Sidebar */}
            <div className="flex flex-col md:flex-row gap-12 md:gap-20">
              <div className="w-full md:w-2/3 flex flex-col gap-8">
                {post.content.map((block, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    {block.heading &&
                      (i === 0 ? (
                        <h2 className="font-open-sauce text-2xl sm:text-3xl font-medium tracking-tight mb-1">
                          {block.heading}
                        </h2>
                      ) : (
                        <h3 className="font-open-sauce text-xl sm:text-2xl font-medium tracking-tight mt-4 mb-1">
                          {block.heading}
                        </h3>
                      ))}
                    <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed whitespace-pre-line">
                      {block.text || "Paragraph content..."}
                    </p>
                  </div>
                ))}

                {post.pullQuote && (
                  <blockquote className="my-4 pl-6 border-l-4 border-[#0c0c0c] py-2">
                    <p className="font-open-sauce text-xl sm:text-2xl italic text-[#0c0c0c] font-medium leading-relaxed">
                      &ldquo;{post.pullQuote}&rdquo;
                    </p>
                  </blockquote>
                )}
              </div>

              <div className="w-full md:w-1/3 flex flex-col gap-8 md:pl-8 md:border-l border-[#0c0c0c]/10">
                <div className="flex flex-col gap-3">
                  <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                    Author
                  </span>
                  <div className="flex items-center gap-3">
                    {isBlobOrDataUrl(post.author.avatar) ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-[#0c0c0c]/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : isValidImageSrc(post.author.avatar) ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0 bg-[#0c0c0c]/5">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-col">
                      <span className="font-open-sauce text-lg font-bold leading-tight">
                        {post.author.name || "Author Name"}
                      </span>
                      {post.author.role && (
                        <span className="font-open-sauce text-xs text-[#0c0c0c]/50 font-medium mt-0.5">
                          {post.author.role}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-open-sauce text-xs text-[#0c0c0c]/50 leading-relaxed">
                    {post.author.bio ||
                      "Dedicated to sharing insights and stories from our vibrant community."}
                  </p>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                      Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 border border-[#0c0c0c]/15 rounded-full text-[10px] font-bold tracking-widest text-[#0c0c0c]/60 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.form>
  );
}

