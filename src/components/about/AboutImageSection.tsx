import Image from "next/image";

export default function AboutImageSection() {
  return (
    <section className="w-full bg-dark px-6 sm:px-10 lg:px-12 pb-20 sm:pb-28 lg:pb-32">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        
        {/* Large Image */}
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-sm">
          <Image
            src="/images/hero-bg.png" // Using placeholder image from existing assets
            alt="Community engagement"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Caption */}
        <div className="flex justify-start">
          <p className="font-open-sauce text-xs sm:text-sm text-white/50">
            Faith and community made simple.
          </p>
        </div>

      </div>
    </section>
  );
}
