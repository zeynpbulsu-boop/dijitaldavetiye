"use client";

/**
 * JourneyTimeline — "Bizim Hikayemiz" / "Our Journey" section.
 *
 * TDI Heritage paritesi: çiftin yıl-yıl ilerleyen küçük hikâyesi
 * (How we met → First adventure → Moving forward → The proposal).
 * Pressed Love'da yok, NUVE'de yeni bir farklılaştırıcı.
 *
 * Görsel:
 *  - Dikey center axis, alternatif sol/sağ tarafta entry kartları
 *  - Mobile'da single column (her entry merkez axis'in sağında)
 *  - Her entry'de büyük serif yıl + başlık + 2-3 satır anlatı + theme glyph
 *  - Theme glyph her edisyona göre farklı (cross/moon/chandelier/...)
 *  - whileInView reveal, alternatif yönde slide-in
 */

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export interface StoryEntry {
  /** "2020", "2021" gibi yıl etiketi. */
  year: string;
  /** "İlk tanıştığımız gün" gibi başlık. */
  title: string;
  /** 1-3 satırlık anlatı. */
  body: string;
}

export type StoryGlyph =
  | "cross" /** Aethel — kilise haçı */
  | "moon" /** Atelier Indigo — hilal */
  | "candle" /** Mansion Lights — alev */
  | "anchor" /** Bodrum Blue — çapa */
  | "olive" /** Olive Grove — zeytin yaprağı */
  | "spark"; /** Aurora — kıvılcım/yıldız */

interface Props {
  entries: StoryEntry[];
  glyph?: StoryGlyph;
  /** Theme palette aktarımı. */
  ink: string;
  inkSoft: string;
  inkMuted: string;
  accent: string;
  bg: string;
  eyebrow?: string;
  title?: string;
  /** Edition font family (var(--font-edition)). */
  fontFamily?: string;
}

export function JourneyTimeline({
  entries,
  glyph = "spark",
  ink,
  inkSoft,
  inkMuted,
  accent,
  bg,
  eyebrow = "— Hikâyemiz",
  title = "Yolumuzdan",
  fontFamily,
}: Props) {
  if (entries.length === 0) return null;

  return (
    <section
      className="relative w-full px-5 py-20 sm:px-6 sm:py-28 lg:py-40"
      style={{ background: bg, color: ink }}
    >
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-[760px] text-center sm:mb-20 lg:mb-24">
        <span
          className="text-[10px] uppercase"
          style={{
            color: inkMuted,
            letterSpacing: "0.5em",
            fontWeight: 300,
          }}
        >
          {eyebrow}
        </span>
        <h2
          className="mt-4 italic"
          style={{
            fontFamily: fontFamily ?? "var(--font-display), Georgia, serif",
            fontSize: "clamp(34px, 5vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: ink,
            fontWeight: 400,
          }}
        >
          {title}
        </h2>
        <div
          className="mx-auto mt-6 h-px w-16"
          style={{ background: `${inkMuted}66` }}
        />
      </div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-[920px]">
        {/* Center axis — sadece desktop'ta görünür */}
        <div
          aria-hidden
          className="absolute left-4 top-0 hidden h-full w-px sm:left-1/2 sm:-translate-x-1/2 sm:block"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${inkMuted}88 8%, ${inkMuted}88 92%, transparent 100%)`,
          }}
        />
        {/* Mobile axis (left side) */}
        <div
          aria-hidden
          className="absolute left-4 top-0 block h-full w-px sm:hidden"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${inkMuted}88 6%, ${inkMuted}88 94%, transparent 100%)`,
          }}
        />

        <ol className="space-y-14 sm:space-y-20">
          {entries.map((entry, i) => {
            const onLeft = i % 2 === 0;
            return (
              <motion.li
                key={`${entry.year}-${i}`}
                initial={{ opacity: 0, y: 28, x: onLeft ? -16 : 16 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative grid grid-cols-[36px_1fr] gap-5 sm:grid-cols-2 sm:gap-12 ${
                  onLeft ? "sm:[&_.entry-card]:order-1" : "sm:[&_.entry-card]:order-2"
                }`}
              >
                {/* Node — axis üzerinde dolu daire */}
                <div className="flex justify-center sm:contents">
                  <div
                    aria-hidden
                    className="relative z-10 mt-2 flex h-7 w-7 items-center justify-center rounded-full sm:absolute sm:left-1/2 sm:-translate-x-1/2"
                    style={{
                      background: bg,
                      border: `1.5px solid ${accent}AA`,
                      boxShadow: `0 0 0 4px ${bg}`,
                    }}
                  >
                    <Glyph kind={glyph} color={accent} size={14} />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`entry-card relative ${
                    onLeft ? "sm:pr-14 sm:text-right" : "sm:pl-14 sm:text-left"
                  }`}
                >
                  <span
                    className="font-display italic"
                    style={{
                      fontFamily: fontFamily ?? "var(--font-display), Georgia, serif",
                      fontSize: "clamp(34px, 5vw, 56px)",
                      lineHeight: 1,
                      color: accent,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {entry.year}
                  </span>
                  <h3
                    className="mt-3 italic"
                    style={{
                      fontFamily: fontFamily ?? "var(--font-display), Georgia, serif",
                      fontSize: "clamp(18px, 2.4vw, 24px)",
                      lineHeight: 1.2,
                      color: ink,
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {entry.title}
                  </h3>
                  <p
                    className="mt-3 max-w-[420px] text-[13px] sm:text-[14px]"
                    style={{
                      color: inkSoft,
                      lineHeight: 1.75,
                      fontWeight: 300,
                      marginLeft: onLeft ? "auto" : 0,
                    }}
                  >
                    {entry.body}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>

        {/* End cap — küçük ornament */}
        <div
          aria-hidden
          className="relative mx-auto mt-14 flex justify-center sm:mt-20"
          style={{ color: accent }}
        >
          <span className="text-[18px]">✦</span>
        </div>
      </div>
    </section>
  );
}

/* ── Glyphs (inline SVG, theme-tinted) ───────────────────────────── */

function Glyph({
  kind,
  color,
  size = 14,
}: {
  kind: StoryGlyph;
  color: string;
  size?: number;
}) {
  const common: CSSProperties = { color };
  const stroke = 1.4;
  switch (kind) {
    case "cross":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common} fill="none">
          <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
          <line x1="3" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case "moon":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common} fill="none">
          <path d="M11 3 A 6 6 0 1 0 11 13 A 4.5 4.5 0 1 1 11 3 Z" fill="currentColor" />
        </svg>
      );
    case "candle":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common} fill="none">
          <path d="M8 2 C 9.2 4 9.5 5 8 6 C 6.5 5 6.8 4 8 2 Z" fill="currentColor" />
          <line x1="8" y1="7" x2="8" y2="13" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case "anchor":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common} fill="none">
          <circle cx="8" cy="3" r="1.4" stroke="currentColor" strokeWidth={stroke} />
          <line x1="8" y1="4.5" x2="8" y2="12" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
          <path d="M3 11 Q 8 14 13 11" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none" />
          <line x1="5" y1="6.5" x2="11" y2="6.5" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case "olive":
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common} fill="none">
          <path d="M3 13 Q 6 8 13 4" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" fill="none" />
          <ellipse cx="7" cy="9" rx="2" ry="0.9" transform="rotate(-30 7 9)" fill="currentColor" />
          <ellipse cx="10" cy="6" rx="2" ry="0.9" transform="rotate(-30 10 6)" fill="currentColor" />
        </svg>
      );
    case "spark":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" style={common} fill="none">
          <path
            d="M8 1 L 9 7 L 15 8 L 9 9 L 8 15 L 7 9 L 1 8 L 7 7 Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      );
  }
}
