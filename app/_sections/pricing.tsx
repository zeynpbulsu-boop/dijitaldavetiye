"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useCurrency } from "@/lib/currency/provider";
import { formatPrice, type CurrencyCode } from "@/lib/currency/format";

/**
 * NUVE pricing — TEK FİYAT modeli.
 *
 * Her etkinlik tipi (düğün, doğum günü, baby shower, nişan, save the date,
 * mezuniyet, açılış, kına, sünnet…) tek fiyat: €39.99.
 *
 * Tier (Save the Date / Davetiye / Premium / Doğum Günü) modeli kaldırıldı —
 * tek fiyat + bütün özellikler dahil. AI özel illüstrasyon, sınırsız bilgi
 * bloğu, RSVP, müzik, harita… hiç ek ücret yok.
 */

const BASE_EUR = 39.99;
const STRIKE_EUR = 89;

const EVENT_TYPES = [
  "Düğün",
  "Save the Date",
  "Nişan",
  "Doğum Günü",
  "Baby Shower",
  "Mezuniyet",
  "Kına",
  "Sünnet",
  "Açılış",
  "Yıl Dönümü",
];

const FEATURES: Array<{ icon: string; title: string; body: string }> = [
  {
    icon: "✨",
    title: "Mekânına özel AI illüstrasyon",
    body: "Köy evi, deniz kenarı, taş bahçe — yaz, 15 saniyede üretelim. Sınırsız varyant.",
  },
  {
    icon: "✦",
    title: "Bütün premium efektler",
    body: "Mühür açılışı, kaligrafi isim, müzik, sayaç, scratch-reveal, slot machine STD.",
  },
  {
    icon: "✉",
    title: "Sınırsız RSVP + davetli listesi",
    body: "Excel indirme, çoklu dil, otomatik onay e-postası, koltuk yönetimi.",
  },
  {
    icon: "❀",
    title: "Foto galerisi + custom hero",
    body: "Kendi fotoğrafını yükle veya AI ile üret. 9:16, 16:9, sınırsız değişim.",
  },
  {
    icon: "✿",
    title: "Harita + hediye / IBAN bloğu",
    body: "OpenStreetMap iframe + Google Maps deep link, hediye listesi, otel önerileri.",
  },
  {
    icon: "♪",
    title: "Çoklu dil (TR + 2 dil)",
    body: "Türkçe, İngilizce, Sırpça, Arapça… misafirlerin dilini seç.",
  },
];

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const { currency, setCurrency } = useCurrency();

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative border-b border-line bg-bg-alt py-24 lg:py-36"
    >
      <div className="container-wide max-w-[1180px]">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Tek fiyat, her etkinlik
          </span>
          <h2
            className="mt-4 font-display text-brand-ink"
            style={{
              fontSize: "clamp(36px, 5.2vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
            }}
          >
            {formatPrice(BASE_EUR, currency)} · hepsi dahil
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-[1.7] text-brand-mute">
            Düğün, doğum günü, baby shower — etkinlik tipi farketmez. Tek
            seferlik ödeme, sınırsız erişim. Etkinlikten sonra davetiyen 2 ay
            daha online kalır.
          </p>

          {/* Currency toggle */}
          <div className="mt-6 inline-flex gap-1 rounded-full border border-brand-ink/15 bg-paper p-1">
            {(["EUR", "USD", "TRY"] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                aria-pressed={currency === c}
                aria-label={`${c} para birimi`}
                className={`rounded-full px-4 py-1 text-[11px] uppercase tracking-[0.2em] transition ${
                  currency === c
                    ? "bg-brand-ink text-bg"
                    : "text-brand-mute hover:text-brand-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.header>

        {/* Single hero pricing card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[920px]"
        >
          <div
            className="relative overflow-hidden rounded-[14px] border border-brand-cognac/40 bg-paper p-8 shadow-[0_28px_70px_-24px_rgba(140,90,60,0.35)] sm:p-12"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(212, 175, 138, 0.07) 0%, rgba(255,255,255,0) 35%), linear-gradient(180deg, rgba(255,255,255,0) 70%, rgba(212, 175, 138, 0.09) 100%)",
            }}
          >
            {/* Gold glow accent */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 0%, rgba(212, 175, 138, 0.16) 0%, transparent 55%)",
                mixBlendMode: "multiply",
              }}
            />
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-cognac px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-paper shadow-[0_4px_12px_rgba(140,90,60,0.4)]">
              ★ Hepsi dahil
            </span>

            {/* Price block */}
            <div className="relative flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-center sm:gap-5">
              <span className="text-[18px] text-brand-mute line-through sm:text-[20px]">
                {formatPrice(STRIKE_EUR, currency)}
              </span>
              <span
                className="font-display text-brand-ink"
                style={{
                  fontSize: "clamp(56px, 8vw, 96px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {formatPrice(BASE_EUR, currency)}
              </span>
              <span className="text-[12px] uppercase tracking-[0.28em] text-brand-cognac sm:ml-2 sm:pb-3">
                tek seferlik
              </span>
            </div>

            {/* Event-type chips — sosyal kanıt: her etkinlik */}
            <div className="relative mt-8 flex flex-wrap justify-center gap-2">
              {EVENT_TYPES.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-brand-ink/20 bg-paper/60 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.18em] text-brand-ink/80"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="relative mx-auto mt-6 max-w-[520px] text-center text-[13px] leading-[1.65] text-brand-mute">
              Etkinlik tipi farketmez — bütün özellikler her pakette dahil.
              Premium ayrımı yok, gizli ücret yok.
            </p>

            {/* Feature grid — 6 madde 2 sütun */}
            <ul className="relative mt-10 grid gap-x-8 gap-y-5 border-t border-brand-ink/10 pt-8 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[2px] text-[16px] text-brand-cognac"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.16em] text-brand-ink">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] leading-[1.55] text-brand-mute">
                      {f.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="relative mt-10 flex flex-col items-center gap-3">
              <Link
                href="/order/geceyarisi"
                data-cursor="magnetic"
                data-cursor-label="Tasarla"
                aria-label="Davetiyeni tasarlamaya başla"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brand-ink px-9 text-[12px] font-medium uppercase text-bg shadow-[0_18px_44px_-14px_rgba(43,30,22,0.35)] transition-all hover:tracking-[0.32em]"
                style={{ letterSpacing: "0.26em" }}
              >
                Tasarlamaya başla
              </Link>
              <p className="text-[10px] uppercase tracking-[0.24em] text-brand-mute">
                14 gün para iade · 48 saatte teslim
              </p>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.22em] text-brand-mute">
          Stripe + Dodo Payments · 14 gün para iade garantisi
        </p>
      </div>
    </section>
  );
}
