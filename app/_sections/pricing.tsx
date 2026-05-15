"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/provider";

/**
 * NUVE pricing section — flat-rate model (Faz 20).
 *
 * One product, one price: €39.99 per invitation, regardless of which
 * edition the couple picks. The old three-card hierarchy is replaced
 * with a single hero card that frames the flat-rate as the headline.
 *
 * Copy is read from t.pricing — we ignore the legacy `t.pricing.tiers[]`
 * structure and roll our own bullet list inline.
 */

const FLAT_FEATURES = [
  "14 edisyon arasından seçim — Blush Reverie, Bordeaux, Olive Grove, Magnolia, Lavender, Black Ink ve dahası",
  "Zarf seremoni + müzik + RSVP + galeri + harita — hepsi dahil",
  "1 yıl boyunca canlı, sınırsız davetli sayısı, sınırsız RSVP",
  "Mobil-öncelikli — TikTok / WhatsApp / Instagram'da tek tıkla paylaşılır",
  "Türkçe + İngilizce + Sırpça çoklu dil desteği",
  "Admin paneliyle RSVP'leri canlı izle ve CSV indir",
  "30 gün para iade garantisi — beğenmezsen tek mail",
];

export function Pricing() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      id="pricing"
      className="border-b border-line bg-bg-alt/40 py-24 lg:py-36"
    >
      <div className="container-wide">
        {/* Header */}
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
              style={{
                fontSize: "clamp(40px, 6vw, 84px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              {t.pricing.headline_prefix}
              <br className="hidden sm:inline" />
              <span className="italic text-brand-cognac">
                {t.pricing.headline_accent}
              </span>
              {t.pricing.headline_period}
            </h2>
          </div>
          <p
            className="col-span-12 max-w-[360px] text-brand-ink/70 lg:col-span-4 lg:justify-self-end lg:text-right"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
          >
            Bir fiyat, bir paket, hiç matematik yok. Hangi edisyonu beğenirsen
            beğen, davetiyen €39,99 — KDV ve banka komisyonu dahil.
          </p>
        </motion.div>

        {/* Single flat-rate hero card */}
        <motion.article
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.05, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-[920px] overflow-hidden rounded-[14px] border-2 border-brand-cognac/60 bg-paper p-9 shadow-[0_36px_80px_-30px_rgba(140,90,60,0.4)] lg:p-14"
        >
          {/* Soft aura behind the price */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 78% 22%, rgba(176,122,92,0.10), transparent 55%)",
            }}
          />

          {/* Featured badge */}
          <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-cognac px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-cream shadow-[0_4px_10px_rgba(140,90,60,0.4)]">
            <span
              aria-hidden
              className="block h-1 w-1 rounded-full bg-brand-cream/80"
            />
            tek paket — şeffaf fiyat
          </span>

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left — title + price */}
            <div className="lg:col-span-5">
              <h3
                className="font-display text-brand-ink"
                style={{
                  fontSize: "42px",
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                }}
              >
                NUVE Davetiye
              </h3>
              <p
                className="mt-3 text-brand-ink/65"
                style={{ fontSize: "15.5px", lineHeight: 1.55 }}
              >
                Her edisyon. Tek fiyat. Bir yıl canlı.
              </p>

              <div className="mt-8 flex items-baseline gap-2 border-b border-brand-ink/12 pb-7">
                <span
                  className="font-display text-brand-ink"
                  style={{
                    fontSize: "84px",
                    lineHeight: 0.9,
                    letterSpacing: "-0.035em",
                  }}
                >
                  €39
                </span>
                <span
                  className="font-display text-brand-ink/70"
                  style={{ fontSize: "32px", lineHeight: 1, letterSpacing: "-0.02em" }}
                >
                  ,99
                </span>
              </div>
              <p className="mt-3 text-[10.5px] uppercase tracking-[0.22em] text-brand-mute">
                Tek seferlik · 1 yıl yayın · KDV dahil
              </p>

              <Link
                href="/templates"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-cognac px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-cream transition-all duration-300 hover:bg-brand-ink hover:shadow-[0_18px_40px_-12px_rgba(43,30,22,0.45)] lg:w-auto"
              >
                Tasarımları gör — başla
                <svg
                  width="13"
                  height="9"
                  viewBox="0 0 14 10"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 5H13M13 5L9 1M13 5L9 9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            {/* Right — feature list */}
            <ul
              className="space-y-4 text-brand-ink/85 lg:col-span-7"
              style={{ fontSize: "15.5px", lineHeight: 1.55 }}
            >
              {FLAT_FEATURES.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.45 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-start gap-3.5"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-1 shrink-0 text-brand-cognac"
                    aria-hidden
                  >
                    <path
                      d="M4 12.5L9 17.5L20 6.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{f}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.article>

        <p className="mt-12 text-center text-[12px] uppercase tracking-[0.18em] text-brand-mute">
          {t.pricing.reassurance}
        </p>
      </div>
    </section>
  );
}
