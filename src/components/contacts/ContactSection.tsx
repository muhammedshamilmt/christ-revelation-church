import Image from "next/image";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="w-full min-h-screen bg-white text-[#0c0c0c] flex flex-col md:flex-row pt-32 sm:pt-40 px-6 sm:px-10 lg:px-12 pb-10">
      
      {/* Left Column */}
      <div className="w-full md:w-1/3 flex flex-col justify-between mb-16 md:mb-0 pr-0 md:pr-10">
        <div>
          <h1 className="font-open-sauce text-6xl sm:text-7xl lg:text-8xl font-medium tracking-tight mb-6">
            Contact us
          </h1>
          <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light max-w-sm leading-relaxed">
            Get in touch with us for any enquiries and questions
          </p>
        </div>

        {/* Social Links - Hidden on mobile, shown on bottom for desktop */}
        <div className="hidden md:flex items-center gap-8 mt-20">
          <Link href="#" className="font-open-sauce font-semibold text-sm hover:opacity-60 transition-opacity">
            Facebook
          </Link>
          <Link href="#" className="font-open-sauce font-semibold text-sm hover:opacity-60 transition-opacity">
            Instagram
          </Link>
          <Link href="#" className="font-open-sauce font-semibold text-sm hover:opacity-60 transition-opacity">
            YouTube
          </Link>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3 flex flex-col justify-between">
        
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 mb-16">
          
          <div className="flex flex-col gap-2">
            <h3 className="font-open-sauce text-sm text-[#0c0c0c]/40 uppercase tracking-widest mb-2">
              General Inquiries
            </h3>
            <a href="mailto:info@christrevelation.org" className="font-open-sauce text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity">
              info@christrevelation.org
            </a>
            <a href="tel:+1234567890" className="font-open-sauce text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity">
              +1 234 567 890
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-open-sauce text-sm text-[#0c0c0c]/40 uppercase tracking-widest mb-2">
              Prayer Requests
            </h3>
            <a href="mailto:prayer@christrevelation.org" className="font-open-sauce text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity">
              prayer@christrevelation.org
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-open-sauce text-sm text-[#0c0c0c]/40 uppercase tracking-widest mb-2">
              Ministries & Outreach
            </h3>
            <a href="mailto:outreach@christrevelation.org" className="font-open-sauce text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity">
              outreach@christrevelation.org
            </a>
            <a href="tel:+1234567891" className="font-open-sauce text-lg sm:text-xl font-medium hover:opacity-70 transition-opacity">
              +1 234 567 891
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-open-sauce text-sm text-[#0c0c0c]/40 uppercase tracking-widest mb-2">
              Address
            </h3>
            <p className="font-open-sauce text-lg sm:text-xl font-medium leading-relaxed">
              123 Main St, San Francisco,<br />
              CA 94105
            </p>
          </div>

        </div>

        {/* Large Image */}
        <div className="w-full relative h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden bg-gray-100 mt-auto">
          <Image
            src="/images/hero-bg.png" // using placeholder
            alt="Church interior"
            fill
            className="object-cover"
          />
        </div>

        {/* Social Links - Mobile Only */}
        <div className="flex md:hidden items-center gap-6 mt-12">
          <Link href="#" className="font-open-sauce font-semibold text-sm hover:opacity-60 transition-opacity">
            Facebook
          </Link>
          <Link href="#" className="font-open-sauce font-semibold text-sm hover:opacity-60 transition-opacity">
            Instagram
          </Link>
          <Link href="#" className="font-open-sauce font-semibold text-sm hover:opacity-60 transition-opacity">
            YouTube
          </Link>
        </div>

      </div>

    </section>
  );
}
