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
            {/* Chapel watermark — 4.5% opacity, ortamı bezeyen taze
                bir leaf wreath. Eski SVG X çizgileri kaldırıldı
                (yeni gerçek zarf component'i ortada zaten var). */}
            <ChapelWatermark position="absolute" opacity={0.05} maxWidth={900} bgColor={bgColor} src={watermarkSrc} />
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

        {/* REAL ENVELOPE — Etsy 2026 paritesi.
            Dikdörtgen krem zarf gövdesi + üst flap (triangle clip).
            Flap'in ortasında küçük mühür (zarf üstünde stamp).
            Open click → flap yukarı rotateX ile açılır (3D perspective),
            sonra zarf tüm sahneden yukarı kayıp solar. */}
        <div
          className="relative z-10"
          style={{
            perspective: "900px",
            width: "clamp(280px, 38vw, 460px)",
            height: "clamp(200px, 27vw, 320px)",
          }}
        >
          {/* Body — sabit, perde gibi kalır */}
          <motion.div
            className="absolute inset-0"
            animate={
              stage === "opening"
                ? { y: -180, scale: 0.95, opacity: 0 }
                : { y: 0, scale: 1, opacity: 1 }
            }
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background:
                "linear-gradient(180deg, #FBFAF6 0%, #F4EFE4 100%)",
              borderRadius: 4,
              boxShadow:
                "0 24px 60px -22px rgba(43,30,22,0.32), 0 6px 14px -6px rgba(43,30,22,0.18), inset 0 0 0 0.5px rgba(43,30,22,0.12)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Lower V fold lines (envelope bottom) */}
            <svg
              aria-hidden
              viewBox="0 0 100 70"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full"
              style={{ opacity: 0.35 }}
            >
              <line x1="0" y1="100" x2="50" y2="55" stroke={inkColor} strokeWidth="0.18" strokeOpacity="0.6" />
              <line x1="100" y1="100" x2="50" y2="55" stroke={inkColor} strokeWidth="0.18" strokeOpacity="0.6" />
            </svg>
          </motion.div>

          {/* FLAP — üstte trapezoid, click'te rotateX ile açılır */}
          <motion.div
            className="absolute z-10 origin-top"
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(180deg, #F8F2E6 0%, #EDE4D2 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              WebkitClipPath: "polygon(0 0, 100% 0, 50% 100%)",
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              filter:
                stage === "opening"
                  ? undefined
                  : "drop-shadow(0 8px 18px rgba(43,30,22,0.18))",
            }}
            animate={
              stage === "breaking"
                ? { rotateX: [0, -4, 2, -3, 0] }
                : stage === "opening"
                ? { rotateX: -178, y: -190, opacity: 0 }
                : { rotateX: 0 }
            }
            transition={
              stage === "breaking"
                ? { duration: 0.6, ease: "easeInOut" }
                : stage === "opening"
                ? { duration: 1.5, ease: [0.34, 1, 0.4, 1] }
                : { duration: 0.4, ease: "easeOut" }
            }
          >
            {/* Flap iç fold çizgisi */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <line x1="0" y1="0" x2="50" y2="100" stroke={inkColor} strokeWidth="0.18" strokeOpacity="0.45" />
              <line x1="100" y1="0" x2="50" y2="100" stroke={inkColor} strokeWidth="0.18" strokeOpacity="0.45" />
            </svg>
          </motion.div>

          {/* WAX SEAL on flap — küçük (~70-90px), flap'in alt-orta noktasında.
              Flap açıldığında mühür de uçar (kırılır gibi opacity drop). */}
          <motion.div
            className="absolute z-20"
            style={{
              top: "calc(60% - 38px)",
              left: "50%",
              width: "clamp(70px, 9vw, 96px)",
              height: "clamp(70px, 9vw, 96px)",
              transform: "translateX(-50%)",
            }}
            animate={
              stage === "breaking"
                ? { scale: [1, 1.03, 0.99, 1.02, 1], rotate: [-3, -1, -5, -2, -3] }
                : stage === "opening"
                ? { y: -120, scale: 0.85, opacity: 0, rotate: -18 }
                : { rotate: -3, scale: 1 }
            }
            transition={
              stage === "breaking"
                ? { duration: 0.6, ease: "easeInOut" }
                : stage === "opening"
                ? { duration: 1.0, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.4, ease: "easeOut" }
            }
          >
            <WaxSealLuxe
              size={96}
              minSize={70}
              priority
              haloColor={haloColor}
              rotate={-3}
              bgColor={bgColor}
              src={waxSealSrc}
              tintColor={waxSealTint}
            />
          </motion.div>
        </div>

        {/* Light flash kaldırıldı — gerçek zarf açılışında flash yok,
            sadece flap'in rotateX hareketi yeterli. */}

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
