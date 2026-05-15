import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import { isTierSlug } from "@/lib/payments/products";
import type { InvitationInsert, DbLocale } from "@/lib/db/types";

/**
 * POST /api/invitations
 *
 * Creates a draft invitation. Body (all optional except template_slug + tier):
 *   {
 *     template_slug: "blush-reverie",
 *     tier: "klasik",
 *     partner_one_name?, partner_two_name?, wedding_date? (YYYY-MM-DD),
 *     venue_name?, venue_city?, venue_address?,
 *     story_text?, music_url?, music_track_id?, monogram_initials?,
 *     locale? ("tr"|"en"|"sr"),
 *     owner_email?, owner_phone?
 *   }
 *
 * Response: { id, slug, admin_token } — the admin_token gates write
 * access via PATCH /api/invitations/[slug]. Save it client-side.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCALES: DbLocale[] = ["tr", "en", "sr"];

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function randomSlug(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const templateSlug = String(body.template_slug ?? "");
  const tier = String(body.tier ?? "");
  if (!templateSlug) {
    return NextResponse.json(
      { error: "template_slug is required." },
      { status: 400 },
    );
  }
  if (!isTierSlug(tier)) {
    return NextResponse.json(
      { error: "tier must be one of: sade, klasik, premium." },
      { status: 400 },
    );
  }

  // Build a stable-ish slug — couple names if provided, else random
  const p1 = String(body.partner_one_name ?? "").trim();
  const p2 = String(body.partner_two_name ?? "").trim();
  const slugBase =
    p1 && p2 ? slugify(`${p1}-ve-${p2}`) : slugify(templateSlug);
  // Append random suffix so two couples with the same names don't collide
  const slug = `${slugBase}-${randomSlug()}`;

  const locale = LOCALES.includes(body.locale as DbLocale)
    ? (body.locale as DbLocale)
    : "tr";

  const insert: InvitationInsert = {
    slug,
    template_slug: templateSlug,
    tier,
    status: "draft",
    locale,
    partner_one_name: stringOrNull(body.partner_one_name),
    partner_two_name: stringOrNull(body.partner_two_name),
    wedding_date: stringOrNull(body.wedding_date),
    venue_name: stringOrNull(body.venue_name),
    venue_city: stringOrNull(body.venue_city),
    venue_address: stringOrNull(body.venue_address),
    story_text: stringOrNull(body.story_text),
    music_url: stringOrNull(body.music_url),
    music_track_id: stringOrNull(body.music_track_id),
    monogram_initials: stringOrNull(body.monogram_initials),
    owner_email: stringOrNull(body.owner_email),
    owner_phone: stringOrNull(body.owner_phone),
  };

  const { data, error } = await adminDb()
    .from("invitations")
    .insert(insert)
    .select("id, slug, admin_token")
    .single();

  if (error || !data) {
    console.error("[invitations POST]", error);
    return NextResponse.json(
      { error: "Failed to create invitation." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { id: data.id, slug: data.slug, admin_token: data.admin_token },
    { status: 201 },
  );
}

function stringOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}
