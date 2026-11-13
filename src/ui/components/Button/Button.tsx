"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

export function Button({
  className = "",
  type = "button",
  ...props
}: ComponentProps<typeof motion.button>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      type={type}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.14 }}
      className={`inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 dark:focus-visible:outline-zinc-100 ${className}`}
      {...props}
    />
  );
}
