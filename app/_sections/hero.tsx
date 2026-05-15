"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CornerBlooms } from "@/components/ornaments/corner-blooms";
import { Magnetic } from "@/components/effects/magnetic";
import { useT } from "@/lib/i18n/provider";

/**
 * Hero — editorial spread, fully i18n-bound (TR / EN / SR).
 * Word-stagger reveal still works on whatever the active dictionary
 * supplies (counted from a split of headline_l1 + headline_l2_*).
 */
export function Hero() {
  const t = useT();

  // Build the staggered word list from the active locale's headline.
  const line1Words = t.hero.headline_l1.split(" ").filter(Boolean);
  const line2Words = (
    t.hero.headline_l2_prefix + t.hero.headline_l2_accent + t.hero.headline_l2_suffix
  )
    .split(" ")
    .filter(Boolean);
  // Mark the accent word — find it by matching against the accent string
  const accentWord = t.hero.headline_l2_accent.trim();
  const line2Final = line2Words.map((w) => ({
    text: w,
    italic: w.replace(/[.,!?]+$/, "") === accentWord,
  }));

  return (
    <section className="relative overflow-hidden bg-bg">
      <CornerBlooms slot="hero" />

      <div className="pointer-events-none absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 -rotate-90 origin-center xl:block">
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-brand-mute whitespace-nowrap">
          {t.hero.rail_left}
        </span>
      </div>
      <div className="pointer-events-none absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 rotate-90 origin-center xl:block">
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-brand-mute whitespace-nowrap">
          {t.hero.rail_right}
        </span>
      </div>

      <div className="container-wide grid min-h-[88vh] grid-cols-12 items-center gap-x-6 gap-y-16 py-20 lg:py-28">
        <div className="col-span-12 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 inline-flex items-center gap-3"
          >
            <span aria-hidden className="h-px w-8 bg-brand-cognac/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-mute">
              {t.hero.eyebrow}
            </span>
          </motion.div>

          <h1
            className="font-display font-normal text-brand-ink"
            style={{
              fontSize: "clamp(56px, 9.5vw, 132px)",
              lineHeight: 0.96,
              letterSpacing: "-0.025em",
            }}
          >
            <span className="block">
              {line1Words.map((w, i) => (
                <motion.span
                  key={`l1-${i}`}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.15 + i * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block"
                  style={{ marginRight: i < line1Words.length - 1 ? "0.28em" : 0 }}
                >
                  {w}
                </motion.span>
              ))}
            </span>
            <span className="block">
              {line2Final.map((w, i) => (
                <motion.span
                  key={`l2-${i}`}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.95,
                    delay: 0.33 + i * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={
                    w.italic
                      ? "inline-block italic text-brand-cognac"
                      : "inline-block"
                  }
                  style={{ marginRight: i < line2Final.length - 1 ? "0.28em" : 0 }}
                >
                  {w.text}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 max-w-[560px] text-brand-ink/75"
            style={{
              fontSize: "clamp(17px, 1.4vw, 19px)",
              lineHeight: 1.65,
              letterSpacing: "-0.005em",
            }}
          >
            {t.hero.lead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              href="/i/elif-mert-elegant"
              target="_blank"
              rel="noopener"
              data-cursor="cta"
              className="group inline-flex items-center gap-2 rounded-full border border-brand-cognac/60 bg-brand-cream-alt/40 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-cognac transition-all duration-300 hover:border-brand-cognac hover:bg-brand-cognac hover:text-brand-cream"
            >
              <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-brand-cognac transition-all duration-300 group-hover:bg-brand-cream" />
              <span>Canlı demo</span>
              <svg width="13" height="9" viewBox="0 0 14 10" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Magnetic strength={0.32} radius={140}>
            <Link
              href="/order/blush-reverie"
              data-cursor="cta"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-cognac px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-cream shadow-[0_1px_2px_rgba(43,30,22,0.18)] transition-all duration-300 hover:bg-brand-ink hover:shadow-[0_6px_18px_rgba(43,30,22,0.22)]"
            >
              <span>{t.hero.cta_primary}</span>
              <svg
                width="14" height="10" viewBox="0 0 14 10" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              >
                <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            </Magnetic>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="mt-5 text-[11px] tracking-[0.04em] text-brand-mute"
          >
            <span className="text-brand-cognac">∗</span>&nbsp;{t.hero.footnote}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 flex items-center justify-center lg:col-span-5"
        >
          <PhoneMockup
            topLabel={t.hero.phone.top_label}
            andText={t.hero.phone.and}
            date={t.hero.phone.date}
            tapHint={t.hero.phone.tap_hint}
          />
        </motion.div>
      </div>

      <div className="overflow-hidden border-y border-line bg-bg-alt/50">
        <div className="flex w-max animate-marquee whitespace-nowrap py-5">
          {[...Array(2)].flatMap((_, i) =>
            t.hero.marquee.map((line, j) => (
              <span
                key={`${i}-${j}`}
                className="inline-flex items-center gap-8 px-8 font-display text-[22px] italic text-brand-ink/65"
              >
                {line}
                <span aria-hidden className="text-brand-cognac">✦</span>
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}

function PhoneMockup({
  topLabel,
  andText,
  date,
  tapHint,
}: {
  topLabel: string;
  andText: string;
  date: string;
  tapHint: string;
}) {
  return (
    <div className="relative w-full max-w-[340px] aspect-[9/19.5]">
      <div aria-hidden className="absolute -inset-x-6 -bottom-10 h-24 rounded-full bg-brand-ink/15 blur-2xl" />
      <div className="relative h-full w-full rounded-[42px] bg-brand-ink p-[8px] shadow-[0_30px_60px_-20px_rgba(43,30,22,0.45),0_8px_18px_-6px_rgba(43,30,22,0.25)]">
        <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-brand-cream-alt">
          <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-brand-ink/90" />
          <div className="flex h-full w-full flex-col items-center justify-center px-8 pt-12 pb-10">
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.32em] text-brand-mute">
              {topLabel}
            </span>
            <div className="relative mt-7 w-full max-w-[200px]">
              <svg viewBox="0 0 200 144" xmlns="http://www.w3.org/2000/svg" aria-hidden
                className="w-full drop-shadow-[0_4px_10px_rgba(43,30,22,0.18)]">
                <rect x="3" y="3" width="194" height="138" rx="3" fill="#F2EEE6"
                  stroke="#2B1E16" strokeOpacity="0.18" strokeWidth="1" />
                <path d="M3 3 L100 80 L197 3" stroke="#2B1E16" strokeOpacity="0.18"
                  strokeWidth="1" fill="none" />
                <g transform="translate(100 102)">
                  <circle r="20" fill="#8C5A3C" stroke="#2B1E16" strokeOpacity="0.25" strokeWidth="0.8" />
                  <circle r="17" fill="none" stroke="#F2EEE6" strokeOpacity="0.45"
                    strokeWidth="0.6" strokeDasharray="1.5 1.2" />
                  <text x="0" y="6" textAnchor="middle" fontFamily="serif"
                    fontStyle="italic" fontSize="22" fontWeight="400" fill="#F2EEE6">N</text>
                </g>
              </svg>
            </div>
            <div className="mt-8 text-center">
              <p className="font-display text-brand-ink" style={{ fontSize: "26px", lineHeight: 1.05, letterSpacing: "-0.01em" }}>Elif</p>
              <p className="font-display italic text-brand-cognac" style={{ fontSize: "16px", lineHeight: 1, marginTop: "3px" }}>{andText}</p>
              <p className="font-display text-brand-ink" style={{ fontSize: "26px", lineHeight: 1.05, letterSpacing: "-0.01em" }}>Mert</p>
            </div>
            <div className="mt-7 flex items-center gap-2.5">
              <span aria-hidden className="h-px w-6 bg-brand-mute/40" />
              <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-brand-mute">{date}</span>
              <span aria-hidden className="h-px w-6 bg-brand-mute/40" />
            </div>
            <div className="mt-auto pb-1">
              <span className="text-[9px] uppercase tracking-[0.3em] text-brand-mute/70">{tapHint}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
