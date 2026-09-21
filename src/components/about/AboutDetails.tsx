import TextReveal from "@/components/ui/TextReveal";

export default function AboutDetails() {
  const headingText = "All About Christ Revelation Church";

  return (
    <section className="w-full bg-white text-[#0c0c0c] py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-12">
      <div className=" mx-auto flex flex-col lg:flex-row gap-12 lg:gap-32">

        {/* Left Column */}
        <div className="lg:w-[30%]">
          <h2 className="font-open-sauce text-sm sm:text-base font-medium tracking-wide">
            Our Story
          </h2>
        </div>

        {/* Right Column */}
        <div className="lg:w-[70%] flex flex-col items-end gap-10">
          <TextReveal
            text={headingText}
            className="font-open-sauce text-[9vw] sm:text-[5vw] text-end lg:text-[4vw] leading-[1.1] tracking-tight font-medium max-w-7xl"
          />

          <p className="font-open-sauce text-base  sm:text-lg md:text-xl text-[#0c0c0c]/70 max-w-4xl font-light leading-relaxed">
            In addition to our commitment to evangelism and outreach, we help and encourage families to understand the importance of family life and leading them to Christ by giving bible studies. We are also engaged in rehabilitation for individuals grappling with drug addiction by offering them the help they need to get their life back on track and understand the love of God. We believe in the transformative power of the Christian gospel, fostering spiritual growth and offering hope to those facing life’s challenges. With a strong emphasis on compassion, urgency, and readiness for the return of Jesus, our community strives to create a welcoming space for all.
          </p>

          <a
            href="#learn-more"
            className="inline-block font-open-sauce text-sm sm:text-base font-medium tracking-wide border-b border-[#0c0c0c] pb-1 hover:text-[#0c0c0c]/60 hover:border-[#0c0c0c]/60 transition-colors mt-2"
          >
            Learn more
          </a>
        </div>

      </div>
    </section>
  );
}
