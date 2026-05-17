"use client";

/**
 * CurrencyProvider — global para birimi context'i.
 *
 * Default: EUR. Kullanıcı seçince localStorage'da `nuve-currency`
 * altında saklanır; sonraki ziyarette restore edilir. Bu sayfayı
 * sarmaladığım layout.tsx içinde provider mount edilir, useCurrency()
 * her component'ten okur.
 */

import { createContext, useContext, useEffect, useState } from "react";
import type { CurrencyCode } from "./format";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "EUR",
  setCurrency: () => {},
});

const STORAGE_KEY = "nuve-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "EUR" || stored === "USD" || stored === "TRY") {
        setCurrencyState(stored);
      }
    } catch {
      /* localStorage izni yoksa default EUR. */
    }
  }, []);

  function setCurrency(c: CurrencyCode) {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* sessizce yut. */
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
