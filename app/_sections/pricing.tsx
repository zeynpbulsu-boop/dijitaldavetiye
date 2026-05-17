"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { useCurrency } from "@/lib/currency/provider";
import { formatPrice, type CurrencyCode } from "@/lib/currency/format";

/**
 * NUVE pricing — 4 tier model (The Digital Invite paritesi).
 *
 * Save the Date · Davetiye (Popular) · Premium · Doğum Günü.
 * Üstü çizgili indirim + "En çok seçilen" rozeti + ortak feature
 * comparison. Currency context'inden seçilen para birimine göre
 * fiyatlar canlı çevriliyor — base EUR.
 *
 * Dodo ürün ID'leri henüz bağlı değil; CTA'lar "Hazırlamaya Başla"
 * shell linki gönderir (`/order?tier=...`) ve gerçek checkout flow
 * Dodo entegrasyonu tamamlanınca devreye girer.
 */

interface Tier {
  id: "save_the_date" | "experience" | "premium" | "birthday";
  name: string;
  baseEur: number;
  strikeEur?: number;
  popular?: boolean;
  description: string;
  features: string[];
  deliveryNote?: string;
}

const TIERS: Tier[] = [
  {
    id: "save_the_date",
    name: "Save the Date",
    baseEur: 49,
    strikeEur: 100,
    description:
      "Düğün tarihinizi misafirlerinize duyurun — davetiye sonra gelir.",
    features: [
      "Çift ismi + düğün tarihi",
      "Şık dijital kart",
      "Paylaşılabilir link + QR kod",
      "Sınırsız izlenme",
    ],
    deliveryNote: "72 saat içinde teslim",
  },
  {
    id: "experience",
    name: "Davetiye",
    baseEur: 159,
    strikeEur: 325,
    popular: true,
    description:
      "Çoğu çiftin tercihi — RSVP, harita, müzik, galeri ve daha fazlası.",
    features: [
      "5 bilgi bloğu (program, mekan, galeri, hediye, FAQ)",
      "Couple-yüklediği kapak fotosu",
      "Gelişmiş RSVP paneli + Excel indirme",
      "Davetli yönetim listesi",
      "Mühür rengi + zarf animasyonu",
      "Türkçe + 2 dil ekleyebilirsiniz",
    ],
    deliveryNote: "48 saat içinde teslim",
  },
  {
    id: "premium",
    name: "Premium",
    baseEur: 575,
    strikeEur: 920,
    description:
      "Hiçbir şeyden vazgeçmek istemeyen, gerçekten kişisel olanı arayan çiftler için.",
    features: [
      "Sınırsız bilgi bloğu",
      "%100 özel tasarım",
      "Bütün premium efektler dahil",
      "Sınırsız tasarım revizyonu",
      "Foto galerisi + custom hero foto",
      "Hediye / IBAN bloğu + harita",
    ],
    deliveryNote: "5 iş günü içinde teslim",
  },
  {
    id: "birthday",
    name: "Doğum Günü",
    baseEur: 44,
    strikeEur: 100,
    description:
      "Şık bir dijital tebrik — yazıp, mühürleyin, kişiye özel açılış.",
    features: [
      "Kişisel mektubunuz",
      "Doğum günü adı + tarih",
      "Şık dijital kart",
      "Paylaşılabilir link",
    ],
    deliveryNote: "72 saat içinde teslim",
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
      <div className="container-wide max-w-[1280px]">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Fiyatlandırma
          </span>
          <h2
            className="mt-4 font-display text-brand-ink"
            style={{
              fontSize: "clamp(36px, 5.2vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
            }}
          >
            Şeffaf fiyat, gizli ücret yok
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-[1.7] text-brand-mute">
            Tek seferlik ödeme, sınırsız erişim. Etkinliğinizden sonra
            davetiyeniz 2 ay daha online kalır.
          </p>

          {/* Currency toggle */}
          <div className="mt-6 inline-flex gap-1 rounded-full border border-brand-ink/15 bg-paper p-1">
            {(["EUR", "USD", "TRY"] as CurrencyCode[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
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

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TIERS.map((tier) => (
            <li
              key={tier.id}
              className={`relative flex flex-col rounded-md border bg-paper p-6 transition ${
                tier.popular
                  ? "border-brand-cognac shadow-ed-lg sm:scale-[1.02]"
                  : "border-brand-ink/12 shadow-ed-sm hover:border-brand-cognac/50"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-cognac px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-paper">
                  En çok seçilen
                </span>
              )}
              <header className="border-b border-brand-ink/10 pb-5">
                <h3 className="font-display text-[22px] text-brand-ink">
                  {tier.name}
                </h3>
                <p className="mt-2 text-[12px] leading-[1.55] text-brand-mute">
                  {tier.description}
                </p>
                <div className="mt-5 flex items-baseline gap-2">
                  {tier.strikeEur && (
                    <span className="text-[14px] text-brand-mute line-through">
                      {formatPrice(tier.strikeEur, currency)}
                    </span>
                  )}
                  <span
                    className="font-display text-brand-ink"
                    style={{
                      fontSize: "clamp(28px, 3.5vw, 40px)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {formatPrice(tier.baseEur, currency)}
                  </span>
                </div>
                {tier.deliveryNote && (
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-brand-cognac">
                    {tier.deliveryNote}
                  </p>
                )}
              </header>
              <ul className="my-5 flex-1 space-y-2 text-[13px] leading-[1.55] text-brand-ink/80">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-brand-cognac">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/order/${tier.id}`}
                className={`mt-auto inline-flex min-h-[44px] items-center justify-center rounded-full text-[11px] uppercase transition-all ${
                  tier.popular
                    ? "bg-brand-ink text-bg hover:tracking-[0.32em]"
                    : "border border-brand-ink/40 text-brand-ink hover:border-brand-cognac hover:text-brand-cognac"
                }`}
                style={{ letterSpacing: "0.28em", padding: "0.5rem 1.25rem" }}
              >
                Bu paketi seç
              </Link>
            </li>
          ))}
        </motion.ul>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.22em] text-brand-mute">
          Stripe + Dodo Payments · 14 gün para iade garantisi
        </p>
      </div>
    </section>
  );
}
