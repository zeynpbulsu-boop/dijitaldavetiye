"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal — the scroll-choreography primitive that gives every section the
 * "premium" entrance the best invitation sites share: each element settles
 * in with a slow fade + slight rise as it enters the viewport, once.
 *
 * Use a small `delay` on sibling elements to stagger them (0.08–0.12s steps).
 * Honors prefers-reduced-motion (renders static, fully visible).
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = true,
  once = true,
  duration = 0.95,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
