"use client";

import Image from "next/image";
import PixelTransition from "@/components/ui/PixelTransition";

const ministries = [
  {
    id: "01",
    title: "Worship Ministry",
    description: "The Worship Ministry leads the congregation into a sacred encounter with God. Through music, prayer, and the Word, we create an atmosphere where hearts are stirred and lives are transformed. Musicians, vocalists, and audio-visual teams work together to ensure that every worship service reflects humility, excellence, and reverence. We believe worship is not performance—it is communion with the Creator, inviting His presence to dwell among His people.",
    image: "/images/hero-bg.png"
  },
  {
    id: "02",
    title: "Outreach Ministry",
    description: "The Outreach Ministry at Christ Revelation Church passionately embodies the Great Commission by extending the love, hope, and message of Jesus Christ beyond our church walls. This ministry is dedicated to serving our local community and the wider world through a diverse range of compassionate initiatives and evangelistic efforts.",
    image: "/images/hero-bg.png"
  },
  {
    id: "03",
    title: "Prayer Ministry",
    description: "The Prayer Ministry is the engine that fuels every part of our church. The Prayer Ministry intercedes for individuals, families, and nations, seeking God’s wisdom, healing, and direction. This dedicated team organizes prayer meetings, overnight vigils, and days of fasting, standing in the gap for breakthroughs. We believe that when the church prays, heaven moves—and lives are restored.",
    image: "/images/hero-bg.png"
  },
  {
    id: "04",
    title: "Kids Ministry",
    description: "Our Kids Ministry builds a foundation of faith in the hearts of our youngest members. With engaging lessons, music, crafts, and Bible stories, children learn that Jesus loves them deeply and has a plan for their lives. We partner with parents to raise disciples from an early age, emphasizing values such as kindness, honesty, and prayer. Every session aims to make learning about God joyful and memorable.",
    image: "/images/hero-bg.png"
  }
];

export default function MinistriesList() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-20 sm:py-32 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto w-full">

        {/* Section Heading */}
        <h2 className="font-open-sauce text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight mb-20">
          Our<br />Ministries
        </h2>

        {/* List of Ministries */}
        <div className="flex flex-col w-full">
          {ministries.map((ministry, index) => (
            <div
              key={ministry.id}
              className="flex flex-col lg:flex-row border-t border-[#0c0c0c]/10 py-10 sm:py-16 gap-10 group"
            >
              {/* Left: Tinted Image */}
              <div className="w-full lg:w-[45%] relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden">
                <PixelTransition
                  aspectRatio="100%"
                  pixelColor="#ffffff"
                  animationStepDuration={0.4}
                  firstContent={
                    <Image
                      src={ministry.image}
                      alt={ministry.title}
                      fill
                      className="object-cover "
                    />
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0048ff] flex items-center justify-center p-6 text-center absolute inset-0">
                      <p className="font-open-sauce text-white text-xl sm:text-2xl font-medium tracking-tight">
                        Explore <br /><span className="text-white drop-shadow-md">{ministry.title}</span>
                      </p>
                    </div>
                  }
                  className="w-full h-full"
                />
              </div>

              {/* Middle: Title */}
              <div className="w-full lg:w-[20%] flex flex-col pt-2">
                <p className="font-open-sauce text-xs font-bold text-[#0c0c0c]/40 mb-2">
                  {ministry.id}
                </p>
                <h3 className="font-open-sauce text-xl sm:text-2xl font-bold tracking-tight text-[#0c0c0c]">
                  {ministry.title}
                </h3>
              </div>

              {/* Right: Description & Optional small image */}
              <div className="w-full lg:w-[35%] flex flex-col gap-10 pt-2">
                <p className="font-open-sauce text-sm sm:text-base text-[#0c0c0c]/80 font-medium leading-relaxed">
                  {ministry.description}
                </p>

                {/* Secondary small image to match the design reference */}
                <div className="w-32 h-32 relative overflow-hidden bg-gray-200 mt-auto hidden lg:block">
                  <Image
                    src={ministry.image}
                    alt={`${ministry.title} detail`}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <p className="absolute bottom-1 left-1 text-[8px] text-white/50 uppercase tracking-widest mix-blend-difference">
                    FIG. 0{index + 1}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
