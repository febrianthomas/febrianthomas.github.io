"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function SocialPlaceholder({ label, title, children, index }: { label: string; title: string; children: ReactNode; index: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span role="img" aria-label={label} title={title} whileHover={reducedMotion ? undefined : { y: -4, rotate: index % 2 ? 8 : -8, scale: 1.12 }} transition={{ type: "spring", duration: 0.3, bounce: 0.2 }} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
      {children}
    </motion.span>
  );
}
