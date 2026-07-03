import { type NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/db/supabase";

/**
 * GET /api/invitations/[slug]/rsvps/export?token=ADMIN_TOKEN
 *
 * Returns the RSVP list as a CSV file. Owner-only.
 *
 * The day before the wedding, this is what the couple downloads for
 * their seating-plan spreadsheet. UTF-8 with BOM so Excel on Windows
 * opens it with correct Turkish/Serbian characters.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpRow = {
  guest_name: string;
  guest_email: string | null;
  attendance: string;
  side: string | null;
  guest_count: number | null;
  plus_one: boolean;
  plus_one_name: string | null;
  menu_choice: string | null;
  allergies: string | null;
  note: string | null;
  created_at: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const url = new URL(req.url);
  const token =
    req.headers.get("authorization")?.replace(/^Bearer\s+/, "").trim() ||
    url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 401 });
  }

  const supabase = adminDb();
  const { data: inv, error: invErr } = await supabase
    .from("invitations")
    .select("id, admin_token, partner_one_name, partner_two_name")
    .eq("slug", params.slug)
    .single();

  if (invErr || !inv) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  if (inv.admin_token !== token) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data: rsvps, error: rErr } = await supabase
    .from("rsvps")
    .select(
      "guest_name, guest_email, attendance, side, guest_count, plus_one, plus_one_name, menu_choice, allergies, note, created_at",
    )
    .eq("invitation_id", inv.id)
    .order("created_at", { ascending: true });

  if (rErr) {
    console.error("[rsvps/export]", rErr);
    return NextResponse.json({ error: "Failed to load RSVPs." }, { status: 500 });
  }

  const rows: RsvpRow[] = (rsvps ?? []) as RsvpRow[];

  // Build CSV — UTF-8 BOM + CRLF (Excel-friendly)
  const headers = [
    "Guest name",
    "Email",
    "Attendance",
    "Side",
    "Guest count",
    "Plus one",
    "Plus-one name",
    "Menu",
    "Allergies",
    "Note",
    "Submitted at",
  ];
  const lines = [headers.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.guest_name,
        r.guest_email ?? "",
        r.attendance,
        r.side ?? "",
        r.guest_count != null ? String(r.guest_count) : "",
        r.plus_one ? "yes" : "no",
        r.plus_one_name ?? "",
        r.menu_choice ?? "",
        r.allergies ?? "",
        r.note ?? "",
        r.created_at,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  const body = "﻿" + lines.join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  const filename =
    [inv.partner_one_name, inv.partner_two_name]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") || params.slug;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nuve-rsvps-${filename}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

/**
 * RFC 4180-safe quoting + CSV formül enjeksiyonu koruması.
 *
 * Misafir adı/notu `= + - @ \t \r` ile başlıyorsa Excel/Sheets bunu formül
 * olarak çalıştırır (örn. =HYPERLINK(...), @SUM(...)). Bu tür hücrelerin
 * başına tek tırnak eklenerek metin olarak kalması sağlanır.
 */
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
