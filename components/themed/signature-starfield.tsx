"use client";

/**
 * SignatureStarfield — Nocturne minimal starfield overlay.
 *
 * 24 küçük yıldız Hero üzerinde twinkle eder. Pure SVG + CSS keyframes,
 * GPU compositor, prefers-reduced-motion (nuclear CSS rule) ile durdurulur.
 *
 * Subagent Faz 2 önerisinin ("Nocturne: Ink Bloom" — WebGPU
 * Navier-Stokes) yanına ek bir minimal starfield katmanı.
 */

import { useId, useMemo } from "react";

export function SignatureStarfield() {
  const id = useId().replace(/:/g, "_");
  /* 24 yıldız — stabil pozisyon (Math.seedrandom yok, deterministik). */
  const stars = useMemo(() => {
    const out: Array<{ x: number; y: number; size: number; delay: number; dur: number; opacity: number }> = [];
    // Pseudo-random ama deterministik pattern
    for (let i = 0; i < 24; i++) {
      const px = (i * 37) % 100;
      const py = (i * 53 + 17) % 60;
      out.push({
        x: px,
        y: py,
        size: 1 + (i % 4) * 0.6,
        delay: (i * 0.4) % 6,
        dur: 3 + (i % 5) * 0.7,
        opacity: 0.55 + (i % 3) * 0.15,
      });
    }
    return out;
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
    >
      <style>{`
        @keyframes starTwinkle_${id} {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: `${s.y}%`,
            left: `${s.x}%`,
            width: s.size * 2,
            height: s.size * 2,
            borderRadius: "50%",
            background: i % 5 === 0 ? "#D4A158" : "#FFFFFF",
            boxShadow: `0 0 ${s.size * 3}px ${i % 5 === 0 ? "rgba(212,161,88,0.8)" : "rgba(255,255,255,0.7)"}`,
            opacity: s.opacity,
            animation: `starTwinkle_${id} ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
}
