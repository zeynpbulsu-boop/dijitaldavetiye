"use client";

/**
 * FloatingVerse — Story ile Schedule arasında büyük italik dize.
 *
 * TDI Heritage paritesi: çiftin atmosferine özel kısa lirik bir cümle.
 * Görsel: serif italik, parchment-light arka plan, üst+alt ince çizgi,
 * scroll'a göre hafif parallax (translateY).
 *
 * Pasif okuma section'ı — etkileşim yok, sadece atmosfer. prefers-
 * reduced-motion altında parallax kapalı.
 */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { CSSProperties } from "react";

interface Props {
  verse: string;
  ink: string;
  inkSoft: string;
  accent: string;
  /** Edition font family (var(--font-edition)). */
  fontFamily?: string;
}

export function FloatingVerse({
  verse,
  ink,
  inkSoft,
  accent,
  fontFamily,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Subtle parallax — verse drifts upward as user scrolls past it. */
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  const baseStyle: CSSProperties = {
    fontFamily: fontFamily ?? "var(--font-display), Georgia, serif",
  };

  return (
    <section
      ref={ref}
      aria-label="Bölüm dizesi"
      className="relative overflow-hidden px-5 py-24 sm:px-6 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[820px]">
        {/* Top hairline ornament */}
        <div className="flex items-center justify-center gap-3">
          <span
            aria-hidden
            className="block h-px w-12 sm:w-20"
            style={{ background: accent, opacity: 0.55 }}
          />
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rotate-45 transform"
            style={{ background: accent, opacity: 0.65 }}
          />
          <span
            aria-hidden
            className="block h-px w-12 sm:w-20"
            style={{ background: accent, opacity: 0.55 }}
          />
        </div>

        {/* Verse */}
        <motion.blockquote
          style={{ y, opacity, ...baseStyle }}
          className="mt-10 px-2 text-center italic sm:mt-12"
        >
          <span
            style={{
              color: ink,
              fontSize: "clamp(22px, 3.6vw, 38px)",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
              fontWeight: 300,
            }}
          >
            &ldquo;{verse}&rdquo;
          </span>
        </motion.blockquote>

        {/* Bottom hairline ornament — mirrored */}
        <div className="mt-10 flex items-center justify-center gap-3 sm:mt-12">
          <span
            aria-hidden
            className="block h-px w-12 sm:w-20"
            style={{ background: accent, opacity: 0.55 }}
          />
          <span
            aria-hidden
            className="block h-1.5 w-1.5 rotate-45 transform"
            style={{ background: accent, opacity: 0.65 }}
          />
          <span
            aria-hidden
            className="block h-px w-12 sm:w-20"
            style={{ background: accent, opacity: 0.55 }}
          />
        </div>

        {/* Faint attribution — anonymous, just for hint */}
        <p
          aria-hidden
          className="mt-6 text-center text-[10px] uppercase sm:mt-8"
          style={{
            color: inkSoft,
            letterSpacing: "0.42em",
            fontWeight: 300,
            opacity: 0.7,
          }}
        >
          — Atelier NUVE
        </p>
      </div>
    </section>
  );
}
