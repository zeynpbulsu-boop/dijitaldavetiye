"use client";

/**
 * SignatureLeaves — Olea "Wind Through the Grove" signature moment (minimal).
 *
 * 5 küçük zeytin yaprağı Hero üstünde yavaşça düşer, rüzgârla diagonal
 * kayar. Subagent Faz 2 önerisinin ("Olea: Wind Through the Grove" —
 * R3F instanced 50k leaves + Rapier physics) CSS-only minimal versiyonu.
 *
 * Pure SVG + CSS keyframes, GPU compositor, prefers-reduced-motion
 * (nuclear CSS rule) ile durdurulur.
 */

import { useId } from "react";

export function SignatureLeaves() {
  const id = useId().replace(/:/g, "_");
  const leaves = [
    { x: 12, delay: 0, dur: 14, size: 22, sway: 18 },
    { x: 28, delay: 3, dur: 17, size: 16, sway: 22 },
    { x: 50, delay: 6, dur: 12, size: 26, sway: 16 },
    { x: 72, delay: 1, dur: 16, size: 18, sway: 24 },
    { x: 88, delay: 4, dur: 15, size: 20, sway: 14 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
    >
      <style>{`
        @keyframes leafFall_${id} {
          0% {
            transform: translateY(-12%) translateX(0) rotate(-12deg);
            opacity: 0;
          }
          10% { opacity: 0.7; }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(115%) translateX(var(--sway, 18px)) rotate(48deg);
            opacity: 0;
          }
        }
      `}</style>
      {leaves.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: `${l.x}%`,
            width: l.size,
            height: l.size,
            animation: `leafFall_${id} ${l.dur}s linear infinite`,
            animationDelay: `${l.delay}s`,
            ["--sway" as string]: `${l.sway}px`,
            willChange: "transform, opacity",
          }}
        >
          {/* Olive leaf shape */}
          <path
            d="M12 2 C 16 4 19 9 18 14 C 17 19 13 22 12 22 C 11 22 7 19 6 14 C 5 9 8 4 12 2 Z"
            fill="rgba(122, 138, 110, 0.7)"
            stroke="rgba(94, 100, 80, 0.4)"
            strokeWidth="0.4"
          />
          {/* Center vein */}
          <line x1="12" y1="3" x2="12" y2="21" stroke="rgba(94, 100, 80, 0.45)" strokeWidth="0.5" />
        </svg>
      ))}
    </div>
  );
}
