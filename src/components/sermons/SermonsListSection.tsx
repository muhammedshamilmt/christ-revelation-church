import Image from "next/image";
import Link from "next/link";
import PixelTransition from "@/components/ui/PixelTransition";

export default function SermonsListSection() {
  const sermons = [
    {
      id: 1,
      speaker: "James Harden",
      rating: 5,
      title: "The Power of Forgiveness",
      desc: "Every sermon is a step towards a cleaner, healthier spirit. By harnessing the word's energy, you're reducing your burdens.",
      img: "/images/hero-bg.png"
    },
    {
      id: 2,
      speaker: "Sarah Jenkins",
      rating: 5,
      title: "Walking in Grace",
      desc: "Every sermon is a step towards a cleaner, healthier spirit. By harnessing the word's energy, you're reducing your burdens.",
      img: "/images/hero-bg.png"
    },
    {
      id: 3,
      speaker: "Michael Scott",
      rating: 5,
      title: "Faith in the Fire",
      desc: "Every sermon is a step towards a cleaner, healthier spirit. By harnessing the word's energy, you're reducing your burdens.",
      img: "/images/hero-bg.png"
    }
  ];

  return (
    <section className="w-full bg-white text-[#0c0c0c] py-20 sm:py-32 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">

        {/* Title */}
        <h2 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-16 sm:mb-20 text-center">
          Our Sermons
        </h2>

        {/* Filters & See More */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button className="px-6 py-2.5  border border-[#0c0c0c] text-sm font-open-sauce font-medium bg-white text-[#0c0c0c]">All</button>
            <button className="px-6 py-2.5  border border-transparent bg-gray-100 text-sm font-open-sauce font-medium text-[#0c0c0c]/60 hover:bg-gray-200 hover:text-[#0c0c0c] transition-colors">Faith</button>
            <button className="px-6 py-2.5  border border-transparent bg-gray-100 text-sm font-open-sauce font-medium text-[#0c0c0c]/60 hover:bg-gray-200 hover:text-[#0c0c0c] transition-colors">Grace</button>
          </div>
          <Link href="#more" className="font-open-sauce text-sm font-bold tracking-wider uppercase border-b-[1.5px] border-[#0c0c0c] pb-0.5 hover:text-[#0048ff] hover:border-[#0048ff] transition-colors">
            SEE MORE
          </Link>
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {sermons.map((sermon) => (
            <div key={sermon.id} className="w-full flex flex-col group cursor-pointer">

              {/* Image with Pixel Transition */}
              <div className="w-full overflow-hidden mb-6 bg-gray-100 relative">
                <PixelTransition
                  aspectRatio="100%"
                  pixelColor="#ffffff"
                  animationStepDuration={0.4}
                  firstContent={
                    <Image
                      src={sermon.img}
                      alt={sermon.title}
                      fill
                      className="object-cover"
                    />
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0048ff] flex items-center justify-center p-6 text-center absolute inset-0">
                      <p className="font-open-sauce text-white text-xl sm:text-2xl font-medium tracking-tight">
                        Listen to <br /><span className="text-white drop-shadow-md">{sermon.title}</span>
                      </p>
                    </div>
                  }
                />
              </div>

              {/* Author Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative border border-gray-100">
                    <Image src="/images/hero-bg.png" alt={sermon.speaker} fill className="object-cover" />
                  </div>
                  <span className="font-open-sauce text-sm font-bold text-[#0c0c0c]">{sermon.speaker}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span className="font-open-sauce text-sm font-bold text-[#0c0c0c]">{sermon.rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-open-sauce text-sm text-[#0c0c0c]/70 leading-relaxed font-light">
                {sermon.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
