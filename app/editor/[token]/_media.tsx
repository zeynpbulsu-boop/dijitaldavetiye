"use client";

/**
 * MediaSection — couple'ın hero kapak fotosu ve galeri yönetimi
 * (migration 005). Upload /api/upload?kind=hero|gallery üzerinden,
 * silme DELETE ile aynı route'a.
 *
 * Server component'i invitation row'unu zaten yüklediği için
 * initial hero_media_url + photos prop olarak geliyor. Upload/delete
 * sonrası router.refresh() ile yeniden yükleniyor — RSC pattern.
 *
 * Wax seal tint picker burada değil; o /editor formunda yaşıyor
 * çünkü scalar bir hex değeri.
 */

import { useRouter } from "next/navigation";
import { useState, useTransition, type ChangeEvent } from "react";
import Image from "next/image";
import type { PhotoItem } from "@/lib/db/types";

interface MediaSectionProps {
  token: string;
  heroMediaUrl: string | null;
  photos: PhotoItem[];
}

export function MediaSection({
  token,
  heroMediaUrl,
  photos,
}: MediaSectionProps) {
  const router = useRouter();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  async function uploadFile(file: File, kind: "hero" | "gallery") {
    setErrMsg(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(
      `/api/upload?token=${encodeURIComponent(token)}&kind=${kind}`,
      { method: "POST", body: fd },
    );
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(j.error ?? "Yükleme başarısız.");
    }
    return res.json() as Promise<{ url: string }>;
  }

  function handleHero(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    startTransition(async () => {
      try {
        await uploadFile(file, "hero");
        router.refresh();
      } catch (err) {
        setErrMsg(err instanceof Error ? err.message : "Hata.");
      }
    });
  }

  function handleGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (files.length === 0) return;
    startTransition(async () => {
      try {
        for (const f of files) {
          await uploadFile(f, "gallery");
        }
        router.refresh();
      } catch (err) {
        setErrMsg(err instanceof Error ? err.message : "Hata.");
      }
    });
  }

  async function removeMedia(kind: "hero" | "gallery", url: string) {
    if (!window.confirm("Bu görseli kaldırmak istediğine emin misin?")) return;
    startTransition(async () => {
      try {
        const params = new URLSearchParams({ token, kind, url });
        const res = await fetch(`/api/upload?${params.toString()}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Silme başarısız.");
        router.refresh();
      } catch (err) {
        setErrMsg(err instanceof Error ? err.message : "Hata.");
      }
    });
  }

  return (
    <section className="space-y-6">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
          — Görseller
        </span>
        <h2
          className="mt-2 font-display text-brand-ink"
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            letterSpacing: "-0.015em",
          }}
        >
          Foto &amp; galeri
        </h2>
        <p className="mt-2 max-w-[640px] text-[13px] leading-[1.7] text-brand-mute">
          Kapak fotosu davetiyenin Hero bölümünden hemen sonra büyük
          olarak görünür. Galeri (en fazla 12 foto önerilir) Schedule ile
          Müzik arasında masonik grid olarak yer alır. Maks dosya boyutu:
          10 MB · JPEG/PNG/WebP/AVIF.
        </p>
      </div>

      {errMsg && (
        <p className="text-[12px] text-red-700" role="status">
          {errMsg}
        </p>
      )}

      {/* Hero kapak fotosu */}
      <div className="rounded-md border border-brand-ink/15 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[12px] uppercase tracking-[0.22em] text-brand-ink">
            Kapak fotosu
          </h3>
          {heroMediaUrl && (
            <button
              type="button"
              onClick={() => removeMedia("hero", heroMediaUrl)}
              disabled={busy}
              className="text-[11px] uppercase tracking-[0.2em] text-brand-mute transition hover:text-red-700 disabled:opacity-50"
            >
              Kaldır
            </button>
          )}
        </div>
        {heroMediaUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm">
            <Image
              src={heroMediaUrl}
              alt="Kapak fotosu önizleme"
              fill
              sizes="(max-width: 640px) 100vw, 760px"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <p className="mb-3 text-[12px] text-brand-mute">
            Henüz kapak fotosu yok.
          </p>
        )}
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-ink/22 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleHero}
            disabled={busy}
            className="sr-only"
          />
          {heroMediaUrl ? "Değiştir" : "Yükle"}
        </label>
      </div>

      {/* Galeri */}
      <div className="rounded-md border border-brand-ink/15 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[12px] uppercase tracking-[0.22em] text-brand-ink">
            Galeri ({photos.length})
          </h3>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-ink/22 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleGallery}
              disabled={busy}
              multiple
              className="sr-only"
            />
            Foto ekle
          </label>
        </div>
        {photos.length === 0 ? (
          <p className="text-[12px] text-brand-mute">
            Henüz foto yüklenmedi.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {photos.map((p) => (
              <li
                key={p.url}
                className="group relative aspect-square overflow-hidden rounded-sm"
              >
                <Image
                  src={p.url}
                  alt={p.alt ?? "Galeri fotosu"}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  onClick={() => removeMedia("gallery", p.url)}
                  disabled={busy}
                  aria-label="Bu fotoyu kaldır"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[14px] text-brand-ink opacity-0 transition group-hover:opacity-100 hover:bg-white"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {busy && (
        <p className="text-[12px] text-brand-mute" role="status">
          Yükleniyor…
        </p>
      )}
    </section>
  );
}
