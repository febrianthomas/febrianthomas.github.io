"use client";

import { useEffect, useRef } from "react";
import useSound from "use-sound";

export function ClickSound() {
  const [play, { sound }] = useSound("/mp3/click.wav");
  const playRef = useRef(play);
  playRef.current = play;

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.target instanceof Element && event.target.closest(":disabled, [aria-disabled='true']")) return;
      playRef.current();
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => () => { sound?.unload(); }, [sound]);

  return null;
}
