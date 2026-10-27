"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GALLERY_ITEMS, GALLERY_CATEGORIES, GalleryCategory, GalleryItem } from "@/lib/gallery";

type ViewLayout = "masonry" | "grid" | "showcase";

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewLayout, setViewLayout] = useState<ViewLayout>("masonry");
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length));
  };

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightboxImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev! + 1) % filteredItems.length));
    }
  }, [lightboxIndex, filteredItems.length]);

  const prevLightboxImage = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev! - 1 + filteredItems.length) % filteredItems.length));
    }
  }, [lightboxIndex, filteredItems.length]);

  // Handle keyboard events for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, nextLightboxImage, prevLightboxImage]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex]);

  const activeLightboxItem: GalleryItem | null =
    lightboxIndex !== null && filteredItems[lightboxIndex]
      ? filteredItems[lightboxIndex]
      : null;

  return (
    <section id="gallery-grid" className="w-full bg-white text-[#0c0c0c] py-20 sm:py-28 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col">
        {/* Controls Toolbar: Categories, Search, Layout */}
        <div className="flex flex-col gap-8 pb-10 border-b border-[#0c0c0c]/10">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#0048ff]" />
                <span className="text-xs uppercase font-open-sauce tracking-widest text-[#0c0c0c]/60">
                  Curated Collection
                </span>
              </div>
              <h2 className="font-open-sauce text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">
                Explore Archives
                <span className="text-sm sm:text-base font-normal text-[#0c0c0c]/40 ml-3">
                  ({filteredItems.length} photos)
                </span>
              </h2>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="Search moments..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full px-4 py-2.5 pl-10 bg-[#FAFAFA] border border-[#0c0c0c]/15 text-sm font-open-sauce text-[#0c0c0c] placeholder:text-[#0c0c0c]/40 focus:outline-none focus:border-[#0048ff] transition-colors"
              />
              <svg
                className="w-4 h-4 text-[#0c0c0c]/40 absolute left-3.5 top-1/2 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#0c0c0c]/50 hover:text-[#0c0c0c]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Categories and Layout Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {GALLERY_CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category;
                const count =
                  category === "All"
                    ? GALLERY_ITEMS.length
                    : GALLERY_ITEMS.filter((i) => i.category === category).length;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setVisibleCount(12);
                    }}
                    className={`px-4 py-2 text-xs font-open-sauce tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#0c0c0c] text-white shadow-sm font-semibold"
                        : "bg-[#FAFAFA] border border-[#0c0c0c]/10 text-[#0c0c0c]/70 hover:border-[#0c0c0c]/40 hover:text-[#0c0c0c]"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`text-[10px] ${
                        isSelected ? "text-white/60" : "text-[#0c0c0c]/40"
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Layout Toggle Buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-[#FAFAFA] p-1 border border-[#0c0c0c]/10 self-start lg:self-auto">
              <button
                onClick={() => setViewLayout("masonry")}
                title="Masonry Layout"
                className={`px-3 py-1.5 text-xs font-open-sauce flex items-center gap-1.5 transition-colors ${
                  viewLayout === "masonry"
                    ? "bg-[#0c0c0c] text-white font-medium"
                    : "text-[#0c0c0c]/60 hover:text-[#0c0c0c]"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span>Masonry</span>
              </button>

              <button
                onClick={() => setViewLayout("grid")}
                title="4-Column Grid"
                className={`px-3 py-1.5 text-xs font-open-sauce flex items-center gap-1.5 transition-colors ${
                  viewLayout === "grid"
                    ? "bg-[#0c0c0c] text-white font-medium"
                    : "text-[#0c0c0c]/60 hover:text-[#0c0c0c]"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Grid</span>
              </button>

              <button
                onClick={() => setViewLayout("showcase")}
                title="2-Column Showcase"
                className={`px-3 py-1.5 text-xs font-open-sauce flex items-center gap-1.5 transition-colors ${
                  viewLayout === "showcase"
                    ? "bg-[#0c0c0c] text-white font-medium"
                    : "text-[#0c0c0c]/60 hover:text-[#0c0c0c]"
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="8" height="18" />
                  <rect x="13" y="3" width="8" height="18" />
                </svg>
                <span>Showcase</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#FAFAFA] border border-[#0c0c0c]/10 flex items-center justify-center text-[#0c0c0c]/40 mb-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3 className="font-open-sauce text-xl font-medium text-[#0c0c0c] mb-2">
              No moments match your criteria
            </h3>
            <p className="font-open-sauce text-sm text-[#0c0c0c]/60 max-w-sm mb-6">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 bg-[#0c0c0c] text-white text-xs font-open-sauce uppercase tracking-wider hover:bg-[#0048ff] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className={`mt-10 transition-all ${
              viewLayout === "masonry"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
                : viewLayout === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "grid grid-cols-1 md:grid-cols-2 gap-6"
            }`}
          >
            {displayedItems.map((item, index) => {
              // Aspect ratio calculation for responsive layout
              const aspectClass =
                viewLayout === "masonry"
                  ? item.aspectRatio === "tall"
                    ? "aspect-[3/4]"
                    : item.aspectRatio === "wide"
                    ? "aspect-[4/3]"
                    : "aspect-square"
                  : viewLayout === "grid"
                  ? "aspect-square"
                  : "aspect-[16/10]";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                  className={`${
                    viewLayout === "masonry" ? "break-inside-avoid mb-4" : ""
                  }`}
                >
                  <div
                    onClick={() => openLightbox(index)}
                    className={`relative w-full ${aspectClass} overflow-hidden bg-gray-100 cursor-pointer group border border-[#0c0c0c]/10`}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Category Chip Always Visible at Top Left */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0c0c0c] text-[10px] font-open-sauce font-semibold uppercase tracking-wider shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Gradient Overlay with Details on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white z-20">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[10px] uppercase font-open-sauce tracking-widest text-[#0048ff] bg-white px-2 py-0.5 font-semibold inline-block mb-1.5">
                          {item.date}
                        </span>
                        <h4 className="font-open-sauce text-base sm:text-lg font-medium leading-snug">
                          {item.title}
                        </h4>
                        <p className="font-open-sauce text-xs text-white/80 font-light mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        {item.location && (
                          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-white/60 font-light">
                            <svg className="w-3 h-3 text-[#0048ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Expand Icon at Top Right */}
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-14 sm:mt-18">
            <button
              onClick={handleLoadMore}
              className="px-10 py-4 bg-[#FAFAFA] border border-[#0c0c0c]/20 text-[#0c0c0c] font-open-sauce text-xs sm:text-sm font-semibold uppercase tracking-widest hover:bg-[#0c0c0c] hover:text-white transition-all duration-300 flex items-center gap-3 group"
            >
              <span>Load More Archives ({filteredItems.length - visibleCount} Remaining)</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Inspirational Scripture Callout Banner */}
        <div className="mt-24 sm:mt-32 p-8 sm:p-14 bg-[#FAFAFA] border border-[#0c0c0c]/10 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-xs uppercase font-open-sauce tracking-widest text-[#0048ff] font-semibold">
              Scripture Reflection
            </span>
            <p className="font-ancola text-2xl sm:text-3xl md:text-4xl text-[#0c0c0c] font-normal leading-snug mt-3">
              “One thing have I asked of the Lord, that will I seek after: that I may dwell in the house of the Lord all the days of my life, to gaze upon the beauty of the Lord.”
            </p>
            <p className="font-open-sauce text-xs sm:text-sm text-[#0c0c0c]/50 font-light mt-3 uppercase tracking-wider">
              — Psalm 27:4
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="/contacts"
              className="inline-block px-8 py-3.5 bg-[#0c0c0c] text-white text-xs sm:text-sm font-open-sauce font-semibold uppercase tracking-widest hover:bg-[#0048ff] transition-colors"
            >
              Visit Our Church
            </a>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Top Bar: Counter, Title, Close Button */}
            <div className="flex items-center justify-between text-white z-30 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#0048ff] text-white text-[10px] sm:text-xs font-open-sauce font-semibold uppercase tracking-widest">
                  {activeLightboxItem.category}
                </span>
                <span className="text-xs sm:text-sm font-open-sauce text-white/60 tracking-wider">
                  {lightboxIndex! + 1} / {filteredItems.length}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={activeLightboxItem.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-open-sauce uppercase tracking-wider text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                  <span>Open Full Image</span>
                </a>

                <button
                  onClick={closeLightbox}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="Close Lightbox"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Center Area: Prev Button, Image, Next Button */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevLightboxImage();
                }}
                className="absolute left-2 sm:left-4 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-[#0048ff] text-white flex items-center justify-center transition-colors duration-200"
                aria-label="Previous Image"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* Main Image */}
              <div className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center">
                <Image
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextLightboxImage();
                }}
                className="absolute right-2 sm:right-4 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-[#0048ff] text-white flex items-center justify-center transition-colors duration-200"
                aria-label="Next Image"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="text-white z-30 pt-3 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="font-open-sauce text-base sm:text-xl font-medium">
                  {activeLightboxItem.title}
                </h4>
                <p className="font-open-sauce text-xs sm:text-sm text-white/70 font-light mt-0.5">
                  {activeLightboxItem.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-open-sauce text-white/50">
                {activeLightboxItem.location && <span>📍 {activeLightboxItem.location}</span>}
                <span>📅 {activeLightboxItem.date}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
