"use client";

/**
 * LaceFrame — FAZ 3.3
 *
 * Şampanya altın tonunda incecik dantel çerçeve.
 * Monogram'ın, mührün veya başlık'ın etrafına entegre edilir.
 * stroke-dasharray ile çizilme animasyonu — dantel sanki bir iğne ile
 * o anda örülüyor.
 *
 * Kullanım:
 *   <div className="relative inline-block">
 *     <LaceFrame size={220} />
 *     <span>{monogram}</span>
 *   </div>
 *
 * Doku: 0.6px stroke (cam saydam ipek), dashoffset ile çizilme,
 * radial mask ile köşeden açılma. Asla kalın, asla çiğ.
 */

import { motion, useReducedMotion } from "framer-motion";

interface LaceFrameProps {
  /** Çerçeve dış boyutu (px). Default 220. */
  size?: number;
  /** Stroke rengi — default şampanya altın. */
  stroke?: string;
  /** Reveal gecikmesi (saniye). Default 0.5. */
  delay?: number;
  /** Reveal süresi (saniye). Default 2.4 — ipek gibi yavaş. */
  duration?: number;
  /** Çerçeve tipi. */
  variant?: "oval" | "scallop" | "wreath";
  className?: string;
}

export function LaceFrame({
  size = 220,
  stroke = "rgba(193, 154, 91, 0.55)",  // şampanya altın, %55
  delay = 0.5,
  duration = 2.4,
  variant = "scallop",
  className = "",
}: LaceFrameProps) {
  const prefersReduced = useReducedMotion();

  return (
    <svg
      aria-hidden
      viewBox="0 0 220 220"
      width={size}
      height={size}
      className={`pointer-events-none absolute inset-0 m-auto ${className}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Sıvı altın gradient — düz altın yerine cam saydam */}
        <linearGradient id="lace-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(218, 175, 102, 0.0)" />
          <stop offset="15%" stopColor="rgba(218, 175, 102, 0.7)" />
          <stop offset="50%" stopColor="rgba(245, 220, 155, 0.95)" />
          <stop offset="85%" stopColor="rgba(193, 145, 75, 0.7)" />
          <stop offset="100%" stopColor="rgba(193, 145, 75, 0.0)" />
        </linearGradient>
        {/* İpek dokusu için ufak noise filter — kabartmalı yaprak gibi */}
        <filter id="silk-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" />
          <feColorMatrix values="0 0 0 0 0.85, 0 0 0 0 0.72, 0 0 0 0 0.45, 0 0 0 0.08 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {variant === "oval" && (
        <OvalLace stroke={stroke} prefersReduced={prefersReduced} delay={delay} duration={duration} />
      )}
      {variant === "scallop" && (
        <ScallopLace stroke={stroke} prefersReduced={prefersReduced} delay={delay} duration={duration} />
      )}
      {variant === "wreath" && (
        <WreathLace stroke={stroke} prefersReduced={prefersReduced} delay={delay} duration={duration} />
      )}
    </svg>
  );
}

/* ── Variants ─────────────────────────────────────────────────────── */

function OvalLace({ stroke, prefersReduced, delay, duration }: VariantProps) {
  return (
    <motion.ellipse
      cx="110"
      cy="110"
      rx="92"
      ry="106"
      fill="none"
      stroke="url(#lace-gold)"
      strokeWidth="0.6"
      strokeLinecap="round"
      strokeDasharray="2 3"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: prefersReduced ? 1 : 1,
        opacity: 1,
      }}
      transition={{
        delay: prefersReduced ? 0 : delay,
        duration: prefersReduced ? 0.3 : duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  );
}

function ScallopLace({ stroke, prefersReduced, delay, duration }: VariantProps) {
  // 24 küçük çiçek/dantel ucu, dairesel
  const petals = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const r = 96;
    const x = 110 + Math.cos(angle) * r;
    const y = 110 + Math.sin(angle) * r;
    return { x, y, angle };
  });

  return (
    <g>
      {/* İç çember — sürekli ipek hat */}
      <motion.circle
        cx="110"
        cy="110"
        r="86"
        fill="none"
        stroke="url(#lace-gold)"
        strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          delay: prefersReduced ? 0 : delay,
          duration: prefersReduced ? 0.3 : duration,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      {/* 24 küçük dantel ucu */}
      {petals.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2.4"
          fill="none"
          stroke="url(#lace-gold)"
          strokeWidth="0.6"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{
            delay: (prefersReduced ? 0 : delay) + i * 0.022,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
      {/* 4 köşe çiçeği (üst, sağ, alt, sol) */}
      {[0, 90, 180, 270].map((deg, i) => {
        const rad = (deg - 90) * (Math.PI / 180);
        const r = 110;
        const cx = 110 + Math.cos(rad) * r;
        const cy = 110 + Math.sin(rad) * r;
        return (
          <motion.path
            key={`petal-${i}`}
            d={`M ${cx} ${cy - 5} Q ${cx + 5} ${cy} ${cx} ${cy + 5} Q ${cx - 5} ${cy} ${cx} ${cy - 5} Z`}
            fill="rgba(245, 220, 155, 0.5)"
            stroke="url(#lace-gold)"
            strokeWidth="0.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: (prefersReduced ? 0 : delay) + 0.6 + i * 0.08,
              duration: 0.6,
            }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
    </g>
  );
}

function WreathLace({ stroke, prefersReduced, delay, duration }: VariantProps) {
  return (
    <g>
      {/* 2 yarım çelenk — sağ ve sol, ortada açık (monogram için) */}
      <motion.path
        d="M 30 110 Q 30 40 110 30"
        fill="none"
        stroke="url(#lace-gold)"
        strokeWidth="0.7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M 190 110 Q 190 40 110 30"
        fill="none"
        stroke="url(#lace-gold)"
        strokeWidth="0.7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M 30 110 Q 30 180 110 190"
        fill="none"
        stroke="url(#lace-gold)"
        strokeWidth="0.7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.4, duration, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M 190 110 Q 190 180 110 190"
        fill="none"
        stroke="url(#lace-gold)"
        strokeWidth="0.7"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.4, duration, ease: [0.22, 1, 0.36, 1] }}
      />
    </g>
  );
}

interface VariantProps {
  stroke: string;
  prefersReduced: boolean | null;
  delay: number;
  duration: number;
}
