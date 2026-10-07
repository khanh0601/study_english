"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, TranslationKey, translations } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => translations.en[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("studylang") as Language | null;
    if (saved && (saved === "en" || saved === "vi")) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("studylang", lang);
      document.cookie = `studylang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
    }
  }

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const dict = translations[language] || translations.en;
    let str = dict[key] || translations.en[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }

    return str;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
