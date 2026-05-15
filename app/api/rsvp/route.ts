import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { RsvpAttendance } from "@/lib/db/types";
import { sendEmail, rsvpReceivedEmail } from "@/lib/email/send";

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
    .select("id, status, owner_email, admin_token")
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

  // Fire-and-forget owner notification — graceful no-op if no RESEND_API_KEY.
  // We don't await this in a blocking way; if Resend is slow the RSVP
  // already succeeded and the guest gets their thank-you screen.
  if (inv.owner_email) {
    const base = (
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.app"
    ).replace(/\/+$/, "");
    sendEmail(
      rsvpReceivedEmail({
        to: inv.owner_email,
        guestName: guestName,
        attendance,
        adminUrl: `${base}/admin/${encodeURIComponent(inv.admin_token)}`,
      }),
    ).catch((err) => console.warn("[rsvp] email send error:", err));
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

function stringOrNull(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  return trimmed ? trimmed : null;
}
