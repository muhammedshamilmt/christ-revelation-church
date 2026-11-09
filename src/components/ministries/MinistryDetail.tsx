import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  MapPin,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { MINISTRIES, findMinistryById } from "@/lib/ministries";

export default function MinistryDetail({ id }: { id: string }) {
  const ministry = findMinistryById(id);

  if (!ministry) {
    notFound();
  }

  const otherMinistries = MINISTRIES.filter((m) => m.id !== ministry.id);

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-24 min-h-screen">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col">
        {/* Top Navigation & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <Link
            href="/ministries"
            className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/50 hover:text-[#0c0c0c] transition-colors inline-block border border-[#0c0c0c]/20 rounded-full px-5 py-2.5 w-max"
          >
            ← Back to Ministries
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-4 py-1.5 rounded-full text-[11px] font-open-sauce font-bold uppercase tracking-widest border border-[#0c0c0c]/15 text-[#0c0c0c]/70">
              Ministry {ministry.number} • {ministry.category}
            </span>
            <span className="px-4 py-1.5 rounded-full text-[11px] font-open-sauce font-bold uppercase tracking-widest bg-[#0048ff] text-white">
              {ministry.scripture}
            </span>
          </div>
        </div>

        {/* Title & Metadata Header */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-20 mb-16">
          <div className="w-full lg:w-2/3">
            <span className="font-open-sauce text-xs font-bold uppercase tracking-[0.25em] text-[#0048ff] block mb-4">
              Christ Revelation Church • Ministry {ministry.number}
            </span>
            <h1 className="font-open-sauce text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-6">
              {ministry.title}
            </h1>
            <p className="font-open-sauce text-[#0c0c0c]/70 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-8">
              {ministry.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contacts"
                className="px-8 py-4 bg-[#0048ff] text-white font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#003bd0] transition-colors inline-flex items-center gap-2"
              >
                Get Involved in {ministry.title}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/prayer-request"
                className="px-7 py-4 bg-white border border-[#0c0c0c]/15 text-[#0c0c0c] font-open-sauce text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors"
              >
                Submit a Prayer Request
              </Link>
            </div>
          </div>

          {/* Right Key Details Column */}
          <div className="w-full lg:w-1/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 lg:pl-10 lg:border-l border-[#0c0c0c]/10">
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40 flex items-center gap-1.5">
                <Clock size={12} /> Gathering Time
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-bold text-[#0048ff]">
                {ministry.schedule}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40 flex items-center gap-1.5">
                <MapPin size={12} /> Location
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-medium">
                {ministry.location}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40 flex items-center gap-1.5">
                <BookOpen size={12} /> Key Scripture
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-medium">
                {ministry.scripture}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/40 flex items-center gap-1.5">
                <HeartHandshake size={12} /> Ministry Leadership
              </span>
              <span className="font-open-sauce text-sm sm:text-base font-medium">
                {ministry.leader.name}
              </span>
            </div>
          </div>
        </div>

        {/* 3-Image Origin Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 h-[420px] sm:h-[540px] mb-16 sm:mb-24">
          <div className="relative lg:col-span-2 lg:row-span-2 rounded-3xl overflow-hidden bg-[#0c0c0c]/5">
            <Image
              src={ministry.image}
              alt={ministry.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden lg:block relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5">
            <Image
              src={ministry.secondaryImage}
              alt={`${ministry.title} highlight`}
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
          <div className="hidden lg:block relative rounded-3xl overflow-hidden bg-[#0c0c0c]/5">
            <Image
              src={ministry.tertiaryImage}
              alt={`${ministry.title} community`}
              fill
              sizes="33vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Main Content (7/12) & Sidebar (5/12) */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 relative">
          {/* Left Column: Verbatim Ministry Content */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12">
            {/* Pull Quote */}
            {ministry.pullQuote && (
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#0c0c0c]/10 shadow-xs">
                <p className="font-open-sauce text-xl sm:text-2xl font-medium tracking-tight leading-snug text-[#0c0c0c]">
                  “{ministry.pullQuote}”
                </p>
                <span className="font-open-sauce text-xs font-bold uppercase tracking-[0.2em] text-[#0048ff] block mt-4">
                  — Christ Revelation Church • {ministry.title}
                </span>
              </div>
            )}

            {/* Ministry Sections */}
            {ministry.sections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-5">
                {section.heading && (
                  <h2 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight text-[#0c0c0c]">
                    {section.heading}
                  </h2>
                )}

                {section.paragraphs.map((para, pIdx) => (
                  <p
                    key={pIdx}
                    className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/75 font-light leading-relaxed"
                  >
                    {para}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="flex flex-col gap-3.5 my-2 pl-2">
                    {section.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 font-open-sauce text-base sm:text-lg text-[#0c0c0c]/85 font-medium leading-relaxed"
                      >
                        <CheckCircle2
                          size={20}
                          className="text-[#0048ff] shrink-0 mt-1"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.image && (
                  <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-[#0c0c0c]/5 my-4">
                    <Image
                      src={section.image}
                      alt={section.imageAlt || ministry.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                )}

                {section.videoEmbedUrl && (
                  <div className="w-full aspect-video relative rounded-2xl overflow-hidden bg-black my-4 shadow-md">
                    <iframe
                      src={section.videoEmbedUrl}
                      title={`${ministry.title} Video`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Ministry Highlights & Ways to Serve Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-[#0c0c0c]/10">
              <div>
                <h3 className="font-open-sauce text-xs font-bold uppercase tracking-[0.2em] text-[#0c0c0c]/40 mb-5 flex items-center gap-2">
                  <Sparkles size={14} className="text-[#0048ff]" /> Ministry
                  Focus
                </h3>
                <ul className="space-y-3.5">
                  {ministry.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-open-sauce text-sm sm:text-base font-medium text-[#0c0c0c]"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-[#0048ff] shrink-0 mt-0.5"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-open-sauce text-xs font-bold uppercase tracking-[0.2em] text-[#0c0c0c]/40 mb-5">
                  Ways to Serve
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {ministry.waysToServe.map((role, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-white border border-[#0c0c0c]/15 rounded-full font-open-sauce text-xs font-bold text-[#0c0c0c]/80"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Sidebar */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8">
            <div className="lg:sticky lg:top-32 flex flex-col gap-8">
              {/* Ministry Leader Card */}
              <div className="bg-white border border-[#0c0c0c]/10 rounded-3xl p-8 flex flex-col gap-5 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 bg-[#0c0c0c]/5">
                    <Image
                      src={ministry.leader.image}
                      alt={ministry.leader.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.2em] text-[#0048ff] block mb-1">
                      Ministry Leadership
                    </span>
                    <h3 className="font-open-sauce text-xl font-bold text-[#0c0c0c]">
                      {ministry.leader.name}
                    </h3>
                    <p className="font-open-sauce text-xs text-[#0c0c0c]/60 font-medium">
                      {ministry.leader.role}
                    </p>
                  </div>
                </div>
                <p className="font-open-sauce text-sm text-[#0c0c0c]/70 font-light leading-relaxed">
                  {ministry.leader.bio}
                </p>
              </div>

              {/* Join / Serve Callout Card */}
              <div className="bg-[#0c0c0c] text-white rounded-3xl p-8 sm:p-10 flex flex-col gap-6">
                <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.25em] text-[#0048ff]">
                  Discover Your Place in God’s Family
                </span>
                <h3 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                  Serve With the {ministry.title}
                </h3>
                <p className="font-open-sauce text-sm text-white/70 font-light leading-relaxed">
                  Each ministry at Christ Revelation Church is an open door to
                  serve, learn, and grow. Together, we embody the church’s
                  vision: to reveal Christ to the world—one life, one act of
                  love at a time.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/contacts"
                    className="px-6 py-3.5 bg-[#0048ff] hover:bg-[#003bd0] text-white font-open-sauce text-xs font-bold uppercase tracking-widest transition-colors text-center"
                  >
                    Connect With Us
                  </Link>
                  <Link
                    href="/events"
                    className="px-6 py-3.5 border border-white/20 hover:bg-white hover:text-[#0c0c0c] text-white font-open-sauce text-xs font-bold uppercase tracking-widest transition-colors text-center"
                  >
                    Join Us This Sunday
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ministry Photo Gallery */}
        {ministry.galleryImages.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#0c0c0c]/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="font-open-sauce text-xs font-bold uppercase tracking-[0.25em] text-[#0048ff] block mb-2">
                  Ministry Moments
                </span>
                <h3 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight">
                  {ministry.title} in Action
                </h3>
              </div>
              <Link
                href="/gallery"
                className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0c0c0c]/60 hover:text-[#0048ff] transition-colors"
              >
                View Full Church Gallery →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {ministry.galleryImages.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0c0c0c]/5 group"
                >
                  <Image
                    src={imgUrl}
                    alt={`${ministry.title} gallery ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-[#0c0c0c]/10 my-24" />

        {/* Other Ministries Section */}
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-open-sauce text-3xl sm:text-4xl font-medium tracking-tight uppercase">
              Explore Other Ministries
            </h3>
            <Link
              href="/ministries"
              className="font-open-sauce text-[10px] font-bold tracking-[0.2em] uppercase text-[#0c0c0c]/50 hover:text-[#0c0c0c] border border-[#0c0c0c]/20 rounded-full px-4 py-2 transition-colors"
            >
              All Ministries
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherMinistries.map((other) => (
              <Link
                href={`/ministries/${other.slug}`}
                key={other.id}
                className="flex flex-col group"
              >
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#0c0c0c]/5 mb-5">
                  <Image
                    src={other.image}
                    alt={other.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#0c0c0c]/80 text-white font-open-sauce text-[10px] font-bold uppercase tracking-widest">
                    Ministry {other.number}
                  </span>
                </div>
                <span className="font-open-sauce text-[11px] font-bold uppercase tracking-widest text-[#0048ff] mb-1">
                  {other.category}
                </span>
                <h4 className="font-open-sauce text-xl font-bold tracking-tight mb-2 group-hover:text-[#0048ff] transition-colors">
                  {other.title}
                </h4>
                <p className="font-open-sauce text-sm text-[#0c0c0c]/60 line-clamp-2">
                  {other.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

