import Image from "next/image";
import TextReveal from "@/components/ui/TextReveal";

export default function SermonsSection() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12 flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <div className="w-full max-w-5xl mb-16 sm:mb-24">
        <TextReveal 
          className="font-open-sauce text-[7vw] sm:text-[4vw] lg:text-5xl leading-[1.1] tracking-tight font-medium text-[#0c0c0c]"
          text="Powerful sermons to inspire your <br/> spiritual journey and daily life."
        />
      </div>

      {/* Grid Section */}
      <div className="w-full border-t border-[#0c0c0c]/10 pt-6 sm:pt-10 flex flex-col lg:flex-row gap-8 lg:gap-6">
        
        {/* Left Label */}
        <div className="w-full lg:w-1/4">
          <p className="flex items-center gap-2 font-open-sauce text-xs font-semibold uppercase tracking-widest text-[#0c0c0c]/60">
            <span className="w-2 h-2 rounded-full bg-[#0c0c0c] block" />
            OUR SERMONS
          </p>
        </div>
        
        {/* Images Grid */}
        <div className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="flex flex-col group cursor-pointer">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#0c0c0c] mb-4">
              <Image 
                src="/sermon1.jpg" 
                alt="Worship Opens Doors" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
              />
            </div>
            <a href="#" className="font-open-sauce text-xs font-medium uppercase tracking-widest underline underline-offset-4 decoration-1 decoration-[#0c0c0c]/30 hover:decoration-[#0c0c0c] transition-colors">
              Worship Opens Doors
            </a>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col group cursor-pointer">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#0c0c0c] mb-4">
              <Image 
                src="/sermon2.jpg" 
                alt="Prayer is the Key" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
              />
            </div>
            <a href="#" className="font-open-sauce text-xs font-medium uppercase tracking-widest underline underline-offset-4 decoration-1 decoration-[#0c0c0c]/30 hover:decoration-[#0c0c0c] transition-colors">
              Prayer is the Key
            </a>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col group cursor-pointer">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#0c0c0c] mb-4">
              <Image 
                src="/sermon3.jpg" 
                alt="Christmas Music Festival" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
              />
            </div>
            <a href="#" className="font-open-sauce text-xs font-medium uppercase tracking-widest underline underline-offset-4 decoration-1 decoration-[#0c0c0c]/30 hover:decoration-[#0c0c0c] transition-colors">
              Christmas Music Festival
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
