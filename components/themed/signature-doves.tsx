"use client";

/**
 * SignatureDoves — Aethel "Vespers Bell" signature moment (minimal).
 *
 * 2 küçük beyaz güvercin Hero coverScene üstünde diagonal uçar.
 * Pure SVG + CSS keyframes, GPU compositor, prefers-reduced-motion
 * (nuclear CSS rule) ile durdurulur.
 *
 * Subagent Faz 2 önerisi "Aethel: Doves Take Flight"in minimal
 * versiyonu (R3F GPGPU flock değil, CSS-only ucuz versiyon).
 */

import { useId } from "react";

export function SignatureDoves() {
  const id = useId();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
    >
      <style>{`
        @keyframes doveFlight1${id.replace(/:/g, "_")} {
          0% {
            transform: translate(110%, -10%) scale(0.6) rotate(-12deg);
            opacity: 0;
          }
          10% { opacity: 0.85; }
          90% { opacity: 0.85; }
          100% {
            transform: translate(-15%, 65%) scale(1.05) rotate(6deg);
            opacity: 0;
          }
        }
        @keyframes doveFlight2${id.replace(/:/g, "_")} {
          0% {
            transform: translate(95%, 8%) scale(0.5) rotate(-18deg);
            opacity: 0;
          }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% {
            transform: translate(-5%, 78%) scale(0.95) rotate(2deg);
            opacity: 0;
          }
        }
        @keyframes wingFlap${id.replace(/:/g, "_")} {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.6); }
        }
        .dove-1-${id.replace(/:/g, "_")} {
          position: absolute;
          top: 0;
          left: 0;
          width: 64px;
          height: 64px;
          animation: doveFlight1${id.replace(/:/g, "_")} 18s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .dove-2-${id.replace(/:/g, "_")} {
          position: absolute;
          top: 0;
          left: 0;
          width: 48px;
          height: 48px;
          animation: doveFlight2${id.replace(/:/g, "_")} 22s ease-in-out infinite 4s;
          will-change: transform, opacity;
        }
        .wing-${id.replace(/:/g, "_")} {
          transform-origin: 50% 50%;
          animation: wingFlap${id.replace(/:/g, "_")} 0.6s ease-in-out infinite;
        }
      `}</style>
      <DoveSvg className={`dove-1-${id.replace(/:/g, "_")}`} wingClass={`wing-${id.replace(/:/g, "_")}`} />
      <DoveSvg className={`dove-2-${id.replace(/:/g, "_")}`} wingClass={`wing-${id.replace(/:/g, "_")}`} />
    </div>
  );
}

function DoveSvg({ className, wingClass }: { className: string; wingClass: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Body */}
      <ellipse cx="32" cy="34" rx="14" ry="7" fill="white" opacity="0.92" />
      {/* Head */}
      <circle cx="46" cy="30" r="5" fill="white" opacity="0.92" />
      {/* Beak */}
      <path d="M51 30 L55 31 L51 32 Z" fill="rgba(184, 137, 90, 0.9)" />
      {/* Tail */}
      <path d="M20 34 L12 30 L14 36 L12 40 L20 36 Z" fill="white" opacity="0.85" />
      {/* Wings — animated */}
      <g className={wingClass}>
        <path
          d="M28 28 Q 32 16 40 22 Q 36 26 28 32 Z"
          fill="white"
          opacity="0.78"
        />
        <path
          d="M28 28 Q 32 16 40 22 Q 36 26 28 32 Z"
          fill="rgba(255,255,255,0.4)"
          transform="translate(0 2)"
        />
      </g>
      {/* Soft glow halo */}
      <circle cx="32" cy="32" r="22" fill="white" opacity="0.06" />
    </svg>
  );
}
