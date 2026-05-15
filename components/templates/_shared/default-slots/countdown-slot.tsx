"use client";

/**
 * Default Countdown Slot — FAZ 2B
 *
 * Reads edition CSS variables (--edition-ink, --edition-accent,
 * --edition-hairline) so visually it adopts whichever edition wraps
 * it. Editions that want a more bespoke countdown (e.g. Mansion
 * Lights' golden flicker numbers) override this slot entirely.
 */

import { useEffect, useMemo, useState } from "react";
import type { SlotProps } from "../slots";

function diffParts(targetMs: number, nowMs: number) {
  const ms = Math.max(0, targetMs - nowMs);
  const totalSec = Math.floor(ms / 1000);
  return {
    days:    Math.floor(totalSec / 86400),
    hours:   Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    expired: ms === 0,
  };
}

export function CountdownSlot({ data, editionSlug }: SlotProps) {
  const targetMs = useMemo(() => {
    const d = new Date(data.date);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
  }, [data.date]);

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (targetMs === null) return null;

  const parts = now === null
    ? { days: 0, hours: 0, minutes: 0, seconds: 0, expired: false }
    : diffParts(targetMs, now);

  return (
    <section
      data-slot="countdown"
      data-edition-slug={editionSlug}
      className="py-16 lg:py-24"
      style={{ color: "var(--edition-ink)" }}
    >
      <div className="container-tight mx-auto max-w-[680px] text-center">
        <div
          className="mb-6 text-[11px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: "var(--edition-accent)" }}
        >
          {parts.expired ? "Bugün" : "Geri sayım"}
        </div>
        <div
          className="grid grid-cols-4 gap-4"
          style={{ fontFamily: "var(--edition-display)" }}
        >
          {[
            { label: "gün",     value: parts.days },
            { label: "saat",    value: parts.hours },
            { label: "dakika",  value: parts.minutes },
            { label: "saniye",  value: parts.seconds },
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <span
                className="tabular-nums leading-none"
                style={{ fontSize: "clamp(32px, 4vw, 56px)" }}
                suppressHydrationWarning
              >
                {String(unit.value).padStart(2, "0")}
              </span>
              <span
                className="mt-2 text-[10px] uppercase tracking-[0.24em]"
                style={{ color: "var(--edition-ink-soft)" }}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
        <div
          className="mx-auto mt-10 h-px w-12"
          style={{ background: "var(--edition-hairline)" }}
        />
      </div>
    </section>
  );
}
