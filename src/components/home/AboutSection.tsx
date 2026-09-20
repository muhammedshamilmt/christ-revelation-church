"use client";

import TextReveal from "@/components/ui/TextReveal";

const words = "Welcome to Christ Revelation Church! We are a vibrant, Christ-centered community dedicated to advancing the Christian faith and making disciples who love God and serve others. ";

export default function AboutSection() {
  return (
    <section className="relative w-full bg-white text-[#0c0c0c] min-h-[90vh] flex flex-col p-6 sm:p-10 lg:p-12 overflow-hidden">
      {/* Top Header Row */}
      <div className="flex w-full justify-between items-start font-open-sauce text-sm sm:text-base font-medium tracking-wide">
        <div className="flex flex-col">
          <p>Christ Revelation Church.</p>
          <p>Discover Your Place in God's Family.</p>
        </div>
        <div>
          <p>Global Peacemakers</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center mt-16 sm:mt-24 lg:mt-32 mb-12 sm:pl-[10%] lg:pl-[15%] pr-4 sm:pr-8">
        <TextReveal
          text={words}
          className="font-open-sauce text-[7vw] sm:text-[5vw] lg:text-[3.5vw] leading-[1.1] tracking-tight font-medium max-w-7xl"
        />
      </div>
    </section>
  );
}
