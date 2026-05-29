"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, PolaroidPhoto } from "@/lib/themes-v2/types";
import { AtmosphereDefs, PaperGrain, makeRng, r3 } from "./atmosphere";

interface Props {
  meta: ThemeV2Meta;
  photos: PolaroidPhoto[];
  title?: string;
  intro?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/* Pre-set scene tones so each polaroid is visually distinct. */
const SCENE_TONES: ReadonlyArray<readonly [string, string]> = [
  ["#E8C998", "#A86E40"],
  ["#B8C5A5", "#5A6B4A"],
  ["#D9B59E", "#7A4F38"],
  ["#9CB5C5", "#3F5566"],
  ["#E5C5A8", "#8B5E3D"],
];

export function PolaroidGallery({
  meta,
  photos,
  title = "Anılarımız",
  intro,
}: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  /* Seeded, render-stable per-photo geometry: a base tilt that feels
     hand-placed, plus a gentle perpetual sway phase. Deterministic →
     SSR/client match, no Math.random in render. */
  const sway = useMemo(() => {
    const rnd = makeRng(photos.length * 1733 + 91);
    return photos.map((p, i) => {
      const tilt = p.rotation ?? r3(-3.2 + rnd() * 6.4);
      return {
        tilt,
        amp: r3(0.8 + rnd() * 0.9), // degrees of idle sway
        dur: r3(6.5 + rnd() * 3.5), // seconds per cycle
        delay: r3(rnd() * 2.2),
        lift: r3(rnd() * 6), // tiny vertical offset → uneven baseline
      };
    });
  }, [photos]);

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section
      className="relative overflow-hidden px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <AtmosphereDefs />
      <PaperGrain intensity={0.26} />

      <div className="relative mx-auto max-w-[1200px]">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mx-auto max-w-[760px] text-center">
          <motion.p
            {...reveal(0)}
            className="text-[10px] uppercase sm:text-[10.5px]"
            style={{ color: palette.accent, letterSpacing: "0.5em", fontWeight: 500 }}
          >
            Hikâyemiz
          </motion.p>

          <motion.h2
            {...reveal(0.06)}
            className="mt-5 font-display"
            style={{
              fontWeight: 300,
              fontSize: "clamp(30px, 5vw, 50px)",
              color: palette.ink,
              lineHeight: 1.12,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </motion.h2>

          <motion.div
            {...reveal(0.12)}
            className="mx-auto my-7 flex items-center justify-center gap-3"
          >
            <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.55 }} />
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={palette.accent}
              strokeWidth="1.4"
              aria-hidden
            >
              <path d="M12 20.5s-7-4.6-7-10.2a4.2 4.2 0 0 1 7-3.1 4.2 4.2 0 0 1 7 3.1c0 5.6-7 10.2-7 10.2z" />
            </svg>
            <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.55 }} />
          </motion.div>

          {intro && (
            <motion.p
              {...reveal(0.18)}
              className="mx-auto mt-4 max-w-[600px] font-display italic"
              style={{
                fontSize: "clamp(15px, 1.8vw, 19px)",
                lineHeight: 1.85,
                color: palette.inkSoft,
                letterSpacing: "0.006em",
              }}
            >
              {intro}
            </motion.p>
          )}
        </div>

        {/* ── Gallery ────────────────────────────────────────────────
            Mobile: a single horizontal scroll-snap rail (intentional,
            no overflow, comfortable card size, edge fades hint scroll).
            sm+: a centered, hand-placed wrap. */}
        <div className="relative mt-14 sm:mt-16">
          {/* edge fades — only meaningful on the mobile rail */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:hidden"
            style={{ background: `linear-gradient(90deg, ${palette.bg}, transparent)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:hidden"
            style={{ background: `linear-gradient(270deg, ${palette.bg}, transparent)` }}
          />

          <ul
            className="
              -mx-6 flex snap-x snap-mandatory items-end gap-6 overflow-x-auto px-6 pb-3
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-x-10 sm:gap-y-14 sm:overflow-visible sm:px-0 sm:pb-0
            "
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {photos.map((photo, i) => {
              const [c1, c2] = SCENE_TONES[i % SCENE_TONES.length];
              const s = sway[i];
              return (
                <li
                  key={i}
                  className="shrink-0 snap-center sm:shrink"
                  style={{ marginTop: reduced ? 0 : s.lift }}
                >
                  <Polaroid
                    photo={photo}
                    index={i}
                    c1={c1}
                    c2={c2}
                    palette={palette}
                    sway={s}
                    reduced={!!reduced}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── A single tactile polaroid ───────────────────────────────────── */
function Polaroid({
  photo,
  index,
  c1,
  c2,
  palette,
  sway,
  reduced,
}: {
  photo: PolaroidPhoto;
  index: number;
  c1: string;
  c2: string;
  palette: ThemeV2Meta["palette"];
  sway: { tilt: number; amp: number; dur: number; delay: number };
  reduced: boolean;
}) {
  return (
    <motion.figure
      className="relative w-[clamp(168px,72vw,210px)] sm:w-[clamp(176px,18vw,212px)]"
      style={{ transformOrigin: "50% 100%" }}
      initial={reduced ? false : { y: 46, opacity: 0, rotate: sway.tilt * 0.5 }}
      whileInView={
        reduced
          ? { opacity: 1 }
          : { y: 0, opacity: 1, rotate: sway.tilt }
      }
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay: index * 0.09, duration: 1, ease: EASE }}
      whileHover={reduced ? undefined : { y: -12, rotate: sway.tilt * 0.35, scale: 1.02 }}
    >
      {/* Idle sway wrapper — perpetual, transform-only, very gentle. */}
      <motion.div
        animate={reduced ? undefined : { rotate: [-sway.amp, sway.amp, -sway.amp] }}
        transition={
          reduced
            ? undefined
            : { duration: sway.dur, delay: sway.delay, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ transformOrigin: "50% 0%" }}
      >
        {/* Washi tape */}
        <div
          aria-hidden
          className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2"
          style={{
            width: 62,
            height: 19,
            backgroundColor: palette.accent,
            opacity: 0.62,
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0 4px, transparent 4px 8px)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.16)",
            clipPath: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
          }}
        />

        {/* Paper frame */}
        <div
          className="flex flex-col items-center"
          style={{
            backgroundColor: palette.paper,
            padding: "13px 13px 26px",
            borderRadius: 3,
            boxShadow: [
              "0 1px 0 rgba(255,255,255,0.75) inset",
              "0 0 0 1px rgba(58,42,31,0.05)",
              "0 28px 44px -22px rgba(40,28,18,0.42)",
              "0 6px 12px rgba(40,28,18,0.12)",
            ].join(", "),
          }}
        >
          <div
            className="relative aspect-[3/4] w-full overflow-hidden"
            style={{ backgroundColor: c1, borderRadius: 1 }}
          >
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <PhotoScene c1={c1} c2={c2} index={index} />
            )}
            {/* Photographic vignette + soft gloss for a developed-print feel. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ boxShadow: "inset 0 0 22px rgba(0,0,0,0.2)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 38%)",
              }}
            />
          </div>

          <figcaption
            className="mt-3.5 px-1 text-center"
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: "clamp(19px, 2.2vw, 22px)",
              color: palette.ink,
              lineHeight: 1.12,
              filter: "url(#ink-bleed)",
            }}
          >
            {photo.caption}
          </figcaption>
        </div>
      </motion.div>
    </motion.figure>
  );
}

/* ── Generated scene illustration (varied per index) ───────────── */
function PhotoScene({ c1, c2, index }: { c1: string; c2: string; index: number }) {
  // Cycle through 5 illustrated scenes
  const scene = index % 5;
  return (
    <svg
      viewBox="0 0 144 192"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id={`pg-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="144" height="192" fill={`url(#pg-${index})`} />
      {scene === 0 && (
        <>
          {/* Sunset over hills */}
          <circle cx="100" cy="64" r="14" fill="#FBE7AC" opacity="0.85" />
          <circle cx="100" cy="64" r="22" fill="#FBE7AC" opacity="0.28" />
          <path d="M 0 130 Q 30 110 60 125 T 144 120 L 144 192 L 0 192 Z" fill={c2} opacity="0.85" />
          <path d="M 0 155 Q 30 140 60 152 T 144 148 L 144 192 L 0 192 Z" fill="#2A1810" />
        </>
      )}
      {scene === 1 && (
        <>
          {/* Mountains */}
          <path d="M -10 140 L 30 80 L 60 120 L 90 70 L 120 110 L 150 100 L 150 192 L -10 192 Z" fill={c2} opacity="0.8" />
          <path d="M -10 160 L 20 130 L 50 160 L 80 140 L 110 165 L 150 150 L 150 192 L -10 192 Z" fill="#2A2218" />
          <path d="M 28 84 L 30 80 L 33 86 Z" fill="#FBF8F0" opacity="0.85" />
          <path d="M 88 73 L 90 70 L 93 76 Z" fill="#FBF8F0" opacity="0.85" />
        </>
      )}
      {scene === 2 && (
        <>
          {/* Field */}
          <circle cx="110" cy="60" r="14" fill="#F5D896" opacity="0.85" />
          <path d="M 0 145 Q 40 130 80 145 T 144 140 L 144 192 L 0 192 Z" fill={c2} opacity="0.85" />
          <g stroke="#2A2218" strokeWidth="0.6" opacity="0.55">
            {Array.from({ length: 18 }).map((_, i) => {
              const x = 4 + i * 8;
              return <line key={i} x1={x} y1="180" x2={x + (i % 2 ? 1 : -1)} y2="140" />;
            })}
          </g>
        </>
      )}
      {scene === 3 && (
        <>
          {/* Sea */}
          <rect width="144" height="118" fill={c1} />
          <rect y="118" width="144" height="74" fill={c2} />
          <circle cx="40" cy="50" r="10" fill="#FBE7AC" opacity="0.85" />
          <g stroke="#FBF8F0" strokeWidth="0.5" fill="none" opacity="0.45">
            <path d="M 0 130 Q 18 127 36 130 T 72 130 T 108 130 T 144 130" />
            <path d="M 0 144 Q 18 141 36 144 T 72 144 T 108 144 T 144 144" />
            <path d="M 0 160 Q 18 157 36 160 T 72 160 T 108 160 T 144 160" />
          </g>
        </>
      )}
      {scene === 4 && (
        <>
          {/* Forest path */}
          <path d="M 0 105 Q 40 95 78 110 T 144 108 L 144 192 L 0 192 Z" fill={c2} opacity="0.8" />
          <path d="M 60 192 L 70 140 L 74 140 L 80 192 Z" fill="#3A2A1F" opacity="0.7" />
          {/* trees */}
          {[20, 40, 95, 120].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="100" x2={x} y2="60" stroke="#2A1810" strokeWidth="1" />
              <ellipse cx={x} cy="48" rx="10" ry="14" fill="#3A4A2A" opacity="0.75" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
