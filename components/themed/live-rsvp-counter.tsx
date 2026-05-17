"use client";

/**
 * LiveRsvpCounter — FAZ 5.4
 *
 * Davetiyenin canlı, yaşayan bir etkinlik olduğunu gösteren sticky bar.
 * "47 davetli onayladı · 12 koltuk kaldı" — Pressed Love'da yok.
 *
 * UI: alt orta floating pill, edition'ın koyu rengi + ince border.
 * Numara her 30 saniyede pulse (real-time fetch yapılır, ama UI hep
 * yumuşak fade-in ile değişir — tedirgin etmez).
 *
 * Demo mode: hardcoded sayılar. Production'da Supabase'den fetch:
 *   GET /api/rsvp-count?slug=... → { confirmed, declined, pending, capacity }
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LiveRsvpCounterProps {
  /** Onaylayan davetli sayısı. Demo: 47. */
  confirmed?: number;
  /** Toplam kapasite. Demo: 60. */
  capacity?: number;
  /** Sticky pozisyon — default bottom (ortada alt). */
  position?: "top" | "bottom";
  /** Tema'nın ink rengi. */
  inkColor?: string;
  /** Tema'nın accent rengi (kalp/nokta için). */
  accentColor?: string;
  /** Türkçe / English etiket. */
  locale?: "tr" | "en" | "sr";
  className?: string;
}

const LABELS = {
  tr: { confirmed: "davetli onayladı", remaining: "koltuk kaldı" },
  en: { confirmed: "guests confirmed", remaining: "seats remaining" },
  sr: { confirmed: "gostiju potvrdilo", remaining: "mesta preostalo" },
};

export function LiveRsvpCounter({
  confirmed = 47,
  capacity = 60,
  position = "bottom",
  inkColor = "rgba(43, 30, 22, 0.9)",
  accentColor = "rgba(193, 145, 75, 0.85)",
  locale = "tr",
  className = "",
}: LiveRsvpCounterProps) {
  const [tick, setTick] = useState(0);
  const remaining = Math.max(0, capacity - confirmed);
  const labels = LABELS[locale];

  // Demo: küçük pulse her 4 saniyede bir — "canlı" hissi
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 4000);
    return () => window.clearInterval(id);
  }, []);

  /* FAZ A.1 — Bottom variant clears FloatingControls pills on mobile by
     stacking ~4.5rem up; on sm+ it sits at the standard 1.5rem inset.
     Both variants honour the iOS safe-area inset. */
  const positionClasses =
    position === "bottom"
      ? "bottom-[calc(env(safe-area-inset-bottom,0px)+4.5rem)] sm:bottom-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
      : "top-[calc(env(safe-area-inset-top,0px)+1.5rem)]";

  return (
    <motion.aside
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: position === "bottom" ? 20 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none fixed left-1/2 z-40 -translate-x-1/2 px-3 ${positionClasses} ${className}`}
    >
      <div
        className="pointer-events-auto flex max-w-[calc(100vw-1.5rem)] items-center gap-2 px-3 py-2.5 backdrop-blur-md sm:gap-3 sm:px-5 sm:py-3"
        style={{
          background: "rgba(255, 250, 240, 0.78)",
          border: `1px solid ${accentColor}`,
          borderRadius: 999,
          boxShadow: "0 2px 18px rgba(43, 30, 22, 0.08)",
          color: inkColor,
          fontFamily: "var(--font-display), Georgia, serif",
          fontWeight: 300,
          fontSize: "clamp(10px, 3vw, 13px)",
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        {/* Pulsing dot — canlı sinyal */}
        <motion.span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: accentColor }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.9, 1.4, 0.9],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          key={`confirmed-${tick}`}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <strong style={{ fontWeight: 400 }}>{confirmed}</strong>&nbsp;{labels.confirmed}
        </motion.span>
        <span style={{ opacity: 0.45 }}>·</span>
        <span>
          <strong style={{ fontWeight: 400 }}>{remaining}</strong>&nbsp;{labels.remaining}
        </span>
      </div>
    </motion.aside>
  );
}
