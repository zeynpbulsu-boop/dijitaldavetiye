"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, PolaroidPhoto } from "@/lib/themes-v2/types";
import { AtmosphereDefs, PaperGrain } from "./atmosphere";

interface Props {
  meta: ThemeV2Meta;
  photos: PolaroidPhoto[];
  title?: string;
  intro?: string;
}

export function PolaroidGallery({
  meta,
  photos,
  title = "Anılarımız",
  intro,
}: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  // Pre-set scene tones so each polaroid is visually distinct
  const sceneTones = [
    ["#E8C998", "#A86E40"],
    ["#B8C5A5", "#5A6B4A"],
    ["#D9B59E", "#7A4F38"],
    ["#9CB5C5", "#3F5566"],
    ["#E5C5A8", "#8B5E3D"],
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32" style={{ backgroundColor: palette.bg }}>
      <AtmosphereDefs />
      <PaperGrain intensity={0.3} />

      <div className="relative mx-auto max-w-[1200px] text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9 }}
          className="text-[10.5px] uppercase"
          style={{
            color: palette.accent,
            letterSpacing: "0.42em",
            fontWeight: 500,
          }}
        >
          Hikâyemiz
        </motion.p>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="mt-4 font-display italic"
          style={{
            fontSize: "clamp(30px, 3.8vw, 46px)",
            color: palette.ink,
            letterSpacing: "0.005em",
            filter: "url(#ink-bleed)",
          }}
        >
          {title}
        </motion.p>

        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto my-6 h-px w-14 opacity-50"
          style={{ background: palette.ink }}
        />

        {intro && (
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mx-auto mt-4 max-w-[640px] font-display italic"
            style={{
              fontSize: "clamp(15px, 1.7vw, 19px)",
              lineHeight: 1.85,
              color: palette.inkSoft,
              letterSpacing: "0.005em",
            }}
          >
            {intro}
          </motion.p>
        )}

        <div className="mt-16 flex flex-wrap items-end justify-center gap-7 sm:gap-12">
          {photos.map((photo, i) => {
            const [c1, c2] = sceneTones[i % sceneTones.length];
            return (
              <motion.div
                key={i}
                initial={reduced ? false : { y: 50, opacity: 0, rotate: 0 }}
                whileInView={
                  reduced
                    ? { opacity: 1 }
                    : { y: 0, opacity: 1, rotate: photo.rotation ?? 0 }
                }
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={
                  reduced
                    ? undefined
                    : {
                        y: -10,
                        rotate: (photo.rotation ?? 0) * 0.4,
                        transition: { duration: 0.4 },
                      }
                }
                className="relative"
                style={{ rotate: `${photo.rotation ?? 0}deg` }}
              >
                {/* Washi tape */}
                <div
                  className="absolute -top-2 left-1/2 z-10 -translate-x-1/2"
                  style={{
                    width: 58,
                    height: 18,
                    backgroundColor: palette.accent,
                    opacity: 0.7,
                    backgroundImage:
                      "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                  }}
                />

                <div
                  className="flex flex-col items-center"
                  style={{
                    backgroundColor: palette.paper,
                    padding: "12px 12px 24px",
                    boxShadow:
                      "0 1px 0 rgba(255,255,255,0.7) inset, 0 22px 36px -20px rgba(58,42,31,0.4), 0 4px 8px rgba(58,42,31,0.12)",
                    borderRadius: 2,
                    width: 180,
                  }}
                >
                  <div
                    className="relative h-[200px] w-full overflow-hidden"
                    style={{ backgroundColor: c1 }}
                  >
                    {photo.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photo.src}
                        alt={photo.caption}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <PhotoScene c1={c1} c2={c2} index={i} />
                    )}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        boxShadow: "inset 0 0 20px rgba(0,0,0,0.18)",
                      }}
                    />
                  </div>
                  <p
                    className="mt-4 text-center"
                    style={{
                      fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
                      fontSize: 19,
                      color: palette.ink,
                      lineHeight: 1.15,
                      filter: "url(#ink-bleed)",
                    }}
                  >
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Generated scene illustration (varied per index) ───────────── */
function PhotoScene({ c1, c2, index }: { c1: string; c2: string; index: number }) {
  // Cycle through 5 illustrated scenes
  const scene = index % 5;
  return (
    <svg viewBox="0 0 144 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`pg-${index}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="144" height="200" fill={`url(#pg-${index})`} />
      {scene === 0 && (
        <>
          {/* Sunset over hills */}
          <circle cx="100" cy="64" r="14" fill="#FBE7AC" opacity="0.85" />
          <circle cx="100" cy="64" r="22" fill="#FBE7AC" opacity="0.28" />
          <path d="M 0 130 Q 30 110 60 125 T 144 120 L 144 200 L 0 200 Z" fill={c2} opacity="0.85" />
          <path d="M 0 155 Q 30 140 60 152 T 144 148 L 144 200 L 0 200 Z" fill="#2A1810" />
        </>
      )}
      {scene === 1 && (
        <>
          {/* Mountains */}
          <path d="M -10 140 L 30 80 L 60 120 L 90 70 L 120 110 L 150 100 L 150 200 L -10 200 Z" fill={c2} opacity="0.8" />
          <path d="M -10 160 L 20 130 L 50 160 L 80 140 L 110 165 L 150 150 L 150 200 L -10 200 Z" fill="#2A2218" />
          <path d="M 28 84 L 30 80 L 33 86 Z" fill="#FBF8F0" opacity="0.85" />
          <path d="M 88 73 L 90 70 L 93 76 Z" fill="#FBF8F0" opacity="0.85" />
        </>
      )}
      {scene === 2 && (
        <>
          {/* Field */}
          <circle cx="110" cy="60" r="14" fill="#F5D896" opacity="0.85" />
          <path d="M 0 145 Q 40 130 80 145 T 144 140 L 144 200 L 0 200 Z" fill={c2} opacity="0.85" />
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
          <rect width="144" height="120" fill={c1} />
          <rect y="120" width="144" height="80" fill={c2} />
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
          <path d="M 0 105 Q 40 95 78 110 T 144 108 L 144 200 L 0 200 Z" fill={c2} opacity="0.8" />
          <path d="M 60 200 L 70 140 L 74 140 L 80 200 Z" fill="#3A2A1F" opacity="0.7" />
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
