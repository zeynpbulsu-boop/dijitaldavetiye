"use client";

/**
 * WaxSealLuxe — FAZ 5.11.2 (gerçek alpha PNG)
 *
 * PNG'nin beyaz BG'si Pillow ile transparent yapıldı — artık blend
 * mode tricks gerekmiyor. Direkt <img> kullan, herhangi bir zemine
 * (cream / dark sage / navy) sorunsuz otur.
 */

import { motion } from "framer-motion";

interface WaxSealLuxeProps {
  size?: number;
  rotate?: number;
  delay?: number;
  className?: string;
  /** Geriye uyumluluk — kullanılmıyor, alpha gerçek transparency. */
  bgColor?: string;
  /** Hafif aura halo rengi. */
  haloColor?: string;
}

export function WaxSealLuxe({
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
      {/* Aura halo */}
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
        src="/aethel/wax-seal-luxe.png"
        alt="Mühür — Defne & Aras"
        width={size}
        height={size}
        draggable={false}
        style={{
          width: size,
          height: size,
          userSelect: "none",
          filter: "drop-shadow(0 18px 32px rgba(60, 70, 50, 0.20))",
        }}
      />
    </motion.div>
  );
}
