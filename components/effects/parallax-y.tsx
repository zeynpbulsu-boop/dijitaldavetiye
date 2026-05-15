"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * ParallaxY — wrap any element to give it scroll-driven Y motion.
 * Useful for ambient ornaments that should drift slower than text.
 *
 *   <ParallaxY speed={-30}><CornerBlooms slot="hero" /></ParallaxY>
 *
 * Negative `speed` = element moves UP relative to scroll (slower than page).
 * Positive `speed` = element moves DOWN faster than page.
 *
 * Honours prefers-reduced-motion — no-op when set.
 */
export function ParallaxY({
  children,
  speed = -40,
  className,
}: {
  children: ReactNode;
  /** Pixel offset at the bottom-of-section position. */
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div ref={ref} className={className} style={{ position: "absolute", inset: 0 }}>
      <motion.div style={{ y, position: "absolute", inset: 0 }}>
        {children}
      </motion.div>
    </div>
  );
}
