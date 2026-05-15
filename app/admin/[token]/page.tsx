import { notFound } from "next/navigation";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation, Rsvp } from "@/lib/db/types";

/**
 * GET /admin/[token]
 *
 * Token-gated admin view for a single invitation. The token is the
 * unique `admin_token` column we generated when the invitation was
 * created — anyone who has the URL can manage that invitation.
 * No password, no account: emailed-link style access.
 *
 * Shows: invitation status, key fields, full RSVP list, attendance
 * counts, allergies summary, and a CSV-download stub.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpRow = Pick<
  Rsvp,
  | "id"
  | "guest_name"
  | "guest_email"
  | "attendance"
  | "plus_one"
  | "plus_one_name"
  | "menu_choice"
  | "allergies"
  | "note"
  | "created_at"
>;

async function loadByToken(
  token: string,
): Promise<{ invitation: Invitation; rsvps: RsvpRow[] } | null> {
  const supabase = adminDb();
  const { data: inv, error: invErr } = await supabase
    .from("invitations")
    .select("*")
    .eq("admin_token", token)
    .single<Invitation>();
  if (invErr || !inv) return null;

  const { data: rsvps, error: rErr } = await supabase
    .from("rsvps")
    .select(
      "id, guest_name, guest_email, attendance, plus_one, plus_one_name, menu_choice, allergies, note, created_at",
    )
    .eq("invitation_id", inv.id)
    .order("created_at", { ascending: false });

  if (rErr) {
    console.error("[admin] failed to load RSVPs", rErr);
  }

  return { invitation: inv, rsvps: (rsvps ?? []) as RsvpRow[] };
}

export default async function AdminPage({
  params,
}: {
  params: { token: string };
}) {
  const result = await loadByToken(decodeURIComponent(params.token));
  if (!result) notFound();
  const { invitation: inv, rsvps } = result;

  const yes = rsvps.filter((r) => r.attendance === "yes").length;
  const no = rsvps.filter((r) => r.attendance === "no").length;
  const maybe = rsvps.filter((r) => r.attendance === "maybe").length;
  const plusOnes = rsvps.filter((r) => r.plus_one).length;
  const allergies = rsvps
    .map((r) => r.allergies)
    .filter((a): a is string => Boolean(a));

  return (
    <main className="min-h-[80vh] bg-bg py-16 lg:py-24">
      <div className="container-wide max-w-[1100px]">
        <header className="mb-12 border-b border-brand-ink/12 pb-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
            — Admin
          </span>
          <h1
            className="mt-4 font-display text-brand-ink"
            style={{
              fontSize: "clamp(36px, 5vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
            }}
          >
            {inv.partner_one_name && inv.partner_two_name ? (
              <>
                {inv.partner_one_name}{" "}
                <span className="italic text-brand-cognac">ve</span>{" "}
                {inv.partner_two_name}
              </>
            ) : (
              inv.slug
            )}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] uppercase tracking-[0.2em] text-brand-mute">
            <span>
              Edition:{" "}
              <span className="text-brand-ink">{inv.template_slug}</span>
            </span>
            <span>
              Tier: <span className="text-brand-ink">{inv.tier}</span>
            </span>
            <span>
              Status: <StatusPill status={inv.status} />
            </span>
            {inv.wedding_date && (
              <span>
                Date: <span className="text-brand-ink">{inv.wedding_date}</span>
              </span>
            )}
          </div>
        </header>

        {/* Quick stats */}
        <section className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="Yes" value={yes} highlight />
          <Stat label="Maybe" value={maybe} />
          <Stat label="No" value={no} />
          <Stat label="Plus-ones" value={plusOnes} />
        </section>

        {/* RSVP list */}
        <section>
          <div className="mb-5 flex items-end justify-between border-b border-brand-ink/12 pb-3">
            <h2 className="font-display text-[22px] text-brand-ink">RSVPs</h2>
            <div className="flex items-center gap-4">
              <span className="text-[11px] uppercase tracking-[0.22em] text-brand-mute">
                {rsvps.length} total
              </span>
              {rsvps.length > 0 && (
                <a
                  href={`/api/invitations/${encodeURIComponent(inv.slug)}/rsvps/export?token=${encodeURIComponent(inv.admin_token)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-ink/22 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
                  download
                >
                  CSV indir
                  <span aria-hidden>↓</span>
                </a>
              )}
            </div>
          </div>

          {rsvps.length === 0 ? (
            <p className="py-12 text-center text-[14px] text-brand-mute">
              Henüz yanıt yok. Linki gönderdikten sonra burası dolacak.
            </p>
          ) : (
            <ul className="divide-y divide-brand-ink/10">
              {rsvps.map((r) => (
                <li key={r.id} className="grid grid-cols-12 gap-3 py-4 text-[14px]">
                  <div className="col-span-12 md:col-span-4">
                    <p className="font-medium text-brand-ink">{r.guest_name}</p>
                    {r.guest_email && (
                      <p className="text-[12px] text-brand-mute">
                        {r.guest_email}
                      </p>
                    )}
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <AttendanceBadge attendance={r.attendance} />
                  </div>
                  <div className="col-span-3 md:col-span-2 text-brand-ink/70">
                    {r.plus_one ? `+1${r.plus_one_name ? ` (${r.plus_one_name})` : ""}` : "—"}
                  </div>
                  <div className="col-span-6 md:col-span-4 text-brand-ink/70">
                    {[r.menu_choice, r.allergies, r.note]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Allergies summary */}
        {allergies.length > 0 && (
          <section className="mt-12 border-t border-brand-ink/12 pt-8">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Alerji notları
            </h2>
            <ul className="space-y-2 text-[14px] text-brand-ink/80">
              {allergies.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </section>
        )}

        <footer className="mt-16 border-t border-brand-ink/12 pt-6 text-[11px] uppercase tracking-[0.22em] text-brand-mute">
          NUVE Admin · Bu URL’i kimseyle paylaşma · {inv.live_until ? `Yayında: ${inv.live_until.slice(0, 10)}’a kadar` : ""}
        </footer>
      </div>
    </main>
  );
}

function Stat({
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
      className={`rounded-[8px] border p-5 ${
        highlight
          ? "border-brand-cognac/40 bg-brand-cognac/8"
          : "border-brand-ink/12 bg-paper"
      }`}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] text-brand-mute">
        {label}
      </p>
      <p
        className="mt-2 font-display text-brand-ink"
        style={{ fontSize: "36px", lineHeight: 1, letterSpacing: "-0.02em" }}
      >
        {value}
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: Invitation["status"] }) {
  const tone: Record<Invitation["status"], string> = {
    draft: "bg-brand-mute/15 text-brand-mute",
    paid: "bg-brand-cognac/15 text-brand-cognac",
    live: "bg-green-700/15 text-green-800",
    archived: "bg-brand-ink/10 text-brand-ink/60",
    refunded: "bg-red-700/15 text-red-700",
  };
  return (
    <span
      className={`ml-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${tone[status]}`}
    >
      {status}
    </span>
  );
}

function AttendanceBadge({ attendance }: { attendance: Rsvp["attendance"] }) {
  const styles: Record<Rsvp["attendance"], string> = {
    yes: "bg-green-700/15 text-green-800",
    maybe: "bg-amber-600/15 text-amber-800",
    no: "bg-red-700/12 text-red-700",
  };
  const label: Record<Rsvp["attendance"], string> = {
    yes: "Evet",
    maybe: "Belki",
    no: "Hayır",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${styles[attendance]}`}
    >
      {label[attendance]}
    </span>
  );
}
