"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  // { label: "Ministries", href: "/ministries" },
  { label: "Sermons", href: "/sermons" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
  { label: "Prayer", href: "/prayer-request" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Prevent scrolling when menu is open (always called before any early return to satisfy Rules of Hooks)
  useEffect(() => {
    if (isAdminRoute) {
      document.body.style.overflow = "unset";
      return;
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isAdminRoute]);

  if (isAdminRoute) return null;

  const menuVariants: Variants = {
    initial: { y: "-100%" },
    animate: {
      y: "0%",
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      y: "-100%",
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
    }
  };

  const containerVariants: Variants = {
    initial: {},
    animate: {
      transition: { staggerChildren: 0.08, delayChildren: 0.8 }
    },
    exit: {
      transition: { staggerChildren: 0.04, staggerDirection: -1 }
    }
  };

  const itemVariants: Variants = {
    initial: { y: "100%", opacity: 0 },
    animate: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
      y: "100%",
      opacity: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 grid grid-cols-3 items-center p-6 sm:p-10 lg:p-12 font-open-sauce text-sm font-medium text-white tracking-wide mix-blend-difference">
        <div className="flex justify-start">
          <p>Christ Revelation Church.</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col gap-[5px] hover:opacity-70 transition-opacity duration-300 p-2"
          >
            <span className="w-6 h-[2px] bg-white block"></span>
            <span className="w-6 h-[2px] bg-white block"></span>
            <span className="w-6 h-[2px] bg-white block"></span>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="hover:opacity-70 transition-opacity duration-300 uppercase tracking-widest"
          >
            Menu
          </button>
        </div>
      </header>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white text-[#0c0c0c] flex flex-col"
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 sm:p-10 lg:p-12 font-open-sauce text-sm font-semibold tracking-widest uppercase border-b border-transparent">
              <p>Christ Revelation</p>

              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:rotate-90 transition-transform duration-500 rounded-full bg-[#0c0c0c]/5 hover:bg-[#0c0c0c]/10"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="#0c0c0c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <Link href="/contacts" onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity">
                Contact
              </Link>
            </div>

            {/* Menu Content */}
            <motion.div
              className="flex-1 flex flex-col lg:flex-row px-6 sm:px-10 lg:px-12 py-10 overflow-y-auto"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Left Side: Navigation Links */}
              <div className="flex-1 lg:pl-16">
                <div className="overflow-hidden mb-8">
                  <motion.p variants={itemVariants} className="font-open-sauce text-xs font-semibold uppercase tracking-widest text-[#0c0c0c]/40">
                    Main
                  </motion.p>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 sm:gap-24 lg:gap-32">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {navLinks.slice(0, 4).map((link) => (
                      <div key={link.label} className="overflow-hidden">
                        <motion.a
                          href={link.href}
                          variants={itemVariants}
                          onClick={() => setIsOpen(false)}
                          className="font-open-sauce text-[11vw] sm:text-6xl lg:text-7xl tracking-tight leading-none hover:opacity-50 transition-opacity block"
                        >
                          {link.label}
                        </motion.a>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {navLinks.slice(4, 8).map((link) => (
                      <div key={link.label} className="overflow-hidden">
                        <motion.a
                          href={link.href}
                          variants={itemVariants}
                          onClick={() => setIsOpen(false)}
                          className="font-open-sauce text-[11vw] sm:text-6xl lg:text-7xl tracking-tight leading-none hover:opacity-50 transition-opacity block"
                        >
                          {link.label}
                        </motion.a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Contact Actions */}
              <div className="mt-20 lg:mt-0 w-full lg:w-1/4 flex flex-col">
                <div className="overflow-hidden mb-8">
                  <motion.p variants={itemVariants} className="font-open-sauce text-xs font-semibold uppercase tracking-widest text-[#0c0c0c]/40">
                    Contact
                  </motion.p>
                </div>

                <div className="flex flex-col gap-4 max-w-xs">
                  <div className="overflow-hidden">
                    <motion.button
                      variants={itemVariants}
                      className="w-full bg-[#0c0c0c] text-white py-4 font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#0c0c0c]/80 transition-colors"
                    >
                      Send Us A Message
                    </motion.button>
                  </div>
                  <div className="overflow-hidden">
                    <motion.button
                      variants={itemVariants}
                      className="w-full bg-[#0048FF] text-white py-4 font-open-sauce text-sm font-semibold tracking-wide hover:bg-[#0048FF]/80 transition-colors"
                    >
                      Plan A Visit
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Menu Footer */}
            <motion.div
              className="mt-auto px-6 sm:px-10 lg:px-12 py-8 border-t border-[#0c0c0c]/10 flex flex-col sm:flex-row gap-8 justify-between items-start sm:items-center"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Quick Contact - Desktop */}
              <div className="hidden sm:flex flex-col gap-4">
                <div className="overflow-hidden">
                  <motion.p variants={itemVariants} className="font-open-sauce text-[10px] font-semibold uppercase tracking-widest text-[#0c0c0c]/40">
                    Quick Contact
                  </motion.p>
                </div>
                <div className="flex gap-2">
                  {/* LinkedIn */}
                  <div className="overflow-hidden">
                    <motion.a href="#" variants={itemVariants} className="w-10 h-10 border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </motion.a>
                  </div>
                  {/* X (Twitter) */}
                  <div className="overflow-hidden">
                    <motion.a href="#" variants={itemVariants} className="w-10 h-10 border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </motion.a>
                  </div>
                  {/* Instagram */}
                  <div className="overflow-hidden">
                    <motion.a href="#" variants={itemVariants} className="w-10 h-10 border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                    </motion.a>
                  </div>
                  {/* YouTube */}
                  <div className="overflow-hidden">
                    <motion.a href="#" variants={itemVariants} className="w-10 h-10 border border-[#0c0c0c]/20 flex items-center justify-center hover:bg-[#0c0c0c] hover:text-white transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Contact Link - Mobile Only */}
              <div className="flex sm:hidden flex-col gap-4">
                <div className="overflow-hidden">
                  <motion.a href="#" variants={itemVariants} className="font-open-sauce text-xs font-semibold uppercase tracking-widest hover:opacity-70 transition-opacity underline underline-offset-4 decoration-1 decoration-[#0c0c0c]/30">
                    Contact Us
                  </motion.a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="overflow-hidden">
                  <motion.p variants={itemVariants} className="font-open-sauce text-[10px] font-semibold uppercase tracking-widest text-[#0c0c0c]/40">
                    Address
                  </motion.p>
                </div>
                <div className="overflow-hidden">
                  <motion.p variants={itemVariants} className="font-open-sauce text-xs font-medium leading-relaxed">
                    Ground Floor, 100 Windsor St S,<br />Birmingham, B7 4HZ, UK
                  </motion.p>
                </div>
              </div>

              <div className="overflow-hidden">
                <motion.p variants={itemVariants} className="font-open-sauce font-bold text-xl tracking-tighter">
                  CHRIST REVELATION<sup className="text-xs">®</sup>
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
