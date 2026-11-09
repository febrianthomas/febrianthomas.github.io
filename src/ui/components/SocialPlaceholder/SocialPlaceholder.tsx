"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SocialPlaceholder({ label, title, children, index, className }: { label: string; title: string; children: ReactNode; index: number; className: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span role="img" aria-label={label} title={title} whileHover={reducedMotion ? undefined : { y: -4, rotate: index % 2 ? 8 : -8, scale: 1.12 }} transition={{ type: "spring", duration: 0.3, bounce: 0.2 }} className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${className}`}>
      {children}
    </motion.span>
  );
}
