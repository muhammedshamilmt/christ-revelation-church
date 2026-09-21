import TextReveal from "@/components/ui/TextReveal";

export default function AboutIntro() {
  const words = "Experience a community where faith meets action. Welcoming and completely open.";
  return (
    <section className="w-full bg-dark text-white py-20 sm:py-28 lg:py-32 px-6 sm:px-10 lg:px-12">
      <div className=" mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">

        {/* Left Column - Small Text */}
        <div className="lg:w-1/3 flex flex-col justify-start">
          <p className="font-open-sauce text-lg md:text-xl font-light text-white/70 max-w-sm">
            Christ Revelation Church is the perfect place for modern believers to connect and grow.
          </p>
        </div>

        {/* Right Column - Large Animated Text & Link */}
        <div className="lg:w-2/3 flex flex-col items-start lg:items-end">
          <TextReveal
            text={words}
            className="font-open-sauce text-[7vw] sm:text-[5vw] lg:text-[3.5vw] leading-[1.1] tracking-tight text-end font-medium max-w-7xl"
          />

          <a
            href="#discover"
            className="inline-block font-open-sauce text-sm sm:text-base uppercase tracking-widest border-b border-white pb-1 hover:text-white/70 hover:border-white/70 transition-colors"
          >
            Discover and become part
          </a>
        </div>

      </div>
    </section>
  );
}
