"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What time are your Sunday services?",
    answer: "Our main Sunday service begins at 8:30 AM and usually concludes around 11:30 AM. We recommend arriving 15 minutes early to find parking and a comfortable seat."
  },
  {
    question: "Do you have programs for children?",
    answer: "Yes, we have a vibrant children's ministry that runs concurrently with our main service. Children are taught age-appropriate biblical lessons in a safe, fun, and engaging environment."
  },
  {
    question: "How can I join a ministry or volunteer?",
    answer: "We love when our members get involved! You can join a ministry by visiting the 'Get Involved' section on our website, or by speaking with one of our pastoral team members after the Sunday service."
  },
  {
    question: "Is there a mid-week service?",
    answer: "Yes, we host a powerful mid-week prayer and Bible study session every Wednesday evening from 6:30 PM to 8:30 PM. Everyone is welcome to attend."
  },
  {
    question: "Do you offer pastoral counseling?",
    answer: "Absolutely. Our pastoral team is available for spiritual guidance, marriage counseling, and personal prayer. Please contact us via the Contact page to schedule an appointment."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#FAFAFA] text-[#0c0c0c] py-24 sm:py-32 px-6 sm:px-10 lg:px-12">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side: Title */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <h2 className="font-open-sauce text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
            Common<br />Questions
          </h2>
          <p className="font-open-sauce text-[#0c0c0c]/70 text-base sm:text-lg font-light leading-relaxed max-w-sm">
            Everything you need to know about our church, services, and community. Can't find an answer? Feel free to reach out.
          </p>
        </div>

        {/* Right Side: Accordion */}
        <div className="w-full lg:w-2/3 flex flex-col border-t border-[#0c0c0c]/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index} 
                className="border-b border-[#0c0c0c]/10 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-8 text-left group transition-colors"
                >
                  <span className={`font-open-sauce text-xl sm:text-2xl font-medium tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#0048FF]' : 'text-[#0c0c0c] group-hover:text-[#0c0c0c]/80'}`}>
                    {faq.question}
                  </span>
                  
                  {/* Icon */}
                  <div className="ml-6 flex-shrink-0 relative w-6 h-6 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`absolute w-full h-[2px] ${isOpen ? 'bg-[#0048FF]' : 'bg-[#0c0c0c]'}`}
                    />
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 90 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`absolute w-full h-[2px] ${isOpen ? 'bg-[#0048FF]' : 'bg-[#0c0c0c]'}`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="pb-8 pr-12 font-open-sauce text-base sm:text-lg text-[#0c0c0c]/70 font-light leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
