import { describe, expect, it } from "vitest";
import { isLuxeSlug, luxeThemeFromInvitation } from "../luxe-bridge";
import { LUXE_THEMES } from "@/lib/design/luxe-themes";
import type { Invitation } from "@/lib/db/types";

/**
 * Luxe bridge contract — FAZ A.3.
 *
 *   1. Six luxe slugs (aethel, atelier-indigo, aurora, bodrum-blue,
 *      mansion-lights, olive-grove) resolve to themes.
 *   2. Anything else returns null so the legacy view still owns it.
 *   3. DB values override preset values; nulls fall back to preset.
 *   4. wedding_date splits into { day, month, year } in the row's locale.
 */

function baseInvitation(overrides: Partial<Invitation> = {}): Invitation {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    slug: "test",
    template_slug: "aethel",
    tier: "standard",
    status: "live",
    partner_one_name: null,
    partner_two_name: null,
    wedding_date: null,
    venue_name: null,
    venue_city: null,
    venue_address: null,
    story_text: null,
    music_url: null,
    music_track_id: null,
    monogram_initials: null,
    locale: "tr",
    greeting: null,
    hero_eyebrow: null,
    hero_cta: null,
    envelope_cta: null,
    footer_note: null,
    music_track: null,
    event_type: "wedding",
    wax_seal_color: null,
    hero_media_url: null,
    photos: [],
    gift_iban: null,
    gift_bank: null,
    gift_account_holder: null,
    gift_note: null,
    hotels: [],
    owner_email: null,
    owner_phone: null,
    admin_token: "tok",
    dodo_session_id: null,
    dodo_payment_id: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    paid_at: null,
    live_until: null,
    ...overrides,
  };
}

describe("isLuxeSlug", () => {
  it("recognises every luxe slug", () => {
    for (const slug of Object.keys(LUXE_THEMES)) {
      expect(isLuxeSlug(slug)).toBe(true);
    }
  });

  it("rejects non-luxe slugs", () => {
    expect(isLuxeSlug("bordeaux")).toBe(false);
    expect(isLuxeSlug("blush-reverie")).toBe(false);
    expect(isLuxeSlug("")).toBe(false);
  });
});

describe("luxeThemeFromInvitation", () => {
  it("returns null for non-luxe template_slug", () => {
    const inv = baseInvitation({ template_slug: "bordeaux" });
    expect(luxeThemeFromInvitation(inv)).toBeNull();
  });

  it("returns the preset when every DB override is null", () => {
    const inv = baseInvitation({ template_slug: "aethel" });
    const theme = luxeThemeFromInvitation(inv);
    expect(theme).not.toBeNull();
    const preset = LUXE_THEMES.aethel;
    expect(theme!.coupleName).toBe(preset.coupleName);
    expect(theme!.venue).toBe(preset.venue);
    expect(theme!.greeting).toBe(preset.greeting);
    expect(theme!.heroCta).toBe(preset.heroCta);
  });

  it("uses DB partner names to build coupleName", () => {
    const inv = baseInvitation({
      partner_one_name: "Ada",
      partner_two_name: "Mete",
    });
    const theme = luxeThemeFromInvitation(inv)!;
    expect(theme.coupleName).toBe("Ada & Mete");
  });

  it("composes venue from venue_name + venue_city", () => {
    const inv = baseInvitation({
      venue_name: "Aethel",
      venue_city: "Toskana",
    });
    expect(luxeThemeFromInvitation(inv)!.venue).toBe("Aethel · Toskana");
  });

  it("splits wedding_date in the row's locale", () => {
    const tr = luxeThemeFromInvitation(
      baseInvitation({ wedding_date: "2026-09-12", locale: "tr" }),
    )!;
    expect(tr.defaultDate).toEqual({ day: "12", month: "Eylül", year: "2026" });

    const en = luxeThemeFromInvitation(
      baseInvitation({ wedding_date: "2026-09-12", locale: "en" }),
    )!;
    expect(en.defaultDate).toEqual({
      day: "12",
      month: "September",
      year: "2026",
    });
  });

  it("does not pick up local-TZ flips at day boundaries", () => {
    /* "2026-01-01" parsed via new Date(...) and then .toLocaleDateString
       on TZ < UTC will show Dec 31. The bridge parses the ISO string
       manually so the day-of-month is preserved. */
    const inv = baseInvitation({ wedding_date: "2026-01-01" });
    expect(luxeThemeFromInvitation(inv)!.defaultDate).toEqual({
      day: "01",
      month: "Ocak",
      year: "2026",
    });
  });

  it("DB overrides win when set", () => {
    const inv = baseInvitation({
      template_slug: "aethel",
      greeting: "Sevdiklerimizle",
      hero_cta: "Yanımızda mısın?",
      music_track: "Bir Tutam Müzik · The Couple",
    });
    const theme = luxeThemeFromInvitation(inv)!;
    expect(theme.greeting).toBe("Sevdiklerimizle");
    expect(theme.heroCta).toBe("Yanımızda mısın?");
    expect(theme.musicTrack).toBe("Bir Tutam Müzik · The Couple");
  });
});
