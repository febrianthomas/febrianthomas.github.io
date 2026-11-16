"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect } from "react";
import { BACKGROUND_SHAPE_COUNT, BACKGROUND_SHAPE_PATHS } from "@/constants/background-shapes";

export function BackgroundShapes() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 100, damping: 25 });
  const y = useSpring(pointerY, { stiffness: 100, damping: 25 });

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    function reset() { pointerX.set(0); pointerY.set(0); }
    function move(event: PointerEvent) {
      if (!preference.matches || event.pointerType !== "mouse") return;
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 70);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 70);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("blur", reset);
    preference.addEventListener("change", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", reset);
      preference.removeEventListener("change", reset);
    };
  }, [pointerX, pointerY]);

  return (
    <div className="background-shapes" aria-hidden="true">
      <motion.div className="background-shapes-layer" style={{ x, y }}>
        {Array.from({ length: BACKGROUND_SHAPE_COUNT }, (_, index) => (
          <motion.span
            key={index}
            initial={{ transform: BACKGROUND_SHAPE_PATHS[index % 3][0] }}
            animate={reducedMotion ? { transform: "none" } : { transform: BACKGROUND_SHAPE_PATHS[index % 3] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 12 + (index % 9), delay: -(index % 10), ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
