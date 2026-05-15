"use client";

/**
 * Per-template bespoke art layer.
 *
 * Each NUVE edition gets its own SVG decoration set with a unique motion
 * choreography. The composition follows a 3-layer rhythm:
 *   - layer 1: soft backdrop tint (anchored to theme.storyBg)
 *   - layer 2: mid-plane decoration (frame, branches, hairlines)
 *   - layer 3: foreground motifs (petals, glow dots, shimmer)
 *
 * No external assets, no paid APIs — every path is hand-coded so this
 * layer is fully NUVE-owned. Animations are framer-motion only (already
 * in the bundle) plus a handful of CSS keyframes for repeating shimmer.
 *
 * Theme tokens drive every colour, so each edition automatically
 * picks up its bespoke palette.
 */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { InvitationTheme } from "@/lib/templates/themes";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const SLOW_EASE = [0.25, 0.85, 0.35, 1] as const;

type Props = { slug: string; theme: InvitationTheme };

/** Single entry point — dispatches by template slug. */
export function TemplateDecorations({ slug, theme }: Props) {
  switch (slug) {
    case "magnolia":
      return <MagnoliaArt theme={theme} />;
    case "mansion-lights":
      return <MansionLightsArt theme={theme} />;
    case "timeless":
      return <TimelessArt theme={theme} />;
    case "modern":
      return <ModernArt theme={theme} />;
    case "bordeaux":
      return <BordeauxArt theme={theme} />;
    case "olive-grove":
    case "botanical":
      return <BotanicalArt theme={theme} />;
    case "blush-reverie":
    case "blush-garden":
      return <BlushPetalsArt theme={theme} />;
    case "lavender":
    case "kir-bahcesi":
      return <KirBahcesiArt theme={theme} />;
    case "atelier-indigo":
    case "verde-borgogna":
      return <AtelierInkArt theme={theme} />;
    default:
      return null;
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* Shared wrapper                                                    */
/* ────────────────────────────────────────────────────────────────── */

function Frame({
  children,
  sparkle,
}: {
  children: React.ReactNode;
  /** Optional ambient sparkle field — gets applied on top of slug-specific art. */
  sparkle?: { color: string; count?: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "5%"]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      style={{ y }}
    >
      {children}
      {sparkle && <GoldDust count={sparkle.count ?? 10} accent={sparkle.color} />}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 1) Magnolia — Klasik Botanik                                      */
/* ────────────────────────────────────────────────────────────────── */
/* Two magnolia branches in opposite corners. Petals slow-breathe;
   gold dust shimmer between them. */

function MagnoliaArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      {/* Top-left magnolia branch */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.94, rotate: -3 }}
        animate={{ opacity: 0.65, scale: 1, rotate: 0 }}
        transition={{ duration: 2.2, delay: 0.4, ease: SOFT_EASE }}
        viewBox="0 0 220 280"
        className="absolute -top-6 -left-4"
        width="280"
        height="360"
        style={{ color: theme.accent }}
      >
        {/* Branch stem */}
        <path
          d="M 10 12 C 40 60, 80 100, 130 150 C 150 170, 170 200, 188 240"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.55"
        />
        {/* Side stems */}
        <path d="M 70 80 C 80 100, 90 120, 100 130" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
        <path d="M 140 160 C 150 170, 162 180, 170 195" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.45" />
        {/* Leaves */}
        {[
          { x: 60, y: 80, r: -30 },
          { x: 105, y: 130, r: 25 },
          { x: 100, y: 75, r: 40 },
          { x: 158, y: 195, r: -15 },
          { x: 175, y: 175, r: 30 },
        ].map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
            <path
              d="M 0 0 C 6 -10, 18 -10, 22 0 C 18 10, 6 10, 0 0 Z"
              fill="currentColor"
              opacity="0.32"
            />
          </g>
        ))}
        {/* Magnolia flower (5 petals) */}
        <motion.g
          transform="translate(40 38)"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "center" }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-18"
              rx="11"
              ry="22"
              transform={`rotate(${deg})`}
              fill={theme.monogramFill}
              opacity="0.42"
            />
          ))}
          <circle cx="0" cy="0" r="6" fill={theme.spark} opacity="0.7" />
        </motion.g>
        {/* Second smaller magnolia */}
        <motion.g
          transform="translate(150 175)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          style={{ transformOrigin: "center" }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-12"
              rx="7"
              ry="14"
              transform={`rotate(${deg})`}
              fill={theme.monogramFill}
              opacity="0.35"
            />
          ))}
        </motion.g>
      </motion.svg>

      {/* Bottom-right magnolia branch (mirrored) */}
      <motion.svg
        initial={{ opacity: 0, scale: 0.94, rotate: 3 }}
        animate={{ opacity: 0.55, scale: 1, rotate: 0 }}
        transition={{ duration: 2.2, delay: 0.7, ease: SOFT_EASE }}
        viewBox="0 0 220 280"
        className="absolute -bottom-6 -right-4 scale-x-[-1]"
        width="280"
        height="360"
        style={{ color: theme.accent }}
      >
        <path d="M 10 12 C 40 60, 80 100, 130 150 C 150 170, 170 200, 188 240" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M 70 80 C 80 100, 90 120, 100 130" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
        <motion.g
          transform="translate(40 38)"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ transformOrigin: "center" }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <ellipse key={i} cx="0" cy="-16" rx="10" ry="20" transform={`rotate(${deg})`} fill={theme.monogramFill} opacity="0.36" />
          ))}
        </motion.g>
      </motion.svg>

      {/* Gold dust shimmer particles */}
      <GoldDust count={14} accent={theme.spark} />
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 2) Mansion Lights — Akşam Yalısı                                  */
/* ────────────────────────────────────────────────────────────────── */
/* Tall column lines + center chandelier silhouette + flickering glow */

function MansionLightsArt({ theme }: { theme: InvitationTheme }) {
  const bulbs = [
    { x: 50, y: 32 }, { x: 36, y: 50 }, { x: 50, y: 68 }, { x: 64, y: 50 },
    { x: 30, y: 38 }, { x: 70, y: 38 }, { x: 30, y: 62 }, { x: 70, y: 62 },
  ];
  return (
    <Frame>
      {/* Left & right columns — vertical hairlines */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0.4, scaleY: 1 }}
        transition={{ duration: 1.8, ease: SOFT_EASE }}
        className="absolute left-[5%] top-0 bottom-0 origin-top"
        style={{ width: "1px", background: theme.accent }}
      />
      <motion.div
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 0.4, scaleY: 1 }}
        transition={{ duration: 1.8, ease: SOFT_EASE, delay: 0.2 }}
        className="absolute right-[5%] top-0 bottom-0 origin-top"
        style={{ width: "1px", background: theme.accent }}
      />

      {/* Chandelier */}
      <motion.svg
        viewBox="0 0 100 100"
        width="180"
        height="180"
        className="absolute left-1/2 top-6 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 0.85, y: 0 }}
        transition={{ duration: 2, delay: 0.6, ease: SOFT_EASE }}
        style={{ color: theme.accent }}
      >
        {/* Hanging chain */}
        <line x1="50" y1="0" x2="50" y2="25" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
        {/* Top crown */}
        <ellipse cx="50" cy="28" rx="8" ry="2" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
        {/* Arms */}
        <motion.g
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50px 28px" }}
        >
          <line x1="50" y1="30" x2="32" y2="52" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          <line x1="50" y1="30" x2="68" y2="52" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          <line x1="50" y1="30" x2="50" y2="58" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          <line x1="50" y1="30" x2="22" y2="44" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <line x1="50" y1="30" x2="78" y2="44" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          {/* Bulbs at arm ends */}
          {bulbs.map((b, i) => (
            <FlickerBulb key={i} cx={b.x} cy={b.y} color={theme.spark} delay={i * 0.4} />
          ))}
        </motion.g>
      </motion.svg>

      {/* Scattered warm glow blooms across the canvas */}
      <WarmGlow x="12%" y="38%" color={theme.spark} delay={0} />
      <WarmGlow x="88%" y="42%" color={theme.spark} delay={1.4} />
      <WarmGlow x="22%" y="78%" color={theme.spark} delay={2.6} />
      <WarmGlow x="78%" y="82%" color={theme.spark} delay={1.8} />
    </Frame>
  );
}

function FlickerBulb({ cx, cy, color, delay }: { cx: number; cy: number; color: string; delay: number }) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r="2"
      fill={color}
      animate={{ opacity: [0.5, 1, 0.6, 0.95, 0.55, 0.85] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function WarmGlow({ x, y, color, delay }: { x: string; y: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: 240,
        height: 240,
        marginLeft: -120,
        marginTop: -120,
        background: `radial-gradient(circle, ${color}33 0%, transparent 65%)`,
        borderRadius: "50%",
      }}
      animate={{ opacity: [0.4, 0.8, 0.5, 0.7] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 3) Timeless — Sade Editöryel                                      */
/* ────────────────────────────────────────────────────────────────── */
/* Pure hairlines + serif "&" — typography-led, ink draws on enter */

function TimelessArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      {/* Top double-rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.0, ease: SOFT_EASE }}
        className="absolute left-[10%] right-[10%] top-[8%] origin-left"
        style={{ height: "1px", background: theme.accent, opacity: 0.55 }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.0, ease: SOFT_EASE, delay: 0.15 }}
        className="absolute left-[18%] right-[18%] top-[calc(8%+6px)] origin-left"
        style={{ height: "0.5px", background: theme.accent, opacity: 0.35 }}
      />

      {/* Bottom double-rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.0, ease: SOFT_EASE, delay: 0.4 }}
        className="absolute left-[10%] right-[10%] bottom-[8%] origin-right"
        style={{ height: "1px", background: theme.accent, opacity: 0.55 }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.0, ease: SOFT_EASE, delay: 0.55 }}
        className="absolute left-[18%] right-[18%] bottom-[calc(8%+6px)] origin-right"
        style={{ height: "0.5px", background: theme.accent, opacity: 0.35 }}
      />

      {/* Corner ticks */}
      {[
        { l: "8%", t: "8%" },
        { r: "8%", t: "8%" },
        { l: "8%", b: "8%" },
        { r: "8%", b: "8%" },
      ].map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.4, delay: 1.6 + i * 0.15 }}
          className="absolute"
          style={{
            left: c.l,
            right: c.r,
            top: c.t,
            bottom: c.b,
            width: 12,
            height: 12,
            color: theme.accent,
          }}
        >
          <svg viewBox="0 0 12 12" width="12" height="12">
            <path
              d={
                c.l && c.t
                  ? "M 0 6 L 0 0 L 6 0"
                  : c.r && c.t
                  ? "M 12 6 L 12 0 L 6 0"
                  : c.l && c.b
                  ? "M 0 6 L 0 12 L 6 12"
                  : "M 12 6 L 12 12 L 6 12"
              }
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </motion.div>
      ))}

      {/* Center serif "&" — subtle, large, faint */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ duration: 2.4, delay: 1.0, ease: SOFT_EASE }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display italic"
        style={{
          color: theme.ink,
          fontSize: "clamp(280px, 38vw, 580px)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        &
      </motion.div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 4) Modern — Minimal Çizgi                                         */
/* ────────────────────────────────────────────────────────────────── */
/* Geometric arc + triangles + thin circles, line-only stroke art */

function ModernArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      {/* Top-right large arc segment */}
      <motion.svg
        viewBox="0 0 200 200"
        width="320"
        height="320"
        className="absolute -top-12 -right-12"
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 0.5 }}
        transition={{ duration: 1.8, ease: SOFT_EASE, delay: 0.3 }}
        style={{ color: theme.accent }}
      >
        <motion.path
          d="M 200 100 A 100 100 0 0 0 100 0"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: SLOW_EASE, delay: 0.4 }}
        />
        <motion.path
          d="M 200 120 A 80 80 0 0 0 120 20"
          stroke="currentColor"
          strokeWidth="0.7"
          fill="none"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: SLOW_EASE, delay: 0.8 }}
        />
      </motion.svg>

      {/* Bottom-left triangle frame */}
      <motion.svg
        viewBox="0 0 160 160"
        width="220"
        height="220"
        className="absolute -bottom-8 -left-8"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: 1.8, ease: SOFT_EASE, delay: 0.6 }}
        style={{ color: theme.accent }}
      >
        <motion.polyline
          points="20,140 80,30 140,140"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.0, ease: SLOW_EASE, delay: 0.8 }}
        />
        <motion.line
          x1="44" y1="100" x2="116" y2="100"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.55"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 1.6 }}
        />
      </motion.svg>

      {/* Center thin circle frame */}
      <motion.svg
        viewBox="0 0 200 200"
        width="320"
        height="320"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ color: theme.accent }}
      >
        <motion.circle
          cx="100" cy="100" r="92"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="none"
          opacity="0.18"
          initial={{ pathLength: 0, rotate: -90 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 3.6, ease: SLOW_EASE, delay: 1.0 }}
          style={{ transformOrigin: "100px 100px" }}
        />
        <motion.circle
          cx="100" cy="100" r="72"
          stroke="currentColor"
          strokeWidth="0.4"
          fill="none"
          opacity="0.12"
          initial={{ pathLength: 0, rotate: 90 }}
          animate={{ pathLength: 1, rotate: 0 }}
          transition={{ duration: 3.6, ease: SLOW_EASE, delay: 1.4 }}
          style={{ transformOrigin: "100px 100px" }}
        />
      </motion.svg>

      {/* Four corner dots */}
      {[
        { l: "4%", t: "4%" },
        { r: "4%", t: "4%" },
        { l: "4%", b: "4%" },
        { r: "4%", b: "4%" },
      ].map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1.0, delay: 2.0 + i * 0.1, ease: SOFT_EASE }}
          className="absolute"
          style={{
            left: p.l,
            right: p.r,
            top: p.t,
            bottom: p.b,
            width: 4,
            height: 4,
            background: theme.accent,
            borderRadius: "50%",
            opacity: 0.7,
          }}
        />
      ))}
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 5) Bordeaux — Atelier Indigo / Verde-Borgogna                     */
/* ────────────────────────────────────────────────────────────────── */
/* Gold filigree corners + scattered shimmer dots */

function BordeauxArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      {/* Top-left filigree corner */}
      <motion.svg
        viewBox="0 0 140 140"
        width="200"
        height="200"
        className="absolute top-2 left-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 2.2, ease: SOFT_EASE, delay: 0.4 }}
        style={{ color: theme.accent }}
      >
        <motion.path
          d="M 12 12 C 40 14, 80 16, 120 18 M 12 12 C 14 40, 16 80, 18 120 M 24 24 C 36 30, 50 38, 60 50 M 24 24 C 30 36, 38 50, 50 60"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: SLOW_EASE, delay: 0.6 }}
        />
        {/* Decorative curl */}
        <motion.path
          d="M 18 18 Q 28 12, 38 22 Q 32 32, 22 28 Q 14 22, 18 18 Z"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="currentColor"
          fillOpacity="0.18"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.0 }}
        />
        <motion.circle
          cx="14" cy="14" r="2.5"
          fill="currentColor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.4, delay: 2.4 }}
        />
      </motion.svg>

      {/* Bottom-right filigree corner (mirrored) */}
      <motion.svg
        viewBox="0 0 140 140"
        width="200"
        height="200"
        className="absolute bottom-2 right-2 scale-x-[-1] scale-y-[-1]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 2.2, ease: SOFT_EASE, delay: 0.6 }}
        style={{ color: theme.accent }}
      >
        <motion.path
          d="M 12 12 C 40 14, 80 16, 120 18 M 12 12 C 14 40, 16 80, 18 120 M 24 24 C 36 30, 50 38, 60 50"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: SLOW_EASE, delay: 0.8 }}
        />
        <motion.path
          d="M 18 18 Q 28 12, 38 22 Q 32 32, 22 28 Q 14 22, 18 18 Z"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="currentColor"
          fillOpacity="0.18"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 2.2 }}
        />
      </motion.svg>

      {/* Gold shimmer dots */}
      <GoldDust count={20} accent={theme.spark} />
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 6) Botanical / Olive Grove — Bitki Yeşili                         */
/* ────────────────────────────────────────────────────────────────── */
/* Eucalyptus branches at edges, gentle sway */

function BotanicalArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      <motion.svg
        viewBox="0 0 100 320"
        width="120"
        height="380"
        className="absolute -left-4 top-12"
        animate={{ rotate: [-1.4, 1.4, -1.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: theme.accent, transformOrigin: "60px 0" }}
      >
        <EucalyptusBranch color={theme.accent} fill={theme.monogramFill} />
      </motion.svg>
      <motion.svg
        viewBox="0 0 100 320"
        width="120"
        height="380"
        className="absolute -right-4 top-24 scale-x-[-1]"
        animate={{ rotate: [1.6, -1.6, 1.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{ color: theme.accent, transformOrigin: "60px 0" }}
      >
        <EucalyptusBranch color={theme.accent} fill={theme.monogramFill} />
      </motion.svg>
    </Frame>
  );
}

function EucalyptusBranch({ color, fill }: { color: string; fill: string }) {
  return (
    <>
      <path
        d="M 50 0 C 48 60, 55 120, 50 180 C 45 230, 52 280, 50 320"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        opacity="0.55"
      />
      {Array.from({ length: 16 }).map((_, i) => {
        const y = 18 + i * 18;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <g key={i} transform={`translate(50 ${y})`}>
            <ellipse
              cx={side * 14}
              cy={0}
              rx="10"
              ry="5"
              transform={`rotate(${side * 25} ${side * 14} 0)`}
              fill={fill}
              opacity="0.45"
            />
          </g>
        );
      })}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 7) Blush Petals — Blush Reverie / Blush Garden                    */
/* ────────────────────────────────────────────────────────────────── */
/* Falling rose petals drifting from top */

function BlushPetalsArt({ theme }: { theme: InvitationTheme }) {
  const petals = Array.from({ length: 12 }).map((_, i) => ({
    x: (i * 8.7) % 100,
    delay: (i * 1.3) % 8,
    duration: 10 + (i % 4) * 2,
    rotate: (i * 47) % 360,
    size: 12 + (i % 3) * 4,
  }));
  return (
    <Frame>
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * 1.3,
          }}
          initial={{ y: -40, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: "110vh",
            rotate: p.rotate + 720,
            opacity: [0, 0.65, 0.65, 0],
            x: [0, 18, -12, 22, -8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        >
          <svg viewBox="0 0 24 30" width="100%" height="100%">
            <path
              d="M 12 2 C 4 6, 2 18, 12 28 C 22 18, 20 6, 12 2 Z"
              fill={theme.monogramFill}
              opacity="0.55"
            />
          </svg>
        </motion.div>
      ))}
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 8) Kır Bahçesi / Lavender — Pastoral                              */
/* ────────────────────────────────────────────────────────────────── */
/* Wildflower silhouettes at base + tiny butterfly path */

function KirBahcesiArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      {/* Wildflower base — bottom band */}
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 w-full"
        style={{ height: 140, color: theme.accent }}
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 20 + i * 38;
          const h = 50 + (i % 3) * 14;
          return (
            <motion.g
              key={i}
              animate={{ rotate: [-1.2, 1.2, -1.2] }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              style={{ transformOrigin: `${x}px 120px` }}
            >
              <line x1={x} y1="120" x2={x} y2={120 - h} stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
              {/* Flower head */}
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx={x}
                  cy={120 - h}
                  rx="2.5"
                  ry="5"
                  transform={`rotate(${deg} ${x} ${120 - h})`}
                  fill={theme.monogramFill}
                  opacity="0.5"
                />
              ))}
              <circle cx={x} cy={120 - h} r="2" fill={theme.spark} opacity="0.7" />
            </motion.g>
          );
        })}
      </svg>

      {/* Butterfly tracing a curve */}
      <motion.div
        className="absolute"
        style={{ width: 18, height: 14, left: "5%", top: "30%" }}
        animate={{
          x: ["0%", "200%", "500%", "900%", "1300%"],
          y: ["0%", "-40%", "30%", "-20%", "20%"],
          rotate: [0, -8, 12, -6, 4],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg
          viewBox="0 0 18 14"
          width="18"
          height="14"
          animate={{ scaleX: [1, 0.4, 1] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 9 7 Q 2 0, 0 7 Q 4 12, 9 7 Q 14 12, 18 7 Q 16 0, 9 7 Z" fill={theme.accent} opacity="0.75" />
          <line x1="9" y1="3" x2="9" y2="11" stroke={theme.ink} strokeWidth="0.6" opacity="0.8" />
        </motion.svg>
      </motion.div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* 9) Atelier Indigo / Verde Borgogna — Sanatsal mürekkep            */
/* ────────────────────────────────────────────────────────────────── */
/* Watercolour ink wash + brush strokes */

function AtelierInkArt({ theme }: { theme: InvitationTheme }) {
  return (
    <Frame>
      {/* Top-left ink wash */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2.4, ease: SOFT_EASE, delay: 0.3 }}
        className="absolute"
        style={{
          left: "-8%",
          top: "-12%",
          width: 360,
          height: 360,
          background: `radial-gradient(ellipse at 35% 30%, ${theme.accent}55 0%, ${theme.accent}22 35%, transparent 70%)`,
          filter: "blur(8px)",
          borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
        }}
      />
      {/* Bottom-right ink wash */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2.6, ease: SOFT_EASE, delay: 0.6 }}
        className="absolute"
        style={{
          right: "-10%",
          bottom: "-15%",
          width: 400,
          height: 400,
          background: `radial-gradient(ellipse at 60% 70%, ${theme.monogramFill}66 0%, ${theme.monogramFill}22 40%, transparent 70%)`,
          filter: "blur(12px)",
          borderRadius: "45% 55% 40% 60% / 60% 40% 50% 50%",
        }}
      />
      {/* Brush stroke lines */}
      <motion.svg
        viewBox="0 0 400 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        style={{ color: theme.accent }}
      >
        <motion.path
          d="M 80 120 Q 200 80, 320 140"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          opacity="0.32"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: SLOW_EASE, delay: 1.2 }}
        />
        <motion.path
          d="M 60 460 Q 220 440, 340 500"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.28"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.4, ease: SLOW_EASE, delay: 1.6 }}
        />
      </motion.svg>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* TemplateCardArt — miniature preview for the carousel cards         */
/* ────────────────────────────────────────────────────────────────── */
/* Same visual DNA as the full TemplateDecorations but at card scale. */

export function TemplateCardArt({ slug, dark = false }: { slug: string; dark?: boolean }) {
  const ink = dark ? "rgba(245, 232, 217, 0.6)" : "rgba(43, 30, 22, 0.26)";
  const accent = dark ? "rgba(245, 219, 160, 0.8)" : "rgba(140, 90, 60, 0.62)";
  const soft = dark ? "rgba(232, 200, 178, 0.5)" : "rgba(176, 122, 92, 0.42)";

  switch (slug) {
    case "magnolia":
      return <CardMagnolia ink={ink} accent={accent} soft={soft} />;
    case "mansion-lights":
      return <CardChandelier ink={ink} accent={accent} />;
    case "timeless":
      return <CardTimeless ink={ink} accent={accent} />;
    case "modern":
      return <CardModern ink={ink} accent={accent} />;
    case "bordeaux":
    case "atelier-indigo":
    case "verde-borgogna":
      return <CardFiligree ink={ink} accent={accent} />;
    case "olive-grove":
    case "botanical":
      return <CardEucalyptus ink={ink} accent={accent} soft={soft} />;
    case "blush-reverie":
    case "blush-garden":
    case "dream":
      return <CardPetals soft={soft} accent={accent} />;
    case "lavender":
    case "kir-bahcesi":
      return <CardWildflowers ink={ink} accent={accent} soft={soft} />;
    default:
      return <CardFiligree ink={ink} accent={accent} />;
  }
}

function CardMagnolia({ ink, accent, soft }: { ink: string; accent: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-[80%] w-auto">
      <path
        d="M 30 40 C 60 80, 100 120, 130 170 C 145 195, 160 220, 170 240"
        stroke={ink}
        strokeWidth="1"
        fill="none"
      />
      <g transform="translate(60 80)">
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-22"
            rx="14"
            ry="28"
            transform={`rotate(${deg})`}
            fill={soft}
            opacity="0.65"
          />
        ))}
        <circle cx="0" cy="0" r="7" fill={accent} />
      </g>
      <g transform="translate(135 175)">
        {[0, 72, 144, 216, 288].map((deg, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-14"
            rx="9"
            ry="17"
            transform={`rotate(${deg})`}
            fill={soft}
            opacity="0.5"
          />
        ))}
      </g>
      {[
        { x: 75, y: 50, r: -20 },
        { x: 110, y: 130, r: 30 },
        { x: 145, y: 215, r: -10 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <path d="M 0 0 C 7 -12, 22 -12, 28 0 C 22 12, 7 12, 0 0 Z" fill={soft} opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

function CardChandelier({ ink, accent }: { ink: string; accent: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-[78%] w-auto">
      <line x1="100" y1="20" x2="100" y2="78" stroke={ink} strokeWidth="0.8" />
      <ellipse cx="100" cy="82" rx="14" ry="3" fill="none" stroke={ink} strokeWidth="1.2" />
      <line x1="100" y1="86" x2="62" y2="140" stroke={ink} strokeWidth="1" />
      <line x1="100" y1="86" x2="138" y2="140" stroke={ink} strokeWidth="1" />
      <line x1="100" y1="86" x2="100" y2="150" stroke={ink} strokeWidth="1" />
      <line x1="100" y1="86" x2="40" y2="120" stroke={ink} strokeWidth="0.8" />
      <line x1="100" y1="86" x2="160" y2="120" stroke={ink} strokeWidth="0.8" />
      {[
        { x: 62, y: 140 }, { x: 138, y: 140 }, { x: 100, y: 150 },
        { x: 40, y: 120 }, { x: 160, y: 120 }, { x: 100, y: 86 },
      ].map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r="6" fill={accent} opacity="0.5" />
          <circle cx={b.x} cy={b.y} r="3" fill={accent} />
        </g>
      ))}
    </svg>
  );
}

function CardTimeless({ ink, accent }: { ink: string; accent: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-[80%] w-auto">
      <line x1="30" y1="50" x2="170" y2="50" stroke={ink} strokeWidth="1" />
      <line x1="50" y1="58" x2="150" y2="58" stroke={ink} strokeWidth="0.6" opacity="0.6" />
      <line x1="30" y1="210" x2="170" y2="210" stroke={ink} strokeWidth="1" />
      <line x1="50" y1="202" x2="150" y2="202" stroke={ink} strokeWidth="0.6" opacity="0.6" />
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontStyle="italic"
        fontSize="120"
        fill={accent}
        opacity="0.8"
      >
        &amp;
      </text>
    </svg>
  );
}

function CardModern({ ink, accent }: { ink: string; accent: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-[82%] w-auto">
      <path d="M 200 100 A 100 100 0 0 0 100 0" stroke={ink} strokeWidth="1.2" fill="none" />
      <path d="M 200 130 A 70 70 0 0 0 130 60" stroke={ink} strokeWidth="0.6" fill="none" opacity="0.6" />
      <circle cx="100" cy="160" r="58" stroke={ink} strokeWidth="0.6" fill="none" opacity="0.4" />
      <circle cx="100" cy="160" r="42" stroke={ink} strokeWidth="0.4" fill="none" opacity="0.3" />
      <polyline points="40,240 100,170 160,240" stroke={ink} strokeWidth="1" fill="none" />
      <circle cx="100" cy="160" r="3" fill={accent} />
    </svg>
  );
}

function CardFiligree({ ink, accent }: { ink: string; accent: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-[82%] w-auto">
      <g stroke={ink} strokeWidth="0.7" fill="none">
        <path d="M 30 30 C 60 32, 100 34, 140 36" />
        <path d="M 30 30 C 32 60, 34 100, 36 140" />
        <path d="M 40 40 C 55 48, 70 58, 80 70" />
      </g>
      <path d="M 40 40 Q 56 28, 70 42 Q 60 56, 46 50 Q 34 44, 40 40 Z" fill={accent} opacity="0.4" />
      <circle cx="30" cy="30" r="3" fill={accent} />
      <g stroke={ink} strokeWidth="0.7" fill="none" transform="rotate(180 100 130)">
        <path d="M 30 30 C 60 32, 100 34, 140 36" />
        <path d="M 30 30 C 32 60, 34 100, 36 140" />
      </g>
      {Array.from({ length: 14 }).map((_, i) => {
        const x = 50 + (i * 27) % 100;
        const y = 70 + ((i * 17) % 120);
        return <circle key={i} cx={x} cy={y} r={1 + (i % 2)} fill={accent} opacity="0.6" />;
      })}
    </svg>
  );
}

function CardEucalyptus({ ink, accent, soft }: { ink: string; accent: string; soft: string }) {
  void accent;
  return (
    <svg viewBox="0 0 200 260" className="h-[82%] w-auto">
      <path d="M 100 10 C 96 70, 104 130, 100 190 C 96 220, 104 240, 100 260" stroke={ink} strokeWidth="0.9" fill="none" />
      {Array.from({ length: 12 }).map((_, i) => {
        const y = 30 + i * 18;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={100 + side * 28}
            cy={y}
            rx="18"
            ry="9"
            transform={`rotate(${side * 28} ${100 + side * 28} ${y})`}
            fill={soft}
            opacity="0.65"
          />
        );
      })}
    </svg>
  );
}

function CardPetals({ soft, accent }: { soft: string; accent: string }) {
  void accent;
  return (
    <svg viewBox="0 0 200 260" className="h-[80%] w-auto">
      {[
        { x: 60, y: 50, r: 15 },
        { x: 130, y: 80, r: -20 },
        { x: 90, y: 130, r: 35 },
        { x: 50, y: 170, r: -10 },
        { x: 150, y: 180, r: 12 },
        { x: 100, y: 220, r: -25 },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.r})`}>
          <path d="M 0 -22 C -14 -8, -14 12, 0 22 C 14 12, 14 -8, 0 -22 Z" fill={soft} opacity="0.7" />
        </g>
      ))}
    </svg>
  );
}

function CardWildflowers({ ink, accent, soft }: { ink: string; accent: string; soft: string }) {
  return (
    <svg viewBox="0 0 200 260" className="h-[88%] w-auto">
      {[
        { x: 40, h: 110 },
        { x: 80, h: 140 },
        { x: 120, h: 130 },
        { x: 160, h: 100 },
      ].map((s, i) => (
        <g key={i}>
          <line x1={s.x} y1="240" x2={s.x} y2={240 - s.h} stroke={ink} strokeWidth="0.8" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx={s.x}
              cy={240 - s.h}
              rx="3"
              ry="7"
              transform={`rotate(${deg} ${s.x} ${240 - s.h})`}
              fill={soft}
              opacity="0.7"
            />
          ))}
          <circle cx={s.x} cy={240 - s.h} r="2.5" fill={accent} />
        </g>
      ))}
      {/* Tiny butterfly */}
      <g transform="translate(150 80)">
        <path d="M 0 0 Q -10 -10, -14 0 Q -8 6, 0 0 Q 8 6, 14 0 Q 10 -10, 0 0 Z" fill={accent} opacity="0.85" />
        <line x1="0" y1="-4" x2="0" y2="4" stroke={ink} strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* Shared gold dust shimmer field                                     */
/* ────────────────────────────────────────────────────────────────── */

function GoldDust({ count, accent }: { count: number; accent: string }) {
  // Deterministic positions so it doesn't reflow on every render.
  const seeds = Array.from({ length: count }).map((_, i) => {
    const x = ((i * 37) % 96) + 2;
    const y = ((i * 19) % 92) + 4;
    const size = 2 + (i % 3);
    const delay = (i * 0.31) % 4;
    return { x, y, size, delay };
  });
  return (
    <>
      {seeds.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: accent,
            borderRadius: "50%",
            boxShadow: `0 0 ${s.size * 2}px ${accent}`,
          }}
          animate={{ opacity: [0.2, 0.85, 0.4, 0.9, 0.25] }}
          transition={{
            duration: 5 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
    </>
  );
}
