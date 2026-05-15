import { NextResponse, type NextRequest } from "next/server";
import { dodo } from "@/lib/dodo";
import { isTierSlug, tierFor } from "@/lib/payments/products";

/**
 * POST /api/checkout
 *
 * Creates a Dodo Payments hosted Checkout Session for the requested tier
 * and responds with the `checkout_url` for the client to redirect to.
 *
 * Body:
 *   { tier: "sade" | "klasik" | "premium",
 *     email?: string,
 *     name?: string,
 *     invitationId?: string }
 *
 * The optional `invitationId` is round-tripped through Dodo's `metadata`
 * field so the webhook handler can mark the right invitation as paid
 * later. Anything you put in metadata comes back unchanged on every
 * payment.* event for this session.
 */

// Force Node.js runtime so the SDK works (it depends on `crypto` etc.).
export const runtime = "nodejs";
// Don't statically optimise — this route must always run server-side.
export const dynamic = "force-dynamic";

type CheckoutBody = {
  tier?: string;
  email?: string;
  name?: string;
  invitationId?: string;
};

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://nuve.app"
  ).replace(/\/+$/, "");
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isTierSlug(body.tier)) {
    return NextResponse.json(
      { error: "tier must be one of: sade, klasik, premium." },
      { status: 400 },
    );
  }

  let tier;
  try {
    tier = tierFor(body.tier);
  } catch (err) {
    // Env var missing → operator-side config error, not a client error.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Tier configuration error." },
      { status: 500 },
    );
  }

  // Build customer object only if we got an email — otherwise Dodo will
  // collect one on the hosted checkout page.
  const customer =
    body.email && body.email.includes("@")
      ? { email: body.email, name: body.name ?? null }
      : null;

  try {
    const session = await dodo().checkoutSessions.create({
      product_cart: [{ product_id: tier.productId, quantity: 1 }],
      customer,
      return_url: `${siteUrl()}/checkout/success?tier=${tier.slug}`,
      cancel_url: `${siteUrl()}/checkout/cancel?tier=${tier.slug}`,
      metadata: {
        tier: tier.slug,
        // invitationId is optional — only present when user is checking out
        // for a draft invitation they've already created.
        invitation_id: body.invitationId ?? "",
        // Useful for analytics — what we showed them on the pricing page.
        display_price_try: String(tier.displayPriceTry),
      },
    });

    return NextResponse.json({
      checkout_url: session.checkout_url,
      session_id: session.session_id,
    });
  } catch (err) {
    console.error("[checkout] Dodo error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to create checkout session.",
      },
      { status: 502 },
    );
  }
}
