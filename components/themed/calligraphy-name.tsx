"use client";

/**
 * CalligraphyName — FAZ 5.2
 *
 * Çift isimlerini ekrana **stroke-by-stroke** yazar — sanki görünmez bir
 * mürekkepli kalem o anda yazıyormuş gibi. Pressed Love'ın yapamadığı şey.
 *
 * Teknik: gerçek font'un kontür (outline) text-stroke + clip-path width
 * animasyonu. SVG path tracing değil (her isim için path generate etmek
 * gerekirdi); bunun yerine text element üstüne mask hareket eder.
 *
 * Üç katman:
 *   1. Outline (text-stroke 0.6px) — sürekli görünür, ince hayalet
 *   2. Fill (solid color) — clip-path: inset right → 0 ile yavaşça açılır
 *   3. Cursor (görünmez kalem ucu) — mask'ın sağ kenarında küçük parıltı
 *
 * Render olduğu yerde audio ile senkronize edilebilir (waveform da
 * çalmaya başlar) — Hero entrance'ın "ah!" anı.
 */

import { motion, useReducedMotion } from "framer-motion";

interface CalligraphyNameProps {
  /** Tam isim (e.g. "Valentina & Marco"). */
  text: string;
  /** Ekran boyut — px. clamp ile responsive. Default 96. */
  size?: number;
  /** Tinta rengi. Default beyaza yakın. */
  color?: string;
  /** Outline ghost rengi. Default 22% opacity color. */
  ghostColor?: string;
  /** Yazma süresi (saniye). Default 4.5 — yavaş ve asil. */
  duration?: number;
  /** Başlangıç gecikmesi. Default 0.4. */
  delay?: number;
  className?: string;
}

export function CalligraphyName({
  text,
  size = 96,
  color = "#F2EAD3",
  ghostColor,
  duration = 4.5,
  delay = 0.4,
  className = "",
}: CalligraphyNameProps) {
  const prefersReduced = useReducedMotion();

  const ghost = ghostColor ?? `${color}38`; // ~22% opacity

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
        fontSize: `clamp(${size * 0.6}px, ${size / 12}vw, ${size * 1.4}px)`,
        lineHeight: 1,
        letterSpacing: "0.005em",
      }}
    >
      {/* Layer 1 — Outline ghost (her zaman görünür, hayalet) */}
      <span
        aria-hidden
        className="block"
        style={{
          color: "transparent",
          WebkitTextStroke: `0.7px ${ghost}`,
        }}
      >
        {text}
      </span>

      {/* Layer 2 — Fill (clip-path animate, sağdan sola açılır) */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 block"
        style={{ color }}
        initial={prefersReduced ? { clipPath: "inset(0 0 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
        animate={{ clipPath: "inset(0 0 0 0)" }}
        transition={{
          delay: prefersReduced ? 0 : delay,
          duration: prefersReduced ? 0.4 : duration,
          ease: [0.65, 0.05, 0.36, 1],  // mürekkep akış easing — yavaş başla, hızlan, yavaş bitir
        }}
      >
        {text}
      </motion.span>

      {/* Layer 3 — Accessible plain text (screen readers + selection) */}
      <span
        className="sr-only"
        style={{
          color,
        }}
      >
        {text}
      </span>
    </div>
  );
}
