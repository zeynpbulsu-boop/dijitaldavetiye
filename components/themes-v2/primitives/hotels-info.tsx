"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, HotelEntry } from "@/lib/themes-v2/types";

/**
 * HotelsInfo — çiftin önerdiği konaklama listesi (şehir dışı misafirler için).
 *
 * Editor'de girilen `hotels` (JSONB) artık canlı davetiyede de görünür.
 * Boşsa ThemeShell bu bölümü hiç render etmez.
 */
export function HotelsInfo({
  meta,
  hotels,
  label = "Konaklama",
}: {
  meta: ThemeV2Meta;
  hotels: HotelEntry[];
  label?: string;
}) {
  const { palette } = meta;
  const reduced = useReducedMotion();

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: {
            duration: 0.9,
            delay,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        };

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <div className="mx-auto max-w-[640px] text-center">
        <motion.p
          {...reveal(0)}
          className="text-[10px] uppercase sm:text-[10.5px]"
          style={{
            color: palette.inkSoft,
            letterSpacing: "0.5em",
            fontWeight: 500,
          }}
        >
          {label}
        </motion.p>

        <motion.h2
          {...reveal(0.05)}
          className="mt-6 font-display"
          style={{
            fontWeight: 300,
            fontSize: "clamp(28px, 4.6vw, 46px)",
            color: palette.ink,
            lineHeight: 1.12,
          }}
        >
          Misafirlerimize öneriler
        </motion.h2>

        <motion.div
          {...reveal(0.12)}
          className="mx-auto my-7 flex items-center justify-center gap-3"
        >
          <span
            className="block h-px w-10"
            style={{ background: palette.accent, opacity: 0.6 }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={palette.accent}
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M3 20V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v12M3 20h18M3 20v1M21 20v1M7 11h4M7 14h4" />
            <path d="M15 20v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
          </svg>
          <span
            className="block h-px w-10"
            style={{ background: palette.accent, opacity: 0.6 }}
          />
        </motion.div>

        <div className="mt-8 flex flex-col gap-4 text-left">
          {hotels.map((h, i) => (
            <motion.div
              key={`${h.name}-${i}`}
              {...reveal(0.16 + i * 0.06)}
              className="rounded-2xl px-6 py-6 sm:px-8"
              style={{
                backgroundColor: palette.paper,
                border: `1px solid ${palette.accent}29`,
                boxShadow: "0 20px 54px -34px rgba(0,0,0,0.4)",
              }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span
                  className="font-display"
                  style={{
                    fontSize: "clamp(17px, 2.2vw, 21px)",
                    color: palette.ink,
                  }}
                >
                  {h.name}
                </span>
                {h.price ? (
                  <span
                    className="text-[12.5px]"
                    style={{ color: palette.inkSoft, letterSpacing: "0.02em" }}
                  >
                    {h.price}
                  </span>
                ) : null}
              </div>

              {h.address ? (
                <p
                  className="mt-1 text-[12.5px]"
                  style={{ color: palette.inkSoft, lineHeight: 1.5 }}
                >
                  {h.address}
                </p>
              ) : null}

              {h.note ? (
                <p
                  className="mt-2 font-display italic"
                  style={{
                    fontSize: "14.5px",
                    color: palette.inkSoft,
                    lineHeight: 1.65,
                  }}
                >
                  {h.note}
                </p>
              ) : null}

              {h.url ? (
                <a
                  href={h.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-[10.5px] uppercase transition hover:opacity-70"
                  style={{
                    color: palette.accent,
                    letterSpacing: "0.24em",
                    fontWeight: 500,
                  }}
                >
                  Rezervasyon / detay →
                </a>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
