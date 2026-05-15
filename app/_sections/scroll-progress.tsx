"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin cognac progress bar pinned to the very top of the page.
 * Tracks document scroll, smoothed via spring physics.
 * z-index above the sticky Nav so it stays visible at all times.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand-cognac"
    />
  );
}
