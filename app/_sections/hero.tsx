"use client";

/**
 * Hero — B2C clean (Pressed Love + The Digital Invite paritesi).
 *
 * Önceki hero markaya özel lirik bir cümleydi ("Bir davet niyetle
 * yazılır"). Kullanıcı geri bildirimi: rakiplerin B2C clean tarzını
 * istiyor — direkt fayda + güven + iki CTA + dil sayısı.
 *
 * Yapı:
 *   PREMIUM DIJITAL DÜĞÜN DAVETIYESI (eyebrow)
 *   [5⭐ pill] 500+ mutlu çift  See reviews →
 *   H1: Dijital Düğün Davetiyesi & Save the Date
 *   Subhead: 48 saat içinde teslim, RSVP yönetimi, harita, müzik.
 *   [Davetiyeni Tasarla] [Demoyu Gör]
 *   "Tasarlaması ücretsiz · Yayına almak için tek seferlik ödeme"
 *   16+ dil pill
 *   Sağ taraf: phone mockup — Aethel davetiye snapshot
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const LANGUAGES = ["TR", "EN", "DE", "FR", "IT", "ES", "SR", "AR", "RU"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg pb-20 pt-32 sm:pt-40 lg:pt-48">
      <div className="container-wide max-w-[1320px]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,1fr] lg:gap-16">
          {/* SOL — copy + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Premium Dijital Düğün Davetiyesi
            </span>

            {/* Trust pill */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-brand-ink/15 bg-paper px-5 py-2">
              <span className="font-display text-[15px] text-brand-cognac">
                5
              </span>
              <span aria-label="5 yıldız" className="text-[12px] text-brand-cognac">
                ★★★★★
              </span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-brand-mute">
                500+ mutlu çift
              </span>
              <Link
                href="#yorumlar"
                className="text-[11px] uppercase tracking-[0.18em] text-brand-ink hover:text-brand-cognac"
              >
                Yorumları gör →
              </Link>
            </div>

            <h1
              className="mt-7 font-display text-brand-ink"
              style={{
                fontSize: "clamp(40px, 6.5vw, 88px)",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              Dijital Düğün Davetiyesi{" "}
              <span className="italic text-brand-cognac">&amp;</span>{" "}
              Save the Date
            </h1>

            <p className="mt-6 max-w-[540px] text-[16px] leading-[1.6] text-brand-mute lg:text-[17px]">
              Şık dijital düğün davetiyesi — RSVP yönetimi, interaktif
              harita, müzik, geri sayım. Tek bir bağlantı, anında
              gönderim, gerçek zamanlı yanıtlar.{" "}
              <strong className="text-brand-ink">
                48 saat içinde yayında
              </strong>
              .
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#pricing"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brand-ink px-7 text-[12px] uppercase tracking-[0.22em] text-bg transition-all hover:tracking-[0.28em]"
              >
                Davetiyeni tasarla →
              </Link>
              <Link
                href="/dev-preview/aethel"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-brand-ink/40 px-7 text-[12px] uppercase tracking-[0.22em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
              >
                Demoyu gör
              </Link>
            </div>

            <p className="mt-4 text-[12px] uppercase tracking-[0.18em] text-brand-mute">
              Tasarlamak ücretsiz · Tek seferlik ödeme · Aboneliksiz
            </p>

            {/* Dil pill rail */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.28em] text-brand-mute">
                Her dilde:
              </span>
              {LANGUAGES.map((l) => (
                <span
                  key={l}
                  className="rounded-full border border-brand-ink/12 bg-paper px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-mute"
                >
                  {l}
                </span>
              ))}
              <span className="text-[10px] uppercase tracking-[0.18em] text-brand-mute">
                + daha fazlası
              </span>
            </div>
          </motion.div>

          {/* SAĞ — phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.4,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mx-auto w-full max-w-[420px]"
          >
            <div
              className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border-[10px] border-brand-ink/85 bg-brand-cream"
              style={{ boxShadow: "0 40px 90px -28px rgba(31, 27, 23, 0.42)" }}
            >
              {/* iPhone notch */}
              <div
                aria-hidden
                className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-brand-ink/90"
              />

              {/* Davetiye demosu — phone içinde */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F2EEE4] px-6 text-center">
                <Image
                  src="/aethel/chapel-vignette.png"
                  alt=""
                  fill
                  sizes="420px"
                  style={{ objectFit: "cover", opacity: 0.18 }}
                />
                <div className="relative z-10 mt-12 flex flex-col items-center gap-4">
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#5E6650]">
                    Evleniyoruz
                  </span>
                  <div className="relative h-32 w-32">
                    <Image
                      src="/aethel/wax-seal-luxe.png"
                      alt="Wax seal"
                      fill
                      sizes="128px"
                      priority
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3
                    className="px-2 italic text-[#2E3326]"
                    style={{
                      fontFamily: "var(--font-calligraphy)",
                      fontSize: "clamp(36px, 8vw, 52px)",
                      lineHeight: 1.05,
                    }}
                  >
                    Defne &amp; Aras
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.42em] text-[#5E6650]">
                    12 Eylül 2026
                  </span>
                  <span className="text-[10px] italic text-[#5E6650]">
                    Aethel&apos;s Chapel · Toscana
                  </span>
                </div>
              </div>
            </div>

            {/* Yan badge */}
            <div
              aria-hidden
              className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rotate-12 sm:block"
            >
              <span className="inline-block rounded-full bg-brand-cognac px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-paper shadow-ed-md">
                Dokun, aç
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
