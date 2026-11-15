"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import heroPaused from "../../../../public/images/hero-1.png";
import heroPlaying from "../../../../public/images/hero-2.png";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

export function BackgroundMusic() {
  const { text } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userPaused = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function clearUnlock() {
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
    }

    function resumeOnGesture(event: Event) {
      const current = audioRef.current;
      if (!current || userPaused.current) {
        clearUnlock();
        return;
      }
      if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
      clearUnlock();
      current.play().catch(() => {});
    }

    audio.play().catch(() => {
      if (userPaused.current) return;
      window.addEventListener("pointerdown", resumeOnGesture);
      window.addEventListener("keydown", resumeOnGesture);
    });

    return clearUnlock;
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPaused.current = false;
      audio.play().catch(() => {});
    } else {
      userPaused.current = true;
      audio.pause();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <audio
        ref={audioRef}
        src="/mp3/bg.mp3"
        autoPlay
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? text.navigation.pauseMusic : text.navigation.playMusic}
        title={playing ? text.navigation.pauseMusic : text.navigation.playMusic}
        whileHover={reducedMotion ? undefined : { scale: 1.06 }}
        whileTap={reducedMotion ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
        className="block cursor-pointer rounded-2xl drop-shadow-md focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Image
          src={playing ? heroPlaying : heroPaused}
          alt=""
          className="h-auto w-16 sm:w-20"
          sizes="(min-width: 640px) 80px, 64px"
        />
      </motion.button>
    </div>
  );
}
