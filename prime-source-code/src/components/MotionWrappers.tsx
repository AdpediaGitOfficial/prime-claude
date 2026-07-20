"use client";

import React from "react";
import { motion, MotionProps } from "framer-motion";

type Props = React.PropsWithChildren<{
  className?: string;
} & MotionProps & React.HTMLAttributes<HTMLElement>>;

export function MotionSpan({ children, className = "", ...rest }: Props) {
  return (
    <motion.span className={className} {...(rest as MotionProps)}>
      {children}
    </motion.span>
  );
}

export function MotionH2({ children, className = "", ...rest }: Props) {
  return (
    <motion.h2 className={className} {...(rest as MotionProps)}>
      {children}
    </motion.h2>
  );
}

export function MotionP({ children, className = "", ...rest }: Props) {
  return (
    <motion.p className={className} {...(rest as MotionProps)}>
      {children}
    </motion.p>
  );
}

export function MotionDiv({ children, className = "", ...rest }: Props) {
  return (
    <motion.div className={className} {...(rest as MotionProps)}>
      {children}
    </motion.div>
  );
}

// Common animation variants
export const staggerContainer = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function MotionSection({ children, className = "", ...rest }: Props) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      {...(rest as MotionProps)}
    >
      {children}
    </motion.section>
  );
}

export default null;
