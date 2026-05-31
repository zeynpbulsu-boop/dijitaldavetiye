/**
 * Google Maps link → koordinat çözücü (API KEY GEREKMEZ).
 *
 * Müşteri salonu Google Maps'te bulur → "Paylaş → bağlantıyı kopyala" → yapıştırır.
 * Bu fonksiyon (sunucu tarafında) linkten enlem/boylamı çıkarır:
 *   - Tam URL'ler:  .../@40.99,29.02,17z  ya da  !3d40.99!4d29.02  ya da  ?q=lat,lng
 *   - Kısa linkler: maps.app.goo.gl/… , goo.gl/maps/…  → yönlendirme takip edilir
 *
 * Koordinat çıkarılamazsa null döner; o durumda harita adres metniyle (key'siz
 * output=embed) yine gösterilir. Hiçbir Maps API key'i / faturalandırma gerekmez.
 */

export interface Coords {
  lat: number;
  lng: number;
}

const COORD_PATTERNS: RegExp[] = [
  /@(-?\d{1,3}\.\d{3,}),(-?\d{1,3}\.\d{3,})/, // /@lat,lng
  /!3d(-?\d{1,3}\.\d{3,})!4d(-?\d{1,3}\.\d{3,})/, // !3dlat!4dlng
  /[?&](?:q|query|ll|center|destination|daddr|sll)=(-?\d{1,3}\.\d{3,}),\s*(-?\d{1,3}\.\d{3,})/i, // q=lat,lng
];

function parse(text: string): Coords | null {
  for (const re of COORD_PATTERNS) {
    const m = text.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        Math.abs(lat) <= 90 &&
        Math.abs(lng) <= 180
      ) {
        return { lat, lng };
      }
    }
  }
  return null;
}

export async function resolveMapsCoords(rawUrl: string): Promise<Coords | null> {
  const url = (rawUrl || "").trim();
  if (!url) return null;

  // 1) Tam URL ise doğrudan ayrıştır (ağ çağrısı gerekmez).
  const direct = parse(url);
  if (direct) return direct;

  // 2) Kısa link / dolaylı URL → yönlendirmeyi takip et, son URL + gövdeyi ayrıştır.
  if (!/^https?:\/\//i.test(url)) return null;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NUVEBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const fromUrl = parse(res.url);
    if (fromUrl) return fromUrl;
    const body = await res.text();
    return parse(body);
  } catch {
    return null;
  }
}
