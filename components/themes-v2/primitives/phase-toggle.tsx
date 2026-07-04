"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Palette } from "@/lib/themes-v2/types";

/**
 * Gece/Gündüz faz düğmesi — sağ üstte cam pill (72×36). Güneş ve ay
 * ikonları rotate+scale çapraz geçişle yer değiştirir; thumb 0.5s kayar.
 * Yalnızca gece paleti tanımlı temalarda render edilir.
 */
export function PhaseToggle({
  isNight,
  onToggle,
  palette,
}: {
  isNight: boolean;
  onToggle: () => void;
  palette: ThemeV2Palette;
}) {
  const reduced = useReducedMotion();
  const dur = reduced ? 0 : 0.5;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isNight ? "Gündüz görünümüne geç" : "Gece görünümüne geç"}
      aria-pressed={isNight}
      className="fixed right-4 top-16 z-40 flex h-9 w-[72px] items-center rounded-full px-1 backdrop-blur-md transition hover:scale-105"
      style={{
        backgroundColor: `${palette.paper}40`,
        border: `1px solid ${palette.ink}26`,
        boxShadow: `0 8px 24px -12px ${palette.ink}59`,
      }}
    >
      {/* Kayan thumb */}
      <motion.span
        className="relative flex h-7 w-7 items-center justify-center rounded-full"
        style={{
          backgroundColor: palette.paper,
          boxShadow: `0 2px 8px ${palette.ink}40`,
        }}
        initial={false}
        animate={{ x: isNight ? 34 : 0 }}
        transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Güneş — gündüzde görünür */}
        <motion.svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1.6"
          strokeLinecap="round"
          className="absolute"
          initial={false}
          animate={{ rotate: isNight ? 90 : 0, scale: isNight ? 0 : 1, opacity: isNight ? 0 : 1 }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
        </motion.svg>
        {/* Ay — gecede görünür */}
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={palette.ink}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute"
          initial={false}
          animate={{ rotate: isNight ? 0 : -90, scale: isNight ? 1 : 0, opacity: isNight ? 1 : 0 }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 7.5 7.5 0 1 0 20 13.5z" />
        </motion.svg>
      </motion.span>
    </button>
  );
}
