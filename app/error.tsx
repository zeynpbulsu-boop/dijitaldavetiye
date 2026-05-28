"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * app/error.tsx — Next.js root error boundary.
 *
 * Runtime exception olursa (server veya client) kullanıcı bunu
 * görür. Sentry/log entegrasyonu için useEffect içinde reportable.
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    /* TODO: integrate with Sentry / Logflare here. */
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <main className="min-h-[80vh] bg-bg py-24 lg:py-32">
      <div className="container-narrow text-center">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
          — Bir aksilik oldu
        </span>

        <h1
          className="mt-7 font-display text-brand-ink"
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
          }}
        >
          Sayfa{" "}
          <span className="italic text-brand-cognac">yüklenemedi</span>.
        </h1>

        <p
          className="mx-auto mt-6 max-w-[480px] text-brand-ink/70"
          style={{ fontSize: "16.5px", lineHeight: 1.65 }}
        >
          Beklenmedik bir hata aldık. Tekrar dene; sorun sürerse{" "}
          <a
            href="mailto:info@nuve.app"
            className="text-brand-cognac underline decoration-brand-cognac/40 underline-offset-4 transition hover:decoration-brand-cognac"
          >
            info@nuve.app
          </a>{" "}
          adresine yaz, aynı gün dönelim.
        </p>

        {error.digest && (
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-brand-mute">
            Hata kodu: {error.digest}
          </p>
        )}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-brand-cognac px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-cream transition hover:bg-brand-ink"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-brand-ink/22 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
