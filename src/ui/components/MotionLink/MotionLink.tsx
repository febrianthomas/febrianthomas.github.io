"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

const AnimatedLink = motion.create(Link);

export function MotionLink(props: React.ComponentProps<typeof AnimatedLink>) {
  const reducedMotion = useReducedMotion();
  return <AnimatedLink {...props} whileHover={reducedMotion ? undefined : { y: -2 }} transition={{ duration: 0.14 }} />;
}
