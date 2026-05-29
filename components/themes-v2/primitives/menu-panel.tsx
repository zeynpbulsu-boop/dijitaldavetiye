"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, MenuColumn } from "@/lib/themes-v2/types";
import { AtmosphereDefs } from "./atmosphere";

interface Props {
  meta: ThemeV2Meta;
  columns: MenuColumn[];
  title?: string;
}

export function MenuPanel({ meta, columns, title = "Menü" }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden px-6 py-24 lg:py-32"
      style={{ backgroundColor: palette.bg }}
    >
      <AtmosphereDefs />

      <div className="relative mx-auto max-w-[1100px]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto overflow-hidden"
          style={{
            backgroundColor: palette.countdownBg,
            color: palette.countdownInk,
            padding: "clamp(36px, 6vw, 80px) clamp(28px, 5vw, 64px)",
            maxWidth: 820,
            borderRadius: 3,
            boxShadow:
              "0 40px 80px -36px rgba(0,0,0,0.36), 0 12px 22px rgba(0,0,0,0.18)",
          }}
        >
          {/* Inset paper grain on panel */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10 mix-blend-screen"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
              backgroundSize: "200px 200px",
            }}
          />

          {/* Corner ornaments */}
          <CornerOrnament position="tl" color={palette.accent} />
          <CornerOrnament position="tr" color={palette.accent} />
          <CornerOrnament position="bl" color={palette.accent} />
          <CornerOrnament position="br" color={palette.accent} />

          <div className="relative text-center">
            <p
              className="text-[10.5px] uppercase"
              style={{
                color: palette.accent,
                letterSpacing: "0.46em",
                fontWeight: 500,
              }}
            >
              Yemek
            </p>
            <p
              className="mt-3 font-display italic"
              style={{
                fontSize: "clamp(32px, 3.8vw, 46px)",
                letterSpacing: "0.005em",
              }}
            >
              {title}
            </p>
            <div
              className="mx-auto my-6 flex items-center justify-center gap-3"
            >
              <span
                className="block h-px w-10"
                style={{ background: palette.accent, opacity: 0.7 }}
              />
              <svg width="10" height="10" viewBox="0 0 10 10">
                <polygon points="5,0 6.5,3.5 10,5 6.5,6.5 5,10 3.5,6.5 0,5 3.5,3.5" fill={palette.accent} />
              </svg>
              <span
                className="block h-px w-10"
                style={{ background: palette.accent, opacity: 0.7 }}
              />
            </div>
          </div>

          <div className="relative mt-12 grid grid-cols-1 gap-x-14 gap-y-16 sm:grid-cols-2">
            {columns.map((col, i) => (
              <motion.div
                key={i}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p
                  className="mb-6 text-center"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.44em",
                    color: palette.accent,
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {col.heading}
                </p>
                <ul className="space-y-6">
                  {col.items.map((item, j) => (
                    <li key={j} className="text-center">
                      <p
                        className="font-display"
                        style={{
                          fontSize: "clamp(18px, 1.9vw, 22px)",
                          color: palette.countdownInk,
                          letterSpacing: "0.005em",
                          fontWeight: 400,
                        }}
                      >
                        {item.name}
                      </p>
                      {item.detail && (
                        <p
                          className="mt-1.5 font-display italic"
                          style={{
                            fontSize: "clamp(13px, 1.3vw, 15px)",
                            color: `${palette.countdownInk}b0`,
                            lineHeight: 1.55,
                          }}
                        >
                          {item.detail}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CornerOrnament({
  position,
  color,
}: {
  position: "tl" | "tr" | "bl" | "br";
  color: string;
}) {
  const styleMap = {
    tl: { top: 16, left: 16, transform: "rotate(0deg)" },
    tr: { top: 16, right: 16, transform: "scaleX(-1)" },
    bl: { bottom: 16, left: 16, transform: "scaleY(-1)" },
    br: { bottom: 16, right: 16, transform: "scale(-1)" },
  } as const;
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="pointer-events-none absolute hidden sm:block"
      style={styleMap[position]}
    >
      <g stroke={color} strokeWidth="0.8" fill="none" opacity="0.85">
        <line x1="0" y1="0" x2="24" y2="0" />
        <line x1="0" y1="0" x2="0" y2="24" />
        <circle cx="0" cy="0" r="3" />
        <line x1="6" y1="6" x2="14" y2="14" />
      </g>
    </svg>
  );
}
