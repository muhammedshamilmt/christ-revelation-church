"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DUMMY_BLOGS } from "@/lib/blogs";

const categories = ["All", "Faith", "Outreach", "Spiritual Growth", "Community"];

export default function BlogsGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs = activeCategory === "All"
    ? DUMMY_BLOGS
    : DUMMY_BLOGS.filter(b => b.category === activeCategory);

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
              className={`font-open-sauce text-lg sm:text-xl font-medium transition-colors ${activeCategory === cat ? "text-[#0c0c0c]" : "text-[#0c0c0c]/30 hover:text-[#0c0c0c]/60"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {filteredBlogs.map((blog) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id} className="flex flex-col group cursor-pointer">

              {/* Image */}
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-100 mb-6">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Top Right small red accent like in image */}
                <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-[#ff385c] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Text Content */}
              <h3 className="font-open-sauce text-2xl font-bold tracking-tight text-[#0c0c0c] mb-2 group-hover:text-[#0048FF] transition-colors">
                {blog.title}
              </h3>
              <p className="font-open-sauce text-[#0c0c0c]/60 text-sm mb-6 line-clamp-2">
                {blog.excerpt}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-3 mt-auto">
                {blog.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 border border-[#0c0c0c]/10 rounded-full text-[10px] font-bold tracking-widest text-[#0c0c0c]/60 uppercase group-hover:border-[#0c0c0c]/30 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
