"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="w-full min-h-[100vh] bg-[#0c0c0c] text-white pt-24 sm:pt-32 pb-8 px-6 sm:px-10 lg:px-12 flex flex-col justify-between overflow-hidden">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between w-full mb-32 sm:mb-48 lg:mb-64">

        {/* Top Left: Catchphrase & Button */}
        <div className="flex flex-col items-start gap-6 mb-16 md:mb-0">
          <p className="font-open-sauce text-xl sm:text-2xl font-medium tracking-tight">
            Christ Revelation Church.<br />Discover Your Place in God's Family.
          </p>
          <Link
            href="/events"
            className="px-6 py-2.5  border border-white/20 text-sm font-open-sauce hover:bg-white hover:text-[#0c0c0c] transition-colors duration-300 uppercase"
          >
            JOIN US THIS SUNDAY
          </Link>
        </div>

        {/* Top Right: Links Columns */}
        <div className="flex gap-16 sm:gap-24 lg:gap-32 font-open-sauce text-sm sm:text-base font-medium">
          <div className="flex flex-col gap-2">
            <h4 className="text-white/50 text-xs uppercase tracking-widest mb-2">Useful Links</h4>
            <Link href="/prayer-request" className="hover:opacity-70 transition-opacity">Prayer Request</Link>
            <Link href="/blogs" className="hover:opacity-70 transition-opacity">Blogs</Link>
            <Link href="/sermons" className="hover:opacity-70 transition-opacity">Sermons</Link>
            <Link href="/events" className="hover:opacity-70 transition-opacity">Events</Link>
            <Link href="/gallery" className="hover:opacity-70 transition-opacity">Gallery</Link>
            <a href="https://www.theglobalpeacemakers.org/donate#donate-section" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Give</a>
            <Link href="/contacts" className="hover:opacity-70 transition-opacity">Contacts</Link>
          </div>
          {/* <div className="flex flex-col gap-2">
            <h4 className="text-white/50 text-xs uppercase tracking-widest mb-2">Our Ministries</h4>
            <Link href="/ministries/worship-ministry" className="hover:opacity-70 transition-opacity">Worship Ministry</Link>
            <Link href="/ministries/outreach-ministry" className="hover:opacity-70 transition-opacity">Outreach Ministry</Link>
            <Link href="/ministries/prayer-ministry" className="hover:opacity-70 transition-opacity">Prayer Ministry</Link>
            <Link href="/ministries/kids-ministry" className="hover:opacity-70 transition-opacity">Kids Ministry</Link>
          </div> */}
          <div className="flex flex-col gap-2">
            <h4 className="text-white/50 text-xs uppercase tracking-widest mb-2">Legal</h4>
            <Link href="/privacy-policy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:opacity-70 transition-opacity">Refund Policy</Link>
            <Link href="/terms-and-conditions" className="hover:opacity-70 transition-opacity">Terms & Conditions</Link>
          </div>
        </div>
      </div>

      {/* Middle Section: Locations & Meta */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end w-full mb-10 sm:mb-16 font-open-sauce text-xs sm:text-sm text-white/80">
        <div className="mb-6 sm:mb-0 leading-relaxed max-w-xl">
          <p>“to bring sinners to Christ, extend a guiding hand to those battling with addiction and alcoholism, and to prepare the church for the second coming of Jesus.”</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 lg:gap-32">
          <a href="#" className="hover:text-white transition-colors">
            info@christrevelation.org
          </a>
          <p>© 2026 Christ Revelation Church</p>
        </div>
      </div>

      {/* Bottom Section: Giant Text */}
      <div className="w-full flex justify-center border-t border-white/20 pt-20 sm:pt-24">
        <h1 className="font-ancola text-[16vw] leading-[0.8] tracking-tight text-white font-normal select-none">
          revelation
        </h1>
      </div>

    </footer>
  );
}
