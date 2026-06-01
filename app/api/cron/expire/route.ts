import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";

/**
 * Süre-dolumu cron'u — 1 yılı (live_until) geçmiş canlı davetiyeleri
 * otomatik `archived` yapar (yayından çeker). Günlük çalıştırılır.
 *
 * Coolify → Scheduled Tasks → günlük:
 *   curl -s "$URL/api/cron/expire" -H "Authorization: Bearer $CRON_SECRET"
 *
 * NOT: /i/[slug] zaten okuma anında live_until kontrolü yapıyor (süresi dolan
 * anında 404). Bu cron, DB durumunu da senkron tutar (panelde doğru görünür).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authed(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  // Secret YALNIZCA Authorization header'ında — URL query'den (proxy/erişim
  // logları, tarayıcı geçmişi, Referer) sızmasını önler.
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!authed(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const db = adminDb();
    const now = new Date().toISOString();
    const { data, error } = await db
      .from("invitations")
      .update({ status: "archived", updated_at: now })
      .eq("status", "live")
      .lt("live_until", now)
      .select("id");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, archived: data?.length ?? 0 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
