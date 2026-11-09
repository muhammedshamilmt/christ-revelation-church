import Link from "next/link";
import TextReveal from "@/components/ui/TextReveal";

export default function SermonsHero() {
  return (
    <section className="w-full bg-white text-[#0c0c0c] flex flex-col pt-32 pb-16 px-6 sm:px-10 lg:px-12 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center text-center mt-12 sm:mt-20">

        <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-medium max-w-7xl leading-[1.1]">
          Nourish Your Spirit, <br /> Empower Your Life
        </h1>

        <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 max-w-4xl mt-8 font-light leading-relaxed">
          Every sermon is a step towards a deeper understanding of God's word. By listening to our messages, you're building a stronger foundation of faith and equipping yourself to face life's challenges.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Link
            href="#latest"
            className="px-8 py-4 bg-[#0c0c0c] text-white font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#0c0c0c]/80 transition-colors uppercase "
          >
            Listen Now
          </Link>
          <Link
            href="/sermons/worship-opens-doors"
            className="px-8 py-4 bg-transparent border border-[#0c0c0c]/20 text-[#0c0c0c] font-open-sauce text-sm font-semibold tracking-wide hover:border-[#0c0c0c] transition-colors uppercase "
          >
            Watch Video
          </Link>
        </div>

        {/* Pill Buttons Row */}
        <div className="w-full flex justify-between items-center mt-24">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">FAITH</button>
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">GRACE</button>
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">HOPE</button>
          </div>
          <div className="hidden md:flex flex-wrap gap-2 sm:gap-4">
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">SERIES</button>
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">TOPICS</button>
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">SPEAKERS</button>
            <button className="px-5 py-2  border border-[#0c0c0c]/20 text-xs sm:text-sm font-open-sauce font-medium hover:bg-[#0c0c0c] hover:text-white transition-colors">PODCASTS</button>
          </div>
        </div>

      </div>
    </section>
  );
}
