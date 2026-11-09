"use client";

import Image from "next/image";
import Link from "next/link";
import { useEvents } from "@/lib/useEvents";
import { isValidImageSrc } from "@/lib/utils";

function isUnoptimizedImg(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.endsWith(".svg")
  );
}

export default function EventsHero() {
  const { events } = useEvents();
  const featured =
    events.find((e) => e.id === "revelation-encounter-2026") ||
    events.find((e) => e.id === "christmas-music-festival") ||
    events.find((e) => e.status === "Open" || e.status === "Upcoming") ||
    events[0];

  const heroImg = featured?.images?.[0] || "/images/hero-bg.png";
  const featuredHref = featured ? `/events/${featured.id}` : "#events-list";

  return (
    <section className="w-full flex flex-col min-h-screen">
      {/* Top Section - Brand Color Background */}
      <div className="w-full bg-[#0048ff] text-white pt-40 pb-20 sm:pt-48 sm:pb-32 px-6 sm:px-10 lg:px-16 flex items-center min-h-[60vh] relative overflow-hidden">
        <h1 className="font-open-sauce text-5xl sm:text-7xl md:text-8xl lg:text-[7vw] font-medium tracking-tight max-w-7xl leading-[1.05] relative z-10">
          Where believers connect, worship &amp; thrive
        </h1>

        {/* Large Asterisk Icon Background */}
        <div className="absolute -bottom-[30%] -right-[10%] text-[#003bd0] opacity-80 pointer-events-none select-none z-0">
          <svg
            className="w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] max-w-[800px] max-h-[800px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M19.07 4.93l-14.14 14.14M22 12H2M19.07 19.07L4.93 4.93" />
          </svg>
        </div>
      </div>

      {/* Bottom Section - Split Dark/Image */}
      <div className="w-full flex flex-col md:flex-row min-h-[75vh] relative">
        {/* Left Side: Details */}
        <div className="w-full md:w-1/2 bg-[#0c0c0c] text-white flex flex-col justify-center p-10 sm:p-16 lg:p-24 xl:p-32 relative">
          <span className="font-open-sauce text-xs font-bold uppercase tracking-[0.25em] text-[#0048ff] mb-4">
            Featured Gathering • {featured?.type || "CONFERENCE"}
          </span>
          <h2 className="font-open-sauce text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-3 leading-[1.08]">
            {featured?.title || "Annual Youth Conference 2026"}
          </h2>
          <p className="font-open-sauce text-xl sm:text-2xl text-white/70 mb-8 font-light">
            {featured?.date || "30th May 2026"} •{" "}
            {featured?.location || "Main Auditorium"}
          </p>

          <p className="font-open-sauce text-base sm:text-lg text-white/60 max-w-md font-light leading-relaxed mb-12">
            {featured?.subtitle ||
              "Five unforgettable days celebrating faith, culture, and community at the heart of our vibrant congregation."}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`${featuredHref}#register`}
              className="px-8 py-4 bg-[#0048ff] text-white font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#003bd0] transition-colors flex items-center gap-2"
            >
              Get tickets
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={`${featuredHref}#agenda`}
              className="px-8 py-4 bg-white text-[#0c0c0c] font-open-sauce text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors"
            >
              View agenda
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-full bg-[#141414]">
          {isValidImageSrc(heroImg) || isUnoptimizedImg(heroImg) ? (
            isUnoptimizedImg(heroImg) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImg}
                alt={featured?.title || "Event gathering"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={heroImg}
                alt={featured?.title || "Event gathering"}
                fill
                className="object-cover"
              />
            )
          ) : (
            <Image
              src="/images/hero-bg.png"
              alt="Event gathering"
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Floating Circular Badge */}
        <Link
          href={featuredHref}
          aria-label="Explore featured event"
          className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-white rounded-full items-center justify-center shadow-2xl z-10"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Rotating Text SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full absolute inset-0 animate-[spin_10s_linear_infinite]"
            >
              <path
                id="circlePath"
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                fill="transparent"
              />
              <text className="font-open-sauce font-bold uppercase tracking-[0.25em] text-[10px] fill-[#0c0c0c]">
                <textPath href="#circlePath" startOffset="0%">
                  CHRIST REVELATION CHURCH •
                </textPath>
              </text>
            </svg>
            {/* Static Center Icon */}
            <div className="w-12 h-12 rounded-full bg-[#003bd0] flex items-center justify-center text-white z-10 hover:scale-110 transition-transform cursor-pointer">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
