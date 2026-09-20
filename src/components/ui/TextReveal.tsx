"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
}

export default function TextReveal({ text, className = "" }: TextRevealProps) {
  // Simple check to render <br/> as actual line breaks if we encounter them in the text
  const words = text.split(" ");
  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.015 }
        }
      }}
    >
      {words.map((word, i) => {
        if (word === "<br/>" || word === "<br />") {
          return <br key={i} className="hidden md:block" />;
        }
        return (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-1 pt-1 -mt-1">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "100%", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
                }
              }}
              dangerouslySetInnerHTML={{ __html: word }}
            />
          </span>
        );
      })}
    </motion.p>
  );
}
