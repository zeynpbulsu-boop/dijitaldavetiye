"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { ThemeV2Props } from "@/lib/themes-v2/types";
import { AtmosphereDefs, PaperGrain, DustParticles, makeRng, r3 } from "../primitives/atmosphere";
import { THEME_ASSETS } from "@/lib/themes-v2/assets";

/**
 * Defter — Premium open notebook spread that NEVER stops breathing.
 *
 * The earlier build drew a gorgeous journal that played one entrance and then
 * froze, which read as "template-y". Premium invitations stay alive, so this
 * version keeps every bit of the bespoke art (linen cover, stitched spine,
 * frayed ribbon, leather corner caps, ruled paper, pressed wildflower, coffee
 * stain, hand-inked details, calligraphy names, wax monogram) and layers
 * perpetual, GPU-cheap motion on top:
 *
 *   • multi-depth scroll parallax (linen → notebook → content move apart)
 *   • subtle horizontal mouse parallax with spring smoothing
 *   • slow Ken-Burns drift on the real linen texture
 *   • an open page that perpetually "breathes" — a soft lift/shadow swell
 *     plus a hair of rotateX, like paper settling on a table
 *   • pressed flower gently swaying as if caught in a draught
 *   • ink-bleed handwritten names that softly pulse their bleed
 *   • warm drifting dust + soft paper grain
 *
 * All randomness is seeded (makeRng) and every computed number that lands in
 * SSR markup is rounded with r3() so server and client serialize identically —
 * no hydration mismatch, no flash. prefers-reduced-motion collapses everything
 * to a calm static spread.
 */
export function DefterHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll parallax (depths drift apart as the page scrolls away) ── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yLinen = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yBook = useTransform(scrollYProgress, [0, 1], [0, 36]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 96]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bookScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  /* ── Pointer parallax (gentle horizontal depth on mouse move) ── */
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 34, damping: 20 });
  const xLinen = useTransform(sx, (v) => v * 10);
  const xBook = useTransform(sx, (v) => v * 22);
  const rotYBook = useTransform(sx, (v) => r3(v * 3));

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
  };

  /* ── Seeded floating petals (decorative, behind the notebook) ── */
  const petals = useMemo(() => {
    const rnd = makeRng(5170);
    return Array.from({ length: 7 }, () => ({
      x: r3(6 + rnd() * 88),
      y: r3(8 + rnd() * 84),
      size: r3(8 + rnd() * 12),
      rot: r3(rnd() * 360),
      dur: r3(13 + rnd() * 10),
      delay: r3(rnd() * -14),
      drift: r3(6 + rnd() * 10),
      sway: r3(8 + rnd() * 12),
    }));
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-20"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      {/* Real linen texture — slow Ken-Burns drift + far parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yLinen, x: reduced ? 0 : xLinen }}
      >
        <motion.div
          className="absolute inset-[-6%]"
          animate={reduced ? undefined : { scale: [1, 1.07, 1], x: ["0%", "-1.5%", "0%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        >
          <picture>
            <source srcSet={THEME_ASSETS.defter.texture?.replace(".png", ".webp")} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THEME_ASSETS.defter.texture}
              alt=""
              aria-hidden
              className="h-full w-full object-cover opacity-60"
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Linen weave bg accent */}
      <BgLinen ink={palette.ink} />
      <PaperGrain intensity={0.35} />

      {/* Warm floating petals drifting behind the spread */}
      <PetalDrift petals={petals} accent={palette.accent} reduced={!!reduced} />

      {/* Warm drifting dust */}
      <DustParticles color={palette.inkSoft} count={16} opacity={0.3} />

      {/* Vignette + a breathing warm glow that gives the scene a heartbeat */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(45,36,24,0.2) 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 900,
          height: 660,
          background: `radial-gradient(ellipse at center, ${hexA(palette.accent, 0.12)} 0%, ${hexA(palette.accent, 0.04)} 45%, ${hexA(palette.accent, 0)} 72%)`,
        }}
        animate={reduced ? undefined : { opacity: [0.6, 1, 0.6], scale: [1, 1.04, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Notebook spread — entrance, then perpetual breathing lift + parallax */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[1140px]"
        style={{
          perspective: 2400,
          y: reduced ? 0 : yBook,
          x: reduced ? 0 : xBook,
          rotateY: reduced ? 0 : rotYBook,
          scale: reduced ? 1 : bookScale,
        }}
      >
        <BreathingPage reduced={!!reduced}>
          {/* Notebook spread */}
          <div
            className="relative mx-auto grid grid-cols-1 overflow-hidden sm:grid-cols-2"
            style={{
              minHeight: 600,
              background: `linear-gradient(135deg, ${palette.paper} 0%, ${shade(palette.paper, -4)} 50%, ${palette.paper} 100%)`,
              borderRadius: 4,
            }}
          >
            {/* ── Spine with stitched thread ─────────────── */}
            <div
              className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 sm:block"
              style={{
                background: `linear-gradient(to right, transparent, ${palette.ink}45 30%, ${palette.ink}65 50%, ${palette.ink}45 70%, transparent)`,
              }}
            />
            <svg
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-2 -translate-x-1/2 sm:block"
              preserveAspectRatio="none"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <line
                  key={i}
                  x1="4"
                  y1={i * 5}
                  x2="4"
                  y2={i * 5 + 2.5}
                  stroke={palette.ink}
                  strokeWidth="0.6"
                  opacity="0.4"
                />
              ))}
            </svg>

            {/* Bookmark ribbon — sways ever so slightly from the top pin */}
            <motion.div
              className="absolute -top-1 right-16 hidden flex-col items-center sm:flex"
              style={{ width: 32, zIndex: 5, transformOrigin: "50% 0%" }}
              animate={reduced ? undefined : { rotate: [-1.4, 1.4, -1.4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                style={{
                  width: 32,
                  height: 110,
                  background: `linear-gradient(to right, ${shade(palette.accent, 4)}, ${palette.accent} 50%, ${shade(palette.accent, -8)})`,
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)",
                  boxShadow: "0 8px 12px -4px rgba(0,0,0,0.35)",
                }}
              />
              {/* Frayed edge */}
              <svg width="32" height="6" style={{ marginTop: -1 }}>
                {[0, 6, 12, 18, 24, 30].map((x, i) => (
                  <line key={i} x1={x} y1="0" x2={x + 0.5} y2="5" stroke={shade(palette.accent, -16)} strokeWidth="0.6" opacity="0.5" />
                ))}
              </svg>
            </motion.div>

            {/* Leather corner caps */}
            <CornerCap position="tl" ink={palette.ink} />
            <CornerCap position="tr" ink={palette.ink} />
            <CornerCap position="bl" ink={palette.ink} />
            <CornerCap position="br" ink={palette.ink} />

            {/* ── LEFT PAGE — details ────────────────────── */}
            <motion.div
              className="relative flex flex-col justify-center px-8 py-16 sm:px-14"
              style={{ y: reduced ? 0 : yContent, opacity: reduced ? 1 : contentOpacity }}
            >
              <RuledLines ink={palette.ink} />

              {/* Coffee stain */}
              <div
                className="pointer-events-none absolute"
                style={{
                  top: 30,
                  right: 30,
                  width: 70,
                  height: 70,
                  background:
                    "radial-gradient(ellipse at 40% 40%, rgba(108,68,32,0.15) 0%, rgba(108,68,32,0.07) 60%, transparent 80%)",
                  borderRadius: "50%",
                }}
              />

              {/* Pressed wildflower tucked at spine — gentle perpetual sway */}
              <motion.div
                className="pointer-events-none absolute"
                style={{ left: -22, top: "25%", transformOrigin: "70% 20%" }}
                animate={reduced ? undefined : { rotate: [-12, -8.5, -12], y: [0, -4, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <picture>
                  <source srcSet={THEME_ASSETS.defter.accent?.replace(".png", ".webp")} type="image/webp" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={THEME_ASSETS.defter.accent}
                    alt=""
                    aria-hidden
                    className="h-32 w-auto opacity-90"
                  />
                </picture>
              </motion.div>

              <p
                className="text-[10px] uppercase"
                style={{ color: palette.accent, letterSpacing: "0.42em", fontWeight: 500 }}
              >
                Davetiyemiz
              </p>
              <p
                className="mt-6 font-display italic"
                style={{
                  fontSize: "clamp(22px, 2.4vw, 28px)",
                  color: palette.inkSoft,
                  lineHeight: 1.65,
                  filter: "url(#ink-bleed)",
                }}
              >
                {data.greeting}
              </p>

              <div className="mt-10 space-y-5">
                <DetailLine label="Tarih" value={`${data.date.day} ${data.date.month} ${data.date.year}`} ink={palette.ink} accent={palette.accent} inkSoft={palette.inkSoft} />
                {data.date.weekday && (
                  <DetailLine label="Gün" value={data.date.weekday} ink={palette.ink} accent={palette.accent} inkSoft={palette.inkSoft} />
                )}
                {data.date.time && (
                  <DetailLine label="Saat" value={data.date.time} ink={palette.ink} accent={palette.accent} inkSoft={palette.inkSoft} />
                )}
                <DetailLine label="Mekân" value={data.venue.name} ink={palette.ink} accent={palette.accent} inkSoft={palette.inkSoft} />
                {data.venue.city && (
                  <DetailLine label="Şehir" value={data.venue.city} ink={palette.ink} accent={palette.accent} inkSoft={palette.inkSoft} />
                )}
              </div>

              {/* Page number */}
              <p
                className="absolute bottom-6 left-1/4 text-[10px] italic"
                style={{ color: palette.inkSoft, opacity: 0.6 }}
              >
                — i —
              </p>
            </motion.div>

            {/* ── RIGHT PAGE — couple name ─────────────────── */}
            <motion.div
              className="relative flex flex-col items-center justify-center border-t px-8 py-16 sm:border-l sm:border-t-0 sm:px-14"
              style={{
                borderColor: `${palette.ink}1c`,
                y: reduced ? 0 : yContent,
                opacity: reduced ? 1 : contentOpacity,
              }}
            >
              <RuledLines ink={palette.ink} />

              {/* Page corner curl — perpetual soft lift, as if about to turn */}
              <motion.div
                className="pointer-events-none absolute bottom-0 right-0"
                style={{
                  width: 60,
                  height: 60,
                  background: `linear-gradient(135deg, transparent 50%, ${shade(palette.paper, -10)} 50%)`,
                  boxShadow: "-2px -2px 4px rgba(0,0,0,0.1)",
                  transformOrigin: "100% 100%",
                }}
                animate={reduced ? undefined : { scale: [1, 1.14, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <p
                className="text-[10px] uppercase"
                style={{ color: palette.accent, letterSpacing: "0.42em", fontWeight: 500 }}
              >
                {data.eyebrow}
              </p>

              {/* Botanical crown */}
              <svg width="120" height="40" viewBox="0 0 120 40" className="mt-7">
                <g stroke={palette.accent} strokeWidth="0.8" fill="none" strokeLinecap="round">
                  <path d="M 30 30 Q 50 14 60 8 Q 70 14 90 30" />
                  <ellipse cx="38" cy="24" rx="4" ry="1.6" fill={palette.accent} fillOpacity="0.5" transform="rotate(-32 38 24)" />
                  <ellipse cx="46" cy="18" rx="4" ry="1.6" fill={palette.accent} fillOpacity="0.5" transform="rotate(-22 46 18)" />
                  <ellipse cx="74" cy="18" rx="4" ry="1.6" fill={palette.accent} fillOpacity="0.5" transform="rotate(22 74 18)" />
                  <ellipse cx="82" cy="24" rx="4" ry="1.6" fill={palette.accent} fillOpacity="0.5" transform="rotate(32 82 24)" />
                  <circle cx="60" cy="8" r="2.5" fill={palette.accent} fillOpacity="0.7" />
                </g>
              </svg>

              <div className="mt-3 text-center">
                <InkName
                  name={data.partnerOne}
                  color={palette.ink}
                  reduced={!!reduced}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  delay={reduced ? 0 : 0.8}
                />
                <motion.div
                  initial={reduced ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: reduced ? 0 : 1.4, duration: 0.8 }}
                  className="my-2 flex items-center justify-center gap-3"
                >
                  <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.65 }} />
                  <p
                    className="font-display italic"
                    style={{ fontSize: "clamp(15px, 1.8vw, 22px)", color: palette.accent, letterSpacing: "0.05em" }}
                  >
                    ve
                  </p>
                  <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.65 }} />
                </motion.div>
                <InkName
                  name={data.partnerTwo}
                  color={palette.ink}
                  reduced={!!reduced}
                  initial={reduced ? false : { opacity: 0, y: -8 }}
                  delay={reduced ? 0 : 1.6}
                />
              </div>

              {/* Monogram seal — settles in, then breathes a slow heartbeat */}
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduced ? 0 : 2.2, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="mt-10"
              >
                <motion.div
                  className="flex h-12 w-12 items-center justify-center"
                  style={{
                    backgroundColor: palette.accent,
                    borderRadius: "50%",
                    color: palette.paper,
                    fontFamily: "serif",
                    fontStyle: "italic",
                    fontSize: 18,
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.2) inset, 0 0 0 1px rgba(255,255,255,0.18) inset, 0 4px 8px rgba(0,0,0,0.18)",
                  }}
                  animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2.8 }}
                >
                  {data.monogram}
                </motion.div>
              </motion.div>

              {/* Page number */}
              <p
                className="absolute bottom-6 right-1/4 text-[10px] italic"
                style={{ color: palette.inkSoft, opacity: 0.6 }}
              >
                — ii —
              </p>
            </motion.div>
          </div>
        </BreathingPage>
      </motion.div>
    </section>
  );
}

/* ── The open page that perpetually breathes ─────────────────────────
 * Wraps the spread in a layer whose box-shadow + rotateX swell and recede
 * forever, so the notebook reads as a physical object settling on a table
 * rather than a flat printed card. The shadow lives on this wrapper (moved
 * out of the static inner div) so it can animate cheaply via opacity-less
 * box-shadow keyframes. */
function BreathingPage({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  return (
    <motion.div
      style={{ borderRadius: 4, transformOrigin: "50% 100%" }}
      initial={false}
      animate={
        reduced
          ? {
              boxShadow:
                "0 60px 90px -40px rgba(45,36,24,0.5), 0 30px 50px -20px rgba(45,36,24,0.4), 0 12px 22px rgba(45,36,24,0.25), 0 0 0 1px rgba(45,36,24,0.08)",
            }
          : {
              rotateX: [0, -1.1, 0],
              boxShadow: [
                "0 48px 78px -42px rgba(45,36,24,0.45), 0 26px 44px -22px rgba(45,36,24,0.36), 0 12px 22px rgba(45,36,24,0.22), 0 0 0 1px rgba(45,36,24,0.08)",
                "0 78px 110px -38px rgba(45,36,24,0.55), 0 38px 60px -18px rgba(45,36,24,0.44), 0 16px 28px rgba(45,36,24,0.28), 0 0 0 1px rgba(45,36,24,0.08)",
                "0 48px 78px -42px rgba(45,36,24,0.45), 0 26px 44px -22px rgba(45,36,24,0.36), 0 12px 22px rgba(45,36,24,0.22), 0 0 0 1px rgba(45,36,24,0.08)",
              ],
            }
      }
      transition={
        reduced
          ? undefined
          : { duration: 8.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {children}
    </motion.div>
  );
}

/* ── Handwritten name with a living ink-bleed pulse ───────────────────
 * The ink-bleed SVG filter gives the calligraphy a wet-ink edge; a very
 * slow opacity pulse on a duplicated bleed layer makes the ink feel like
 * it is still settling into the paper, never frozen. */
function InkName({
  name,
  color,
  reduced,
  initial,
  delay,
}: {
  name: string;
  color: string;
  reduced: boolean;
  initial: false | { opacity: number; y: number };
  delay: number;
}) {
  const style = {
    fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
    fontSize: "clamp(52px, 8vw, 96px)",
    color,
    lineHeight: 0.92,
  } as const;

  return (
    <motion.div
      initial={initial}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1.2 }}
      className="relative inline-block"
    >
      {/* Base ink */}
      <span style={{ ...style, filter: "url(#ink-bleed)", display: "block" }}>{name}</span>
      {/* Breathing bleed echo — same glyphs, fading in/out for a wet-ink life */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute inset-0"
          style={{ ...style, filter: "url(#ink-bleed) blur(0.6px)" }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: delay + 1.5 }}
        >
          {name}
        </motion.span>
      )}
    </motion.div>
  );
}

/* ── Warm petals drifting behind the spread (SMIL-free, framer-motion) ── */
interface Petal {
  x: number;
  y: number;
  size: number;
  rot: number;
  dur: number;
  delay: number;
  drift: number;
  sway: number;
}

function PetalDrift({
  petals,
  accent,
  reduced,
}: {
  petals: Petal[];
  accent: string;
  reduced: boolean;
}) {
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <motion.svg
          key={i}
          width={p.size}
          height={p.size}
          viewBox="-6 -6 12 12"
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -p.drift * 3, 0],
            x: [0, p.sway, -p.sway, 0],
            rotate: [p.rot, p.rot + 40, p.rot],
            opacity: [0.18, 0.4, 0.18],
          }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M 0 -5 Q 4 -2 0 5 Q -4 -2 0 -5 Z"
            fill={accent}
            fillOpacity="0.55"
          />
        </motion.svg>
      ))}
    </div>
  );
}

function DetailLine({
  label,
  value,
  ink,
  accent,
  inkSoft,
}: {
  label: string;
  value: string;
  ink: string;
  accent: string;
  inkSoft: string;
}) {
  return (
    <div className="flex items-baseline gap-5">
      <span
        className="text-[10px] uppercase"
        style={{ color: accent, letterSpacing: "0.32em", minWidth: 56, fontWeight: 500 }}
      >
        {label}
      </span>
      <span
        className="font-display"
        style={{
          fontSize: "clamp(17px, 2vw, 22px)",
          color: ink,
          filter: "url(#ink-bleed)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function CornerCap({ position, ink }: { position: "tl" | "tr" | "bl" | "br"; ink: string }) {
  const styleMap = {
    tl: { top: 0, left: 0, clip: "polygon(0 0, 100% 0, 0 100%)" },
    tr: { top: 0, right: 0, clip: "polygon(100% 0, 100% 100%, 0 0)" },
    bl: { bottom: 0, left: 0, clip: "polygon(0 0, 100% 100%, 0 100%)" },
    br: { bottom: 0, right: 0, clip: "polygon(100% 0, 100% 100%, 0 100%)" },
  } as const;
  const s = styleMap[position];
  return (
    <div
      className="pointer-events-none absolute hidden sm:block"
      style={{
        ...s,
        width: 26,
        height: 26,
        backgroundColor: ink,
        opacity: 0.15,
        clipPath: s.clip,
      }}
    />
  );
}

function RuledLines({ ink }: { ink: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
      <defs>
        <pattern id="rule-lines" x="0" y="0" width="100%" height="34" patternUnits="userSpaceOnUse">
          <line x1="0" y1="33" x2="100%" y2="33" stroke={ink} strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rule-lines)" />
    </svg>
  );
}

function BgLinen({ ink }: { ink: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="bg-linen" width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="6" y2="6" stroke={ink} strokeWidth="0.3" opacity="0.5" />
          <line x1="6" y1="0" x2="0" y2="6" stroke={ink} strokeWidth="0.2" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg-linen)" />
    </svg>
  );
}

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + percent));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + percent));
  const b = Math.max(0, Math.min(255, (num & 0xff) + percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** #RRGGBB → rgba(r,g,b,alpha) — for soft glows that need a real alpha. */
function hexA(hex: string, alpha: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
