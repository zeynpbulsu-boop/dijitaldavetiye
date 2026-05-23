"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * CursorRing — viral premium cursor follower.
 *
 * Behaviour:
 *   - Hidden on touch devices, < 1024px viewports, prefers-reduced-motion.
 *   - First mousemove → fades in.
 *   - `data-cursor` attribute drives variant:
 *       "default" → 28px outline ring
 *       "cta"     → 64px filled ring, mix-blend multiply
 *       "magnetic"→ 56px ring, snaps to element center (0.35 pull)
 *       "dot"     → 8px solid dot
 *       "audio"   → 48px ring with ♪ glyph
 *       "open"    → 48px ring with → glyph
 *       "copy"    → 48px ring with ⧉ glyph
 *       "view"    → 96px ring, mix-blend difference (over photography)
 *   - `data-cursor-label` attribute → optional text shown beside cursor.
 */

type CursorVariant =
  | "default"
  | "cta"
  | "magnetic"
  | "dot"
  | "audio"
  | "open"
  | "copy"
  | "view";

interface VariantStyle {
  size: number;
  border: string;
  background: string;
  blendMode: "normal" | "multiply" | "difference";
  glyph?: string;
}

const VARIANT_STYLES: Record<CursorVariant, VariantStyle> = {
  default: {
    size: 28,
    border: "1.2px solid rgba(140, 90, 60, 0.85)",
    background: "transparent",
    blendMode: "normal",
  },
  cta: {
    size: 64,
    border: "none",
    background: "rgba(140, 90, 60, 0.18)",
    blendMode: "multiply",
  },
  magnetic: {
    size: 56,
    border: "1.4px solid rgba(140, 90, 60, 0.9)",
    background: "rgba(140, 90, 60, 0.08)",
    blendMode: "multiply",
  },
  dot: {
    size: 8,
    border: "none",
    background: "rgba(140, 90, 60, 0.85)",
    blendMode: "normal",
  },
  audio: {
    size: 48,
    border: "1.2px solid rgba(140, 90, 60, 0.9)",
    background: "rgba(140, 90, 60, 0.1)",
    blendMode: "multiply",
    glyph: "♪",
  },
  open: {
    size: 48,
    border: "1.2px solid rgba(140, 90, 60, 0.9)",
    background: "rgba(140, 90, 60, 0.1)",
    blendMode: "multiply",
    glyph: "→",
  },
  copy: {
    size: 48,
    border: "1.2px solid rgba(140, 90, 60, 0.9)",
    background: "rgba(140, 90, 60, 0.1)",
    blendMode: "multiply",
    glyph: "⧉",
  },
  view: {
    size: 96,
    border: "none",
    background: "rgba(255, 255, 255, 0.9)",
    blendMode: "difference",
  },
};

const MAGNETIC_PULL = 0.35;

export function CursorRing() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 380, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 380, damping: 28, mass: 0.5 });
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || !wide || reduced) return;
    setEnabled(true);

    let currentMagnet: HTMLElement | null = null;

    const move = (e: MouseEvent) => {
      if (currentMagnet) {
        const rect = currentMagnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x.set(e.clientX + (cx - e.clientX) * MAGNETIC_PULL);
        y.set(e.clientY + (cy - e.clientY) * MAGNETIC_PULL);
      } else {
        x.set(e.clientX);
        y.set(e.clientY);
      }
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = t.closest<HTMLElement>("[data-cursor]");
      const kind = (el?.dataset.cursor ?? "default") as CursorVariant;
      const known = (kind in VARIANT_STYLES ? kind : "default") as CursorVariant;
      setVariant(known);
      setLabel(el?.dataset.cursorLabel ?? "");
      currentMagnet = known === "magnetic" ? el : null;
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  const style = VARIANT_STYLES[variant];

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          pointerEvents: "none",
          zIndex: 70,
          width: style.size,
          height: style.size,
          borderRadius: "9999px",
          border: style.border,
          background: style.background,
          mixBlendMode: style.blendMode,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(140, 90, 60, 0.95)",
          fontSize: 16,
          fontWeight: 300,
          transition:
            "width 280ms cubic-bezier(0.22,1,0.36,1), height 280ms cubic-bezier(0.22,1,0.36,1), background 220ms ease, border 220ms ease",
        }}
      >
        {style.glyph}
      </motion.div>
      {label && (
        <motion.div
          aria-hidden
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            x: springX,
            y: springY,
            translateX: `calc(-50% + ${style.size / 2 + 14}px)`,
            translateY: "-50%",
            pointerEvents: "none",
            zIndex: 71,
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(140, 90, 60, 0.85)",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-sans)",
          }}
        >
          {label}
        </motion.div>
      )}
    </>
  );
}
