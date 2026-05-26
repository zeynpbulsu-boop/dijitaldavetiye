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
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { WaxSealLuxe } from "./wax-seal-luxe";
import { ChapelWatermark } from "./chapel-watermark";
import { useAudio, SHARED_SFX } from "@/lib/audio/audio-context";

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
  /**
   * PR #26 — Per-edition envelope paper bg (fal.ai rendered).
   * Verildiğinde full-bleed gerçek zarf görseli mührün arkasında oturur
   * (Pressed Love Swan Lake paritesi). Verilmezse SVG flap çizgilerine
   * fallback yapılır.
   */
  envelopePaperSrc?: string;
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
  envelopePaperSrc,
  onOpened,
}: EnvelopeCeremonyProps) {
  const [stage, setStage] = useState<Stage>("sealed");
  const audio = useAudio();

  /* Time-of-day greeting — humanizes the opening moment.
     Client-only (no SSR mismatch via initial null). */
  const [timeOfDay, setTimeOfDay] = useState<string | null>(null);
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setTimeOfDay("Günaydın.");
    else if (h >= 12 && h < 17) setTimeOfDay("İyi öğleden sonralar.");
    else if (h >= 17 && h < 22) setTimeOfDay("İyi akşamlar.");
    else setTimeOfDay("Hoş geldiniz.");
  }, []);

  /* 12 wax fragment shards — random angles + distances, frozen per mount. */
  const fragments = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 180 + Math.random() * 140;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          rotate: (Math.random() - 0.5) * 540,
          size: 6 + Math.random() * 14,
          delay: Math.random() * 0.15,
        };
      }),
    []
  );

  function open() {
    if (stage !== "sealed") return;
    setStage("breaking");
    // Audio fire: envelope tear (lazy lib load)
    audio.playSfx(SHARED_SFX.envelopeOpen, { volume: 0.55 });
    // OTOMATIK MÜZIK — envelope tap = first user gesture, browser
    // autoplay policy unlock. setMuted(false) → unlock() → playAmbient.
    // edition slug envelope'tan props ile gelmiyor, ama caller
    // (LuxeEditionDemo) zaten UnmutePrompt mount edip ambient'i tetikliyor.
    // Burada sadece mute'u açıyoruz; ambient autoplay UnmutePrompt
    // refactor ile artık opened=true olunca otomatik başlar.
    audio.setMuted(false);
    void audio.unlock();
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
          data-cursor="open"
          data-cursor-label={skipLabel}
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

        {/* PR #26 — Real envelope paper bg (Pressed Love Swan Lake paritesi).
            Set edildiğinde fal.ai rendered zarf görseli full-bleed. Yoksa
            SVG flap çizgilerine fallback. */}
        {envelopePaperSrc ? (
          <div className="absolute inset-0">
            <Image
              src={envelopePaperSrc}
              alt=""
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {/* Yumuşak overlay — mühür merkezi vurgulu kalsın */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, transparent 30%, ${bgColor}55 70%, ${bgColor}AA 100%)`,
              }}
            />
          </div>
        ) : (
          <>
            {/* Chapel watermark — 5% opacity arkada (fallback) */}
            <ChapelWatermark position="absolute" opacity={0.05} maxWidth={900} bgColor={bgColor} src={watermarkSrc} />

            {/* Envelope flap çizgileri (SVG fallback) */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ mixBlendMode: "multiply", opacity: 0.32 }}
            >
              <line x1="0" y1="0" x2="50" y2="50" stroke={inkColor} strokeWidth="0.15" strokeOpacity="0.45" />
              <line x1="100" y1="0" x2="50" y2="50" stroke={inkColor} strokeWidth="0.15" strokeOpacity="0.45" />
              <line x1="0" y1="100" x2="50" y2="50" stroke={inkColor} strokeWidth="0.1" strokeOpacity="0.25" />
              <line x1="100" y1="100" x2="50" y2="50" stroke={inkColor} strokeWidth="0.1" strokeOpacity="0.25" />
            </svg>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, transparent 35%, ${inkColor}10 100%)`,
              }}
            />
          </>
        )}

        {/* Time-of-day salutation — incecik italic, mührün üstünde.
            Pressed Love minimalist hissini bozmadan, ziyaretçinin
            yerel zamanına göre tek satır karşılama. */}
        {timeOfDay && stage === "sealed" && (
          <motion.p
            aria-hidden
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-10 italic"
            style={{
              top: "max(15%, calc(var(--safe-top) + 4rem))",
              color: inkColor,
              opacity: 0.7,
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(14px, 2vw, 18px)",
              fontWeight: 300,
              letterSpacing: "0.02em",
            }}
          >
            {timeOfDay}
          </motion.p>
        )}

        {/* Wax seal — opening'de uçar. İdle stage'de pulsing scale
            KALDIRILDI (sahte hissi veriyordu); seal kağıda yapışmış
            sabit duruyor, WaxSealLuxe içinde çok hafif ±0.4° wobble
            zaten var (mum gibi dalgalanır). */}
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
                  rotate: -6,
                }
          }
          transition={
            stage === "breaking"
              ? { duration: 0.9, ease: "easeInOut" }
              : stage === "opening"
              ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.6, ease: "easeOut" }
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

        {/* White light flash — 220ms at break, very subtle */}
        <AnimatePresence>
          {stage === "breaking" && (
            <motion.div
              aria-hidden
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.45, 0] }}
              transition={{ duration: 0.55, times: [0, 0.25, 1], ease: "easeOut" }}
              className="pointer-events-none absolute inset-0"
              style={{ background: "#ffffff" }}
            />
          )}
        </AnimatePresence>

        {/* Wax shards — 12 fragments fly outward at break */}
        <AnimatePresence>
          {(stage === "breaking" || stage === "opening") &&
            fragments.map((f) => (
              <motion.span
                aria-hidden
                key={`frag-${f.id}`}
                initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  x: f.x,
                  y: f.y,
                  scale: 1,
                  rotate: f.rotate,
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 1.4,
                  delay: f.delay,
                  ease: [0.16, 1, 0.3, 1],
                  times: [0, 0.15, 0.7, 1],
                }}
                className="pointer-events-none absolute"
                style={{
                  width: f.size,
                  height: f.size,
                  background: haloColor,
                  borderRadius: f.size > 12 ? 2 : 9999,
                  boxShadow: `0 2px 6px ${haloColor}88`,
                  willChange: "transform, opacity",
                }}
              />
            ))}
        </AnimatePresence>

        {/* CTA — incecik pill, mail icon + shimmer. PR #22: mail icon
            eklendi (PL paritesi). */}
        <motion.button
          type="button"
          onClick={open}
          aria-label={ctaLabel}
          data-cursor="magnetic"
          data-cursor-label={ctaLabel}
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
