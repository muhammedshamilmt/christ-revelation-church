"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Simulate loading progress
    const duration = 2500; // 2.5 seconds total loading time
    const intervalTime = 25;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          // Re-enable scrolling after animation starts
          document.body.style.overflow = "";
        }, 500); // Small pause at 100% before starting split animation
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  if (!showPreloader) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${isLoaded ? "pointer-events-none" : ""}`}>
      {/* Left Half Background */}
      <motion.div
        className="absolute top-0 left-0 w-1/2 h-full bg-[#0c0c0c]"
        initial={{ x: "0%" }}
        animate={{ x: isLoaded ? "-100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
        onAnimationComplete={() => {
          if (isLoaded) {
            setShowPreloader(false);
          }
        }}
      />

      {/* Right Half Background */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-full bg-[#0c0c0c]"
        initial={{ x: "0%" }}
        animate={{ x: isLoaded ? "100%" : "0%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 1.0 }}
      />

      {/* Content */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* Title */}
            <h1 className="text-white text-5xl md:text-7xl lg:text-9xl font-ancola">
              revelation
            </h1>

            {/* Progress Number */}
            <div className="absolute bottom-8 right-12 text-blue-800 text-7xl md:text-8xl font-ancola ">
              {progress}%
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
