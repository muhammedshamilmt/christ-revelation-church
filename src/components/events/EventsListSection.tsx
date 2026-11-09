"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import PixelTransition from "@/components/ui/PixelTransition";
import { useEvents } from "@/lib/useEvents";
import { useAllRegistrations } from "@/lib/useRegistrations";
import { isValidImageSrc } from "@/lib/utils";

const FILTER_TABS = [
  { label: "All Events", value: "ALL" },
  { label: "Conferences", value: "CONFERENCE" },
  { label: "Outreach", value: "COMMUNITY OUTREACH" },
  { label: "Workshops", value: "WORKSHOP" },
  { label: "Services", value: "GENERAL" },
];

function isUnoptimizedImg(src?: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("blob:") ||
    src.startsWith("data:") ||
    src.endsWith(".svg")
  );
}

function EventCardSkeleton() {
  return (
    <div className="w-full flex flex-col animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200 mb-8 rounded-none" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4 border-b border-gray-100 pb-4">
          <div className="space-y-2 w-2/3">
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-7 bg-gray-200 rounded w-4/5" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-24" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-36 mt-4" />
      </div>
    </div>
  );
}

export default function EventsListSection() {
  const { events, isLoading } = useEvents();
  const { registrations } = useAllRegistrations();
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredEvents = useMemo(() => {
    if (activeFilter === "ALL") return events;
    return events.filter(
      (e) => e.type?.toUpperCase() === activeFilter.toUpperCase()
    );
  }, [events, activeFilter]);

  // Lookup registrations per event
  const regCountByEvent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of registrations) {
      if (r.status !== "cancelled") {
        map[r.event_id] = (map[r.event_id] || 0) + 1;
      }
    }
    return map;
  }, [registrations]);

  return (
    <section
      id="events-list"
      className="w-full bg-white text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12"
    >
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">
        {/* Title & Filters */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-16 sm:mb-20 gap-8">
          <h2 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-center md:text-left">
            Upcoming Events
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-6 py-2.5 rounded-full border text-sm font-open-sauce font-medium transition-colors ${
                    isActive
                      ? "border-[#0c0c0c] bg-[#0c0c0c] text-white"
                      : "border-gray-200 bg-gray-50 text-[#0c0c0c]/60 hover:bg-gray-100 hover:text-[#0c0c0c]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && events.length === 0 ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="w-full py-20 text-center border border-gray-200 bg-gray-50/50">
            <p className="font-open-sauce text-lg text-[#0c0c0c]/60 mb-4">
              No events found in this category right now.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className="px-6 py-2.5 bg-[#0c0c0c] text-white font-open-sauce text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:bg-black/80 transition-colors"
            >
              Show All Events
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
            {filteredEvents.map((event) => {
              const coverSrc =
                isValidImageSrc(event.images?.[0]) ||
                isUnoptimizedImg(event.images?.[0])
                  ? event.images[0]
                  : "/images/hero-bg.png";
              const shortDesc =
                event.subtitle || event.description?.[0] || "";
              const attendees = regCountByEvent[event.id] || 0;

              return (
                <Link
                  href={`/events/${encodeURIComponent(event.id)}`}
                  key={event.id}
                  className="w-full flex flex-col group cursor-pointer"
                >
                  {/* Tall Image with Pixel Transition */}
                  <div className="w-full overflow-hidden mb-8 bg-gray-100 relative">
                    <PixelTransition
                      aspectRatio="125%"
                      pixelColor="#ffffff"
                      animationStepDuration={0.4}
                      firstContent={
                        isUnoptimizedImg(coverSrc) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={coverSrc}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={coverSrc}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        )
                      }
                      secondContent={
                        <div className="w-full h-full bg-[#0048ff] flex flex-col items-center justify-center p-8 text-center absolute inset-0">
                          <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 mb-3 border border-white/30 px-3 py-1 rounded-full">
                            {event.type} • {event.price || "Free"}
                          </span>
                          <p className="font-open-sauce text-white text-2xl sm:text-3xl font-medium tracking-tight">
                            Explore &amp; Register <br />
                            <span className="text-white drop-shadow-md font-bold mt-2 block">
                              {event.title}
                            </span>
                          </p>
                        </div>
                      }
                    />
                    {/* Status Badge & Attendees */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                      <span className="px-3 py-1 bg-[#0c0c0c]/80 backdrop-blur-md text-white font-open-sauce text-[10px] font-bold uppercase tracking-widest">
                        {event.status}
                      </span>
                      {attendees > 0 && (
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[#0c0c0c] font-open-sauce text-[10px] font-bold uppercase tracking-wider">
                          {attendees} Registered
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-200 pb-4">
                      <div>
                        <span className="font-open-sauce text-sm font-bold text-[#0048ff] uppercase tracking-wider block mb-1">
                          {event.date}
                        </span>
                        <h3 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight text-[#0c0c0c] group-hover:text-[#0048ff] transition-colors">
                          {event.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-[#0c0c0c]/60 bg-gray-50 px-3.5 py-2 self-start shrink-0">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="font-open-sauce text-xs font-medium">
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 leading-relaxed font-light mt-1 line-clamp-3">
                      {shortDesc}
                    </p>

                    <div className="mt-auto pt-3 flex items-center justify-between text-xs font-open-sauce font-bold uppercase tracking-widest text-[#0c0c0c]/50 group-hover:text-[#0048ff] transition-colors">
                      <span>View Event Details &amp; Register</span>
                      <span>→</span>
                    </div>
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
