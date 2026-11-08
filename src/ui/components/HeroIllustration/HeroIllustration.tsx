"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import hero from "../../../../public/images/hero-1.png";
import greetingHero from "../../../../public/images/hero-2.png";
import text from "@/content/text.json";

export function HeroIllustration() {
  const [greeting, setGreeting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function sayHi() {
    if (timer.current) clearTimeout(timer.current);
    setGreeting(true);
    timer.current = setTimeout(() => setGreeting(false), 2000);
  }

  return (
    <div className="relative w-full max-w-64 sm:max-w-96">
      <motion.button
        type="button"
        onClick={sayHi}
        aria-label={text.home.greetingButton}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
        transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
        className="block w-full cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <Image src={greeting ? greetingHero : hero} alt="" priority className="h-auto w-full" sizes="(min-width: 640px) 384px, 256px" />
      </motion.button>
      <span role="status" className="pointer-events-none absolute left-3 top-32">
        {greeting && (
          <motion.span
            initial={reducedMotion ? false : { opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative block origin-bottom-right rounded-2xl border-2 border-zinc-900 bg-white px-8 py-4 text-2xl font-medium text-zinc-900 shadow-sm after:absolute after:-right-2 after:bottom-3 after:h-3 after:w-3 after:rotate-45 after:border-t-2 after:border-r-2 after:border-zinc-900 after:bg-white dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-50 dark:after:border-zinc-100 dark:after:bg-zinc-800"
          >
            {text.home.greeting}
          </motion.span>
        )}
      </span>
    </div>
  );
}
