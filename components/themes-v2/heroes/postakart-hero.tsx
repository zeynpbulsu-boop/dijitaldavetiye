"use client";

import { useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import type { ThemeV2Props } from "@/lib/themes-v2/types";
import { AtmosphereDefs, PaperGrain, DustParticles, makeRng, r3 } from "../primitives/atmosphere";
import { THEME_ASSETS } from "@/lib/themes-v2/assets";

/**
 * Postakart — a vintage Ayvalık travel postcard that is PERPETUALLY ALIVE.
 *
 * The previous build tilted the card in once and then froze, which read as
 * "template-y". Premium invitations never stop breathing, so this version
 * keeps every bespoke detail (painted landscape, perforated stamps, inked
 * postmark, aged paper, coffee stains, corner curl, tap-to-flip) but layers
 * perpetual, GPU-cheap motion on top:
 *
 *   • The postcard RESTS in a slow idle 3D sway — a continuous low-amplitude
 *     oscillation (rotateX/rotateY/y) so it feels held in the air, alive.
 *   • Horizontal + vertical mouse parallax (useMotionValue → useSpring) tilts
 *     the card toward the pointer and is summed on top of the idle sway.
 *   • Multi-depth scroll parallax (useScroll + useTransform): backdrop, the
 *     card itself, and the dust each move at different rates.
 *   • A slow Ken-Burns push drifts the Ayvalık photo inside the frame.
 *   • Warm dust drifts in the foreground; aged-paper grain over everything.
 *
 * All randomness is seeded (makeRng) and every computed SSR number is rounded
 * (r3) so the server and client markup match exactly — no hydration flash.
 */

/* Idle-sway amplitudes (deg / px) — small enough to feel like floating, not
 * spinning. Named so they read as intent, not magic numbers. */
const SWAY = {
  rotateZ: [-2.4, -1.2, -2.4] as number[],
  rotateX: [1.6, -1.4, 1.6] as number[],
  rotateY: [-2.2, 2.4, -2.2] as number[],
  y: [0, -12, 0] as number[],
  duration: 11,
} as const;

/* Mouse-parallax tilt range (deg) the pointer can add on top of the sway. */
const POINTER_TILT_X = 7;
const POINTER_TILT_Y = 10;

export function PostakartHero({ meta, data }: ThemeV2Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [flipped, setFlipped] = useState(false);

  /* ── Scroll parallax (depths move at different rates) ── */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yBackdrop = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const yDust = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* ── Pointer parallax → spring → tilt the held card ── */
  const pxRaw = useMotionValue(0); // -0.5 … 0.5 (x)
  const pyRaw = useMotionValue(0); // -0.5 … 0.5 (y)
  const px = useSpring(pxRaw, { stiffness: 40, damping: 18 });
  const py = useSpring(pyRaw, { stiffness: 40, damping: 18 });
  const tiltY = useTransform(px, (v) => v * POINTER_TILT_Y); // mouse-x → rotateY
  const tiltX = useTransform(py, (v) => -v * POINTER_TILT_X); // mouse-y → rotateX
  const shiftX = useTransform(px, (v) => v * 26); // gentle horizontal drift
  /* Light sheen sweeps with the pointer for a tactile, glossy-vintage feel. */
  const sheenX = useTransform(px, [-0.5, 0.5], ["8%", "92%"]);
  const sheen = useMotionTemplate`radial-gradient(120% 80% at ${sheenX} 8%, rgba(255,248,228,0.16), transparent 60%)`;

  const onPointer = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    pxRaw.set((e.clientX - rect.left) / rect.width - 0.5);
    pyRaw.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    if (reduced) return;
    pxRaw.set(0);
    pyRaw.set(0);
  };

  /* ── Seeded paper-edge irregularity (shared by front fallback SVG) ── */
  const edgeHeights = useMemo(() => {
    const rnd = makeRng(7711);
    return Array.from({ length: 200 }, () => r3(rnd() * 2));
  }, []);

  return (
    <section
      ref={ref}
      onMouseMove={onPointer}
      onMouseLeave={onLeave}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-20"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      {/* Aged paper backdrop (real fal.ai texture) with slow Ken-Burns + scroll parallax */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ y: reduced ? 0 : yBackdrop }}
      >
        <motion.div
          className="absolute inset-0"
          animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        >
          <picture>
            <source srcSet={THEME_ASSETS.postakart.texture?.replace(".png", ".webp")} type="image/webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={THEME_ASSETS.postakart.texture}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
          </picture>
        </motion.div>
      </motion.div>

      {/* Aged backdrop accents */}
      <PaperGrain intensity={0.35} />
      <SepiaTexture ink={palette.ink} />
      {/* Breathing warm vignette — depth that never sits still */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(58,41,24,0.2) 100%)",
        }}
        animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div style={{ y: reduced ? 0 : yDust }} className="pointer-events-none absolute inset-0">
        <DustParticles color={palette.accent} count={20} opacity={0.42} />
      </motion.div>

      {/* The held, floating postcard */}
      <motion.div
        initial={reduced ? false : { rotate: -9, y: -54, opacity: 0, scale: 0.9 }}
        animate={{ rotate: 0, y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[820px] cursor-pointer"
        style={{ perspective: 1700, y: reduced ? 0 : yCard, opacity: reduced ? 1 : cardOpacity }}
        onClick={() => setFlipped((f) => !f)}
      >
        {/* Idle sway layer — the perpetual "held in the air" oscillation */}
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            reduced
              ? undefined
              : { rotateZ: SWAY.rotateZ, rotateX: SWAY.rotateX, rotateY: SWAY.rotateY, y: SWAY.y }
          }
          transition={{ duration: SWAY.duration, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Pointer-tilt layer — summed on top of the sway, eases back on leave */}
          <motion.div
            className="relative"
            style={
              reduced
                ? { transformStyle: "preserve-3d" }
                : { transformStyle: "preserve-3d", rotateX: tiltX, rotateY: tiltY, x: shiftX }
            }
          >
            {/* Flip layer — tap to reveal the back */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d", position: "relative" }}
              className="aspect-[3/2] w-full"
            >
              {/* Front */}
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                <PostcardFront meta={meta} data={data} edgeHeights={edgeHeights} reduced={!!reduced} sheen={sheen} />
              </div>
              {/* Back */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <PostcardBack meta={meta} data={data} sheen={sheen} reduced={!!reduced} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.85 : [0.5, 0.95, 0.5] }}
        transition={reduced ? { duration: 1 } : { duration: 2.6, repeat: Infinity, delay: 1.6 }}
        className="absolute bottom-10 z-10 font-display italic"
        style={{
          color: palette.inkSoft,
          fontSize: "clamp(13px, 1.4vw, 16px)",
          letterSpacing: "0.02em",
        }}
      >
        {flipped ? "← ön yüze dön" : "çevirmek için dokunun →"}
      </motion.p>
    </section>
  );
}

/* ── Postcard FRONT ─────────────────────────────────────────────── */
function PostcardFront({
  meta,
  data,
  edgeHeights,
  reduced,
  sheen,
}: ThemeV2Props & { edgeHeights: number[]; reduced: boolean; sheen: MotionValue<string> }) {
  const { palette } = meta;
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: palette.paper,
        boxShadow:
          "0 50px 90px -40px rgba(58,41,24,0.7), 0 14px 24px rgba(58,41,24,0.22)",
        borderRadius: 2,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='aged'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.25 0 0 0 0 0.1 0 0 0 0.3 0'/></filter><rect width='200' height='200' filter='url(%23aged)'/></svg>\")",
      }}
    >
      {/* Real painted Ayvalık landscape — slow Ken-Burns within the frame */}
      <motion.div
        className="absolute inset-0"
        animate={
          reduced
            ? undefined
            : { scale: [1.04, 1.12, 1.04], x: ["-1%", "1.5%", "-1%"], y: ["0%", "-1.5%", "0%"] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      >
        <picture>
          <source srcSet={THEME_ASSETS.postakart.illustration?.replace(".png", ".webp")} type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={THEME_ASSETS.postakart.illustration}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </motion.div>
      {/* SVG fallback (hidden behind, peeks if image fails) */}
      <div className="absolute inset-0 -z-10">
        <FrontLandscape ink={palette.ink} accent={palette.accent} paper={palette.paper} edgeHeights={edgeHeights} />
      </div>

      {/* Pointer-driven light sheen across the photo */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: reduced ? undefined : sheen }} />

      {/* Coffee stain */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: 18,
          right: 60,
          width: 80,
          height: 80,
          background:
            "radial-gradient(ellipse at 40% 40%, rgba(74,47,30,0.22) 0%, rgba(74,47,30,0.1) 60%, transparent 80%)",
          borderRadius: "50%",
        }}
      />
      {/* Age spots */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: 40,
          left: 30,
          width: 36,
          height: 36,
          background:
            "radial-gradient(ellipse, rgba(58,41,24,0.18) 0%, transparent 60%)",
          borderRadius: "50%",
        }}
      />

      {/* Title overlay bottom */}
      <div
        className="absolute bottom-6 left-6 right-6 px-6 py-5 text-center"
        style={{
          backgroundColor: `${palette.paper}f0`,
          border: `1px solid ${palette.ink}28`,
          boxShadow: "0 2px 6px rgba(58,41,24,0.15)",
          backdropFilter: "blur(2px)",
        }}
      >
        <p
          className="text-[9.5px] uppercase"
          style={{ color: palette.accent, letterSpacing: "0.46em", fontWeight: 500 }}
        >
          Save the Date
        </p>
        <p
          className="mt-3"
          style={{
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
            fontSize: "clamp(32px, 4.6vw, 50px)",
            color: palette.ink,
            lineHeight: 1.02,
            filter: "url(#ink-bleed)",
          }}
        >
          {data.partnerOne}{" "}
          <span style={{ color: palette.accent, fontStyle: "italic" }}>&</span>{" "}
          {data.partnerTwo}
        </p>
        <p
          className="mt-2 font-display italic"
          style={{ fontSize: 14.5, color: palette.inkSoft, letterSpacing: "0.04em" }}
        >
          {data.date.day} {data.date.month} {data.date.year}
        </p>
      </div>

      {/* Corner curl */}
      <div
        className="pointer-events-none absolute bottom-0 right-0"
        style={{
          width: 50,
          height: 50,
          background: `linear-gradient(135deg, transparent 50%, ${shade(palette.paper, -12)} 50%)`,
          boxShadow: "-3px -3px 6px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

/* ── Postcard BACK ──────────────────────────────────────────────── */
function PostcardBack({
  meta,
  data,
  sheen,
  reduced,
}: ThemeV2Props & { sheen: MotionValue<string>; reduced: boolean }) {
  const { palette } = meta;
  return (
    <div
      className="relative grid h-full w-full grid-cols-1 overflow-hidden sm:grid-cols-2"
      style={{
        backgroundColor: palette.paper,
        boxShadow:
          "0 50px 90px -40px rgba(58,41,24,0.7), 0 14px 24px rgba(58,41,24,0.22)",
        borderRadius: 2,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='aged'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.25 0 0 0 0 0.1 0 0 0 0.3 0'/></filter><rect width='200' height='200' filter='url(%23aged)'/></svg>\")",
      }}
    >
      {/* Pointer-driven light sheen */}
      <motion.div className="pointer-events-none absolute inset-0 z-20" style={{ background: reduced ? undefined : sheen }} />

      {/* Left: message */}
      <div
        className="flex flex-col justify-between p-7 sm:border-r sm:p-10"
        style={{ borderColor: `${palette.ink}28` }}
      >
        <div>
          <p
            className="text-[10px] uppercase"
            style={{ color: palette.accent, letterSpacing: "0.42em", fontWeight: 500 }}
          >
            Sevdiklerimize
          </p>
          <p
            className="mt-5 font-display italic"
            style={{
              fontSize: "clamp(14px, 1.7vw, 18px)",
              lineHeight: 1.8,
              color: palette.ink,
              filter: "url(#ink-bleed)",
            }}
          >
            {data.greeting}
          </p>
        </div>
        <div>
          <div
            className="my-3 h-px w-12"
            style={{ background: palette.ink, opacity: 0.22 }}
          />
          <p
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: 26,
              color: palette.ink,
              filter: "url(#ink-bleed)",
            }}
          >
            — {data.partnerOne} &amp; {data.partnerTwo}
          </p>
        </div>
      </div>

      {/* Right: address + stamps */}
      <div className="relative flex flex-col p-7 sm:p-10">
        {/* Stamps top right — each breathes faintly so the back is alive too */}
        <div className="absolute right-7 top-7 flex flex-col gap-3 sm:right-10 sm:top-10">
          <motion.div
            animate={reduced ? undefined : { rotate: [-1.5, 1, -1.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <PerforatedStamp variant="warm" data={data} ink={palette.ink} paper={palette.paper} accent={palette.accent} />
          </motion.div>
          <motion.div
            animate={reduced ? undefined : { rotate: [1.2, -1.4, 1.2] }}
            transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <PerforatedStamp variant="cool" data={data} ink={palette.ink} paper={palette.paper} accent={palette.accent} />
          </motion.div>
        </div>
        {/* Postmark — settles in with a faint ink-stamp pulse, then rests */}
        <motion.div
          className="absolute right-32 top-9 -rotate-12 sm:right-36 sm:top-11"
          initial={reduced ? false : { opacity: 0, scale: 1.25 }}
          animate={{ opacity: 0.95, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <Postmark ink={palette.ink} date={data.date} />
        </motion.div>

        {/* Address */}
        <div className="mt-44 space-y-2">
          <p
            className="text-[10px] uppercase"
            style={{ color: palette.accent, letterSpacing: "0.4em", fontWeight: 500 }}
          >
            Adres
          </p>
          <p
            style={{
              fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
              fontSize: "clamp(22px, 2.6vw, 30px)",
              color: palette.ink,
              lineHeight: 1.2,
              filter: "url(#ink-bleed)",
            }}
          >
            {data.venue.name}
          </p>
          {data.venue.address && (
            <p
              className="font-display italic"
              style={{ fontSize: 15, color: palette.ink }}
            >
              {data.venue.address}
            </p>
          )}
          {data.venue.city && (
            <p
              className="text-[10px] uppercase"
              style={{ color: palette.inkSoft, letterSpacing: "0.32em" }}
            >
              {data.venue.city}
            </p>
          )}
        </div>
        {/* Empty ruled address lines for vintage feel */}
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-px"
              style={{
                background: `linear-gradient(to right, ${palette.ink}30, ${palette.ink}10, transparent)`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner curl */}
      <div
        className="pointer-events-none absolute bottom-0 right-0"
        style={{
          width: 50,
          height: 50,
          background: `linear-gradient(135deg, transparent 50%, ${shade(palette.paper, -12)} 50%)`,
          boxShadow: "-3px -3px 6px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

/* ── Detailed landscape (front) ─────────────────────────────────── */
function FrontLandscape({
  ink,
  accent,
  paper,
  edgeHeights,
}: {
  ink: string;
  accent: string;
  paper: string;
  edgeHeights: number[];
}) {
  return (
    <svg viewBox="0 0 800 530" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5D3A0" />
          <stop offset="35%" stopColor="#E8A876" />
          <stop offset="70%" stopColor="#B8704A" />
          <stop offset="100%" stopColor="#6E3F2E" />
        </linearGradient>
        <linearGradient id="pc-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A87650" />
          <stop offset="100%" stopColor="#4A2D1E" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height="380" fill="url(#pc-sky)" />
      {/* Sun */}
      <circle cx="610" cy="155" r="42" fill="#FBE7AC" opacity="0.92" />
      <circle cx="610" cy="155" r="68" fill="#FBE7AC" opacity="0.32" />
      <circle cx="610" cy="155" r="100" fill="#FBE7AC" opacity="0.15" />

      {/* Distant mountains */}
      <path
        d="M 0 290 L 70 245 L 130 270 L 200 230 L 270 275 L 340 240 L 410 280 L 490 250 L 570 285 L 650 245 L 730 280 L 800 260 L 800 380 L 0 380 Z"
        fill="#7E4A30"
        opacity="0.7"
      />
      {/* Mid mountains */}
      <path
        d="M 0 320 L 80 280 L 150 300 L 220 260 L 290 310 L 360 270 L 440 305 L 520 270 L 600 295 L 680 268 L 760 300 L 800 285 L 800 380 L 0 380 Z"
        fill="#5C3520"
        opacity="0.88"
      />
      {/* Foreground silhouette with palm trees */}
      <path
        d="M 0 360 L 50 340 L 120 360 L 200 345 L 280 365 L 360 348 L 440 365 L 520 350 L 600 365 L 680 348 L 800 365 L 800 380 L 0 380 Z"
        fill="#3A2418"
      />

      {/* Sea */}
      <rect y="380" width="800" height="150" fill="url(#pc-sea)" />
      {/* Sea horizontal lines */}
      <g stroke="#FBE7AC" strokeWidth="0.5" fill="none" opacity="0.3">
        {[395, 415, 435, 460, 490, 520].map((y, i) => (
          <path
            key={i}
            d={`M 0 ${y} Q 100 ${y - 2} 200 ${y} T 400 ${y} T 600 ${y} T 800 ${y}`}
          />
        ))}
      </g>

      {/* Sailboat */}
      <g>
        <line x1="380" y1="370" x2="380" y2="335" stroke="#3A2418" strokeWidth="1.5" />
        <path d="M 380 335 L 410 372 L 380 372 Z" fill="#F5E8C9" />
        <path d="M 366 372 L 396 372 L 392 380 L 370 380 Z" fill="#3A2418" />
      </g>
      <g>
        <line x1="510" y1="385" x2="510" y2="358" stroke="#3A2418" strokeWidth="1" />
        <path d="M 510 358 L 528 386 L 510 386 Z" fill="#F5E8C9" opacity="0.8" />
        <path d="M 502 386 L 522 386 L 519 392 L 505 392 Z" fill="#3A2418" />
      </g>

      {/* Birds */}
      <g stroke="#3A2418" strokeWidth="1.4" fill="none" opacity="0.65">
        <path d="M 200 110 Q 210 102 220 110 Q 226 102 232 110" />
        <path d="M 270 130 Q 280 122 290 130 Q 296 122 302 130" />
        <path d="M 130 160 Q 140 152 150 160" />
        <path d="M 350 95 Q 358 88 366 95" />
      </g>

      {/* Greetings banner top-left */}
      <g transform="translate(40 50)">
        <text
          fontFamily="var(--font-display), serif"
          fontStyle="italic"
          fontSize="26"
          fill="#3A2918"
          opacity="0.9"
          style={{ filter: "url(#ink-bleed)" }}
        >
          Greetings from
        </text>
        <text
          y="46"
          fontFamily="var(--font-display), serif"
          fontSize="52"
          fontWeight="500"
          fill="#3A2918"
          letterSpacing="2.5"
        >
          AYVALIK
        </text>
        <line x1="0" y1="58" x2="220" y2="58" stroke="#3A2918" strokeWidth="0.8" opacity="0.6" />
      </g>

      {/* Paper edge irregularity (top) — seeded heights (no Math.random in render) */}
      <g fill={paper}>
        {edgeHeights.map((h, i) => (
          <rect key={i} x={i * 4} y={-1} width={3} height={h} />
        ))}
      </g>
    </svg>
  );
}

/* ── Stamp with perforated edges ────────────────────────────────── */
function PerforatedStamp({
  variant,
  data,
  ink,
  paper,
  accent,
}: {
  variant: "warm" | "cool";
  data: { monogram: string; date: { day: string; month: string; year: string } };
  ink: string;
  paper: string;
  accent: string;
}) {
  const stampColor = variant === "warm" ? accent : "#4A6F80";
  const labelText = variant === "warm" ? "NUVE" : "POSTA";
  return (
    <svg viewBox="0 0 60 78" width="60" height="78">
      <defs>
        {/* Perforated edge mask */}
        <mask id={`perf-${variant}`}>
          <rect x="0" y="0" width="60" height="78" fill="white" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={`t-${i}`} cx={3 + i * 7} cy="0" r="2" fill="black" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={`b-${i}`} cx={3 + i * 7} cy="78" r="2" fill="black" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={`l-${i}`} cx="0" cy={3 + i * 7} r="2" fill="black" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={`r-${i}`} cx="60" cy={3 + i * 7} r="2" fill="black" />
          ))}
        </mask>
      </defs>

      {/* Stamp body with perforated edges */}
      <g mask={`url(#perf-${variant})`}>
        <rect x="2" y="2" width="56" height="74" fill={paper} />
        <rect x="4" y="4" width="52" height="70" fill={stampColor} />
        {/* Inner border */}
        <rect
          x="6"
          y="6"
          width="48"
          height="66"
          fill="none"
          stroke={paper}
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />
        {/* Top label */}
        <text
          x="30"
          y="18"
          textAnchor="middle"
          fontSize="6.5"
          fill={paper}
          letterSpacing="2"
          fontFamily="serif"
        >
          {labelText}
        </text>
        {/* Monogram */}
        <text
          x="30"
          y="44"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="20"
          fill={paper}
        >
          {data.monogram}
        </text>
        {/* Year */}
        <text
          x="30"
          y="60"
          textAnchor="middle"
          fontSize="6"
          fill={paper}
          letterSpacing="2"
          fontFamily="serif"
        >
          {data.date.year}
        </text>
        {/* Value */}
        <text
          x="30"
          y="69"
          textAnchor="middle"
          fontSize="7"
          fill={paper}
          fontFamily="serif"
        >
          0.50 €
        </text>
      </g>
    </svg>
  );
}

/* ── Postmark ───────────────────────────────────────────────────── */
function Postmark({
  ink,
  date,
}: {
  ink: string;
  date: { day: string; month: string; year: string };
}) {
  return (
    <svg viewBox="0 0 100 100" width="92" height="92">
      <g stroke={ink} strokeWidth="1" fill="none" opacity="0.55">
        <circle cx="50" cy="50" r="46" />
        <circle cx="50" cy="50" r="38" />
        <circle cx="50" cy="50" r="30" />
        {/* Cancellation lines */}
        <line x1="4" y1="50" x2="14" y2="50" />
        <line x1="86" y1="50" x2="96" y2="50" />
        <line x1="50" y1="4" x2="50" y2="14" />
        <line x1="50" y1="86" x2="50" y2="96" />
      </g>
      <g fill={ink} opacity="0.7" textAnchor="middle">
        <text x="50" y="34" fontSize="7" fontFamily="serif" letterSpacing="2">
          {date.month.toUpperCase()}
        </text>
        <text x="50" y="58" fontSize="24" fontFamily="serif" fontWeight="500">
          {date.day}
        </text>
        <text x="50" y="72" fontSize="7" fontFamily="serif" letterSpacing="2">
          {date.year}
        </text>
      </g>
      {/* Faint ink splotches around */}
      <g fill={ink} opacity="0.2">
        <circle cx="22" cy="20" r="1.2" />
        <circle cx="80" cy="24" r="0.9" />
        <circle cx="76" cy="78" r="1" />
        <circle cx="18" cy="82" r="0.7" />
      </g>
    </svg>
  );
}

function SepiaTexture({ ink }: { ink: string }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <pattern id="dots-sepia" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="0.7" fill={ink} opacity="0.5" />
          <circle cx="10" cy="38" r="0.4" fill={ink} opacity="0.3" />
          <circle cx="38" cy="12" r="0.5" fill={ink} opacity="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-sepia)" />
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
