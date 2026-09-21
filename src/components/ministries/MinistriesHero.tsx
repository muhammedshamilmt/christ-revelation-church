import Image from "next/image";

export default function MinistriesHero() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-16">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col">
        
        {/* Top Content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="w-full lg:w-1/2">
            <h1 className="font-open-sauce text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[1.05]">
              Ministries At<br />
              Christ Revelation
            </h1>
          </div>
          
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 font-medium leading-relaxed">
              At Christ Revelation Church, our ministries are the heartbeat of our mission—to love God, serve others, and build a Christ-centered community.
            </p>
            <p className="font-open-sauce text-sm text-[#0c0c0c]/60 font-light leading-relaxed">
              Each ministry is an open door to serve, learn, and grow. Together, we embody the church’s vision: to reveal Christ to the world—one life, one act of love at a time.
            </p>
          </div>
        </div>

        {/* Large Feature Image */}
        <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] relative rounded-lg overflow-hidden bg-gray-200">
          <Image
            src="/images/hero-bg.png" // placeholder
            alt="Ministries Hero"
            fill
            className="object-cover grayscale"
            priority
          />
        </div>

      </div>
    </section>
  );
}
