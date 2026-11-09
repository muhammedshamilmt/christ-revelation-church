"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useBlogPost, useAllBlogPosts, incrementBlogViews } from "@/lib/useBlogPosts";
import { isValidImageSrc } from "@/lib/utils";

function BlogDetailSkeleton() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen animate-pulse">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col">
        <div className="h-9 w-28 bg-gray-200 rounded-full mb-16" />
        <div className="flex flex-col md:flex-row justify-between gap-16 mb-16">
          <div className="w-full md:w-2/3 space-y-4">
            <div className="h-12 bg-gray-200 rounded w-4/5" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <div className="h-10 bg-gray-200 rounded w-36" />
            <div className="h-10 bg-gray-200 rounded w-36" />
          </div>
        </div>
        <div className="w-full h-[50vh] bg-gray-200 rounded-3xl mb-16" />
      </div>
    </section>
  );
}

export default function BlogDetail({ id }: { id: string }) {
  const { post: blog, isLoading } = useBlogPost(id);
  const { posts } = useAllBlogPosts();

  useEffect(() => {
    if (blog?.id) {
      incrementBlogViews(blog.id);
    }
  }, [blog?.id]);

  if (isLoading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    notFound();
  }

  const relatedNews = posts.filter((b) => b.id !== blog.id && b.status !== "Draft").slice(0, 3);
  const heroImage = isValidImageSrc(blog.image) ? blog.image : "/images/hero-bg.png";
  const isUnoptimizedImg = (src: string) =>
    src.startsWith("blob:") || src.startsWith("data:") || src.endsWith(".svg");
  const tags = blog.tags?.length ? blog.tags : [blog.category.toUpperCase()];
  const authorName = typeof blog.author === "string" ? blog.author : blog.author?.name || "Pastor David Vance";
  const authorRole = typeof blog.author === "string" ? "" : blog.author?.role || "";
  const authorAvatar = typeof blog.author === "string" ? "" : blog.author?.avatar || "";
  const authorBio =
    (typeof blog.author !== "string" && blog.author?.bio) ||
    "Dedicated to sharing insights and stories from our vibrant community.";

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col">

        {/* Back Button */}
        <Link
          href="/blogs"
          className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/50 hover:text-[#0c0c0c] transition-colors mb-16 inline-block border border-[#0c0c0c]/20 rounded-full px-4 py-2 w-max"
        >
          ← Go Back to Blogs
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
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Date
              </span>
              <span className="font-open-sauce text-sm font-medium">{blog.date}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Category
              </span>
              <span className="font-open-sauce text-sm font-medium">
                {blog.category}
                {tags.length > 0 ? `, ${tags.join(", ")}` : ""}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Reading Time
              </span>
              <span className="font-open-sauce text-sm font-medium">{blog.readTime}</span>
            </div>
            {typeof blog.views === "number" && (
              <div className="flex flex-col gap-1">
                <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                  Total Views
                </span>
                <span className="font-open-sauce text-sm font-medium">{blog.views.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Image */}
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5 mb-16 sm:mb-24">
          {isUnoptimizedImg(heroImage) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroImage} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <Image
              src={heroImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Content & Sidebar */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24 mb-24">
          {/* Main Article Content */}
          <div className="w-full md:w-2/3 flex flex-col gap-10">
            {blog.pullQuote && (
              <blockquote className="border-l-4 border-[#0048FF] pl-6 py-2 my-2">
                <p className="font-open-sauce text-xl sm:text-2xl font-medium italic text-[#0c0c0c]/90 leading-snug">
                  &ldquo;{blog.pullQuote}&rdquo;
                </p>
              </blockquote>
            )}

            {blog.content?.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {item.heading && (
                  <h3 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight text-[#0c0c0c] mt-2">
                    {item.heading}
                  </h3>
                )}
                <p className="font-open-sauce text-[#0c0c0c]/80 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
                  {item.text}
                </p>
                {item.image && (
                  <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-[#0c0c0c]/5 my-4">
                    <Image
                      src={item.image}
                      alt={item.heading || blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {item.videoEmbedUrl && (
                  <div className="w-full my-4">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                      <iframe
                        title={item.heading || blog.title}
                        src={item.videoEmbedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Author Card Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-8">
            <div className="p-8 rounded-2xl bg-white border border-[#0c0c0c]/10 flex flex-col gap-6 sticky top-28">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Author
              </span>
              <div className="flex items-center gap-4">
                {authorAvatar ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0">
                    {isUnoptimizedImg(authorAvatar) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                    )}
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#0c0c0c]/10 flex items-center justify-center font-bold text-lg">
                    {authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-open-sauce text-lg font-bold">{authorName}</h4>
                  {authorRole && (
                    <p className="font-open-sauce text-xs text-[#0c0c0c]/60">{authorRole}</p>
                  )}
                </div>
              </div>
              <p className="font-open-sauce text-sm text-[#0c0c0c]/70 font-light leading-relaxed">
                {authorBio}
              </p>
            </div>
          </div>
        </div>

        {/* Related Stories */}
        {relatedNews.length > 0 && (
          <div className="flex flex-col gap-12 border-t border-[#0c0c0c]/10 pt-16">
            <div className="flex justify-between items-end">
              <h2 className="font-open-sauce text-3xl sm:text-4xl font-bold tracking-tight">
                Related Stories
              </h2>
              <Link
                href="/blogs"
                className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0048FF] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedNews.map((other) => {
                const otherImg = isValidImageSrc(other.image) ? other.image : "/images/hero-bg.png";
                return (
                  <Link href={`/blogs/${encodeURIComponent(other.id)}`} key={other.id} className="flex flex-col group">
                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#0c0c0c]/5 mb-5 rounded-xl">
                      {isUnoptimizedImg(otherImg) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={otherImg}
                          alt={other.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <Image
                          src={otherImg}
                          alt={other.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0c0c0c]/80 text-white font-open-sauce text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {other.category}
                      </span>
                    </div>
                    <h4 className="font-open-sauce text-lg font-bold tracking-tight mb-2 group-hover:text-[#0048FF] transition-colors line-clamp-2">
                      {other.title}
                    </h4>
                    <p className="font-open-sauce text-xs text-[#0c0c0c]/60 line-clamp-2 font-light">
                      {other.excerpt}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
