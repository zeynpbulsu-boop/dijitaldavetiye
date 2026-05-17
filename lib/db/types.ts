/**
 * Hand-maintained DB types mirroring supabase/migrations/001_init.sql.
 * When the schema changes, update this file too.
 *
 * (You can also generate this with `supabase gen types typescript` —
 * we hand-maintain for now to keep the dep surface small.)
 */

// Flat pricing (Faz 20) — only "standard" remains. Legacy values still
// kept in the union briefly so historic paid rows from migration 001 don't
// fail strict type-checks; new inserts always use "standard".
export type TierSlug = "standard" | "sade" | "klasik" | "premium";
export type InvitationStatus =
  | "draft"
  | "paid"
  | "live"
  | "archived"
  | "refunded";
export type RsvpAttendance = "yes" | "no" | "maybe";
export type DbLocale = "tr" | "en" | "sr";
/** Migration 004 — invitations.event_type CHECK enum. */
export type EventType =
  | "wedding"
  | "engagement"
  | "henna"
  | "save_the_date";
/** Migration 004 — guests.status CHECK enum. */
export type GuestStatus = "invited" | "confirmed" | "declined" | "maybe";

/** Migration 005 — galeri item (invitations.photos JSONB array). */
export interface PhotoItem {
  url: string;
  alt?: string;
  caption?: string;
}

/** Migration 006 — otel önerisi (invitations.hotels JSONB array). */
export interface HotelItem {
  name: string;
  address?: string;
  price?: string;
  url?: string;
  note?: string;
}

export interface Invitation {
  id: string;
  slug: string;
  template_slug: string;
  tier: TierSlug;
  status: InvitationStatus;

  partner_one_name: string | null;
  partner_two_name: string | null;
  wedding_date: string | null; // ISO date "YYYY-MM-DD"
  venue_name: string | null;
  venue_city: string | null;
  venue_address: string | null;

  story_text: string | null;
  music_url: string | null;
  music_track_id: string | null;
  monogram_initials: string | null;
  locale: DbLocale;

  /* FAZ A.3 — luxe edition copy overrides (migration 003).
     Null when the editor hasn't set them; the luxe-bridge then falls
     back to the preset in lib/design/luxe-themes.ts. */
  greeting: string | null;
  hero_eyebrow: string | null;
  hero_cta: string | null;
  envelope_cta: string | null;
  footer_note: string | null;
  music_track: string | null;

  /* Migration 004 — etkinlik tipi (wedding / engagement / henna /
     save_the_date). LuxeEditionDemo etiket overrideları bu kolona
     bakar; not-null default 'wedding' yani geçmiş satırlar etkilenmez. */
  event_type: EventType;

  /* Migration 005 — premium media + theming overrideları:
       wax_seal_color  hex string; null ise preset rengi
       hero_media_url  couple yüklediği venue/engagement görseli
       photos          galeri item listesi (JSONB array) */
  wax_seal_color: string | null;
  hero_media_url: string | null;
  photos: PhotoItem[];

  /* Migration 006 — Pressed Love Como paritesi:
       gift_*          banka hesabı + hediye notu (4 kolon)
       hotels          otel önerisi listesi (JSONB array) */
  gift_iban: string | null;
  gift_bank: string | null;
  gift_account_holder: string | null;
  gift_note: string | null;
  hotels: HotelItem[];

  /* Migration 007 — venue koordinatları (B.3 map embed). */
  venue_lat: number | null;
  venue_lng: number | null;

  owner_email: string | null;
  owner_phone: string | null;

  admin_token: string;

  dodo_session_id: string | null;
  dodo_payment_id: string | null;

  created_at: string;
  updated_at: string;
  paid_at: string | null;
  live_until: string | null;
}

export type InvitationInsert = Partial<Invitation> &
  Pick<Invitation, "slug" | "template_slug" | "tier">;

export interface Rsvp {
  id: string;
  invitation_id: string;
  guest_name: string;
  guest_email: string | null;
  attendance: RsvpAttendance;
  plus_one: boolean;
  plus_one_name: string | null;
  menu_choice: string | null;
  allergies: string | null;
  note: string | null;
  created_at: string;
}

export type RsvpInsert = Omit<Rsvp, "id" | "created_at">;

/** Migration 004 — public.guests row. */
export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: GuestStatus;
  plus_one: boolean;
  plus_one_name: string | null;
  dietary_notes: string | null;
  internal_note: string | null;
  rsvp_id: string | null;
  created_at: string;
  updated_at: string;
}

export type GuestInsert = Partial<Guest> &
  Pick<Guest, "invitation_id" | "name">;

export interface WebhookEvent {
  webhook_id: string;
  event_type: string;
  payment_id: string | null;
  invitation_id: string | null;
  received_at: string;
  raw_payload: unknown;
}

/** Days each tier stays live after payment. Flat-pricing model (Faz 20)
 *  ships everything as `standard` for 365 days. Legacy keys retained
 *  so old paid rows still type-check. */
export const TIER_DAYS: Record<TierSlug, number> = {
  standard: 365, // 12 months — every NUVE invitation
  sade: 180,
  klasik: 365,
  premium: 730,
};
