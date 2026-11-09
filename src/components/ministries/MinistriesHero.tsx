import Image from "next/image";
import { MINISTRIES_INTRO } from "@/lib/ministries";

export default function MinistriesHero() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-16">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col">
        {/* Top Content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="w-full lg:w-1/2">
            <span className="font-open-sauce text-xs font-bold uppercase tracking-[0.25em] text-[#0048ff] block mb-4">
              {MINISTRIES_INTRO.eyebrow}
            </span>
            <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05]">
              Ministries At
              <br />
              Christ Revelation
            </h1>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 font-medium leading-relaxed">
              {MINISTRIES_INTRO.lead}
            </p>
            <p className="font-open-sauce text-sm text-[#0c0c0c]/60 font-light leading-relaxed">
              {MINISTRIES_INTRO.vision}
            </p>
          </div>
        </div>

        {/* Large Feature Image */}
        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] relative rounded-lg overflow-hidden bg-gray-200">
          <Image
            src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-40783-scaled.jpg"
            alt="Ministries At Christ Revelation Church"
            fill
            sizes="100vw"
            className="object-cover grayscale"
            priority
          />
        </div>
      </div>
    </section>
  );
}
