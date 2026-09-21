import Image from "next/image";
import TextReveal from "@/components/ui/TextReveal";

export default function AlternatingFeatureSection() {
  return (
    <section className="w-full flex flex-col bg-[#FAFAFA] overflow-hidden">
      
      {/* Row 1: Image Left, Content Right */}
      <div className="w-full flex flex-col md:flex-row min-h-[50vh] md:min-h-[80vh]">
        {/* Left Half: Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
          <Image
            src="/images/hero-bg.png" // using placeholder image
            alt="Community Gatherings"
            fill
            className="object-cover object-center"
          />
        </div>
        
        {/* Right Half: Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24 bg-[#FAFAFA] text-[#0c0c0c]">
          <TextReveal 
            text="Experience spiritual growth and deep connection."
            className="font-open-sauce text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] font-medium mb-8"
          />
          <p className="font-open-sauce text-base sm:text-lg lg:text-xl text-[#0c0c0c]/70 leading-relaxed font-light max-w-xl">
            Join us in our various gatherings tailored to nurture your faith, bring the community together, and equip you for a life of purpose. Our programs are designed for all ages and walks of life.
          </p>
          <div className="mt-12">
            <a href="#more" className="font-open-sauce text-sm sm:text-base font-semibold tracking-wider uppercase border-b border-[#0c0c0c]/30 hover:border-[#0c0c0c] pb-1 transition-colors">
              Explore Ministries
            </a>
          </div>
        </div>
      </div>

      {/* Row 2: Content Left, Image Right */}
      <div className="w-full flex flex-col md:flex-row min-h-[50vh] md:min-h-[80vh]">
        
        {/* Left Half: Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-24 bg-white text-[#0c0c0c]">
          <TextReveal 
            text="Worship together in absolute truth and love."
            className="font-open-sauce text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] font-medium mb-8"
          />
          <p className="font-open-sauce text-base sm:text-lg lg:text-xl text-[#0c0c0c]/70 leading-relaxed font-light max-w-xl">
            Our worship services are an opportunity to experience the presence of God through music, prayer, and profound teachings. Come as you are and find a welcoming family ready to embrace you.
          </p>
          <div className="mt-12">
            <a href="#more" className="font-open-sauce text-sm sm:text-base font-semibold tracking-wider uppercase border-b border-[#0c0c0c]/30 hover:border-[#0c0c0c] pb-1 transition-colors">
              Join a Service
            </a>
          </div>
        </div>

        {/* Right Half: Image */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative">
          <Image
            src="/images/hero-bg.png" // using placeholder image
            alt="Worship Together"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

    </section>
  );
}
