"use client";

/**
 * StdSlotMachine — Save the Date "Slot Machine" ürünü.
 *
 * TDI paritesi (TheDigitalInvite "Slot Machine STD" demo): 3 reel
 * casino slot, "Pull the lever" tap → 2.5s mechanical spin → couple'ın
 * gerçek tarihinde durur → Save the Date + couple name reveal.
 *
 * Standalone mini-game STD. NUVE'nin mevcut SlotPicker'ından
 * (iPhone wheel) farklı — casino slot vibes + mechanical sound.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAudio, SHARED_SFX } from "@/lib/audio/audio-context";

interface Props {
  coupleName: string;
  monogram?: string;
  /** Hedef tarih: { day, month, year } string array. Spin sonunda burada durur. */
  targetDate: { day: string; month: string; year: string };
  venue?: string;
  ctaLabel?: string;
  saveTheDateLabel?: string;
}

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const MONTHS_TR = [
  "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
  "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK",
];
const YEARS = ["2026", "2027", "2028"];

export function StdSlotMachine({
  coupleName,
  monogram,
  targetDate,
  venue,
  ctaLabel = "Kolu Çek",
  saveTheDateLabel = "Save the Date",
}: Props) {
  const [stage, setStage] = useState<"idle" | "spinning" | "revealed">("idle");
  const [day, setDay] = useState(DAYS[0]);
  const [month, setMonth] = useState(MONTHS_TR[0]);
  const [year, setYear] = useState(YEARS[0]);
  const audio = useAudio();

  const dayIntervalRef = useRef<number | null>(null);
  const monthIntervalRef = useRef<number | null>(null);
  const yearIntervalRef = useRef<number | null>(null);

  const pull = () => {
    if (stage !== "idle") return;
    setStage("spinning");
    audio.playSfx(SHARED_SFX.envelopeOpen, { volume: 0.4 });
    audio.setMuted(false);
    void audio.unlock();

    // Cycle through values rapidly
    dayIntervalRef.current = window.setInterval(() => {
      setDay(DAYS[Math.floor(Math.random() * DAYS.length)]);
    }, 60);
    monthIntervalRef.current = window.setInterval(() => {
      setMonth(MONTHS_TR[Math.floor(Math.random() * MONTHS_TR.length)]);
    }, 60);
    yearIntervalRef.current = window.setInterval(() => {
      setYear(YEARS[Math.floor(Math.random() * YEARS.length)]);
    }, 60);

    // Stop reels one by one (mechanical staggered stop)
    window.setTimeout(() => {
      if (dayIntervalRef.current) clearInterval(dayIntervalRef.current);
      setDay(String(targetDate.day).padStart(2, "0"));
      audio.playSfx(SHARED_SFX.sealShatter, { volume: 0.3 });
    }, 1400);

    window.setTimeout(() => {
      if (monthIntervalRef.current) clearInterval(monthIntervalRef.current);
      setMonth(targetDate.month.toUpperCase());
      audio.playSfx(SHARED_SFX.sealShatter, { volume: 0.3 });
    }, 2000);

    window.setTimeout(() => {
      if (yearIntervalRef.current) clearInterval(yearIntervalRef.current);
      setYear(String(targetDate.year));
      audio.playSfx(SHARED_SFX.ceremonialChime, { volume: 0.7 });
      setStage("revealed");
    }, 2600);
  };

  useEffect(() => {
    return () => {
      [dayIntervalRef, monthIntervalRef, yearIntervalRef].forEach((r) => {
        if (r.current) clearInterval(r.current);
      });
    };
  }, []);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12"
      style={{
        background:
          "radial-gradient(circle at center, #1A1208 0%, #0F0905 70%, #050302 100%)",
      }}
    >
      {/* Subtle gold particle backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(212, 161, 88, 0.12), transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(212, 161, 88, 0.08), transparent 50%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full max-w-[560px] flex-col items-center text-center"
      >
        {/* Eyebrow */}
        <span
          className="text-[10px] uppercase tracking-[0.5em]"
          style={{
            color: "#D4A158",
            fontFamily: "var(--font-display), serif",
          }}
        >
          NUVE · Save the Date
        </span>

        {/* Couple monogram */}
        {monogram && (
          <span
            className="mt-6"
            style={{
              fontFamily: "var(--font-calligraphy), cursive",
              fontSize: 72,
              lineHeight: 1,
              color: "#D4A158",
            }}
          >
            {monogram}
          </span>
        )}

        <span
          className="mt-2 italic"
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(20px, 4vw, 28px)",
            color: "#F2EAD3",
            fontWeight: 400,
          }}
        >
          {coupleName}
        </span>

        {/* Slot machine — 3 reels */}
        <div
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-[14px] p-5 sm:gap-3 sm:p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(212, 161, 88, 0.18) 0%, rgba(120, 90, 50, 0.08) 100%)",
            border: "1px solid rgba(212, 161, 88, 0.4)",
            boxShadow:
              "inset 0 2px 8px rgba(0,0,0,0.4), 0 12px 40px -8px rgba(212, 161, 88, 0.25)",
          }}
        >
          <Reel value={day} spinning={stage === "spinning"} />
          <ReelSeparator />
          <Reel value={month} spinning={stage === "spinning"} wide />
          <ReelSeparator />
          <Reel value={year} spinning={stage === "spinning"} />
        </div>

        {/* CTA: Pull the lever / Save the Date label */}
        {stage === "idle" ? (
          <motion.button
            type="button"
            onClick={pull}
            data-cursor="magnetic"
            data-cursor-label={ctaLabel}
            aria-label={ctaLabel}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 inline-flex items-center justify-center gap-3 rounded-full px-9 py-3.5 transition-all"
            style={{
              background:
                "linear-gradient(180deg, #D4A158 0%, #B8862F 100%)",
              color: "#1A1208",
              fontFamily: "var(--font-display), serif",
              fontSize: 13,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontWeight: 500,
              boxShadow:
                "0 8px 24px -6px rgba(212, 161, 88, 0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
              cursor: "pointer",
            }}
          >
            <span aria-hidden>⤴</span>
            <span>{ctaLabel}</span>
          </motion.button>
        ) : stage === "revealed" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center"
          >
            <span
              className="uppercase"
              style={{
                fontSize: 13,
                letterSpacing: "0.5em",
                color: "#D4A158",
                fontFamily: "var(--font-display), serif",
                fontWeight: 500,
              }}
            >
              {saveTheDateLabel}
            </span>
            {venue && (
              <span
                className="mt-4 italic"
                style={{
                  fontSize: 15,
                  color: "rgba(242, 234, 211, 0.78)",
                  fontFamily: "var(--font-display), serif",
                }}
              >
                {venue}
              </span>
            )}
          </motion.div>
        ) : (
          <div className="mt-10 h-12" />
        )}
      </motion.div>
    </main>
  );
}

function Reel({ value, spinning, wide }: { value: string; spinning: boolean; wide?: boolean }) {
  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={{
        width: wide ? "clamp(110px, 22vw, 160px)" : "clamp(72px, 14vw, 110px)",
        height: "clamp(80px, 14vw, 110px)",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(20,12,4,0.7) 100%)",
        border: "1px solid rgba(212, 161, 88, 0.35)",
        borderRadius: 4,
        boxShadow:
          "inset 0 4px 12px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(212, 161, 88, 0.18)",
      }}
    >
      <motion.span
        key={value}
        initial={spinning ? { y: -8, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.06 }}
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: "clamp(22px, 5vw, 36px)",
          color: spinning ? "rgba(242, 234, 211, 0.75)" : "#D4A158",
          fontWeight: 500,
          letterSpacing: "0.04em",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </motion.span>
    </div>
  );
}

function ReelSeparator() {
  return (
    <span
      aria-hidden
      style={{
        color: "rgba(212, 161, 88, 0.6)",
        fontSize: 18,
        fontFamily: "var(--font-display), serif",
      }}
    >
      ·
    </span>
  );
}
