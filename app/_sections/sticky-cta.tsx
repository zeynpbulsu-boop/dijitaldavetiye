"use client";

/**
 * StickyCta — Pressed Love paritesi. Sayfa boyunca alt orta sabit
 * pill: "Tasarlamaya başla — ÜCRETSİZ · Yayına alınca öde × "
 *
 * - Hero göz hizasında değilken görünmeye başlar (scroll > 300px)
 * - Kullanıcı × ile gizlerse localStorage'da 24 saat saklanır
 * - prefers-reduced-motion: opacity transition only
 */

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "nuve-sticky-cta-dismissed-at";
const HIDE_DURATION_MS = 24 * 60 * 60 * 1000; // 24h

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Daha önce kapatıldı mı, 24h içinde mi?
    try {
      const dismissedAt = parseInt(
        window.localStorage.getItem(STORAGE_KEY) ?? "0",
        10,
      );
      if (Date.now() - dismissedAt < HIDE_DURATION_MS) return;
    } catch {
      /* ignore */
    }

    function onScroll() {
      const y = window.scrollY || window.pageYOffset;
      setVisible(y > 300);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      aria-hidden={!visible}
      className={`fixed left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full bg-brand-ink px-5 py-3 text-paper shadow-ed-xl transition-all duration-500 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)",
      }}
    >
      <Link
        href="#pricing"
        className="text-[12px] font-semibold uppercase tracking-[0.22em] hover:tracking-[0.28em]"
      >
        Tasarlamaya başla — ÜCRETSİZ
      </Link>
      <span aria-hidden className="hidden text-[11px] text-paper/55 sm:inline">
        ·
      </span>
      <span className="hidden text-[11px] uppercase tracking-[0.18em] text-paper/65 sm:inline">
        Yayına alınca öde
      </span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Bu hatırlatmayı kapat"
        className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper/15 text-[14px] text-paper hover:bg-paper/25"
      >
        ×
      </button>
    </div>
  );
}
