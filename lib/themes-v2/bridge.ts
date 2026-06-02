/**
 * Production bridge — maps a stored `Invitation` row to a themes-v2
 * { meta, data } pair so /i/[slug] renders with the new cinematic system.
 *
 * - `template_slug` selects the theme. New invitations store a themes-v2 slug
 *   directly; legacy edition slugs (aethel/nocturne/…) are mapped to the
 *   nearest themes-v2 theme so old rows render with the new system too.
 * - Date is split locale-aware WITHOUT `new Date(YYYY-MM-DD)` parsing pitfalls
 *   (weekday is computed from a UTC date — deterministic, hydration-safe).
 * - Sections with no stored data (schedule, extra notes) are left empty; the
 *   shell skips empty sections so a live invitation never shows placeholders.
 */

import type { Invitation } from "@/lib/db/types";
import type { ThemeV2Meta, ThemeV2Data, ThemeV2Slug, InvitationDate } from "./types";
import { THEMES_V2 } from "./registry";
import { defaultEyebrow } from "./i18n";

const V2_SLUGS: ThemeV2Slug[] = [
  "celenk", "polaroid", "kurdele", "fener", "defter", "geceyarisi", "postakart",
];

/** Legacy edition / luxe slug → nearest themes-v2 theme (by mood + palette). */
const SLUG_MAP: Record<string, ThemeV2Slug> = {
  aethel: "celenk",
  "aethel-chapel": "celenk",
  "elegant-ivory": "celenk",
  "blush-reverie": "polaroid",
  nocturne: "geceyarisi",
  candela: "fener",
  mistral: "kurdele",
  olea: "defter",
  aurora: "polaroid",
  timeless: "postakart",
};

export function resolveThemeV2Slug(templateSlug: string): ThemeV2Slug {
  const s = (templateSlug || "").toLowerCase();
  if (V2_SLUGS.includes(s as ThemeV2Slug)) return s as ThemeV2Slug;
  return SLUG_MAP[s] ?? "celenk";
}

const MONTHS: Record<string, string[]> = {
  tr: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  sr: ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"],
};

/** index 0 = Sunday (getUTCDay) */
const WEEKDAYS: Record<string, string[]> = {
  tr: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  sr: ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"],
};

const DEFAULTS: Record<string, { eyebrow: string; greeting: string; storyTitle: string; footer: string }> = {
  tr: {
    eyebrow: "Düğün törenimize davetlisiniz",
    greeting: "En güzel günümüzde yanımızda olmanızı çok isteriz.",
    storyTitle: "Hikâyemiz",
    footer: "Sizleri aramızda görmek bizi çok mutlu edecek.",
  },
  en: {
    eyebrow: "We're getting married",
    greeting: "We would be honored to have you with us on our special day.",
    storyTitle: "Our Story",
    footer: "It would mean the world to have you with us.",
  },
  sr: {
    eyebrow: "Pozvani ste na naše venčanje",
    greeting: "Bilo bi nam čast da budete sa nama na naš poseban dan.",
    storyTitle: "Naša priča",
    footer: "Mnogo bi nam značilo da ste sa nama.",
  },
};

function numOrNull(v: number | string | null | undefined): number | null {
  if (v == null) return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function buildDate(weddingDate: string | null, locale: string): InvitationDate {
  if (!weddingDate) return { day: "", month: "", year: "" };
  const parts = weddingDate.split("-").map((s) => parseInt(s, 10));
  const [y, m, d] = parts;
  if (!y || !m || !d) return { day: "", month: "", year: "" };
  const monthIdx = Math.min(11, Math.max(0, m - 1));
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return {
    day: String(d).padStart(2, "0"),
    month: (MONTHS[locale] ?? MONTHS.tr)[monthIdx],
    year: String(y),
    weekday: (WEEKDAYS[locale] ?? WEEKDAYS.tr)[dow],
    iso: `${weddingDate}T16:00:00+03:00`,
  };
}

export function invitationToThemeV2(inv: Invitation): { meta: ThemeV2Meta; data: ThemeV2Data } {
  const slug = resolveThemeV2Slug(inv.template_slug);
  const meta = THEMES_V2[slug];
  const locale = (["tr", "en", "sr"].includes(inv.locale) ? inv.locale : "tr") as "tr" | "en" | "sr";
  const eventType = (inv.event_type ?? "wedding").trim() || "wedding";
  const def = DEFAULTS[locale];

  const p1 = (inv.partner_one_name ?? "").trim();
  const p2 = (inv.partner_two_name ?? "").trim();
  const coupleName = p1 && p2 ? `${p1} & ${p2}` : p1 || p2 || "";
  const monogram =
    (inv.monogram_initials ?? "").trim() ||
    (p1 && p2 ? `${p1[0]}&${p2[0]}` : (p1[0] ?? p2[0] ?? "♥"));

  const rotations = [-3, 2, -1, 3, -2, 1];
  const photos = (Array.isArray(inv.photos) ? inv.photos : [])
    .filter((p) => p && p.url)
    .map((p, i) => ({
      src: p.url,
      caption: p.caption || p.alt || "",
      rotation: rotations[i % rotations.length],
    }));

  const gift = inv.gift_iban
    ? {
        iban: inv.gift_iban,
        bank: inv.gift_bank,
        accountHolder: inv.gift_account_holder,
        note: inv.gift_note,
      }
    : null;

  // Gün-akışı / program (Migration 010 schedule JSONB) → canlı davetiyeye.
  // DB şekli { time, title, desc } → themes-v2 ScheduleItem { time, label, desc }.
  const schedule = (Array.isArray(inv.schedule) ? inv.schedule : [])
    .filter((s) => s && (s.title || s.time))
    .map((s) => ({
      time: (s.time ?? "").trim(),
      label: (s.title ?? "").trim(),
      desc: s.desc?.trim() || undefined,
    }));

  // Konaklama önerileri (Migration 006 hotels JSONB) → canlı davetiyeye.
  const hotels = (Array.isArray(inv.hotels) ? inv.hotels : [])
    .filter((h) => h && h.name)
    .map((h) => ({
      name: h.name,
      address: h.address || undefined,
      price: h.price || undefined,
      url: h.url || undefined,
      note: h.note || undefined,
    }));

  const data: ThemeV2Data = {
    locale,
    eventType,
    coupleName,
    partnerOne: p1 || coupleName || "",
    partnerTwo: p2,
    monogram,
    eyebrow: (inv.hero_eyebrow ?? "").trim() || defaultEyebrow(locale, eventType),
    greeting: (inv.greeting ?? "").trim() || def.greeting,
    date: buildDate(inv.wedding_date, locale),
    venue: {
      name: (inv.venue_name ?? "").trim(),
      address: inv.venue_address?.trim() || undefined,
      city: inv.venue_city?.trim() || undefined,
      lat: numOrNull(inv.venue_lat),
      lng: numOrNull(inv.venue_lng),
    },
    story: { title: def.storyTitle, body: (inv.story_text ?? "").trim() },
    photos,
    schedule, // Migration 010 — boşsa shell program section'ını gizler
    menu: [], // food menu removed from the product
    extraInfo: "", // no DB column yet → shell hides the notes section
    footerNote: (inv.footer_note ?? "").trim() || def.footer,
    gift,
    hotels,
  };

  return { meta, data };
}
