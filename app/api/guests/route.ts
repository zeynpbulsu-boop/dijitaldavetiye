/**
 * /api/guests — davetli listesi CRUD (FAZ rakip-1).
 *
 * Erişim: `?token=<admin_token>` query param. /admin ve /editor ile
 * aynı access pattern; service-role client kullanıyoruz çünkü
 * RLS politikası bu tabloya 'deny all' modunda (token URL'in kendisi
 * authorizasyon).
 *
 * Method matrix:
 *   GET  /api/guests?token=...     → davetli listesi + stats
 *   POST /api/guests?token=...     → tek davetli ekle (body: GuestInsert)
 *
 * Tek satır mutasyonları /api/guests/[id]'de.
 */

import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { Guest, GuestStatus } from "@/lib/db/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES: GuestStatus[] = [
  "invited",
  "confirmed",
  "declined",
  "maybe",
];

async function resolveInvitationByToken(token: string): Promise<{
  id: string;
} | null> {
  if (!token) return null;
  const supabase = adminDb();
  const { data, error } = await supabase
    .from("invitations")
    .select("id")
    .eq("admin_token", token)
    .single<{ id: string }>();
  if (error || !data) return null;
  return data;
}

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const inv = await resolveInvitationByToken(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = adminDb();
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("invitation_id", inv.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[guests GET]", error);
    return NextResponse.json({ error: "Failed to load." }, { status: 500 });
  }

  const guests = (data ?? []) as Guest[];
  const stats = {
    total: guests.length,
    invited: 0,
    confirmed: 0,
    declined: 0,
    maybe: 0,
    plus_ones: 0,
  };
  for (const g of guests) {
    stats[g.status]++;
    if (g.plus_one) stats.plus_ones++;
  }

  return NextResponse.json({ guests, stats });
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const inv = await resolveInvitationByToken(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = trimOrNull(body.name);
  if (!name) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  const statusInput = typeof body.status === "string" ? body.status : "invited";
  const status: GuestStatus = (ALLOWED_STATUSES as string[]).includes(statusInput)
    ? (statusInput as GuestStatus)
    : "invited";

  const supabase = adminDb();
  const { data, error } = await supabase
    .from("guests")
    .insert({
      invitation_id: inv.id,
      name,
      email: trimOrNull(body.email),
      phone: trimOrNull(body.phone),
      status,
      plus_one: Boolean(body.plus_one),
      plus_one_name: trimOrNull(body.plus_one_name),
      dietary_notes: trimOrNull(body.dietary_notes),
      internal_note: trimOrNull(body.internal_note),
    })
    .select("*")
    .single<Guest>();

  if (error || !data) {
    console.error("[guests POST]", error);
    return NextResponse.json(
      { error: error?.message ?? "Insert failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ guest: data }, { status: 201 });
}
