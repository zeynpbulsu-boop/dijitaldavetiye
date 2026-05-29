"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";

interface Props {
  meta: ThemeV2Meta;
  text: string;
  title?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function ExtraInfo({ meta, text, title = "Ek Bilgiler" }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  // Gentle, staggered reveal consistent with the VenueMap/Hero language.
  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-70px" },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <div className="mx-auto max-w-[720px] text-center">
        <motion.p
          {...reveal(0)}
          className="text-[10px] uppercase sm:text-[10.5px]"
          style={{ color: palette.accent, letterSpacing: "0.46em", fontWeight: 500 }}
        >
          Not
        </motion.p>

        <motion.h2
          {...reveal(0.06)}
          className="mt-5 font-display italic"
          style={{
            fontSize: "clamp(28px, 3.6vw, 44px)",
            color: palette.ink,
            lineHeight: 1.12,
            letterSpacing: "0.005em",
            filter: "url(#ink-bleed)",
          }}
        >
          {title}
        </motion.h2>

        {/* Composed divider: hairline · botanical sprig · hairline. */}
        <motion.div
          {...reveal(0.13)}
          className="mx-auto my-7 flex items-center justify-center gap-3 sm:gap-4"
        >
          <span
            className="block h-px w-9 sm:w-12"
            style={{ background: palette.accent, opacity: 0.55 }}
          />
          <svg
            width="58"
            height="18"
            viewBox="0 0 64 20"
            className="shrink-0"
            aria-hidden
          >
            <g stroke={palette.accent} strokeWidth="0.9" fill="none" strokeLinecap="round">
              <path d="M 6 14 Q 16 6 32 8 Q 48 6 58 14" />
              <ellipse
                cx="18"
                cy="10"
                rx="3"
                ry="1.4"
                fill={palette.accent}
                fillOpacity="0.5"
                transform="rotate(-30 18 10)"
              />
              <ellipse
                cx="46"
                cy="10"
                rx="3"
                ry="1.4"
                fill={palette.accent}
                fillOpacity="0.5"
                transform="rotate(30 46 10)"
              />
              <circle cx="32" cy="8" r="2" fill={palette.accent} fillOpacity="0.7" />
            </g>
          </svg>
          <span
            className="block h-px w-9 sm:w-12"
            style={{ background: palette.accent, opacity: 0.55 }}
          />
        </motion.div>

        <motion.p
          {...reveal(0.18)}
          className="mx-auto max-w-[60ch] whitespace-pre-line break-words font-display italic"
          style={{
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.85,
            color: palette.inkSoft,
            letterSpacing: "0.006em",
            textWrap: "pretty",
          }}
        >
          {text}
        </motion.p>
      </div>
    </section>
  );
}
