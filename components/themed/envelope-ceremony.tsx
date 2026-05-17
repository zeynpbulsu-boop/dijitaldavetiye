"use client";

/**
 * EnvelopeCeremony — FAZ 5.11
 *
 * Cream zemin + Fal.ai wax seal PNG (multiply ile şeffaf). Pressed Love'un
 * ana yakalama unsuru: tap → 900ms breaking → 1.6s opening → onOpened.
 *
 * Yeni: dark sage kalktı. Editorial cream (#EDE9DD) zemin, chapel watermark
 * 5% opacity arkada, wax seal merkezde mix-blend-multiply.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { WaxSealLuxe } from "./wax-seal-luxe";
import { ChapelWatermark } from "./chapel-watermark";

interface EnvelopeCeremonyProps {
  greeting?: string;
  ctaLabel?: string;
  bgColor: string;
  inkColor: string;
  /** Wax seal aura halo rengi. */
  haloColor?: string;
  /** Per-edition wax seal PNG path. */
  waxSealSrc?: string;
  /** Per-edition watermark PNG path. */
  watermarkSrc?: string;
  onOpened: () => void;
}

type Stage = "sealed" | "breaking" | "opening";

export function EnvelopeCeremony({
  greeting = "Bir davet sizi bekliyor",
  ctaLabel = "Davetiyeyi Aç",
  bgColor,
  inkColor,
  haloColor = "#9EAA8E",
  waxSealSrc,
  watermarkSrc,
  onOpened,
}: EnvelopeCeremonyProps) {
  const [stage, setStage] = useState<Stage>("sealed");

  function open() {
    if (stage !== "sealed") return;
    setStage("breaking");
    window.setTimeout(() => setStage("opening"), 900);
    window.setTimeout(() => onOpened(), 2500);
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="envelope-ceremony"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
        style={{ background: bgColor, color: inkColor }}
      >
        {/* Chapel watermark — 5% opacity arkada */}
        <ChapelWatermark position="absolute" opacity={0.05} maxWidth={900} bgColor={bgColor} src={watermarkSrc} />

        {/* Üst eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: stage === "sealed" ? 0.7 : 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-24 text-[10px] uppercase"
          style={{
            color: inkColor,
            letterSpacing: "0.5em",
            fontWeight: 300,
            fontFamily: "var(--font-display), Georgia, serif",
          }}
        >
          {greeting}
        </motion.div>

        {/* Wax seal — opening'de uçar */}
        <motion.div
          className="relative z-10"
          animate={
            stage === "breaking"
              ? {
                  rotate: [-6, -2, -10, -4, -8, -6],
                  scale: [1, 1.04, 1.02, 1.06, 1.03, 1.05],
                }
              : stage === "opening"
              ? {
                  y: -200,
                  scale: 1.5,
                  opacity: 0,
                  rotate: -24,
                }
              : {
                  scale: [1, 1.015, 1],
                  rotate: -6,
                }
          }
          transition={
            stage === "breaking"
              ? { duration: 0.9, ease: "easeInOut" }
              : stage === "opening"
              ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
              : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <WaxSealLuxe size={260} haloColor={haloColor} rotate={-6} bgColor={bgColor} src={waxSealSrc} />
        </motion.div>

        {/* Breaking burst — soft halo patlaması */}
        <AnimatePresence>
          {stage === "breaking" && (
            <motion.div
              aria-hidden
              key="burst"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.3, 2.2, 3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute"
              style={{
                width: 260,
                height: 260,
                background: `radial-gradient(circle, ${haloColor}66 0%, transparent 70%)`,
                borderRadius: "50%",
              }}
            />
          )}
        </AnimatePresence>

        {/* CTA — incecik pill, shimmer */}
        <motion.button
          type="button"
          onClick={open}
          aria-label={ctaLabel}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: stage === "sealed" ? 1 : 0, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-28 inline-flex items-center justify-center overflow-hidden px-16 py-4 transition-all hover:tracking-[0.46em]"
          style={{
            border: `0.5px solid ${inkColor}55`,
            color: inkColor,
            background: "transparent",
            borderRadius: 999,
            fontSize: 10,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            fontWeight: 300,
            fontFamily: "var(--font-display), Georgia, serif",
            cursor: "pointer",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 0%, transparent 42%, ${inkColor}1F 50%, transparent 58%, transparent 100%)`,
              animation: "shimmerSweep 5s ease-in-out infinite",
            }}
          />
          <span className="relative">{ctaLabel}</span>
        </motion.button>

        {/* Alt hint */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === "sealed" ? 0.45 : 0 }}
          transition={{ duration: 1.0, delay: 2.4 }}
          className="relative z-10 mt-10 text-[9px] uppercase"
          style={{
            color: inkColor,
            letterSpacing: "0.42em",
            fontWeight: 300,
          }}
        >
          ↑ mührü kırın
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
