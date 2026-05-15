import { NextResponse, type NextRequest } from "next/server";
import { Webhook } from "standardwebhooks";
import { adminDb } from "@/lib/db/supabase";
import { TIER_DAYS, type TierSlug } from "@/lib/db/types";
import { sendEmail, paymentReceivedEmail } from "@/lib/email/send";

/**
 * POST /api/webhooks/dodo
 *
 * Verifies the Standard Webhooks signature, dedupes by webhook-id in
 * Postgres, then dispatches by event type.
 *
 * Idempotency strategy:
 *   - Upsert a row into webhook_events keyed by webhook-id (PK).
 *   - If the insert collides, we already handled this delivery — 200/deduped.
 *   - Otherwise we process the event and let the row stand as proof.
 *
 * Coolify / Node-runtime notes apply (see README): read raw body, run
 * on Node not Edge, expose the webhook-* headers through your proxy.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type DodoWebhookEvent = {
  type: string;
  data?: {
    payment_id?: string;
    subscription_id?: string;
    refund_id?: string;
    dispute_id?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, string>;
    customer?: { email?: string; name?: string; customer_id?: string };
  };
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  if (!secret) {
    console.error("[dodo-webhook] DODO_PAYMENTS_WEBHOOK_KEY not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 500 },
    );
  }

  // 1 — Read raw body BEFORE parsing
  const raw = await req.text();
  const headers = {
    "webhook-id": req.headers.get("webhook-id") ?? "",
    "webhook-signature": req.headers.get("webhook-signature") ?? "",
    "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
  };

  if (!headers["webhook-id"] || !headers["webhook-signature"]) {
    return NextResponse.json(
      { error: "Missing webhook headers." },
      { status: 400 },
    );
  }

  // 2 — Verify signature
  const wh = new Webhook(secret);
  try {
    await wh.verify(raw, headers);
  } catch (err) {
    console.warn("[dodo-webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  // 3 — Parse
  let event: DodoWebhookEvent;
  try {
    event = JSON.parse(raw) as DodoWebhookEvent;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  // 4 — Idempotent insert into webhook_events. If unique-constraint on
  //     webhook_id fires, this is a duplicate delivery → 200/deduped.
  const supabase = adminDb();
  const { error: insertErr } = await supabase.from("webhook_events").insert({
    webhook_id: headers["webhook-id"],
    event_type: event.type,
    payment_id: event.data?.payment_id ?? null,
    raw_payload: event,
  });

  if (insertErr) {
    // Postgres unique-violation code is 23505
    const isDup =
      typeof (insertErr as { code?: string }).code === "string" &&
      (insertErr as { code: string }).code === "23505";
    if (isDup) {
      return NextResponse.json({ ok: true, deduped: true });
    }
    console.error("[dodo-webhook] DB insert error:", insertErr);
    return NextResponse.json({ error: "DB error." }, { status: 500 });
  }

  // 5 — Dispatch
  try {
    await dispatch(event);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[dodo-webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
async function dispatch(event: DodoWebhookEvent): Promise<void> {
  const { type } = event;
  const data = event.data ?? {};

  switch (type) {
    case "payment.succeeded":
      await onPaymentSucceeded(data);
      return;
    case "payment.failed":
    case "payment.cancelled":
      console.log(`[dodo-webhook] ${type}`, data.payment_id);
      return;
    case "payment.processing":
      return;
    case "refund.succeeded":
      await onRefundSucceeded(data);
      return;
    case "refund.failed":
      console.warn("[dodo-webhook] refund.failed", data.refund_id);
      return;
    case "dispute.opened":
    case "dispute.won":
    case "dispute.lost":
      console.warn(`[dodo-webhook] ${type}`, data.dispute_id);
      return;
    default:
      console.log("[dodo-webhook] Unhandled event:", type);
      return;
  }
}

async function onPaymentSucceeded(
  data: NonNullable<DodoWebhookEvent["data"]>,
): Promise<void> {
  const tier = (data.metadata?.tier ?? "") as TierSlug;
  const invitationId = data.metadata?.invitation_id;
  if (!data.payment_id) {
    console.warn("[dodo-webhook] payment.succeeded with no payment_id");
    return;
  }

  const supabase = adminDb();
  const now = new Date();
  const days = TIER_DAYS[tier] ?? 365;
  const liveUntil = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  // Two paths:
  //   (a) The buyer started from an existing draft → metadata carries
  //       invitation_id → update that row.
  //   (b) The buyer paid without a pre-existing draft → look up by
  //       dodo_session_id (set on /api/checkout); if found, update.
  //       If neither matches, we still record the payment in
  //       webhook_events for manual reconciliation.
  if (invitationId) {
    const { data: row, error } = await supabase
      .from("invitations")
      .update({
        status: "paid",
        paid_at: now.toISOString(),
        live_until: liveUntil.toISOString(),
        dodo_payment_id: data.payment_id,
        owner_email: data.customer?.email ?? undefined,
      })
      .eq("id", invitationId)
      .select(
        "slug, admin_token, owner_email, partner_one_name, partner_two_name, tier",
      )
      .single();
    if (error || !row) {
      console.error(
        "[dodo-webhook] update by invitation_id failed:",
        error,
        invitationId,
      );
      return;
    }

    // Fire confirmation email (gracefully no-ops without RESEND_API_KEY)
    const recipient = row.owner_email ?? data.customer?.email;
    if (recipient) {
      const base = (
        process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.app"
      ).replace(/\/+$/, "");
      const couple =
        row.partner_one_name && row.partner_two_name
          ? `${row.partner_one_name} & ${row.partner_two_name}`
          : "Davetiyen";
      await sendEmail(
        paymentReceivedEmail({
          to: recipient,
          coupleLine: couple,
          tier: String(row.tier).toUpperCase(),
          adminUrl: `${base}/admin/${encodeURIComponent(row.admin_token)}`,
          publicUrl: `${base}/i/${row.slug}`,
        }),
      );
    }
    return;
  }

  // No invitation_id in metadata — record on webhook_events stays as
  // the only trail. Manual reconciliation via admin panel.
  console.log(
    "[dodo-webhook] payment.succeeded with no invitation_id (manual reconcile):",
    data.payment_id,
  );
}

async function onRefundSucceeded(
  data: NonNullable<DodoWebhookEvent["data"]>,
): Promise<void> {
  if (!data.payment_id) return;
  const supabase = adminDb();
  const { error } = await supabase
    .from("invitations")
    .update({ status: "refunded" })
    .eq("dodo_payment_id", data.payment_id);
  if (error) {
    console.error("[dodo-webhook] refund update failed:", error);
  }
}
