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
