import type { Locale } from "./types";

/**
 * Locale-aware price formatter.
 *
 *   formatPrice(2999, "tr") → "₺2.999"
 *   formatPrice(79, "en")   → "$79"
 *   formatPrice(69, "sr")   → "€69"
 *
 * Uses Intl.NumberFormat per locale so the thousands separator,
 * currency-symbol position, and decimal handling are all correct
 * for each language without us hand-rolling them.
 */

const LOCALE_TAG: Record<Locale, string> = {
  tr: "tr-TR",
  en: "en-US",
  sr: "sr-RS",
};

const CURRENCY: Record<Locale, "TRY" | "USD" | "EUR"> = {
  tr: "TRY",
  en: "USD",
  sr: "EUR",
};

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: CURRENCY[locale],
    // Whole-number prices — drop the .00 cents tail.
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}
