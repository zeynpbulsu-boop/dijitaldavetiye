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
import { useInvitationT } from "../i18n-context";
import { AtmosphereDefs, DustParticles, PaperGrain, makeRng, r3 } from "../primitives/atmosphere";
import { THEME_ASSETS, THEME_VIDEO } from "@/lib/themes-v2/assets";
import { CustomCover } from "../primitives/custom-cover";

type SceneName = "sunset" | "mountain" | "field" | "shore";

interface PolaroidSpec {
  x: string;
  y: number;
  r: number;
  scene: SceneName;
  caption: string;
  tapeColor?: string;
  /** Per-card parallax depth multiplier (closer cards move more). */
  depth: number;
  /** Seeded perpetual-sway parameters. */
  swayRot: number; // ± degrees added to base rotation
  swayY: number; // ± px gentle bob
  swayDur: number; // seconds per oscillation
  swayDelay: number; // phase offset so cards aren't in sync
}

/**
 * Polaroid — premium scrapbook spread that NEVER freezes.
 *
 * The previous build dropped four polaroids into place and stopped, which
 * read as a static template. Real photos pinned on a line keep breathing in
 * the air, so this version layers perpetual, GPU-cheap motion (transform /
 * opacity only):
 *   • multi-depth scroll parallax — kraft backdrop drifts slowly, the
 *     polaroid stack drifts further, captions fade as you scroll past
 *   • horizontal pointer parallax via a damped spring (background vs stack
 *     move at different magnitudes for real depth)
 *   • each polaroid GENTLY SWAYS forever — a slow rotate + bob with a seeded
 *     phase/amplitude per card, like photos clipped to a twine in a breeze
 *   • slow Ken-Burns push on every photographic scene
 *   • a warm light-leak that slowly drifts and breathes + drifting dust
 *   • a soft scrim behind the centre name card for legibility
 * All randomness is seeded (makeRng) and trig is rounded (r3) so the SSR
 * markup matches the client exactly — no hydration flash on this
 * force-static page.
 */
export function PolaroidHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const ref = useRef<HTMLElement>(null);

  /* ── Scroll parallax — depths drift at different rates ── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yStack = useTransform(scrollYProgress, [0, 1], [0, 170]);
  const yEyebrow = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yNotes = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* ── Pointer parallax — horizontal depth on mouse move ── */
  const px = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 34, damping: 18 });
  const xBg = useTransform(sx, (v) => v * 10);
  const xStack = useTransform(sx, (v) => v * 26);

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    px.set(e.clientX / window.innerWidth - 0.5);
  };

  /* ── Seeded perpetual-sway parameters per polaroid ──
   * Deterministic (makeRng + r3) so server and client serialize identically. */
  const polaroids = useMemo<PolaroidSpec[]>(() => {
    const base: Array<Omit<PolaroidSpec, "swayRot" | "swayY" | "swayDur" | "swayDelay">> = [
      { x: "-26%", y: 0, r: -10, scene: "sunset", caption: "tanıştığımız gün", tapeColor: "#D4A88C", depth: 1.15 },
      { x: "-9%", y: 18, r: 5, scene: "mountain", caption: "ilk yolculuğumuz", depth: 0.7 },
      { x: "9%", y: 6, r: -3, scene: "field", caption: "mart, kapadokya", depth: 0.85 },
      { x: "26%", y: 22, r: 7, scene: "shore", caption: "evet dediği an", tapeColor: "#B8A88C", depth: 1.0 },
    ];
    const rnd = makeRng(70413);
    return base.map((b) => ({
      ...b,
      swayRot: r3(1.4 + rnd() * 1.8),
      swayY: r3(4 + rnd() * 6),
      swayDur: r3(6.5 + rnd() * 4.5),
      swayDelay: r3(rnd() * -6),
    }));
  }, []);

  /* Centre name card sway (its own seeded gentle drift). */
  const nameSway = useMemo(() => {
    const rnd = makeRng(99021);
    return {
      rot: r3(1 + rnd() * 1.2),
      y: r3(5 + rnd() * 4),
      dur: r3(8 + rnd() * 3),
    };
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 py-28"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      {/* Cinematic full-bleed VIDEO backdrop — the BOTTOM-most visual layer.
          The first polaroid scene doubles as the poster so there's a graceful
          still fallback while the mp4 loads or if it's missing. A soft scrim
          sits on top of the video so the kraft stack + name card stay readable.
          When no clip exists we render nothing extra and the kraft background
          below stays exactly as before. */}
      {(data.heroMediaUrl || THEME_VIDEO.polaroid) && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: reduced ? 0 : yBg, x: reduced ? 0 : xBg }}
        >
          {data.heroMediaUrl ? (
            <CustomCover src={data.heroMediaUrl} className="absolute inset-0" />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={THEME_ASSETS.polaroid.scenes?.[0]}
              aria-hidden
            >
              <source src={THEME_VIDEO.polaroid} type="video/mp4" />
            </video>
          )}
          {/* Warm scrim — lifts the kraft grain, vignette and centre card off
              the moving footage so foreground content stays legible. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(58,42,31,0.34) 0%, rgba(58,42,31,0.2) 40%, rgba(58,42,31,0.42) 100%)",
            }}
          />
        </motion.div>
      )}

      {/* Kraft grain + soft vignette + warm light-leak drift on the slow
          background layer (scroll + pointer parallax). */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yBg, x: reduced ? 0 : xBg }}
      >
        <PaperGrain intensity={0.4} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(58,42,31,0.18) 100%)",
          }}
        />
        <LightLeak accent={palette.accent} reduced={!!reduced} />
      </motion.div>

      <DustParticles color={palette.accent} count={20} opacity={0.28} />

      {/* Hand-drawn twine connecting polaroids (drifts with the stack). */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yStack, x: reduced ? 0 : xStack }}
      >
        <Twine ink={palette.ink} reduced={!!reduced} />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px]">
        <motion.div
          style={{ y: reduced ? 0 : yEyebrow, opacity: reduced ? 1 : fadeOut }}
          className="mb-14 text-center"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <Doodle accent={palette.accent} />
            <p
              className="mt-4 text-[10.5px] uppercase"
              style={{ color: palette.inkSoft, letterSpacing: "0.42em", fontWeight: 500 }}
            >
              {data.eyebrow}
            </p>
          </motion.div>
        </motion.div>

        {/* Polaroid stack — parallax wrapper, then per-card settle + sway. */}
        <motion.div
          style={{ y: reduced ? 0 : yStack, x: reduced ? 0 : xStack }}
          className="relative mx-auto h-[500px] w-full max-w-[1100px] sm:h-[560px]"
        >
          {polaroids.map((p, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ marginLeft: p.x, zIndex: i }}
            >
              {/* Settle: drops into place once. */}
              <motion.div
                initial={reduced ? false : { y: -140, opacity: 0, rotate: 0, scale: 1.05 }}
                animate={{ y: p.y, opacity: 1, rotate: p.r, scale: 1 }}
                transition={{
                  delay: reduced ? 0 : 0.4 + i * 0.18,
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {/* Sway: perpetual gentle breeze (separate layer so it never
                    fights the settle transition). */}
                <motion.div
                  animate={
                    reduced
                      ? undefined
                      : { rotate: [-p.swayRot, p.swayRot, -p.swayRot], y: [-p.swayY, p.swayY, -p.swayY] }
                  }
                  transition={
                    reduced
                      ? undefined
                      : {
                          duration: p.swayDur,
                          delay: p.swayDelay,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                  whileHover={
                    reduced ? undefined : { y: -16, scale: 1.03, transition: { duration: 0.35 } }
                  }
                  style={{ transformOrigin: "50% -8%" }}
                >
                  <PolaroidCard
                    ink={palette.ink}
                    paper={palette.paper}
                    caption={data.photos[i]?.caption?.trim() || p.caption}
                    scene={p.scene}
                    photoSrc={data.photos[i]?.src}
                    tapeColor={p.tapeColor ?? palette.accent}
                    reduced={!!reduced}
                  />
                </motion.div>
              </motion.div>
            </div>
          ))}

          {/* Centre hero card — last to settle, on top, then drifts. */}
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={reduced ? false : { y: -180, opacity: 0, rotate: 5, scale: 1.1 }}
              animate={{ y: -16, opacity: 1, rotate: -2, scale: 1 }}
              transition={{ delay: reduced ? 0 : 1.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={
                  reduced
                    ? undefined
                    : { rotate: [-nameSway.rot, nameSway.rot, -nameSway.rot], y: [-nameSway.y, nameSway.y, -nameSway.y] }
                }
                transition={
                  reduced
                    ? undefined
                    : { duration: nameSway.dur, repeat: Infinity, ease: "easeInOut", delay: -2 }
                }
                whileHover={reduced ? undefined : { y: -14, transition: { duration: 0.4 } }}
                style={{ transformOrigin: "50% -6%" }}
              >
                <NameCard
                  ink={palette.ink}
                  inkSoft={palette.inkSoft}
                  paper={palette.paper}
                  accent={palette.accent}
                  partnerOne={data.partnerOne}
                  partnerTwo={data.partnerTwo}
                  date={`${data.date.day} ${data.date.month} ${data.date.year}`}
                  weekday={data.date.weekday ?? ""}
                  venue={data.venue.name}
                  monogram={data.monogram}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Handwritten notes scattered below. */}
        <motion.div
          style={{ y: reduced ? 0 : yNotes, opacity: reduced ? 1 : fadeOut }}
          className="mt-8"
        >
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 2.4, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-center"
          >
            <Note ink={palette.ink} text="bizimle olur musun?" rotate={-2} reduced={!!reduced} />
            <Note ink={palette.accent} text={`${data.date.day} · ${data.date.month}`} rotate={1} weight="bold" reduced={!!reduced} />
            <Note ink={palette.ink} text={data.venue.name.split(" ")[0]?.toLowerCase() || "cunda"} rotate={-1} reduced={!!reduced} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Warm light-leak — slow drifting/breathing radial (film feel) ──── */
function LightLeak({ accent, reduced }: { accent: string; reduced: boolean }) {
  return (
    <motion.div
      className="absolute -inset-1/4"
      aria-hidden
      animate={
        reduced
          ? undefined
          : { x: ["-6%", "6%", "-6%"], y: ["4%", "-5%", "4%"], opacity: [0.5, 0.78, 0.5] }
      }
      transition={reduced ? undefined : { duration: 24, repeat: Infinity, ease: "easeInOut" }}
      style={{
        mixBlendMode: "screen",
        background: `radial-gradient(38% 30% at 70% 28%, ${accent}38 0%, ${accent}14 45%, transparent 72%)`,
      }}
    />
  );
}

/* ── PolaroidCard ───────────────────────────────────────────────── */
function PolaroidCard({
  ink,
  paper,
  caption,
  scene,
  photoSrc,
  tapeColor,
  reduced,
}: {
  ink: string;
  paper: string;
  caption: string;
  scene: SceneName;
  /** Çiftin kendi fotoğrafı — varsa fal.ai sahnesinin yerine geçer (P1-14) */
  photoSrc?: string;
  tapeColor: string;
  reduced: boolean;
}) {
  return (
    <div className="relative" style={{ width: 248 }}>
      {/* Washi tape */}
      <div
        className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
        style={{
          width: 80,
          height: 22,
          backgroundColor: tapeColor,
          opacity: 0.78,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.18) 0 4px, transparent 4px 8px)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      />

      <div
        style={{
          backgroundColor: paper,
          padding: "14px 14px 30px",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.7) inset, 0 30px 50px -28px rgba(58,42,31,0.55), 0 8px 14px rgba(58,42,31,0.18), 0 -1px 2px rgba(58,42,31,0.04)",
          borderRadius: 2,
        }}
      >
        <div
          className="relative h-[260px] w-full overflow-hidden"
          style={{ backgroundColor: "#D9CDB4" }}
        >
          {photoSrc ? (
            // Çiftin fotoğrafı — sahnedeki Ken Burns hissini korumak için
            // yavaş scale döngüsü (reduced-motion'da statik)
            <motion.img
              src={photoSrc}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <Scene scene={scene} reduced={reduced} />
          )}
          {/* Subtle vignette around photo */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: "inset 0 0 24px rgba(0,0,0,0.18)" }}
          />
        </div>
        <p
          className="mt-4 text-center"
          style={{
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
            fontSize: 22,
            color: ink,
            lineHeight: 1.1,
            filter: "url(#ink-bleed)",
          }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

/* ── NameCard (center hero polaroid) ────────────────────────────── */
function NameCard({
  ink,
  inkSoft,
  paper,
  accent,
  partnerOne,
  partnerTwo,
  date,
  weekday,
  venue,
  monogram,
}: {
  ink: string;
  inkSoft: string;
  paper: string;
  accent: string;
  partnerOne: string;
  partnerTwo: string;
  date: string;
  weekday: string;
  venue: string;
  monogram: string;
}) {
  const str = useInvitationT();
  return (
    <div className="relative" style={{ width: 312 }}>
      {/* Soft scrim lifts the card off the busy stack behind it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 460,
          height: 460,
          background:
            "radial-gradient(ellipse at center, rgba(61,44,30,0.32) 0%, rgba(61,44,30,0.14) 46%, rgba(61,44,30,0) 72%)",
        }}
      />

      {/* Washi tape top */}
      <div
        className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
        style={{
          width: 110,
          height: 24,
          backgroundColor: accent,
          opacity: 0.85,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0 5px, transparent 5px 10px)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
        }}
      />

      <div
        style={{
          backgroundColor: paper,
          padding: "18px 18px 34px",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.7) inset, 0 40px 70px -30px rgba(58,42,31,0.6), 0 14px 26px rgba(58,42,31,0.25)",
          borderRadius: 2,
        }}
      >
        <div
          className="flex h-[316px] w-full flex-col items-center justify-center px-5 text-center"
          style={{ backgroundColor: paper, border: `1px solid ${ink}1f` }}
        >
          {/* Mini wax seal */}
          <div
            className="mb-4 flex h-9 w-9 items-center justify-center"
            style={{
              backgroundColor: accent,
              borderRadius: "50%",
              color: paper,
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 13,
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.18) inset, 0 0 0 1px rgba(255,255,255,0.2) inset, 0 2px 4px rgba(0,0,0,0.12)",
            }}
          >
            {monogram}
          </div>
          <p className="text-[9.5px] uppercase" style={{ color: accent, letterSpacing: "0.4em" }}>
            {str.hero.saveTheDate}
          </p>
          <p
            className="mt-4"
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: 50,
              color: ink,
              lineHeight: 0.95,
              filter: "url(#ink-bleed)",
            }}
          >
            {partnerOne}
          </p>
          <div className="my-1 flex items-center gap-2">
            <span className="block h-px w-5" style={{ background: accent, opacity: 0.7 }} />
            <span className="font-display italic" style={{ fontSize: 12, color: accent }}>
              &
            </span>
            <span className="block h-px w-5" style={{ background: accent, opacity: 0.7 }} />
          </div>
          <p
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: 50,
              color: ink,
              lineHeight: 0.95,
              filter: "url(#ink-bleed)",
            }}
          >
            {partnerTwo}
          </p>
          <div className="my-4 h-px w-12" style={{ background: ink, opacity: 0.25 }} />
          <p className="font-display italic" style={{ fontSize: 14.5, color: ink }}>
            {date}
          </p>
          {weekday && (
            <p
              className="mt-1 text-[9px] uppercase"
              style={{ color: inkSoft, letterSpacing: "0.3em" }}
            >
              {weekday}
            </p>
          )}
          <p
            className="mt-4 text-[9.5px] uppercase"
            style={{ color: accent, letterSpacing: "0.32em" }}
          >
            {venue}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Scene illustrations — real fal.ai photos w/ slow Ken-Burns + SVG fallback ── */
function Scene({ scene, reduced }: { scene: SceneName; reduced: boolean }) {
  const sceneMap: Record<SceneName, number> = {
    sunset: 0,
    mountain: 1,
    field: 2,
    shore: 3,
  };
  const photo = THEME_ASSETS.polaroid.scenes?.[sceneMap[scene]];
  return (
    <motion.div
      className="absolute inset-0"
      animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
      transition={reduced ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* SVG fallback behind */}
      <div className="absolute inset-0 -z-10">
        {scene === "sunset" && <SceneSunset />}
        {scene === "mountain" && <SceneMountain />}
        {scene === "field" && <SceneField />}
        {scene === "shore" && <SceneShore />}
      </div>
      {/* Real photo on top */}
      {photo && (
        <picture>
          <source srcSet={photo.replace(".png", ".webp")} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      )}
    </motion.div>
  );
}

function SceneSunset() {
  return (
    <svg viewBox="0 0 248 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sunset-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5B380" />
          <stop offset="55%" stopColor="#E08F5A" />
          <stop offset="100%" stopColor="#7A3F2A" />
        </linearGradient>
      </defs>
      <rect width="248" height="260" fill="url(#sunset-sky)" />
      <circle cx="180" cy="100" r="28" fill="#FFE3AC" opacity="0.92" />
      <circle cx="180" cy="100" r="44" fill="#FFE3AC" opacity="0.3" />
      <path d="M 0 175 Q 50 155 110 170 T 248 165 L 248 260 L 0 260 Z" fill="#4A2C1A" opacity="0.85" />
      <path d="M 0 200 Q 60 180 130 200 T 248 195 L 248 260 L 0 260 Z" fill="#2A1810" />
      {/* Sun glints */}
      <line x1="180" y1="100" x2="180" y2="175" stroke="#FFE3AC" strokeWidth="2" opacity="0.4" />
      {/* Birds */}
      <g stroke="#2A1810" strokeWidth="1.4" fill="none" opacity="0.7">
        <path d="M 70 60 Q 78 54 86 60 Q 92 54 98 60" />
        <path d="M 130 75 Q 138 69 146 75" />
      </g>
    </svg>
  );
}

function SceneMountain() {
  return (
    <svg viewBox="0 0 248 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mtn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C5C2BE" />
          <stop offset="100%" stopColor="#9C9A93" />
        </linearGradient>
      </defs>
      <rect width="248" height="260" fill="url(#mtn-sky)" />
      <circle cx="60" cy="85" r="22" fill="#E8E0D2" opacity="0.6" />
      {/* Back mountain layer */}
      <path d="M -10 200 L 60 90 L 110 160 L 160 80 L 220 150 L 270 110 L 270 260 L -10 260 Z" fill="#5C5650" opacity="0.85" />
      {/* Front mountain layer */}
      <path d="M -10 230 L 40 160 L 100 220 L 150 170 L 200 220 L 270 190 L 270 260 L -10 260 Z" fill="#3A352F" />
      {/* Snow caps */}
      <path d="M 50 100 L 60 90 L 72 105 L 65 105 Z" fill="#FBF8F0" opacity="0.85" />
      <path d="M 150 92 L 160 80 L 172 96 L 162 96 Z" fill="#FBF8F0" opacity="0.85" />
    </svg>
  );
}

function SceneField() {
  return (
    <svg viewBox="0 0 248 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="field-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9B580" />
          <stop offset="100%" stopColor="#B8965A" />
        </linearGradient>
      </defs>
      <rect width="248" height="260" fill="url(#field-sky)" />
      <circle cx="200" cy="85" r="24" fill="#F5D896" opacity="0.85" />
      {/* Rolling hills */}
      <path d="M 0 200 Q 80 170 160 200 T 320 195 L 320 260 L 0 260 Z" fill="#8A7340" opacity="0.85" />
      <path d="M 0 230 Q 80 215 160 230 T 320 228 L 320 260 L 0 260 Z" fill="#5C4E2A" />
      {/* Wheat stalks */}
      <g stroke="#2A2218" strokeWidth="0.7" fill="none" opacity="0.55">
        {Array.from({ length: 28 }).map((_, i) => {
          const x = 8 + i * 10;
          const h = r3(180 + Math.sin(i * 0.7) * 6);
          return <line key={i} x1={x} y1="240" x2={x + (i % 2 === 0 ? 2 : -2)} y2={h} />;
        })}
      </g>
    </svg>
  );
}

function SceneShore() {
  return (
    <svg viewBox="0 0 248 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="shore-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2D6DA" />
          <stop offset="55%" stopColor="#7FA5B5" />
          <stop offset="100%" stopColor="#4A6F80" />
        </linearGradient>
        <linearGradient id="shore-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7FA5B5" />
          <stop offset="100%" stopColor="#3A5566" />
        </linearGradient>
      </defs>
      <rect width="248" height="200" fill="url(#shore-sky)" />
      <rect y="200" width="248" height="60" fill="url(#shore-sea)" />
      <circle cx="70" cy="90" r="18" fill="#FBE7AC" opacity="0.85" />
      {/* Waves */}
      <g stroke="#FBF8F0" strokeWidth="0.8" fill="none" opacity="0.5">
        <path d="M 10 210 Q 30 206 50 210 T 90 210 T 130 210 T 170 210 T 210 210 T 250 210" />
        <path d="M 10 220 Q 30 216 50 220 T 90 220 T 130 220 T 170 220 T 210 220 T 250 220" />
        <path d="M 10 235 Q 30 231 50 235 T 90 235 T 130 235 T 170 235 T 210 235 T 250 235" />
      </g>
      {/* Sailboat */}
      <g stroke="#2A2218" strokeWidth="1" fill="#FBF8F0">
        <path d="M 170 188 L 184 188 L 180 196 L 174 196 Z" fill="#3A2C20" />
        <line x1="177" y1="160" x2="177" y2="188" />
        <path d="M 177 162 L 192 184 L 177 184 Z" fill="#FBF8F0" />
      </g>
    </svg>
  );
}

/* ── Twine connecting polaroids (gently breathes) ───────────────── */
function Twine({ ink, reduced }: { ink: string; reduced: boolean }) {
  return (
    <motion.svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced ? { opacity: 0.45 } : { opacity: [0.34, 0.5, 0.34] }}
      transition={
        reduced
          ? { delay: 0, duration: 1 }
          : { delay: 2, duration: 13, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <path
        d="M 100 240 Q 300 320 600 280 T 1100 260"
        stroke={ink}
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="2 4"
        opacity="0.5"
      />
    </motion.svg>
  );
}

/* ── Tiny ornamental doodle above eyebrow ────────────────────────── */
function Doodle({ accent }: { accent: string }) {
  return (
    <svg width="80" height="20" viewBox="0 0 80 20" className="mx-auto">
      <g stroke={accent} strokeWidth="1" fill="none" strokeLinecap="round">
        <path d="M 10 10 Q 25 4 40 10 Q 55 16 70 10" />
        <circle cx="40" cy="10" r="2.5" fill={accent} fillOpacity="0.6" />
      </g>
    </svg>
  );
}

/* ── Handwritten note (gently sways) ─────────────────────────────── */
function Note({
  ink,
  text,
  rotate,
  weight,
  reduced,
}: {
  ink: string;
  text: string;
  rotate: number;
  weight?: "regular" | "bold";
  reduced: boolean;
}) {
  return (
    <motion.span
      animate={reduced ? undefined : { rotate: [rotate - 1.2, rotate + 1.2, rotate - 1.2] }}
      transition={reduced ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{
        fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
        fontSize: weight === "bold" ? 26 : 22,
        color: ink,
        transform: reduced ? `rotate(${rotate}deg)` : undefined,
        display: "inline-block",
        filter: "url(#ink-bleed)",
      }}
    >
      {text}
    </motion.span>
  );
}
