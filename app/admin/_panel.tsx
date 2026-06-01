"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Invitation } from "@/lib/db/types";
import {
  publishInvitation,
  archiveInvitation,
  adminLogout,
  type ActionResult,
} from "./_actions";

const STATUS_LABEL: Record<string, string> = {
  draft: "Taslak",
  paid: "Ödendi · inceleme",
  live: "Yayında",
  archived: "Arşiv",
  refunded: "İade",
};
const STATUS_COLOR: Record<string, string> = {
  draft: "#9a8c7a",
  paid: "#B8895A",
  live: "#2f7d55",
  archived: "#8a8a8a",
  refunded: "#b04a4a",
};

/** ISO → "DD.MM.YYYY" (deterministik, Date() yok → hydration güvenli). */
function fmtDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = iso.slice(0, 10).split("-");
  return d.length === 3 ? `${d[2]}.${d[1]}.${d[0]}` : iso;
}

function couple(inv: Invitation): string {
  if (inv.partner_one_name && inv.partner_two_name)
    return `${inv.partner_one_name} & ${inv.partner_two_name}`;
  return inv.partner_one_name || inv.slug;
}

export function AdminPanel({ invitations }: { invitations: Invitation[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const run = (id: string, fn: (id: string) => Promise<ActionResult>) => {
    setBusyId(id);
    setMsg(null);
    start(async () => {
      const r = await fn(id);
      setBusyId(null);
      if (r.ok) router.refresh();
      else setMsg(r.error ?? "Hata");
    });
  };

  const review = invitations.filter(
    (i) => i.status === "paid" || i.status === "draft",
  );
  const live = invitations.filter((i) => i.status === "live");
  const other = invitations.filter(
    (i) => !["paid", "draft", "live"].includes(i.status),
  );

  return (
    <main id="main" className="min-h-screen bg-bg px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-[1100px]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/10 pb-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand-cognac">
              NUVE Yönetim
            </p>
            <h1 className="mt-1 font-display text-2xl text-brand-ink">
              Davetiyeler
            </h1>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-brand-mute">
            <span>
              {review.length} inceleme · {live.length} yayında
            </span>
            <button
              onClick={() => start(async () => { await adminLogout(); router.refresh(); })}
              className="rounded-full border border-brand-ink/20 px-4 py-1.5 uppercase tracking-[0.18em] transition hover:border-brand-cognac"
            >
              Çıkış
            </button>
          </div>
        </header>

        {msg && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {msg}
          </p>
        )}

        <Section title="İnceleme bekleyen" count={review.length} empty="Şu an inceleme bekleyen davetiye yok.">
          {review.map((inv) => (
            <Row key={inv.id} inv={inv} busy={pending && busyId === inv.id}>
              <Btn onClick={() => run(inv.id, publishInvitation)} primary>
                Yayınla →
              </Btn>
            </Row>
          ))}
        </Section>

        <Section title="Yayında" count={live.length} empty="Henüz yayında davetiye yok.">
          {live.map((inv) => (
            <Row key={inv.id} inv={inv} busy={pending && busyId === inv.id}>
              <span className="text-[11px] text-brand-mute">
                Bitiş: {fmtDate(inv.live_until)}
              </span>
              <Btn onClick={() => run(inv.id, archiveInvitation)}>Geri çek</Btn>
            </Row>
          ))}
        </Section>

        {other.length > 0 && (
          <Section title="Arşiv / diğer" count={other.length} empty="">
            {other.map((inv) => (
              <Row key={inv.id} inv={inv} busy={pending && busyId === inv.id}>
                <Btn onClick={() => run(inv.id, publishInvitation)}>Tekrar yayınla</Btn>
              </Row>
            ))}
          </Section>
        )}
      </div>
    </main>
  );
}

function Section({
  title,
  count,
  empty,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-baseline gap-2 font-display text-lg text-brand-ink">
        {title}
        <span className="text-[12px] text-brand-mute">({count})</span>
      </h2>
      {count === 0 ? (
        empty ? <p className="text-[13px] text-brand-mute">{empty}</p> : null
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </section>
  );
}

function Row({
  inv,
  busy,
  children,
}: {
  inv: Invitation;
  busy: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-brand-ink/10 bg-paper px-4 py-3"
      style={{ opacity: busy ? 0.5 : 1 }}
    >
      <span
        className="rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-white"
        style={{ backgroundColor: STATUS_COLOR[inv.status] ?? "#888" }}
      >
        {STATUS_LABEL[inv.status] ?? inv.status}
      </span>
      <div className="min-w-[160px] flex-1">
        <p className="font-display text-[16px] text-brand-ink">{couple(inv)}</p>
        <p className="text-[11px] text-brand-mute">
          {inv.template_slug} · {fmtDate(inv.created_at)}
          {inv.owner_email ? ` · ${inv.owner_email}` : ""}
        </p>
      </div>
      <a
        href={`/i/${inv.slug}?token=${inv.admin_token}`}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] uppercase tracking-[0.18em] text-brand-ink underline-offset-4 hover:underline"
      >
        Önizle
      </a>
      <a
        href={`/editor/${inv.admin_token}`}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] uppercase tracking-[0.18em] text-brand-ink underline-offset-4 hover:underline"
      >
        Düzenle
      </a>
      {children}
    </div>
  );
}

function Btn({
  onClick,
  primary,
  children,
}: {
  onClick: () => void;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] transition hover:scale-[1.03] ${
        primary
          ? "bg-brand-ink text-bg"
          : "border border-brand-ink/25 text-brand-ink"
      }`}
    >
      {children}
    </button>
  );
}
