"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "@/content/en.json";
import id from "@/content/id.json";

type Language = "en" | "id";
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; text: typeof en };
const LanguageContext = createContext<LanguageContextValue>({ language: "en", setLanguage: () => {}, text: en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("language");
      if (saved === "en" || saved === "id") setLanguageState(saved);
    } catch { /* Storage may be unavailable. */ }
  }, []);

  useEffect(() => { document.documentElement.lang = language; }, [language]);

  function setLanguage(next: Language) {
    setLanguageState(next);
    try { localStorage.setItem("language", next); } catch { /* Storage may be unavailable. */ }
  }

  return <LanguageContext.Provider value={{ language, setLanguage, text: language === "id" ? id : en }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
