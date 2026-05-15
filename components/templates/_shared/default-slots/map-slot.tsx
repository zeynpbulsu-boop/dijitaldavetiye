"use client";

/**
 * Default Map Slot — FAZ 2B
 *
 * Embeds an OpenStreetMap iframe pinned on the venue address. No
 * Google Maps API key required, no tracking cookies, no quota risk.
 * Editions that want a stylised map (e.g. parchment overlay) override
 * this slot.
 */

import type { SlotProps } from "../slots";

function mapEmbedFor(query: string) {
  const encoded = encodeURIComponent(query);
  // Nominatim → bbox-based embed. Centre around the query and render
  // a marker at the resolved address.
  return `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&q=${encoded}`;
}

export function MapSlot({ data, editionSlug }: SlotProps) {
  const query = data.venue ?? data.location;
  if (!query) return null;

  return (
    <section
      data-slot="map"
      data-edition-slug={editionSlug}
      className="border-t py-16 lg:py-24"
      style={{
        background: "var(--edition-bg-alt)",
        borderColor: "var(--edition-hairline)",
        color: "var(--edition-ink)",
      }}
    >
      <div className="container-tight mx-auto max-w-[840px] px-5">
        <div className="mb-8 text-center">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "var(--edition-accent)" }}
          >
            — Yer
          </div>
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--edition-display)",
              fontSize: "clamp(28px, 3.5vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {query}
          </h2>
          {data.location && data.venue && (
            <p
              className="mt-3 text-[14px]"
              style={{ color: "var(--edition-ink-soft)" }}
            >
              {data.location}
            </p>
          )}
        </div>

        <div
          className="overflow-hidden"
          style={{
            border: `1px solid var(--edition-hairline)`,
            borderRadius: 6,
          }}
        >
          <iframe
            title={`Harita — ${query}`}
            src={mapEmbedFor(query)}
            className="block h-[360px] w-full md:h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <p
          className="mt-4 text-center text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--edition-ink-soft)" }}
        >
          <a
            className="underline-offset-[6px] hover:underline"
            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener"
          >
            Haritada aç →
          </a>
        </p>
      </div>
    </section>
  );
}
