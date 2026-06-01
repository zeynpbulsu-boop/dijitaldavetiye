"use client";

/**
 * ScheduleSection — çiftin gün-akışı / program yöneticisi (post-pay editor).
 *
 * Migration 010 ile `schedule` JSONB kolonu eklendi; burada /api/invitations
 * PATCH (schedule EDITABLE_FIELDS'te) ile kaydedilir. Satır ekle/sil anında
 * kaydeder; metin alanları blur'da kaydeder (her tuşta API'yi yormaz).
 */

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ScheduleEntry } from "@/lib/db/types";

interface Props {
  token: string;
  slug: string;
  schedule: ScheduleEntry[];
}

type SaveState = "idle" | "saving" | "saved" | "error";

export function ScheduleSection({ token, slug, schedule: initial }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState<ScheduleEntry[]>(initial);
  const [save, setSave] = useState<SaveState>("idle");
  const [, startTransition] = useTransition();

  async function persist(next: ScheduleEntry[]) {
    setSave("saving");
    try {
      const res = await fetch(
        `/api/invitations/${encodeURIComponent(slug)}?token=${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ schedule: next }),
        },
      );
      if (!res.ok) throw new Error("save failed");
      setSave("saved");
      startTransition(() => router.refresh());
      window.setTimeout(() => setSave("idle"), 1800);
    } catch {
      setSave("error");
    }
  }

  function add() {
    const next = [...rows, { time: "", title: "", desc: "" }];
    setRows(next);
    void persist(next);
  }
  function remove(idx: number) {
    const next = rows.filter((_, i) => i !== idx);
    setRows(next);
    void persist(next);
  }
  function edit(idx: number, patch: Partial<ScheduleEntry>) {
    setRows((r) => r.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  const inputClass =
    "w-full rounded-lg border border-brand-ink/15 bg-white px-3 py-2.5 text-[14px] text-brand-ink outline-none transition focus:border-brand-cognac";

  return (
    <section aria-labelledby="schedule-heading">
      <header className="mb-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
          — Program
        </span>
        <h2
          id="schedule-heading"
          className="mt-2 font-display text-brand-ink"
          style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-0.01em" }}
        >
          Gün akışı
        </h2>
        <p className="mt-2 max-w-[560px] text-[13.5px] leading-[1.7] text-brand-mute">
          Törenden kokteyle, günün akışını ekle. Boş bırakırsan davetiyede bu
          bölüm görünmez.
        </p>
      </header>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[88px_1fr_auto] items-start gap-2 sm:grid-cols-[100px_1fr_1.4fr_auto]"
          >
            <input
              aria-label="Saat"
              value={row.time}
              onChange={(e) => edit(i, { time: e.target.value })}
              onBlur={() => persist(rows)}
              placeholder="16:00"
              className={inputClass}
            />
            <input
              aria-label="Başlık"
              value={row.title}
              onChange={(e) => edit(i, { title: e.target.value })}
              onBlur={() => persist(rows)}
              placeholder="Tören"
              className={inputClass}
            />
            <input
              aria-label="Açıklama (opsiyonel)"
              value={row.desc ?? ""}
              onChange={(e) => edit(i, { desc: e.target.value })}
              onBlur={() => persist(rows)}
              placeholder="kısa açıklama (opsiyonel)"
              className={`${inputClass} col-span-2 sm:col-span-1`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Satırı sil"
              className="rounded-lg border border-brand-ink/15 px-3 py-2.5 text-[13px] text-brand-mute transition hover:border-red-300 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={add}
          className="rounded-full border border-brand-ink/22 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
        >
          + Satır ekle
        </button>
        <span
          aria-live="polite"
          className="text-[12px] uppercase tracking-[0.18em] text-brand-mute"
        >
          {save === "saving"
            ? "Kaydediliyor…"
            : save === "saved"
              ? "✓ Kaydedildi"
              : save === "error"
                ? "Kaydedilemedi — tekrar dene"
                : ""}
        </span>
      </div>
    </section>
  );
}
