"use client";

/**
 * WaxSealLuxe — FAZ 5.12 (per-edition src) / FAZ A.2 (Next/Image)
 *
 * PNG'nin beyaz BG'si Pillow ile transparent yapıldı (alpha channel).
 * Her edisyon kendi wax seal asset'ini geçirir.
 *
 * Image: Next/Image fill mode emits AVIF/WebP srcsets at the imageSizes
 * tier defined in next.config.mjs. Parent wrapper is the sized box
 * (clamp(minSize,35vw,size)) — Image fills it and the browser picks
 * the closest srcset (120/200/320/420 covers our use cases).
 */

import { motion } from "framer-motion";
import Image from "next/image";

interface WaxSealLuxeProps {
  /** PNG path — default Aethel sage seal. */
  src?: string;
  alt?: string;
  /** Desktop / maximum render size (px). */
  size?: number;
  /**
   * Mobile / minimum render size (px). When provided and < size, the seal
   * scales fluidly via CSS clamp(minSize, 35vw, size). Defaults to size for
   * backwards-compat (no fluid scaling).
   */
  minSize?: number;
  rotate?: number;
  delay?: number;
  className?: string;
  /** Hafif aura halo rengi. */
  haloColor?: string;
  /**
   * Hero placement gets priority (LCP candidate). Default false; pass true
   * on the first wax seal above the fold so Next/Image preloads it.
   */
  priority?: boolean;
  /**
   * Migration 005 — couple'ın seçtiği wax seal tint rengi (hex).
   * Verildiğinde PNG'nin üstüne mix-blend-multiply overlay ile bindirir.
   * Null/undefined ise preset (PNG'nin kendi rengi) geçerli.
   */
  tintColor?: string | null;
  /** Geriye uyumluluk — kullanılmıyor. */
  bgColor?: string;
}

export function WaxSealLuxe({
  src = "/aethel/wax-seal-luxe.png",
  alt = "Mühür",
  size = 220,
  minSize,
  rotate = -6,
  delay = 0,
  className = "",
  haloColor = "#9EAA8E",
  priority = false,
  tintColor = null,
}: WaxSealLuxeProps) {
  const isFluid = minSize != null && minSize < size;
  const sizeCss = isFluid ? `clamp(${minSize}px, 35vw, ${size}px)` : `${size}px`;
  /* Next/Image sizes hint — drives which AVIF/WebP variant the browser
     picks. Mobile renders at `minSize`, desktop at `size`. */
  const sizesAttr = isFluid
    ? `(max-width: 640px) ${minSize}px, ${size}px`
    : `${size}px`;

  /* Subtle idle micro-rotation. Real wax doesn't pulse — sealed onto
     paper, it sits still. We give it the slightest "breathing" wobble
     (±0.4°) so it doesn't feel frozen, but no scaling, no opacity
     pulse. */
  const idle = {
    rotate: [rotate - 0.4, rotate + 0.4, rotate - 0.4],
  };

  /* Multi-layer shadow stack — recipe for a wax seal sitting on
     paper, not a Photoshop drop-shadow:
       1. Tight sharp shadow directly under the seal (paper contact)
       2. Mid radius warm undertone (cognac / brown bleed)
       3. Wider soft halo (ambient light occlusion)
     drop-shadow filters compose, so the layering reads as one
     continuous, physical shadow. */
  const shadowStack = [
    "drop-shadow(0 1px 1px rgba(20, 16, 12, 0.35))",
    "drop-shadow(0 6px 10px rgba(86, 54, 32, 0.22))",
    "drop-shadow(0 22px 32px rgba(40, 28, 18, 0.18))",
  ].join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, rotate: rotate - 14 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{
        delay,
        duration: 1.6,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`relative inline-block ${className}`}
      style={{ width: sizeCss, height: sizeCss }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={idle}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizesAttr}
          priority={priority}
          draggable={false}
          style={{
            userSelect: "none",
            filter: shadowStack,
            objectFit: "contain",
          }}
        />

        {/* Migration 005 — wax seal tint overlay. mix-blend-multiply
            PNG'nin desenini koruyarak rengi değiştirir. */}
        {tintColor && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: tintColor,
              mixBlendMode: "multiply",
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: `url(${src})`,
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        )}

        {/* Wax sheen — soft diagonal highlight emulates the way real
            sealing wax catches light. Clipped to the PNG alpha so it
            only paints on the wax surface, not the background. The
            gradient is very subtle (≈8% white at peak) — kayıp olursa
            seal flat görünür, fazla olursa plastik görünür. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 30%, transparent 55%, rgba(0,0,0,0.07) 100%)",
            mixBlendMode: "soft-light",
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: `url(${src})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
