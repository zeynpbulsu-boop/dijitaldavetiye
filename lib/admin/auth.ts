import crypto from "crypto";
import { cookies } from "next/headers";

/**
 * Owner (admin panel) kimlik doğrulama — tek sahip için basit şifre kapısı.
 *
 * Coolify env'e `ADMIN_PASSWORD` koyulur. Panele o şifreyle girilir; doğruysa
 * httpOnly imzalı bir oturum cookie'si set edilir. Cookie değeri şifrenin
 * KENDİSİ değil, ondan türetilen HMAC — sızsa bile şifreyi vermez.
 */

export const ADMIN_COOKIE = "nuve_admin";

/** Cookie'de tutulacak oturum belirteci (şifreden türetilmiş HMAC). */
export function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  const secret = process.env.ADMIN_SESSION_SECRET || pw;
  return crypto
    .createHmac("sha256", secret)
    .update("nuve-admin-session-v1")
    .digest("hex");
}

/** Girilen şifre doğru mu (zamanlama-güvenli karşılaştırma). */
export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** İstek, geçerli admin oturum cookie'si taşıyor mu? */
export function isAdminAuthed(): boolean {
  const expected = sessionToken();
  if (!expected) return false;
  const got = cookies().get(ADMIN_COOKIE)?.value;
  return !!got && got.length === expected.length && got === expected;
}

/** ADMIN_PASSWORD hiç ayarlanmamış mı? (panelde uyarı göstermek için) */
export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
