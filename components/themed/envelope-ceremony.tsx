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

        {/* REAL ENVELOPE PHOTO — Etsy 2026 paritesi.
            Tek photorealistic shot: kapalı olive zarf + üzerinde basılı
            mühür (fal.ai flux-pro ultra render). CSS-drawn yapı yerine
            gerçek fotoğraf → fake/photoshop hissi yok.
            Click → fotoğraf scale up + fade out (kameranın yaklaşması
            hissi), envelope ceremony unmount, content görünür. */}
        <motion.button
          type="button"
          onClick={open}
          aria-label={ctaLabel}
          className="relative z-10 block cursor-pointer overflow-hidden rounded-md p-0"
          style={{
            width: "clamp(280px, 42vw, 520px)",
            aspectRatio: "4 / 3",
            border: "none",
            background: "transparent",
            boxShadow:
              "0 32px 70px -28px rgba(43,30,22,0.42), 0 10px 20px -8px rgba(43,30,22,0.22)",
          }}
          whileHover={
            stage === "sealed"
              ? { y: -6, scale: 1.015, boxShadow: "0 40px 90px -28px rgba(43,30,22,0.5)" }
              : undefined
          }
          whileTap={stage === "sealed" ? { scale: 0.99 } : undefined}
          animate={
            stage === "breaking"
              ? { scale: [1, 1.02, 0.995, 1.01, 1], rotate: [0, -0.4, 0.3, -0.2, 0] }
              : stage === "opening"
              ? { scale: 1.35, opacity: 0 }
              : { scale: 1, opacity: 1, rotate: 0 }
          }
          transition={
            stage === "breaking"
              ? { duration: 0.7, ease: "easeInOut" }
              : stage === "opening"
              ? { duration: 1.6, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.5, ease: "easeOut" }
          }
        >
          <Image
            src="/olea/envelope-sealed.jpg"
            alt="Davetiye zarfı"
            fill
            sizes="(max-width: 640px) 90vw, 520px"
            priority
            style={{ objectFit: "cover" }}
          />
          {/* Subtle warm vignette + hover glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(43,30,22,0.12) 100%)",
            }}
          />
        </motion.button>

        {/* HINT — zarfın altında ince calligraphic ipucu metni.
            Zarf zaten clickable, eski pill button kaldırıldı.
            "Click the envelope to open." Etsy paritesi. */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: stage === "sealed" ? 1 : 0, y: 0 }}
          transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-8 text-center italic sm:mt-10"
          style={{
            color: inkColor,
            opacity: 0.75,
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', Georgia, serif",
            fontSize: "clamp(18px, 2.4vw, 26px)",
            fontWeight: 400,
            letterSpacing: "0.01em",
          }}
        >
          Zarfa dokun, davetiyeyi aç
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
