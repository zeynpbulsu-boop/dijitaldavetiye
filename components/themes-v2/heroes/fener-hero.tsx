"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import type { ThemeV2Props } from "@/lib/themes-v2/types";
import { useInvitationT } from "../i18n-context";
import { AtmosphereDefs, DustParticles, PaperGrain, makeRng, r3 } from "../primitives/atmosphere";
import { THEME_ASSETS, THEME_VIDEO } from "@/lib/themes-v2/assets";
import { CustomCover } from "../primitives/custom-cover";
import { useCeremonyOpened } from "../ceremony-context";

/* ── Tunables (no magic numbers in markup) ──────────────────────────── */
const MAIN_BULBS = 22;
const PERGOLA_BULBS = 12;
const FIREFLY_COUNT = 16;
const BOKEH_ORBS = 9;
const DUSK_CYCLE_S = 24; // slow day→dusk ambient shimmer

interface Bulb {
  x: number;
  y: number;
  /** Continuous flicker period (s). */
  dur: number;
  /** Seeded phase offset so bulbs never pulse in unison (s). */
  phase: number;
  /** Peak warmth of this bulb's flicker (0..1). */
  peak: number;
}

interface Firefly {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
  dx: number;
  dy: number;
}

interface BokehOrb {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
  drift: number;
  opacity: number;
}

/**
 * Fener — a PERPETUALLY ALIVE golden-hour vineyard at dusk.
 *
 * The previous build animated a tap-to-light reveal that then froze, which
 * read as "template-y". The day→night reveal gesture now lives in the global
 * OpeningCeremony curtain (ThemeShell), so this hero's resting state is the
 * lit dusk scene — and it never stops breathing:
 *
 *   • 4 parallax depths react to scroll AND the pointer (sky → backdrop →
 *     bulbs → content), giving the warm vineyard real cinematic depth.
 *   • A slow Ken-Burns push on the venue sketch + bokeh overlay, with bokeh
 *     orbs that drift and twinkle.
 *   • The string-light bulbs flicker continuously with warm, organic light —
 *     seeded staggered phases + a brightness/glow oscillation, so each lamp
 *     feels alive rather than a static dot.
 *   • A perpetual day→dusk ambient gradient shimmer behind everything.
 *   • Warm amber dust + drifting fireflies like embers in the evening air.
 *   • A gold shimmer sweeps the couple's names.
 *
 * All randomness is seeded (makeRng) and all computed SVG coords are rounded
 * (r3) so the force-static SSR markup is byte-identical on the client — no
 * Math.random / Date.now / new Date anywhere in a render path.
 *
 * prefers-reduced-motion → calm static scene: bulbs steady (no flicker),
 * no parallax, no drift.
 */
export function FenerHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const str = useInvitationT();
  // İmza etkileşim: ampuller perde açılınca sırayla yanar (tap-to-light).
  const ceremonyOpened = useCeremonyOpened();
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll parallax (depths move at different rates) ── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const ySky = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const yScene = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yBulbs = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  /* ── Pointer parallax (horizontal depth on mouse move) ── */
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 36, damping: 18 });
  const xSky = useTransform(sx, (v) => v * 10);
  const xScene = useTransform(sx, (v) => v * 22);
  const xBulbs = useTransform(sx, (v) => v * 32);

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
  };

  /* ── Bulb positions along the two catenary strands ── */
  const mainBulbs = useMemo<Bulb[]>(() => {
    const rnd = makeRng(4711);
    return Array.from({ length: MAIN_BULBS }, (_, i) => {
      const t = i / (MAIN_BULBS - 1);
      // Quadratic Bézier (180,180) → (560,360) → (940,210)
      const x = (1 - t) ** 2 * 180 + 2 * (1 - t) * t * 560 + t ** 2 * 940;
      const y = (1 - t) ** 2 * 180 + 2 * (1 - t) * t * 360 + t ** 2 * 210;
      return {
        x: r3(x),
        y: r3(y),
        dur: r3(2.4 + rnd() * 2.6),
        phase: r3(rnd() * -4),
        peak: r3(0.82 + rnd() * 0.18),
      };
    });
  }, []);

  const pergolaBulbs = useMemo<Bulb[]>(() => {
    const rnd = makeRng(9137);
    return Array.from({ length: PERGOLA_BULBS }, (_, i) => {
      const t = i / (PERGOLA_BULBS - 1);
      // Quadratic Bézier (720,280) → (900,240) → (1080,280)
      const x = (1 - t) ** 2 * 720 + 2 * (1 - t) * t * 900 + t ** 2 * 1080;
      const y = (1 - t) ** 2 * 280 + 2 * (1 - t) * t * 240 + t ** 2 * 280;
      return {
        x: r3(x),
        y: r3(y),
        dur: r3(2.2 + rnd() * 2.4),
        phase: r3(rnd() * -4),
        peak: r3(0.78 + rnd() * 0.2),
      };
    });
  }, []);

  /* ── Seeded fireflies — embers drifting through the evening ── */
  const fireflies = useMemo<Firefly[]>(() => {
    const rnd = makeRng(2719);
    return Array.from({ length: FIREFLY_COUNT }, () => ({
      x: r3(8 + rnd() * 84),
      y: r3(18 + rnd() * 60),
      r: r3(1 + rnd() * 1.6),
      dur: r3(6 + rnd() * 6),
      delay: r3(rnd() * -10),
      dx: r3((rnd() - 0.5) * 9),
      dy: r3(-(4 + rnd() * 7)),
    }));
  }, []);

  /* ── Seeded bokeh orbs layered over the photographic overlay ── */
  const bokeh = useMemo<BokehOrb[]>(() => {
    const rnd = makeRng(6151);
    return Array.from({ length: BOKEH_ORBS }, () => ({
      x: r3(rnd() * 100),
      y: r3(rnd() * 64),
      r: r3(22 + rnd() * 46),
      dur: r3(7 + rnd() * 7),
      delay: r3(rnd() * -8),
      drift: r3((rnd() - 0.5) * 4),
      opacity: r3(0.16 + rnd() * 0.22),
    }));
  }, []);

  // Leaf positions for the olive crown — seeded so SSR matches the client.
  const leaves = useMemo(() => {
    const rnd = makeRng(3203);
    return Array.from({ length: 60 }, () => ({
      x: r3(50 + rnd() * 200),
      y: r3(200 + rnd() * 130),
      r: r3(2 + rnd() * 5),
      o: r3(0.45 + rnd() * 0.3),
      rot: r3(rnd() * 360),
    }));
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24"
      style={{ backgroundColor: "#0F140C" }}
    >
      <AtmosphereDefs />

      {/* ── Perpetual day→dusk ambient gradient shimmer ─────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : ySky }}
        animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: DUSK_CYCLE_S, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 78%, rgba(232,176,93,0.26) 0%, rgba(120,70,40,0.30) 38%, rgba(20,28,16,0.55) 66%, rgba(15,20,12,0.98) 100%)",
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(248,230,184,0.20) 0%, rgba(248,230,184,0) 42%)",
          }}
          animate={reduced ? undefined : { opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: DUSK_CYCLE_S * 0.75, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ── Cinematic golden-hour VIDEO backdrop (BOTTOM-most visual layer)
          with parallax; poster = the venue sketch still as a graceful
          fallback. When no clip exists yet, the still keeps its Ken-Burns
          push so the scene still breathes. ─────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: reduced ? undefined : xScene, y: reduced ? 0 : yScene }}
      >
        {data.heroMediaUrl ? (
          <CustomCover src={data.heroMediaUrl} className="absolute inset-0" style={{ opacity: 0.42, filter: "saturate(0.85) brightness(0.7)" }} />
        ) : THEME_VIDEO.fener ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={THEME_ASSETS.fener.illustration}
            aria-hidden
            style={{ opacity: 0.42, filter: "saturate(0.85) brightness(0.7)" }}
          >
            <source src={THEME_VIDEO.fener} type="video/mp4" />
          </video>
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          >
            <picture>
              <source srcSet={THEME_ASSETS.fener.illustration?.replace(".png", ".webp")} type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THEME_ASSETS.fener.illustration}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: 0.42, filter: "saturate(0.85) brightness(0.7)" }}
              />
            </picture>
          </motion.div>
        )}
      </motion.div>

      {/* ── Warm bokeh overlay (Ken-Burns, slightly faster than backdrop) ── */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : ySky, mixBlendMode: "screen" }}
        animate={reduced ? undefined : { scale: [1.04, 1, 1.04] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <picture>
          <source srcSet={THEME_ASSETS.fener.overlay?.replace(".png", ".webp")} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={THEME_ASSETS.fener.overlay}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.7 }}
          />
        </picture>
      </motion.div>

      {/* ── Drifting + twinkling bokeh orbs ─────────────────────────── */}
      <motion.svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
        style={{ x: reduced ? undefined : xSky, y: reduced ? 0 : ySky, mixBlendMode: "screen" }}
      >
        <defs>
          <radialGradient id="fener-bokeh" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#FFE3AC" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#F5C56E" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F5C56E" stopOpacity="0" />
          </radialGradient>
        </defs>
        {bokeh.map((o, i) => (
          <motion.circle
            key={i}
            cx={`${o.x}%`}
            cy={`${o.y}%`}
            r={o.r}
            fill="url(#fener-bokeh)"
            initial={{ opacity: o.opacity }}
            animate={
              reduced
                ? { opacity: o.opacity }
                : { opacity: [o.opacity * 0.5, o.opacity, o.opacity * 0.5], x: [0, o.drift * 6, 0] }
            }
            transition={{ duration: o.dur, delay: o.delay, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
          />
        ))}
      </motion.svg>

      {/* ── Moon — gently breathing glow high on the left ───────────── */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ left: "12%", top: "8%", width: 90, height: 90, y: reduced ? 0 : ySky }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.4 }}
      >
        <motion.svg
          viewBox="0 0 90 90"
          animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="45" cy="45" r="40" fill="#F8E6B8" opacity="0.85" />
          <circle cx="45" cy="45" r="60" fill="#F8E6B8" opacity="0.15" style={{ filter: "blur(8px)" }} />
          <circle cx="36" cy="38" r="3" fill="#D9C088" opacity="0.6" />
          <circle cx="52" cy="46" r="2" fill="#D9C088" opacity="0.6" />
          <circle cx="44" cy="58" r="2.5" fill="#D9C088" opacity="0.6" />
        </motion.svg>
      </motion.div>

      <PaperGrain intensity={0.14} />

      {/* ── Main venue SVG (parallax-bound to bulb depth) ───────────── */}
      <motion.div
        className="relative z-10 w-full max-w-[1180px]"
        style={{ x: reduced ? undefined : xBulbs, y: reduced ? 0 : yBulbs }}
      >
        <svg
          viewBox="0 0 1180 560"
          width="100%"
          height="auto"
          style={{ filter: "brightness(0.82) contrast(1.04)" }}
        >
          {/* ── Ground line ─────────────────────────────────── */}
          <line x1="0" y1="510" x2="1180" y2="510" stroke={palette.accent} strokeWidth="0.8" opacity="0.4" />
          {/* Flagstones */}
          <g stroke={palette.accent} strokeWidth="0.8" fill="none" opacity="0.45">
            <path d="M 460 510 Q 460 535 480 540 L 700 540 Q 720 535 720 510" />
            <line x1="510" y1="513" x2="510" y2="540" />
            <line x1="560" y1="513" x2="560" y2="540" />
            <line x1="610" y1="513" x2="610" y2="540" />
            <line x1="660" y1="513" x2="660" y2="540" />
          </g>

          {/* ── Olive tree LEFT ─────────────────────────────── */}
          <g stroke={palette.accent} strokeWidth="1.4" fill="none" opacity="0.82">
            <path d="M 110 510 Q 120 420 145 360 Q 155 320 175 320" />
            <path d="M 155 380 Q 130 365 115 340" />
            <path d="M 165 350 Q 195 340 220 320" />
            <path d="M 158 410 Q 130 400 110 380" />
          </g>
          {/* Leafy crown left (seeded) */}
          <g>
            {leaves.map((l, i) => (
              <ellipse
                key={i}
                cx={l.x}
                cy={l.y}
                rx={l.r}
                ry={r3(l.r * 0.45)}
                fill={palette.accent}
                fillOpacity={l.o}
                transform={`rotate(${l.rot} ${l.x} ${l.y})`}
              />
            ))}
          </g>

          {/* ── Pergola CENTER-RIGHT ────────────────────────── */}
          <g stroke={palette.accent} strokeWidth="1.4" fill="none" opacity="0.85">
            <line x1="720" y1="510" x2="720" y2="280" />
            <line x1="900" y1="510" x2="900" y2="260" />
            <line x1="1080" y1="510" x2="1080" y2="280" />
            <rect x="710" y="510" width="20" height="6" />
            <rect x="890" y="510" width="20" height="6" />
            <rect x="1070" y="510" width="20" height="6" />
            <line x1="720" y1="280" x2="900" y2="260" />
            <line x1="900" y1="260" x2="1080" y2="280" />
            {[10, 30, 50, 70, 90, 110, 130, 150, 170].map((d, i) => (
              <line key={i} x1={720 + d} y1={r3(280 - d / 9)} x2={720 + d} y2={r3(310 - d / 9)} strokeWidth="1" />
            ))}
            {[10, 30, 50, 70, 90, 110, 130, 150, 170].map((d, i) => (
              <line key={i} x1={900 + d} y1={r3(260 + d / 9)} x2={900 + d} y2={r3(290 + d / 9)} strokeWidth="1" />
            ))}
            <path d="M 720 280 Q 720 380 740 410 Q 730 420 740 460" strokeWidth="1" opacity="0.7" />
            <path d="M 1080 280 Q 1080 380 1060 410 Q 1070 420 1060 460" strokeWidth="1" opacity="0.7" />
          </g>

          {/* Climbing wisteria on left pergola post */}
          <g opacity="0.7">
            {Array.from({ length: 8 }).map((_, i) => {
              const x = 720 + (i % 2 === 0 ? -6 : 6);
              const y = 320 + i * 22;
              return (
                <g key={i}>
                  <ellipse cx={x} cy={y} rx="4" ry="2" fill="#A8709E" fillOpacity="0.55" />
                  <ellipse cx={x + 4} cy={y + 4} rx="3" ry="1.5" fill="#A8709E" fillOpacity="0.45" />
                </g>
              );
            })}
          </g>

          {/* ── String light strands ────────────────────────── */}
          <path d="M 180 180 Q 560 360 940 210" stroke={`${palette.accent}77`} strokeWidth="0.8" fill="none" />
          <path d="M 720 280 Q 900 240 1080 280" stroke={`${palette.accent}77`} strokeWidth="0.8" fill="none" />

          {/* Pergola strand bulbs — perde açılınca 80ms arayla sırayla yanar,
              sonra kalıcı organik flicker'a geçer (registry imza vaadi) */}
          {pergolaBulbs.map((b, i) => (
            <FlickerBulb key={`p-${i}`} bulb={b} dy={13} haloR={14} innerR={5} bulbR={4} reduced={!!reduced} accent={palette.accent} lit={ceremonyOpened} order={i} />
          ))}

          {/* Main strand bulbs — pergola bittikten sonra devam eden sırayla */}
          {mainBulbs.map((b, i) => (
            <FlickerBulb key={`m-${i}`} bulb={b} dy={20} haloR={28} innerR={12} bulbR={5} reduced={!!reduced} accent={palette.accent} lit={ceremonyOpened} order={pergolaBulbs.length + i} />
          ))}

          {/* ── Lantern stands ──────────────────────────────── */}
          <g stroke={palette.accent} strokeWidth="1.2" fill="none" opacity="0.8">
            <line x1="360" y1="510" x2="360" y2="430" />
            <line x1="345" y1="430" x2="375" y2="430" />
            <rect x="350" y="380" width="20" height="50" />
            <line x1="345" y1="380" x2="375" y2="380" />
            <path d="M 350 380 L 360 365 L 370 380" />
            <line x1="640" y1="510" x2="640" y2="430" />
            <line x1="625" y1="430" x2="655" y2="430" />
            <rect x="630" y="380" width="20" height="50" />
            <line x1="625" y1="380" x2="655" y2="380" />
            <path d="M 630 380 L 640 365 L 650 380" />
          </g>
          {/* Lantern glows — slow breathing */}
          {[360, 640].map((cx, idx) => (
            <g key={`lantern-${cx}`}>
              <motion.circle
                cx={cx}
                cy={405}
                r="32"
                fill="#FFE3AC"
                style={{ filter: "blur(10px)" }}
                animate={reduced ? { opacity: 0.32 } : { opacity: [0.24, 0.4, 0.24] }}
                transition={{ duration: 5.5, delay: idx * 0.9, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
              />
              <rect x={cx - 9} y={386} width={18} height={38} fill="#FFE3AC" opacity={0.85} />
            </g>
          ))}

          {/* ── Fireflies / embers (seeded drift) ───────────── */}
          {!reduced &&
            fireflies.map((f, i) => (
              <g key={`f-${i}`}>
                <motion.circle
                  cx={`${f.x}%`}
                  cy={`${f.y}%`}
                  r={f.r * 2}
                  fill="#FFE7AC"
                  style={{ filter: "blur(4px)" }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.45, 0.25, 0.45, 0],
                    x: [0, f.dx * 8, f.dx * -4, f.dx * 6, 0],
                    y: [0, f.dy * 8, f.dy * 4, f.dy * 10, 0],
                  }}
                  transition={{ delay: f.delay, duration: f.dur, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx={`${f.x}%`}
                  cy={`${f.y}%`}
                  r={f.r}
                  fill="#FFFAD5"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0.6, 1, 0],
                    x: [0, f.dx * 8, f.dx * -4, f.dx * 6, 0],
                    y: [0, f.dy * 8, f.dy * 4, f.dy * 10, 0],
                  }}
                  transition={{ delay: f.delay, duration: f.dur, repeat: Infinity, ease: "easeInOut" }}
                />
              </g>
            ))}
        </svg>
      </motion.div>

      {/* ── Warm amber dust drifting through the foreground ──────────── */}
      <DustParticles color="#F5C56E" count={24} opacity={0.5} />

      {/* ── Soft scrim lifts text legibility over the warm scene ─────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[520px] w-[1000px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center 70%, rgba(15,20,12,0.66) 0%, rgba(15,20,12,0.34) 46%, rgba(15,20,12,0) 74%)",
        }}
      />

      {/* ── Title block ──────────────────────────────────────────────── */}
      <motion.div
        style={{ y: reduced ? 0 : yContent, opacity: reduced ? 1 : contentOpacity }}
        className="relative z-20 mt-10 text-center"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10.5px] uppercase" style={{ color: palette.accent, letterSpacing: "0.5em", fontWeight: 500 }}>
            {str.hero.saveTheDate}
          </p>

          <ShimmerNames
            partnerOne={data.partnerOne}
            partnerTwo={data.partnerTwo}
            accent={palette.accent}
            reduced={!!reduced}
          />

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2 }}
            className="mx-auto my-6 flex items-center justify-center gap-4"
          >
            <span className="block h-px w-12" style={{ background: palette.accent, opacity: 0.6 }} />
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <circle cx="6" cy="6" r="2.4" fill={palette.accent} />
              <circle cx="6" cy="6" r="5" fill="none" stroke={palette.accent} strokeWidth="0.6" opacity="0.6" />
            </svg>
            <span className="block h-px w-12" style={{ background: palette.accent, opacity: 0.6 }} />
          </motion.div>

          <p
            className="font-display italic"
            style={{
              fontSize: "clamp(24px, 3.4vw, 38px)",
              color: "#F5E8C9",
              letterSpacing: "0.04em",
            }}
          >
            {data.date.day} · {data.date.month.toLocaleLowerCase("tr-TR")} · {data.date.year}
          </p>
          {data.date.weekday && (
            <p className="mt-2 text-[10px] uppercase" style={{ color: palette.accent, opacity: 0.78, letterSpacing: "0.4em" }}>
              {data.date.weekday}
            </p>
          )}

          <p className="mt-6 text-[10.5px] uppercase" style={{ color: palette.accent, opacity: 0.85, letterSpacing: "0.36em" }}>
            {data.venue.name}
          </p>
          {data.venue.city && (
            <p className="mt-2 font-display italic" style={{ fontSize: 14, color: "#E8D9B8", opacity: 0.72 }}>
              {data.venue.city}
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── A single string-light bulb — sequential light-up, then flicker ──── *
 * İmza etkileşim: perde açılana kadar sönük durur; `lit` olunca `order`ına
 * göre 80ms arayla yanar (tap-to-light), yanış tamamlanınca seeded `phase`
 * ve `dur` ile kalıcı organik flicker'a geçer. Reduced-motion'da hep sabit
 * yanık (ne sıralı yanış ne flicker).                                     */
const LIGHT_STAGGER_S = 0.08;
const LIGHT_ON_S = 0.35;

function FlickerBulb({
  bulb,
  dy,
  haloR,
  innerR,
  bulbR,
  reduced,
  accent,
  lit,
  order,
}: {
  bulb: Bulb;
  dy: number;
  haloR: number;
  innerR: number;
  bulbR: number;
  reduced: boolean;
  accent: string;
  /** Perde açıldı mı — false iken ampul sönük bekler */
  lit: boolean;
  /** Şeritteki sıra — sırayla yanma gecikmesi order*80ms */
  order: number;
}) {
  const [flickering, setFlickering] = useState(reduced);
  const cy = r3(bulb.y + dy);
  const haloOsc = [bulb.peak * 0.4, bulb.peak * 0.6, bulb.peak * 0.34, bulb.peak * 0.52];
  const coreOsc = [bulb.peak * 0.78, bulb.peak, bulb.peak * 0.7, bulb.peak * 0.92];
  const flick = { duration: bulb.dur, delay: bulb.phase, repeat: Infinity, ease: "easeInOut" as const };
  const turnOn = { duration: LIGHT_ON_S, delay: order * LIGHT_STAGGER_S, ease: "easeOut" as const };

  // Yanış animasyonu bitince flicker fazına geç (en parlak ampulün gecikmesi baz).
  useEffect(() => {
    if (!lit || reduced || flickering) return;
    const t = window.setTimeout(
      () => setFlickering(true),
      (order * LIGHT_STAGGER_S + LIGHT_ON_S) * 1000,
    );
    return () => window.clearTimeout(t);
  }, [lit, reduced, flickering, order]);

  const halo = reduced
    ? { animate: { opacity: bulb.peak * 0.5 }, transition: undefined }
    : !lit
      ? { animate: { opacity: 0.05 }, transition: { duration: 0.2 } }
      : !flickering
        ? { animate: { opacity: bulb.peak * 0.55 }, transition: turnOn }
        : { animate: { opacity: haloOsc }, transition: flick };
  const core = reduced
    ? { animate: { opacity: bulb.peak * 0.7 }, transition: undefined }
    : !lit
      ? { animate: { opacity: 0.08 }, transition: { duration: 0.2 } }
      : !flickering
        ? { animate: { opacity: bulb.peak * 0.85 }, transition: turnOn }
        : { animate: { opacity: coreOsc }, transition: { ...flick, delay: r3(bulb.phase - 0.15) } };
  const filament = reduced
    ? { animate: { opacity: 1 }, transition: undefined }
    : !lit
      ? { animate: { opacity: 0.18 }, transition: { duration: 0.2 } }
      : !flickering
        ? { animate: { opacity: 1 }, transition: turnOn }
        : { animate: { opacity: [0.86, 1, 0.82, 0.96] }, transition: { ...flick, delay: r3(bulb.phase - 0.15) } };

  return (
    <g>
      {/* hanging wire + cap */}
      <line x1={bulb.x} y1={bulb.y} x2={bulb.x} y2={r3(bulb.y + dy - 8)} stroke={accent} strokeWidth="0.7" opacity="0.6" />
      <rect x={r3(bulb.x - 2)} y={r3(bulb.y + dy - 9)} width="4" height="4" fill={accent} opacity="0.7" />

      {/* outer halo */}
      <motion.circle cx={bulb.x} cy={cy} r={haloR} fill={accent} style={{ filter: "blur(8px)" }} {...halo} />
      {/* inner halo */}
      <motion.circle cx={bulb.x} cy={cy} r={innerR} fill="#FFE7AC" style={{ filter: "blur(3px)" }} {...core} />
      {/* filament core */}
      <motion.circle cx={bulb.x} cy={cy} r={bulbR} fill="#FFE3AC" {...filament} />
    </g>
  );
}

/* ── Couple names with a slow gold shimmer sweep ─────────────────────── */
function ShimmerNames({
  partnerOne,
  partnerTwo,
  accent,
  reduced,
}: {
  partnerOne: string;
  partnerTwo: string;
  accent: string;
  reduced: boolean;
}) {
  const base = {
    fontFamily: "var(--font-display), serif",
    fontWeight: 300,
    fontSize: "clamp(40px, 6vw, 72px)",
    lineHeight: 1.05,
  } as const;

  const sweep = {
    ...base,
    backgroundImage: "linear-gradient(110deg, #F5E8C9 0%, #F5E8C9 42%, #FFF6DC 50%, #F5E8C9 58%, #F5E8C9 100%)",
    backgroundSize: "260% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
    textShadow: "0 0 26px rgba(232,176,93,0.3)",
  } as const;

  return (
    <h1 className="mt-7" style={base}>
      <motion.span
        style={sweep}
        animate={reduced ? undefined : { backgroundPositionX: ["160%", "-60%"] }}
        transition={{ duration: 6.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
      >
        {partnerOne}
      </motion.span>
      <span className="px-4 italic" style={{ color: accent, WebkitTextFillColor: accent }}>
        &amp;
      </span>
      <motion.span
        style={sweep}
        animate={reduced ? undefined : { backgroundPositionX: ["160%", "-60%"] }}
        transition={{ duration: 6.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut", delay: 0.4 }}
      >
        {partnerTwo}
      </motion.span>
    </h1>
  );
}
