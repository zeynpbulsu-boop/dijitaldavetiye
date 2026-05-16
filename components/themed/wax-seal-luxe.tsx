"use client";

/**
 * WaxSealLuxe — FAZ 5.11
 *
 * Fal.ai'den gelen pure-white-BG wax seal PNG'yi tema zeminine
 * şeffaf oturtur. mix-blend-mode: multiply → beyaz pikseller görünmez,
 * sage+altın kabartmalı seal kalır. Hover ile yumuşak sallanma + halo.
 */

import { motion } from "framer-motion";

interface WaxSealLuxeProps {
  size?: number;
  rotate?: number;
  delay?: number;
  className?: string;
  /** Hafif aura halo rengi — sage green default. */
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
        ease: [0.34, 1.56, 0.64, 1], // mühür basıldı gibi yaslanır
      }}
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Aura halo — radyal gradient yumuşak ışıma */}
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

      {/* Wax seal görseli — mix-blend-mode: multiply ile beyaz BG silinir */}
      <img
        src="/aethel/wax-seal-luxe.png"
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{
          width: size,
          height: size,
          mixBlendMode: "multiply",
          userSelect: "none",
          filter: "drop-shadow(0 14px 28px rgba(60, 70, 50, 0.18))",
        }}
      />
    </motion.div>
  );
}
