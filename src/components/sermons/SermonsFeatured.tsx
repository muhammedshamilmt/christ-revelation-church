import Image from "next/image";

export default function SermonsFeatured() {
  return (
    <section className="w-full bg-white relative pb-10">
      <div className="w-full h-[60vh] md:h-[80vh] lg:h-[90vh] relative overflow-hidden group">
        <Image
          src="/images/hero-bg.png" // placeholder
          alt="Featured Sermon"
          fill
          className="object-cover object-center transform transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-700 group-hover:bg-black/20" />

        <div className="absolute bottom-10 left-6 sm:left-10 lg:left-12 flex flex-col gap-6 max-w-2xl z-10">
          <h2 className="font-open-sauce text-3xl sm:text-5xl lg:text-6xl text-white font-medium tracking-tight leading-[1.1] drop-shadow-md">
            Break Free from <br /> Life's Burdens
          </h2>
          <div className="flex gap-4">
            <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-[#0c0c0c] transition-colors backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/50 flex items-center justify-center text-white hover:bg-white hover:text-[#0c0c0c] transition-colors backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
        </div>

        {/* Small floating preview card */}
        <div className="absolute bottom-16 right-6 sm:right-10 lg:right-24 hidden md:flex flex-col items-center z-10">
          {/* <div className="w-36 h-36 lg:w-48 lg:h-48 bg-white p-2 rounded-2xl shadow-2xl relative overflow-hidden transform transition-transform hover:-translate-y-2 cursor-pointer">
             <div className="w-full h-full relative rounded-xl overflow-hidden">
                <Image src="/images/hero-bg.png" alt="preview" fill className="object-cover" />
             </div>
          </div> */}
          {/* Pagination Line Indicators */}
          <div className="w-48 lg:w-64 flex gap-2 mt-6">
            <div className="h-[2px] w-1/4 bg-white transition-all"></div>
            <div className="h-[2px] w-1/4 bg-white/40 hover:bg-white/70 transition-all cursor-pointer"></div>
            <div className="h-[2px] w-1/4 bg-white/40 hover:bg-white/70 transition-all cursor-pointer"></div>
            <div className="h-[2px] w-1/4 bg-white/40 hover:bg-white/70 transition-all cursor-pointer"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
