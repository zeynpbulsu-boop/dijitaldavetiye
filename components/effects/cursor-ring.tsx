"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * CursorRing — a thin cognac ring that follows the cursor on desktop.
 *
 * Behaviour:
 *   - Hidden by default (CSS `pointer-events: none`, opacity: 0).
 *   - First mousemove makes it visible.
 *   - Grows + fills when hovering elements with `[data-cursor="cta"]`.
 *   - Shrinks to a single dot on `[data-cursor="dot"]`.
 *   - Hidden on touch devices and when `prefers-reduced-motion` is set.
 *   - Hidden on screens < 1024px (mobile/tablet keep system cursor).
 */
export function CursorRing() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 380, damping: 28, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 380, damping: 28, mass: 0.5 });
  const [enabled, setEnabled] = useState(false);
  const [size, setSize] = useState(28);
  const [variant, setVariant] = useState<"default" | "cta" | "dot">("default");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isTouch || !wide || reduced) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const el = t.closest<HTMLElement>("[data-cursor]");
      const kind = el?.dataset.cursor ?? "default";
      if (kind === "cta") {
        setVariant("cta");
        setSize(64);
      } else if (kind === "dot") {
        setVariant("dot");
        setSize(8);
      } else {
        setVariant("default");
        setSize(28);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  const filled = variant === "cta";

  return (
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
        width: size,
        height: size,
        borderRadius: "9999px",
        border: filled ? "none" : "1.2px solid rgba(140, 90, 60, 0.85)",
        background: filled
          ? "rgba(140, 90, 60, 0.18)"
          : variant === "dot"
            ? "rgba(140, 90, 60, 0.85)"
            : "transparent",
        mixBlendMode: filled ? "multiply" : "normal",
        transition:
          "width 280ms cubic-bezier(0.22,1,0.36,1), height 280ms cubic-bezier(0.22,1,0.36,1), background 220ms ease",
      }}
    />
  );
}
