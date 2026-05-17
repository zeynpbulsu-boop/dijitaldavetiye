/**
 * GET /api/calendar/[slug] → text/calendar (.ics) — FAZ B.7.
 *
 * Returns a single VEVENT for the invitation's wedding day. The
 * couple's name is the SUMMARY, venue_name + venue_city + address
 * goes in LOCATION, and a short DESCRIPTION points back to the
 * live invitation page.
 *
 * All-day event: DTSTART;VALUE=DATE so calendar clients show "all
 * day" instead of guessing a time zone. RFC 5545 §3.6.1 / §3.3.4.
 *
 * 404s for unknown or non-live slugs so we don't leak draft rows.
 */

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** ICS escaping per RFC 5545 §3.3.11 — comma, semicolon, backslash, newline. */
function escapeICS(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function isoYmdToCompact(iso: string): string | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return `${m[1]}${m[2]}${m[3]}`;
}

function dtstampNow(): string {
  const d = new Date();
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function nextDay(iso: string): string | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const date = new Date(Date.UTC(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])));
  date.setUTCDate(date.getUTCDate() + 1);
  return (
    date.getUTCFullYear().toString() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate())
  );
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const supabase = adminDb();
  const { data, error } = await supabase
    .from("invitations")
    .select("slug, status, wedding_date, partner_one_name, partner_two_name, venue_name, venue_city, venue_address")
    .eq("slug", params.slug)
    .single<
      Pick<
        Invitation,
        | "slug"
        | "status"
        | "wedding_date"
        | "partner_one_name"
        | "partner_two_name"
        | "venue_name"
        | "venue_city"
        | "venue_address"
      >
    >();

  if (error || !data || data.status !== "live" || !data.wedding_date) {
    return new NextResponse("Not found", { status: 404 });
  }

  const start = isoYmdToCompact(data.wedding_date);
  const end = nextDay(data.wedding_date);
  if (!start || !end) {
    return new NextResponse("Bad date", { status: 422 });
  }

  const couple =
    data.partner_one_name && data.partner_two_name
      ? `${data.partner_one_name} & ${data.partner_two_name}`
      : "Düğün";
  const location = [data.venue_name, data.venue_address, data.venue_city]
    .filter(Boolean)
    .join(", ");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.co";
  const url = `${siteUrl}/i/${data.slug}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NUVE//Wedding Invitation//TR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:invitation-${data.slug}@nuve`,
    `DTSTAMP:${dtstampNow()}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeICS(couple)}`,
    location ? `LOCATION:${escapeICS(location)}` : "",
    `DESCRIPTION:${escapeICS(`Davetiye: ${url}`)}`,
    `URL:${url}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const body = lines.join("\r\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="nuve-${data.slug}.ics"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
