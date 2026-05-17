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
  size?: number;
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
  rotate = -6,
  delay = 0,
  className = "",
  haloColor = "#9EAA8E",
}: WaxSealLuxeProps) {
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
      style={{ width: size, height: size }}
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
          width: size,
          height: size,
          userSelect: "none",
          filter: "drop-shadow(0 18px 32px rgba(20, 20, 20, 0.25))",
        }}
      />
    </motion.div>
  );
}
