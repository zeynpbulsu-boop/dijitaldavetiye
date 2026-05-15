"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CornerBlooms } from "@/components/ornaments/corner-blooms";
import { useT } from "@/lib/i18n/provider";

/**
 * Seal — split section showcasing the bespoke wax-seal monogram service.
 * Left (lg): large wax seal artwork on cream-alt panel (pure SVG, no images).
 * Right: editorial copy explaining the monogram customisation.
 * Mobile: stacked.
 */
export function Seal() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-line bg-bg-alt/55 py-24 lg:py-36"
    >
      <CornerBlooms slot="seal" />
      <div className="container-wide relative z-10">
        <div className="grid grid-cols-12 items-center gap-x-6 gap-y-16">
          {/* LEFT — wax seal art */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 flex justify-center lg:col-span-6 lg:justify-start"
          >
            <div className="relative aspect-square w-full max-w-[460px]">
              {/* Soft glow */}
              <div
                aria-hidden
                className="absolute inset-[-20px] rounded-full bg-brand-cognac/12 blur-3xl"
              />

              <svg
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
                className="relative w-full drop-shadow-[0_10px_28px_rgba(43,30,22,0.28)]"
                aria-hidden
              >
                {/* Outer halo */}
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="#2B1E16"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />

                {/* Imperfect wax disk — slight petal edge */}
                <path
                  d="M200 50
                     C 260 50, 310 80, 340 130
                     C 360 168, 350 195, 360 230
                     C 365 270, 320 310, 280 340
                     C 240 360, 210 355, 175 360
                     C 130 360, 90 320, 60 280
                     C 45 245, 55 215, 45 180
                     C 38 135, 80 95, 120 70
                     C 150 55, 170 50, 200 50 Z"
                  fill="#8C5A3C"
                />
                {/* Wax body highlights — embossing illusion */}
                <ellipse
                  cx="160"
                  cy="140"
                  rx="60"
                  ry="38"
                  fill="#B98E78"
                  fillOpacity="0.45"
                />
                <ellipse
                  cx="250"
                  cy="280"
                  rx="80"
                  ry="35"
                  fill="#5A3625"
                  fillOpacity="0.5"
                />

                {/* Inner rim */}
                <circle
                  cx="200"
                  cy="200"
                  r="135"
                  fill="none"
                  stroke="#F2EEE6"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                />

                {/* Monogram cluster — N & E intertwined italic */}
                <g
                  fontFamily="serif"
                  fontStyle="italic"
                  fill="#F2EEE6"
                  fillOpacity="0.92"
                >
                  <text
                    x="135"
                    y="248"
                    fontSize="170"
                    fontWeight="400"
                  >
                    N
                  </text>
                  <text
                    x="218"
                    y="248"
                    fontSize="170"
                    fontWeight="400"
                  >
                    E
                  </text>
                  <text
                    x="200"
                    y="290"
                    fontSize="22"
                    textAnchor="middle"
                    letterSpacing="6"
                  >
                    MMXXVI
                  </text>
                </g>

                {/* Tiny ornament dot triplet at top */}
                <g fill="#F2EEE6" fillOpacity="0.55">
                  <circle cx="200" cy="105" r="2" />
                  <circle cx="186" cy="112" r="1.5" />
                  <circle cx="214" cy="112" r="1.5" />
                </g>
              </svg>

              {/* Caption below */}
              <p className="mt-7 text-center text-[10px] uppercase tracking-[0.3em] text-brand-mute">
                {t.seal.caption}
              </p>
            </div>
          </motion.div>

          {/* RIGHT — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 lg:col-span-6"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.seal.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
              }}
            >
              {t.seal.headline_prefix} <br className="hidden sm:inline" />
              <span className="italic text-brand-cognac">{t.seal.headline_accent}</span>.
            </h2>

            <div
              className="mt-7 space-y-5 text-brand-ink/75"
              style={{ fontSize: "17px", lineHeight: 1.7 }}
            >
              {t.seal.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-[360px]">
              {["N&E", "S&M", "A&K"].map((m) => (
                <div
                  key={m}
                  className="flex aspect-square items-center justify-center rounded-full bg-brand-cognac/12 text-brand-cognac"
                >
                  <span className="font-display italic" style={{ fontSize: "22px" }}>
                    {m}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
