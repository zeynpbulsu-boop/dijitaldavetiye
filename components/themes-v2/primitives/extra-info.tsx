"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";

interface Props {
  meta: ThemeV2Meta;
  text: string;
  title?: string;
}

export function ExtraInfo({ meta, text, title = "Ek Bilgiler" }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  return (
    <section className="px-6 py-24 lg:py-28" style={{ backgroundColor: palette.bg }}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-[700px] text-center"
      >
        <p
          className="text-[10.5px] uppercase"
          style={{
            color: palette.accent,
            letterSpacing: "0.42em",
            fontWeight: 500,
          }}
        >
          Not
        </p>
        <p
          className="mt-4 font-display italic"
          style={{
            fontSize: "clamp(30px, 3.8vw, 46px)",
            color: palette.ink,
            letterSpacing: "0.005em",
            filter: "url(#ink-bleed)",
          }}
        >
          {title}
        </p>
        <div className="mx-auto my-6 h-px w-14 opacity-50" style={{ background: palette.ink }} />

        {/* Small botanical doodle */}
        <svg width="64" height="20" viewBox="0 0 64 20" className="mx-auto mb-6">
          <g stroke={palette.accent} strokeWidth="0.9" fill="none" strokeLinecap="round">
            <path d="M 6 14 Q 16 6 32 8 Q 48 6 58 14" />
            <ellipse cx="18" cy="10" rx="3" ry="1.4" fill={palette.accent} fillOpacity="0.5" transform="rotate(-30 18 10)" />
            <ellipse cx="46" cy="10" rx="3" ry="1.4" fill={palette.accent} fillOpacity="0.5" transform="rotate(30 46 10)" />
            <circle cx="32" cy="8" r="2" fill={palette.accent} fillOpacity="0.7" />
          </g>
        </svg>

        <p
          className="font-display italic"
          style={{
            fontSize: "clamp(16px, 1.8vw, 20px)",
            lineHeight: 1.9,
            color: palette.inkSoft,
            letterSpacing: "0.005em",
          }}
        >
          {text}
        </p>
      </motion.div>
    </section>
  );
}
