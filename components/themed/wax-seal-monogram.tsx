"use client";

/**
 * WaxSealMonogram — FAZ 5.8
 *
 * 3D-look wax seal — Pressed Love'un ana yakalama unsuru. Sage green
 * disk + içinde kabartmalı ivy/leaf bouquet + ortada monogram harfi.
 *
 * Radial gradient ile 3D kavis (üst sol parlama, alt sağ gölge),
 * inner shadow ile kalıp izi, drop shadow ile yüzeyden kalkma.
 * Hafif rotate (-12°) + organic edge için filter:url(#wax-edge).
 */

import { motion } from "framer-motion";

interface WaxSealMonogramProps {
  /** Monogram harfleri (e.g. "D&A") */
  monogram: string;
  /** Disk rengi — base. Default sage green (Aethel). */
  baseColor?: string;
  /** Açık tarafı (radial gradient highlight). */
  highlightColor?: string;
  /** Koyu tarafı (gölge). */
  shadowColor?: string;
  /** Monogram metin rengi. */
  inkColor?: string;
  /** Disk boyutu. Default 200px. */
  size?: number;
  /** Hafif rotasyon. */
  rotate?: number;
  /** Reveal gecikmesi. */
  delay?: number;
  className?: string;
}

export function WaxSealMonogram({
  monogram,
  baseColor = "#7A8A6E",
  highlightColor = "#9EAA8E",
  shadowColor = "#4E5638",
  inkColor = "#EDE9DD",
  size = 200,
  rotate = -8,
  delay = 0,
  className = "",
}: WaxSealMonogramProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: rotate - 20 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{
        delay,
        duration: 1.6,
        ease: [0.34, 1.56, 0.64, 1],  // back-ease — mühür basıldı gibi yaslanır
      }}
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 14px 28px ${shadowColor}55) drop-shadow(0 4px 8px ${shadowColor}33)`,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        aria-hidden
      >
        <defs>
          {/* 3D radial gradient — top-left highlight, bottom-right shadow */}
          <radialGradient id="wax-base" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={highlightColor} />
            <stop offset="55%" stopColor={baseColor} />
            <stop offset="100%" stopColor={shadowColor} />
          </radialGradient>

          {/* Organic wax edge — soft random distortion */}
          <filter id="wax-edge">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>

          {/* Inner shadow — kalıp basıldığında oluşan derin gölge */}
          <filter id="inner-press" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor={shadowColor} floodOpacity="0.7" />
            <feComposite in2="blur" operator="in" result="shadow" />
            <feComposite in="shadow" in2="SourceGraphic" operator="arithmetic" k2="1" k3="-1" />
          </filter>

          {/* Subtle gold shimmer — düşük opacity altın foil parıltı */}
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 215, 130, 0)" />
            <stop offset="45%" stopColor="rgba(255, 215, 130, 0)" />
            <stop offset="50%" stopColor="rgba(255, 215, 130, 0.18)" />
            <stop offset="55%" stopColor="rgba(255, 215, 130, 0)" />
            <stop offset="100%" stopColor="rgba(255, 215, 130, 0)" />
          </linearGradient>
        </defs>

        {/* Main wax disc */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="url(#wax-base)"
          filter="url(#wax-edge)"
        />

        {/* Inner rim — embossed border */}
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke={shadowColor}
          strokeWidth="0.6"
          opacity="0.5"
        />

        {/* Ivy wreath — kabartmalı yaprak çelengi */}
        <g opacity="0.7">
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const r = 64;
            const x = 100 + Math.cos(angle) * r;
            const y = 100 + Math.sin(angle) * r;
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${(angle * 180) / Math.PI + 90})`}>
                <ellipse
                  cx="0" cy="0" rx="3" ry="7"
                  fill={shadowColor}
                  opacity="0.4"
                />
                <ellipse
                  cx="0" cy="-1" rx="2.4" ry="6"
                  fill={highlightColor}
                  opacity="0.7"
                />
              </g>
            );
          })}
        </g>

        {/* Center monogram letter(s) — embossed */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          fill={inkColor}
          opacity="0.92"
          style={{
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
            fontSize: monogram.length <= 3 ? 56 : 36,
            letterSpacing: "0.02em",
          }}
        >
          {monogram}
        </text>

        {/* Gold shimmer overlay — animated diagonal sweep */}
        <motion.rect
          x="0" y="0" width="200" height="200"
          fill="url(#shimmer)"
          initial={{ x: -200 }}
          animate={{ x: 200 }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: "easeInOut",
          }}
          style={{ mixBlendMode: "screen" }}
        />
      </svg>
    </motion.div>
  );
}
