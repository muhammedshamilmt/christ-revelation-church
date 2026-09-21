"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function GalleryHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-dark">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png" // using placeholder
          alt="Gallery Hero Background"
          fill
          priority
          className="object-cover object-center scale-105 animate-pulse-slow transition-transform duration-1000"
          style={{ animationDuration: '10s' }}
        />
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:p-12">
        {/* Placeholder for Navbar */}
        <div />

        {/* Large Bottom Text Overlay */}
        <div className="w-full flex justify-center pb-4 sm:pb-8">
          <div className="max-w-[1600px] mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
              className="font-ancola text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-bold tracking-wide text-white leading-none whitespace-nowrap"
            >
              Christ
            </motion.h1>

            {/* <div className="flex-1 w-full sm:w-auto h-[2px] sm:h-[4px] bg-white/70 mx-4 sm:mx-8 mt-4 sm:mt-0 opacity-50 sm:block hidden" /> */}

            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
              className="font-ancola text-6xl sm:text-7xl md:text-8xl lg:text-[10vw] font-bold tracking-wide text-white leading-none whitespace-nowrap flex items-start"
            >
              revelation <sup className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl ml-2 sm:ml-4 font-medium">®</sup>
            </motion.h1>
          </div>
        </div>
      </div>
    </section>
  );
}
