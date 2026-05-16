"use client";

/**
 * Cover MapBlock — lifted from the monolith _invitation-view.tsx
 * L1270-1346 verbatim. Same OpenStreetMap iframe + Google Maps
 * directions CTA. The osmEmbed bbox is intentionally Istanbul-centric
 * for now (geocoding is server-side work, not in scope for FAZ 2C).
 */

import { motion } from "framer-motion";
import type { DbLocale } from "@/lib/db/types";
import type { InvitationTheme } from "@/lib/templates/themes";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

const MAP_LABELS: Record<DbLocale, { eyebrow: string; cta: string }> = {
  tr: { eyebrow: "— Konum", cta: "Yol tarifi al" },
  en: { eyebrow: "— Location", cta: "Get directions" },
  sr: { eyebrow: "— Lokacija", cta: "Uputstvo do mesta" },
};

export function CoverMapBlock({
  query,
  locale,
  theme,
}: {
  query: string;
  locale: DbLocale;
  theme: InvitationTheme;
}) {
  const M = MAP_LABELS[locale];
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const osmEmbed =
    "https://www.openstreetmap.org/export/embed.html?bbox=28.92%2C40.99%2C29.10%2C41.07&layer=mapnik";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: SOFT_EASE }}
      className="mx-auto mt-20 w-full"
      style={{ maxWidth: 720 }}
    >
      <p
        className="text-center text-[10px] font-semibold uppercase"
        style={{ color: theme.accent, letterSpacing: "0.4em" }}
      >
        {M.eyebrow}
      </p>
      <div
        className="mt-6 overflow-hidden"
        style={{
          border: `1px solid ${theme.storyBorder}`,
          borderRadius: 4,
        }}
      >
        <iframe
          title="map"
          src={osmEmbed}
          aria-label="map"
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            height: 280,
            border: 0,
            filter: "saturate(0.78) sepia(0.04)",
          }}
        />
      </div>
      <div className="mt-5 text-center">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase underline-offset-4 hover:underline"
          style={{ color: theme.accent, letterSpacing: "0.28em" }}
        >
          {M.cta} →
        </a>
      </div>
    </motion.div>
  );
}
