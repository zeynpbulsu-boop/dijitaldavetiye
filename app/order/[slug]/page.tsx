"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { startCheckout } from "@/lib/payments/checkout-client";
import { isTierSlug, type TierSlug } from "@/lib/payments/products";
import { themeForSlug } from "@/lib/templates/themes";

/**
 * /order/[slug] — invitation editor.
 *
 * Flow:
 *   1. On mount, look in localStorage for a saved draft keyed by the
 *      template slug. If found → load its admin_token and PATCH live.
 *      If not → POST /api/invitations to mint a new draft, save token.
 *   2. Each text input is bound to local state; on blur or after 800ms
 *      idle, a debounced PATCH writes the latest values to the DB.
 *   3. "Devam et — Öde ve yayınla" calls startCheckout({ tier, invitationId })
 *      which redirects to Dodo. After payment, webhook flips status → 'paid'
 *      and the invitation becomes live.
 *
 * Owner remembers admin_token in localStorage; we surface the admin URL
 * once the draft is created so the user can bookmark it.
 */

type DraftStore = { id: string; slug: string; admin_token: string };

const STORAGE_PREFIX = "nuve.draft.";

export default function OrderEditorPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateSlug = params?.slug ?? "blush-reverie";
  // Flat pricing (Faz 20): only one tier. Query param ignored.
  void searchParams;
  const initialTier: TierSlug = "standard";
  void isTierSlug; // type still used in import for callers

  const [draft, setDraft] = useState<DraftStore | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [tier, setTier] = useState<TierSlug>(initialTier);

  // Form state
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [date, setDate] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [story, setStory] = useState("");
  const [monogram, setMonogram] = useState("");
  const [email, setEmail] = useState("");

  /* ---------- Boot: load existing draft or create new ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const storageKey = STORAGE_PREFIX + templateSlug;
      const raw = typeof window !== "undefined"
        ? window.localStorage.getItem(storageKey)
        : null;

      if (raw) {
        try {
          const stored = JSON.parse(raw) as DraftStore;
          // Re-hydrate from server
          const res = await fetch(
            `/api/invitations/${stored.slug}?token=${encodeURIComponent(stored.admin_token)}`,
          );
          if (res.ok) {
            const inv = (await res.json()) as Record<string, unknown>;
            if (cancelled) return;
            setDraft(stored);
            setP1(String(inv.partner_one_name ?? ""));
            setP2(String(inv.partner_two_name ?? ""));
            setDate(String(inv.wedding_date ?? ""));
            setVenueName(String(inv.venue_name ?? ""));
            setVenueCity(String(inv.venue_city ?? ""));
            setStory(String(inv.story_text ?? ""));
            setMonogram(String(inv.monogram_initials ?? ""));
            setEmail(String(inv.owner_email ?? ""));
            return;
          }
          // Token invalid / not found → clear and create fresh
          window.localStorage.removeItem(storageKey);
        } catch {
          /* fall through to create */
        }
      }

      // Create fresh draft
      const create = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_slug: templateSlug, tier }),
      });
      if (!create.ok) {
        const err = await create.text();
        if (!cancelled) setBootError(err || "Taslak oluşturulamadı.");
        return;
      }
      const fresh = (await create.json()) as DraftStore;
      if (cancelled) return;
      window.localStorage.setItem(storageKey, JSON.stringify(fresh));
      setDraft(fresh);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateSlug]);

  /* ---------- Debounced PATCH on field change ---------- */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    (patch: Record<string, unknown>) => {
      if (!draft) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaving("saving");
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/invitations/${draft.slug}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${draft.admin_token}`,
            },
            body: JSON.stringify(patch),
          });
          setSaving(res.ok ? "saved" : "idle");
          if (res.ok) {
            setTimeout(() => setSaving("idle"), 1200);
          }
        } catch {
          setSaving("idle");
        }
      }, 800);
    },
    [draft],
  );

  // Wrap setters to also persist
  function bind<K extends string>(
    setter: (v: string) => void,
    key: K,
  ): (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void {
    return (e) => {
      setter(e.target.value);
      persist({ [key]: e.target.value });
    };
  }

  /* ---------- Pay & publish ---------- */
  const [paying, setPaying] = useState(false);
  async function onPay() {
    if (!draft) return;
    setPaying(true);
    try {
      await startCheckout({
        tier,
        invitationId: draft.id,
        email: email || undefined,
        name: p1 && p2 ? `${p1} & ${p2}` : undefined,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ödeme başlatılamadı.");
      setPaying(false);
    }
  }

  /* ---------- UI ---------- */
  if (bootError) {
    return (
      <main className="min-h-[80vh] bg-bg py-24">
        <div className="container-narrow text-center">
          <h1 className="font-display text-[36px] text-brand-ink">
            Bir aksilik oldu
          </h1>
          <p className="mt-3 text-brand-mute">{bootError}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-cognac px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-cream"
          >
            Tekrar dene
          </button>
        </div>
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="grid min-h-[80vh] place-items-center bg-bg">
        <p className="font-display italic text-brand-mute">taslağın hazırlanıyor…</p>
      </main>
    );
  }

  const adminUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/admin/${encodeURIComponent(draft.admin_token)}`
      : "";
  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/i/${draft.slug}`
      : "";

  return (
    <main className="min-h-screen bg-bg py-12 lg:py-16">
      <div className="container-wide grid grid-cols-12 gap-8 lg:gap-12">
        {/* LEFT — form */}
        <div className="col-span-12 lg:col-span-7">
          <header className="mb-10 border-b border-brand-ink/12 pb-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Editör
            </span>
            <h1
              className="mt-3 font-display text-brand-ink"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Davetinin{" "}
              <span className="italic text-brand-cognac">hikâyesi</span>.
            </h1>
            <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-brand-ink/70">
              Tüm değişiklikler kendiliğinden kaydediliyor. Hazır olduğunda
              aşağıdan ödemeyi tamamla — davetiyen 48 saatte canlıya alınır.
            </p>
          </header>

          <Section label="Çift">
            <Row>
              <Field label="Birinci isim">
                <input
                  type="text"
                  value={p1}
                  onChange={bind(setP1, "partner_one_name")}
                  placeholder="Elif"
                  className={inputClass}
                />
              </Field>
              <Field label="İkinci isim">
                <input
                  type="text"
                  value={p2}
                  onChange={bind(setP2, "partner_two_name")}
                  placeholder="Mert"
                  className={inputClass}
                />
              </Field>
            </Row>
            <Field label="Monogram (iki harf ya da N&E)">
              <input
                type="text"
                value={monogram}
                onChange={bind(setMonogram, "monogram_initials")}
                placeholder="N&E"
                maxLength={6}
                className={inputClass}
              />
            </Field>
          </Section>

          <Section label="Tarih ve mekân">
            <Row>
              <Field label="Düğün tarihi">
                <input
                  type="date"
                  value={date}
                  onChange={bind(setDate, "wedding_date")}
                  className={inputClass}
                />
              </Field>
              <Field label="Şehir">
                <input
                  type="text"
                  value={venueCity}
                  onChange={bind(setVenueCity, "venue_city")}
                  placeholder="Bodrum"
                  className={inputClass}
                />
              </Field>
            </Row>
            <Field label="Mekân adı">
              <input
                type="text"
                value={venueName}
                onChange={bind(setVenueName, "venue_name")}
                placeholder="Aman Yalı"
                className={inputClass}
              />
            </Field>
          </Section>

          <Section label="Senin sesin">
            <Field label="Misafirlerine kısa bir not">
              <textarea
                value={story}
                onChange={bind(setStory, "story_text")}
                rows={5}
                placeholder="Mostar'da tanıştık. Yedi yıl sonra İstanbul'da, bir yalıda evleniyoruz. Sizi de yanımızda istiyoruz."
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </Field>
          </Section>

          <Section label="Sana nasıl ulaşalım">
            <Field label="E-posta">
              <input
                type="email"
                value={email}
                onChange={bind(setEmail, "owner_email")}
                placeholder="info@nuve.app"
                className={inputClass}
              />
            </Field>
          </Section>

          {/* Flat pricing — every NUVE invitation is €39.99 regardless of edition */}
          <Section label="Toplam">
            <div className="flex items-baseline gap-3 rounded-[8px] border border-brand-cognac/40 bg-brand-cognac/5 px-5 py-4">
              <span className="font-display text-[34px] leading-none text-brand-ink">
                €39,99
              </span>
              <span className="text-[12px] uppercase tracking-[0.22em] text-brand-ink/60">
                tek seferlik · 1 yıl yayın
              </span>
            </div>
            <p className="mt-2 text-[12px] text-brand-ink/55">
              Hangi tasarımı seçersen seç, fiyat sabit. KDV ve banka komisyonu Dodo Payments tarafında dahil edilir.
            </p>
            <button
              type="button"
              onClick={() => setTier("standard")}
              className="hidden"
              aria-hidden
            >
              {/* keeps the tier state referenced; UI is hidden */}
              standard
            </button>
          </Section>

          {/* Pay CTA */}
          <div className="mt-12 flex flex-col gap-4 border-t border-brand-ink/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <SaveStatus state={saving} />
            <button
              type="button"
              onClick={onPay}
              disabled={paying}
              className="inline-flex items-center gap-2 rounded-full bg-brand-cognac px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-cream shadow-[0_10px_30px_-8px_rgba(140,90,60,0.5)] transition hover:bg-brand-ink hover:shadow-[0_18px_40px_-10px_rgba(43,30,22,0.45)] disabled:opacity-50"
            >
              {paying ? "Yönlendiriliyor…" : "Devam et — Öde ve yayınla →"}
            </button>
          </div>
        </div>

        {/* RIGHT — preview + admin links */}
        <aside className="col-span-12 lg:col-span-5">
          <div className="sticky top-24">
            {(() => {
              const theme = themeForSlug(templateSlug);
              return (
                <div className="overflow-hidden rounded-[10px] border border-brand-ink/12 bg-paper">
                  {/* Preview header — neutral */}
                  <div className="border-b border-brand-ink/10 px-6 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
                      — Önizleme · {theme.name}
                    </p>
                  </div>

                  {/* Themed preview canvas */}
                  <div
                    className="p-8 text-center"
                    style={{ background: theme.bg, color: theme.ink }}
                  >
                    <p
                      className="text-[9px] font-semibold uppercase tracking-[0.32em]"
                      style={{ color: theme.accent }}
                    >
                      NUVE · {theme.name.toUpperCase()}
                    </p>

                    {/* Mini wax seal */}
                    <div
                      className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_8px_18px_-6px_rgba(43,30,22,0.45)]"
                      style={{ background: theme.monogramFill }}
                    >
                      <span
                        className="font-display italic"
                        style={{
                          color: theme.monogramText,
                          fontSize: "24px",
                          lineHeight: 1,
                        }}
                      >
                        {monogram ||
                          (p1 && p2 ? `${p1[0]}&${p2[0]}` : "N")}
                      </span>
                    </div>

                    <p
                      className="mt-5 font-display"
                      style={{
                        color: theme.ink,
                        fontSize: "28px",
                        lineHeight: 1.05,
                        letterSpacing: "-0.012em",
                      }}
                    >
                      {p1 || "—"}
                    </p>
                    <p
                      className="font-display italic"
                      style={{ color: theme.accent, fontSize: "16px", lineHeight: 1.4 }}
                    >
                      ve
                    </p>
                    <p
                      className="font-display"
                      style={{
                        color: theme.ink,
                        fontSize: "28px",
                        lineHeight: 1.05,
                        letterSpacing: "-0.012em",
                      }}
                    >
                      {p2 || "—"}
                    </p>

                    {date && (
                      <div className="mt-5 inline-flex items-center gap-2">
                        <span aria-hidden className="h-px w-6" style={{ background: theme.ruleColor }} />
                        <span
                          className="text-[10px] uppercase tracking-[0.24em]"
                          style={{ color: theme.inkSoft }}
                        >
                          {date}
                        </span>
                        <span aria-hidden className="h-px w-6" style={{ background: theme.ruleColor }} />
                      </div>
                    )}
                    {(venueName || venueCity) && (
                      <p
                        className="mt-2 font-display italic"
                        style={{ color: theme.inkSoft, fontSize: "13px" }}
                      >
                        {[venueName, venueCity].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>

                  {/* Palette chips */}
                  <div className="flex items-center gap-2 border-t border-brand-ink/10 px-6 py-3">
                    {[theme.bg, theme.ink, theme.accent, theme.monogramFill, theme.spark].map(
                      (c, i) => (
                        <span
                          key={i}
                          aria-hidden
                          className="h-5 w-5 rounded-full border border-brand-ink/12"
                          style={{ background: c }}
                          title={c}
                        />
                      ),
                    )}
                    <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-brand-mute">
                      {templateSlug}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="mt-6 rounded-[10px] border border-brand-cognac/30 bg-brand-cognac/8 p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
                — Bookmark et
              </p>
              <p className="mt-3 text-[12px] leading-relaxed text-brand-ink/80">
                Bu iki linki kaybetme. Admin sayfası RSVP’lerin geleceği yer;
                public link davetiyen canlıya alındığında çalışmaya başlar.
              </p>
              <CopyRow label="Admin (sadece sen)" value={adminUrl} />
              <CopyRow label="Davetiye (misafirler)" value={publicUrl} />
            </div>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-brand-mute hover:text-brand-cognac"
            >
              <span aria-hidden>←</span> Anasayfa
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-[6px] border border-brand-ink/20 bg-paper px-3.5 py-3 font-[var(--font-sans)] text-[15px] text-brand-ink transition focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/20 placeholder:text-brand-mute/55";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <p className="mb-5 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
        — {label}
      </p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-brand-mute">
        {label}
      </span>
      {children}
    </label>
  );
}

function SaveStatus({ state }: { state: "idle" | "saving" | "saved" }) {
  const map = {
    idle: { text: "Kendiliğinden kaydediliyor", dot: "bg-brand-ink/25" },
    saving: { text: "Kaydediliyor…", dot: "bg-brand-cognac animate-pulse" },
    saved: { text: "Kaydedildi", dot: "bg-green-700/70" },
  };
  const cur = map[state];
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brand-mute">
      <span className={`block h-1.5 w-1.5 rounded-full ${cur.dot}`} />
      {cur.text}
    </span>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-brand-mute">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <code className="flex-1 truncate rounded-[4px] bg-brand-ink/4 px-2 py-1 text-[11px] text-brand-ink/80">
          {value || "—"}
        </code>
        <button
          type="button"
          onClick={() => {
            if (!value) return;
            navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="rounded-full border border-brand-ink/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-ink/75 transition hover:border-brand-cognac hover:text-brand-cognac"
        >
          {copied ? "Kopyalandı" : "Kopyala"}
        </button>
      </div>
    </div>
  );
}
