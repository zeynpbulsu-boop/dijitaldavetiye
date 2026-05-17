/**
 * /api/hotels?token=<admin_token>
 *
 * Otel önerisi CRUD. invitations.hotels JSONB array'i tek satırda
 * read-modify-write ile güncelliyoruz çünkü liste tipik olarak 3-5
 * eleman; tablo açıp ayrı kayıt yapmak overkill. token-gated.
 *
 *   POST   /api/hotels?token=...  body: HotelItem → append
 *   DELETE /api/hotels?token=...&index=N        → splice
 */

import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { HotelItem } from "@/lib/db/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveInvitation(token: string) {
  if (!token) return null;
  const supabase = adminDb();
  const { data } = await supabase
    .from("invitations")
    .select("id, hotels")
    .eq("admin_token", token)
    .single<{ id: string; hotels: HotelItem[] }>();
  return data;
}

function trimOrUndef(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const inv = await resolveInvitation(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = trimOrUndef(body.name);
  if (!name) {
    return NextResponse.json({ error: "name required." }, { status: 400 });
  }

  const next: HotelItem[] = [
    ...(Array.isArray(inv.hotels) ? inv.hotels : []),
    {
      name,
      address: trimOrUndef(body.address),
      price: trimOrUndef(body.price),
      url: trimOrUndef(body.url),
      note: trimOrUndef(body.note),
    },
  ];

  const supabase = adminDb();
  const { error } = await supabase
    .from("invitations")
    .update({ hotels: next })
    .eq("id", inv.id);
  if (error) {
    console.error("[hotels POST]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ hotels: next }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const indexStr = req.nextUrl.searchParams.get("index") ?? "";
  const inv = await resolveInvitation(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const index = parseInt(indexStr, 10);
  if (!Number.isFinite(index) || index < 0) {
    return NextResponse.json({ error: "Invalid index." }, { status: 400 });
  }
  const existing = Array.isArray(inv.hotels) ? inv.hotels : [];
  if (index >= existing.length) {
    return NextResponse.json({ error: "Index out of range." }, { status: 400 });
  }
  const next = existing.filter((_, i) => i !== index);

  const supabase = adminDb();
  const { error } = await supabase
    .from("invitations")
    .update({ hotels: next })
    .eq("id", inv.id);
  if (error) {
    console.error("[hotels DELETE]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ hotels: next });
}
