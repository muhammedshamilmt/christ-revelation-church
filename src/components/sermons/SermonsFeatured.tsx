import Image from "next/image";
import Link from "next/link";

export default function SermonsFeatured() {
  return (
    <section className="w-full bg-white relative pb-10">
      <div className="w-full h-[60vh] md:h-[80vh] lg:h-[90vh] relative overflow-hidden group">
        <Image
          src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-michelle-sousa-santos-2154689883-33548789-1-scaled.jpg"
          alt="Featured Sermon – Worship Opens Doors"
          fill
          className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/35 transition-opacity duration-700 group-hover:bg-black/25" />

        <div className="absolute bottom-10 left-6 sm:left-10 lg:left-12 flex flex-col gap-6 max-w-2xl z-10">
          <span className="font-open-sauce text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Featured Message • Pastor Manoj Nair
          </span>
          <h2 className="font-open-sauce text-3xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight leading-[1.1] drop-shadow-md">
            Worship Opens Doors <br /> Into God&apos;s Presence
          </h2>
          <div className="flex items-center gap-4">
            <Link
              href="/sermons/worship-opens-doors"
              className="px-7 py-3.5 rounded-full bg-white text-[#0c0c0c] font-open-sauce text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-[#0048ff] hover:text-white transition-colors"
            >
              Read &amp; Watch Sermon
            </Link>
            <Link
              href="/sermons/prayer-is-the-key"
              aria-label="Next Sermon: Prayer is the Key"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-[#0c0c0c] transition-colors backdrop-blur-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </Link>
          </div>
        </div>

        {/* Pagination Line Indicators */}
        <div className="absolute bottom-16 right-6 sm:right-10 lg:right-24 hidden md:flex flex-col items-center z-10">
          <div className="w-48 lg:w-64 flex gap-2 mt-6">
            <Link href="/sermons/worship-opens-doors" className="h-[2px] w-1/3 bg-white transition-all" aria-label="Sermon 1" />
            <Link href="/sermons/prayer-is-the-key" className="h-[2px] w-1/3 bg-white/40 hover:bg-white/70 transition-all cursor-pointer" aria-label="Sermon 2" />
            <Link href="/sermons/christmas-music-festival" className="h-[2px] w-1/3 bg-white/40 hover:bg-white/70 transition-all cursor-pointer" aria-label="Sermon 3" />
          </div>
        </div>
      </div>
    </section>
  );
}
