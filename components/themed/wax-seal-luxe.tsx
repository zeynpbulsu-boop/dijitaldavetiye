"use client";

/**
 * WaxSealLuxe — FAZ 5.12 (per-edition src)
 *
 * PNG'nin beyaz BG'si Pillow ile transparent yapıldı (alpha channel).
 * Her edisyon kendi wax seal asset'ini geçirir.
 */

import { motion } from "framer-motion";

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
}: WaxSealLuxeProps) {
  const sizeCss =
    minSize != null && minSize < size
      ? `clamp(${minSize}px, 35vw, ${size}px)`
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

      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          userSelect: "none",
          filter: "drop-shadow(0 18px 32px rgba(20, 20, 20, 0.25))",
        }}
      />
    </motion.div>
  );
}
