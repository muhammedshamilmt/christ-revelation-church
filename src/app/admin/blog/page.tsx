"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  TrendingUp,
  BookOpen,
  User,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BlogForm, { createEmptyBlogPost } from "@/components/admin/blog/BlogForm";
import {
  useAllBlogPosts,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  BLOG_CATEGORIES,
  type BlogPost,
} from "@/lib/useBlogPosts";
import { isValidImageSrc } from "@/lib/utils";
import { useConfirm } from "@/components/ui/ConfirmDialogProvider";
import toast from "react-hot-toast";

function isBlobOrDataUrl(src?: string): boolean {
  if (!src) return false;
  return src.startsWith("blob:") || src.startsWith("data:") || src.endsWith(".svg");
}

export default function AdminBlogPage() {
  const router = useRouter();
  const { confirm } = useConfirm();
  const { posts, isLoading, mutate } = useAllBlogPosts();

  const [view, setView] = useState<"list" | "form">("list");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isNewPost, setIsNewPost] = useState(false);
  const [originalId, setOriginalId] = useState<string>("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Published" | "Draft">("All");

  // Dynamic stats
  const stats = useMemo(() => {
    const totalBlogs = posts.length;
    const publishedCount = posts.filter((p) => (p.status || "Published") === "Published").length;
    const totalViews = posts.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const topCategory =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Faith";

    return { totalBlogs, publishedCount, totalViews, topCategory };
  }, [posts]);

  const handleAddNew = () => {
    setIsNewPost(true);
    setOriginalId("");
    setEditingPost(createEmptyBlogPost());
    setView("form");
  };

  const handleEdit = (post: BlogPost) => {
    setIsNewPost(false);
    setOriginalId(post.id);
    setEditingPost({
      ...post,
      tags: Array.isArray(post.tags) && post.tags.length > 0 ? [...post.tags] : [post.category.toUpperCase()],
      content: post.content?.length ? post.content.map((c) => ({ ...c })) : [{ heading: "", text: "" }],
      author: { ...post.author },
    });
    setView("form");
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Blog Post",
      message: "Are you sure you want to delete this blog post? This action will permanently remove the article.",
      confirmText: "Delete Post",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!ok) return;

    try {
      await deleteBlogPost(id);
      await mutate();
      toast.success("Blog post deleted successfully");
    } catch (err) {
      console.error("Failed to delete post", err);
      toast.error("Failed to delete post.");
    }
  };

  const handleSave = async (finalPost: BlogPost) => {
    try {
      if (isNewPost) {
        await addBlogPost(finalPost);
        toast.success("Blog post published successfully");
      } else {
        if (originalId && originalId !== finalPost.id) {
          await deleteBlogPost(originalId);
          await addBlogPost(finalPost);
        } else {
          await updateBlogPost(finalPost.id, finalPost);
        }
        toast.success("Blog post updated successfully");
      }
      await mutate();
      setView("list");
      setEditingPost(null);
    } catch {
      toast.error("Failed to save blog post.");
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const postStatus = p.status || "Published";
      const matchesStatus = statusFilter === "All" || postStatus === statusFilter;
      const matchesCat = categoryFilter === "All" || p.category === categoryFilter;
      const q = search.toLowerCase().trim();
      if (!q) return matchesStatus && matchesCat;

      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author?.name?.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchesStatus && matchesCat && matchesSearch;
    });
  }, [posts, statusFilter, categoryFilter, search]);

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
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                  <h1 className="text-[26px] font-medium text-gray-900 tracking-tight">
                    Blog & Articles
                  </h1>
                  <p className="text-[14px] text-gray-500 font-medium mt-1">
                    Manage your blog posts, insights, and stories. Click any article card to open its detailed view.
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="search"
                      id="admin-blog-search"
                      name="search"
                      aria-label="Search blog posts"
                      placeholder="Search title, tag, author..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
                    />
                  </div>
                  <Link
                    href="/blogs"
                    target="_blank"
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <ExternalLink size={14} /> View Live
                  </Link>
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shrink-0"
                  >
                    <Plus size={16} /> New Post
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    label: "Total Posts",
                    value: stats.totalBlogs,
                    icon: BookOpen,
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Published Articles",
                    value: stats.publishedCount,
                    icon: CheckCircle2,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "Total Views",
                    value: stats.totalViews.toLocaleString(),
                    icon: Eye,
                    color: "text-purple-500",
                    bg: "bg-purple-50",
                  },
                  {
                    label: "Top Category",
                    value: stats.topCategory,
                    icon: TrendingUp,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-[20px] p-6 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[14px] font-medium text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}
                    >
                      <stat.icon size={22} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Filter Bar: Categories + Status */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {["All", ...BLOG_CATEGORIES].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        categoryFilter === cat
                          ? "bg-gray-900 text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full self-start md:self-auto shrink-0">
                  {(["All", "Published", "Draft"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                        statusFilter === st
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-900"
                      }`}
                    >
                      {st === "Draft" ? "Drafts" : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-100 rounded-3xl overflow-hidden h-[340px] flex flex-col"
                    >
                      <div className="w-full aspect-[4/3] bg-gray-200" />
                      <div className="p-5 flex flex-col flex-1 gap-3">
                        <div className="w-3/4 h-5 bg-gray-200 rounded" />
                        <div className="w-1/2 h-4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPosts.map((post) => {
                    const isPublished = (post.status || "Published") === "Published";
                    return (
                      <div
                        key={post.id}
                        onClick={() => router.push(`/admin/blog/${post.id}`)}
                        className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all flex flex-col h-full cursor-pointer"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden shrink-0">
                          {isBlobOrDataUrl(post.image) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : isValidImageSrc(post.image) ? (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, 350px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                              <BookOpen size={24} />
                            </div>
                          )}

                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="bg-[#0ea5e9] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                              {post.category}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
                                isPublished ? "bg-emerald-500/90" : "bg-gray-600/90"
                              }`}
                            >
                              {isPublished ? "Published" : "Draft"}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1">
                            <Clock size={10} /> {post.readTime}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-bold text-gray-900 text-base mb-1.5 line-clamp-2 leading-snug group-hover:text-[#0ea5e9] transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-0.5 border border-gray-200 bg-gray-50 rounded-full text-[9px] font-bold tracking-wider text-gray-600 uppercase"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
                                {isBlobOrDataUrl(post.author?.avatar) ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : isValidImageSrc(post.author?.avatar) ? (
                                  <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <User
                                    size={14}
                                    className="m-auto text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-gray-900 truncate">
                                  {post.author.name}
                                </p>
                                <p className="text-[10px] text-gray-500 font-medium truncate">
                                  {post.date}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full mr-1 border border-gray-100">
                                <Eye size={12} />
                                {post.views ?? 0}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(post);
                                }}
                                title="Edit blog post"
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(post.id);
                                }}
                                title="Delete blog post"
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

                  {filteredPosts.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-gray-200 border-dashed rounded-3xl bg-white">
                      <BookOpen size={32} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm font-medium mb-4">
                        No blog posts found.
                      </p>
                      <button
                        type="button"
                        onClick={handleAddNew}
                        className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-5 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                      >
                        <Plus size={16} /> Create Blog Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── FORM VIEW (Shared BlogForm) ─────────────────────────────────── */}
          {view === "form" && editingPost && (
            <BlogForm
              post={editingPost}
              isNew={isNewPost}
              onChange={setEditingPost}
              onSave={handleSave}
              onCancel={() => {
                setView("list");
                setEditingPost(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
