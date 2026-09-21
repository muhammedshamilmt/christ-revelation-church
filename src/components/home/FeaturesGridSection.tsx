import TextReveal from "@/components/ui/TextReveal";
import Link from "next/link";

export default function FeaturesGridSection() {
  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12 flex flex-col items-center">
      <div className="w-full max-w-[1400px]">
        
        {/* Top Header */}
        <div className="mb-16 sm:mb-24">
          <TextReveal 
            className="font-open-sauce text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1]"
            text="Anyone. Anywhere. <br/> 100+ communities, 1000+ members."
          />
        </div>

        {/* 4-Column Grid with Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#0c0c0c]/10">
          
          {/* Feature 1 */}
          <Link href="https://www.theglobalpeacemakers.org/donate#donate-section" className="flex flex-col p-8 sm:p-10 border-b lg:border-b-0 sm:border-r border-[#0c0c0c]/10 hover:bg-gray-50 transition-colors group">
            <div className="mb-16">
              {/* Simple SVG Icon placeholder matching the gauge */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <h3 className="font-open-sauce text-lg font-semibold tracking-tight mb-3 group-hover:text-[#0048FF] transition-colors">
              GIVE TO THE CHURCH
            </h3>
            <p className="font-open-sauce text-sm leading-relaxed text-[#0c0c0c]/70">
              Donate to help a cause and support our mission to spread love and faith worldwide.
            </p>
          </Link>

          {/* Feature 2 */}
          <div className="flex flex-col p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#0c0c0c]/10">
            <div className="mb-16">
              {/* Brain / Network Icon placeholder */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
              </svg>
            </div>
            <h3 className="font-open-sauce text-lg font-semibold tracking-tight mb-3">
              GET INVOLVED
            </h3>
            <p className="font-open-sauce text-sm leading-relaxed text-[#0c0c0c]/70">
              Be Involved, Get Involved. Discover your place in our various ministries and outreach programs.
            </p>
          </div>

          {/* Feature 3 */}
          <Link href="/prayer-request" className="flex flex-col p-8 sm:p-10 border-b sm:border-b-0 sm:border-r border-[#0c0c0c]/10 hover:bg-gray-50 transition-colors group">
            <div className="mb-16">
              {/* Target / Tailored Icon placeholder */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <h3 className="font-open-sauce text-lg font-semibold tracking-tight mb-3 group-hover:text-[#0048FF] transition-colors">
              PRAYER REQUEST
            </h3>
            <p className="font-open-sauce text-sm leading-relaxed text-[#0c0c0c]/70">
              Let's pray together. Submit your prayer requests and our team will stand with you in faith.
            </p>
          </Link>

          {/* Feature 4 */}
          <div className="flex flex-col p-8 sm:p-10">
            <div className="mb-16">
              {/* Dots / Awareness Icon placeholder */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="3" />
                <circle cx="19" cy="6" r="2" />
                <circle cx="5" cy="6" r="2" />
                <circle cx="19" cy="18" r="2" />
                <circle cx="5" cy="18" r="2" />
              </svg>
            </div>
            <h3 className="font-open-sauce text-lg font-semibold tracking-tight mb-3">
              WEEKLY GATHERINGS
            </h3>
            <p className="font-open-sauce text-sm leading-relaxed text-[#0c0c0c]/70">
              Sunday Service: 8:30am - 11:30am<br/>
              Prayer Time: 6:30pm - 8:30pm
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
