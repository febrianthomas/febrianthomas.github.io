"use client";

import { useLanguage } from "@/ui/components/LanguageProvider/LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage, text } = useLanguage();
  return (
    <button type="button" role="switch" aria-checked={language === "id"} onClick={() => setLanguage(language === "en" ? "id" : "en")} aria-label={text.navigation.changeLanguage} className="inline-flex min-h-11 items-center rounded-full text-sm font-normal focus-visible:outline-2 focus-visible:outline-offset-2">
      <span aria-hidden="true" className="flex rounded-full bg-zinc-200 p-1 dark:bg-zinc-700">
        <span className={`rounded-full px-2 py-1 ${language === "en" ? "bg-white font-bold text-zinc-900 dark:bg-zinc-100" : "text-zinc-700 dark:text-zinc-100"}`}>EN</span>
        <span className={`rounded-full px-2 py-1 ${language === "id" ? "bg-white font-bold text-zinc-900 dark:bg-zinc-100" : "text-zinc-700 dark:text-zinc-100"}`}>ID</span>
      </span>
    </button>
  );
}
