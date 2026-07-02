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
import { CustomCover } from "../primitives/custom-cover";

/**
 * Çelenk — a perpetually ALIVE watercolor wreath.
 *
 * The previous build bloomed a gorgeous wreath and then froze, which read as
 * "template". Premium invitations never stop breathing, so this version keeps
 * the bespoke hand-drawn art but layers continuous, GPU-cheap motion
 * (transform/opacity only):
 *
 *   • Slow Ken-Burns push on a richer, more present watercolor backdrop.
 *   • Multi-depth scroll parallax — backdrop, wreath and foreground wildflowers
 *     all travel at different rates; content lifts + fades.
 *   • Subtle horizontal pointer parallax on every depth layer.
 *   • The wreath blooms once, then perpetually breathes (scale) and sways
 *     (rotation) like real foliage in still air.
 *   • Gypsophila petals drift down through the frame forever.
 *   • Breathing watercolor washes + ambient sage dust + a halo glow that pulses.
 *   • A soft scrim lifts the names off the busier wreath core for legibility.
 *
 * All randomness is seeded (makeRng) and every computed coordinate that ends up
 * in SSR markup is rounded with r3() so server and client serialize the same
 * string — no hydration mismatch, no blank flash on this force-static page.
 * prefers-reduced-motion collapses everything to a calm static composition.
 */

interface Petal {
  x: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  rot: number;
}

export function CelenkHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll parallax (each depth moves at its own rate) ── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yWreath = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yField = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* ── Pointer parallax (horizontal depth on mouse move) ── */
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 36, damping: 18 });
  const xBg = useTransform(sx, (v) => v * 10);
  const xWreath = useTransform(sx, (v) => v * 22);
  const xField = useTransform(sx, (v) => v * 34);

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
  };

  /* ── Seeded drifting gypsophila petals (ambient, perpetual) ── */
  const petals = useMemo<Petal[]>(() => {
    const rnd = makeRng(70741);
    return Array.from({ length: 16 }, () => ({
      x: r3(rnd() * 100),
      size: r3(12 + rnd() * 16),
      dur: r3(16 + rnd() * 14),
      delay: r3(rnd() * -26),
      drift: r3((rnd() - 0.5) * 14),
      rot: r3((rnd() - 0.5) * 60),
    }));
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      {/* ── Watercolor backdrop ──
          Cinematic full-bleed VIDEO when a clip exists (poster = painted still
          as a graceful fallback while it loads / if it's missing); otherwise the
          original still painting with a slow Ken-Burns push. Both ride the
          slowest parallax depth and sit as the BOTTOM-most visual layer. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: reduced ? 0 : xBg, y: reduced ? 0 : yBg }}
      >
        {data.heroMediaUrl ? (
          <CustomCover src={data.heroMediaUrl} className="absolute inset-0" />
        ) : THEME_VIDEO.celenk ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={THEME_ASSETS.celenk.bg}
            aria-hidden
          >
            <source src={THEME_VIDEO.celenk} type="video/mp4" />
          </video>
        ) : (
          <motion.div
            className="absolute inset-0"
            animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50% 45%" }}
          >
            <picture>
              <source
                srcSet={THEME_ASSETS.celenk.bg?.replace(".png", ".webp")}
                type="image/webp"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THEME_ASSETS.celenk.bg}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-[0.78] mix-blend-multiply"
              />
            </picture>
            {/* Soft second pass adds depth + a richer painted glow */}
            <picture>
              <source
                srcSet={THEME_ASSETS.celenk.bg?.replace(".png", ".webp")}
                type="image/webp"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={THEME_ASSETS.celenk.bg}
                alt=""
                aria-hidden
                className="absolute inset-0 h-[112%] w-[112%] -translate-x-[6%] -translate-y-[6%] object-cover opacity-30 mix-blend-soft-light"
              />
            </picture>
          </motion.div>
        )}
      </motion.div>

      {/* Breathing watercolor washes for additional living tint */}
      <BreathingWashes accent={palette.accent} reduced={!!reduced} />

      {/* Paper grain overlay */}
      <PaperGrain intensity={0.28} />

      {/* Ambient sage dust */}
      <DustParticles color={palette.accent} count={30} opacity={0.42} />

      {/* Perpetually drifting gypsophila petals (foreground, fast parallax) */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ x: xField, y: yField }}
        >
          <DriftingPetals petals={petals} accent={palette.accent} />
        </motion.div>
      )}

      {/* Bottom edge wildflowers — foreground depth, fast parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: reduced ? 0 : xField, y: reduced ? 0 : yField }}
      >
        <BottomWildflowers accent={palette.accent} ink={palette.ink} reduced={!!reduced} />
      </motion.div>

      {/* ── Main composition ── */}
      <motion.div
        style={{ y: reduced ? 0 : yContent, opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[820px] flex-col items-center text-center"
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mb-10 text-[10.5px] uppercase"
          style={{
            color: palette.inkSoft,
            letterSpacing: "0.46em",
            fontWeight: 500,
          }}
        >
          {data.eyebrow}
        </motion.p>

        {/* Wreath layer — scroll + pointer parallax, then perpetual breathe/sway */}
        <motion.div
          style={{ x: reduced ? 0 : xWreath, y: reduced ? 0 : yWreath }}
          className="relative"
        >
          <motion.div
            className="relative"
            animate={
              reduced
                ? undefined
                : { scale: [1, 1.018, 1], rotate: [-1.1, 1.1, -1.1] }
            }
            transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <WreathSvg
              accent={palette.accent}
              ink={palette.ink}
              inkSoft={palette.inkSoft}
              reduced={!!reduced}
            />
          </motion.div>

          {/* Couple name centered — counter-rotates with a still, legible feel.
              A soft scrim sits behind it to lift the type off the wreath core. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[58%] w-[78%] -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(251,246,238,0.82) 0%, rgba(251,246,238,0.5) 46%, rgba(251,246,238,0) 72%)",
              }}
            />
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 3.6, duration: 1.4 }}
              className="relative px-4"
              style={{
                fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
                fontSize: "clamp(48px, 7.5vw, 94px)",
                color: palette.ink,
                lineHeight: 0.95,
                letterSpacing: "0.005em",
                filter: "url(#ink-bleed)",
              }}
            >
              {data.partnerOne}
            </motion.p>
            <motion.div
              initial={reduced ? false : { scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: reduced ? 0 : 3.9, duration: 0.9 }}
              className="relative my-2 flex items-center gap-3"
            >
              <span
                className="block h-px w-10"
                style={{ background: palette.accent, opacity: 0.7 }}
              />
              <p
                className="font-display italic"
                style={{
                  fontSize: "clamp(14px, 1.6vw, 18px)",
                  color: palette.accent,
                  letterSpacing: "0.05em",
                }}
              >
                ve
              </p>
              <span
                className="block h-px w-10"
                style={{ background: palette.accent, opacity: 0.7 }}
              />
            </motion.div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 4.1, duration: 1.4 }}
              className="relative px-4"
              style={{
                fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
                fontSize: "clamp(48px, 7.5vw, 94px)",
                color: palette.ink,
                lineHeight: 0.95,
                letterSpacing: "0.005em",
                filter: "url(#ink-bleed)",
              }}
            >
              {data.partnerTwo}
            </motion.p>
          </div>
        </motion.div>

        {/* Date + venue with refined hierarchy */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 5, duration: 1.2 }}
          className="mt-14 flex flex-col items-center"
        >
          <p
            className="font-display italic"
            style={{
              fontSize: "clamp(18px, 2.1vw, 24px)",
              color: palette.ink,
              letterSpacing: "0.03em",
            }}
          >
            {data.date.day} {data.date.month} {data.date.year}
          </p>
          {data.date.weekday && (
            <p
              className="mt-1.5 text-[10px] uppercase"
              style={{
                color: palette.inkSoft,
                letterSpacing: "0.38em",
              }}
            >
              {data.date.weekday}
              {data.date.time ? ` · ${data.date.time}` : ""}
            </p>
          )}
          <div
            className="mt-6 h-px w-12"
            style={{ background: palette.ink, opacity: 0.25 }}
          />
          <p
            className="mt-6 font-display italic"
            style={{
              fontSize: "clamp(15px, 1.7vw, 18px)",
              color: palette.inkSoft,
            }}
          >
            {data.venue.name}
          </p>
          {data.venue.city && (
            <p
              className="mt-1 text-[9.5px] uppercase"
              style={{
                color: palette.inkSoft,
                opacity: 0.7,
                letterSpacing: "0.34em",
              }}
            >
              {data.venue.city}
            </p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Breathing watercolor washes — slow eased opacity/scale loops ──── */
function BreathingWashes({ accent, reduced }: { accent: string; reduced: boolean }) {
  if (reduced) {
    return (
      <WatercolorWash
        layers={[
          { cx: 200, cy: 140, rx: 380, ry: 220, color: "#A8C4D6", opacity: 0.18, blur: 8 },
          { cx: 1000, cy: 660, rx: 400, ry: 240, color: accent, opacity: 0.16, blur: 12 },
        ]}
      />
    );
  }

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="celenk-wash-a" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#A8C4D6" stopOpacity="0.22" />
          <stop offset="60%" stopColor="#A8C4D6" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#A8C4D6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="celenk-wash-b" cx="50%" cy="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.2" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.06" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="celenk-wash-c" cx="50%" cy="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.14" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx="200" cy="150" rx="380" ry="220" fill="url(#celenk-wash-a)" style={{ filter: "blur(8px)" }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="1000" cy="650" rx="410" ry="250" fill="url(#celenk-wash-b)" style={{ filter: "blur(12px)" }}
        animate={{ opacity: [0.6, 0.95, 0.6], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.ellipse
        cx="600" cy="400" rx="340" ry="260" fill="url(#celenk-wash-c)" style={{ filter: "blur(20px)" }}
        animate={{ opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </svg>
  );
}

/* ── Drifting gypsophila petals — perpetual ambient fall ───────────── */
function DriftingPetals({ petals, accent }: { petals: Petal[]; accent: string }) {
  return (
    <>
      {petals.map((p, i) => (
        <motion.svg
          key={i}
          className="absolute"
          width={p.size}
          height={p.size}
          viewBox="-20 -20 40 40"
          aria-hidden
          style={{ left: `${p.x}%`, top: "-6%", color: accent }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, p.drift, -p.drift, 0],
            rotate: [0, p.rot, -p.rot, 0],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.12, 0.88, 1],
          }}
        >
          <use href="#gypsophila-cluster" x="-20" y="-20" width="40" height="40" />
        </motion.svg>
      ))}
    </>
  );
}

/* ── Detailed asymmetric wreath (bespoke art preserved + densified) ── */

function WreathSvg({
  accent,
  ink,
  inkSoft,
  reduced,
}: {
  accent: string;
  ink: string;
  inkSoft: string;
  reduced: boolean;
}) {
  // Stagger draw groups so the wreath "blooms" on first paint.
  const groups = reduced
    ? { drawDur: 0.01, baseDelay: 0, stagger: 0 }
    : { drawDur: 1.4, baseDelay: 0.6, stagger: 0.35 };

  return (
    <svg
      viewBox="0 0 560 560"
      width="100%"
      style={{ maxWidth: 560, width: "min(82vw, 560px)" }}
    >
      <defs>
        <radialGradient id="wreath-glow">
          <stop offset="0%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Faint glow halo — gently pulses so the center never feels static */}
      <motion.circle
        cx="280" cy="280" r="250" fill="url(#wreath-glow)"
        animate={reduced ? undefined : { opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "280px 280px" }}
      />

      {/* ── Eucalyptus arc TOP-LEFT ───────────────────────────── */}
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: groups.drawDur, delay: groups.baseDelay + groups.stagger * 0 }}
        stroke={accent}
        strokeLinecap="round"
        fill="none"
        color={accent}
      >
        <motion.path
          d="M 100 280 Q 100 180 160 130 T 280 70"
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: groups.drawDur, delay: groups.baseDelay }}
        />
        {[
          [108, 252, -28], [114, 220, -38], [128, 188, -48], [148, 158, -58],
          [172, 130, -68], [200, 108, -75], [232, 90, -82], [264, 76, -88],
        ].map(([cx, cy, a], i) => (
          <motion.g
            key={i}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: groups.baseDelay + 0.2 + i * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            transform={`translate(${cx} ${cy}) rotate(${a})`}
            style={{ color: accent }}
          >
            <use href="#eucalyptus-leaf" width="22" height="9" x="-11" y="-4.5" />
          </motion.g>
        ))}
        {/* Denser inner fill leaves */}
        {[
          [124, 236, -33], [138, 204, -43], [158, 172, -53], [184, 144, -64], [214, 122, -72],
        ].map(([cx, cy, a], i) => (
          <motion.g
            key={`f-${i}`}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.85, scale: 0.82 }}
            transition={{
              duration: 0.5,
              delay: groups.baseDelay + 0.45 + i * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            transform={`translate(${cx} ${cy}) rotate(${a})`}
            style={{ color: accent }}
          >
            <use href="#eucalyptus-leaf" width="18" height="7.5" x="-9" y="-3.75" />
          </motion.g>
        ))}
      </motion.g>

      {/* ── Eucalyptus arc TOP-RIGHT (mirror) ─────────────────── */}
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: groups.drawDur, delay: groups.baseDelay + groups.stagger * 1 }}
        stroke={accent}
        strokeLinecap="round"
        fill="none"
        color={accent}
      >
        <motion.path
          d="M 460 280 Q 460 180 400 130 T 280 70"
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: groups.drawDur, delay: groups.baseDelay + groups.stagger }}
        />
        {[
          [452, 252, 28], [446, 220, 38], [432, 188, 48], [412, 158, 58],
          [388, 130, 68], [360, 108, 75], [328, 90, 82], [296, 76, 88],
        ].map(([cx, cy, a], i) => (
          <motion.g
            key={i}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: groups.baseDelay + groups.stagger + 0.2 + i * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            transform={`translate(${cx} ${cy}) rotate(${a})`}
            style={{ color: accent }}
          >
            <use href="#eucalyptus-leaf" width="22" height="9" x="-11" y="-4.5" />
          </motion.g>
        ))}
        {/* Denser inner fill leaves */}
        {[
          [436, 236, 33], [422, 204, 43], [402, 172, 53], [376, 144, 64], [346, 122, 72],
        ].map(([cx, cy, a], i) => (
          <motion.g
            key={`f-${i}`}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.85, scale: 0.82 }}
            transition={{
              duration: 0.5,
              delay: groups.baseDelay + groups.stagger + 0.45 + i * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            transform={`translate(${cx} ${cy}) rotate(${a})`}
            style={{ color: accent }}
          >
            <use href="#eucalyptus-leaf" width="18" height="7.5" x="-9" y="-3.75" />
          </motion.g>
        ))}
      </motion.g>

      {/* ── Olive bottom arcs ─────────────────────────────────── */}
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: groups.drawDur, delay: groups.baseDelay + groups.stagger * 2 }}
        stroke={accent}
        strokeLinecap="round"
        fill="none"
        color={accent}
        opacity="0.85"
      >
        <motion.path
          d="M 100 280 Q 100 380 160 430 T 280 490"
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: groups.drawDur, delay: groups.baseDelay + groups.stagger * 2 }}
        />
        <motion.path
          d="M 460 280 Q 460 380 400 430 T 280 490"
          strokeWidth="1.4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: groups.drawDur, delay: groups.baseDelay + groups.stagger * 2 }}
        />
        {[
          [108, 308, 28], [120, 340, 38], [140, 370, 48], [164, 400, 58], [192, 425, 68], [224, 448, 75],
          [452, 308, -28], [440, 340, -38], [420, 370, -48], [396, 400, -58], [368, 425, -68], [336, 448, -75],
        ].map(([cx, cy, a], i) => (
          <motion.g
            key={i}
            initial={reduced ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: groups.baseDelay + groups.stagger * 2 + 0.2 + i * 0.05,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            transform={`translate(${cx} ${cy}) rotate(${a})`}
            style={{ color: accent }}
          >
            <use href="#olive-leaf" width="18" height="6" x="-9" y="-3" />
          </motion.g>
        ))}
        {/* Olive berries */}
        {[
          [136, 350], [200, 412], [424, 350], [360, 412],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={`b-${i}`}
            initial={reduced ? false : { opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: groups.baseDelay + groups.stagger * 2 + 0.8 + i * 0.07 }}
            cx={cx}
            cy={cy}
            r="3"
            fill={ink}
            opacity="0.65"
          />
        ))}
      </motion.g>

      {/* ── Gypsophila clusters (densified crown + sides) ───────── */}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: groups.baseDelay + groups.stagger * 3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Top crown cluster */}
        <use href="#gypsophila-cluster" width="68" height="68" x="246" y="32" />
        <use href="#gypsophila-cluster" width="46" height="46" x="196" y="58" />
        <use href="#gypsophila-cluster" width="46" height="46" x="316" y="58" />
        <use href="#gypsophila-cluster" width="34" height="34" x="232" y="84" />
        <use href="#gypsophila-cluster" width="34" height="34" x="296" y="84" />
        {/* Side accents */}
        <use href="#gypsophila-cluster" width="50" height="50" x="86" y="218" />
        <use href="#gypsophila-cluster" width="50" height="50" x="422" y="218" />
        <use href="#gypsophila-cluster" width="34" height="34" x="118" y="262" />
        <use href="#gypsophila-cluster" width="34" height="34" x="406" y="262" />
        {/* Bottom accents */}
        <use href="#gypsophila-cluster" width="40" height="40" x="178" y="430" />
        <use href="#gypsophila-cluster" width="40" height="40" x="340" y="430" />
        <use href="#gypsophila-cluster" width="28" height="28" x="252" y="456" />
      </motion.g>

      {/* ── Chamomile accent flowers ─────────────────────────── */}
      <motion.g
        initial={reduced ? false : { opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: groups.baseDelay + groups.stagger * 4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <use href="#chamomile" width="30" height="30" x="148" y="108" />
        <use href="#chamomile" width="30" height="30" x="382" y="108" />
        <use href="#chamomile" width="24" height="24" x="118" y="328" />
        <use href="#chamomile" width="24" height="24" x="418" y="328" />
        <use href="#chamomile" width="22" height="22" x="269" y="468" />
        <use href="#chamomile" width="20" height="20" x="206" y="92" />
        <use href="#chamomile" width="20" height="20" x="334" y="92" />
      </motion.g>

      {/* ── Trailing tendrils ─────────────────────────────────── */}
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.4, delay: groups.baseDelay + groups.stagger * 4 + 0.4 }}
        stroke={inkSoft}
        strokeWidth="0.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      >
        <path d="M 280 70 Q 295 50 320 38 Q 340 30 360 36" />
        <path d="M 280 70 Q 265 50 240 38 Q 220 30 200 36" />
        <path d="M 280 490 Q 305 510 335 514 Q 360 514 375 506" />
        <path d="M 280 490 Q 255 510 225 514 Q 200 514 185 506" />
      </motion.g>
    </svg>
  );
}

/* ── Bottom edge wildflowers — like field grass ──────────────────────
 * Coordinates are seeded (makeRng) and rounded (r3) so the SSR markup is
 * byte-identical on server and client — no Math.sin/Math.random in the
 * render path. */
function BottomWildflowers({
  accent,
  ink,
  reduced,
}: {
  accent: string;
  ink: string;
  reduced: boolean;
}) {
  const stems = useMemo(() => {
    const rnd = makeRng(48817);
    return Array.from({ length: 16 }, (_, i) => ({
      x: r3(60 + i * 74 + (rnd() - 0.5) * 24),
      h: r3(130 + rnd() * 56),
      tilt: r3((rnd() - 0.5) * 12),
      sway: r3(2 + rnd() * 3),
      swayDelay: r3(rnd() * -6),
    }));
  }, []);

  return (
    <motion.svg
      className="absolute bottom-0 left-0 right-0 h-[28vh] w-full"
      initial={reduced ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 0.7, y: 0 }}
      transition={{ delay: reduced ? 0 : 5.2, duration: 1.6 }}
      viewBox="0 0 1200 240"
      preserveAspectRatio="xMidYEnd slice"
      aria-hidden
    >
      {stems.map((s, i) => (
        <motion.g
          key={i}
          transform={`translate(${s.x} 240)`}
          style={{ transformOrigin: `${s.x}px 240px` }}
          animate={reduced ? undefined : { rotate: [s.tilt - s.sway, s.tilt + s.sway, s.tilt - s.sway] }}
          transition={{ duration: 6 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: s.swayDelay }}
        >
          <line x1="0" y1="0" x2="0" y2={-s.h} stroke={accent} strokeWidth="0.6" opacity="0.75" />
          {[s.h * 0.25, s.h * 0.5, s.h * 0.75].map((dy, j) => (
            <g key={j} transform={`translate(${j % 2 === 0 ? 3 : -3} ${r3(-dy)})`}>
              <ellipse
                cx="0"
                cy="0"
                rx="3.5"
                ry="1.5"
                fill={accent}
                fillOpacity="0.6"
                transform={`rotate(${j % 2 === 0 ? 35 : -35})`}
              />
            </g>
          ))}
          {/* Flower head */}
          <g transform={`translate(0 ${r3(-(s.h + 6))})`}>
            {i % 3 === 0 ? (
              <circle cx="0" cy="0" r="3" fill={ink} opacity="0.55" />
            ) : (
              <use href="#gypsophila-cluster" width="22" height="22" x="-11" y="-11" />
            )}
          </g>
        </motion.g>
      ))}
    </motion.svg>
  );
}
