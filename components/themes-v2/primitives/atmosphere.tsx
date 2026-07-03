"use client";

import { useMemo, type CSSProperties } from "react";

/**
 * Shared atmosphere primitives — paper grain, watercolor washes,
 * dust particles, ink filters. SVG-only, performant, reusable across
 * all 7 themes to give them a unified premium hand-crafted feel.
 */

/* ── Hydration-safe helpers ──────────────────────────────────────────
 * Math.cos/Math.sin and Math.random can produce last-ULP-different
 * results between the server's V8 and the browser's V8, which makes
 * React's SSR markup mismatch the client and triggers a full re-render
 * (the dreaded hydration error). We (1) round trig output to 3 decimals
 * so both environments serialize the same string, and (2) replace
 * Math.random with a deterministic seeded PRNG (mulberry32, pure integer
 * math → identical everywhere). */
export const r3 = (n: number) => Math.round(n * 1000) / 1000;

export function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── SVG filters defined once, referenced from any theme ────────── */

export function AtmosphereDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute", visibility: "hidden" }}
      aria-hidden
    >
      <defs>
        {/* Paper grain — fine noise that gives flat colors texture */}
        <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.08 0"
            result="tint"
          />
          <feComposite in="SourceGraphic" in2="tint" operator="over" />
        </filter>

        {/* Watercolor edge — soft displacement around painted shapes */}
        <filter id="watercolor-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="3"
            seed="7"
            result="turb"
          />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="6" />
        </filter>

        {/* Ink bleed — slight darkening at glyph edges (for handwritten feel) */}
        <filter id="ink-bleed">
          <feGaussianBlur stdDeviation="0.3" />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.4 -0.1"
          />
        </filter>

        {/* Soft drop shadow for lifted paper elements */}
        <filter id="paper-lift" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="10" />
          <feOffset dy="14" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.25" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="out" />
        </filter>

        {/* Warm glow — used by Fener bulbs and Geceyarısı stars */}
        <filter id="warm-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Detailed leaf — reusable for botanical themes */}
        <symbol id="eucalyptus-leaf" viewBox="-12 -5 24 10">
          <path
            d="M -10 0 Q -8 -4 0 -4 Q 8 -4 10 0 Q 8 4 0 4 Q -8 4 -10 0 Z"
            fill="currentColor"
            fillOpacity="0.78"
          />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="currentColor" strokeWidth="0.4" />
          <line x1="-5" y1="0" x2="-3" y2="-2" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <line x1="0" y1="0" x2="2" y2="-2.5" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          <line x1="5" y1="0" x2="6" y2="-2" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
        </symbol>

        <symbol id="olive-leaf" viewBox="-10 -3 20 6">
          <path
            d="M -8 0 Q -6 -3 0 -2.5 Q 6 -2 8 0 Q 6 2 0 2.5 Q -6 3 -8 0 Z"
            fill="currentColor"
            fillOpacity="0.7"
          />
          <line x1="-8" y1="0" x2="8" y2="0" stroke="currentColor" strokeWidth="0.3" />
        </symbol>

        {/* Detailed gypsophila (baby's breath) cluster — small white florets */}
        <symbol id="gypsophila-cluster" viewBox="-20 -20 40 40">
          {[
            [0, 0, 1], [-10, -4, 0.9], [10, -4, 0.9], [-8, 8, 0.85], [9, 7, 0.85],
            [-14, 2, 0.7], [14, 1, 0.7], [-3, -12, 0.8], [4, 12, 0.8], [0, -8, 0.6],
            [-6, -2, 0.5], [6, 2, 0.5], [-12, 10, 0.55], [12, -10, 0.55],
          ].map(([cx, cy, s], i) => (
            <g key={i} transform={`translate(${cx} ${cy}) scale(${s})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle
                  key={a}
                  cx={r3(Math.cos((a * Math.PI) / 180) * 2)}
                  cy={r3(Math.sin((a * Math.PI) / 180) * 2)}
                  r="1.6"
                  fill="#FBFAF5"
                  stroke="#3A2A1F"
                  strokeWidth="0.18"
                  strokeOpacity="0.32"
                />
              ))}
              <circle cx="0" cy="0" r="0.9" fill="#E8D89A" />
            </g>
          ))}
        </symbol>

        {/* Detailed daisy / chamomile flower */}
        <symbol id="chamomile" viewBox="-12 -12 24 24">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <ellipse
                key={i}
                cx={r3(Math.cos(a) * 7)}
                cy={r3(Math.sin(a) * 7)}
                rx="2.6"
                ry="4.2"
                fill="#FBF8ED"
                stroke="#C9B576"
                strokeWidth="0.2"
                strokeOpacity="0.4"
                transform={`rotate(${r3((a * 180) / Math.PI + 90)} ${r3(Math.cos(a) * 7)} ${r3(Math.sin(a) * 7)})`}
              />
            );
          })}
          <circle cx="0" cy="0" r="3" fill="#E8B85C" />
          <circle cx="0" cy="0" r="2" fill="#C9931F" />
        </symbol>

        {/* Pressed wildflower stem (for Defter) */}
        <symbol id="wildflower-stem" viewBox="-3 -50 30 60">
          <path d="M 0 10 Q 1 0 0 -10 T 2 -30 T 5 -45" stroke="currentColor" strokeWidth="0.7" fill="none" />
          {[-15, -25, -36].map((y, i) => (
            <g key={i} transform={`translate(${i % 2 === 0 ? 4 : -2} ${y})`}>
              <ellipse cx="0" cy="0" rx="3" ry="1.4" fill="currentColor" fillOpacity="0.6" transform={`rotate(${i % 2 === 0 ? 30 : -30})`} />
            </g>
          ))}
        </symbol>

        {/* Star (5-point) for Geceyarısı */}
        <symbol id="five-star" viewBox="-10 -10 20 20">
          <polygon
            points={Array.from({ length: 10 })
              .map((_, i) => {
                const r = i % 2 === 0 ? 8 : 3.5;
                const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
                return `${r3(Math.cos(a) * r)},${r3(Math.sin(a) * r)}`;
              })
              .join(" ")}
            fill="currentColor"
          />
        </symbol>
      </defs>
    </svg>
  );
}

/* ── Paper grain overlay — sits over content as a near-transparent layer */
export function PaperGrain({
  intensity = 0.4,
  className,
}: {
  intensity?: number;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 mix-blend-multiply ${className ?? ""}`}
      style={{
        opacity: intensity,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.16 0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0.4 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
        backgroundSize: "200px 200px",
      }}
    />
  );
}

/* ── Drifting dust particles — adds life to static scenes */
export function DustParticles({
  color = "#fff",
  count = 30,
  opacity = 0.35,
}: {
  color?: string;
  count?: number;
  opacity?: number;
}) {
  const particles = useMemo(() => {
    const rnd = makeRng(count * 9301 + 49297);
    return Array.from({ length: count }, () => ({
      x: r3(rnd() * 100),
      y: r3(rnd() * 100),
      r: r3(0.4 + rnd() * 1.2),
      dur: r3(14 + rnd() * 14),
      delay: r3(rnd() * -20),
      drift: r3(4 + rnd() * 8),
    }));
  }, [count]);

  // SVG SMIL `cy` animasyonu (main-thread paint) yerine CSS transform/opacity
  // (GPU compositor). 7 hero'da sürekli çalıştığı için bu, en büyük "kasma"
  // kaynaklarından biriydi. Görünüm birebir aynı: yükselip solan toz zerreleri.
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ opacity }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="dust-particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.r * 2,
              height: p.r * 2,
              backgroundColor: color,
              "--dust-dur": `${p.dur}s`,
              "--dust-delay": `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ── Tema-kişilikli ambient partiküller ─────────────────────────────
 * DustParticles jenerik tozdur; bu katman edisyonun karakterini taşır:
 *   petal   → salınarak DÜŞEN taç yaprağı (kurdele: mavi saten kırpıntısı)
 *   firefly → süzülen + parlayan ateşböceği
 *   star    → yerinde twinkle eden yıldız
 *   ember   → yükselip sönümlenen kor / kağıt pulu (postakart)
 * dust-particle ile aynı sözleşme: seeded konumlar (SSR-güvenli), CSS
 * var'lı tek keyframe, yalnız transform+opacity, reduced-motion'da kapalı. */
export type AmbientVariant = "petal" | "firefly" | "star" | "ember";

const AMBIENT_ANIM: Record<AmbientVariant, string> = {
  petal: "ambient-petal-fall",
  firefly: "ambient-firefly",
  star: "ambient-star-twinkle",
  ember: "ambient-ember-rise",
};

export function AmbientParticles({
  variant,
  color,
  count = 14,
  opacity = 1,
}: {
  variant: AmbientVariant;
  color: string;
  count?: number;
  opacity?: number;
}) {
  const particles = useMemo(() => {
    const rnd = makeRng(count * 7907 + variant.length * 131);
    return Array.from({ length: count }, () => {
      const size =
        variant === "petal" ? r3(6 + rnd() * 6) : variant === "ember" ? r3(2 + rnd() * 3) : r3(2 + rnd() * 3.5);
      return {
        x: r3(rnd() * 100),
        // petal üstten, ember alttan doğar; firefly/star sahne içinde yaşar
        y: variant === "petal" ? -6 : variant === "ember" ? 102 : r3(12 + rnd() * 70),
        w: size,
        h: variant === "petal" ? r3(size * 0.72) : size,
        dur: r3(variant === "star" ? 2.5 + rnd() * 3 : 8 + rnd() * 9),
        delay: r3(rnd() * -14),
        tx: r3((rnd() - 0.5) * 18),
        ty: r3((rnd() - 0.5) * 20),
        rot: r3(200 + rnd() * 340),
        peak: r3(0.45 + rnd() * 0.4),
      };
    });
  }, [count, variant]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ opacity }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className={`ambient-particle ambient-particle--${variant}`}
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.w,
              height: p.h,
              backgroundColor: color,
              borderRadius: variant === "petal" ? "80% 0 55% 50% / 55% 0 80% 50%" : "9999px",
              boxShadow:
                variant === "firefly" || variant === "ember"
                  ? `0 0 ${r3(p.w * 2.5)}px ${color}`
                  : undefined,
              "--amb-anim": AMBIENT_ANIM[variant],
              "--amb-dur": `${p.dur}s`,
              "--amb-delay": `${p.delay}s`,
              "--amb-tx": `${p.tx}vw`,
              "--amb-ty": `${p.ty}vh`,
              "--amb-rot": `${p.rot}deg`,
              "--amb-peak": `${p.peak}`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ── Multi-layer watercolor wash — feels painted, not flat */
export function WatercolorWash({
  layers,
}: {
  layers: Array<{
    cx: number;
    cy: number;
    rx: number;
    ry: number;
    color: string;
    opacity?: number;
    blur?: number;
  }>;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        {layers.map((l, i) => (
          <radialGradient key={i} id={`wc-${i}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={l.color} stopOpacity={l.opacity ?? 0.2} />
            <stop offset="60%" stopColor={l.color} stopOpacity={(l.opacity ?? 0.2) * 0.3} />
            <stop offset="100%" stopColor={l.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {layers.map((l, i) => (
        <ellipse
          key={i}
          cx={l.cx}
          cy={l.cy}
          rx={l.rx}
          ry={l.ry}
          fill={`url(#wc-${i})`}
          style={{ filter: l.blur ? `blur(${l.blur}px)` : undefined }}
        />
      ))}
    </svg>
  );
}

/* ── Vignette — gentle dark edges, depth on hero */
export function Vignette({ color = "#000", intensity = 0.25 }: { color?: string; intensity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at center, transparent 50%, ${color} 130%)`,
        opacity: intensity,
      }}
    />
  );
}
