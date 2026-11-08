"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

export function FadeSection({ children, className }: { children: ReactNode; className: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15, initial: true });
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={false}
      animate={{ opacity: reducedMotion || inView ? 1 : 0 }}
      transition={{ duration: 3, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.section>
  );
}
