"use client";

/**
 * NUVE Motion vocabulary — FAZ 1
 *
 * One place that owns every duration + easing curve NUVE uses. Pair
 * with `useReducedMotion()` so individual components don't need to
 * check the media query themselves.
 *
 * Editions pick a `motionPreset` (see lib/design/tokens.ts) and the
 * preset maps to one of these duration/easing combos.
 */

import { useEffect, useState } from "react";

/* ── Duration tokens (milliseconds) ────────────────────────────── */
export const duration = {
  /** Hover, button states, focus rings */
  micro: 150,
  /** Small fade-ins, badge reveals */
  short: 300,
  /** Section reveals, scroll-triggered cards */
  base: 600,
  /** Envelope opening, hero word stagger, edition transitions */
  long: 1200,
} as const;

export type DurationKey = keyof typeof duration;

/* ── Easing curves (cubic-bezier tuples) ───────────────────────── *
 * Tuples are compatible with framer-motion's `ease` prop.
 * Strings (`easingCss`) are for inline transition styles.
 */
export const easing = {
  /** Slow start, gentle finish — default editorial */
  silk:   [0.22, 1, 0.36, 1] as const,
  /** Slightly snappier silk — preferred for cards/lists */
  vellum: [0.16, 1, 0.30, 1] as const,
  /** Sharp modernist — Aurora, fast UI feedback */
  snap:   [0.40, 0.00, 0.20, 1] as const,
} as const;

export type EasingKey = keyof typeof easing;

export const easingCss = {
  silk:   "cubic-bezier(0.22, 1, 0.36, 1)",
  vellum: "cubic-bezier(0.16, 1, 0.30, 1)",
  snap:   "cubic-bezier(0.40, 0.00, 0.20, 1)",
} as const;

/* ── Motion presets (per-edition character) ───────────────────── *
 * Editions reference these by name (see tokens.ts EDITIONS[*].motion).
 * Each preset bundles a default duration + easing + an idle-loop
 * descriptor that components like CandleFlicker / WaveRipple can read.
 */
export type MotionPreset =
  | "letterpress"
  | "editorial"
  | "botanical"
  | "gilded"
  | "coastal"
  | "modernist";

export interface MotionPresetConfig {
  enter: { duration: number; ease: readonly [number, number, number, number] };
  hover: { duration: number; ease: readonly [number, number, number, number] };
  /** Idle ambient loop hint — components decide whether to use it. */
  idle: "none" | "flicker" | "sway" | "shimmer" | "wave" | "pulse";
}

export const motionPresets: Record<MotionPreset, MotionPresetConfig> = {
  letterpress: {
    enter: { duration: duration.long / 1000, ease: easing.silk },
    hover: { duration: duration.short / 1000, ease: easing.silk },
    idle:  "flicker",
  },
  editorial: {
    enter: { duration: duration.base / 1000, ease: easing.silk },
    hover: { duration: duration.micro / 1000, ease: easing.silk },
    idle:  "none",
  },
  botanical: {
    enter: { duration: duration.base / 1000, ease: easing.vellum },
    hover: { duration: duration.short / 1000, ease: easing.vellum },
    idle:  "sway",
  },
  gilded: {
    enter: { duration: duration.long / 1000, ease: easing.silk },
    hover: { duration: duration.short / 1000, ease: easing.silk },
    idle:  "shimmer",
  },
  coastal: {
    enter: { duration: duration.base / 1000, ease: easing.vellum },
    hover: { duration: duration.short / 1000, ease: easing.vellum },
    idle:  "wave",
  },
  modernist: {
    enter: { duration: duration.short / 1000, ease: easing.snap },
    hover: { duration: duration.micro / 1000, ease: easing.snap },
    idle:  "none",
  },
};

/* ── prefers-reduced-motion hook ───────────────────────────────── *
 * SSR-safe. Returns `false` during hydration, then matches the user's
 * OS-level preference. Components should clamp duration/skip
 * animations when this returns `true`.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/* ── Helper: clamp a motion config when reduced-motion is on ──── */
export function clampForReducedMotion<T extends { duration: number }>(
  config: T,
  reduced: boolean,
): T {
  if (!reduced) return config;
  return { ...config, duration: 0.01 };
}
