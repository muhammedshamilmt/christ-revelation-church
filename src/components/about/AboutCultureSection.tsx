import Image from "next/image";

export default function AboutCultureSection() {
  return (
    <section className="w-full flex flex-col bg-dark">
      {/* Top Image Section */}
      <div className="relative w-full h-[50vh] md:h-[70vh] lg:h-[80vh]">
        <Image
          src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/hands.avif"
          alt="The Culture"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-10 left-0 w-full flex justify-center px-6 text-center">
          <h2 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl lg:text-[6vw] text-white font-medium tracking-tight drop-shadow-lg">
            Our Mission
          </h2>
        </div>
      </div>

      {/* Bottom Cards Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        {/* Goals Card - Brand Blue */}
        <div className="bg-[#0048ff] text-white p-10 sm:p-14 lg:p-20 flex flex-col justify-between aspect-square md:aspect-auto md:h-[60vh] min-h-[400px] group cursor-pointer transition-colors hover:bg-[#003bd0]">
          <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-10">
            <h3 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">Mission</h3>
            <p className="font-open-sauce text-sm sm:text-base text-white/80 max-w-[280px] xl:text-right xl:mt-3 leading-relaxed">
              At Christ Revelation Church, our mission is simple yet profound: To radiate His love to the world.
            </p>
          </div>
          <div className="flex justify-end mt-12 overflow-hidden">
            <svg width="164" height="164" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-4 group-hover:-translate-y-4">
              <path d="M6 18L18 6M18 6H8M18 6V16" />
            </svg>
          </div>
        </div>

        {/* Awards Card - White */}
        <div className="bg-white text-[#0c0c0c] p-10 sm:p-14 lg:p-20 flex flex-col justify-between aspect-square md:aspect-auto md:h-[60vh] min-h-[400px] group cursor-pointer transition-colors hover:bg-gray-50">
          <div className="flex flex-col xl:flex-row justify-between gap-6 xl:gap-10">
            <h3 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight">Vision</h3>
            <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/70 max-w-[280px] xl:text-right xl:mt-3 leading-relaxed">
              Guided by the Holy Spirit, our Pentecostal church envisions a community where individuals passionately pursue God’s presence and experience transformative encounters.
            </p>
          </div>
          <div className="flex justify-end mt-12 overflow-hidden">
            <svg width="164" height="164" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-x-4 group-hover:-translate-y-4">
              <path d="M6 18L18 6M18 6H8M18 6V16" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
