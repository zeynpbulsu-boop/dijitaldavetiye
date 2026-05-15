"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CornerBlooms } from "@/components/ornaments/corner-blooms";
import { Magnetic } from "@/components/effects/magnetic";
import { useT } from "@/lib/i18n/provider";

export function ClosingCta() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-line bg-bg py-32 lg:py-44"
    >
      <CornerBlooms slot="closing" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cognac/8 blur-[120px]"
      />

      <div className="container-narrow relative z-10 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-cognac"
        >
          — {t.closing.eyebrow}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 font-display text-brand-ink"
          style={{ fontSize: "clamp(44px, 7.5vw, 108px)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
        >
          {t.closing.headline_prefix}
          <span className="italic text-brand-cognac">{t.closing.headline_accent}</span>
          {t.closing.headline_suffix}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-[560px] text-brand-ink/75"
          style={{ fontSize: "clamp(16px, 1.4vw, 19px)", lineHeight: 1.65 }}
        >
          {t.closing.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
        >
          <Magnetic strength={0.34} radius={160}>
          <Link
            href="/order/blush-reverie"
            data-cursor="cta"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-cognac px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.22em] text-brand-cream shadow-[0_10px_30px_-8px_rgba(140,90,60,0.55)] transition-all duration-300 hover:bg-brand-ink hover:shadow-[0_18px_40px_-10px_rgba(43,30,22,0.45)]"
          >
            <span>{t.closing.cta_primary}</span>
            <svg
              width="16" height="11" viewBox="0 0 14 10" fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden
            >
              <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          </Magnetic>

          <Link
            href="#themes"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-ink/70 transition hover:text-brand-cognac"
          >
            <span>{t.closing.cta_secondary}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">↓</span>
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-brand-mute"
        >
          {t.closing.reassurance.map((label, i) => (
            <li key={i} className="inline-flex items-center gap-2">
              <span aria-hidden className="text-brand-cognac">✦</span>
              {label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
