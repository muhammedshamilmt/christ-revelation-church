"use client";

import Image from "next/image";
import Link from "next/link";
import { Blog, DUMMY_BLOGS } from "@/lib/blogs";
import { notFound } from "next/navigation";

export default function BlogDetail({ id }: { id: string }) {
  const blog = DUMMY_BLOGS.find(b => b.id === id);

  if (!blog) {
    notFound();
  }

  const relatedNews = DUMMY_BLOGS.filter(b => b.id !== id).slice(0, 3);

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col">

        {/* Back Button */}
        <Link href="/blogs" className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/50 hover:text-[#0c0c0c] transition-colors mb-16 inline-block border border-[#0c0c0c]/20 rounded-full px-4 py-2 w-max">
          Go Back
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24 mb-16">
          <div className="w-full md:w-2/3">
            <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-8">
              {blog.title}
            </h1>
            <p className="font-open-sauce text-[#0c0c0c]/60 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              {blog.excerpt}
            </p>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-6 md:pl-10 md:border-l border-[#0c0c0c]/10">
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">Date</span>
              <span className="font-open-sauce text-sm font-medium">{blog.date}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">Category</span>
              <span className="font-open-sauce text-sm font-medium">{blog.category}, {blog.tags[0]}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">Reading Time</span>
              <span className="font-open-sauce text-sm font-medium">{blog.readTime}</span>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5 mb-16 sm:mb-24">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content & Sidebar */}
        <div className="flex flex-col md:flex-row gap-16 md:gap-24 relative">

          {/* Main Body */}
          <div className="w-full md:w-2/3 flex flex-col gap-10">
            {blog.content.map((paragraph, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {idx === 0 ? (
                  <>
                    <h2 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight mb-2">
                      Understanding the foundation
                    </h2>
                    <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed">
                      {paragraph}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-open-sauce text-xl sm:text-2xl font-medium tracking-tight mt-6 mb-2">
                      Deep Dive
                    </h3>
                    <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed">
                      {paragraph}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-10 md:sticky md:top-40 h-max md:pl-10 md:border-l border-[#0c0c0c]/10">
            <div className="flex flex-col gap-3">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">Author</span>
              <span className="font-open-sauce text-lg font-bold">{blog.author}</span>
              <p className="font-open-sauce text-xs text-[#0c0c0c]/50 leading-relaxed">
                Dedicated to sharing insights and stories from our vibrant community.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">Share</span>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors font-open-sauce text-xs font-bold">
                  FB
                </button>
                <button className="w-10 h-10 rounded-full border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors font-open-sauce text-xs font-bold">
                  TW
                </button>
                <button className="w-10 h-10 rounded-full border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors font-open-sauce text-xs font-bold">
                  IN
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#0c0c0c]/10 my-24" />

        {/* Related News */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight uppercase">
              Related News
            </h3>
            <Link href="/blogs" className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/50 hover:text-[#0c0c0c] border border-[#0c0c0c]/20 rounded-full px-4 py-2 transition-colors">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedNews.map((news) => (
              <Link href={`/blogs/${news.id}`} key={news.id} className="flex flex-col group">
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#0c0c0c]/5 mb-6">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h4 className="font-open-sauce text-xl font-bold tracking-tight mb-2 group-hover:text-[#0048FF] transition-colors line-clamp-2">
                  {news.title}
                </h4>
                <p className="font-open-sauce text-sm text-[#0c0c0c]/50 line-clamp-2">
                  {news.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
