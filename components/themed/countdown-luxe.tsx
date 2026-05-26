"use client";

/**
 * CountdownLuxe — FAZ B.2.
 *
 * 4 sütun: gün / saat / dakika / saniye. Theme aksanı ile başlık üst
 * çizgi, ince border, sayılar tabular-nums monospace olmasın — luxe
 * marka için Cormorant ile birlikte calligrafik bir hisli sayı.
 *
 * Tick: 1s. SSR-safe (initial render sıfır gösterir, mount sonrası
 * gerçek delta hesaplanır) — hydration uyumsuzluğu olmadan.
 *
 * Event geçmişse (delta < 0): "Düğün günü." gibi tek satır mesaj.
 */

import { useEffect, useMemo, useRef, useState } from "react";

interface CountdownLuxeProps {
  /** ISO YYYY-MM-DD veya tam tarih saat string. */
  to: string;
  /** Theme aksanı (sayıların hover'ı, üst çizgi). */
  accent: string;
  /** Birincil ink. */
  ink: string;
  /** Soft ink (alt etiketler için). */
  inkSoft: string;
  /** Etkinlik geçtiyse gösterilecek metin. */
  pastLabel?: string;
  /** Türkçe etiketler default, en/sr için override. */
  labels?: { d: string; h: string; m: string; s: string };
  /** T-0'a ulaşıldığı an bir kere tetiklenir (Faz 1: detonation hook). */
  onReachZero?: () => void;
  className?: string;
}

const TR_LABELS = { d: "Gün", h: "Saat", m: "Dakika", s: "Saniye" } as const;

/* Milestone copy — heading that swaps based on remaining days.
   Empty string means "no milestone, just show digits". */
function milestoneLabel(days: number, hours: number, ms: number): string {
  if (ms <= 0) return "";
  if (days === 0 && hours < 6) return "Saatler içinde.";
  if (days === 0) return "Bugün.";
  if (days === 1) return "Yarın.";
  if (days <= 7) return "Bu hafta.";
  if (days <= 30) return "Bu ay.";
  if (days <= 90) return "Yakında — yerini ayır.";
  return "";
}

function diff(target: number, now: number) {
  const ms = Math.max(0, target - now);
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hours = Math.floor((s % 86400) / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  return { ms, days, hours, minutes, seconds };
}

export function CountdownLuxe({
  to,
  accent,
  ink,
  inkSoft,
  pastLabel = "Düğün günü geldi.",
  labels = TR_LABELS,
  onReachZero,
  className = "",
}: CountdownLuxeProps) {
  const target = useMemo(() => {
    const ts = new Date(to).getTime();
    return Number.isFinite(ts) ? ts : Date.now();
  }, [to]);

  /* SSR / first paint: render zeros so client doesn't mismatch.
     Effect kicks in after mount and ticks every second. */
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const d = now == null ? { ms: 1, days: 0, hours: 0, minutes: 0, seconds: 0 } : diff(target, now);

  // Detonation trigger — fires exactly once when countdown crosses zero.
  const detonatedRef = useRef(false);
  useEffect(() => {
    if (now == null) return;
    if (d.ms <= 0 && !detonatedRef.current) {
      detonatedRef.current = true;
      onReachZero?.();
    }
  }, [now, d.ms, onReachZero]);

  if (d.ms <= 0) {
    return (
      <p
        className={`text-center text-[12px] uppercase ${className}`}
        style={{
          color: inkSoft,
          letterSpacing: "0.42em",
          fontWeight: 300,
        }}
      >
        {pastLabel}
      </p>
    );
  }

  const milestone = milestoneLabel(d.days, d.hours, d.ms);

  return (
    <div className={`mx-auto max-w-[520px] ${className}`}>
      {milestone && (
        <p
          aria-hidden
          className="mb-4 text-center text-[11px] uppercase sm:mb-5"
          style={{
            color: accent,
            letterSpacing: "0.38em",
            fontWeight: 400,
          }}
        >
          {milestone}
        </p>
      )}
      <div
        role="timer"
        aria-live="polite"
        className="grid grid-cols-4 gap-2 sm:gap-4"
      >
        <Cell value={d.days} label={labels.d} ink={ink} inkSoft={inkSoft} accent={accent} />
        <Cell value={d.hours} label={labels.h} ink={ink} inkSoft={inkSoft} accent={accent} />
        <Cell value={d.minutes} label={labels.m} ink={ink} inkSoft={inkSoft} accent={accent} />
        <Cell value={d.seconds} label={labels.s} ink={ink} inkSoft={inkSoft} accent={accent} />
      </div>
    </div>
  );
}

function Cell({
  value,
  label,
  ink,
  inkSoft,
  accent,
}: {
  value: number;
  label: string;
  ink: string;
  inkSoft: string;
  accent: string;
}) {
  return (
    <div
      className="flex flex-col items-center px-2 py-4 sm:py-5"
      style={{
        background: "rgba(255, 255, 255, 0.12)",
        border: `0.5px solid ${accent}44`,
        borderRadius: 2,
        backdropFilter: "blur(2px)",
      }}
    >
      <span
        aria-hidden
        className="block h-px w-4"
        style={{ background: accent, opacity: 0.55 }}
      />
      <span
        className="mt-3"
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "clamp(28px, 7vw, 44px)",
          fontWeight: 300,
          color: ink,
          lineHeight: 1,
          letterSpacing: "0.01em",
          fontVariantNumeric: "lining-nums",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        className="mt-3 text-[9px] uppercase"
        style={{
          color: inkSoft,
          letterSpacing: "0.32em",
          fontWeight: 300,
        }}
      >
        {label}
      </span>
    </div>
  );
}
