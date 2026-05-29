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
import {
  AtmosphereDefs,
  DustParticles,
  PaperGrain,
  WatercolorWash,
  makeRng,
  r3,
} from "../primitives/atmosphere";
import { THEME_ASSETS, THEME_VIDEO } from "@/lib/themes-v2/assets";

/**
 * Kurdele — the LIVING pressed-paper letter.
 *
 * The tap-to-open envelope ceremony is now owned by the global shell
 * (OpeningCeremony), so this hero is the *revealed letter* — and the old
 * build had a fatal flaw: it played one entrance animation then froze into
 * a flat JPEG-feeling card. Premium stationery is never still: paper lifts
 * and settles, ribbon silk catches a draft, the watercolour wash blooms and
 * recedes, dust drifts in the light.
 *
 * This version applies the Geceyarısı "living motion" playbook to a calm,
 * feminine palette:
 *   • multi-depth scroll parallax (vellum < wash < card) via useScroll
 *   • horizontal pointer parallax via useMotionValue + useSpring
 *   • perpetual breathing/Ken-Burns on the vellum + blue-wash layers
 *   • a ribbon that perpetually flutters & sways (gentle silk physics)
 *   • the letter card breathes (micro scale) and its shadow lifts
 *   • dusty-blue ambient DustParticles
 *
 * All randomness is seeded (makeRng) and all computed numbers in SSR markup
 * are rounded (r3) so the server and client render byte-identical strings —
 * mandatory under force-static SSR or the page hydration-errors.
 */
export function KurdeleHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll parallax — three depths drift at different rates ───────── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yVellum = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yWash = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* ── Pointer parallax — gentle horizontal depth on mouse move ──────── */
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 34, damping: 20 });
  const xVellum = useTransform(sx, (v) => v * 10);
  const xWash = useTransform(sx, (v) => v * 22);
  const xCard = useTransform(sx, (v) => v * -7);

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      {/* Bottom-most full-bleed backdrop. When a cinematic clip exists we play
          a fal.ai VIDEO (poster = the vellum still, a graceful fallback) as the
          deepest layer with vellum parallax; otherwise the real vellum paper
          still with a slow Ken-Burns so the grain never sits perfectly still. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: reduced ? 0 : xVellum, y: reduced ? 0 : yVellum }}
      >
        {THEME_VIDEO.kurdele ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={THEME_ASSETS.kurdele.texture}
            aria-hidden
          >
            <source src={THEME_VIDEO.kurdele} type="video/mp4" />
          </video>
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { scale: [1.04, 1.1, 1.04] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          >
            <picture>
              <source srcSet={THEME_ASSETS.kurdele.texture?.replace(".png", ".webp")} type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THEME_ASSETS.kurdele.texture}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            </picture>
          </motion.div>
        )}
      </motion.div>

      {/* Soft cream scrim — only over the video backdrop, lifting the letter
          card's legibility while staying transparent at the edges so the clip
          reads through. (The still backdrop already sits at 80% opacity.) */}
      {THEME_VIDEO.kurdele && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(244,241,234,0.55) 0%, rgba(244,241,234,0.32) 46%, rgba(244,241,234,0.12) 74%)",
          }}
        />
      )}

      {/* Hand-painted blue wash blot — corner accent that breathes
          (opacity + scale loop) and drifts with the deeper parallax. */}
      <motion.div
        className="pointer-events-none absolute -bottom-20 -right-20 h-[62vh] w-[62vh] max-w-[820px]"
        style={{ x: reduced ? 0 : xWash, y: reduced ? 0 : yWash }}
      >
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.07, 1], opacity: [0.5, 0.66, 0.5] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        >
          <picture>
            <source srcSet={THEME_ASSETS.kurdele.accent?.replace(".png", ".webp")} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THEME_ASSETS.kurdele.accent}
              alt=""
              aria-hidden
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Second, cooler wash bloom drifting from the opposite corner so the
          whole field feels alive rather than one static blot. */}
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 h-[48vh] w-[48vh] max-w-[640px]"
        style={{ y: reduced ? 0 : yWash }}
      >
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1.05, 1, 1.05], opacity: [0.32, 0.46, 0.32] }}
          transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <picture>
            <source srcSet={THEME_ASSETS.kurdele.accent?.replace(".png", ".webp")} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THEME_ASSETS.kurdele.accent}
              alt=""
              aria-hidden
              className="h-full w-full -scale-x-100 object-contain mix-blend-multiply"
            />
          </picture>
        </motion.div>
      </motion.div>

      <WatercolorWash
        layers={[
          { cx: 200, cy: 160, rx: 320, ry: 180, color: palette.accent, opacity: 0.22, blur: 8 },
        ]}
      />

      <PaperGrain intensity={0.25} />

      {/* Dusty-blue ambient particles drifting in the light. */}
      <DustParticles color={palette.accent} count={22} opacity={0.4} />

      {/* Eyebrow + supporting line — premium wide-tracked hierarchy. */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        className="relative z-10 mb-3 text-[10.5px] uppercase"
        style={{
          color: palette.inkSoft,
          letterSpacing: "0.42em",
          fontWeight: 500,
        }}
      >
        {data.eyebrow}
      </motion.p>
      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.9 }}
        className="relative z-10 mb-10 font-display italic"
        style={{
          fontSize: "clamp(15px, 1.6vw, 18px)",
          color: palette.ink,
        }}
      >
        Bir davet sizi bekliyor
      </motion.p>

      {/* The living letter — parallax + breath + lifting shadow. */}
      <motion.div
        style={{
          x: reduced ? 0 : xCard,
          y: reduced ? 0 : yCard,
          opacity: reduced ? 1 : cardOpacity,
        }}
        className="relative z-10 w-full max-w-[540px] px-4"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <LivingLetter
            paper={palette.paper}
            ink={palette.ink}
            inkSoft={palette.inkSoft}
            accent={palette.accent}
            partnerOne={data.partnerOne}
            partnerTwo={data.partnerTwo}
            date={`${data.date.day} ${data.date.month} ${data.date.year}`}
            weekday={data.date.weekday ?? ""}
            time={data.date.time ?? ""}
            venue={data.venue.name}
            city={data.venue.city ?? ""}
            greeting={data.greeting}
            monogram={data.monogram}
            reduced={!!reduced}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── The revealed letter — a card that perpetually breathes, crowned by a
      blue silk ribbon that flutters in a draft. ────────────────────────── */
function LivingLetter({
  paper,
  ink,
  inkSoft,
  accent,
  partnerOne,
  partnerTwo,
  date,
  weekday,
  time,
  venue,
  city,
  greeting,
  monogram,
  reduced,
}: {
  paper: string;
  ink: string;
  inkSoft: string;
  accent: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  weekday: string;
  time: string;
  venue: string;
  city: string;
  greeting: string;
  monogram: string;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="relative mx-auto"
      style={{ transformOrigin: "50% 38%" }}
      /* Card breathes: a barely-there scale + lift so the paper feels like it
         is resting on air, never frozen. */
      animate={reduced ? undefined : { scale: [1, 1.012, 1], y: [0, -5, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Soft drop-shadow that lifts & settles with the card's breath. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-6 -z-10 h-16"
        style={{
          background: `radial-gradient(ellipse at center, ${ink}33 0%, ${ink}00 72%)`,
          filter: "blur(8px)",
        }}
        animate={reduced ? undefined : { opacity: [0.5, 0.78, 0.5], scaleX: [0.92, 1, 0.92] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fluttering blue ribbon draped over the top edge. */}
      <RibbonDrape accent={accent} ink={ink} reduced={reduced} />

      <div
        className="relative flex flex-col items-center px-8 pb-14 pt-16 text-center sm:pb-16"
        style={{
          backgroundColor: paper,
          border: `1px solid ${ink}1a`,
          boxShadow: "0 40px 80px -30px rgba(46,57,66,0.35), 0 12px 22px rgba(46,57,66,0.15)",
          maxWidth: 520,
          borderRadius: 2,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.15 0 0 0 0 0.12 0 0 0 0 0.08 0 0 0 0.3 0'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>\")",
        }}
      >
        {/* Top botanical doodle. */}
        <svg width="80" height="32" viewBox="0 0 80 32" className="mb-2">
          <g stroke={accent} strokeWidth="1" fill="none" strokeLinecap="round">
            <path d="M 10 18 Q 25 8 40 18 Q 55 28 70 18" />
            <ellipse cx="20" cy="14" rx="3" ry="1.4" fill={accent} fillOpacity="0.5" transform="rotate(-30 20 14)" />
            <ellipse cx="60" cy="14" rx="3" ry="1.4" fill={accent} fillOpacity="0.5" transform="rotate(30 60 14)" />
            <circle cx="40" cy="18" r="2" fill={accent} fillOpacity="0.7" />
          </g>
        </svg>

        <p className="text-[10.5px] uppercase" style={{ color: accent, letterSpacing: "0.42em" }}>
          Save the Date
        </p>

        {/* Couple names — large calligraphy hierarchy. */}
        <div className="mb-3 mt-7">
          <p
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: "clamp(44px, 6.5vw, 68px)",
              color: ink,
              lineHeight: 0.95,
              filter: "url(#ink-bleed)",
            }}
          >
            {partnerOne}
          </p>
          <div className="my-1 flex items-center justify-center gap-3">
            <span className="block h-px w-8" style={{ background: accent, opacity: 0.7 }} />
            <p className="font-display italic" style={{ fontSize: 14, color: accent, letterSpacing: "0.05em" }}>
              ve
            </p>
            <span className="block h-px w-8" style={{ background: accent, opacity: 0.7 }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: "clamp(44px, 6.5vw, 68px)",
              color: ink,
              lineHeight: 0.95,
              filter: "url(#ink-bleed)",
            }}
          >
            {partnerTwo}
          </p>
        </div>

        <div className="mb-5 mt-3 h-px w-12 opacity-30" style={{ background: ink }} />

        <p
          className="font-display italic"
          style={{
            fontSize: "clamp(18px, 2vw, 22px)",
            color: ink,
          }}
        >
          {date}
        </p>
        {(weekday || time) && (
          <p
            className="mt-1.5 text-[10px] uppercase"
            style={{ color: inkSoft, letterSpacing: "0.32em" }}
          >
            {[weekday, time].filter(Boolean).join(" · ")}
          </p>
        )}

        <p
          className="mx-auto mt-7 max-w-[340px] font-display italic"
          style={{
            fontSize: 14.5,
            color: inkSoft,
            lineHeight: 1.75,
          }}
        >
          {greeting}
        </p>

        <div className="mt-8 flex items-center gap-3">
          <span className="block h-px w-8" style={{ background: accent, opacity: 0.5 }} />
          <div
            className="flex h-7 w-7 items-center justify-center"
            style={{
              backgroundColor: accent,
              borderRadius: "50%",
              color: paper,
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 11,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.18) inset, 0 0 0 1px rgba(255,255,255,0.2) inset",
            }}
          >
            {monogram}
          </div>
          <span className="block h-px w-8" style={{ background: accent, opacity: 0.5 }} />
        </div>

        <p
          className="mt-7 text-[10px] uppercase"
          style={{ color: accent, letterSpacing: "0.36em" }}
        >
          {venue}
        </p>
        {city && (
          <p className="mt-1 text-[11px] italic" style={{ color: inkSoft }}>
            {city}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Blue silk ribbon draped over the letter's top edge, perpetually
      fluttering in a soft draft. The strap sways, the bow loops breathe,
      and the tails wave like real ribbon. ──────────────────────────────── */
function RibbonDrape({
  accent,
  ink,
  reduced,
}: {
  accent: string;
  ink: string;
  reduced: boolean;
}) {
  /* Seeded micro-jitter for the frayed-edge stitches so SSR matches the
     client byte-for-byte (no Math.random in the render path). */
  const frays = useMemo(() => {
    const rnd = makeRng(4721);
    return Array.from({ length: 56 }, (_, i) => ({
      x: r3(36 + i * 9),
      j: r3((rnd() - 0.5) * 1.4),
    }));
  }, []);

  return (
    /* Static wrapper owns the horizontal centering (-translate-x-1/2) so the
       inner motion.svg is free to drive its own transform (rotate/y) without
       clobbering the centering translate. */
    <div className="pointer-events-none absolute -top-9 left-1/2 z-20 h-24 w-[78%] -translate-x-1/2">
    <motion.svg
      className="h-full w-full overflow-visible"
      viewBox="0 0 560 150"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden
      style={{ transformOrigin: "50% 0%", filter: `drop-shadow(0 6px 10px ${ink}33)` }}
      /* Whole ribbon sways gently as if a breath of air moves it. */
      animate={reduced ? undefined : { rotate: [-1.1, 1.1, -1.1], y: [0, 1.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="kr-ribbon-fabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shade(accent, 10)} />
          <stop offset="50%" stopColor={accent} />
          <stop offset="100%" stopColor={shade(accent, -12)} />
        </linearGradient>
        <pattern id="kr-linen-weave" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="transparent" />
          <line x1="0" y1="2" x2="4" y2="2" stroke={shade(accent, -16)} strokeWidth="0.4" opacity="0.4" />
          <line x1="2" y1="0" x2="2" y2="4" stroke={shade(accent, -16)} strokeWidth="0.4" opacity="0.4" />
        </pattern>
        {/* Soft sheen that travels across the silk on a slow loop. */}
        <linearGradient id="kr-ribbon-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          {!reduced && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="6s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>

      {/* Horizontal strap pinned at the top edge of the card. */}
      <g>
        <rect x="30" y="86" width="500" height="30" fill="url(#kr-ribbon-fabric)" />
        <rect x="30" y="86" width="500" height="30" fill="url(#kr-linen-weave)" />
        <rect x="30" y="86" width="500" height="30" fill="url(#kr-ribbon-sheen)" />
        {/* Frayed edges (seeded jitter, no Math.random in render). */}
        <g stroke={shade(accent, 12)} strokeWidth="0.4" opacity="0.55">
          {frays.map((f, i) => (
            <line key={`t${i}`} x1={f.x} y1="86" x2={f.x + 1.5 + f.j} y2={r3(82 + f.j)} />
          ))}
        </g>
        <g stroke={shade(accent, -16)} strokeWidth="0.4" opacity="0.55">
          {frays.map((f, i) => (
            <line key={`b${i}`} x1={f.x} y1="116" x2={f.x + 1.5 + f.j} y2={r3(120 + f.j)} />
          ))}
        </g>
      </g>

      {/* Bow + tails — the silk loops gently breathe and the tails wave. */}
      <motion.g
        style={{ transformOrigin: "280px 100px" }}
        animate={reduced ? undefined : { scaleX: [1, 1.025, 1], rotate: [-0.6, 0.6, -0.6] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Left loop */}
        <path
          d="M 280 100 C 220 50 170 50 190 98 C 204 130 260 110 280 100 Z"
          fill="url(#kr-ribbon-fabric)"
          stroke={shade(accent, -20)}
          strokeWidth="0.6"
          strokeOpacity="0.3"
        />
        {/* Right loop */}
        <path
          d="M 280 100 C 340 50 390 50 370 98 C 356 130 300 110 280 100 Z"
          fill="url(#kr-ribbon-fabric)"
          stroke={shade(accent, -20)}
          strokeWidth="0.6"
          strokeOpacity="0.3"
        />
        {/* Loop inner shadows for depth */}
        <path d="M 212 74 C 200 86 198 100 210 104" fill="none" stroke={shade(accent, -28)} strokeWidth="0.8" opacity="0.4" />
        <path d="M 348 74 C 360 86 362 100 350 104" fill="none" stroke={shade(accent, -28)} strokeWidth="0.8" opacity="0.4" />

        {/* Tails — independently waving so the silk reads as cloth. */}
        <motion.path
          d="M 270 116 L 254 150 L 276 150 Z"
          fill={accent}
          style={{ transformOrigin: "270px 116px" }}
          animate={reduced ? undefined : { rotate: [-2.5, 2.5, -2.5], skewX: [-2, 2, -2] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 290 116 L 306 150 L 284 150 Z"
          fill={shade(accent, -6)}
          style={{ transformOrigin: "290px 116px" }}
          animate={reduced ? undefined : { rotate: [2.5, -2.5, 2.5], skewX: [2, -2, 2] }}
          transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />

        {/* Knot center sits above the loops. */}
        <rect x="266" y="86" width="28" height="30" rx="2" fill={shade(accent, -8)} stroke={ink} strokeOpacity="0.2" strokeWidth="0.6" />
        <rect x="266" y="86" width="28" height="30" rx="2" fill="url(#kr-linen-weave)" />
        <line x1="266" y1="88" x2="294" y2="88" stroke="#fff" strokeOpacity="0.3" strokeWidth="0.6" />
      </motion.g>
    </motion.svg>
    </div>
  );
}

/* ── Color shade util ───────────────────────────────────────────── */
function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
