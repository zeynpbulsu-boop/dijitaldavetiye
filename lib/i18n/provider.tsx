"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries } from "./dictionaries";
import { LOCALES, type Locale, type Messages } from "./types";

const STORAGE_KEY = "nuve.locale";
const DEFAULT_LOCALE: Locale = "tr";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Messages;
};

const LocaleCtx = createContext<Ctx | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LOCALES as readonly string[]).includes(stored)) {
      return stored as Locale;
    }
    // Light browser-language sniff as fallback
    const browser = navigator.language?.slice(0, 2).toLowerCase();
    if (browser === "en") return "en";
    if (browser === "sr" || browser === "hr" || browser === "bs") return "sr";
  } catch {
    /* localStorage blocked — fall through */
  }
  return DEFAULT_LOCALE;
}

/**
 * Wrap the whole app. SSR renders in DEFAULT_LOCALE (Turkish); after
 * mount the provider rehydrates to the user's stored / sniffed locale
 * and re-renders the tree once. document.documentElement.lang is kept
 * in sync so screen readers and search engines see the active language.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Rehydrate from storage / browser language after mount.
  useEffect(() => {
    const resolved = readStoredLocale();
    if (resolved !== locale) {
      setLocaleState(resolved);
    }
    // First mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html lang="..."> in sync.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale(): { locale: Locale; setLocale: (l: Locale) => void } {
  const ctx = useContext(LocaleCtx);
  if (!ctx) {
    // Defensive fallback — should never happen inside <LocaleProvider>.
    return { locale: DEFAULT_LOCALE, setLocale: () => {} };
  }
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

/**
 * Returns the active dictionary as a typed object.
 * Usage: `const t = useT(); return <h1>{t.hero.headline_l1}</h1>;`
 */
export function useT(): Messages {
  const ctx = useContext(LocaleCtx);
  return ctx?.t ?? dictionaries[DEFAULT_LOCALE];
}
