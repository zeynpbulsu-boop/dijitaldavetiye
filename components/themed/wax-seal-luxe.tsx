"use client";

/**
 * WaxSealLuxe — FAZ 5.11.1 (background-blend-mode FIX)
 *
 * Fal.ai'den gelen pure-white-BG wax seal PNG'yi tema zeminine
 * şeffaf oturtur. background-blend-mode: multiply kullanıyoruz
 * (mix-blend-mode framer-motion transform stacking context'inde
 * çalışmıyor — background-blend-mode element'in kendi BG color'ı
 * ile blend olur, stacking context'ten bağımsızdır).
 *
 * Formül: backgroundImage × backgroundColor (cream/sage/etc)
 *   - White pikseller × cream = cream → görünmez
 *   - Sage+altın pikseller → koyulaşır (daha derin) → editorial
 */

import { motion } from "framer-motion";

interface WaxSealLuxeProps {
  /** Tema zemini — beyaz BG'nin "yutulacağı" renk. Default cream. */
  bgColor?: string;
  size?: number;
  rotate?: number;
  delay?: number;
  className?: string;
  /** Hafif aura halo rengi — sage green default. */
  haloColor?: string;
}

export function WaxSealLuxe({
  bgColor = "#F2EEE4",
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

      {/* Wax seal — background-blend-mode ile beyaz BG silinir */}
      <div
        role="img"
        aria-label="Mühür — Defne & Aras"
        style={{
          width: size,
          height: size,
          backgroundImage: "url(/aethel/wax-seal-luxe.png)",
          backgroundColor: bgColor,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "multiply",
          filter: "drop-shadow(0 18px 32px rgba(60, 70, 50, 0.20))",
        }}
      />
    </motion.div>
  );
}
