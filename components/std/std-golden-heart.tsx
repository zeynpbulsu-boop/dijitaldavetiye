"use client";

/**
 * StdGoldenHeart — Save the Date "Golden Heart Scratch" ürünü.
 *
 * TDI paritesi (TheDigitalInvite "Golden Heart STD" demo): kullanıcı
 * gold foil kalbi kazır → altından couple name + tarih + venue
 * çıkar. Mini-game STD formatı, NUVE'deki ScratchReveal mekaniğine
 * dayanır.
 *
 * Standalone ürün — LuxeEditionDemo ile alakası yok. Minimal layout:
 *   - Cream BG + soft watercolor florals
 *   - Gold foil heart center (scratch overlay)
 *   - Reveal: couple monogram + Save the Date + tarih + venue
 *   - Optional music chime on full reveal
 */

import { useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { ScratchReveal } from "@/components/themed/scratch-reveal";

interface Props {
  coupleName: string;
  monogram?: string;
  date: string;
  venue?: string;
  hint?: string;
  /** "Save the Date" alt etiket dili. */
  saveTheDateLabel?: string;
}

export function StdGoldenHeart({
  coupleName,
  monogram,
  date,
  venue,
  hint = "Kalbi kazı",
  saveTheDateLabel = "Save the Date",
}: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12"
      style={{
        background:
          "radial-gradient(circle at center, #F8F2E6 0%, #EFE6D2 70%, #E5DCC4 100%)",
      }}
    >
      {/* Soft watercolor ornament background (subtle, very low opacity) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(200, 140, 140, 0.08), transparent 50%),
                            radial-gradient(ellipse at 80% 70%, rgba(140, 180, 140, 0.08), transparent 50%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-full max-w-[520px] flex-col items-center text-center"
      >
        {/* Eyebrow */}
        <span
          className="text-[10px] uppercase tracking-[0.5em]"
          style={{ color: "#A88858", fontFamily: "var(--font-display), serif" }}
        >
          NUVE · Save the Date
        </span>

        {/* Gold heart scratch surface */}
        <div className="relative mt-10 flex h-[320px] w-[320px] items-center justify-center sm:h-[400px] sm:w-[400px]">
          {/* Heart SVG mask container */}
          <div
            style={{
              clipPath: "path('M200,360 C 90,260 30,180 30,110 C 30,55 75,20 120,20 C 160,20 185,42 200,75 C 215,42 240,20 280,20 C 325,20 370,55 370,110 C 370,180 310,260 200,360 Z')",
              WebkitClipPath: "path('M200,360 C 90,260 30,180 30,110 C 30,55 75,20 120,20 C 160,20 185,42 200,75 C 215,42 240,20 280,20 C 325,20 370,55 370,110 C 370,180 310,260 200,360 Z')",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <ScratchReveal
              surfaceColor="#C9A158"
              brushSize={42}
              threshold={0.35}
              hint={hint}
              hintColor="#FFFFFF"
            >
              {/* Reveal content — under the gold foil */}
              <div
                onAnimationStart={() => setRevealed(true)}
                className="flex h-full w-full flex-col items-center justify-center px-6 text-center"
                style={{
                  background:
                    "linear-gradient(180deg, #F2EAD3 0%, #F8F2E6 100%)",
                }}
              >
                {monogram && (
                  <span
                    style={{
                      fontFamily: "var(--font-calligraphy), cursive",
                      fontSize: 56,
                      lineHeight: 1,
                      color: "#5A3A28",
                    }}
                  >
                    {monogram}
                  </span>
                )}
                <span
                  className="mt-4 italic"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "clamp(22px, 5vw, 32px)",
                    lineHeight: 1.15,
                    color: "#2B1E16",
                    fontWeight: 400,
                  }}
                >
                  {coupleName}
                </span>
                <span
                  className="mt-3 uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.42em",
                    color: "#A88858",
                    fontWeight: 400,
                  }}
                >
                  {date}
                </span>
              </div>
            </ScratchReveal>
          </div>

          {/* Gold foil shine overlay (visual only, not interactive) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              clipPath: "path('M200,360 C 90,260 30,180 30,110 C 30,55 75,20 120,20 C 160,20 185,42 200,75 C 215,42 240,20 280,20 C 325,20 370,55 370,110 C 370,180 310,260 200,360 Z')",
              WebkitClipPath: "path('M200,360 C 90,260 30,180 30,110 C 30,55 75,20 120,20 C 160,20 185,42 200,75 C 215,42 240,20 280,20 C 325,20 370,55 370,110 C 370,180 310,260 200,360 Z')",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.25) 100%)",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* Save the Date footer */}
        <span
          className="mt-12 uppercase"
          style={{
            fontSize: 13,
            letterSpacing: "0.5em",
            color: "#2B1E16",
            fontFamily: "var(--font-display), serif",
            fontWeight: 400,
          }}
        >
          {saveTheDateLabel}
        </span>

        {venue && (
          <span
            className="mt-3 italic"
            style={{
              fontSize: 14,
              color: "#5A3A28",
              fontFamily: "var(--font-display), serif",
              opacity: 0.8,
            }}
          >
            {venue}
          </span>
        )}

        {/* Decorative bottom rule */}
        <div
          aria-hidden
          className="mt-10 h-px w-16"
          style={{ background: "#A88858", opacity: 0.4 }}
        />
      </motion.div>
    </main>
  );
}
