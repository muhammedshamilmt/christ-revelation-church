"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GalleryHero() {
  return (
    <section className="relative w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-12 border-b border-[#0c0c0c]/10 overflow-hidden">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c08_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto w-full relative z-10 flex flex-col">
        {/* Top Tag & Breadcrumb */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#0048ff]/10 text-[#0048ff] text-xs font-open-sauce font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0048ff] animate-ping" />
            Visual Archive
          </span>
          <span className="text-xs font-open-sauce uppercase tracking-widest text-[#0c0c0c]/40">
            Christ Revelation Church
          </span>
        </div>

        {/* Hero Title & Description Split */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div className="w-full lg:w-3/5">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-open-sauce text-4xl sm:text-6xl md:text-7xl lg:text-[5.5vw] font-medium tracking-tight leading-[1.05]"
            >
              Moments of Grace, <br />
              <span className="font-ancola italic font-normal text-[#0048ff]">Worship</span> & Life
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-2/5 flex flex-col gap-6"
          >
            <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed">
              A curated photographic chronicle capturing God’s presence, heart-stirring Sunday worship, life-transforming conferences, and the joyful fellowship of our congregation.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="#gallery-grid"
                className="px-8 py-3.5 bg-[#0c0c0c] text-white text-xs sm:text-sm font-open-sauce font-semibold tracking-wider uppercase hover:bg-[#0048ff] transition-colors duration-300 flex items-center gap-2 group"
              >
                <span>Explore Gallery</span>
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
              </Link>

              <Link
                href="/events"
                className="px-8 py-3.5 bg-transparent border border-[#0c0c0c]/20 text-[#0c0c0c] text-xs sm:text-sm font-open-sauce font-semibold tracking-wider uppercase hover:border-[#0c0c0c] transition-colors duration-300"
              >
                Upcoming Events
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Featured Showcase Hero Collage */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-black/5 p-2 sm:p-4 border border-[#0c0c0c]/10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 h-[380px] sm:h-[460px] lg:h-[520px]">
            {/* Left Big Lead Image */}
            <div className="md:col-span-7 relative h-full rounded-xl overflow-hidden group">
              <Image
                src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3562-scaled.jpeg"
                alt="Sunday Celebration at Christ Revelation Church"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <span className="text-[10px] sm:text-xs uppercase font-open-sauce tracking-widest text-[#0048ff] bg-white px-2.5 py-1 font-semibold">
                    Featured Moment
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-open-sauce font-medium mt-2">
                    Sunday Celebration & Thanksgiving
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 font-light mt-1">
                    Main Sanctuary • Christ Revelation Church
                  </p>
                </div>
              </div>
            </div>

            {/* Right Top & Bottom Images */}
            <div className="hidden md:flex md:col-span-5 flex-col gap-3 sm:gap-4 h-full">
              {/* Right Top */}
              <div className="relative h-1/2 rounded-xl overflow-hidden group">
                <Image
                  src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3553-scaled.jpeg"
                  alt="Anointed Choir & Musical Worship"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-open-sauce tracking-widest text-white/70">
                    Worship In Spirit & Truth
                  </span>
                  <p className="text-sm sm:text-base font-open-sauce font-medium">
                    The Anointed Vocal & Orchestral Choir
                  </p>
                </div>
              </div>

              {/* Right Bottom */}
              <div className="relative h-1/2 rounded-xl overflow-hidden group">
                <Image
                  src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3549-scaled.jpeg"
                  alt="Believers in Reverent Surrender"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-open-sauce tracking-widest text-white/70">
                    Altar Encounter
                  </span>
                  <p className="text-sm sm:text-base font-open-sauce font-medium">
                    Lifting Pure Hands in Worship
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Rotating Stamp */}
          <div className="hidden lg:flex absolute right-12 bottom-12 w-32 h-32 bg-white rounded-full items-center justify-center shadow-2xl z-20 pointer-events-none">
            <div className="relative w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 animate-[spin_12s_linear_infinite]">
                <path id="stampPath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                <text className="font-open-sauce font-bold uppercase tracking-[0.24em] text-[9.5px] fill-[#0c0c0c]">
                  <textPath href="#stampPath" startOffset="0%">
                    GALLERY ARCHIVE • CHRIST REVELATION •
                  </textPath>
                </text>
              </svg>
              <div className="w-10 h-10 rounded-full bg-[#0048ff] flex items-center justify-center text-white shadow-inner">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights / Stats Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-12 sm:pt-16 mt-8 border-t border-[#0c0c0c]/10">
          <div>
            <h4 className="font-open-sauce text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0c0c0c]">
              150<span className="text-[#0048ff]">+</span>
            </h4>
            <p className="font-open-sauce text-xs sm:text-sm text-[#0c0c0c]/60 uppercase tracking-widest mt-1">
              Moments Captured
            </p>
          </div>
          <div>
            <h4 className="font-open-sauce text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0c0c0c]">
              24<span className="text-[#0048ff]">+</span>
            </h4>
            <p className="font-open-sauce text-xs sm:text-sm text-[#0c0c0c]/60 uppercase tracking-widest mt-1">
              Featured Archives
            </p>
          </div>
          <div>
            <h4 className="font-open-sauce text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0c0c0c]">
              Weekly
            </h4>
            <p className="font-open-sauce text-xs sm:text-sm text-[#0c0c0c]/60 uppercase tracking-widest mt-1">
              Sunday Gatherings
            </p>
          </div>
          <div>
            <h4 className="font-open-sauce text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#0c0c0c]">
              100<span className="text-[#0048ff]">%</span>
            </h4>
            <p className="font-open-sauce text-xs sm:text-sm text-[#0c0c0c]/60 uppercase tracking-widest mt-1">
              Spirit & Truth
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
