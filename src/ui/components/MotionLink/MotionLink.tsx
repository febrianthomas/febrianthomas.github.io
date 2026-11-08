"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

const AnimatedLink = motion.create(Link);

export function MotionLink({ whileHover, ...props }: React.ComponentProps<typeof AnimatedLink>) {
  const reducedMotion = useReducedMotion();
  return <AnimatedLink {...props} whileHover={reducedMotion ? undefined : whileHover ?? { y: -2 }} transition={{ type: "spring", duration: 0.3, bounce: 0.2 }} />;
}
