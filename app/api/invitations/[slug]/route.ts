import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";

/**
 * GET /api/invitations/[slug]
 *
 * Returns the invitation row by slug.
 *   - If status is "live", anyone can read (admin_token redacted).
 *   - Otherwise, the caller must pass ?token=<admin_token> in the query.
 *
 * PATCH /api/invitations/[slug]
 *
 * Updates editable fields. Requires Authorization: Bearer <admin_token>
 * OR ?token=<admin_token>. Only "draft" / "paid" / "live" invitations
 * are editable — archived / refunded refuse with 403.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EDITABLE_FIELDS = [
  "partner_one_name",
  "partner_two_name",
  "wedding_date",
  "venue_name",
  "venue_city",
  "venue_address",
  "story_text",
  "music_url",
  "music_track_id",
  "monogram_initials",
  "owner_email",
  "owner_phone",
  "locale",
  "tier",
] as const;

function readToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7).trim() || null;
  const url = new URL(req.url);
  return url.searchParams.get("token");
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const supabase = adminDb();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", params.slug)
    .single<Invitation>();

  if (error || !data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Public read only for live
  if (data.status !== "live") {
    const token = readToken(req);
    if (!token || token !== data.admin_token) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
  }

  // Redact admin_token from public responses
  const publicView = data.status === "live" ? redact(data) : data;
  return NextResponse.json(publicView);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const token = readToken(req);
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const supabase = adminDb();
  const { data: existing, error: fetchErr } = await supabase
    .from("invitations")
    .select("id, status, admin_token")
    .eq("slug", params.slug)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (existing.admin_token !== token) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  if (existing.status === "archived" || existing.status === "refunded") {
    return NextResponse.json(
      { error: "This invitation is closed and cannot be edited." },
      { status: 403 },
    );
  }

  // Whitelist: only known fields, no status/payment fields from client
  const update: Record<string, unknown> = {};
  for (const k of EDITABLE_FIELDS) {
    if (k in body) update[k] = body[k];
  }

  const { data, error: updErr } = await supabase
    .from("invitations")
    .update(update)
    .eq("id", existing.id)
    .select("*")
    .single<Invitation>();

  if (updErr || !data) {
    console.error("[invitations PATCH]", updErr);
    return NextResponse.json(
      { error: "Failed to update invitation." },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}

function redact(inv: Invitation): Omit<Invitation, "admin_token"> & {
  admin_token?: undefined;
} {
  const { admin_token: _omit, ...rest } = inv;
  return rest;
}
