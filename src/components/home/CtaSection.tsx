import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-32 sm:py-48 flex flex-col items-center justify-center overflow-hidden">

      <div className="flex flex-col items-center text-center gap-6 group cursor-pointer">
        {/* Small Tagline */}
        <p className="flex items-center gap-2 font-open-sauce text-xs sm:text-sm font-medium text-[#0c0c0c]/70 transition-colors group-hover:text-[#0c0c0c]">
          Discover Your Place in God's Family
          <span className="text-lg leading-none transform transition-transform group-hover:translate-y-1">⬎</span>
        </p>

        {/* Large Underlined Text */}
        <h2 className="font-open-sauce text-5xl sm:text-6xl lg:text-7xl tracking-tight font-medium text-[#0c0c0c] relative inline-block max-w-4xl mx-auto">
          <span className="relative z-10">Join us for worship, fellowship and service.</span>
          {/* <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-[3px] sm:h-[4px] bg-[#0c0c0c] transform origin-left transition-transform duration-500 ease-out group-hover:scale-x-110"></span> */}
        </h2>

        {/* Optional explicit button as requested */}
        <div className="mt-8">
          <Link
            href="#"
            className="px-8 py-4 bg-[#0c0c0c] text-white  font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#0048FF] transition-colors duration-300 uppercase"
          >
            JOIN US THIS SUNDAY
          </Link>
        </div>
      </div>

    </section>
  );
}
