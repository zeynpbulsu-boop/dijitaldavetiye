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
  /** Pressed Love paritesi — sağ üstte "Atla" linki etiketi. */
  skipLabel?: string;
  bgColor: string;
  inkColor: string;
  /** Wax seal aura halo rengi. */
  haloColor?: string;
  /** Per-edition wax seal PNG path. */
  waxSealSrc?: string;
  /** Migration 005 — couple-set wax seal tint (hex). */
  waxSealTint?: string | null;
  /** Per-edition watermark PNG path. */
  watermarkSrc?: string;
  onOpened: () => void;
}

type Stage = "sealed" | "breaking" | "opening";

export function EnvelopeCeremony({
  greeting = "Bir davet sizi bekliyor",
  ctaLabel = "Davetiyeyi Aç",
  skipLabel = "Atla",
  bgColor,
  inkColor,
  haloColor = "#9EAA8E",
  waxSealSrc,
  waxSealTint = null,
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
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 sm:px-8"
        style={{
          background: bgColor,
          color: inkColor,
          paddingTop: "max(1rem, var(--safe-top))",
          paddingBottom: "max(1rem, var(--safe-bottom))",
        }}
      >
        {/* Skip butonu — Pressed Love paritesi, animasyonu beğenmeyen
            kullanıcı doğrudan davetiyeye geçebilsin. */}
        <button
          type="button"
          onClick={() => onOpened()}
          aria-label={skipLabel}
          className="absolute right-4 top-4 z-20 inline-flex min-h-[36px] items-center justify-center rounded-full px-4 py-1 text-[10px] uppercase transition-all hover:tracking-[0.32em] sm:right-6 sm:top-6"
          style={{
            color: inkColor,
            background: "rgba(255,255,255,0.7)",
            border: `0.5px solid ${inkColor}30`,
            letterSpacing: "0.28em",
            fontWeight: 300,
            fontFamily: "var(--font-display), Georgia, serif",
            backdropFilter: "blur(6px)",
            paddingTop: "max(0.25rem, var(--safe-top))",
          }}
        >
          {skipLabel}
        </button>

        {/* Chapel watermark — 5% opacity arkada */}
        <ChapelWatermark position="absolute" opacity={0.05} maxWidth={900} bgColor={bgColor} src={watermarkSrc} />

        {/* PR #22 — Envelope flap & paper texture (Pressed Love paritesi).
            Cream paper background'a diyagonal flap çizgileri ekler;
            mühür gerçek bir zarfın üstünde oturuyormuş hissi. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ mixBlendMode: "multiply", opacity: 0.32 }}
        >
          {/* Top-left flap */}
          <line x1="0" y1="0" x2="50" y2="50" stroke={inkColor} strokeWidth="0.15" strokeOpacity="0.45" />
          {/* Top-right flap */}
          <line x1="100" y1="0" x2="50" y2="50" stroke={inkColor} strokeWidth="0.15" strokeOpacity="0.45" />
          {/* Left side */}
          <line x1="0" y1="100" x2="50" y2="50" stroke={inkColor} strokeWidth="0.1" strokeOpacity="0.25" />
          {/* Right side */}
          <line x1="100" y1="100" x2="50" y2="50" stroke={inkColor} strokeWidth="0.1" strokeOpacity="0.25" />
        </svg>
        {/* Paper grain — subtle vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, transparent 35%, ${inkColor}10 100%)`,
          }}
        />

        {/* Eyebrow kaldırıldı — Pressed Love paritesi (sade: sadece
            mühür + bütünleşik CTA). */}

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
          <WaxSealLuxe size={460} minSize={260} priority haloColor={haloColor} rotate={-6} bgColor={bgColor} src={waxSealSrc} tintColor={waxSealTint} />
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

        {/* CTA — incecik pill, mail icon + shimmer. PR #22: mail icon
            eklendi (PL paritesi). */}
        <motion.button
          type="button"
          onClick={open}
          aria-label={ctaLabel}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: stage === "sealed" ? 1 : 0, y: 0 }}
          transition={{ duration: 1.2, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mt-[-90px] sm:mt-[-120px] inline-flex items-center justify-center gap-3 overflow-hidden px-9 py-3.5 transition-all hover:tracking-[0.42em]"
          style={{
            border: `0.5px solid ${inkColor}88`,
            color: inkColor,
            background: `${bgColor}E6`,
            borderRadius: 999,
            fontSize: 11,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            fontWeight: 400,
            fontFamily: "var(--font-display), Georgia, serif",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            boxShadow: "0 6px 22px rgba(0,0,0,0.18)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(110deg, transparent 0%, transparent 42%, ${inkColor}24 50%, transparent 58%, transparent 100%)`,
              animation: "shimmerSweep 5s ease-in-out infinite",
            }}
          />
          {/* Mail icon — PL paritesi */}
          <svg
            aria-hidden
            width="14"
            height="11"
            viewBox="0 0 18 14"
            fill="none"
            className="relative"
            style={{ color: inkColor }}
          >
            <rect x="0.75" y="0.75" width="16.5" height="12.5" rx="1.5" stroke="currentColor" strokeWidth="1" />
            <path d="M1 2 L 9 8 L 17 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="relative">{ctaLabel}</span>
        </motion.button>

        {/* Hint kaldırıldı — Pressed Love paritesi. CTA mührün altında
            bütünleşik, ek metin albeni'yi düşürüyor. */}
      </motion.div>
    </AnimatePresence>
  );
}
