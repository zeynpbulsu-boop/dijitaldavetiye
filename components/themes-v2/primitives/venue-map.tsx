"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, ThemeV2Data } from "@/lib/themes-v2/types";
import { bestTextOn, ornamentColor } from "@/lib/themes-v2/contrast";
import { useInvitationT } from "../i18n-context";
import { H2, LEAD } from "./type-scale";

/* Calendar stamp from a FIXED iso → deterministic (no Date.now), hydration-safe. */
function calStamp(iso: string, addHours = 0): string {
  const d = new Date(iso);
  if (addHours) d.setTime(d.getTime() + addHours * 3600000);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function VenueMap({
  meta,
  data,
  slug,
}: {
  meta: ThemeV2Meta;
  data: ThemeV2Data;
  /** Canlı davetiye slug'ı — varsa Takvime Ekle butonu .ics endpoint'ine gider */
  slug?: string;
}) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const v = data.venue;

  const query = [v.name, v.address, v.city]
    .filter(Boolean)
    .join(", ")
    .replace(/·/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const enc = encodeURIComponent(query);
  // Prefer exact coordinates (DB venue_lat/lng) for a precise pin; fall back
  // to the address text query when coordinates aren't set.
  const hasCoords = typeof v.lat === "number" && typeof v.lng === "number";
  const coordQ = hasCoords ? `${v.lat},${v.lng}` : "";
  const embed = hasCoords
    ? `https://maps.google.com/maps?q=${coordQ}&z=16&output=embed`
    : `https://maps.google.com/maps?q=${enc}&z=15&output=embed`;
  const directions = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${coordQ}`
    : `https://www.google.com/maps/search/?api=1&query=${enc}`;

  // Canlı davetiyede evrensel .ics dosyası (iPhone/Apple Calendar + Outlook +
  // Google hepsi açar) — hazır /api/calendar/[slug] endpoint'i. Önizlemede
  // (slug yok) Google Calendar linkine düşülür.
  let calendar = "";
  if (slug) {
    calendar = `/api/calendar/${encodeURIComponent(slug)}`;
  } else if (data.date.iso) {
    const title = encodeURIComponent(`${data.partnerOne} & ${data.partnerTwo} — Düğün`);
    calendar =
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}` +
      `&dates=${calStamp(data.date.iso)}/${calStamp(data.date.iso, 5)}` +
      `&location=${enc}`;
  }

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <div className="mx-auto max-w-[820px] text-center">
        <motion.p
          {...reveal(0)}
          className="text-[10px] uppercase sm:text-[10.5px]"
          style={{ color: palette.inkSoft, letterSpacing: "0.5em", fontWeight: 500 }}
        >
          {str.venue.label}
        </motion.p>

        <motion.h2
          {...reveal(0.05)}
          className="mt-6 font-display"
          style={{
            fontWeight: 300,
            fontSize: H2,
            color: palette.ink,
            lineHeight: 1.1,
            letterSpacing: "0.01em",
          }}
        >
          {v.name}
        </motion.h2>

        <motion.div
          {...reveal(0.12)}
          className="mx-auto my-7 flex items-center justify-center gap-3"
        >
          <span className="block h-px w-10" style={{ background: ornamentColor(palette), opacity: 0.6 }} />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ornamentColor(palette)} strokeWidth="1.4">
            <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
          <span className="block h-px w-10" style={{ background: ornamentColor(palette), opacity: 0.6 }} />
        </motion.div>

        {(v.address || v.city) && (
          <motion.p
            {...reveal(0.16)}
            className="font-display italic"
            style={{ fontSize: LEAD, color: palette.inkSoft }}
          >
            {[v.address, v.city].filter(Boolean).join(" · ")}
          </motion.p>
        )}

        <motion.div
          {...reveal(0.2)}
          className="mt-10 overflow-hidden rounded-2xl"
          style={{
            border: `1px solid ${palette.accent}33`,
            boxShadow: "0 22px 60px -28px rgba(0,0,0,0.5)",
          }}
        >
          <iframe
            title={`${v.name} — harita`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[300px] w-full sm:h-[400px]"
            style={{ border: 0, display: "block" }}
          />
        </motion.div>

        <motion.div
          {...reveal(0.26)}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full px-7 py-3 text-[10.5px] uppercase transition hover:scale-[1.02] sm:w-auto"
            style={{
              backgroundColor: palette.accent,
              color: bestTextOn(palette.accent),
              letterSpacing: "0.34em",
              fontWeight: 500,
            }}
          >
            {str.venue.directions}
          </a>
          {calendar && (
            <a
              href={calendar}
              {...(slug ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex w-full items-center justify-center rounded-full px-7 py-3 text-[10.5px] uppercase transition hover:scale-[1.02] sm:w-auto"
              style={{
                border: `1px solid ${palette.accent}`,
                color: palette.ink,
                letterSpacing: "0.34em",
                fontWeight: 500,
              }}
            >
              {str.venue.addToCalendar}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
