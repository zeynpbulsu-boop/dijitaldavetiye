"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MapsVenuePicker — müşteri mekânı Google Maps'ten seçer.
 *
 * Places Autocomplete ile adres arar VEYA haritadaki pini sürükler → adres +
 * enlem/boylam otomatik dolar. Form bu üç inputu (venue_address, venue_lat,
 * venue_lng) name ile gönderir; saveInvitation kaydeder.
 *
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY yoksa zarif fallback: düz adres + elle
 * koordinat alanları (harita olmadan da çalışır).
 *
 * Not: @types/google.maps kurulu olmadığından (ve `any` yasak), kullandığımız
 * Maps API yüzeyi için minimal tipler aşağıda tanımlandı.
 */

interface GLatLng {
  lat(): number;
  lng(): number;
}
interface GLatLngLiteral {
  lat: number;
  lng: number;
}
interface GMap {
  setCenter(p: GLatLng | GLatLngLiteral): void;
  setZoom(z: number): void;
}
interface GMarker {
  setPosition(p: GLatLng | GLatLngLiteral): void;
  getPosition(): GLatLng | null;
  addListener(ev: string, cb: () => void): void;
}
interface GPlace {
  geometry?: { location?: GLatLng };
  formatted_address?: string;
  name?: string;
}
interface GAutocomplete {
  bindTo(key: string, target: GMap): void;
  addListener(ev: string, cb: () => void): void;
  getPlace(): GPlace;
}
interface GMapsApi {
  Map: new (el: HTMLElement, opts: Record<string, unknown>) => GMap;
  Marker: new (opts: Record<string, unknown>) => GMarker;
  places: {
    Autocomplete: new (
      input: HTMLInputElement,
      opts: Record<string, unknown>,
    ) => GAutocomplete;
  };
}
declare global {
  interface Window {
    google?: { maps: GMapsApi };
    __nuveMapsReady?: () => void;
  }
}

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

let mapsPromise: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined" || !KEY) return Promise.reject(new Error("no-key"));
  if (window.google?.maps?.places) return Promise.resolve();
  if (!mapsPromise) {
    mapsPromise = new Promise<void>((resolve, reject) => {
      window.__nuveMapsReady = () => resolve();
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${KEY}&libraries=places&callback=__nuveMapsReady&language=tr&region=TR`;
      s.async = true;
      s.onerror = () => reject(new Error("maps-load-failed"));
      document.head.appendChild(s);
    });
  }
  return mapsPromise;
}

export function MapsVenuePicker({
  defaultAddress,
  defaultLat,
  defaultLng,
}: {
  defaultAddress?: string | null;
  defaultLat?: number | null;
  defaultLng?: number | null;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [lat, setLat] = useState<string>(defaultLat != null ? String(defaultLat) : "");
  const [lng, setLng] = useState<string>(defaultLng != null ? String(defaultLng) : "");
  const [mapReady, setMapReady] = useState(false);
  const [noKey, setNoKey] = useState(!KEY);

  useEffect(() => {
    if (!KEY) {
      setNoKey(true);
      return;
    }
    let cancelled = false;
    loadMaps()
      .then(() => {
        if (cancelled || !window.google || !mapRef.current) return;
        const maps = window.google.maps;
        const hasCoord = defaultLat != null && defaultLng != null;
        const center: GLatLngLiteral = hasCoord
          ? { lat: defaultLat as number, lng: defaultLng as number }
          : { lat: 39.0, lng: 35.0 }; // Türkiye merkezi
        const map = new maps.Map(mapRef.current, {
          center,
          zoom: hasCoord ? 15 : 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        const marker = new maps.Marker({ map, position: center, draggable: true });
        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (!pos) return;
          setLat(pos.lat().toFixed(6));
          setLng(pos.lng().toFixed(6));
        });
        if (inputRef.current) {
          const ac = new maps.places.Autocomplete(inputRef.current, {
            fields: ["geometry", "formatted_address", "name"],
          });
          ac.bindTo("bounds", map);
          ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            const loc = place.geometry?.location;
            if (!loc) return;
            map.setCenter(loc);
            map.setZoom(16);
            marker.setPosition(loc);
            setLat(loc.lat().toFixed(6));
            setLng(loc.lng().toFixed(6));
            if (inputRef.current && place.formatted_address) {
              inputRef.current.value = place.formatted_address;
            }
          });
        }
        setMapReady(true);
      })
      .catch(() => setNoKey(true));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-[12px] uppercase tracking-[0.18em] text-brand-mute">
        Mekan adresi {!noKey && "(haritadan ara veya pini sürükle)"}
      </label>
      <input
        ref={inputRef}
        name="venue_address"
        defaultValue={defaultAddress ?? ""}
        placeholder={noKey ? "Açık adres" : "Adres ara…"}
        className="w-full rounded-lg border border-brand-ink/15 bg-bg px-4 py-3 text-[15px] text-brand-ink outline-none focus-visible:border-brand-cognac"
      />

      {!noKey && (
        <div
          ref={mapRef}
          className="w-full overflow-hidden rounded-xl border border-brand-ink/12"
          style={{ height: 240, opacity: mapReady ? 1 : 0.4 }}
        />
      )}

      {/* Form değerleri — harita/pin bunları doldurur (key yoksa elle girilir). */}
      {noKey ? (
        <div className="grid grid-cols-2 gap-3">
          <input
            name="venue_lat"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Enlem (lat)"
            inputMode="decimal"
            className="rounded-lg border border-brand-ink/15 bg-bg px-3 py-2 text-[14px] text-brand-ink outline-none focus-visible:border-brand-cognac"
          />
          <input
            name="venue_lng"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Boylam (lng)"
            inputMode="decimal"
            className="rounded-lg border border-brand-ink/15 bg-bg px-3 py-2 text-[14px] text-brand-ink outline-none focus-visible:border-brand-cognac"
          />
        </div>
      ) : (
        <>
          <input type="hidden" name="venue_lat" value={lat} />
          <input type="hidden" name="venue_lng" value={lng} />
          {(lat || lng) && (
            <p className="text-[11px] text-brand-mute">
              Konum: {lat || "—"}, {lng || "—"}
            </p>
          )}
        </>
      )}

      {noKey && (
        <p className="text-[11px] leading-relaxed text-brand-mute">
          Harita için sunucuya <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> eklenince
          adres arama + pin sürükleme aktifleşir. Şimdilik adresi yaz, koordinatı
          Google Maps&apos;ten kopyalayıp girebilirsin.
        </p>
      )}
    </div>
  );
}
