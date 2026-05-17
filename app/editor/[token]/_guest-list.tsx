"use client";

/**
 * GuestList — couple-facing davetli yöneticisi (FAZ rakip-1).
 *
 * Pressed Love'ın "guest list dashboard" özelliğinin NUVE versiyonu:
 *   - çift davetli ekler (isim + opsiyonel email/phone/plus_one)
 *   - statü chip (invited / confirmed / declined / maybe) — tıklayınca
 *     manuel set; RSVP geldiğinde otomatik güncellenir
 *   - silme
 *   - stat satırı (toplam, onaylı, bekleyen, ret, +1)
 *
 * API: /api/guests + /api/guests/[id], admin_token query param ile.
 * /editor/[token]/page.tsx server component'i bu bileşeni client tarafa
 * monte ediyor; ilk fetch'i client'ta yapıyoruz çünkü davetli sayısı
 * 100'lerce olabilir ve server payload'unu fişişirmiyoruz.
 */

import { useEffect, useState, useTransition } from "react";
import type { FormEvent } from "react";
import type { Guest, GuestStatus } from "@/lib/db/types";

interface GuestListProps {
  token: string;
}

type Stats = {
  total: number;
  invited: number;
  confirmed: number;
  declined: number;
  maybe: number;
  plus_ones: number;
};

const STATUS_LABELS: Record<GuestStatus, string> = {
  invited: "Davet edildi",
  confirmed: "Geliyor",
  declined: "Gelmiyor",
  maybe: "Belki",
};

const STATUS_COLORS: Record<GuestStatus, string> = {
  invited: "border-brand-mute/40 text-brand-mute",
  confirmed: "border-brand-cognac/40 bg-brand-cognac/8 text-brand-cognac",
  declined: "border-red-400/40 bg-red-50 text-red-700",
  maybe: "border-amber-500/40 bg-amber-50 text-amber-700",
};

const STATUS_ORDER: GuestStatus[] = [
  "invited",
  "confirmed",
  "maybe",
  "declined",
];

export function GuestList({ token }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | GuestStatus>("all");
  const [, startTransition] = useTransition();

  async function reload() {
    setLoading(true);
    setErrMsg(null);
    try {
      const res = await fetch(
        `/api/guests?token=${encodeURIComponent(token)}`,
        { cache: "no-store" },
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = (await res.json()) as { guests: Guest[]; stats: Stats };
      setGuests(json.guests ?? []);
      setStats(json.stats ?? null);
    } catch (err) {
      console.warn("[guests] load failed:", err);
      setErrMsg("Davetliler yüklenemedi. Lütfen sayfayı yenile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      plus_one: formData.get("plus_one") === "on",
      plus_one_name: String(formData.get("plus_one_name") ?? "").trim(),
    };
    if (!payload.name) {
      setErrMsg("İsim gerekli.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/guests?token=${encodeURIComponent(token)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as {
            error?: string;
          };
          throw new Error(j.error ?? "Insert failed");
        }
        form.reset();
        await reload();
      } catch (err) {
        setErrMsg(err instanceof Error ? err.message : "Hata.");
      }
    });
  }

  async function setStatus(guest: Guest, next: GuestStatus) {
    if (next === guest.status) return;
    // Optimistic update
    setGuests((prev) =>
      prev.map((g) => (g.id === guest.id ? { ...g, status: next } : g)),
    );
    try {
      const res = await fetch(
        `/api/guests/${encodeURIComponent(guest.id)}?token=${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      void reload();
    } catch {
      // Revert on failure
      setGuests((prev) =>
        prev.map((g) =>
          g.id === guest.id ? { ...g, status: guest.status } : g,
        ),
      );
      setErrMsg("Statü güncellenemedi.");
    }
  }

  async function remove(guest: Guest) {
    if (
      !window.confirm(`${guest.name} adlı davetliyi listeden silmek istiyor musun?`)
    ) {
      return;
    }
    const prev = guests;
    setGuests((g) => g.filter((x) => x.id !== guest.id));
    try {
      const res = await fetch(
        `/api/guests/${encodeURIComponent(guest.id)}?token=${encodeURIComponent(token)}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Delete failed");
      void reload();
    } catch {
      setGuests(prev);
      setErrMsg("Silinemedi.");
    }
  }

  const visible =
    filter === "all" ? guests : guests.filter((g) => g.status === filter);

  return (
    <section className="space-y-6">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
          — Davetli listesi
        </span>
        <h2
          className="mt-2 font-display text-brand-ink"
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            letterSpacing: "-0.015em",
          }}
        >
          Misafirlerini yönet
        </h2>
        <p className="mt-2 max-w-[600px] text-[13px] leading-[1.7] text-brand-mute">
          Davetli ekle; misafirin RSVP'si geldiğinde statüsü otomatik
          güncellenir. İsim veya e-posta eşleşmesi yoksa walk-in olarak ayrı
          satıra düşer.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatChip label="Toplam" value={stats.total} />
          <StatChip label="Geliyor" value={stats.confirmed} highlight />
          <StatChip label="Bekleyen" value={stats.invited + stats.maybe} />
          <StatChip label="Gelmiyor" value={stats.declined} />
        </div>
      )}

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="rounded-md border border-brand-ink/15 bg-white p-4 shadow-ed-sm"
      >
        <div className="grid gap-3 sm:grid-cols-[1.5fr,1.5fr,1fr,auto]">
          <input
            type="text"
            name="name"
            placeholder="Davetli adı *"
            required
            className="rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta (opsiyonel)"
            className="rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefon"
            className="rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
          />
          <button
            type="submit"
            className="btn-couture whitespace-nowrap"
          >
            Ekle
          </button>
        </div>
        <label className="mt-3 inline-flex items-center gap-2 text-[12px] text-brand-mute">
          <input
            type="checkbox"
            name="plus_one"
            className="h-4 w-4 accent-brand-cognac"
          />
          Yanında biri gelebilir (+1)
        </label>
        <input
          type="text"
          name="plus_one_name"
          placeholder="Eşlikçi adı (varsa)"
          className="mt-2 block w-full rounded-md border border-brand-ink/15 px-3 py-2 text-[14px] placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30 sm:max-w-[280px]"
        />
      </form>

      {errMsg && (
        <p className="text-[12px] text-red-700" role="status">
          {errMsg}
        </p>
      )}

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          Hepsi
        </FilterChip>
        {STATUS_ORDER.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
          >
            {STATUS_LABELS[s]}
          </FilterChip>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="py-8 text-center text-[13px] text-brand-mute">
          Yükleniyor…
        </p>
      ) : visible.length === 0 ? (
        <p className="py-8 text-center text-[13px] text-brand-mute">
          {filter === "all"
            ? "Henüz davetli eklemedin."
            : "Bu statüde davetli yok."}
        </p>
      ) : (
        <ul className="divide-y divide-brand-ink/10 rounded-md border border-brand-ink/12 bg-white">
          {visible.map((g) => (
            <li
              key={g.id}
              className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-[14px]"
            >
              <div className="col-span-12 sm:col-span-4">
                <p className="font-medium text-brand-ink">{g.name}</p>
                {(g.email || g.phone) && (
                  <p className="mt-0.5 text-[12px] text-brand-mute">
                    {[g.email, g.phone].filter(Boolean).join(" · ")}
                  </p>
                )}
                {g.plus_one && (
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-brand-cognac/80">
                    +1{g.plus_one_name ? ` · ${g.plus_one_name}` : ""}
                  </p>
                )}
              </div>
              <div className="col-span-8 sm:col-span-5">
                <select
                  value={g.status}
                  onChange={(e) =>
                    setStatus(g, e.target.value as GuestStatus)
                  }
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] ${STATUS_COLORS[g.status]} focus:outline-none focus:ring-2 focus:ring-brand-cognac/30`}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                {g.dietary_notes && (
                  <p className="mt-1 text-[11px] text-brand-mute">
                    Beslenme notu: {g.dietary_notes}
                  </p>
                )}
              </div>
              <div className="col-span-4 text-right sm:col-span-3">
                <button
                  type="button"
                  onClick={() => remove(g)}
                  className="text-[11px] uppercase tracking-[0.2em] text-brand-mute transition hover:text-red-700"
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StatChip({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-md border px-4 py-3 ${
        highlight
          ? "border-brand-cognac/40 bg-brand-cognac/8"
          : "border-brand-ink/12 bg-white"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.22em] text-brand-mute">
        {label}
      </div>
      <div
        className={`mt-1 font-display ${
          highlight ? "text-brand-cognac" : "text-brand-ink"
        }`}
        style={{
          fontSize: "clamp(20px, 3vw, 28px)",
          letterSpacing: "-0.015em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition ${
        active
          ? "border-brand-ink bg-brand-ink text-bg"
          : "border-brand-ink/22 text-brand-mute hover:border-brand-cognac hover:text-brand-cognac"
      }`}
    >
      {children}
    </button>
  );
}
