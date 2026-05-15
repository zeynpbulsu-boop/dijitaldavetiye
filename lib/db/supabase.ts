import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase clients.
 *
 *   adminDb() — server-side only, uses the SERVICE_ROLE key. Bypasses
 *               RLS. Use from API route handlers, webhook receivers,
 *               and other Node-runtime server code. NEVER ship to
 *               the browser bundle.
 *
 *   anonDb()  — anon-key client safe for the browser. Subject to RLS.
 *               In this build we don't use it much — almost everything
 *               goes through our own /api routes — but it's here for
 *               future use (e.g. live RSVP counts on an admin page).
 *
 * Both are lazy singletons.
 */

let _admin: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

function url(): string {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is not set. Add it to your Coolify env.",
    );
  }
  return u;
}

export function adminDb(): SupabaseClient {
  if (_admin) return _admin;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to your Coolify env.",
    );
  }
  _admin = createClient(url(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-nuve-role": "admin" } },
  });
  return _admin;
}

export function anonDb(): SupabaseClient {
  if (_anon) return _anon;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Add it to your Coolify env.",
    );
  }
  _anon = createClient(url(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _anon;
}
