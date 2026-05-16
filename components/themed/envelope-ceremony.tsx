"use client";

/**
 * EnvelopeCeremony — FAZ 5.9
 *
 * Pressed Love'un ana yakalama unsuru: tam ekran koyu zemin + wax seal
 * + "TAP TO OPEN" pill. Click → 2.5sn breaking → opening animation →
 * onOpened callback ile davetiye içeriği fade in.
 *
 * Sahne:
 *   sealed     — wax seal solid, "Davetiyeyi Aç" pill, hafif breathe
 *   breaking   — wax seal hafif sallanır, ses çalmaya başlar, ışın patlar
 *   opening    — wax seal yukarı çekilir + scale fade out, içerik gelir
 *   opened     — wrapper kendini gizler, callback tetiklenir
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { WaxSealMonogram } from "./wax-seal-monogram";

interface EnvelopeCeremonyProps {
  /** Davetiye sahibi(leri)nin monogram harfleri. */
  monogram: string;
  /** Karşılama satırı (uppercase eyebrow). */
  greeting?: string;
  /** CTA buton metni. */
  ctaLabel?: string;
  /** Tema renkleri. */
  bgColor: string;
  /** Wax seal base color (sage / bordo / vb.). */
  sealColor: string;
  /** Highlight color (radial gradient top). */
  highlightColor?: string;
  /** Shadow color (radial gradient bottom). */
  shadowColor?: string;
  /** Text color (eyebrow + cta). */
  inkColor: string;
  /** Açıldığında çağrılır — parent state'i flip eder. */
  onOpened: () => void;
}

type Stage = "sealed" | "breaking" | "opening";

export function EnvelopeCeremony({
  monogram,
  greeting = "Bir davet sizi bekliyor",
  ctaLabel = "Davetiyeyi Aç",
  bgColor,
  sealColor,
  highlightColor,
  shadowColor,
  inkColor,
  onOpened,
}: EnvelopeCeremonyProps) {
  const [stage, setStage] = useState<Stage>("sealed");

  function open() {
    if (stage !== "sealed") return;
    setStage("breaking");
    // Ses opsiyonel — burada yumuşak "mühür kırılma" sesi tetiklenebilir
    window.setTimeout(() => setStage("opening"), 900);
    window.setTimeout(() => onOpened(), 2500);
  }

  // Background-only — body scroll'u kilitle, sayfa kayar görünmesin
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
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
        style={{ background: bgColor, color: inkColor }}
      >
        {/* Soft vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 30%, ${bgColor} 100%)`,
          }}
        />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: stage === "sealed" ? 0.85 : 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mb-16 text-[10px] uppercase"
          style={{
            color: `${inkColor}99`,
            letterSpacing: "0.42em",
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
                  // Hafif sallanma — kırılma anı
                  rotate: [-8, -4, -12, -6, -10, -8],
                  scale: [1, 1.04, 1.02, 1.06, 1.03, 1.05],
                }
              : stage === "opening"
              ? {
                  // Yukarı uçar + büyür + saydam
                  y: -180,
                  scale: 1.45,
                  opacity: 0,
                  rotate: -28,
                }
              : {
                  // Sealed — yumuşak nefes
                  scale: [1, 1.02, 1],
                  rotate: -8,
                }
          }
          transition={
            stage === "breaking"
              ? { duration: 0.9, ease: "easeInOut" }
              : stage === "opening"
              ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
              : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* Aura halkası — wax seal etrafında soft glow */}
          <motion.div
            aria-hidden
            className="absolute inset-0 -m-12 rounded-full"
            style={{
              background: `radial-gradient(circle, ${sealColor}55 0%, transparent 60%)`,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.85, 1.15, 0.85],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <WaxSealMonogram
            monogram={monogram}
            baseColor={sealColor}
            highlightColor={highlightColor}
            shadowColor={shadowColor}
            inkColor={inkColor}
            size={240}
          />
        </motion.div>

        {/* Breaking sırasında ışın patlaması */}
        <AnimatePresence>
          {stage === "breaking" && (
            <motion.div
              aria-hidden
              key="burst"
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.7, 0], scale: [0.3, 2.4, 3.2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute"
              style={{
                width: 240,
                height: 240,
                background: `radial-gradient(circle, ${sealColor}99 0%, transparent 70%)`,
                borderRadius: "50%",
              }}
            />
          )}
        </AnimatePresence>

        {/* CTA — Tap to open */}
        <motion.button
          type="button"
          onClick={open}
          aria-label={ctaLabel}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: stage === "sealed" ? 1 : 0, y: 0 }}
          transition={{ duration: 1.2, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-24 inline-flex items-center justify-center overflow-hidden px-12 py-4 transition-all hover:tracking-[0.42em]"
          style={{
            border: `1px solid ${inkColor}66`,
            color: inkColor,
            background: "transparent",
            borderRadius: 999,
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontWeight: 300,
            fontFamily: "var(--font-display), Georgia, serif",
            cursor: "pointer",
          }}
        >
          {/* Shimmer overlay — buton üstünden geçen altın parlama */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 0%, transparent 38%, ${inkColor}28 50%, transparent 62%, transparent 100%)`,
              animation: "shimmerSweep 4s ease-in-out infinite",
            }}
          />
          <span className="relative">{ctaLabel}</span>
        </motion.button>

        {/* Alt hint */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: stage === "sealed" ? 0.5 : 0 }}
          transition={{ duration: 1.0, delay: 2.2 }}
          className="relative z-10 mt-8 text-[9px] uppercase"
          style={{
            color: inkColor,
            letterSpacing: "0.36em",
            fontWeight: 300,
          }}
        >
          ↑ mührü kırın
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
