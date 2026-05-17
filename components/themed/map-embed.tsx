"use client";

/**
 * MapEmbed — B.3, Pressed Love "How to get there" paritesi.
 *
 * OpenStreetMap iframe + Google Maps yol tarifi deep link. Üçüncü
 * parti API anahtarı GEREKMİYOR; Leaflet'i de bundle'a katmadık.
 * Sadece bir iframe + iki link.
 *
 * iframe `embed.html?bbox=lat-0.005,lng-0.005,lat+0.005,lng+0.005`
 * formülüyle ~1km kare alan gösterir; bbox dar tutuldu ki venue
 * doğrudan görünsün. Marker query string'i pin koyar.
 *
 * Google Maps deep link `https://www.google.com/maps/dir/?api=1`
 * formuyla yol tarifi UI'sını açar — kullanıcı mobil'de native
 * uygulamayı, desktop'ta web'i kullanır.
 */

interface MapEmbedProps {
  lat: number;
  lng: number;
  /** Pin'in üzerinde gösterilecek isim (opsiyonel). */
  label?: string | null;
  /** "Yol tarifi al" buton etiketi. */
  directionsLabel: string;
  /** Tema ink + accent rengi — buton tipografi için. */
  ink: string;
  accent: string;
}

export function MapEmbed({
  lat,
  lng,
  label,
  directionsLabel,
  ink,
  accent,
}: MapEmbedProps) {
  /* OSM embed bbox formülü — 0.005° ≈ 550m, dar bir kare ile venue
     öne çıkar. iframe'in src'sini değiştirmek için key gerek yok. */
  const span = 0.005;
  const bbox = [
    (lng - span).toFixed(6),
    (lat - span).toFixed(6),
    (lng + span).toFixed(6),
    (lat + span).toFixed(6),
  ].join(",");
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(
    6,
  )},${lng.toFixed(6)}`;

  /* Google Maps yol tarifi — destination'a lat,lng + opsiyonel
     destination_place_id kullanılabilir ama plain coord yeterli. */
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(
    6,
  )},${lng.toFixed(6)}`;

  return (
    <div className="mx-auto max-w-[900px]">
      <div
        className="relative aspect-[16/9] w-full overflow-hidden rounded-md"
        style={{ border: `0.5px solid ${ink}22` }}
      >
        <iframe
          title={label ? `${label} haritası` : "Mekan haritası"}
          src={osmSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full"
          style={{ border: 0, filter: "saturate(0.85) contrast(0.95)" }}
        />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        <a
          href={directions}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2 text-[10px] uppercase transition-all hover:tracking-[0.34em]"
          style={{
            border: `0.5px solid ${ink}55`,
            color: ink,
            letterSpacing: "0.28em",
            fontWeight: 300,
          }}
        >
          {directionsLabel}
        </a>
        <span
          aria-hidden
          className="text-[10px] uppercase"
          style={{
            color: accent,
            letterSpacing: "0.28em",
            fontWeight: 300,
            opacity: 0.7,
          }}
        >
          {lat.toFixed(4)}° N · {lng.toFixed(4)}° E
        </span>
      </div>
    </div>
  );
}
