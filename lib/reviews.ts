/**
 * Reviews — public.reviews tablosundan sosyal kanıt çek.
 *
 * Sadece published=true satırları, en yeni önce. Liste 3-6 elemanlı
 * tutulur ki landing fişişmesin; daha fazla istenirse listeMore option
 * eklenebilir. RLS bypass için adminDb() kullanıyoruz — bu sayfa
 * server component'te çağrıldığı için tarayıcıya hiç ulaşmıyor.
 */

import { adminDb } from "@/lib/db/supabase";
import type { Review } from "@/lib/db/types";

export async function fetchPublishedReviews(
  limit = 6,
): Promise<Review[]> {
  try {
    const supabase = adminDb();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<Review[]>();
    if (error) {
      console.warn("[reviews]", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.warn("[reviews] fetch failed:", err);
    return [];
  }
}

/** ISO Alpha-2 → emoji flag. "TR" → "🇹🇷". Verilmezse null. */
export function flagFromCountryCode(code: string | null | undefined): string | null {
  if (!code || code.length !== 2) return null;
  const A = 0x1f1e6; // Regional indicator symbol letter A
  const upper = code.toUpperCase();
  const c1 = upper.charCodeAt(0) - 65 + A;
  const c2 = upper.charCodeAt(1) - 65 + A;
  if (Number.isNaN(c1) || Number.isNaN(c2)) return null;
  return String.fromCodePoint(c1, c2);
}
