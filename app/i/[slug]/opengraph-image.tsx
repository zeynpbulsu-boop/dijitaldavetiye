/**
 * /i/[slug] OG image — FAZ C.2.
 *
 * Per-invitation share preview (WhatsApp, iMessage, Telegram, X, FB,
 * Slack). Theme-aware: pulls the bg / ink / accent + couple names so
 * the chip looks like the invitation, not a generic NUVE banner.
 *
 * Edge runtime so we don't pay a cold-start tax on a route that
 * social crawlers hammer in parallel. `ImageResponse` returns a PNG;
 * size 1200×630 is the canonical Open Graph dimension and also
 * Twitter's `summary_large_image`.
 *
 * The route hits Supabase via the service-role key (already wired up
 * elsewhere). On any failure we fall back to a neutral cream chip
 * with the NUVE wordmark — better than a blank link preview.
 */

import { ImageResponse } from "next/og";
import { adminDb } from "@/lib/db/supabase";
import { LUXE_THEMES, type LuxeEditionSlug } from "@/lib/design/luxe-themes";
import type { Invitation } from "@/lib/db/types";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "NUVE — Davetiye";

function isLuxe(slug: string): slug is LuxeEditionSlug {
  return slug in LUXE_THEMES;
}

async function loadLive(slug: string): Promise<Invitation | null> {
  try {
    const supabase = adminDb();
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .single<Invitation>();
    if (error || !data || data.status !== "live") return null;
    return data;
  } catch {
    return null;
  }
}

const FALLBACK = {
  bg: "#F6F1EA",
  ink: "#1F1B17",
  accent: "#B8895A",
  couple: "NUVE",
  date: "",
  venue: "",
};

export default async function Image({ params }: { params: { slug: string } }) {
  const inv = await loadLive(params.slug);
  const theme =
    inv && isLuxe(inv.template_slug) ? LUXE_THEMES[inv.template_slug] : null;

  const bg = theme?.bg ?? FALLBACK.bg;
  const ink = theme?.ink ?? FALLBACK.ink;
  const accent = theme?.accent ?? FALLBACK.accent;
  const couple =
    inv?.partner_one_name && inv?.partner_two_name
      ? `${inv.partner_one_name} & ${inv.partner_two_name}`
      : theme?.coupleName ?? FALLBACK.couple;
  const dateLine = inv?.wedding_date
    ? inv.wedding_date
        .split("-")
        .reverse()
        .map((s, i) => (i === 1 ? s : s))
        .join(".")
    : "";
  const venue = inv?.venue_name ?? theme?.venue ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: bg,
          color: ink,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.8,
          }}
        >
          NUVE
        </div>

        <div
          style={{
            marginTop: 56,
            fontSize: 96,
            lineHeight: 1.05,
            letterSpacing: "-0.005em",
            textAlign: "center",
            maxWidth: 980,
          }}
        >
          {couple}
        </div>

        {(dateLine || venue) && (
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 24,
              fontSize: 24,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: ink,
              opacity: 0.7,
            }}
          >
            {dateLine && <span>{dateLine}</span>}
            {dateLine && venue && (
              <span
                style={{
                  display: "block",
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: accent,
                }}
              />
            )}
            {venue && <span>{venue}</span>}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 18,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.6,
          }}
        >
          Dijital Davetiye
        </div>
      </div>
    ),
    size,
  );
}
