import Image from "next/image";
import Link from "next/link";
import PixelTransition from "@/components/ui/PixelTransition";

export default function ServicesSection() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12 flex flex-col items-center overflow-hidden">

      {/* Top Header */}
      <div className="flex flex-col items-center text-center max-w-5xl w-full mb-20 sm:mb-32">
        <div className="flex items-center gap-2 font-open-sauce text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-8">
          <span>Christ Revelation</span>
          <span className="bg-[#0c0c0c] text-white px-3 py-1 rounded-full">Church</span>
          <span className="text-lg leading-none">⤵</span>
        </div>

        <h2 className="font-open-sauce font-medium tracking-tight text-[6vw] sm:text-[4vw] leading-[1.2] sm:leading-[1.2] text-[#0c0c0c]">
          <span className="underline underline-offset-[8px] sm:underline-offset-[12px] decoration-[2px] sm:decoration-[3px]">
            Explore our ministries
          </span>
          <br />
          <span className="underline underline-offset-[8px] sm:underline-offset-[12px] decoration-[2px] sm:decoration-[3px]">
            and outreach missions
          </span>
        </h2>
      </div>

      {/* Grid Section */}
      <div className="w-full max-w-[1400px]">
        <div className="flex justify-between items-end font-open-sauce text-sm sm:text-base font-medium mb-8">
          <p>Transforming lives through faith.</p>
          <Link href="/ministries" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <span className="text-xl leading-none">↳</span> See more
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Our Story */}
          <Link href="/about" className="relative w-full aspect-[3/4] sm:aspect-[2/3] overflow-hidden group cursor-pointer bg-[#0c0c0c] block">
            <PixelTransition
              gridSize={10}
              pixelColor="#0048FF"
              animationStepDuration={0.4}
              aspectRatio="0"
              className="w-full h-full"
              firstContent={
                <div className="relative w-full h-full">
                  <Image
                    src="/service1.jpg"
                    alt="Our Story"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                    <h3 className="flex items-center gap-3 text-white font-ancola text-3xl sm:text-4xl lowercase tracking-tight">
                      <span className="w-4 h-4 bg-white/20 rotate-45 flex items-center justify-center p-[2px]">
                        <span className="w-full h-full bg-white rotate-0 block" />
                      </span>
                      OUR STORY
                    </h3>
                  </div>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0048FF] p-8 text-center">
                  <h3 className="text-white font-ancola text-3xl sm:text-4xl lowercase tracking-tight mb-4">Our Story</h3>
                  <p className="text-white/80 font-open-sauce text-sm leading-relaxed">At Christ Revelation Church, we believe that church is more than a building—it’s a family bound by love, strengthened by faith, and sustained by God’s grace.</p>
                  <span className="text-white font-open-sauce text-xs font-bold uppercase tracking-widest mt-6 underline underline-offset-4">Read More →</span>
                </div>
              }
            />
          </Link>

          {/* Card 2: Our Ministries */}
          <Link href="/ministries" className="relative w-full aspect-[3/4] sm:aspect-[2/3] overflow-hidden group cursor-pointer bg-[#0c0c0c] block">
            <PixelTransition
              gridSize={10}
              pixelColor="#0048FF"
              animationStepDuration={0.4}
              aspectRatio="0"
              className="w-full h-full"
              firstContent={
                <div className="relative w-full h-full">
                  <Image
                    src="/service2.jpg"
                    alt="Our Ministries"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                    <h3 className="flex items-center gap-3 text-white font-ancola text-3xl sm:text-4xl lowercase tracking-tight">
                      <span className="w-4 h-4 border-[2px] border-white/40 rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full block" />
                      </span>
                      MINISTRIES
                    </h3>
                  </div>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0048FF] p-8 text-center">
                  <h3 className="text-white font-ancola text-3xl sm:text-4xl lowercase tracking-tight mb-4">Our Ministries</h3>
                  <p className="text-white/80 font-open-sauce text-sm leading-relaxed">We are dedicated to the uplifting message of the Christian gospel. Our goal is to nurture spiritual growth and bring hope to those facing difficult times.</p>
                  <span className="text-white font-open-sauce text-xs font-bold uppercase tracking-widest mt-6 underline underline-offset-4">Learn More →</span>
                </div>
              }
            />
          </Link>

          {/* Card 3: Outreach Missions */}
          <Link href="/ministries/outreach-ministry" className="relative w-full aspect-[3/4] sm:aspect-[2/3] overflow-hidden group cursor-pointer bg-[#0c0c0c] block">
            <PixelTransition
              gridSize={10}
              pixelColor="#0048FF"
              animationStepDuration={0.4}
              aspectRatio="0"
              className="w-full h-full"
              firstContent={
                <div className="relative w-full h-full">
                  <Image
                    src="/service3.jpg"
                    alt="Outreach Missions"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
                    <h3 className="flex items-center gap-3 text-white font-ancola text-3xl sm:text-4xl lowercase tracking-tight">
                      <span className="font-ancola font-bold text-lg leading-none">M</span>
                      OUTREACH
                    </h3>
                  </div>
                </div>
              }
              secondContent={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0048FF] p-8 text-center">
                  <h3 className="text-white font-ancola text-3xl sm:text-4xl lowercase tracking-tight mb-4">Outreach Missions</h3>
                  <p className="text-white/80 font-open-sauce text-sm leading-relaxed">With a heartfelt focus on compassion and an awareness of the urgency of our mission, we live in anticipation of Jesus’s return.</p>
                  <span className="text-white font-open-sauce text-xs font-bold uppercase tracking-widest mt-6 underline underline-offset-4">Join Our Outreach →</span>
                </div>
              }
            />
          </Link>
        </div>
      </div>

    </section>
  );
}
