/**
 * GET /api/guests/export?token=<admin_token> → text/csv
 *
 * Davetli listesinin Excel-dostu dökümü (UTF-8 BOM + CRLF) — Migration
 * 004'ün vaadi olan "CSV export" tamamlanıyor. Erişim modeli /api/guests
 * ile aynı: admin_token query param'ı yetkilendirir (RLS deny-all,
 * service-role client).
 */

import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GuestRow = {
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  plus_one: boolean;
  plus_one_name: string | null;
  dietary_notes: string | null;
  internal_note: string | null;
  created_at: string;
};

/* Excel formül enjeksiyonu + ayraç/tırnak kaçışı — rsvps/export ile aynı kural */
function csvCell(value: string | number | boolean): string {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) {
    s = `'${s}`;
  }
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")?.trim() ?? "";
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 401 });
  }

  const supabase = adminDb();
  const { data: inv, error: invErr } = await supabase
    .from("invitations")
    .select("id, partner_one_name, partner_two_name")
    .eq("admin_token", token)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data: guests, error: gErr } = await supabase
    .from("guests")
    .select(
      "name, email, phone, status, plus_one, plus_one_name, dietary_notes, internal_note, created_at",
    )
    .eq("invitation_id", inv.id)
    .order("created_at", { ascending: true });

  if (gErr) {
    console.error("[guests/export]", gErr);
    return NextResponse.json({ error: "Failed to load guests." }, { status: 500 });
  }

  const rows: GuestRow[] = (guests ?? []) as GuestRow[];

  const headers = [
    "Name",
    "Email",
    "Phone",
    "Status",
    "Plus one",
    "Plus-one name",
    "Dietary notes",
    "Internal note",
    "Added at",
  ];
  const lines = [headers.map(csvCell).join(",")];
  for (const g of rows) {
    lines.push(
      [
        g.name,
        g.email ?? "",
        g.phone ?? "",
        g.status,
        g.plus_one ? "yes" : "no",
        g.plus_one_name ?? "",
        g.dietary_notes ?? "",
        g.internal_note ?? "",
        g.created_at,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const body = "﻿" + lines.join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  const couple = [inv.partner_one_name, inv.partner_two_name]
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "")
    .slice(0, 40);
  const filename = `davetliler-${couple || "nuve"}-${stamp}.csv`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
