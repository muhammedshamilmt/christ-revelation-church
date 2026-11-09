"use client";

import Image from "next/image";
import Link from "next/link";
import PixelTransition from "@/components/ui/PixelTransition";
import { MINISTRIES } from "@/lib/ministries";

export default function MinistriesList() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-20 sm:py-32 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Section Heading */}
        <h2 className="font-open-sauce text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight mb-20">
          Our
          <br />
          Ministries
        </h2>

        {/* List of Ministries */}
        <div className="flex flex-col w-full">
          {MINISTRIES.map((ministry, index) => (
            <Link
              href={`/ministries/${ministry.slug}`}
              key={ministry.id}
              className="flex flex-col lg:flex-row border-t border-[#0c0c0c]/10 py-10 sm:py-16 gap-10 group cursor-pointer"
            >
              {/* Left: Tinted Image */}
              <div className="w-full lg:w-[45%] relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden">
                <PixelTransition
                  aspectRatio="100%"
                  pixelColor="#ffffff"
                  animationStepDuration={0.4}
                  firstContent={
                    <Image
                      src={ministry.image}
                      alt={ministry.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0048ff] flex flex-col items-center justify-center p-6 text-center absolute inset-0">
                      <span className="font-open-sauce text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 mb-3 border border-white/30 px-3 py-1 rounded-full">
                        {ministry.category}
                      </span>
                      <p className="font-open-sauce text-white text-xl sm:text-2xl font-medium tracking-tight">
                        Explore <br />
                        <span className="text-white drop-shadow-md font-bold">
                          {ministry.title}
                        </span>
                      </p>
                      <span className="font-open-sauce text-xs text-white/80 uppercase tracking-widest mt-4 underline underline-offset-4">
                        View Ministry Details →
                      </span>
                    </div>
                  }
                  className="w-full h-full"
                />
              </div>

              {/* Middle: Title & Metadata */}
              <div className="w-full lg:w-[20%] flex flex-col pt-2">
                <p className="font-open-sauce text-xs font-bold text-[#0048ff] mb-2">
                  {ministry.number} • {ministry.category}
                </p>
                <h3 className="font-open-sauce text-xl sm:text-2xl font-bold tracking-tight text-[#0c0c0c] group-hover:text-[#0048ff] transition-colors mb-3">
                  {ministry.title}
                </h3>
                <p className="font-open-sauce text-xs font-medium text-[#0c0c0c]/50 mb-1">
                  {ministry.schedule}
                </p>
                <p className="font-open-sauce text-xs text-[#0c0c0c]/40">
                  {ministry.scripture}
                </p>
              </div>

              {/* Right: Description & Secondary origin images */}
              <div className="w-full lg:w-[35%] flex flex-col gap-8 pt-2">
                <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 font-medium leading-relaxed">
                  {ministry.description}
                </p>

                <span className="font-open-sauce text-xs font-bold uppercase tracking-widest text-[#0048ff] inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                  Explore {ministry.title} <span>→</span>
                </span>

                {/* Secondary small images from origin /ministries/ section */}
                <div className="hidden lg:flex items-center gap-4 mt-auto">
                  <div className="w-32 h-32 relative overflow-hidden bg-gray-200">
                    <Image
                      src={ministry.secondaryImage || ministry.image}
                      alt={`${ministry.title} detail`}
                      fill
                      sizes="128px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <p className="absolute bottom-1 left-1 text-[8px] text-white/70 uppercase tracking-widest mix-blend-difference">
                      FIG. 0{index + 1}A
                    </p>
                  </div>
                  <div className="w-32 h-32 relative overflow-hidden bg-gray-200">
                    <Image
                      src={ministry.tertiaryImage || ministry.image}
                      alt={`${ministry.title} secondary detail`}
                      fill
                      sizes="128px"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <p className="absolute bottom-1 left-1 text-[8px] text-white/70 uppercase tracking-widest mix-blend-difference">
                      FIG. 0{index + 1}B
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
