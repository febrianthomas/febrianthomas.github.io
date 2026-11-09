"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function PostCard({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { scale: 1.03 }}
      transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
      className="surface-shadow relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900"
    >
      {children}
    </motion.article>
  );
}
