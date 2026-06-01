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

/**
 * SSRF koruması: yalnızca Google Maps host'larına fetch izinli.
 * Kullanıcı "düğün salonu Google Maps linki" yapıştırır → başka host'a
 * (169.254.169.254 metadata, localhost, iç ağ) istek atılamaz.
 */
function isAllowedMapsHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  // Kısa linkler + google.com / maps.google.com / google.<tld> aileleri.
  if (h === "goo.gl" || h === "maps.app.goo.gl" || h === "app.goo.gl") return true;
  if (h === "google.com" || h.endsWith(".google.com")) return true;
  // google.com.tr, google.de, google.co.uk gibi ülke alan adları.
  if (/^(www\.|maps\.)?google\.[a-z.]{2,7}$/.test(h)) return true;
  return false;
}

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

  // SSRF koruması: yalnızca Google Maps host'larına izin ver.
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" || !isAllowedMapsHost(parsed.hostname)) {
    return null;
  }

  try {
    const res = await fetch(parsed.toString(), {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NUVEBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    // Yönlendirme sonrası host hâlâ izinli mi? (goo.gl → google maps olmalı)
    try {
      if (!isAllowedMapsHost(new URL(res.url).hostname)) return null;
    } catch {
      return null;
    }
    const fromUrl = parse(res.url);
    if (fromUrl) return fromUrl;
    // Gövdeyi en fazla ~256KB oku (bellek-DoS'a karşı), sonra ayrıştır.
    const body = (await res.text()).slice(0, 262_144);
    return parse(body);
  } catch {
    return null;
  }
}
