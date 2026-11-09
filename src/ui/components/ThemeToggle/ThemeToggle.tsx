"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import text from "@/content/text.json";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const nextDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextDark);
    setDark(nextDark);
    try { localStorage.setItem("theme", nextDark ? "dark" : "light"); } catch { /* Storage may be unavailable. */ }
  }

  return (
    <button type="button" role="switch" aria-checked={dark} aria-label={text.navigation.darkTheme} onClick={toggleTheme} className="inline-flex h-11 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2">
      <span aria-hidden="true" className="flex h-8 w-14 items-center rounded-full bg-zinc-200 p-1 dark:bg-zinc-700">
        <span className={`flex size-6 items-center justify-center rounded-full bg-white text-zinc-700 shadow-sm ${dark ? "translate-x-6" : ""}`}>
          {dark ? <Moon size={14} /> : <Sun size={14} />}
        </span>
      </span>
    </button>
  );
}
