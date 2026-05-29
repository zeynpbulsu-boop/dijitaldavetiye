"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, ScheduleItem } from "@/lib/themes-v2/types";

interface Props {
  meta: ThemeV2Meta;
  items: ScheduleItem[];
  title?: string;
}

// Subtle SVG glyph paired with each schedule entry — adds detail
function GlyphForLabel({ label, color }: { label: string; color: string }) {
  const lower = label.toLocaleLowerCase("tr-TR");
  let path = "M 4 8 L 12 8";
  if (lower.includes("karşılama") || lower.includes("welcome"))
    path = "M 2 8 Q 8 2 14 8 Q 8 14 2 8 Z M 8 5 L 8 11 M 5 8 L 11 8";
  else if (lower.includes("nikâh") || lower.includes("töreni") || lower.includes("ceremony"))
    path = "M 8 2 L 8 14 M 4 6 L 12 6";
  else if (lower.includes("kokteyl") || lower.includes("cocktail"))
    path = "M 2 4 L 14 4 L 8 10 L 8 14 M 4 14 L 12 14";
  else if (lower.includes("yemek") || lower.includes("dinner"))
    path = "M 4 2 L 4 8 L 6 8 L 6 14 M 4 8 L 8 8 M 12 2 L 12 14 M 12 2 Q 10 4 12 6";
  else if (lower.includes("dans") || lower.includes("dance"))
    path = "M 4 12 Q 8 4 12 12";

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
      <path d={path} stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ProgramList({ meta, items, title = "Program" }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  return (
    <section className="px-6 py-24 lg:py-28" style={{ backgroundColor: palette.bg }}>
      <div className="mx-auto max-w-[760px] text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9 }}
          className="text-[10.5px] uppercase"
          style={{
            color: palette.accent,
            letterSpacing: "0.42em",
            fontWeight: 500,
          }}
        >
          Akış
        </motion.p>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="mt-4 font-display italic"
          style={{
            fontSize: "clamp(30px, 3.8vw, 46px)",
            color: palette.ink,
            letterSpacing: "0.005em",
            filter: "url(#ink-bleed)",
          }}
        >
          {title}
        </motion.p>

        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto my-6 h-px w-14 opacity-50"
          style={{ background: palette.ink }}
        />

        <ul className="mt-14 space-y-0">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: 0.5 + i * 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center justify-between border-b py-5"
              style={{
                borderColor: `${palette.ink}24`,
                borderBottomStyle: "dashed",
              }}
            >
              <div className="flex items-center gap-4">
                <span
                  className="font-display"
                  style={{
                    fontSize: "clamp(16px, 1.9vw, 21px)",
                    color: palette.accent,
                    fontVariantNumeric: "oldstyle-nums",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.time}
                </span>
                <GlyphForLabel label={item.label} color={palette.inkSoft} />
              </div>
              <span
                className="font-display italic"
                style={{
                  fontSize: "clamp(18px, 2.1vw, 24px)",
                  color: palette.ink,
                  letterSpacing: "0.005em",
                }}
              >
                {item.label}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
