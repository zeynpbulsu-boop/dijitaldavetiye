"use client";

/**
 * AethelChapelCoverScene — FAZ 3.5
 *
 * Tam-ekran cover sahnesi: sarmaşık + mor salkım + taş şapel silueti +
 * god-rays (güneş ışınları, 4-5sn pulse) + havada toz zerresi.
 *
 * Tüm sahne SVG + framer-motion ile yapılır — asset gerektirmez.
 * Maliyeti sıfır, ölçekleme problemsiz, prefers-reduced-motion'da
 * statik mood'a düşer.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

export function AethelChapelCoverScene({
  className = "",
}: {
  className?: string;
}) {
  const prefersReduced = useReducedMotion();

  // 18 toz zerresi — rastgele konum + süre, mount başına seed
  const dustParticles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,           // %
        startY: 30 + Math.random() * 60,      // %
        size: 1 + Math.random() * 1.6,        // px
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    [],
  );

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 1200"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        {/* Yosun yeşili → fildişi gökyüzü */}
        <linearGradient id="sky" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#EDE9DD" />
          <stop offset="55%" stopColor="#E5DFC8" />
          <stop offset="100%" stopColor="#D4CFAF" />
        </linearGradient>

        {/* God-ray gradient — sarımtırak şeffaf */}
        <linearGradient id="ray" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 240, 195, 0.55)" />
          <stop offset="100%" stopColor="rgba(255, 240, 195, 0)" />
        </linearGradient>

        {/* Taş duvar — soft texture */}
        <linearGradient id="stone" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#A8A88A" />
          <stop offset="100%" stopColor="#6B6C50" />
        </linearGradient>

        {/* Filtre — sahnenin yumuşaklığı için */}
        <filter id="soft-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
        </filter>

        {/* Toz zerresi parıltısı */}
        <radialGradient id="dust">
          <stop offset="0%" stopColor="rgba(255, 250, 220, 0.95)" />
          <stop offset="60%" stopColor="rgba(255, 250, 220, 0.4)" />
          <stop offset="100%" stopColor="rgba(255, 250, 220, 0)" />
        </radialGradient>
      </defs>

      {/* Background sky */}
      <rect width="800" height="1200" fill="url(#sky)" />

      {/* GOD-RAYS — 4 ışın huzmesi, 4-5sn pulse */}
      {[180, 360, 540, 680].map((x, i) => (
        <motion.polygon
          key={`ray-${i}`}
          points={`${x - 60},0 ${x + 60},0 ${x + 180},1200 ${x - 180},1200`}
          fill="url(#ray)"
          style={{ mixBlendMode: "screen", filter: "url(#soft-blur)" }}
          initial={{ opacity: 0 }}
          animate={
            prefersReduced
              ? { opacity: 0.35 }
              : { opacity: [0.15, 0.55, 0.15] }
          }
          transition={{
            duration: 4.5 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}

      {/* Şapel silüeti — orta, taş duvar + sivri kemer + çatı */}
      <g opacity="0.92">
        {/* Ana yapı */}
        <motion.path
          d="M 300 700
             L 300 480
             Q 400 380 500 480
             L 500 700 Z"
          fill="url(#stone)"
          stroke="#4E5238"
          strokeWidth="1.2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.95, y: 0 }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Kapı kemeri */}
        <motion.path
          d="M 370 700 L 370 580 Q 400 555 430 580 L 430 700 Z"
          fill="#2F3527"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 1.6 }}
        />
        {/* Yan kuleler */}
        <motion.rect
          x="270" y="540" width="22" height="170"
          fill="url(#stone)"
          stroke="#4E5238" strokeWidth="0.9"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.2, duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.rect
          x="508" y="540" width="22" height="170"
          fill="url(#stone)"
          stroke="#4E5238" strokeWidth="0.9"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ delay: 0.3, duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Kule sivri uçları */}
        <motion.polygon
          points="270,540 281,510 292,540"
          fill="#5C6450"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2 }}
        />
        <motion.polygon
          points="508,540 519,510 530,540"
          fill="#5C6450"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1.2 }}
        />
        {/* Pencere yuvarlağı (rose window) */}
        <motion.circle
          cx="400" cy="540" r="22"
          fill="none" stroke="#4E5238" strokeWidth="1"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "400px 540px" }}
        />
        {/* Çatı çatlağı — şapelden hafif çapraz yay */}
        <motion.polygon
          points="300,480 400,360 500,480"
          fill="#5C6450"
          stroke="#4E5238" strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ delay: 0.4, duration: 1.8 }}
        />
        {/* Tepe haçı */}
        <motion.path
          d="M 398 350 L 402 350 L 402 340 L 398 340 Z M 396 348 L 404 348 L 404 344 L 396 344 Z"
          fill="#4E5238"
          opacity="0.85"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2 }}
        />
      </g>

      {/* SARMAŞIK — sol üstten aşağı dökülen */}
      <g opacity="0.85">
        <motion.path
          d="M 0 200 Q 80 280 60 380 Q 40 480 120 540 Q 200 600 160 700 Q 130 780 200 850"
          fill="none"
          stroke="#5C6450"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 4.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        {/* Yapraklar — 8 küçük yaprak path */}
        {[
          { x: 50, y: 240, r: 5, rot: -25 },
          { x: 75, y: 320, r: 7, rot: 20 },
          { x: 50, y: 410, r: 6, rot: -30 },
          { x: 100, y: 480, r: 7, rot: 35 },
          { x: 145, y: 555, r: 6, rot: -18 },
          { x: 180, y: 630, r: 8, rot: 10 },
          { x: 145, y: 720, r: 6, rot: -40 },
          { x: 195, y: 810, r: 7, rot: 25 },
        ].map((leaf, i) => (
          <motion.ellipse
            key={`leaf-l-${i}`}
            cx={leaf.x}
            cy={leaf.y}
            rx={leaf.r}
            ry={leaf.r * 0.45}
            fill="#7A8A6E"
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.88, scale: 1 }}
            transition={{
              delay: 1.0 + i * 0.18,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
          />
        ))}
      </g>

      {/* SARMAŞIK — sağ üstten aşağı dökülen */}
      <g opacity="0.85">
        <motion.path
          d="M 800 220 Q 720 300 740 400 Q 760 500 680 560 Q 600 620 640 720 Q 670 800 600 870"
          fill="none"
          stroke="#5C6450"
          strokeWidth="2.2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 4.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
        {[
          { x: 745, y: 260, r: 6, rot: 25 },
          { x: 730, y: 340, r: 7, rot: -22 },
          { x: 755, y: 430, r: 5, rot: 30 },
          { x: 705, y: 500, r: 7, rot: -35 },
          { x: 660, y: 575, r: 6, rot: 18 },
          { x: 625, y: 650, r: 8, rot: -10 },
          { x: 660, y: 740, r: 6, rot: 40 },
          { x: 615, y: 830, r: 7, rot: -25 },
        ].map((leaf, i) => (
          <motion.ellipse
            key={`leaf-r-${i}`}
            cx={leaf.x}
            cy={leaf.y}
            rx={leaf.r}
            ry={leaf.r * 0.45}
            fill="#7A8A6E"
            transform={`rotate(${leaf.rot} ${leaf.x} ${leaf.y})`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.88, scale: 1 }}
            transition={{
              delay: 1.2 + i * 0.18,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: `${leaf.x}px ${leaf.y}px` }}
          />
        ))}
      </g>

      {/* MOR SALKIM — sol orta, salkım gibi sarkan minik mor çiçekler */}
      <g opacity="0.78">
        {[
          { cx: 110, cy: 360, count: 6 },
          { cx: 165, cy: 410, count: 5 },
        ].map((cluster, ci) =>
          Array.from({ length: cluster.count }, (_, i) => (
            <motion.circle
              key={`wis-l-${ci}-${i}`}
              cx={cluster.cx + (i % 2 === 0 ? -3 : 3)}
              cy={cluster.cy + i * 8}
              r={2 + (i % 3)}
              fill="#9F84B5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{
                delay: 1.6 + ci * 0.3 + i * 0.06,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          )),
        )}
      </g>

      {/* MOR SALKIM — sağ orta */}
      <g opacity="0.78">
        {[
          { cx: 695, cy: 370, count: 6 },
          { cx: 640, cy: 420, count: 5 },
        ].map((cluster, ci) =>
          Array.from({ length: cluster.count }, (_, i) => (
            <motion.circle
              key={`wis-r-${ci}-${i}`}
              cx={cluster.cx + (i % 2 === 0 ? 3 : -3)}
              cy={cluster.cy + i * 8}
              r={2 + (i % 3)}
              fill="#9F84B5"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{
                delay: 1.8 + ci * 0.3 + i * 0.06,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          )),
        )}
      </g>

      {/* TOZ ZERRESİ — havada yavaşça yüzen, parıltılı */}
      {dustParticles.map((d) => (
        <motion.circle
          key={`dust-${d.id}`}
          cx={`${d.x}%`}
          r={d.size}
          fill="url(#dust)"
          initial={{
            opacity: 0,
            cy: `${d.startY}%`,
          }}
          animate={
            prefersReduced
              ? { opacity: d.opacity, cy: `${d.startY}%` }
              : {
                  opacity: [0, d.opacity, d.opacity, 0],
                  cy: [`${d.startY}%`, `${d.startY - 20}%`],
                }
          }
          transition={{
            duration: d.duration,
            repeat: Infinity,
            delay: d.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Alt vinyet — sahnenin oturma hissi */}
      <rect
        x="0"
        y="900"
        width="800"
        height="300"
        fill="url(#sky)"
        opacity="0.6"
      />
    </svg>
  );
}
