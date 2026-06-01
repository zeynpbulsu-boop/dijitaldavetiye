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

/* Seed reviews — YALNIZCA geliştirme (dev) ortamında, social-proof
   section'ı UI üstünde test edilebilsin diye. Production'da ASLA
   gösterilmez: uydurma yorum gerçek ziyaretçiye servis etmek FTC/AB
   sahte-yorum riskidir. Prod'da DB boşsa section tamamen gizlenir
   (reviews.tsx length===0 → null); gerçek yorum eklendikçe görünür. */
const SEED_REVIEWS: Review[] = [
  {
    id: "seed-1",
    name: "Elif & Mert",
    rating: 5,
    content:
      "Davetiyemizi 48 saatte hazır olarak teslim aldık. AI ile mekanımıza özel illüstrasyon yapıldı, sonuç inanılmaz şıktı. Misafirler 'bu nasıl bir şey' diye yazdı durdu.",
    country: "İstanbul",
    country_code: "TR",
    verified: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: "seed-2",
    name: "Ada & Can",
    rating: 5,
    content:
      "RSVP yönetimi gerçekten hayat kurtarıcı. 187 davetli, hepsi bir panelde takip ediliyor. Tek seferlik €39.99'a bu paket — paha biçilemez.",
    country: "Ankara",
    country_code: "TR",
    verified: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "seed-3",
    name: "Ipek & Yiğit",
    rating: 5,
    content:
      "Etsy'de gördüğümüz benzer şablonlar $30-50 arası ama hepsi Canva üzerinden DIY. NUVE direkt yayına alıyor + RSVP + müzik + dil seçimi. Karşılaştırılabilir değil.",
    country: "Alaçatı",
    country_code: "TR",
    verified: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 22).toISOString(),
  },
  {
    id: "seed-4",
    name: "Selin & Mert",
    rating: 5,
    content:
      "Çıragan'da nikah, gecede 220 misafir. Davetiyemizdeki müzik + zarf açılış animasyonu öyle bir izlenim bıraktı ki — düğün sabahı ailelerden teşekkür mesajı sel oldu.",
    country: "İstanbul",
    country_code: "TR",
    verified: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
  },
  {
    id: "seed-5",
    name: "Maja & Luka",
    rating: 5,
    content:
      "Trojezičnu pozivnicu (TR/EN/SR) — savršeno. Naši Beogradski rođaci nisu morali tražiti prevod. Mali detalji znače mnogo.",
    country: "Beograd",
    country_code: "RS",
    verified: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 41).toISOString(),
  },
  {
    id: "seed-6",
    name: "Cansu & Berk",
    rating: 5,
    content:
      "Save the Date için 'kazı-kazan' altın kalp tasarımını seçtik — herkesin söylediği şey 'bu nedir ya' oldu. Doğum günlerinde de kullanmaya başlayacağız.",
    country: "Bodrum",
    country_code: "TR",
    verified: true,
    published: true,
    created_at: new Date(Date.now() - 86400000 * 50).toISOString(),
  },
];

/** Seed'ler yalnızca dev'de; production'da gerçek veri yoksa boş döner
 *  → section gizlenir, uydurma yorum gösterilmez. */
const USE_SEED = process.env.NODE_ENV !== "production";

function fallbackReviews(limit: number): Review[] {
  return USE_SEED ? SEED_REVIEWS.slice(0, limit) : [];
}

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
      return fallbackReviews(limit);
    }
    return data && data.length > 0 ? data : fallbackReviews(limit);
  } catch (err) {
    console.warn("[reviews] fetch failed:", err);
    return fallbackReviews(limit);
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
