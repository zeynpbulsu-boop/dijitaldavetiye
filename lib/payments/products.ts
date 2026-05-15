/**
 * Pricing → Dodo Payments product ID resolution.
 *
 * NUVE pricing model (Faz 20): one flat price per invitation,
 * regardless of which template the couple picks. EUR 39.99
 * everywhere — we charge in euros and let Dodo handle FX for
 * the buyer's locale. Behind the scenes that maps to a single
 * Dodo product (DODO_PRODUCT_NUVE).
 *
 * The legacy "tier" terminology survives in DB columns and a
 * couple of types — every invitation is now `tier = 'standard'`.
 */

export type TierSlug = "standard";

export type Tier = {
  slug: TierSlug;
  /** Human-readable display name. */
  name: string;
  /** Display amount in EUR (decimal). Dashboard product is the source of truth. */
  displayPriceEur: number;
  /** ISO-4217 currency code charged at Dodo. */
  currency: "EUR";
  /** Resolved at runtime from env var. */
  productId: string;
};

/** Only one tier exists going forward. */
export const STANDARD_TIER: TierSlug = "standard";

const PRODUCT_ID_ENV: Record<TierSlug, string> = {
  standard: "DODO_PRODUCT_NUVE",
};

const DISPLAY: Record<TierSlug, Pick<Tier, "name" | "displayPriceEur" | "currency">> = {
  standard: { name: "NUVE", displayPriceEur: 39.99, currency: "EUR" },
};

export function isTierSlug(value: unknown): value is TierSlug {
  return value === "standard";
}

/**
 * Resolves a tier slug to a full Tier with productId populated from env.
 * Throws if the env var isn't set — better than silently creating a
 * checkout session with an empty product ID.
 */
export function tierFor(slug: TierSlug = STANDARD_TIER): Tier {
  const envKey = PRODUCT_ID_ENV[slug];
  const productId = process.env[envKey];
  if (!productId) {
    throw new Error(
      `${envKey} is not set. Create one Dodo product (NUVE Davetiye, €39.99) and paste its ID into your Coolify env.`,
    );
  }
  return {
    slug,
    productId,
    ...DISPLAY[slug],
  };
}

/** Backwards-compatible default — every checkout uses the same tier. */
export const standardTier = () => tierFor(STANDARD_TIER);

/** Legacy callers expecting a list. */
export const allTiers = () => [standardTier()];
