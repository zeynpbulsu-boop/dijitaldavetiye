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
}: WaxSealLuxeProps) {
  const isFluid = minSize != null && minSize < size;
  const sizeCss = isFluid ? `clamp(${minSize}px, 35vw, ${size}px)` : `${size}px`;
  /* Next/Image sizes hint — drives which AVIF/WebP variant the browser
     picks. Mobile renders at `minSize`, desktop at `size`. */
  const sizesAttr = isFluid
    ? `(max-width: 640px) ${minSize}px, ${size}px`
    : `${size}px`;

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
        aria-hidden
        className="pointer-events-none absolute -inset-10 rounded-full"
        style={{
          background: `radial-gradient(circle, ${haloColor}33 0%, transparent 60%)`,
        }}
        animate={{
          opacity: [0.4, 0.75, 0.4],
          scale: [0.85, 1.1, 0.85],
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
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
          filter: "drop-shadow(0 18px 32px rgba(20, 20, 20, 0.25))",
          objectFit: "contain",
        }}
      />
    </motion.div>
  );
}
