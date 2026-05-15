"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Magnetic — wrap any clickable element so it gently pulls toward the
 * cursor while the cursor is within `radius` pixels. Premium feel for
 * primary CTAs without being a circus.
 *
 *   <Magnetic strength={0.3} radius={120}>
 *     <Link href="...">Başla →</Link>
 *   </Magnetic>
 *
 * Notes:
 *   - Honours `prefers-reduced-motion`: snaps to centre, no listener.
 *   - Pointer events live on the wrapper, so child handlers (clicks,
 *     hover styles) still work normally.
 *   - Uses spring physics so the trailing motion feels weighted, not
 *     stuck to the cursor 1:1.
 */
export function Magnetic({
  children,
  strength = 0.3,
  radius = 120,
  className,
}: {
  children: ReactNode;
  /** 0–1 multiplier on cursor offset. 0.3 is a tasteful pull. */
  strength?: number;
  /** Active radius in px. Beyond this the element is at rest. */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > radius) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ display: "inline-block" }}
    >
      <motion.span
        style={{ x: springX, y: springY, display: "inline-block" }}
      >
        {children}
      </motion.span>
    </span>
  );
}
