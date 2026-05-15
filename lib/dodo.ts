import DodoPayments from "dodopayments";

/**
 * Singleton Dodo Payments SDK client.
 *
 * Uses Bearer-token auth. Pulls credentials from environment:
 *   - DODO_PAYMENTS_API_KEY        (required)
 *   - DODO_PAYMENTS_ENVIRONMENT    (optional, default "test_mode")
 *
 * Why a singleton: each `new DodoPayments(...)` opens its own connection
 * pool. In a long-running Coolify container we want one pool shared
 * across all route handlers, not one per request.
 */
let _client: DodoPayments | null = null;

export function dodo(): DodoPayments {
  if (_client) return _client;

  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DODO_PAYMENTS_API_KEY is not set. Add it to your Coolify env vars.",
    );
  }

  const envName = process.env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode";
  if (envName !== "test_mode" && envName !== "live_mode") {
    throw new Error(
      `DODO_PAYMENTS_ENVIRONMENT must be "test_mode" or "live_mode", got "${envName}".`,
    );
  }

  _client = new DodoPayments({
    bearerToken: apiKey,
    environment: envName,
  });
  return _client;
}
