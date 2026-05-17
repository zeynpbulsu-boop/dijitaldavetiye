import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { RsvpAttendance } from "@/lib/db/types";
import {
  sendEmail,
  rsvpReceivedEmail,
  guestRsvpConfirmationEmail,
} from "@/lib/email/send";

/**
 * POST /api/rsvp
 *
 * Records a guest's RSVP for a LIVE invitation. Body:
 *   {
 *     invitation_slug: "elif-ve-mert-abc123",
 *     guest_name: "Berke",
 *     attendance: "yes" | "no" | "maybe",
 *     guest_email?, plus_one?, plus_one_name?,
 *     menu_choice?, allergies?, note?
 *   }
 *
 * Validates that the target invitation exists and is in 'live' status
 * before inserting. Returns the created row id.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ATTEND: RsvpAttendance[] = ["yes", "no", "maybe"];

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const slug = String(body.invitation_slug ?? "").trim();
  const guestName = String(body.guest_name ?? "").trim();
  const attendance = body.attendance as RsvpAttendance;

  if (!slug) {
    return NextResponse.json(
      { error: "invitation_slug is required." },
      { status: 400 },
    );
  }
  if (!guestName) {
    return NextResponse.json(
      { error: "guest_name is required." },
      { status: 400 },
    );
  }
  if (!ATTEND.includes(attendance)) {
    return NextResponse.json(
      { error: "attendance must be yes / no / maybe." },
      { status: 400 },
    );
  }

  const supabase = adminDb();

  // 1 — Verify the invitation exists and is live
  const { data: inv, error: invErr } = await supabase
    .from("invitations")
    .select(
      "id, status, owner_email, admin_token, partner_one_name, partner_two_name, wedding_date, venue_name, venue_city",
    )
    .eq("slug", slug)
    .single();
  if (invErr || !inv) {
    return NextResponse.json(
      { error: "Invitation not found." },
      { status: 404 },
    );
  }
  if (inv.status !== "live") {
    return NextResponse.json(
      { error: "This invitation is not accepting RSVPs." },
      { status: 403 },
    );
  }

  // 2 — Insert RSVP
  const { data, error: insErr } = await supabase
    .from("rsvps")
    .insert({
      invitation_id: inv.id,
      guest_name: guestName,
      guest_email: stringOrNull(body.guest_email),
      attendance,
      plus_one: Boolean(body.plus_one),
      plus_one_name: stringOrNull(body.plus_one_name),
      menu_choice: stringOrNull(body.menu_choice),
      allergies: stringOrNull(body.allergies),
      note: stringOrNull(body.note),
    })
    .select("id")
    .single();

  if (insErr || !data) {
    console.error("[rsvp POST]", insErr);
    return NextResponse.json(
      { error: "Failed to record RSVP." },
      { status: 500 },
    );
  }

  // Fire-and-forget e-postaları — RESEND_API_KEY yoksa graceful no-op.
  // RSVP zaten kaydedildi; Resend yavaş olsa bile misafir teşekkür
  // ekranını anında görüyor.
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.app"
  ).replace(/\/+$/, "");

  if (inv.owner_email) {
    sendEmail(
      rsvpReceivedEmail({
        to: inv.owner_email,
        guestName: guestName,
        attendance,
        adminUrl: `${base}/admin/${encodeURIComponent(inv.admin_token)}`,
      }),
    ).catch((err) => console.warn("[rsvp] owner email error:", err));
  }

  // FAZ C.6 — misafire onay e-postası, e-posta verildiyse
  const guestEmail = stringOrNull(body.guest_email);
  if (guestEmail) {
    const coupleLine =
      inv.partner_one_name && inv.partner_two_name
        ? `${inv.partner_one_name} & ${inv.partner_two_name}`
        : "Düğün";
    const venueLine = [inv.venue_name, inv.venue_city]
      .filter(Boolean)
      .join(" · ") || null;
    sendEmail(
      guestRsvpConfirmationEmail({
        to: guestEmail,
        guestName,
        attendance,
        coupleLine,
        weddingDate: inv.wedding_date,
        venue: venueLine,
        publicUrl: `${base}/i/${slug}`,
      }),
    ).catch((err) => console.warn("[rsvp] guest email error:", err));
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

function stringOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}
