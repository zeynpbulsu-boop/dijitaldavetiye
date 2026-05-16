"use client";

/**
 * Lovebirds — FAZ 3.3
 *
 * İncecik tek çizgi (1-line) çift kuş silueti.
 * Genelde monogram'ın altında veya zeytin dalının yanında bulunur.
 * Tek bir SVG path — gagaları birbirine değiyor, kanatlar küçük dalga.
 *
 * Naif ve samimi — lüks ama tatlış (kullanıcı şartı).
 * Asla cartoonish değil — minimal Japon sumi-e estetiği.
 *
 * stroke-dasharray ile çizilme animasyonu — kalem ucuyla çiziliyormuş gibi.
 */

import { motion, useReducedMotion } from "framer-motion";

interface LovebirdsProps {
  /** Genişlik (px). Default 80. */
  size?: number;
  /** Stroke rengi. Default ink-soft. */
  color?: string;
  /** Reveal gecikmesi. Default 1.4. */
  delay?: number;
  className?: string;
  /** Çizim süresi. Default 2.2. */
  duration?: number;
  /** "left" / "right" — gagaların hangi yönü göstereceği. Default "facing". */
  facing?: "facing" | "left" | "right";
}

export function Lovebirds({
  size = 80,
  color = "rgba(124, 105, 87, 0.85)",  // ink-soft
  delay = 1.4,
  duration = 2.2,
  className = "",
  facing = "facing",
}: LovebirdsProps) {
  const prefersReduced = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 80 50"
      width={size}
      height={size * 0.625}
      className={`pointer-events-none ${className}`}
      style={{ overflow: "visible" }}
    >
      {/* Sol kuş — gagası sağa dönük */}
      <motion.g
        initial={{ opacity: 0, x: -3 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d="M 8 30 Q 14 22 22 24 Q 28 26 32 28 L 36 30 L 32 30 L 36 30"
          fill="none"
          stroke={color}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay, duration: prefersReduced ? 0.3 : duration, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Kanat — küçük yay */}
        <motion.path
          d="M 16 26 Q 19 19 25 22"
          fill="none"
          stroke={color}
          strokeWidth="0.7"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ delay: delay + 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Göz — minik nokta */}
        <motion.circle
          cx="28"
          cy="26"
          r="0.7"
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 1.2, duration: 0.3 }}
        />
      </motion.g>

      {/* Sağ kuş — gagası sola dönük (lovebirds — gagalar birbirine değer) */}
      <motion.g
        initial={{ opacity: 0, x: 3 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: delay + 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d="M 72 30 Q 66 22 58 24 Q 52 26 48 28 L 44 30 L 48 30 L 44 30"
          fill="none"
          stroke={color}
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.15, duration: prefersReduced ? 0.3 : duration, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d="M 64 26 Q 61 19 55 22"
          fill="none"
          stroke={color}
          strokeWidth="0.7"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ delay: delay + 0.75, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="52"
          cy="26"
          r="0.7"
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 1.35, duration: 0.3 }}
        />
      </motion.g>

      {/* İki minik kalp — gagalar arasında, sevgi sembolü */}
      <motion.path
        d="M 40 28 c -1 -1.4 -3 -1 -3 0.6 c 0 1.4 3 3 3 3 s 3 -1.6 3 -3 c 0 -1.6 -2 -2 -3 -0.6 Z"
        fill={color}
        opacity="0.6"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{
          delay: delay + 1.6,
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "40px 30px" }}
      />
    </svg>
  );
}

/* ── Tek çizgi kalp silueti (alternatif charm) ─────────────────────── */

export function TinyHeartLine({
  size = 24,
  color = "rgba(193, 145, 75, 0.7)",
  delay = 1.0,
  className = "",
}: {
  size?: number;
  color?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
    >
      <motion.path
        d="M 12 20 C 6 14, 2 10, 2 6 C 2 3, 4 2, 6 2 C 9 2, 12 4, 12 6 C 12 4, 15 2, 18 2 C 20 2, 22 3, 22 6 C 22 10, 18 14, 12 20 Z"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
