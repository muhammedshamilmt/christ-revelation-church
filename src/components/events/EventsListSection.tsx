import Image from "next/image";
import Link from "next/link";
import PixelTransition from "@/components/ui/PixelTransition";

export default function EventsListSection() {
  const events = [
    {
      id: 1,
      title: "Annual Youth Conference 2026",
      date: "May 30 - Jun 3, 2026",
      location: "Main Auditorium",
      desc: "Join thousands of young believers for five unforgettable days of worship, teachings, and community building.",
      img: "/images/hero-bg.png"
    },
    {
      id: 2,
      title: "Community Outreach Drive",
      date: "June 15, 2026",
      location: "Downtown Plaza",
      desc: "A day dedicated to serving our local community with food distribution, free medical checkups, and prayers.",
      img: "/images/hero-bg.png"
    },
    {
      id: 3,
      title: "Worship Night: Encounter",
      date: "July 02, 2026",
      location: "Worship Center",
      desc: "An extended evening of prophetic worship and prayer. Come experience a transformative encounter with the Holy Spirit.",
      img: "/images/hero-bg.png"
    },
  ];

  return (
    <section className="w-full bg-white text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col items-center">

        {/* Title & Filters */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-16 sm:mb-20 gap-8">
          <h2 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-center md:text-left">
            Upcoming Events
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <button className="px-6 py-2.5 rounded-full border border-[#0c0c0c] text-sm font-open-sauce font-medium bg-[#0c0c0c] text-white">All Events</button>
            <button className="px-6 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm font-open-sauce font-medium text-[#0c0c0c]/60 hover:bg-gray-100 hover:text-[#0c0c0c] transition-colors">Conferences</button>
            <button className="px-6 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm font-open-sauce font-medium text-[#0c0c0c]/60 hover:bg-gray-100 hover:text-[#0c0c0c] transition-colors">Outreach</button>
          </div>
        </div>

        {/* Grid - 3 columns for larger cards without rounded corners */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
          {events.map((event) => (
            <div key={event.id} className="w-full flex flex-col group cursor-pointer">

              {/* Tall Image with Pixel Transition */}
              <div className="w-full overflow-hidden mb-8 bg-gray-100 relative">
                <PixelTransition
                  aspectRatio="125%"
                  pixelColor="#ffffff"
                  animationStepDuration={0.4}
                  firstContent={
                    <Image
                      src={event.img}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0048ff] flex items-center justify-center p-8 text-center absolute inset-0">
                      <p className="font-open-sauce text-white text-3xl sm:text-4xl font-medium tracking-tight">
                        Register for <br /><span className="text-white drop-shadow-md font-bold mt-2 block">{event.title}</span>
                      </p>
                    </div>
                  }
                />
              </div>

              {/* Event Details */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <span className="font-open-sauce text-sm font-bold text-[#0048ff] uppercase tracking-wider block mb-1">
                      {event.date}
                    </span>
                    <h3 className="font-open-sauce text-2xl sm:text-3xl font-bold tracking-tight text-[#0c0c0c]">
                      {event.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-[#0c0c0c]/60 bg-gray-50 px-4 py-2  self-start sm:self-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="font-open-sauce text-sm font-medium">{event.location}</span>
                  </div>
                </div>

                <p className="font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 leading-relaxed font-light mt-2">
                  {event.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
