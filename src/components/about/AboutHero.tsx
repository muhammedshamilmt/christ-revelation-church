import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden bg-dark">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://christrevelationchurch.theglobalpeacemakers.org/wp-content/uploads/2025/12/IMG_3517-scaled.jpeg"
          alt="About Hero background"
          fill
          priority
          className="object-cover object-center scale-105 animate-pulse-slow transition-transform duration-1000"
          style={{ animationDuration: '15s' }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex h-full flex-col justify-center items-center text-center p-6 sm:p-10 lg:p-12">
        <h1 className="font-ancola text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal lowercase tracking-wide mb-6">
          our story
        </h1>
        <p className="font-open-sauce text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
          A House of Worship, Truth, and Global Community
        </p>
      </div>
    </section>
  );
}
