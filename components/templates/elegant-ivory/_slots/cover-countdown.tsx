"use client";

/**
 * Cover Countdown — lifted from the monolith _invitation-view.tsx
 * L1183-1268 verbatim so the migration preserves the exact ticker
 * geometry, labels per locale, and reveal animation.
 *
 * Lives inside the Elegant Ivory cover slot. Eventually (FAZ 2D) this
 * gets split out into a stand-alone countdown slot the renderer
 * inserts between cover and gallery, so other editions can drop it
 * in without recoding.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { DbLocale } from "@/lib/db/types";
import type { InvitationTheme } from "@/lib/templates/themes";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

const COUNTDOWN_LABELS: Record<
  DbLocale,
  { d: string; h: string; m: string; s: string; eyebrow: string }
> = {
  tr: { d: "Gün", h: "Saat", m: "Dakika", s: "Saniye", eyebrow: "— O güne kadar" },
  en: { d: "Days", h: "Hours", m: "Minutes", s: "Seconds", eyebrow: "— Until the day" },
  sr: { d: "Dana", h: "Sata", m: "Minuta", s: "Sekundi", eyebrow: "— Do dana svadbe" },
};

export function CoverCountdown({
  targetIso,
  locale,
  theme,
}: {
  targetIso: string;
  locale: DbLocale;
  theme: InvitationTheme;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const L = COUNTDOWN_LABELS[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 2.4, ease: SOFT_EASE }}
      className="mx-auto mt-14"
      style={{ maxWidth: 620 }}
    >
      <p
        className="text-center text-[10px] font-semibold uppercase"
        style={{ color: theme.accent, letterSpacing: "0.4em" }}
      >
        {L.eyebrow}
      </p>
      <div className="mt-6 grid grid-cols-4 items-baseline gap-2 sm:gap-4">
        {[
          { v: days, l: L.d },
          { v: hours, l: L.h },
          { v: minutes, l: L.m },
          { v: seconds, l: L.s },
        ].map((cell, i) => (
          <div key={i} className="relative text-center">
            <span
              className="block font-display tabular-nums"
              style={{
                color: theme.ink,
                fontSize: "clamp(34px, 5.5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              {String(cell.v).padStart(2, "0")}
            </span>
            <span
              className="mt-3 block text-[9px] font-semibold uppercase"
              style={{ color: theme.inkSoft, letterSpacing: "0.34em" }}
            >
              {cell.l}
            </span>
            {i < 3 && (
              <span
                aria-hidden
                className="absolute right-[-2px] top-[18%] hidden text-[28px] font-display sm:block"
                style={{ color: theme.spark, opacity: 0.35 }}
              >
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
