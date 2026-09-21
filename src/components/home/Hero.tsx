"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-dark">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.png"
          alt="Hero background"
          fill
          priority
          className="object-cover object-center scale-105 animate-pulse-slow transition-transform duration-1000"
          style={{ animationDuration: '10s' }}
        />
        {/* Subtle overlay to ensure text readability and match theme */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-10 lg:p-12">

        {/* Placeholder for Navbar */}
        <div />

        {/* Bottom Giant Text */}
        <div className="w-full flex justify-center pb-4 sm:pb-8 ">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 4.3 }}
            className="font-ancola text-[17vw] leading-[0.7] tracking-[0.01rem] text-white font-normal lowercase select-none drop-shadow-2xl"
          >
            revelation
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
