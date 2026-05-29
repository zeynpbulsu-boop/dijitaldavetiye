"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, ScheduleItem } from "@/lib/themes-v2/types";

interface Props {
  meta: ThemeV2Meta;
  items: ScheduleItem[];
  title?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Refined SVG glyph paired with each schedule entry. Drawn on a 24×24
 * grid with a hairline stroke so it reads as a delicate engraving rather
 * than an icon. Matched by Turkish/English keyword; falls back to a
 * simple sprig.
 */
function ScheduleGlyph({ label, color }: { label: string; color: string }) {
  const lower = label.toLocaleLowerCase("tr-TR");

  let path = "M12 5v14 M8 9l4-3 4 3"; // default: upward sprig

  if (lower.includes("karşılama") || lower.includes("welcome")) {
    // open door / arrival
    path = "M7 20V5h7v15 M14 5l3 1.5V20 M11 12h0.5";
  } else if (
    lower.includes("nikâh") ||
    lower.includes("nikah") ||
    lower.includes("töreni") ||
    lower.includes("toreni") ||
    lower.includes("ceremony") ||
    lower.includes("vows")
  ) {
    // ceremony rings
    path = "M10 13.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M14 13.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M9 6l1 1.6 1-1.6";
  } else if (lower.includes("kokteyl") || lower.includes("cocktail") || lower.includes("aperatif")) {
    // martini coupe
    path = "M5 6h14l-7 7Zm7 7v6 M8.5 19h7";
  } else if (lower.includes("yemek") || lower.includes("dinner") || lower.includes("akşam")) {
    // fork & knife
    path = "M8 4v6 M8 10v10 M6 4v3.5a2 2 0 0 0 4 0V4 M16 4c-1.6 0-2.4 1.8-2.4 4s.8 3.2 2.4 3.2V20";
  } else if (lower.includes("dans") || lower.includes("dance") || lower.includes("eğlence")) {
    // musical note
    path = "M11 6.5l7-1.5v9 M11 6.5v9.5 M11 16a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0Z M18 14a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0Z";
  } else if (lower.includes("pasta") || lower.includes("cake")) {
    // tiered cake
    path = "M5 20v-5h14v5 M7 15v-3h10v3 M9 12V9h6v3 M12 9V6.5";
  }

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden
      className="shrink-0"
    >
      <path
        d={path}
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProgramList({ meta, items, title = "Program" }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  // Faint connecting rail tints
  const railColor = `${palette.accent}33`;
  const nodeRing = `${palette.accent}55`;

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <div className="mx-auto max-w-[760px]">
        <div className="text-center">
          <motion.p
            {...reveal(0)}
            className="text-[10px] uppercase sm:text-[10.5px]"
            style={{ color: palette.accent, letterSpacing: "0.5em", fontWeight: 500 }}
          >
            Akış
          </motion.p>

          <motion.h2
            {...reveal(0.05)}
            className="mt-6 font-display"
            style={{
              fontWeight: 300,
              fontSize: "clamp(30px, 5vw, 50px)",
              color: palette.ink,
              lineHeight: 1.1,
              letterSpacing: "0.01em",
            }}
          >
            {title}
          </motion.h2>

          <motion.div
            {...reveal(0.12)}
            className="mx-auto my-7 flex items-center justify-center gap-3"
          >
            <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.6 }} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="1.4">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.6 }} />
          </motion.div>
        </div>

        {/* Timeline. A single continuous rail on the left threads every
            entry; nodes sit on the rail. The layout is identical on phone
            and desktop — only the rhythm and type scale flex — so it never
            cramps or overflows. */}
        <ol className="relative mt-12 sm:mt-16">
          {/* The rail itself, drawn behind the nodes and animated to grow. */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px sm:left-[8px]"
            style={{
              background: `linear-gradient(${palette.accent}00, ${railColor} 12%, ${railColor} 88%, ${palette.accent}00)`,
              transformOrigin: "top",
            }}
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          />

          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.28 + i * 0.1, duration: 0.7, ease: EASE }}
              className="relative flex items-start gap-5 pb-9 pl-8 last:pb-0 sm:gap-7 sm:pl-9"
            >
              {/* Node on the rail */}
              <span
                aria-hidden
                className="absolute left-0 top-[6px] flex h-[15px] w-[15px] items-center justify-center rounded-full sm:h-[17px] sm:w-[17px]"
                style={{ border: `1px solid ${nodeRing}`, backgroundColor: palette.bg }}
              >
                <span
                  className="block h-[5px] w-[5px] rounded-full sm:h-[6px] sm:w-[6px]"
                  style={{ backgroundColor: palette.accent }}
                />
              </span>

              {/* Time — fixed, comfortable column so labels align */}
              <span
                className="shrink-0 pt-[2px] font-display tabular-nums"
                style={{
                  fontSize: "clamp(15px, 1.9vw, 19px)",
                  color: palette.accent,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.06em",
                  minWidth: "3.6ch",
                }}
              >
                {item.time}
              </span>

              {/* Label + glyph */}
              <span className="flex min-w-0 flex-1 items-baseline gap-3">
                <span
                  className="min-w-0 break-words font-display"
                  style={{
                    fontSize: "clamp(18px, 2.4vw, 25px)",
                    color: palette.ink,
                    lineHeight: 1.25,
                    letterSpacing: "0.005em",
                    fontWeight: 300,
                  }}
                >
                  {item.label}
                </span>
                <span className="ml-auto translate-y-[3px] self-start opacity-80">
                  <ScheduleGlyph label={item.label} color={palette.inkSoft} />
                </span>
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
