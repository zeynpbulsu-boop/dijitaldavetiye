"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Paper vs Digital — side-by-side cost & feature comparison.
 *
 * Designed to make the €39,99 NUVE price feel like a steal next to
 * what a typical 100-guest paper invitation actually costs. Numbers
 * are conservative market averages, not a strawman.
 */

const PAPER_ITEMS = [
  { label: "Tasarım", cost: 120 },
  { label: "Baskı (100 adet)", cost: 180 },
  { label: "Zarf + kurdela", cost: 32 },
  { label: "Posta + kargo", cost: 64 },
  { label: "RSVP takip", cost: 0, note: "Yok" },
  { label: "Tek dil", cost: 0, note: "Sabit" },
  { label: "Sonradan düzeltme", cost: 38, note: "Yeniden bas" },
];

const PAPER_TOTAL = PAPER_ITEMS.reduce((s, i) => s + i.cost, 0);

const NUVE_INCLUDES = [
  "Bespoke 9 edisyon — istediğin kadar değiştir",
  "Sınırsız davetli, sınırsız RSVP",
  "Sinematik açılış + zarf seremoni",
  "Müzik + galeri + harita + geri sayım",
  "Türkçe + İngilizce + Sırpça otomatik",
  "Düğün gününe kadar sınırsız düzenleme",
  "1 yıl yayında, sonrası arşivde saklı",
];

export function PaperVsDigital() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const savings = PAPER_TOTAL - 40; // round €39.99 → 40 for the savings figure

  return (
    <section
      ref={ref}
      id="comparison"
      className="border-b border-line bg-bg py-24 lg:py-32"
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Karşılaştırma
          </span>
          <h2
            className="mx-auto mt-5 max-w-[680px] font-display text-brand-ink"
            style={{
              fontSize: "clamp(34px, 5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Kağıt davetiye{" "}
            <span className="italic text-brand-cognac">vs</span> NUVE
          </h2>
          <p
            className="mx-auto mt-5 max-w-[520px] text-brand-ink/70"
            style={{ fontSize: "15px", lineHeight: 1.6 }}
          >
            100 davetli için ortalama maliyet. Aynı para ile NUVE'yi 10 yıl
            yayında tutabilirsin.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* PAPER — receipt-style card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[8px] bg-paper px-7 py-9 lg:px-10 lg:py-12"
            style={{
              border: "1px solid rgba(43,30,22,0.10)",
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 8px, rgba(43,30,22,0.04) 8px 16px)",
              backgroundSize: "100% 100%",
            }}
          >
            {/* Receipt header */}
            <div className="mb-5 border-b border-dashed border-brand-ink/20 pb-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-ink/55">
                Kağıt Davetiye
              </p>
              <p
                className="mt-3 font-display"
                style={{
                  color: "rgba(43,30,22,0.85)",
                  fontSize: "28px",
                  lineHeight: 1,
                  letterSpacing: "-0.015em",
                }}
              >
                Geleneksel
              </p>
            </div>

            <ul className="space-y-3 font-mono text-[13px] text-brand-ink/85">
              {PAPER_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-baseline justify-between border-b border-dotted border-brand-ink/12 pb-2"
                >
                  <span>{item.label}</span>
                  <span className="tabular-nums">
                    {item.note ? (
                      <span className="text-brand-ink/55">{item.note}</span>
                    ) : (
                      `€${item.cost}`
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-baseline justify-between border-t-2 border-brand-ink/30 pt-4 font-mono">
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-ink">
                Toplam
              </span>
              <span
                className="font-display tabular-nums text-brand-ink"
                style={{ fontSize: "38px", lineHeight: 1, letterSpacing: "-0.025em" }}
              >
                €{PAPER_TOTAL}
              </span>
            </div>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-brand-ink/55">
              Tek seferlik · Tekrar baskı ek ücret · RSVP yok
            </p>
          </motion.div>

          {/* NUVE — premium card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[8px] bg-brand-ink px-7 py-9 text-brand-cream lg:px-10 lg:py-12"
            style={{
              boxShadow: "0 24px 60px -28px rgba(43,30,22,0.55)",
            }}
          >
            {/* Savings badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
              animate={inView ? { opacity: 1, scale: 1, rotate: -6 } : {}}
              transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-3 top-6 inline-flex items-center gap-1.5 rounded-full bg-brand-cognac px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-cream shadow-[0_8px_20px_rgba(140,90,60,0.35)]"
            >
              <span aria-hidden className="block h-1 w-1 rounded-full bg-brand-cream/80" />
              €{savings} tasarruf
            </motion.span>

            {/* Header */}
            <div className="mb-5 border-b border-dashed border-brand-cream/25 pb-4 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-cream/65">
                NUVE Davetiye
              </p>
              <p
                className="mt-3 font-display italic"
                style={{
                  color: "rgba(245,232,217,0.95)",
                  fontSize: "28px",
                  lineHeight: 1,
                  letterSpacing: "-0.015em",
                }}
              >
                Dijital
              </p>
            </div>

            <ul className="space-y-3.5 text-[14px]" style={{ lineHeight: 1.5 }}>
              {NUVE_INCLUDES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-1 shrink-0"
                    style={{ color: "#E8C8A7" }}
                    aria-hidden
                  >
                    <path
                      d="M4 12.5L9 17.5L20 6.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-brand-cream/90">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-baseline justify-between border-t-2 border-brand-cream/35 pt-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-cream/85">
                Toplam
              </span>
              <span
                className="font-display tabular-nums"
                style={{
                  fontSize: "44px",
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  color: "#E8C8A7",
                }}
              >
                €39,99
              </span>
            </div>

            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.22em] text-brand-cream/65">
              Tek seferlik · 1 yıl yayın · Sınırsız düzenleme · KDV dahil
            </p>
          </motion.div>
        </div>

        {/* Below-card reassurance */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-10 text-center text-[12px] uppercase tracking-[0.18em] text-brand-mute"
        >
          Aynı niyet, %91 daha az maliyet ·
          <span className="ml-1 text-brand-cognac">7 gün koşulsuz iade</span>
        </motion.p>
      </div>
    </section>
  );
}
