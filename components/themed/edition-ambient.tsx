"use client";

/**
 * EditionAmbient — Per-edition hero micro-animations.
 *
 * Heritage-tier visual identity: her edisyonun hero'su sadece statik
 * sahne değil, kendi temasına ait subtle animasyonu olur (TDI Heritage
 * paritesi — "custom illustrated venue with elegant animation").
 *
 * 6 kind:
 *  - doves        (Aethel)       — Toskana güvercinleri yavaşça uçar
 *  - starfield    (Atelier)      — gece yıldızları parıldar + sürüklenir
 *  - chandelier   (Mansion)      — üst merkez ışık halesi atar
 *  - waves        (Bodrum Blue)  — alt kısımda yumuşak dalga bantları
 *  - leaves       (Olive Grove)  — zeytin yaprakları sallanır + düşer
 *  - aurora       (Aurora)       — diagonal aurora şeritleri akar
 *
 * Tasarım:
 * - pointer-events: none — interaction'a karışmaz
 * - prefers-reduced-motion: animasyon durur, sadece statik
 * - rendering: absolute fill, hero altında z-index ile chapel watermark
 *   üstünde ama content altında
 * - performance: SVG + CSS keyframe + framer-motion karışımı; çoğu
 *   transform-only (GPU-accelerated)
 */

import { motion, useReducedMotion } from "framer-motion";

export type EditionAmbientKind =
  | "doves"
  | "starfield"
  | "chandelier"
  | "waves"
  | "leaves"
  | "aurora";

interface Props {
  kind: EditionAmbientKind;
  /** Accent rengini ortam'a aktar (yıldız, leaf, ışık vs.) */
  accentColor: string;
  /** Bg rengini bilmek waves vs leaves için fayda sağlar. */
  bgColor: string;
}

export function EditionAmbient({ kind, accentColor, bgColor }: Props) {
  const reduced = useReducedMotion();

  switch (kind) {
    case "doves":
      return <Doves accentColor={accentColor} reduced={!!reduced} />;
    case "starfield":
      return <Starfield accentColor={accentColor} reduced={!!reduced} />;
    case "chandelier":
      return <Chandelier accentColor={accentColor} reduced={!!reduced} />;
    case "waves":
      return <Waves accentColor={accentColor} bgColor={bgColor} reduced={!!reduced} />;
    case "leaves":
      return <Leaves accentColor={accentColor} reduced={!!reduced} />;
    case "aurora":
      return <AuroraSwirl accentColor={accentColor} reduced={!!reduced} />;
    default:
      return null;
  }
}

/* ── Doves — Aethel ──────────────────────────────────────────────── */
function Doves({ accentColor, reduced }: { accentColor: string; reduced: boolean }) {
  const doves = [
    { y: 18, scale: 0.9, delay: 0, duration: 38 },
    { y: 32, scale: 1.1, delay: 6, duration: 44 },
    { y: 52, scale: 0.7, delay: 14, duration: 36 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {doves.map((d, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 64 32"
          width="64"
          height="32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: `${d.y}%`,
            left: "-10%",
            opacity: 0.32,
            color: accentColor,
          }}
          initial={reduced ? { x: "0vw" } : { x: "-10vw" }}
          animate={reduced ? { x: "30vw" } : { x: "115vw" }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: d.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: d.delay,
                }
          }
        >
          <g transform={`scale(${d.scale})`}>
            {/* Stylized dove (V-shaped wings) */}
            <path
              d="M2 18 C 10 6, 18 14, 24 10 C 30 6, 36 14, 44 10 C 52 6, 60 14, 62 18"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Subtle body curve */}
            <path
              d="M28 14 Q 32 18 36 14"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>
          {/* Wing flap — simple Y-bob via CSS animation */}
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -1.5; 0 0"
            dur="1.2s"
            repeatCount={reduced ? "0" : "indefinite"}
          />
        </motion.svg>
      ))}
    </div>
  );
}

/* ── Starfield — Atelier Indigo ──────────────────────────────────── */
function Starfield({ accentColor, reduced }: { accentColor: string; reduced: boolean }) {
  // Deterministic pseudo-random positions for stable SSR
  const stars = Array.from({ length: 50 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const x = (seed / 233280) * 100;
    const y = ((seed * 7) % 233280) / 233280 * 100;
    const r = 0.4 + ((seed * 13) % 100) / 100 * 1.4;
    const dur = 2 + ((seed * 17) % 100) / 100 * 4;
    const delay = ((seed * 23) % 100) / 100 * 4;
    return { x, y, r, dur, delay };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill={accentColor}
            opacity="0.6"
          >
            {!reduced && (
              <animate
                attributeName="opacity"
                values="0.2;0.85;0.2"
                dur={`${s.dur}s`}
                begin={`${s.delay}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
        {/* Comet streak — diagonal across center */}
        {!reduced && (
          <line
            x1="-5%"
            y1="120%"
            x2="105%"
            y2="-20%"
            stroke={accentColor}
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;0.5;0" dur="14s" repeatCount="indefinite" />
            <animate attributeName="x1" values="-5%;-5%" dur="14s" repeatCount="indefinite" />
          </line>
        )}
      </svg>
    </div>
  );
}

/* ── Chandelier — Mansion Lights ─────────────────────────────────── */
function Chandelier({ accentColor, reduced }: { accentColor: string; reduced: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {/* Üst orta — büyük radial sıcak hale */}
      <motion.div
        className="absolute"
        style={{
          top: "-10%",
          left: "50%",
          width: 720,
          height: 720,
          transform: "translateX(-50%)",
          background: `radial-gradient(circle, ${accentColor}33 0%, ${accentColor}10 35%, transparent 65%)`,
          filter: "blur(8px)",
        }}
        animate={reduced ? {} : { opacity: [0.6, 1, 0.7, 0.95, 0.6] }}
        transition={reduced ? undefined : { duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Sparkle parçacıkları */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 140 + (i % 3) * 60;
        const cx = 50 + (Math.cos(angle) * r) / 12;
        const cy = -5 + (Math.sin(angle) * r) / 12;
        const delay = (i * 0.6) % 4;
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{
              top: `${cy}%`,
              left: `${cx}%`,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
            animate={reduced ? { opacity: 0.4 } : { opacity: [0, 1, 0], scale: [0.6, 1.4, 0.6] }}
            transition={
              reduced
                ? undefined
                : { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay }
            }
          />
        );
      })}
    </div>
  );
}

/* ── Waves — Bodrum Blue ─────────────────────────────────────────── */
function Waves({
  accentColor,
  reduced,
}: {
  accentColor: string;
  bgColor: string;
  reduced: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="bodrumWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accentColor} stopOpacity="0" />
            <stop offset="100%" stopColor={accentColor} stopOpacity="0.18" />
          </linearGradient>
        </defs>
        {[0, 80, 160].map((shift, i) => (
          <path
            key={i}
            fill="url(#bodrumWaveGrad)"
            d={`M -100 ${200 + shift} Q 200 ${150 + shift} 400 ${200 + shift} T 800 ${
              200 + shift
            } T 1300 ${200 + shift} L 1300 400 L -100 400 Z`}
            opacity={0.45 - i * 0.1}
          >
            {!reduced && (
              <animate
                attributeName="d"
                values={`M -100 ${200 + shift} Q 200 ${150 + shift} 400 ${200 + shift} T 800 ${
                  200 + shift
                } T 1300 ${200 + shift} L 1300 400 L -100 400 Z;
                M -100 ${200 + shift} Q 200 ${250 + shift} 400 ${200 + shift} T 800 ${
                  200 + shift
                } T 1300 ${200 + shift} L 1300 400 L -100 400 Z;
                M -100 ${200 + shift} Q 200 ${150 + shift} 400 ${200 + shift} T 800 ${
                  200 + shift
                } T 1300 ${200 + shift} L 1300 400 L -100 400 Z`}
                dur={`${10 + i * 3}s`}
                repeatCount="indefinite"
              />
            )}
          </path>
        ))}
      </svg>
    </div>
  );
}

/* ── Leaves — Olive Grove ────────────────────────────────────────── */
function Leaves({ accentColor, reduced }: { accentColor: string; reduced: boolean }) {
  const leaves = [
    { x: 8, y: 12, rot: -20, scale: 1.2, delay: 0, dur: 11 },
    { x: 88, y: 22, rot: 30, scale: 0.9, delay: 2, dur: 13 },
    { x: 18, y: 68, rot: 10, scale: 1.1, delay: 4, dur: 14 },
    { x: 78, y: 78, rot: -45, scale: 1.3, delay: 1, dur: 12 },
    { x: 48, y: 18, rot: 60, scale: 0.8, delay: 5, dur: 10 },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {leaves.map((l, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 48"
          width="24"
          height="48"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: `${l.y}%`,
            left: `${l.x}%`,
            opacity: 0.32,
            color: accentColor,
            transform: `scale(${l.scale}) rotate(${l.rot}deg)`,
            transformOrigin: "center top",
          }}
          animate={
            reduced
              ? {}
              : {
                  rotate: [l.rot - 6, l.rot + 6, l.rot - 6],
                  y: [0, 3, 0],
                }
          }
          transition={
            reduced
              ? undefined
              : {
                  duration: l.dur,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: l.delay,
                }
          }
        >
          {/* Olive leaf shape */}
          <path
            d="M12 2 Q 22 14 18 38 Q 12 44 6 38 Q 2 14 12 2 Z"
            fill="currentColor"
            opacity="0.85"
          />
          {/* Center vein */}
          <line x1="12" y1="4" x2="12" y2="40" stroke="white" strokeWidth="0.4" opacity="0.4" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ── Aurora — Modern Minimal ─────────────────────────────────────── */
function AuroraSwirl({ accentColor, reduced }: { accentColor: string; reduced: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {/* Üç aurora bandı, diagonal akış */}
      {[
        { y: 18, h: 220, hue: 0, dur: 22 },
        { y: 38, h: 180, hue: 1, dur: 28 },
        { y: 62, h: 160, hue: 2, dur: 24 },
      ].map((band, i) => (
        <motion.div
          key={i}
          className="absolute left-[-20%] right-[-20%]"
          style={{
            top: `${band.y}%`,
            height: band.h,
            background:
              i === 0
                ? `linear-gradient(110deg, transparent 0%, ${accentColor}26 35%, ${accentColor}1A 55%, transparent 90%)`
                : i === 1
                ? `linear-gradient(110deg, transparent 0%, ${accentColor}1F 40%, ${accentColor}33 60%, transparent 95%)`
                : `linear-gradient(110deg, transparent 0%, ${accentColor}22 30%, ${accentColor}14 65%, transparent 90%)`,
            filter: "blur(28px)",
            mixBlendMode: "multiply",
            transform: `rotate(-${4 + i * 2}deg)`,
          }}
          animate={
            reduced
              ? {}
              : {
                  x: ["-8%", "8%", "-8%"],
                  opacity: [0.55, 0.85, 0.55],
                }
          }
          transition={
            reduced
              ? undefined
              : { duration: band.dur, repeat: Infinity, ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
