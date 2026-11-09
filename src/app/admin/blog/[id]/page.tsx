"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Eye,
  BookOpen,
  User,
  Tag,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Quote,
  FileText,
  Hash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogForm, { countBlogWords } from "@/components/admin/blog/BlogForm";
import {
  useBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogPost,
} from "@/lib/useBlogPosts";
import { isValidImageSrc } from "@/lib/utils";
import { useConfirm } from "@/components/ui/ConfirmDialogProvider";
import toast from "react-hot-toast";

function isBlobOrDataUrl(src?: string): boolean {
  if (!src) return false;
  return src.startsWith("blob:") || src.startsWith("data:") || src.endsWith(".svg");
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: any) => {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-[#0ea5e9] text-white hover:bg-[#0284c7] px-4 py-2 text-sm",
    outline:
      "border border-[#e6ece7] bg-white text-black hover:bg-[#f4f8f4] px-4 py-2 text-sm",
    danger:
      "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-2 text-sm",
  };
  return (
    <button
      className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

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
      <div className="h-72 rounded-[32px] bg-gray-200" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-gray-200 rounded-3xl" />
          <div className="h-40 bg-gray-200 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function BlogAdminDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { confirm } = useConfirm();

  const { post, isLoading, isError, mutate } = useBlogPost(id);

  const [localPost, setLocalPost] = useState<BlogPost | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "edit">("preview");
  const [tab, setTab] = useState<"overview" | "audit">("overview");
  const [toggling, setToggling] = useState(false);

  React.useEffect(() => {
    if (post) setLocalPost(post);
  }, [post]);

  const toggleStatus = async () => {
    if (!localPost) return;
    const newStatus = localPost.status === "Draft" ? "Published" : "Draft";
    setToggling(true);
    try {
      await updateBlogPost(localPost.id, { status: newStatus });
      setLocalPost({ ...localPost, status: newStatus });
      await mutate();
      toast.success(`Post status set to ${newStatus}`);
    } catch {
      toast.error("Failed to update post status.");
    } finally {
      setToggling(false);
    }
  };

  const handleSavePost = async (finalPost: BlogPost) => {
    if (!localPost) return;
    try {
      await updateBlogPost(localPost.id, finalPost);
      setLocalPost(finalPost);
      await mutate();
      setViewMode("preview");
      toast.success("Blog post saved successfully");
      if (finalPost.id !== id) {
        router.replace(`/admin/blog/${finalPost.id}`);
      }
    } catch {
      toast.error("Failed to save blog post.");
    }
  };

  const handleDeletePost = async () => {
    if (!localPost) return;
    const ok = await confirm({
      title: "Delete Blog Post",
      message: `Are you sure you want to delete "${localPost.title}" permanently?`,
      confirmText: "Delete Post",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await deleteBlogPost(localPost.id);
      toast.success("Blog post deleted successfully");
      router.push("/admin/blog");
    } catch {
      toast.error("Failed to delete blog post.");
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
        <BookOpen className="w-12 h-12 text-red-300" />
        <p className="text-red-500 font-semibold">Failed to load blog article.</p>
        <button onClick={() => mutate()} className="text-sm text-gray-500 underline">
          Retry
        </button>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Button>
      </div>
    );
  }

  if (!post || !localPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BookOpen className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500 font-semibold">Blog article not found.</p>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Button>
      </div>
    );
  }

  const totalWords = countBlogWords(localPost);
  const isPublished = (localPost.status || "Published") === "Published";

  // Content & SEO Audit Checks
  const auditChecks = [
    {
      label: "Compelling Article Title",
      passed: localPost.title.trim().length >= 10,
      detail: `${localPost.title.trim().length} characters (Recommended: 10–80 chars)`,
    },
    {
      label: "Clean URL Slug",
      passed: /^[a-z0-9-]+$/.test(localPost.id),
      detail: `/blogs/${localPost.id}`,
    },
    {
      label: "Lead Summary / Excerpt",
      passed: localPost.excerpt.trim().length >= 30,
      detail: `${localPost.excerpt.trim().length} characters (Displayed on /blogs cards)`,
    },
    {
      label: "Hero Cover Image",
      passed: Boolean(
        isValidImageSrc(localPost.image) || isBlobOrDataUrl(localPost.image)
      ),
      detail: localPost.fileName
        ? `Uploaded file: ${localPost.fileName}`
        : localPost.image || "Missing cover image",
    },
    {
      label: "Structured Section Headings",
      passed: localPost.content.some((c) => Boolean(c.heading?.trim())),
      detail: `${
        localPost.content.filter((c) => Boolean(c.heading?.trim())).length
      } of ${localPost.content.length} sections have headings`,
    },
    {
      label: "Highlighted Pull Quote",
      passed: Boolean(localPost.pullQuote?.trim()),
      detail: localPost.pullQuote?.trim()
        ? "Pull quote included"
        : "Optional pull quote not set",
    },
    {
      label: "Card & Topic Tags",
      passed: (localPost.tags || []).length >= 1,
      detail:
        (localPost.tags || []).length > 0
          ? localPost.tags.join(", ")
          : "No tags assigned",
    },
    {
      label: "Author Profile & Bio",
      passed: Boolean(localPost.author?.name && localPost.author?.bio),
      detail: `${localPost.author?.name || "Unknown"} (${
        localPost.author?.role || "No role"
      })`,
    },
  ];

  const passedCount = auditChecks.filter((c) => c.passed).length;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {viewMode === "preview" ? (
          <>
            {/* ── Top Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/admin/blog")}
                  className="mt-1 w-10 h-10 rounded-[14px] border border-[#e6ece7] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-black" />
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <span className="text-xs font-bold text-[#0ea5e9] uppercase tracking-wider bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                      {localPost.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs font-semibold text-gray-500">
                      {localPost.date}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="text-xs font-semibold text-gray-500">
                      {localPost.readTime}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
                    {localPost.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap pl-14 lg:pl-0">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
                    isPublished ? "bg-[#22c55e]" : "bg-gray-500"
                  }`}
                >
                  {isPublished ? "Published" : "Draft"}
                </span>

                <button
                  type="button"
                  onClick={toggleStatus}
                  disabled={toggling}
                  title="Toggle Published / Draft status"
                  className="w-10 h-10 rounded-[14px] border border-[#e6ece7] bg-white hover:bg-gray-50 flex items-center justify-center transition-colors disabled:opacity-50"
                >
                  {isPublished ? (
                    <ToggleRight className="w-5 h-5 text-[#22c55e]" />
                  ) : (
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <Link
                  href={`/blogs/${localPost.id}`}
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-xl font-semibold border border-[#e6ece7] bg-white text-black hover:bg-[#f4f8f4] px-4 py-2 text-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-2" /> View Live
                </Link>

                <Button variant="outline" onClick={() => setViewMode("edit")}>
                  <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Article
                </Button>

                <Button
                  variant="danger"
                  onClick={handleDeletePost}
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* ── Hero Cover Image ── */}
            {(isValidImageSrc(localPost.image) || isBlobOrDataUrl(localPost.image)) && (
              <div className="relative w-full h-[320px] sm:h-[380px] rounded-[32px] overflow-hidden bg-[#f4f8f4] border border-[#e6ece7]">
                {isBlobOrDataUrl(localPost.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={localPost.image}
                    alt={localPost.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={localPost.image}
                    alt={localPost.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    {(localPost.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[11px] font-bold tracking-widest uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    <Eye className="w-3.5 h-3.5 text-[#0ea5e9]" />
                    {(localPost.views || 0).toLocaleString()} views
                  </div>
                </div>
              </div>
            )}

            {/* ── Tabs ── */}
            <div className="flex gap-2 border-b border-[#e6ece7] pb-px">
              {(
                [
                  { id: "overview", label: "Article Overview" },
                  {
                    id: "audit",
                    label: `Content & Validation Check (${passedCount}/${auditChecks.length})`,
                  },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${
                    tab === t.id
                      ? "border-[#0ea5e9] text-[#0ea5e9]"
                      : "border-transparent text-gray-400 hover:text-[#0ea5e9] hover:border-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── TAB 1: ARTICLE OVERVIEW ── */}
              {tab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid lg:grid-cols-3 gap-6"
                >
                  {/* Left 2/3 Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Lead Excerpt */}
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Lead Summary / Excerpt
                      </h3>
                      <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">
                        {localPost.excerpt}
                      </p>
                    </div>

                    {/* Article Content Sections */}
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-8">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-black flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#0ea5e9]" /> Article Body Sections
                        </h3>
                        <span className="text-xs font-semibold text-gray-400">
                          {localPost.content.length} sections • {totalWords} words
                        </span>
                      </div>

                      <div className="space-y-8">
                        {localPost.content.map((block, idx) => (
                          <div
                            key={idx}
                            className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f4f8f4] border border-[#e6ece7] text-gray-600">
                                Section {idx + 1} ({idx === 0 ? "H2 Lead" : "H3 Subheading"})
                              </span>
                            </div>
                            {block.heading && (
                              <h4 className="text-xl font-bold text-black mb-2.5">
                                {block.heading}
                              </h4>
                            )}
                            <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                              {block.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Pull Quote */}
                      {localPost.pullQuote && (
                        <div className="bg-[#f4f8f4] border-l-4 border-black rounded-r-2xl p-6 mt-6">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            <Quote className="w-4 h-4 text-black" /> Highlighted Pull Quote
                          </div>
                          <p className="text-lg sm:text-xl italic font-semibold text-black leading-relaxed">
                            &ldquo;{localPost.pullQuote}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right 1/3 Column */}
                  <div className="space-y-6">
                    {/* Author Card */}
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-5">
                      <h3 className="text-lg font-bold text-black">Author Profile</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-[#f4f8f4] border border-[#e6ece7] relative shrink-0 flex items-center justify-center">
                          {isBlobOrDataUrl(localPost.author?.avatar) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={localPost.author.avatar}
                              alt={localPost.author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : isValidImageSrc(localPost.author?.avatar) ? (
                            <Image
                              src={localPost.author.avatar}
                              alt={localPost.author.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-black">
                            {localPost.author?.name || "Pastor David Vance"}
                          </h4>
                          <p className="text-xs font-semibold text-[#0ea5e9] mt-0.5">
                            {localPost.author?.role || "Senior Pastor"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
                        {localPost.author?.bio ||
                          "Dedicated to sharing insights and stories from our vibrant community."}
                      </p>
                    </div>

                    {/* Metadata Details */}
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-6">
                      <h3 className="text-lg font-bold text-black">Publishing Details</h3>
                      <div className="space-y-4">
                        {[
                          { icon: Calendar, label: "Publish Date", value: localPost.date },
                          { icon: Clock, label: "Reading Time", value: localPost.readTime },
                          { icon: Tag, label: "Category", value: localPost.category },
                          { icon: Hash, label: "URL Slug", value: `/blogs/${localPost.id}` },
                          {
                            icon: Eye,
                            label: "Total Views",
                            value: (localPost.views || 0).toLocaleString(),
                          },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#f4f8f4] border border-[#e6ece7] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-black" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
                              <p className="text-sm font-bold text-black truncate">{value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags Card */}
                    <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-4">
                      <h3 className="text-lg font-bold text-black">Assigned Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {(localPost.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="px-3.5 py-1.5 bg-[#f4f8f4] text-black text-xs font-bold rounded-full border border-[#e6ece7] uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── TAB 2: CONTENT & VALIDATION AUDIT ── */}
              {tab === "audit" && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid lg:grid-cols-3 gap-6"
                >
                  <div className="lg:col-span-2 bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-black flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-[#0ea5e9]" /> Content & Validation Checklist
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Verifies that all fields displayed on /blogs and /blogs/{localPost.id} are complete.
                        </p>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {passedCount} / {auditChecks.length} Passed
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {auditChecks.map((check) => (
                        <div
                          key={check.label}
                          className="py-4 flex items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            {check.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-black">{check.label}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{check.detail}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                              check.passed
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-amber-50 text-amber-600 border border-amber-200"
                            }`}
                          >
                            {check.passed ? "Valid" : "Optional"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Public /blogs Card Preview */}
                  <div className="bg-white border border-[#e6ece7] rounded-3xl p-8 space-y-4 h-max">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Public /blogs Card Preview
                    </h3>
                    <div className="border border-gray-100 rounded-2xl p-4 bg-[#fafafa]">
                      <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100 mb-4">
                        {isBlobOrDataUrl(localPost.image) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={localPost.image}
                            alt={localPost.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={
                              isValidImageSrc(localPost.image)
                                ? localPost.image
                                : "/images/hero-bg.png"
                            }
                            alt={localPost.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-open-sauce text-lg font-bold tracking-tight text-[#0c0c0c] mb-1.5">
                        {localPost.title}
                      </h4>
                      <p className="font-open-sauce text-[#0c0c0c]/60 text-xs mb-4 line-clamp-2">
                        {localPost.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {(localPost.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 border border-[#0c0c0c]/15 rounded-full text-[9px] font-bold tracking-widest text-[#0c0c0c]/60 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* ── EDIT MODE — Shared BlogForm Component ── */
          <BlogForm
            post={localPost}
            isNew={false}
            onChange={setLocalPost}
            onSave={handleSavePost}
            onCancel={() => {
              setLocalPost(post);
              setViewMode("preview");
            }}
          />
        )}
      </div>
    </div>
  );
}

