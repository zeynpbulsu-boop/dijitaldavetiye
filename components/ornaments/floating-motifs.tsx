"use client";

import { motion } from "framer-motion";

/**
 * FloatingMotifs — ambient page-wide decoration layer.
 *
 * Sits fixed behind the whole landing page (z-0, pointer-events-none).
 * Renders three families of motifs that drift slowly and never repeat
 * the same path twice:
 *
 *   • envelopes   — slow upward float, gentle sway, fade in/out
 *   • hearts      — small clusters, asymmetric rise + tilt
 *   • sparkles    — tiny ambient bokeh dots with cognac glow
 *
 * Positions and durations are deterministic so SSR matches CSR
 * (no hydration warnings, no per-render reshuffle).
 *
 * Drop once at the root of the landing page; sections still render
 * on top normally because they sit at z-[1] or higher.
 */

const ENVELOPES = [
  { left: "6%", dur: 28, delay: 0, sway: 18, rot: -6 },
  { left: "22%", dur: 34, delay: 6, sway: -14, rot: 4 },
  { left: "38%", dur: 30, delay: 12, sway: 16, rot: -2 },
  { left: "54%", dur: 32, delay: 4, sway: -16, rot: 6 },
  { left: "72%", dur: 36, delay: 9, sway: 12, rot: -4 },
  { left: "88%", dur: 30, delay: 2, sway: -18, rot: 5 },
];

const HEARTS = [
  { left: "12%", dur: 22, delay: 1.5, size: 14 },
  { left: "28%", dur: 24, delay: 8, size: 11 },
  { left: "44%", dur: 26, delay: 3, size: 16 },
  { left: "60%", dur: 23, delay: 10, size: 12 },
  { left: "78%", dur: 25, delay: 5, size: 14 },
  { left: "92%", dur: 22, delay: 7, size: 10 },
];

const SPARKLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 91) % 100}%`,
  top: `${(i * 47 + 7) % 100}%`,
  dur: 4 + ((i * 7) % 6),
  delay: (i * 1.3) % 8,
  size: 2 + (i % 3),
}));

export function FloatingMotifs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* ─── Envelopes — slow upward drift ────────────────────── */}
      {ENVELOPES.map((e, i) => (
        <motion.span
          key={`env-${i}`}
          className="absolute"
          style={{ left: e.left, bottom: "-8%" }}
          initial={{ y: 0, opacity: 0, rotate: e.rot, x: 0 }}
          animate={{
            y: ["0vh", "-118vh"],
            opacity: [0, 0.18, 0.22, 0.18, 0],
            x: [0, e.sway, -e.sway, e.sway / 2, 0],
            rotate: [e.rot, e.rot + 4, e.rot - 4, e.rot + 2, e.rot],
          }}
          transition={{
            duration: e.dur,
            delay: e.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.5, 0.9, 1],
          }}
        >
          <svg width="34" height="24" viewBox="0 0 34 24" style={{ color: "#8C5A3C" }}>
            <rect
              x="1"
              y="1"
              width="32"
              height="22"
              rx="1.5"
              fill="#F2EEE6"
              fillOpacity="0.65"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="0.9"
            />
            <path
              d="M 1 1 L 17 14 L 33 1"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="0.9"
              fill="none"
            />
            <circle cx="17" cy="14" r="1.6" fill="currentColor" fillOpacity="0.45" />
          </svg>
        </motion.span>
      ))}

      {/* ─── Hearts — asymmetric rise ──────────────────────────── */}
      {HEARTS.map((h, i) => (
        <motion.span
          key={`h-${i}`}
          className="absolute"
          style={{ left: h.left, bottom: "-6%" }}
          initial={{ y: 0, opacity: 0, scale: 0.8 }}
          animate={{
            y: ["0vh", "-115vh"],
            opacity: [0, 0.22, 0.22, 0],
            scale: [0.8, 1, 1, 0.9],
            rotate: [0, 12, -8, 6, 0],
          }}
          transition={{
            duration: h.dur,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.15, 0.85, 1],
          }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 20 18">
            <path
              d="M 10 17 C 4 12, 0 8, 0 4.5 C 0 1.5, 3 0, 5.5 0 C 7.5 0, 9 1, 10 2.5 C 11 1, 12.5 0, 14.5 0 C 17 0, 20 1.5, 20 4.5 C 20 8, 16 12, 10 17 Z"
              fill="#8C5A3C"
              fillOpacity="0.5"
            />
          </svg>
        </motion.span>
      ))}

      {/* ─── Sparkles — ambient bokeh field ────────────────────── */}
      {SPARKLES.map((s, i) => (
        <motion.span
          key={`s-${i}`}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: "#E8C8A7",
            boxShadow: "0 0 6px rgba(232,200,167,0.7)",
          }}
          animate={{
            opacity: [0, 0.85, 0.4, 0.85, 0],
            scale: [0.6, 1.1, 0.9, 1.2, 0.6],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
