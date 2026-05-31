import { TIER_DAYS, type TierSlug } from "./types";

/**
 * Davetiye yaşam döngüsü — tek doğruluk kaynağı (single source of truth).
 *
 * Yayın süresi matematiği önceden 3 yerde kopyalanmıştı (admin publish,
 * Dodo webhook, /i okuma). Tutarsızlık + test edilemezlik riskiydi.
 * Burada saf fonksiyonlar olarak toplandı; `nowMs`/`fromMs` dışarıdan
 * enjekte edilir → deterministik, kolay test edilir, SSR-hidrasyon-güvenli.
 */

const DAY_MS = 86_400_000;

/** Yayın bitiş zamanı (ISO): yayın/ödeme anından tier süresi kadar sonra. */
export function computeLiveUntil(
  tier: TierSlug | null | undefined,
  fromMs: number,
): string {
  const days = TIER_DAYS[tier ?? "standard"] ?? TIER_DAYS.standard;
  return new Date(fromMs + days * DAY_MS).toISOString();
}

/** live_until geçmiş mi? (null/bozuk tarih → false: süresiz değil, henüz dolmamış sayılır) */
export function isPastLiveUntil(
  liveUntil: string | null | undefined,
  nowMs: number,
): boolean {
  if (!liveUntil) return false;
  const t = new Date(liveUntil).getTime();
  return Number.isFinite(t) && t < nowMs;
}

/** Davetiye şu an herkese görünür mü? (status=live + süresi dolmamış) */
export function isInvitationLive(
  status: string | null | undefined,
  liveUntil: string | null | undefined,
  nowMs: number,
): boolean {
  return status === "live" && !isPastLiveUntil(liveUntil, nowMs);
}

/**
 * "Süresi doldu" sayfası gösterilmeli mi?
 * (eskiden yayındaydı — live veya archived — ve live_until geçmiş)
 */
export function isInvitationExpired(
  status: string | null | undefined,
  liveUntil: string | null | undefined,
  nowMs: number,
): boolean {
  return (
    (status === "live" || status === "archived") &&
    isPastLiveUntil(liveUntil, nowMs)
  );
}
