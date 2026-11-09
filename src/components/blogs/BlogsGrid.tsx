"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAllBlogPosts } from "@/lib/useBlogPosts";
import { isValidImageSrc } from "@/lib/utils";

const BASE_CATEGORIES = ["All", "Faith", "Outreach", "Spiritual Growth", "Community"];

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-[4/3] bg-gray-200 mb-6" />
      <div className="h-7 bg-gray-200 rounded w-4/5 mb-3" />
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
      </div>
      <div className="flex gap-2 mt-auto">
        <div className="h-6 bg-gray-200 rounded-full w-20" />
        <div className="h-6 bg-gray-200 rounded-full w-24" />
      </div>
    </div>
  );
}

export default function BlogsGrid() {
  const { posts, isLoading } = useAllBlogPosts();
  const [activeCategory, setActiveCategory] = useState("All");

  const publishedPosts = useMemo(
    () => posts.filter((p) => p.status !== "Draft"),
    [posts]
  );

  const categories = useMemo(() => {
    const extra = publishedPosts
      .map((p) => p.category)
      .filter((c) => c && !BASE_CATEGORIES.includes(c));
    return [...BASE_CATEGORIES, ...Array.from(new Set(extra))];
  }, [publishedPosts]);

  const filteredBlogs =
    activeCategory === "All"
      ? publishedPosts
      : publishedPosts.filter((b) => b.category === activeCategory);

  return (
    <section className="w-full bg-white text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <h1 className="font-open-sauce text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight">
            Blogs
          </h1>
          <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/60 max-w-sm leading-relaxed mb-2 md:mb-4">
            Every story we share is a reflection of our commitment to faith, designed to inspire and drive spiritual growth.
          </p>
        </div>

        {/* Categories / Filter */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10 border-b border-[#0c0c0c]/10 pb-6 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-open-sauce text-lg sm:text-xl font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "text-[#0c0c0c]"
                  : "text-[#0c0c0c]/30 hover:text-[#0c0c0c]/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid or Skeleton */}
        {isLoading && posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="w-full py-20 text-center border border-gray-100 bg-gray-50/50 rounded-2xl">
            <p className="font-open-sauce text-lg text-[#0c0c0c]/60 mb-4">
              No blog posts found in this category yet.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className="px-6 py-2.5 bg-[#0c0c0c] text-white font-open-sauce text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:bg-black/80 transition-colors"
            >
              Show All Blogs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {filteredBlogs.map((blog) => {
              const imgSrc = isValidImageSrc(blog.image) ? blog.image : "/images/hero-bg.png";
              const tags = blog.tags?.length ? blog.tags : [blog.category.toUpperCase()];

              return (
                <Link
                  href={`/blogs/${encodeURIComponent(blog.id)}`}
                  key={blog.id}
                  className="flex flex-col group cursor-pointer"
                >
                  {/* Image */}
                  <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100 mb-6">
                    {imgSrc.startsWith("blob:") || imgSrc.startsWith("data:") || imgSrc.endsWith(".svg") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imgSrc}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={imgSrc}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    {/* Top Right small corner accent */}
                    <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Text Content */}
                  <h3 className="font-open-sauce text-2xl font-bold tracking-tight text-[#0c0c0c] mb-2 group-hover:text-[#0048FF] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="font-open-sauce text-[#0c0c0c]/60 text-sm mb-6 line-clamp-2">
                    {blog.excerpt}
                  </p>

                  {/* Tags & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 border border-[#0c0c0c]/10 rounded-full text-[10px] font-bold tracking-widest text-[#0c0c0c]/60 uppercase group-hover:border-[#0c0c0c]/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-open-sauce text-xs text-[#0c0c0c]/40 font-medium">
                      {blog.date} • {blog.readTime}
                    </span>
                  </div>

                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
