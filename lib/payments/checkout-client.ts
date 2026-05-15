/**
 * Client-side helper that asks our /api/checkout route to mint a Dodo
 * Checkout Session and then redirects the browser to the hosted URL.
 *
 * Pricing is now flat €39.99 per invitation — no tier parameter needed.
 * The tier field is kept as an optional argument for back-compat with
 * older call sites; if omitted, the server defaults to the standard tier.
 *
 *   import { startCheckout } from "@/lib/payments/checkout-client";
 *   <button onClick={() => startCheckout({ invitationId })}>Öde</button>
 */
import type { TierSlug } from "./products";

type StartCheckoutArgs = {
  /** Optional; defaults to "standard" on the server. */
  tier?: TierSlug;
  email?: string;
  name?: string;
  invitationId?: string;
};

export async function startCheckout(args: StartCheckoutArgs): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const j = (await res.json()) as { error?: string };
      detail = j.error ?? "";
    } catch {
      /* swallow */
    }
    throw new Error(
      `Checkout başlatılamadı (${res.status}). ${detail}`,
    );
  }

  const { checkout_url } = (await res.json()) as { checkout_url: string };
  if (!checkout_url) {
    throw new Error("Sunucu checkout URL döndürmedi.");
  }

  window.location.href = checkout_url;
}
