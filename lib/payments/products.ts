/**
 * Pricing tier → Dodo Payments product ID resolution.
 *
 * Products are created once in the Dodo dashboard (Sentra) and their
 * IDs pasted into env vars. This module exposes a typed lookup so the
 * checkout route can map a `?tier=klasik` query param to a product ID
 * without hardcoding it anywhere in route code.
 *
 * Display prices below MUST match the products in the dashboard — they
 * are NOT the source of truth, they're just used for confirmation pages
 * and analytics.
 */

export type TierSlug = "sade" | "klasik" | "premium";

export type Tier = {
  slug: TierSlug;
  name: string;
  /** Display amount in TRY (kuruş omitted). Dashboard product is the source of truth. */
  displayPriceTry: number;
  /** Resolved at runtime from env var. */
  productId: string;
};

const PRODUCT_ID_ENV: Record<TierSlug, string> = {
  sade: "DODO_PRODUCT_SADE",
  klasik: "DODO_PRODUCT_KLASIK",
  premium: "DODO_PRODUCT_PREMIUM",
};

const DISPLAY: Record<TierSlug, Pick<Tier, "name" | "displayPriceTry">> = {
  sade: { name: "Sade", displayPriceTry: 2999 },
  klasik: { name: "Klasik", displayPriceTry: 4999 },
  premium: { name: "Premium", displayPriceTry: 6299 },
};

const TIER_SLUGS: TierSlug[] = ["sade", "klasik", "premium"];

export function isTierSlug(value: unknown): value is TierSlug {
  return typeof value === "string" && TIER_SLUGS.includes(value as TierSlug);
}

/**
 * Resolves a tier slug to a full Tier with productId populated from env.
 * Throws if the env var isn't set — better than silently creating a
 * checkout session with an empty product ID.
 */
export function tierFor(slug: TierSlug): Tier {
  const envKey = PRODUCT_ID_ENV[slug];
  const productId = process.env[envKey];
  if (!productId) {
    throw new Error(
      `${envKey} is not set. Create a Dodo product for "${slug}" and paste its ID into your Coolify env.`,
    );
  }
  return {
    slug,
    productId,
    ...DISPLAY[slug],
  };
}

export const allTiers = () => TIER_SLUGS.map(tierFor);
