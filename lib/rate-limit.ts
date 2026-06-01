/**
 * Basit in-memory sliding-window rate limiter.
 *
 * Coolify'da tek Node standalone instance çalıştığı için process-local Map
 * yeterli (serverless multi-instance değil). Anahtar (genelde IP) başına
 * pencere içinde N isteğe izin verir. Harici Redis/altyapı gerektirmez.
 *
 * Özellikle ücretli dış API'leri tetikleyen public uçlarda (ör. fal.ai
 * custom-cover) finansal-DoS'a karşı zorunlu bir korumadır.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

/**
 * `key` için `windowMs` penceresinde en fazla `limit` istek.
 * `nowMs` dışarıdan enjekte edilir → deterministik test.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  nowMs: number,
): RateLimitResult {
  const b = buckets.get(key);
  if (!b || nowMs >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: nowMs + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
  }
  if (b.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((b.resetAt - nowMs) / 1000)),
    };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfterSec: 0 };
}

/** Süresi geçen bucket'ları temizle (bellek sızıntısını önler). */
export function pruneRateLimitBuckets(nowMs: number): number {
  let pruned = 0;
  for (const [k, b] of buckets) {
    if (nowMs >= b.resetAt) {
      buckets.delete(k);
      pruned += 1;
    }
  }
  return pruned;
}

/** İstekten istemci IP'sini çıkar (Coolify reverse-proxy x-forwarded-for set eder). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}
