"use client";

/**
 * HotelsSection — couple'ın otel önerisi yöneticisi.
 *
 * Hotels JSONB array'i /api/hotels üzerinden CRUD. Çok rahat bir
 * pattern: ekle formu + liste + sil butonu. Editör en fazla 6 otel
 * önerebilir (UI'da hard limit yok, sadece UX önerisi).
 */

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { HotelItem } from "@/lib/db/types";

interface HotelsSectionProps {
  token: string;
  hotels: HotelItem[];
}

export function HotelsSection({ token, hotels }: HotelsSectionProps) {
  const router = useRouter();
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      address: String(fd.get("address") ?? "").trim(),
      price: String(fd.get("price") ?? "").trim(),
      url: String(fd.get("url") ?? "").trim(),
      note: String(fd.get("note") ?? "").trim(),
    };
    if (!payload.name) {
      setErrMsg("Otel adı gerekli.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/hotels?token=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? "Ekleme başarısız.");
        }
        form.reset();
        setErrMsg(null);
        router.refresh();
      } catch (err) {
        setErrMsg(err instanceof Error ? err.message : "Hata.");
      }
    });
  }

  async function remove(index: number, name: string) {
    if (!window.confirm(`"${name}" otelini listeden silmek istiyor musun?`)) {
      return;
    }
    startTransition(async () => {
      try {
        const params = new URLSearchParams({ token, index: String(index) });
        const res = await fetch(`/api/hotels?${params.toString()}`, {
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
          — Konaklama
        </span>
        <h2
          className="mt-2 font-display text-brand-ink"
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            letterSpacing: "-0.015em",
          }}
        >
          Otel önerileri
        </h2>
        <p className="mt-2 max-w-[640px] text-[13px] leading-[1.7] text-brand-mute">
          Şehir dışından gelen misafirler için 3-4 otel öner. URL eklersen
          davetiyede &quot;Detay&quot; linki olarak görünür.
        </p>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="space-y-3 rounded-md border border-brand-ink/15 bg-white p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Otel adı *"
            required
            className="rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
          />
          <input
            type="text"
            name="price"
            placeholder="Fiyat / kategori (örn. €120/gece)"
            className="rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
          />
        </div>
        <input
          type="text"
          name="address"
          placeholder="Adres"
          className="block w-full rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
        />
        <input
          type="url"
          name="url"
          placeholder="Web sitesi / rezervasyon linki"
          className="block w-full rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
        />
        <input
          type="text"
          name="note"
          placeholder="Not (örn. düğün için özel indirim)"
          className="block w-full rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
        />
        <button type="submit" className="btn-couture">
          Ekle
        </button>
      </form>

      {errMsg && (
        <p className="text-[12px] text-red-700" role="status">
          {errMsg}
        </p>
      )}

      {hotels.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-brand-mute">
          Henüz otel önerisi eklemedin.
        </p>
      ) : (
        <ul className="space-y-2">
          {hotels.map((h, i) => (
            <li
              key={`${h.name}-${i}`}
              className="flex flex-col gap-2 rounded-md border border-brand-ink/12 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-brand-ink">{h.name}</p>
                {(h.address || h.price) && (
                  <p className="mt-0.5 text-[12px] text-brand-mute">
                    {[h.price, h.address].filter(Boolean).join(" · ")}
                  </p>
                )}
                {h.url && (
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener"
                    className="mt-0.5 inline-block text-[11px] text-brand-cognac hover:underline"
                  >
                    {h.url}
                  </a>
                )}
                {h.note && (
                  <p className="mt-1 text-[11px] italic text-brand-mute">
                    {h.note}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(i, h.name)}
                className="self-start text-[11px] uppercase tracking-[0.2em] text-brand-mute transition hover:text-red-700"
              >
                Sil
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
