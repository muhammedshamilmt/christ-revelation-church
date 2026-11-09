import Image from "next/image";

export default function AboutMeetSection() {
  return (
    <section className="w-full flex flex-col bg-white">
      {/* Top Image Section */}
      <div className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh]">
        <Image
          src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/08/pexels-pixabay-40783-scaled.jpg"
          alt="Meet our community"
          fill
          className="object-cover object-center"
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Centered Bottom Text */}
        <div className="absolute bottom-10 left-0 w-full flex justify-center px-6 text-center">
          <h2 className="font-open-sauce text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-medium tracking-tight drop-shadow-lg">
            Why Worship with US?
          </h2>
        </div>
      </div>

      {/* Bottom Text Section */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        <div className="mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">

          {/* Left Column */}
          <div className="lg:w-[30%]">
            <p className="font-open-sauce text-sm sm:text-base font-medium text-[#0c0c0c] leading-relaxed max-w-sm">
              A home for those looking to grow in faith, serve with purpose.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:w-[70%] flex flex-col items-start gap-8">
            <h3 className="font-open-sauce text-[8vw] sm:text-[5vw] lg:text-[4vw] leading-[1.05] tracking-tight font-medium text-[#0c0c0c]">
              Join us on this journey of love, redemption, and holistic support for individuals and families in need.
            </h3>

            <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed max-w-3xl">
              We strive to be a beacon of spiritual vitality, impacting lives and empowering believers to fulfil their divine purpose.
            </p>

            <a
              href="#learn-more"
              className="inline-block font-open-sauce text-sm sm:text-base font-medium tracking-wide border-b border-[#0c0c0c] pb-1 hover:text-[#0c0c0c]/60 hover:border-[#0c0c0c]/60 transition-colors mt-2"
            >
              Learn more
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
