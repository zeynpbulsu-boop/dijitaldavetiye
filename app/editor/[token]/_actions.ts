"use server";

/**
 * Editor server actions — FAZ A.4.
 *
 * Token-gated mutations for the couple's editor at /editor/[token].
 * Authentication is the same `admin_token` URL pattern used by
 * /admin/[token]: anyone who has the link can write to that single
 * invitation row. No user accounts.
 *
 * RLS note: writes go through the service-role `adminDb()` client so
 * row-level policies don't apply here — the token check IS the policy.
 * Don't expose this action outside a server context.
 */

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/db/supabase";
import type { DbLocale, EventType, Invitation } from "@/lib/db/types";
import { resolveMapsCoords } from "@/lib/maps/resolve-link";

/** Trimmed text → null when empty (so DB nulls fall back to luxe presets). */
function trimOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/** Loose YYYY-MM-DD validator. Returns null on invalid/empty input. */
function isoDateOrNull(v: FormDataEntryValue | null): string | null {
  const s = trimOrNull(v);
  if (!s) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

/** 6-haneli hex color validator. #RRGGBB veya RRGGBB kabul. */
function hexOrNull(v: FormDataEntryValue | null): string | null {
  const s = trimOrNull(v);
  if (!s) return null;
  const m = s.match(/^#?([0-9a-f]{6})$/i);
  return m ? `#${m[1].toLowerCase()}` : null;
}

/** Latitude (-90..90) ya da longitude (-180..180) parse. Hatalı veya
 *  boş giriş için null döner — DB CHECK / Postgres NUMERIC overflow'a
 *  düşmeden önce burada filtreliyoruz. */
function coordOrNull(
  v: FormDataEntryValue | null,
  max: number,
): number | null {
  const s = trimOrNull(v);
  if (!s) return null;
  /* Türkçe ondalık virgülünü da kabul et. */
  const n = parseFloat(s.replace(",", "."));
  if (!Number.isFinite(n)) return null;
  if (n < -max || n > max) return null;
  return n;
}

const ALLOWED_LOCALES: DbLocale[] = ["tr", "en", "sr"];
const ALLOWED_EVENT_TYPES: EventType[] = [
  "wedding",
  "engagement",
  "henna",
  "save_the_date",
  "birthday",
];

function pickEnum<T extends string>(
  value: FormDataEntryValue | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof value !== "string") return fallback;
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export interface SaveResult {
  ok: boolean;
  /** Human-readable Turkish status — surfaced in the form UI. */
  message: string;
  slug?: string;
}

/**
 * Persist the editable subset of an invitation. Whitelisted keys only:
 * we don't accept tier, status, payment fields, or admin_token via
 * this action even if the form submits them.
 */
export async function saveInvitation(
  token: string,
  formData: FormData,
): Promise<SaveResult> {
  if (!token) return { ok: false, message: "Geçersiz erişim." };
  const supabase = adminDb();

  /* Resolve the row by token first so we can return its slug for
     navigation, and so we fail fast on unknown tokens. */
  const { data: existing, error: lookupErr } = await supabase
    .from("invitations")
    .select("id, slug")
    .eq("admin_token", token)
    .single<Pick<Invitation, "id" | "slug">>();

  if (lookupErr || !existing) {
    return { ok: false, message: "Bu davetiye bulunamadı." };
  }

  // Mekan koordinatı: önce yapıştırılan Google Maps linkinden çöz (API key
  // GEREKMEZ); link yoksa/çözülemezse elle girilen lat/lng'ye düş.
  let venueLat = coordOrNull(formData.get("venue_lat"), 90);
  let venueLng = coordOrNull(formData.get("venue_lng"), 180);
  const mapsUrl = trimOrNull(formData.get("venue_maps_url"));
  if (mapsUrl) {
    const coords = await resolveMapsCoords(mapsUrl);
    if (coords) {
      venueLat = coords.lat;
      venueLng = coords.lng;
    }
  }

  const patch: Partial<Invitation> = {
    /* Etkinlik tipi + dil (migration 004 + 001). Enum guard ile
       beklenmeyen değerleri reddediyoruz; CHECK constraint zaten DB
       seviyesinde de koruyor. */
    event_type: pickEnum(
      formData.get("event_type"),
      ALLOWED_EVENT_TYPES,
      "wedding",
    ),
    locale: pickEnum(formData.get("locale"), ALLOWED_LOCALES, "tr"),

    /* Couple + venue + date — already in the schema since 001_init.sql */
    partner_one_name: trimOrNull(formData.get("partner_one_name")),
    partner_two_name: trimOrNull(formData.get("partner_two_name")),
    monogram_initials: trimOrNull(formData.get("monogram_initials")),
    venue_name: trimOrNull(formData.get("venue_name")),
    venue_city: trimOrNull(formData.get("venue_city")),
    venue_address: trimOrNull(formData.get("venue_address")),
    wedding_date: isoDateOrNull(formData.get("wedding_date")),

    /* Luxe copy overrides — added in migration 003.
       DİKKAT: yalnızca formda GERÇEKTEN bulunan alanlar patch'e girer
       (formData.has). Aksi halde formda input'u olmayan kolonlar
       (music_track, hero_cta, envelope_cta) her kayıtta sessizce NULL'a
       ezilir — order formunda doldurulan veri ilk editör kaydında silinirdi. */
    greeting: trimOrNull(formData.get("greeting")),
    hero_eyebrow: trimOrNull(formData.get("hero_eyebrow")),
    footer_note: trimOrNull(formData.get("footer_note")),
    music_url: trimOrNull(formData.get("music_url")),
    ...(formData.has("story_text")
      ? { story_text: trimOrNull(formData.get("story_text")) }
      : {}),
    ...(formData.has("hero_cta") ? { hero_cta: trimOrNull(formData.get("hero_cta")) } : {}),
    ...(formData.has("envelope_cta")
      ? { envelope_cta: trimOrNull(formData.get("envelope_cta")) }
      : {}),
    ...(formData.has("music_track")
      ? { music_track: trimOrNull(formData.get("music_track")) }
      : {}),

    /* Migration 005 — wax seal tint. hero_media_url + photos /api/upload
       üzerinden yönetiliyor, bu form'da yok. */
    wax_seal_color: hexOrNull(formData.get("wax_seal_color")),

    /* Migration 006 — hediye / banka bilgileri. hotels array'i ayrı
       bir API'den yönetilecek (form'a JSONB sokmak iyi UX değil). */
    gift_iban: trimOrNull(formData.get("gift_iban")),
    gift_bank: trimOrNull(formData.get("gift_bank")),
    gift_account_holder: trimOrNull(formData.get("gift_account_holder")),
    gift_note: trimOrNull(formData.get("gift_note")),

    /* Migration 007 — venue coords (B.3 map embed). Geçersiz veya
       aralık dışı değer → null (harita gizlenir). */
    venue_lat: venueLat,
    venue_lng: venueLng,

    /* Migration 008 — scratch reveal opt-in. */
    /* enable_scratch_reveal patch'ten çıkarıldı — formdaki toggle kaldırıldı
       (themes-v2 tüketmiyor); mevcut DB değeri olduğu gibi korunur. */
  };

  const { error: updateErr } = await supabase
    .from("invitations")
    .update(patch)
    .eq("id", existing.id);

  if (updateErr) {
    return {
      ok: false,
      message: `Kaydedilemedi: ${updateErr.message}`,
    };
  }

  /* Bust the live invitation page so the next visit shows fresh copy. */
  revalidatePath(`/i/${existing.slug}`);

  return {
    ok: true,
    message: "Değişiklikler kaydedildi.",
    slug: existing.slug,
  };
}
