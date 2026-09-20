"use client";

import TextReveal from "@/components/ui/TextReveal";
import { motion } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="relative w-full bg-[#FAFAFA] text-[#0c0c0c] min-h-[150vh] flex flex-col justify-between py-24 sm:py-32 px-6 sm:px-10 lg:px-12 overflow-hidden">

      {/* Top Text Block */}
      <div className="w-full max-w-7xl  sm:pl-[10%] lg:pl-[10%]">
        <motion.p
          className="font-open-sauce text-xs sm:text-sm font-medium leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          We operate on a simple philosophy:<br />Love and grace.
        </motion.p>
        <TextReveal
          className="font-open-sauce text-[6vw] sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight font-medium"
          text="Our mission is to bring sinners to Christ, extend a guiding hand to those battling with addiction and alcoholism, and to prepare the church for the second coming of Jesus."
        />
      </div>

      {/* Center Rotating Blur Circle */}
      <div className="flex-1 flex items-center justify-center py-20 sm:py-32 relative">
        <motion.div
          className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Animated blurred background (Aura) */}
          <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[#0048FF] via-blue-400 to-[#0c0c0c] opacity-80 blur-3xl animate-[spin_12s_linear_infinite]" />

          {/* Solid animated core */}
          <div className="absolute w-[65%] h-[65%] rounded-full bg-gradient-to-bl from-[#0048FF] to-blue-500 opacity-90 blur-md animate-[spin_8s_linear_infinite_reverse]" />

          {/* Thin border ring with a dot */}
          <div className="absolute w-[85%] h-[85%] rounded-full border-[1px] border-[#0c0c0c]/10 flex items-center justify-center z-10 animate-[spin_15s_linear_infinite]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#0048FF] rounded-full" />
          </div>

          {/* Static Text overlay in the absolute center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <h3 className="font-open-sauce text-white text-4xl sm:text-5xl font-medium tracking-tight mb-2 drop-shadow-lg">
              100%
            </h3>
            <p className="font-open-sauce text-white/90 text-[10px] sm:text-xs uppercase tracking-widest drop-shadow-lg">
              dedicated
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Text Block */}
      <div className="w-full max-w-7xl sm:pl-[10%] lg:pl-[10%]">
        <motion.p
          className="font-open-sauce text-xs sm:text-sm font-medium leading-relaxed mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          Harnessing faith<br />to connect with our community.
        </motion.p>
        <TextReveal
          className="font-open-sauce text-[6vw] sm:text-4xl lg:text-5xl leading-[1.1] tracking-tight font-medium"
          text="We believe that true transformation happens when we open our hearts to God's love. We don't believe in 'one size fits all' faith. "
        />
      </div>

    </section>
  );
}
