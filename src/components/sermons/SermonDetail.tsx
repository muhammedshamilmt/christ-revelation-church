"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERMONS, findSermonById } from "@/lib/sermons";

export default function SermonDetail({ id }: { id: string }) {
  const sermon = findSermonById(id);

  if (!sermon) {
    notFound();
  }

  const similarSermons = SERMONS.filter((s) => s.id !== sermon.id);

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col">
        {/* Back Button */}
        <Link
          href="/sermons"
          className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/50 hover:text-[#0c0c0c] transition-colors mb-16 inline-block border border-[#0c0c0c]/20 rounded-full px-4 py-2 w-max"
        >
          ← Go Back to Sermons
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24 mb-16">
          <div className="w-full md:w-2/3">
            <span className="inline-block px-3 py-1 bg-[#0048FF]/10 text-[#0048FF] font-open-sauce text-xs font-bold uppercase tracking-widest rounded-full mb-5">
              Sermon Message • {sermon.category}
            </span>
            <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-6">
              {sermon.title}
            </h1>
            <p className="font-open-sauce text-[#0c0c0c]/60 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
              {sermon.excerpt}
            </p>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-6 md:pl-10 md:border-l border-[#0c0c0c]/10">
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Date Preached
              </span>
              <span className="font-open-sauce text-sm font-medium">{sermon.date}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Key Scripture
              </span>
              <span className="font-open-sauce text-sm font-medium text-[#0048FF]">
                {sermon.scripture}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Category &amp; Topics
              </span>
              <span className="font-open-sauce text-sm font-medium">
                {sermon.category}, {sermon.tags.join(", ")}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Duration
              </span>
              <span className="font-open-sauce text-sm font-medium">
                {sermon.duration} • {sermon.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Main Hero Image */}
        <div className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5 mb-16 sm:mb-24">
          <Image
            src={sermon.image}
            alt={sermon.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content & Sidebar */}
        <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-24 mb-24">
          {/* Main Sermon Content */}
          <div className="w-full md:w-2/3 flex flex-col gap-10">
            {sermon.pullQuote && (
              <blockquote className="border-l-4 border-[#0048FF] pl-6 py-2 my-2">
                <p className="font-open-sauce text-xl sm:text-2xl font-medium italic text-[#0c0c0c]/90 leading-snug">
                  &ldquo;{sermon.pullQuote}&rdquo;
                </p>
              </blockquote>
            )}

            {sermon.content.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-5">
                {section.heading && (
                  <h2 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight text-[#0c0c0c] mt-2">
                    {section.heading}
                  </h2>
                )}
                <p className="font-open-sauce text-[#0c0c0c]/80 text-base sm:text-lg font-light leading-relaxed whitespace-pre-line">
                  {section.text}
                </p>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3 pl-2 my-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 font-open-sauce text-base sm:text-lg text-[#0c0c0c]/85 font-normal leading-relaxed"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#0048FF] mt-2.5 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.image && (
                  <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-[#0c0c0c]/5 my-4">
                    <Image
                      src={section.image}
                      alt={section.heading || sermon.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Render embedded YouTube video right after the second section if present (matches origin site layout) */}
                {idx === 1 && sermon.videoEmbedUrl && (
                  <div className="w-full my-4">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                      <iframe
                        title={sermon.videoTitle || sermon.title}
                        src={sermon.videoEmbedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                    {sermon.videoTitle && (
                      <p className="font-open-sauce text-xs text-[#0c0c0c]/50 mt-2 uppercase tracking-wider">
                        Video • {sermon.videoTitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Speaker & Action Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-8">
            <div className="p-8 rounded-2xl bg-white border border-[#0c0c0c]/10 flex flex-col gap-6 sticky top-28">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                Speaker
              </span>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden relative shrink-0 border border-[#0c0c0c]/10">
                  <Image
                    src={sermon.speaker.avatar}
                    alt={sermon.speaker.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-open-sauce text-lg font-bold">{sermon.speaker.name}</h3>
                  <p className="font-open-sauce text-xs text-[#0c0c0c]/60">{sermon.speaker.role}</p>
                </div>
              </div>
              <p className="font-open-sauce text-sm text-[#0c0c0c]/70 font-light leading-relaxed">
                {sermon.speaker.bio}
              </p>

              <div className="pt-4 border-t border-[#0c0c0c]/10 flex flex-col gap-3">
                <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40">
                  Need Prayer?
                </span>
                <p className="font-open-sauce text-xs text-[#0c0c0c]/60 font-light leading-relaxed">
                  You are not alone—allow us to pray with you and for you because God’s power is released through united prayer.
                </p>
                <Link
                  href="/prayer-request"
                  className="mt-1 w-full py-3 px-5 bg-[#0c0c0c] hover:bg-[#0048FF] text-white text-center font-open-sauce text-xs font-bold uppercase tracking-widest transition-colors rounded-lg"
                >
                  Submit Prayer Request
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Posts / Sermons */}
        {similarSermons.length > 0 && (
          <div className="flex flex-col gap-12 border-t border-[#0c0c0c]/10 pt-16">
            <div className="flex justify-between items-end">
              <h2 className="font-open-sauce text-3xl sm:text-4xl font-bold tracking-tight">
                Similar Sermons
              </h2>
              <Link
                href="/sermons"
                className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0048FF] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {similarSermons.map((other) => (
                <Link
                  href={`/sermons/${other.slug}`}
                  key={other.id}
                  className="flex flex-col group"
                >
                  <div className="w-full aspect-[16/10] relative overflow-hidden bg-[#0c0c0c]/5 mb-5 rounded-xl">
                    <Image
                      src={other.image}
                      alt={other.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0c0c0c]/80 text-white font-open-sauce text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {other.category}
                    </span>
                  </div>
                  <span className="font-open-sauce text-xs text-[#0c0c0c]/40 font-medium mb-1">
                    {other.date} • {other.scripture}
                  </span>
                  <h4 className="font-open-sauce text-xl font-bold tracking-tight mb-2 group-hover:text-[#0048FF] transition-colors">
                    {other.title}
                  </h4>
                  <p className="font-open-sauce text-sm text-[#0c0c0c]/60 line-clamp-2 font-light">
                    {other.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

