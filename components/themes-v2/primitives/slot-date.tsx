"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, InvitationDate } from "@/lib/themes-v2/types";
import { makeRng, r3 } from "./atmosphere";

/**
 * SlotDate — tarihi gösteren kalpli slot makinesi.
 *
 * Kompozisyon: üç makara (gün ♥ ay ♥ yıl), countdown hücreleriyle aynı
 * hairline çerçeve dilinde. Görünüme girince makaralar kademeli döner
 * (1.3s / 1.7s / 2.1s, uzun decelerate), son makara durunca kalp
 * ayraçlar bir kez zıplar ve 6 minik kalp yukarı süzülür; 700ms sonra
 * makine zarif serif tarihe çözülür — oyun anı kısa, kalıcı hâl sakin.
 *
 * Naiflik ilkeleri: kumarhane parıltısı yok — ince çizgiler, palet içi
 * renkler, tek seferlik kutlama. prefers-reduced-motion'da makine hiç
 * kurulmaz, doğrudan serif tarih gösterilir. Tüm rastgelelik seeded
 * (makeRng) → SSR/client birebir aynı.
 */

const REEL_ITEMS = 9; // 8 sahte değer + gerçek değer
const EASE_SPIN = [0.12, 0.8, 0.15, 1] as const;

interface Props {
  meta: ThemeV2Meta;
  date: InvitationDate;
  /** Makine çözüldükten sonra gösterilecek serif tarih (mevcut h2 stili). */
  children: React.ReactNode;
}

/** Seeded, tekrarsız sahte değer dizisi — son eleman gerçek değer. */
function buildStrip(finalValue: string, pool: string[], seed: number): string[] {
  const rnd = makeRng(seed);
  const decoys = pool.filter((v) => v !== finalValue);
  // Fisher-Yates (seeded)
  for (let i = decoys.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [decoys[i], decoys[j]] = [decoys[j], decoys[i]];
  }
  return [...decoys.slice(0, REEL_ITEMS - 1), finalValue];
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export function SlotDate({ meta, date, children }: Props) {
  const reduced = useReducedMotion();
  const { palette } = meta;
  const ink = palette.countdownInk;
  const accent = palette.accent;

  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);
  const [resolved, setResolved] = useState(false);

  // iso: "YYYY-MM-DD..." — ay numarasını buradan alırız (date.month lokalize ad).
  const parts = useMemo(() => {
    const iso = date.iso ?? "";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    if (!m) return null;
    const [, y, mo, d] = m;
    const seedBase = parseInt(y + mo + d, 10);
    return {
      day: buildStrip(pad2(parseInt(d, 10)), Array.from({ length: 28 }, (_, i) => pad2(i + 1)), seedBase + 1),
      month: buildStrip(pad2(parseInt(mo, 10)), Array.from({ length: 12 }, (_, i) => pad2(i + 1)), seedBase + 2),
      year: buildStrip(y, Array.from({ length: 7 }, (_, i) => String(parseInt(y, 10) - 3 + i)), seedBase + 3),
    };
  }, [date.iso]);

  // Tarih yoksa / hareket azaltılmışsa makine kurulmaz — sakin hâl direkt.
  if (!parts || reduced) return <>{children}</>;

  if (resolved) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    );
  }

  const reels: Array<{ strip: string[]; dur: number; delay: number }> = [
    { strip: parts.day, dur: 1.3, delay: 0.2 },
    { strip: parts.month, dur: 1.7, delay: 0.35 },
    { strip: parts.year, dur: 2.1, delay: 0.5 },
  ];

  return (
    <motion.div
      className="relative mt-6 flex items-center justify-center gap-3 sm:gap-4"
      onViewportEnter={() => setSpinning(true)}
      viewport={{ once: true, amount: 0.6 }}
      aria-label={`${date.day} ${date.month} ${date.year}`}
      role="img"
    >
      {reels.map((reel, i) => (
        <div key={i} className="flex items-center gap-3 sm:gap-4">
          {i > 0 && <HeartDivider accent={accent} pop={landed} index={i} />}
          <div
            className="overflow-hidden rounded-xl px-4 py-3 sm:px-6 sm:py-4"
            style={{
              border: `1px solid ${accent}29`,
              backgroundColor: `${ink}08`,
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              className="overflow-hidden"
              style={{ height: "1.1em", fontSize: "clamp(26px, 4.5vw, 44px)", lineHeight: 1.1 }}
            >
              <motion.div
                initial={{ y: 0 }}
                animate={spinning ? { y: `-${(reel.strip.length - 1) * 1.1}em` } : { y: 0 }}
                transition={{ duration: reel.dur, delay: reel.delay, ease: EASE_SPIN }}
                onAnimationComplete={() => {
                  if (i === reels.length - 1 && spinning) {
                    setLanded(true);
                    window.setTimeout(() => setResolved(true), 900);
                  }
                }}
              >
                {reel.strip.map((v, j) => (
                  <div
                    key={j}
                    className="font-display text-center"
                    style={{
                      height: "1.1em",
                      color: ink,
                      fontWeight: 300,
                      fontVariantNumeric: "oldstyle-nums",
                      // Dönerken hafif blur hissi: sahte değerler soluk
                      opacity: j === reel.strip.length - 1 ? 1 : 0.55,
                    }}
                  >
                    {v}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      ))}

      {/* Duruş kutlaması: 6 minik kalp yukarı süzülür — tek sefer, zarif */}
      {landed && <HeartDrift accent={accent} />}
    </motion.div>
  );
}

function HeartGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M12 21c-.4 0-.8-.14-1.1-.42C6.7 16.9 3 13.6 3 9.9 3 7.2 5.1 5 7.7 5c1.6 0 3.1.78 4.3 2.1C13.2 5.78 14.7 5 16.3 5 18.9 5 21 7.2 21 9.9c0 3.7-3.7 7-7.9 10.68-.3.28-.7.42-1.1.42z" />
    </svg>
  );
}

function HeartDivider({ accent, pop, index }: { accent: string; pop: boolean; index: number }) {
  return (
    <motion.span
      initial={false}
      animate={pop ? { scale: [1, 1.45, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ opacity: 0.85 }}
    >
      <HeartGlyph size={13} color={accent} />
    </motion.span>
  );
}

function HeartDrift({ accent }: { accent: string }) {
  const hearts = useMemo(() => {
    const rnd = makeRng(52428);
    return Array.from({ length: 6 }, (_, i) => ({
      x: r3(12 + rnd() * 76), // %
      size: r3(7 + rnd() * 6),
      dur: r3(1.6 + rnd() * 1),
      delay: r3(i * 0.09),
      drift: r3((rnd() - 0.5) * 30),
    }));
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${h.x}%`, bottom: "20%" }}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.9, 0], y: -64, x: h.drift, scale: 1 }}
          transition={{ duration: h.dur, delay: h.delay, ease: "easeOut" }}
        >
          <HeartGlyph size={h.size} color={accent} />
        </motion.span>
      ))}
    </div>
  );
}
