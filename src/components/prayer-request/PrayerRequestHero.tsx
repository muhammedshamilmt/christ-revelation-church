import Image from "next/image";

export default function PrayerRequestHero() {
  return (
    <section className="w-full h-[70vh] relative flex flex-col justify-end overflow-hidden bg-[#0c0c0c]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-bg.png" // using placeholder
          alt="Prayer Request Hero Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Subtle gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-12 pb-16 sm:pb-24">
        <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center text-center">
          <p className="font-open-sauce text-sm sm:text-base font-bold tracking-[0.2em] text-[#0048FF] uppercase mb-4">
            Stand With Us In Faith
          </p>
          <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[1.05] max-w-6xl">
            Let us pray together for your needs.
          </h1>
        </div>
      </div>
    </section>
  );
}
