"use client";

/**
 * CountdownDetonation — T-0 ceremonial moment.
 *
 * CountdownLuxe `onReachZero` callback'ini bu component'e bağla:
 *   const [boom, setBoom] = useState(false);
 *   <CountdownLuxe ... onReachZero={() => setBoom(true)} />
 *   <CountdownDetonation triggered={boom} palette={...} />
 *
 * Triggered olunca paralel:
 *   1. Ceremonial chime (Tone.js / Howler)
 *   2. Full-screen white flash (800ms fade)
 *   3. 3-cannon confetti burst (palette renkleri)
 *   4. Wax seal shatter SFX (400ms gecikme)
 *
 * prefers-reduced-motion → flash + chime only, confetti yok.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useAudio, SHARED_SFX } from "@/lib/audio/audio-context";

interface Props {
  triggered: boolean;
  /** Palette colors for confetti pieces. */
  palette: {
    accent: string;
    ink: string;
    bg?: string;
  };
}

export function CountdownDetonation({ triggered, palette }: Props) {
  const { playSfx } = useAudio();
  const [flash, setFlash] = useState(false);
  const [shimmer, setShimmer] = useState(false);

  useEffect(() => {
    if (!triggered) return;
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Phase 1 — ceremonial chime
    playSfx(SHARED_SFX.ceremonialChime, { volume: 0.85 });

    // Phase 2 — fullscreen white flash
    setFlash(true);
    const flashTimer = window.setTimeout(() => setFlash(false), 800);

    // Phase 3 — confetti burst (skip if reduced motion)
    let confettiTimers: number[] = [];
    if (!reduced) {
      const colors = [
        palette.accent,
        palette.ink,
        palette.bg ?? "#FFFFFF",
        "#FFFFFF",
      ];

      // 3-cannon: left, center, right with slight stagger
      const cannon = (x: number, delay: number) => {
        const id = window.setTimeout(() => {
          confetti({
            particleCount: 90,
            spread: 65,
            startVelocity: 38,
            origin: { x, y: 0.55 },
            colors,
            ticks: 240,
            scalar: 1.05,
            gravity: 1.05,
            decay: 0.92,
          });
        }, delay);
        confettiTimers.push(id);
      };
      cannon(0.18, 80);
      cannon(0.5, 0);
      cannon(0.82, 80);

      // Secondary soft burst (gold dust)
      const secondaryTimer = window.setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 120,
          startVelocity: 25,
          origin: { x: 0.5, y: 0.45 },
          colors: [palette.accent, "#F2EAD3"],
          shapes: ["circle"],
          gravity: 0.65,
          decay: 0.94,
          scalar: 0.7,
        });
      }, 350);
      confettiTimers.push(secondaryTimer);
    }

    // Phase 4 — seal shatter SFX
    const shatterTimer = window.setTimeout(
      () => playSfx(SHARED_SFX.sealShatter, { volume: 0.75 }),
      400
    );

    // Phase 5 — palette shimmer rim (subtle glow ring expanding)
    const shimmerTimer = window.setTimeout(() => setShimmer(true), 200);
    const shimmerEndTimer = window.setTimeout(() => setShimmer(false), 1800);

    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(shatterTimer);
      window.clearTimeout(shimmerTimer);
      window.clearTimeout(shimmerEndTimer);
      confettiTimers.forEach((id) => window.clearTimeout(id));
    };
  }, [triggered, palette, playSfx]);

  return (
    <>
      {/* White flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 95,
              background: "#FFFFFF",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Accent-color shimmer rim (radial glow) */}
      <AnimatePresence>
        {shimmer && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.5, 0], scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 94,
              pointerEvents: "none",
              background: `radial-gradient(circle at center, ${palette.accent}44 0%, transparent 60%)`,
              mixBlendMode: "screen",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
