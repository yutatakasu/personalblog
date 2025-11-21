"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Locale = "en" | "ja";

const STORAGE_KEY = "atlas-locale";

function getDefaultLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "ja") {
    return stored;
  }

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("ja") ? "ja" : "en";
}

type LanguageContextType = {
  locale: Locale;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const defaultLocale = getDefaultLocale();
    setLocale(defaultLocale);
    setIsHydrated(true);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "en" ? "ja" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, locale);
      document.documentElement.lang = locale;
    }
  }, [locale, isHydrated]);

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within LanguageProvider");
  }
  return context;
}

