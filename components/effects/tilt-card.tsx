"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * TiltCard — gives a card a subtle 3D tilt that tracks the cursor's
 * position over its surface. Adds gloss to template cards without
 * being parodic.
 *
 *   <TiltCard>
 *     <article>...</article>
 *   </TiltCard>
 *
 * - `max` controls the maximum rotation in degrees on each axis.
 * - Respects prefers-reduced-motion (returns flat passthrough).
 * - perspective is set on the wrapper so child transforms feel 3D, not flat.
 */
export function TiltCard({
  children,
  max = 8,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Normalised pointer position: -0.5 (top-left) → +0.5 (bottom-right)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.5 });

  // rotateY uses x, rotateX uses negative y (so cursor "lifts" the corner under it)
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  const onMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: 900 }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
