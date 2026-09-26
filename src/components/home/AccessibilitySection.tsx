import Image from "next/image";
import Link from "next/link";

export default function AccessibilitySection() {
  return (
    <section className="w-full min-h-screen flex flex-col md:flex-row bg-[#FAFAFA] overflow-hidden">

      {/* Left Half: Image */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative">
        <Image
          src="/hand_glow.jpg"
          alt="Ethereal glowing hand"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {/* Right Half: Content */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:h-screen flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-24 bg-[#FAFAFA] text-[#0c0c0c]">

        {/* Top Huge Text */}
        <div className="max-w-xl">
          <h2 className="font-open-sauce text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-semibold tracking-tighter leading-[0.95]">
            Everyone.<br />
            Everywhere.
          </h2>
        </div>

        {/* Bottom Content & Button */}
        <div className="flex flex-col items-start gap-8 mt-12 md:mt-0 max-w-lg">
          <p className="font-open-sauce text-xl sm:text-2xl font-medium tracking-tight leading-snug">
            “When Christ died, He died for all. When He rose, He rose for all. Now, it is our calling to reveal the love of the crucified Christ and the glory of the living Christ to the world.”
          </p>

          <Link
            href="#"
            className="group flex items-center bg-[#0c0c0c] text-white  pl-6 pr-2 py-2 hover:bg-[#0048FF] transition-colors duration-300"
          >
            <span className="font-open-sauce text-sm font-semibold tracking-wide mr-4 uppercase">JOIN US THIS SUNDAY</span>
            <span className="bg-white text-[#0c0c0c] w-8 h-8  flex items-center justify-center ">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </span>
          </Link>
        </div>

      </div>

    </section>
  );
}
