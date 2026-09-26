'use client';

import React, { useState } from "react";
import { useFormDraft } from "@/lib/useFormDraft";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit3, Trash2, X, Save,
  ArrowLeft, Eye, TrendingUp, BookOpen,
  User, AlignLeft, Image as ImageIcon,
  LayoutGrid, Bell, Settings as SettingsIcon
} from "lucide-react";
import Image from "next/image";

import { useAllBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, type BlogPost } from "@/lib/useBlogPosts";
import { isValidImageSrc } from "@/lib/utils";

const emptyPost: BlogPost = {
  id: "",
  title: "",
  excerpt: "",
  content: [{ text: "" }],
  pullQuote: "",
  category: "Business Strategies",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  readTime: "5 min read",
  image: "",
  author: { name: "Admin User", role: "Author", avatar: "" },
  views: 0
};

const CATEGORIES = ["Marketing Tips", "Business Strategies", "Industry Insights", "Client Success", "Tutorials", "Development"];

export default function AdminBlogPage() {
  const { posts, isLoading, isError, mutate } = useAllBlogPosts();

  // Views
  const [view, setView] = useState<"list" | "form">("list");
  const [formTab, setFormTab] = useState<"edit" | "preview">("edit");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");

  // ── Auto-save blog draft ──
  const blogDraftKey = editingPost?.id ? `draft:blog:${editingPost.id}` : "";
  const { hasDraft: blogHasDraft, clearDraft: clearBlogDraft, lastSaved: blogLastSaved } = useFormDraft(
    blogDraftKey,
    editingPost,
    (restored) => setEditingPost(restored)
  );

  const stats = {
    totalBlogs: posts.length,
    totalViews: posts.reduce((acc, curr) => acc + (curr.views || 0), 0),
    topCategory: "Tutorials"
  };

  // Form Handlers
  const handleAddNew = () => {
    setEditingPost({ ...emptyPost, id: `post-${Date.now()}` });
    setView("form");
    setFormTab("edit");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setView("form");
    setFormTab("edit");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(id);
        mutate();
      } catch (err) {
        console.error('Failed to delete post', err);
        alert('Failed to delete post.');
      }
    }
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editingPost) return;
    setSaving(true);
    try {
      const isNew = !posts.find(p => p.id === editingPost.id);
      if (isNew) {
        await addBlogPost(editingPost);
      } else {
        await updateBlogPost(editingPost.id, editingPost);
      }
      clearBlogDraft();   // wipe draft after successful save
      mutate();
      setView("list");
      setEditingPost(null);
    } catch (err) {
      console.error('Failed to save post', err);
      alert('Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (index: number, field: "heading" | "text", value: string) => {
    if (!editingPost) return;
    const newContent = [...editingPost.content];
    if (field === "heading") {
      newContent[index] = { ...newContent[index], heading: value };
    } else {
      newContent[index] = { ...newContent[index], text: value };
    }
    setEditingPost({ ...editingPost, content: newContent });
  };

  const addContentBlock = () => {
    if (!editingPost) return;
    setEditingPost({ ...editingPost, content: [...editingPost.content, { text: "" }] });
  };

  const removeContentBlock = (index: number) => {
    if (!editingPost) return;
    const newContent = editingPost.content.filter((_, i) => i !== index);
    setEditingPost({ ...editingPost, content: newContent.length ? newContent : [{ text: "" }] });
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8f9]">
      {/* Top Header */}
      {/* <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[13px] font-medium">
          <LayoutGrid className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Overview</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Blog Management</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </header> */}

      <div className="p-8 flex-1">
        {/* ─── List View ───────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
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
                  <h1 className="text-[26px] font-medium text-gray-900 tracking-tight">Blog & Articles</h1>
                  <p className="text-[14px] text-gray-500 font-medium mt-1">Manage your blog posts, insights, and stories.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-gray-400 transition-colors "
                    />
                  </div>
                  <button
                    onClick={handleAddNew}
                    className="bg-black hover:bg-neutral-800 text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors  shrink-0"
                  >
                    <Plus size={16} /> New Post
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-2">
                {[
                  { label: "Total Posts", value: stats.totalBlogs, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
                  { label: "Total Views", value: stats.totalViews, icon: Eye, color: "text-purple-500", bg: "bg-purple-50" },
                  { label: "Top Category", value: stats.topCategory, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-gray-100  rounded-[20px] p-6 flex items-center justify-between">
                    <div>
                      <p className="text-[15px] font-medium text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                      <stat.icon size={22} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden h-[300px] flex flex-col">
                      <div className="w-full aspect-video bg-gray-200"></div>
                      <div className="p-5 flex flex-col flex-1 gap-3">
                        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                        <div className="w-1/2 h-5 bg-gray-200 rounded"></div>
                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                            <div className="flex flex-col gap-1">
                              <div className="w-16 h-2 bg-gray-200 rounded"></div>
                              <div className="w-10 h-2 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="group bg-white border border-gray-100  rounded-3xl overflow-hidden hover:shadow-md hover:border-gray-200 transition-all flex flex-col h-full">
                      {/* Image */}
                      <div className="relative aspect-video w-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {isValidImageSrc(post.image) ? (
                          <Image
                            src={post.image!}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <BookOpen size={24} />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-black px-3 py-1 rounded-full border border-gray-100  text-[10px] font-semibold text-white">
                          {post.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-medium text-gray-900 text-lg mb-2 line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
                          {post.title}
                        </h3>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 relative">
                              {isValidImageSrc(post.author?.avatar) ? (
                                <Image src={post.author.avatar!} alt={post.author.name} fill className="object-cover" />
                              ) : (
                                <User size={14} className="m-auto text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div>
                              <p className="text-[11px] font-medium text-gray-900">{post.author.name}</p>
                              <p className="text-[10px] text-gray-500 font-medium">{post.date}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full mr-1 border border-gray-100">
                              <Eye size={12} />
                              {post.views ?? 0}
                            </div>
                            <button
                              onClick={() => handleEdit(post)}
                              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredPosts.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-gray-200 border-dashed rounded-3xl bg-white">
                      <BookOpen size={32} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm font-medium">No posts found.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Form View ───────────────────────────────────────────────────────── */}
          {view === "form" && editingPost && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto w-full flex flex-col gap-6"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between bg-white border border-gray-200  rounded-full p-3 sticky top-20 z-10">
                <button
                  onClick={() => setView("list")}
                  className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                <div className="flex bg-gray-100 border border-gray-200 rounded-full p-1">
                  <button
                    onClick={() => setFormTab("edit")}
                    className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${formTab === "edit" ? "bg-white text-gray-900 " : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setFormTab("preview")}
                    className={`px-5 py-1.5 rounded-full text-xs font-semibold transition-all ${formTab === "preview" ? "bg-white text-gray-900 " : "text-gray-500 hover:text-gray-900"}`}
                  >
                    Preview
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-black hover:bg-neutral-800 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors "
                  >
                    <Save size={16} /> Save Post
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${formTab === 'preview' ? 'hidden' : 'block'}`}>

                {/* Main Fields */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white border border-gray-200  rounded-[24px] p-8 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                      <AlignLeft size={20} className="text-gray-400" /> Basic Details
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Title</label>
                      <input
                        type="text"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        placeholder="e.g. Maximizing Efficiency in Operations"
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Slug (URL ID)</label>
                      <input
                        type="text"
                        value={editingPost.id}
                        onChange={(e) => setEditingPost({ ...editingPost, id: e.target.value })}
                        placeholder="e.g. maximizing-efficiency"
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Excerpt</label>
                      <textarea
                        value={editingPost.excerpt}
                        onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                        placeholder="Short summary for the card..."
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Pull Quote</label>
                      <textarea
                        value={editingPost.pullQuote}
                        onChange={(e) => setEditingPost({ ...editingPost, pullQuote: e.target.value })}
                        placeholder="Highlighted quote in the article..."
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 italic focus:outline-none focus:border-gray-400 focus:bg-white transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200  rounded-[24px] p-8 space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
                      <BookOpen size={20} className="text-gray-400" /> Article Content
                    </h3>

                    {editingPost.content.map((paragraph, idx) => (
                      <div key={idx} className="relative group bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-widest">Heading (Optional)</label>
                          {editingPost.content.length > 1 && (
                            <button
                              onClick={() => removeContentBlock(idx)}
                              className="p-1.5 bg-white text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-200 "
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={paragraph.heading || ""}
                          onChange={(e) => handleContentChange(idx, "heading", e.target.value)}
                          placeholder="Heading text..."
                          className="w-full bg-white border border-gray-200 rounded-full px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-gray-400"
                        />

                        <label className="text-xs font-medium text-gray-500 uppercase tracking-widest block pt-2">Paragraph Text</label>
                        <textarea
                          value={paragraph.text}
                          onChange={(e) => handleContentChange(idx, "text", e.target.value)}
                          placeholder={`Paragraph ${idx + 1}...`}
                          rows={4}
                          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-400 resize-none"
                        />
                      </div>
                    ))}
                    <button
                      onClick={addContentBlock}
                      className="w-full py-4 border-2 border-gray-200 border-dashed rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Add Paragraph
                    </button>
                  </div>
                </div>

                {/* Sidebar Fields */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200  rounded-[24px] p-6 space-y-5">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2 border-b border-gray-100 pb-3">
                      <ImageIcon size={16} className="text-gray-400" /> Media & Meta
                    </h3>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Hero Image URL</label>
                      <input
                        type="text"
                        value={editingPost.image}
                        onChange={(e) => setEditingPost({ ...editingPost, image: e.target.value })}
                        placeholder="/images/WhatsApp-Image-2025-09-04-at-11.39.09-AM-1.jpeg"
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                      />
                      {isValidImageSrc(editingPost.image) && (
                        <div className="mt-3 relative aspect-video rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                          <Image src={editingPost.image} alt="Preview" fill className="object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Category</label>
                      <select
                        value={editingPost.category}
                        onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value as any })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                      >
                        {CATEGORIES.map(c => <option className="bg-white" key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Date</label>
                        <input
                          type="text"
                          value={editingPost.date}
                          onChange={(e) => setEditingPost({ ...editingPost, date: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Read Time</label>
                        <input
                          type="text"
                          value={editingPost.readTime}
                          onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Views</label>
                      <input
                        type="number"
                        value={editingPost.views || 0}
                        onChange={(e) => setEditingPost({ ...editingPost, views: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200  rounded-[24px] p-6 space-y-5">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2 border-b border-gray-100 pb-3">
                      <User size={16} className="text-gray-400" /> Author Details
                    </h3>

                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Name</label>
                      <input
                        type="text"
                        value={editingPost.author.name}
                        onChange={(e) => setEditingPost({ ...editingPost, author: { ...editingPost.author, name: e.target.value } })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Role</label>
                      <input
                        type="text"
                        value={editingPost.author.role}
                        onChange={(e) => setEditingPost({ ...editingPost, author: { ...editingPost.author, role: e.target.value } })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-2">Avatar URL</label>
                      <input
                        type="text"
                        value={editingPost.author.avatar}
                        onChange={(e) => setEditingPost({ ...editingPost, author: { ...editingPost.author, avatar: e.target.value } })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Preview Overlay */}
              {formTab === "preview" && (
                <div className="bg-white border border-gray-200 rounded-[24px]  p-10 md:p-16 max-w-4xl mx-auto w-full">
                  <div className="flex items-center gap-2 bg-[#e6f5ef] text-[#0f5c35] px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-flex">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {editingPost.category}
                  </div>

                  <div className="text-gray-500 text-base font-medium mb-6">
                    {editingPost.date} • {editingPost.author.name}
                  </div>

                  <h1 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6">{editingPost.title}</h1>
                  <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">{editingPost.excerpt}</p>

                  {isValidImageSrc(editingPost.image) && (
                    <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 relative bg-[#d0e0d8]">
                      <Image src={editingPost.image} alt="Hero" fill className="object-cover mix-blend-multiply opacity-80" />
                    </div>
                  )}

                  <div className="space-y-8 text-gray-600 text-lg leading-relaxed">
                    {editingPost.content.map((block, i) => (
                      <div key={i}>
                        {block.heading && <h2 className="text-2xl font-medium text-gray-900 mb-4">{block.heading}</h2>}
                        <p>{block.text}</p>
                      </div>
                    ))}
                  </div>

                  {editingPost.pullQuote && (
                    <div className="my-12 pl-6 border-l-4 border-gray-900">
                      <p className="text-2xl italic text-gray-900 font-medium">"{editingPost.pullQuote}"</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
