"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PixelTransition from "@/components/ui/PixelTransition";
import { SERMONS } from "@/lib/sermons";

const CATEGORIES = ["All", "Worship", "Prayer", "Grace"] as const;

export default function SermonsListSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredSermons =
    activeCategory === "All"
      ? SERMONS
      : SERMONS.filter((s) => s.category === activeCategory);

  return (
    <section
      id="latest"
      className="w-full bg-white text-[#0c0c0c] py-20 sm:py-32 px-6 sm:px-10 lg:px-12"
    >
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">
        {/* Title */}
        <h2 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-16 sm:mb-20 text-center">
          Our Sermons
        </h2>

        {/* Filters & See More */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 border text-sm font-open-sauce font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "border-[#0c0c0c] bg-white text-[#0c0c0c]"
                      : "border-transparent bg-gray-100 text-[#0c0c0c]/60 hover:bg-gray-200 hover:text-[#0c0c0c]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <Link
            href="/sermons/worship-opens-doors"
            className="font-open-sauce text-sm font-bold tracking-wider uppercase border-b-[1.5px] border-[#0c0c0c] pb-0.5 hover:text-[#0048ff] hover:border-[#0048ff] transition-colors"
          >
            FEATURED SERMON →
          </Link>
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {filteredSermons.map((sermon) => (
            <Link
              href={`/sermons/${sermon.slug}`}
              key={sermon.id}
              className="w-full flex flex-col group cursor-pointer"
            >
              {/* Image with Pixel Transition */}
              <div className="w-full overflow-hidden mb-6 bg-gray-100 relative">
                <PixelTransition
                  aspectRatio="100%"
                  pixelColor="#ffffff"
                  animationStepDuration={0.4}
                  firstContent={
                    <Image
                      src={sermon.image}
                      alt={sermon.title}
                      fill
                      className="object-cover"
                    />
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0048ff] flex items-center justify-center p-6 text-center absolute inset-0">
                      <p className="font-open-sauce text-white text-xl sm:text-2xl font-medium tracking-tight">
                        Read &amp; Watch <br />
                        <span className="text-white drop-shadow-md">
                          {sermon.title}
                        </span>
                      </p>
                    </div>
                  }
                />
              </div>

              {/* Author & Date Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
                    <Image
                      src={sermon.speaker.avatar}
                      alt={sermon.speaker.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-open-sauce text-sm font-bold text-[#0c0c0c]">
                      {sermon.speaker.name}
                    </span>
                    <span className="font-open-sauce text-xs text-[#0c0c0c]/50">
                      {sermon.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#FFD700"
                    stroke="#FFD700"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="font-open-sauce text-sm font-bold text-[#0c0c0c]">
                    {sermon.rating}
                  </span>
                </div>
              </div>

              {/* Sermon Title */}
              <h3 className="font-open-sauce text-xl sm:text-2xl font-bold tracking-tight text-[#0c0c0c] mb-2 group-hover:text-[#0048ff] transition-colors">
                {sermon.title}
              </h3>

              {/* Description */}
              <p className="font-open-sauce text-sm text-[#0c0c0c]/70 leading-relaxed font-light mb-4 line-clamp-3">
                {sermon.excerpt}
              </p>

              <span className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0048ff] mt-auto group-hover:underline">
                Read More →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
