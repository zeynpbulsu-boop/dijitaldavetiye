"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/i18n/format-price";
import { useT, useLocale } from "@/lib/i18n/provider";

// Slug + featured-tier flag stay constant across locales; prices live
// in the per-locale dictionary so TR shows ₺, EN shows $, SR shows €.
const tierMeta = [
  { slug: "sade", featured: false },
  { slug: "klasik", featured: true },
  { slug: "premium", featured: false },
];

export function Pricing() {
  const t = useT();
  const { locale } = useLocale();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section ref={ref} id="pricing" className="border-b border-line bg-bg-alt/40 py-24 lg:py-36">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 grid grid-cols-12 items-end gap-x-6 gap-y-8 border-b border-line pb-8 lg:mb-20"
        >
          <div className="col-span-12 lg:col-span-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.pricing.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{ fontSize: "clamp(40px, 6vw, 84px)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
            >
              {t.pricing.headline_prefix}
              <br className="hidden sm:inline" />
              <span className="italic text-brand-cognac">{t.pricing.headline_accent}</span>
              {t.pricing.headline_period}
            </h2>
          </div>
          <p
            className="col-span-12 max-w-[360px] text-brand-ink/70 lg:col-span-4 lg:justify-self-end lg:text-right"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
          >
            {t.pricing.intro}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7">
          {tierMeta.map((meta, i) => {
            const tier = t.pricing.tiers[i];
            return (
              <motion.article
                key={meta.slug}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1.0, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col rounded-[8px] bg-paper p-7 lg:p-9 ${
                  meta.featured
                    ? "border-2 border-brand-cognac shadow-[0_24px_50px_-20px_rgba(140,90,60,0.35)] lg:-translate-y-3"
                    : "border border-brand-ink/12"
                }`}
              >
                {meta.featured && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-cognac px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-cream shadow-[0_4px_10px_rgba(140,90,60,0.4)]">
                    <span aria-hidden className="block h-1 w-1 rounded-full bg-brand-cream/80" />
                    {t.pricing.badge_popular}
                  </span>
                )}

                <h3 className="font-display text-brand-ink" style={{ fontSize: "32px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                  {tier.name}
                </h3>
                <p className="mt-2 text-brand-ink/65" style={{ fontSize: "14.5px", lineHeight: 1.5 }}>
                  {tier.summary}
                </p>

                <div className="mt-7 flex items-baseline gap-2 border-b border-brand-ink/12 pb-6">
                  <span className="font-display text-brand-ink" style={{ fontSize: "54px", lineHeight: 1, letterSpacing: "-0.025em" }}>
                    {formatPrice(tier.price, locale)}
                  </span>
                </div>
                <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] text-brand-mute">
                  {tier.note}
                </p>

                <ul className="my-8 space-y-3.5 text-brand-ink/80" style={{ fontSize: "14.5px" }}>
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-1 shrink-0 text-brand-cognac" aria-hidden>
                        <path d="M4 12.5L9 17.5L20 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/order/blush-reverie?tier=${meta.slug}`}
                  className={`mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] transition-all duration-300 ${
                    meta.featured
                      ? "bg-brand-cognac text-brand-cream hover:bg-brand-ink hover:shadow-[0_6px_18px_rgba(43,30,22,0.22)]"
                      : "border border-brand-ink/22 text-brand-ink hover:border-brand-cognac hover:bg-brand-cream-alt hover:text-brand-cognac"
                  }`}
                >
                  {t.pricing.cta_template.replace("{name}", tier.name)}
                  <svg width="13" height="9" viewBox="0 0 14 10" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-12 text-center text-[12px] uppercase tracking-[0.18em] text-brand-mute">
          {t.pricing.reassurance}
        </p>
      </div>
    </section>
  );
}
