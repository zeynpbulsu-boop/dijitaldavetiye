"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/provider";

function CancelInner() {
  const t = useT();
  const params = useSearchParams();
  const tier = params.get("tier") ?? "";

  return (
    <main className="grain min-h-[70vh] bg-bg py-24 lg:py-32">
      <div className="container-narrow text-center">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-mute">
          — {t.checkout.cancel.eyebrow}
        </span>

        <h1
          className="mt-7 font-display text-brand-ink"
          style={{ fontSize: "clamp(36px, 5.5vw, 64px)", lineHeight: 1.02, letterSpacing: "-0.025em" }}
        >
          {t.checkout.cancel.headline}
        </h1>

        <p
          className="mx-auto mt-6 max-w-[540px] text-brand-ink/75"
          style={{ fontSize: "16.5px", lineHeight: 1.6 }}
        >
          {t.checkout.cancel.body}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href={`/order/blush-reverie${tier ? `?tier=${tier}` : ""}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-cognac px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-cream transition hover:bg-brand-ink"
          >
            {t.checkout.cancel.cta_retry}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-brand-ink/22 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
          >
            {t.checkout.cancel.cta_home}
          </Link>
        </div>

        <p className="mt-12 text-[12px] text-brand-mute">{t.checkout.cancel.footer}</p>
      </div>
    </main>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-bg" />}>
      <CancelInner />
    </Suspense>
  );
}
