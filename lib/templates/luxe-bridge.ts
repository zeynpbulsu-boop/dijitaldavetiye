/**
 * Luxe bridge — FAZ A.3
 *
 * Maps a stored `Invitation` row to a `LuxeEditionTheme` so the public
 * `/i/[slug]` route can render with `LuxeEditionDemo` (the FAZ 5.12
 * universal demo). Falls back to `null` when the invitation's
 * template_slug isn't one of the 6 luxe editions — the caller should
 * route those to the legacy `InvitationView` instead.
 *
 * DB → theme override precedence:
 *   1. Concrete DB value (couple name, monogram, venue, wedding_date)
 *   2. Preset from `LUXE_THEMES[slug]` (greeting, eyebrow, CTAs, music,
 *      footer note — these aren't editable yet; FAZ A.4 + a migration
 *      will move them into the table)
 *
 * Date handling: wedding_date is "YYYY-MM-DD" in DB. We split it into
 * { day, month, year } in the invitation's locale so the slot machine
 * + Hero date line read naturally.
 */

import type { Invitation } from "@/lib/db/types";
import type { LuxeEditionTheme } from "@/components/themed/luxe-edition-demo";
import { LUXE_THEMES, type LuxeEditionSlug } from "@/lib/design/luxe-themes";

const LUXE_SLUGS = new Set(Object.keys(LUXE_THEMES));

export function isLuxeSlug(slug: string): slug is LuxeEditionSlug {
  return LUXE_SLUGS.has(slug);
}

const MONTH_NAMES: Record<string, string[]> = {
  tr: [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  sr: [
    "Januar", "Februar", "Mart", "April", "Maj", "Jun",
    "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar",
  ],
};

function splitDate(iso: string | null, locale: "tr" | "en" | "sr") {
  if (!iso) return null;
  /* "YYYY-MM-DD" — parse without Date so we don't pick up local TZ
     offsets that could flip the day at boundaries. */
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  if (!y || !m || !d) return null;
  const monthIdx = Math.min(11, Math.max(0, m - 1));
  return {
    day: String(d).padStart(2, "0"),
    month: MONTH_NAMES[locale][monthIdx],
    year: String(y),
  };
}

function coupleName(inv: Invitation): string | null {
  if (inv.partner_one_name && inv.partner_two_name) {
    return `${inv.partner_one_name} & ${inv.partner_two_name}`;
  }
  return inv.partner_one_name || inv.partner_two_name || null;
}

function venueText(inv: Invitation): string | null {
  const parts = [inv.venue_name, inv.venue_city].filter(Boolean) as string[];
  return parts.length ? parts.join(" · ") : null;
}

/** Compact YYYYMMDD for Google Calendar URLs. */
function googleDateRange(iso: string): { dates: string } | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const start = `${m[1]}${m[2]}${m[3]}`;
  const next = new Date(
    Date.UTC(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]) + 1),
  );
  const end =
    next.getUTCFullYear().toString() +
    String(next.getUTCMonth() + 1).padStart(2, "0") +
    String(next.getUTCDate()).padStart(2, "0");
  return { dates: `${start}/${end}` };
}

function buildAddToCalendar(inv: Invitation): {
  ics: string;
  google: string;
} | null {
  if (!inv.wedding_date) return null;
  const range = googleDateRange(inv.wedding_date);
  if (!range) return null;

  const couple = coupleName(inv) ?? "Düğün";
  const location = [inv.venue_name, inv.venue_address, inv.venue_city]
    .filter(Boolean)
    .join(", ");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: couple,
    dates: range.dates,
    details: `https://nuve.co/i/${inv.slug}`,
  });
  if (location) params.set("location", location);

  return {
    ics: `/api/calendar/${encodeURIComponent(inv.slug)}`,
    google: `https://calendar.google.com/calendar/render?${params.toString()}`,
  };
}

/**
 * Build a `LuxeEditionTheme` from an Invitation row, or return `null`
 * if the template_slug isn't a luxe edition.
 */
export function luxeThemeFromInvitation(
  inv: Invitation,
): LuxeEditionTheme | null {
  if (!isLuxeSlug(inv.template_slug)) return null;
  const preset = LUXE_THEMES[inv.template_slug];

  const name = coupleName(inv);
  const venue = venueText(inv);
  const date = splitDate(inv.wedding_date, inv.locale);

  return {
    ...preset,
    coupleName: name ?? preset.coupleName,
    monogram: inv.monogram_initials ?? preset.monogram,
    venue: venue ?? preset.venue,
    defaultDate: date ?? preset.defaultDate,
    /* Countdown timer (FAZ B.2) wants a real ISO date. Demos pass
       nothing; production rows pass the saved wedding_date. */
    weddingDateISO: inv.wedding_date ?? preset.weddingDateISO,
    /* Add-to-calendar links (FAZ B.7). Only rendered when wedding_date
       is set — the Google deep link and /api/calendar/[slug] both
       require a date. */
    addToCalendar: buildAddToCalendar(inv) ?? preset.addToCalendar,
    /* RSVP embed (FAZ B.1). The slug routes to the existing
       /api/rsvp endpoint via _rsvp-form.tsx. */
    rsvpSlug: inv.slug,
    /* Locale + event type (migration 004). Multi-language dictionary
     + event_type label overrides. */
    locale: inv.locale,
    eventType: inv.event_type,
    /* Migration 005 — premium media + theming */
    waxSealColor: inv.wax_seal_color,
    heroMediaUrl: inv.hero_media_url,
    photos: Array.isArray(inv.photos) ? inv.photos : [],
    /* Editable copy overrides (migration 003). Each column is nullable;
       falls back to the preset when the editor hasn't set it. */
    greeting: inv.greeting ?? preset.greeting,
    heroEyebrow: inv.hero_eyebrow ?? preset.heroEyebrow,
    heroCta: inv.hero_cta ?? preset.heroCta,
    envelopeCta: inv.envelope_cta ?? preset.envelopeCta,
    footerNote: inv.footer_note ?? preset.footerNote,
    musicTrack: inv.music_track ?? preset.musicTrack,
  };
}
