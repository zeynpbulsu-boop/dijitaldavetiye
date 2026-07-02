"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Çiftin kendi kapağı — AI üretimi (CustomCoverGenerator) veya editor'dan
 * yüklenen hero görseli. Tema videosunun yerine EN DİP katman olarak
 * render edilir; temanın scrim/partikül/süs katmanları üstte kalır, böylece
 * özel kapak tema kimliğini bozmaz. Yavaş Ken Burns ile "still"i canlandırır.
 */
export function CustomCover({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className ?? "absolute inset-0"}
      style={style}
      animate={reduced ? undefined : { scale: [1, 1.07, 1] }}
      transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" />
    </motion.div>
  );
}
