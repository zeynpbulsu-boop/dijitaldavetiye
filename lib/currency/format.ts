/**
 * Currency formatting helper — sabit kurlar.
 *
 * EUR base, USD ve TRY çeviri katsayıları sabit. Gerçek FX feed (örn.
 * frankfurter.app) sonra ekleneck; şimdilik çoğu kullanıcı için
 * yeterli (yaklaşık değer, +/-%2 sapmaya tolerans).
 *
 * Kuru güncellemek için aşağıdaki `RATES`'i değiştirmek yeterli.
 */

export type CurrencyCode = "EUR" | "USD" | "TRY";

/* EUR cinsinden 1 birim = X. 2026-05 itibariyle yaklaşık değerler. */
const RATES: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.08,
  TRY: 38,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  EUR: "€",
  USD: "$",
  TRY: "₺",
};

/** EUR base price → seçili currency'ye yuvarlanmış formatı. */
export function formatPrice(eurAmount: number, currency: CurrencyCode): string {
  const converted = eurAmount * RATES[currency];
  /* Bütün price'lar 1 birim altında değil; sade tutmak için yuvarla. */
  const rounded = Math.round(converted);
  if (currency === "TRY") {
    /* TRY'de bin ayracı virgül yerine nokta — tr-TR locale. */
    return `${rounded.toLocaleString("tr-TR")} ${SYMBOLS[currency]}`;
  }
  return `${SYMBOLS[currency]}${rounded}`;
}
