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

  /* Inline SVG fractalNoise — wax grain texture. baseFrequency 0.85
     gives fine-grain pigment scatter; turbulence is muted via
     feColorMatrix to ~12% alpha and slightly desaturated so it reads
     as surface roughness, not a noise filter. Encoded inline so no
     extra HTTP request. */
  const noiseDataUri = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.32'/></svg>")`;

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
        {/* Paper cradle — subtle linen weave just behind & beyond the
            seal. Reads as the cotton card the wax was pressed onto.
            Slight inner shadow vignette so the paper "dips" into the
            seal area (impression depth). Scaled larger than seal so
            it extends past the wax edge. */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            inset: "-14%",
            background:
              "radial-gradient(circle, rgba(247,242,232,0.42) 0%, rgba(247,242,232,0.12) 55%, transparent 78%)",
            borderRadius: "50%",
            filter: "blur(0.5px)",
            mixBlendMode: "lighten",
          }}
        />

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

        {/* Wax grain — fractal noise mask-clipped to seal. Bozulmamış
            AI render'ın smooth yüzeyini "molecular pigment scatter"
            ile kırar. mix-blend: overlay → koyu pigment alanları
            koyulaşır, açıklar aydınlanır → gerçek wax non-uniform
            renk hissi. Çok hafif (alpha 0.32) — abartılırsa kirli
            görünür. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: noiseDataUri,
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
            opacity: 0.55,
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

        {/* Edge softness — AI PNG'lerin perfect cut alpha kenarını
            kıran çok hafif blur halkası. Mührün dış sınırının 2-3px
            içinde ince yumuşama. Sadece outer edge'i etkiler çünkü
            mask sadece dış kenarda alpha sahip. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backdropFilter: "blur(0.4px)",
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
