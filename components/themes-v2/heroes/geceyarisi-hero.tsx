"use client";

import { useMemo, useRef } from "react";
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
import { AtmosphereDefs, DustParticles, makeRng, r3 } from "../primitives/atmosphere";
import { THEME_ASSETS } from "@/lib/themes-v2/assets";

interface Star {
  x: number;
  y: number;
  r: number;
  dur: number;
  delay: number;
  bright: boolean;
}

/**
 * Geceyarısı — cinematic LIVING night sky.
 *
 * The previous build drew a beautiful scene that then froze. Premium
 * invitations never stop breathing, so this version layers perpetual,
 * GPU-cheap motion: 3 parallax star depths that react to scroll AND the
 * pointer, a nebula that breathes, a far field that slowly rotates like a
 * real sky, drifting gold dust, periodic shooting stars, a slow Ken-Burns
 * push on the painted backdrop, and a gold shimmer that sweeps the names.
 * All randomness is seeded (makeRng) so SSR and client match — no flash.
 */
export function GeceyarisiHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll parallax (different depths move at different rates) ── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yFar = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const yNear = useTransform(scrollYProgress, [0, 1], [0, 230]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  /* ── Pointer parallax (horizontal depth on mouse move) ── */
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 38, damping: 18 });
  const xFar = useTransform(sx, (v) => v * 8);
  const xMid = useTransform(sx, (v) => v * 18);
  const xNear = useTransform(sx, (v) => v * 32);

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
  };

  /* ── Seeded star layers ── */
  const { far, mid, near } = useMemo(() => {
    const mk = (seed: number, n: number, min: number, max: number, brightCut: number): Star[] => {
      const rnd = makeRng(seed);
      return Array.from({ length: n }, () => ({
        x: r3(rnd() * 100),
        y: r3(rnd() * 100),
        r: r3(min + rnd() * (max - min)),
        dur: r3(2.5 + rnd() * 5),
        delay: r3(rnd() * 5),
        bright: rnd() > brightCut,
      }));
    };
    return {
      far: mk(1011, 90, 0.3, 0.9, 2),
      mid: mk(2022, 46, 0.6, 1.5, 0.9),
      near: mk(3033, 22, 1.1, 2.3, 0.55),
    };
  }, []);

  const shootingStars = useMemo(
    () => [
      { startX: 8, startY: 14, dx: 22, dy: 9, delay: 4 },
      { startX: 68, startY: 9, dx: 26, dy: 11, delay: 15 },
      { startX: 30, startY: 26, dx: 20, dy: 7, delay: 26 },
    ],
    [],
  );

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-24"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      {/* Painted backdrop + gold foliage with slow Ken-Burns + far parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yFar }}
      >
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        >
          <picture>
            <source srcSet={THEME_ASSETS.geceyarisi.bg?.replace(".png", ".webp")} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THEME_ASSETS.geceyarisi.bg}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-95"
            />
          </picture>
          <picture>
            <source srcSet={THEME_ASSETS.geceyarisi.overlay?.replace(".png", ".webp")} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THEME_ASSETS.geceyarisi.overlay}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-75 mix-blend-screen"
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Breathing nebula clouds */}
      <motion.svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        style={{ y: reduced ? 0 : yFar }}
      >
        <defs>
          <radialGradient id="neb-1" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#5C4F8C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#5C4F8C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neb-2" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#4A6F9A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4A6F9A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="neb-3" cx="50%" cy="50%">
            <stop offset="0%" stopColor={palette.accent} stopOpacity="0.25" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <motion.ellipse
          cx="240" cy="180" rx="380" ry="240" fill="url(#neb-1)" style={{ filter: "blur(40px)" }}
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.06, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="980" cy="540" rx="420" ry="280" fill="url(#neb-2)" style={{ filter: "blur(50px)" }}
          animate={reduced ? undefined : { opacity: [0.6, 0.95, 0.6], scale: [1.05, 1, 1.05] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.ellipse
          cx="600" cy="400" rx="320" ry="200" fill="url(#neb-3)" style={{ filter: "blur(60px)" }}
          animate={reduced ? undefined : { opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.svg>

      {/* Star layers — scroll drives vertical depth, mouse drives horizontal.
          The far field also rotates very slowly like a real sky. */}
      <StarLayer stars={far} x={reduced ? undefined : xFar} y={yFar} accent={palette.accent} rotate={!reduced} reduced={!!reduced} />
      <StarLayer stars={mid} x={reduced ? undefined : xMid} y={yMid} accent={palette.accent} reduced={!!reduced} />
      <StarLayer stars={near} x={reduced ? undefined : xNear} y={yNear} accent={palette.accent} reduced={!!reduced} />

      {/* Shooting stars */}
      {!reduced && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="shooting-trail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFAD5" stopOpacity="0" />
              <stop offset="100%" stopColor="#FFFAD5" stopOpacity="1" />
            </linearGradient>
          </defs>
          {shootingStars.map((ss, i) => (
            <motion.g
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ delay: ss.delay, duration: 1.4, repeat: Infinity, repeatDelay: 22, times: [0, 0.1, 0.9, 1] }}
            >
              <motion.line
                x1={`${ss.startX}%`} y1={`${ss.startY}%`}
                stroke="url(#shooting-trail)" strokeWidth="2" strokeLinecap="round"
                initial={{ x2: `${ss.startX}%`, y2: `${ss.startY}%` }}
                animate={{ x2: `${ss.startX + ss.dx}%`, y2: `${ss.startY + ss.dy}%` }}
                transition={{ delay: ss.delay, duration: 1.2, repeat: Infinity, repeatDelay: 22 }}
              />
              <motion.circle
                r="2.5" fill="#FFFAD5" style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9))" }}
                initial={{ cx: `${ss.startX}%`, cy: `${ss.startY}%` }}
                animate={{ cx: `${ss.startX + ss.dx}%`, cy: `${ss.startY + ss.dy}%` }}
                transition={{ delay: ss.delay, duration: 1.2, repeat: Infinity, repeatDelay: 22 }}
              />
            </motion.g>
          ))}
        </svg>
      )}

      {/* Halo behind title */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 3 }}
        style={{
          width: 720, height: 720,
          background: "radial-gradient(circle, rgba(212,168,82,0.22) 0%, rgba(212,168,82,0.08) 35%, rgba(212,168,82,0) 70%)",
        }}
      />

      {/* Gold dust foreground */}
      <DustParticles color={palette.accent} count={26} opacity={0.5} />

      {/* Soft scrim lifts text legibility over the bright nebula core,
          while fading to transparent so the painted edges stay vivid. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[960px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,16,38,0.62) 0%, rgba(10,16,38,0.34) 44%, rgba(10,16,38,0) 72%)",
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y: reduced ? 0 : yContent, opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 mx-auto max-w-[860px] text-center"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <ArtDeco accent={palette.accent} />

          <p className="mt-6 text-[10.5px] uppercase" style={{ color: palette.accent, letterSpacing: "0.5em", fontWeight: 500 }}>
            Save the Date
          </p>

          <ShimmerNames
            partnerOne={data.partnerOne}
            partnerTwo={data.partnerTwo}
            ink={palette.ink}
            accent={palette.accent}
            reduced={!!reduced}
          />

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1.4 }}
            className="mx-auto my-8 flex items-center justify-center gap-4"
          >
            <span className="block h-px w-12" style={{ background: palette.accent, opacity: 0.6 }} />
            <svg width="14" height="14" viewBox="0 0 14 14">
              <polygon points="7,0 9,5 14,5 10,8 12,14 7,11 2,14 4,8 0,5 5,5" fill={palette.accent} />
            </svg>
            <span className="block h-px w-12" style={{ background: palette.accent, opacity: 0.6 }} />
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 1.4 }}
            className="font-display italic"
            style={{ fontSize: "clamp(19px, 2.4vw, 28px)", color: palette.inkSoft, letterSpacing: "0.05em" }}
          >
            {data.date.day} · {data.date.month} · {data.date.year}
          </motion.p>
          {data.date.weekday && (
            <motion.p
              initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1.4 }}
              className="mt-2 text-[10px] uppercase"
              style={{ color: palette.accent, opacity: 0.78, letterSpacing: "0.4em" }}
            >
              {data.date.weekday}
            </motion.p>
          )}

          <motion.p
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1.4 }}
            className="mt-7 text-[10.5px] uppercase"
            style={{ color: palette.accent, letterSpacing: "0.36em", opacity: 0.85 }}
          >
            {data.venue.name}
          </motion.p>
          {data.venue.city && (
            <motion.p
              initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.4, duration: 1.4 }}
              className="mt-2 font-display italic"
              style={{ fontSize: 14, color: palette.inkSoft, opacity: 0.75 }}
            >
              {data.venue.city}
            </motion.p>
          )}

          <motion.div
            initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.7, duration: 1.2 }}
            className="mt-10"
          >
            <ArtDeco accent={palette.accent} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── A parallax star layer (twinkling, optionally slow-rotating) ─────── */
function StarLayer({
  stars,
  x,
  y,
  accent,
  rotate = false,
  reduced,
}: {
  stars: Star[];
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  accent: string;
  rotate?: boolean;
  reduced: boolean;
}) {
  return (
    <motion.svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      style={{ x, y, transformOrigin: "50% 50%" }}
      animate={rotate && !reduced ? { rotate: 360 } : undefined}
      transition={rotate && !reduced ? { duration: 320, repeat: Infinity, ease: "linear" } : undefined}
    >
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill={s.bright ? "#FFE7AC" : accent}
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: reduced ? 0.7 : [0.18, s.bright ? 1 : 0.85, 0.4, s.bright ? 1 : 0.85, 0.18],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: reduced ? 0 : Infinity, ease: "easeInOut" }}
          style={{ filter: s.bright ? "drop-shadow(0 0 4px rgba(212,168,82,0.8))" : undefined }}
        />
      ))}
    </motion.svg>
  );
}

/* ── Couple names with a slow gold shimmer sweep ─────────────────────── */
function ShimmerNames({
  partnerOne,
  partnerTwo,
  ink,
  accent,
  reduced,
}: {
  partnerOne: string;
  partnerTwo: string;
  ink: string;
  accent: string;
  reduced: boolean;
}) {
  const base = {
    fontWeight: 300,
    fontSize: "clamp(46px, 7.5vw, 92px)",
    lineHeight: 1.02,
  } as const;

  return (
    <motion.h1
      initial={reduced ? false : { letterSpacing: "0.12em", opacity: 0, y: 14 }}
      animate={{ letterSpacing: "0.04em", opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 2 }}
      className="mt-8 font-display"
      style={base}
    >
      <motion.span
        style={{
          ...base,
          backgroundImage: `linear-gradient(110deg, ${ink} 0%, ${ink} 42%, #FFF6DC 50%, ${ink} 58%, ${ink} 100%)`,
          backgroundSize: "260% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 24px rgba(212,168,82,0.25)",
        }}
        animate={reduced ? undefined : { backgroundPositionX: ["160%", "-60%"] }}
        transition={{ duration: 6.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
      >
        {partnerOne}
      </motion.span>
      <span className="px-4 italic" style={{ color: accent, WebkitTextFillColor: accent }}>
        &amp;
      </span>
      <motion.span
        style={{
          ...base,
          backgroundImage: `linear-gradient(110deg, ${ink} 0%, ${ink} 42%, #FFF6DC 50%, ${ink} 58%, ${ink} 100%)`,
          backgroundSize: "260% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 24px rgba(212,168,82,0.25)",
        }}
        animate={reduced ? undefined : { backgroundPositionX: ["160%", "-60%"] }}
        transition={{ duration: 6.5, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut", delay: 0.4 }}
      >
        {partnerTwo}
      </motion.span>
    </motion.h1>
  );
}

/* ── Art deco ornament ──────────────────────────────────────────────── */
function ArtDeco({ accent }: { accent: string }) {
  return (
    <svg width="120" height="20" viewBox="0 0 120 20" className="mx-auto">
      <g stroke={accent} fill={accent} strokeWidth="0.8" opacity="0.85">
        <line x1="0" y1="10" x2="40" y2="10" />
        <line x1="80" y1="10" x2="120" y2="10" />
        <polygon points="50,10 60,2 70,10 60,18" fill={accent} stroke="none" />
        <circle cx="60" cy="10" r="2" fill={accent} stroke="none" />
        <circle cx="60" cy="10" r="6" fill="none" />
      </g>
    </svg>
  );
}
