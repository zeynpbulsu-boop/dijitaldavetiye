/**
 * /api/guests/[id] — tek davetli üzerinde PATCH / DELETE.
 *
 * Aynı token gating: token şu davetiyeye aitse, davetli de aynı
 * invitation_id'ye bağlıysa işlem yapılır. İki seviyeli kontrol
 * sayesinde başka davetiyenin davetli ID'sini elinde bulunduran biri
 * kendi davetiyesinin token'ı ile o satırı düzenleyemez.
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

async function resolveInvitationByToken(token: string) {
  if (!token) return null;
  const supabase = adminDb();
  const { data } = await supabase
    .from("invitations")
    .select("id")
    .eq("admin_token", token)
    .single<{ id: string }>();
  return data;
}

function trimOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

async function loadOwnedGuest(
  id: string,
  invitationId: string,
): Promise<Guest | null> {
  const supabase = adminDb();
  const { data } = await supabase
    .from("guests")
    .select("*")
    .eq("id", id)
    .eq("invitation_id", invitationId)
    .single<Guest>();
  return data;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const inv = await resolveInvitationByToken(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const existing = await loadOwnedGuest(params.id, inv.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const patch: Partial<Guest> = {};
  if ("name" in body) {
    const name = trimOrNull(body.name);
    if (!name) {
      return NextResponse.json(
        { error: "name cannot be empty." },
        { status: 400 },
      );
    }
    patch.name = name;
  }
  if ("email" in body) patch.email = trimOrNull(body.email);
  if ("phone" in body) patch.phone = trimOrNull(body.phone);
  if ("plus_one" in body) patch.plus_one = Boolean(body.plus_one);
  if ("plus_one_name" in body)
    patch.plus_one_name = trimOrNull(body.plus_one_name);
  if ("dietary_notes" in body)
    patch.dietary_notes = trimOrNull(body.dietary_notes);
  if ("internal_note" in body)
    patch.internal_note = trimOrNull(body.internal_note);
  if ("status" in body) {
    const s = String(body.status);
    if (!(ALLOWED_STATUSES as string[]).includes(s)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 },
      );
    }
    patch.status = s as GuestStatus;
  }

  const supabase = adminDb();
  const { data, error } = await supabase
    .from("guests")
    .update(patch)
    .eq("id", params.id)
    .select("*")
    .single<Guest>();

  if (error || !data) {
    console.error("[guests PATCH]", error);
    return NextResponse.json(
      { error: error?.message ?? "Update failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ guest: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const inv = await resolveInvitationByToken(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const existing = await loadOwnedGuest(params.id, inv.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const supabase = adminDb();
  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("id", params.id);

  if (error) {
    console.error("[guests DELETE]", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
