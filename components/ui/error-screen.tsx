"use client";

import Link from "next/link";
import { useEffect } from "react";
import { log } from "@/lib/log";

/**
 * Markalı segment hata ekranı — route segment'lerinin error.tsx'lerinde
 * kullanılır. Render hatası kök app/error.tsx'e düşmeden, segment'in
 * kendi bağlamında (layout korunarak) şık bir hata gösterir + log'lar.
 */
export function ErrorScreen({
  error,
  reset,
  scope,
  title = "Bir şeyler ters gitti",
  message = "Beklenmedik bir hata oluştu. Tekrar dener misin? Sorun sürerse bize yaz.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  scope: string;
  title?: string;
  message?: string;
}) {
  useEffect(() => {
    log.error(scope, error.message || "render error", error.digest);
  }, [error, scope]);

  return (
    <main
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-bg px-6 text-center"
      role="alert"
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
        — Bir aksilik oldu
      </span>
      <h1
        className="font-display text-brand-ink"
        style={{ fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1.05 }}
      >
        {title}
      </h1>
      <p className="max-w-[440px] text-[15px] leading-[1.65] text-brand-ink/70">
        {message}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-full bg-brand-cognac px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-cream transition hover:bg-brand-ink"
        >
          Tekrar dene
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-brand-ink/22 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
        >
          Ana sayfa
        </Link>
      </div>
    </main>
  );
}
