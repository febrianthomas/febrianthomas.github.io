"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import heroPaused from "../../../../public/images/mp3-pause.gif";
import heroPlaying from "../../../../public/images/mp3-play.gif";
import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

export function BackgroundMusic() {
  const { text } = useLanguage();
  const [playing, setPlaying] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userPaused = useRef(false);
  const clearUnlockRef = useRef<(() => void) | null>(null);
  const playRef = useRef<() => void>(() => {});
  const pauseRef = useRef<() => void>(() => {});
  const reducedMotion = useReducedMotion();

  const [play, { pause, sound }] = useSound("/mp3/bg.mp3", {
    loop: true,
    html5: true,
    autoplay: true,
    onplay: () => {
      if (userPaused.current) {
        pauseRef.current();
        setPlaying(false);
        return;
      }
      setPlaying(true);
    },
    onpause: () => setPlaying(false),
    onstop: () => setPlaying(false),
    onend: () => setPlaying(false),
    onplayerror: () => {
      setPlaying(false);
      if (userPaused.current || clearUnlockRef.current) return;
      const resume = (event: Event) => {
        if (event.target instanceof Node && buttonRef.current?.contains(event.target)) return;
        clearUnlockRef.current?.();
        if (!userPaused.current) playRef.current();
      };
      window.addEventListener("pointerdown", resume);
      window.addEventListener("keydown", resume);
      clearUnlockRef.current = () => {
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
        clearUnlockRef.current = null;
      };
    },
  });

  playRef.current = play;
  pauseRef.current = pause;

  useEffect(() => {
    return () => {
      clearUnlockRef.current?.();
      sound?.unload();
    };
  }, [sound]);

  function toggle() {
    clearUnlockRef.current?.();
    if (playing) {
      userPaused.current = true;
      setPlaying(false);
      pause();
    } else {
      userPaused.current = false;
      play();
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
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
