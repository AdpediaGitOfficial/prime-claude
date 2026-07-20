"use client";

import { motion } from "framer-motion";
import React from "react";

type Props = {
  lines: string | string[];
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  stagger?: number;
};

const container = (stagger: number) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

const wordVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedText({ lines, as = "div", className = "", delay = 0, stagger = 0.06 }: Props) {
  const Tag = as as any;
  const normalized = Array.isArray(lines) ? lines : String(lines).split("\n");

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={container(stagger)}
      transition={{ delay }}
    >
      {normalized.map((line, i) => (
        <Tag key={i} className="leading-tight block">
          {line.split(" ").map((word, wi) => (
            <motion.span
              key={wi}
              className="inline-block mr-2 whitespace-nowrap"
              variants={wordVariants}
            >
              {word}
            </motion.span>
          ))}
        </Tag>
      ))}
    </motion.div>
  );
}
