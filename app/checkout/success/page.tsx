"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/provider";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const TIER_LABEL: Record<string, string> = {
  sade: "Sade",
  klasik: "Klasik",
  premium: "Premium",
};

function SuccessInner() {
  const t = useT();
  const params = useSearchParams();
  const tier = params.get("tier") ?? "";
  const paymentId = params.get("payment_id") ?? "";
  const status = params.get("status") ?? "";
  const tierLabel = TIER_LABEL[tier] ?? "";
  const isPending = status === "processing";

  return (
    <main className="grain min-h-[80vh] bg-bg py-24 lg:py-32">
      <div className="container-narrow text-center">
        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
          — {isPending ? t.checkout.success.pending_eyebrow : t.checkout.success.success_eyebrow}
        </span>

        <h1
          className="mt-7 font-display text-brand-ink"
          style={{ fontSize: "clamp(42px, 6.5vw, 84px)", lineHeight: 1.0, letterSpacing: "-0.025em" }}
        >
          {t.checkout.success.headline_main}{" "}
          <span className="italic text-brand-cognac">{t.checkout.success.headline_accent}</span>
        </h1>

        <p
          className="mx-auto mt-7 max-w-[580px] text-brand-ink/75"
          style={{ fontSize: "17px", lineHeight: 1.65 }}
        >
          {tierLabel && (
            <>
              <span className="font-medium text-brand-ink">{tierLabel}</span>
              {t.checkout.success.body_prefix}
            </>
          )}
          {t.checkout.success.body_main}
        </p>

        {paymentId && (
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-brand-mute">
            {t.checkout.success.payment_ref} {paymentId}
          </p>
        )}

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-brand-ink/22 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-ink transition hover:border-brand-cognac hover:bg-brand-cream-alt hover:text-brand-cognac"
          >
            {t.checkout.success.cta_home}
          </Link>
          <Link
            href="/order/blush-reverie"
            className="inline-flex items-center gap-2 rounded-full bg-brand-cognac px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-cream transition hover:bg-brand-ink"
          >
            {t.checkout.success.cta_editor}
          </Link>
        </div>

        <hr className="mx-auto mt-16 max-w-[200px] border-brand-ink/12" />

        <p className="mt-6 text-[12px] text-brand-mute">{t.checkout.success.footer}</p>
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] bg-bg" />}>
      <SuccessInner />
    </Suspense>
  );
}
