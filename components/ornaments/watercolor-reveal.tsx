"use client";

/**
 * WatercolorReveal — FAZ 3.2
 *
 * Mevcut SVG çiçek hatlarının üzerine bir gradient mask yerleştirir ve
 * mask-position'ı framer-motion ile hareket ettirerek "yavaşça suluboya
 * boyanıyormuş" hissi yaratır. Çiçeği orta yere koymaz; köşeye
 * asimetrik yapışır (kullanıcı şartı).
 *
 * Kullanım:
 *   <WatercolorReveal corner="top-left" size={420} delay={0.8} duration={4}>
 *     <RoseVine size={420} opacity={1} />
 *   </WatercolorReveal>
 *
 * Mask CSS:
 *   - linear-gradient bottom→top  : boyama yukarı doğru gelir
 *   - radial-gradient at center   : ortadan dışa doğru açılır
 *   Default: radial (suluboya kâğıdına su damlasının açılması)
 *
 * Performans: tek bir CSS değişkeni (--reveal) animate edilir, layout
 * tetiklemez. prefers-reduced-motion'da 0.3sn'lik fade'e düşer.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Corner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left-mid"
  | "right-mid";

type MaskKind = "bleed" | "rise" | "wipe-r" | "wipe-l";

interface WatercolorRevealProps {
  children: ReactNode;
  /** Köşe yerleşimi (asimetrik, asla center değil). */
  corner?: Corner;
  /** Px cinsinden offset (köşeden negatif çıkar). Default 60. */
  inset?: number;
  /** Maske türü — su damlasının açılması, alttan yükselme, vs. */
  mask?: MaskKind;
  /** Saniye cinsinden başlangıç gecikmesi. Default 0.6. */
  delay?: number;
  /** Reveal süresi (saniye). Default 3.6 — suluboya gibi yavaş. */
  duration?: number;
  /** Opacity hedef (genelde 1, ornament için 0.4-0.7). Default 0.85. */
  opacity?: number;
  /** Z-index — kompozisyonda nereye otursun. Default 0. */
  zIndex?: number;
  /** Hafif scroll parallax — köşelerdeki çiçekler için. Default true. */
  parallax?: boolean;
}

const CORNER_POSITIONS: Record<Corner, { top?: string; bottom?: string; left?: string; right?: string }> = {
  "top-left":     { top: "var(--watercolor-inset)",    left: "var(--watercolor-inset)" },
  "top-right":    { top: "var(--watercolor-inset)",    right: "var(--watercolor-inset)" },
  "bottom-left":  { bottom: "var(--watercolor-inset)", left: "var(--watercolor-inset)" },
  "bottom-right": { bottom: "var(--watercolor-inset)", right: "var(--watercolor-inset)" },
  "left-mid":     { top: "40%",                        left: "var(--watercolor-inset)" },
  "right-mid":    { top: "55%",                        right: "var(--watercolor-inset)" },
};

const MASK_FROM: Record<MaskKind, string> = {
  // Su damlası — ortadan dışa açılır
  bleed: "radial-gradient(ellipse 8% 8% at 50% 50%, #000 0%, transparent 80%)",
  // Alttan suluboya yukarı yürür
  rise: "linear-gradient(to top, #000 0%, transparent 0.001%)",
  // Soldan sağa fırça darbesi
  "wipe-r": "linear-gradient(to right, #000 0%, transparent 0.001%)",
  // Sağdan sola fırça darbesi
  "wipe-l": "linear-gradient(to left, #000 0%, transparent 0.001%)",
};

const MASK_TO: Record<MaskKind, string> = {
  bleed: "radial-gradient(ellipse 140% 140% at 50% 50%, #000 0%, #000 60%, transparent 100%)",
  rise: "linear-gradient(to top, #000 0%, #000 100%, transparent 100%)",
  "wipe-r": "linear-gradient(to right, #000 0%, #000 100%, transparent 100%)",
  "wipe-l": "linear-gradient(to left, #000 0%, #000 100%, transparent 100%)",
};

export function WatercolorReveal({
  children,
  corner = "top-left",
  inset = 60,
  mask = "bleed",
  delay = 0.6,
  duration = 3.6,
  opacity = 0.85,
  zIndex = 0,
  parallax = true,
}: WatercolorRevealProps) {
  const prefersReduced = useReducedMotion();
  const pos = CORNER_POSITIONS[corner];

  // Parallax: çok hafif Y kayması, scroll-bound değil — entrance'a eklenir
  const parallaxY = parallax
    ? (corner.startsWith("top") ? -8 : 8)
    : 0;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        ["--watercolor-inset" as string]: `-${inset}px`,
        ...pos,
        zIndex,
        // Hafif çoklama: suluboyanın kağıttan içe geçişi
        mixBlendMode: "multiply",
        // Maske: önce hiç görünmez, sonra dolarak çiçek belirir
        WebkitMaskImage: MASK_FROM[mask],
        maskImage: MASK_FROM[mask],
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
      initial={{
        opacity: 0,
        y: parallaxY,
      }}
      animate={{
        opacity: prefersReduced ? opacity : opacity,
        y: 0,
        WebkitMaskImage: prefersReduced ? MASK_TO[mask] : MASK_TO[mask],
        maskImage: prefersReduced ? MASK_TO[mask] : MASK_TO[mask],
      }}
      transition={{
        // Suluboya genişlemesi yavaş ve doğal — silk easing
        delay: prefersReduced ? 0 : delay,
        duration: prefersReduced ? 0.3 : duration,
        ease: [0.22, 1, 0.36, 1],
        // Opacity ayrı hızda — su kağıda değer değmez görünür olur
        opacity: { delay: prefersReduced ? 0 : delay * 0.5, duration: 0.6 },
      }}
    >
      {children}
    </motion.div>
  );
}
