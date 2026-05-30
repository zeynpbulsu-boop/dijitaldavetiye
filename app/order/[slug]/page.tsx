"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { startCheckout } from "@/lib/payments/checkout-client";
import { STANDARD_TIER } from "@/lib/payments/products";
import { resolveThemeV2Slug } from "@/lib/themes-v2/bridge";
import { THEMES_V2 } from "@/lib/themes-v2/registry";
import { THEME_THUMB, THEME_CEREMONY } from "@/lib/themes-v2/assets";
import { CustomCoverGenerator } from "@/components/order/custom-cover-generator";
import type {
  HotelItem,
  PhotoItem,
  EventType,
  DbLocale,
} from "@/lib/db/types";

/** Derive whether a hex background is dark (for legibility overlays). */
function isHexDark(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
}

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

interface ScheduleItem {
  time: string;
  title: string;
  desc?: string;
}

export default function OrderEditorPage() {
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateSlug = params?.slug ?? "geceyarisi";
  // Flat pricing (Faz 20): only one tier. Query param ignored.
  void searchParams;

  const [draft, setDraft] = useState<DraftStore | null>(null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");

  /* ─── IDENTITY ─── */
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [monogram, setMonogram] = useState("");
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [locale, setLocale] = useState<DbLocale>("tr");

  /* ─── LOGISTICS ─── */
  const [date, setDate] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [venueAddress, setVenueAddress] = useState("");

  /* ─── STORY / COPY ─── */
  const [story, setStory] = useState("");
  const [greeting, setGreeting] = useState("");
  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [footerNote, setFooterNote] = useState("");

  /* ─── MEDIA ─── */
  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);
  const [musicTrack, setMusicTrack] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  /* ─── PROGRAM (Schedule) ─── */
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  /* ─── GIFT BLOCK ─── */
  const [giftIban, setGiftIban] = useState("");
  const [giftBank, setGiftBank] = useState("");
  const [giftAccountHolder, setGiftAccountHolder] = useState("");
  const [giftNote, setGiftNote] = useState("");

  /* ─── HOTELS ─── */
  const [hotels, setHotels] = useState<HotelItem[]>([]);

  /* ─── CONTACT ─── */
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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
            setMonogram(String(inv.monogram_initials ?? ""));
            setEventType((inv.event_type as EventType) ?? "wedding");
            setLocale((inv.locale as DbLocale) ?? "tr");
            setDate(String(inv.wedding_date ?? ""));
            setVenueName(String(inv.venue_name ?? ""));
            setVenueCity(String(inv.venue_city ?? ""));
            setVenueAddress(String(inv.venue_address ?? ""));
            setStory(String(inv.story_text ?? ""));
            setGreeting(String(inv.greeting ?? ""));
            setHeroEyebrow(String(inv.hero_eyebrow ?? ""));
            setFooterNote(String(inv.footer_note ?? ""));
            setCustomCoverUrl(
              typeof inv.hero_media_url === "string" ? inv.hero_media_url : null
            );
            setMusicTrack(String(inv.music_track ?? ""));
            setPhotos(Array.isArray(inv.photos) ? (inv.photos as PhotoItem[]) : []);
            setGiftIban(String(inv.gift_iban ?? ""));
            setGiftBank(String(inv.gift_bank ?? ""));
            setGiftAccountHolder(String(inv.gift_account_holder ?? ""));
            setGiftNote(String(inv.gift_note ?? ""));
            setHotels(Array.isArray(inv.hotels) ? (inv.hotels as HotelItem[]) : []);
            setEmail(String(inv.owner_email ?? ""));
            setPhone(String(inv.owner_phone ?? ""));
            return;
          }
          // Token invalid / not found → clear and create fresh
          window.localStorage.removeItem(storageKey);
        } catch {
          /* fall through to create */
        }
      }

      // Create fresh draft (flat €39.99 tier = "standard")
      const create = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_slug: templateSlug, tier: STANDARD_TIER }),
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
        tier: STANDARD_TIER,
        invitationId: draft.id,
        email: email || undefined,
        name: p1 && p2 ? `${p1} & ${p2}` : undefined,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ödeme başlatılamadı.");
      setPaying(false);
    }
  }

  /* ---------- Schedule helpers ---------- */
  function updateSchedule(next: ScheduleItem[]) {
    setSchedule(next);
    // Schedule stored as JSONB array on backend later (no DB col yet);
    // for now persisted via story_text fallback omitted, persisted to
    // a future schedule column if added.
  }
  function addScheduleItem() {
    updateSchedule([...schedule, { time: "", title: "", desc: "" }]);
  }
  function removeScheduleItem(idx: number) {
    updateSchedule(schedule.filter((_, i) => i !== idx));
  }
  function patchScheduleItem(idx: number, patch: Partial<ScheduleItem>) {
    updateSchedule(
      schedule.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  }

  /* ---------- Hotels helpers ---------- */
  function persistHotels(next: HotelItem[]) {
    setHotels(next);
    persist({ hotels: next });
  }
  function addHotel() {
    persistHotels([...hotels, { name: "" }]);
  }
  function removeHotel(idx: number) {
    persistHotels(hotels.filter((_, i) => i !== idx));
  }
  function patchHotel(idx: number, patch: Partial<HotelItem>) {
    persistHotels(hotels.map((h, i) => (i === idx ? { ...h, ...patch } : h)));
  }

  /* ---------- Photos helpers ---------- */
  function persistPhotos(next: PhotoItem[]) {
    setPhotos(next);
    persist({ photos: next });
  }
  function addPhoto() {
    persistPhotos([...photos, { url: "", caption: "" }]);
  }
  function removePhoto(idx: number) {
    persistPhotos(photos.filter((_, i) => i !== idx));
  }
  function patchPhoto(idx: number, patch: Partial<PhotoItem>) {
    persistPhotos(photos.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }

  /* ---------- Completion progress (form % filled) ----------
     14 important field/section → ratio of filled. Couples görsel
     olarak ne kadar tamamladıklarını görsünler. */
  const completionItems = [
    p1.length > 0,
    p2.length > 0,
    monogram.length > 0,
    date.length > 0,
    venueName.length > 0,
    venueCity.length > 0,
    venueAddress.length > 0,
    story.length > 0,
    greeting.length > 0 || heroEyebrow.length > 0,
    schedule.length > 0,
    photos.length > 0,
    !!customCoverUrl,
    giftIban.length > 0,
    hotels.length > 0,
    email.length > 0,
  ];
  const completedCount = completionItems.filter(Boolean).length;
  const completionPct = Math.round(
    (completedCount / completionItems.length) * 100,
  );

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
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
                  — Editör
                </span>
                <h1
                  className="mt-3 font-display text-brand-ink"
                  style={{
                    fontSize: "clamp(32px, 4vw, 48px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Davetinin{" "}
                  <span className="italic text-brand-cognac">hikâyesi</span>.
                </h1>
              </div>
              {/* Progress badge — 15 alanın kaçı dolu */}
              <div className="hidden flex-shrink-0 sm:block">
                <div className="flex items-center gap-3 rounded-full border border-brand-ink/15 bg-paper px-4 py-2">
                  <div className="relative h-9 w-9">
                    <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="rgba(43,30,22,0.1)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="rgb(140,90,60)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={`${(completionPct / 100) * 88} 88`}
                        style={{ transition: "stroke-dasharray 0.6s ease" }}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-brand-ink">
                      {completionPct}%
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-mute">
                      Tamamlandı
                    </span>
                    <span className="text-[11px] text-brand-ink">
                      {completedCount}/{completionItems.length} alan
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-brand-ink/70">
              Tüm değişiklikler kendiliğinden kaydediliyor. Hazır olduğunda
              aşağıdan ödemeyi tamamla — davetiyen anında canlıya alınır.
            </p>
          </header>

          {/* EDITION SWITCHER — 6 tasarım thumbnail, tıkla değiştir */}
          <Section label="Tasarımı değiştir">
            <p className="mb-4 text-[13px] leading-[1.7] text-brand-mute">
              Her tasarımın kendi atmosferi, müziği ve sahnesi var. Aşağıdan
              istediğin zaman değiştirebilirsin — formdaki bilgiler korunur.
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {Object.values(THEMES_V2).map((t) => {
                const isActive = resolveThemeV2Slug(templateSlug) === t.slug;
                return (
                  <Link
                    key={t.slug}
                    href={`/order/${t.slug}`}
                    data-cursor="view"
                    data-cursor-label={t.name}
                    aria-label={`${t.name} tasarımına geç`}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative overflow-hidden rounded-[8px] transition-all duration-300 ${
                      isActive
                        ? "ring-2 ring-brand-cognac ring-offset-2"
                        : "opacity-75 hover:opacity-100 hover:-translate-y-1"
                    }`}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={THEME_THUMB[t.slug]}
                        alt={t.name}
                        fill
                        sizes="(max-width: 640px) 33vw, 14vw"
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 px-1.5 py-1.5"
                        style={{
                          background:
                            "linear-gradient(0deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 100%)",
                        }}
                      >
                        <span
                          className="block text-center text-[10px] uppercase tracking-[0.22em] text-white"
                          style={{ fontFamily: "var(--font-display), serif" }}
                        >
                          {t.name}
                        </span>
                      </div>
                      {isActive && (
                        <span
                          aria-hidden
                          className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-cognac text-[10px] font-semibold text-paper shadow-md"
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Section>

          <Section label="Etkinlik">
            <Row>
              <Field label="Etkinlik tipi" hint="Başlık ve metinler buna göre uyarlanır.">
                <select
                  value={eventType}
                  onChange={(e) => {
                    const v = e.target.value as EventType;
                    setEventType(v);
                    persist({ event_type: v });
                  }}
                  className={inputClass}
                >
                  <option value="wedding">Düğün</option>
                  <option value="engagement">Nişan</option>
                  <option value="henna">Kına Gecesi</option>
                  <option value="save_the_date">Save the Date</option>
                  <option value="birthday">Doğum Günü</option>
                </select>
              </Field>
              <Field label="Dil" hint="Misafirlerinin göreceği varsayılan dil.">
                <select
                  value={locale}
                  onChange={(e) => {
                    const v = e.target.value as DbLocale;
                    setLocale(v);
                    persist({ locale: v });
                  }}
                  className={inputClass}
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="sr">Srpski</option>
                </select>
              </Field>
            </Row>
          </Section>

          <Section label="Çift">
            <Row>
              <Field label="Birinci isim" hint="Davetiyede önce yazılan.">
                <input
                  type="text"
                  value={p1}
                  onChange={bind(setP1, "partner_one_name")}
                  placeholder="Elif"
                  className={inputClass}
                />
              </Field>
              <Field label="İkinci isim" hint="& işaretinden sonra yazılan.">
                <input
                  type="text"
                  value={p2}
                  onChange={bind(setP2, "partner_two_name")}
                  placeholder="Mert"
                  className={inputClass}
                />
              </Field>
            </Row>
            <Field label="Monogram" hint="Mührde basılı olacak — iki harf veya N&E.">
              <input
                type="text"
                value={monogram}
                onChange={bind(setMonogram, "monogram_initials")}
                placeholder="E&M"
                maxLength={6}
                className={inputClass}
              />
            </Field>
          </Section>

          <Section label="Tarih ve mekân">
            <Row>
              <Field label="Etkinlik tarihi" hint="Geri sayım buna göre işler.">
                <input
                  type="date"
                  value={date}
                  onChange={bind(setDate, "wedding_date")}
                  className={inputClass}
                />
              </Field>
              <Field label="Şehir" hint="Misafirler için yön belirleyici.">
                <input
                  type="text"
                  value={venueCity}
                  onChange={bind(setVenueCity, "venue_city")}
                  placeholder="Bodrum"
                  className={inputClass}
                />
              </Field>
            </Row>
            <Field label="Mekân adı" hint="Yalı, otel, bahçe — tam adı.">
              <input
                type="text"
                value={venueName}
                onChange={bind(setVenueName, "venue_name")}
                placeholder="Aman Yalı"
                className={inputClass}
              />
            </Field>
            <Field
              label="Açık adres"
              hint="Misafirler harita üzerinden yön alacak — açık sokak/yol bilgisi."
            >
              <input
                type="text"
                value={venueAddress}
                onChange={bind(setVenueAddress, "venue_address")}
                placeholder="Cevatpaşa Mah. 2024 Sok. No:3"
                className={inputClass}
              />
            </Field>
          </Section>

          <Section label="Karşılama metinleri">
            <Field
              label="Zarftaki karşılama"
              hint="Davetiye açılmadan önce zarfın üstündeki tek satır."
            >
              <input
                type="text"
                value={greeting}
                onChange={bind(setGreeting, "greeting")}
                placeholder="Bir davet sizi bekliyor"
                className={inputClass}
                maxLength={80}
              />
            </Field>
            <Field
              label="Hero üst yazısı"
              hint="Hero kısmında, isimlerin üstünde küçük tanıtım."
            >
              <input
                type="text"
                value={heroEyebrow}
                onChange={bind(setHeroEyebrow, "hero_eyebrow")}
                placeholder="Evleniyoruz"
                className={inputClass}
                maxLength={40}
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

          {/* PROGRAM — schedule items list, couples can add/remove. */}
          <Section label="Program">
            <p className="mb-4 text-[13px] leading-[1.6] text-brand-mute">
              Misafirlerin günü saat saat takip etmesi için. İstersen
              tek satır, istersen 5-6 maddelik tam program ekle.
            </p>
            <ul className="space-y-3">
              {schedule.map((it, i) => (
                <li
                  key={i}
                  className="rounded-[8px] border border-brand-ink/12 bg-paper p-4"
                >
                  <Row>
                    <Field label="Saat">
                      <input
                        type="time"
                        value={it.time}
                        onChange={(e) => patchScheduleItem(i, { time: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Başlık">
                      <input
                        type="text"
                        value={it.title}
                        onChange={(e) => patchScheduleItem(i, { title: e.target.value })}
                        placeholder="Tören · Bahçede"
                        className={inputClass}
                      />
                    </Field>
                  </Row>
                  <Field label="Açıklama (opsiyonel)">
                    <input
                      type="text"
                      value={it.desc ?? ""}
                      onChange={(e) => patchScheduleItem(i, { desc: e.target.value })}
                      placeholder="Mum ışığında nikah ve fotoğraf seansı"
                      className={inputClass}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeScheduleItem(i)}
                    className="mt-2 text-[11px] uppercase tracking-[0.2em] text-brand-mute hover:text-red-700"
                  >
                    × Sil
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addScheduleItem}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-brand-ink/30 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-brand-ink/70 transition hover:border-brand-cognac hover:text-brand-cognac"
            >
              + Program satırı ekle
            </button>
          </Section>

          {/* ÖZEL KAPAK — AI custom cover (€39.99 paketine dahil). */}
          <Section label="Özel kapak (AI illüstrasyon)">
            <p className="mb-4 text-[13px] leading-[1.6] text-brand-mute">
              Mekânının veya sahnenin tarifini yaz, sana özel illüstrasyon
              üretelim. <strong>€39.99 pakete dahil</strong> — istediğin kadar
              varyant üretebilirsin.
            </p>
            <CustomCoverGenerator
              edition={templateSlug}
              initialUrl={customCoverUrl}
              onSaved={(url) => {
                setCustomCoverUrl(url);
                persist({ hero_media_url: url });
              }}
            />
          </Section>

          {/* GALERİ — couple foto URL'leri (şimdilik URL paste; sonra Supabase upload). */}
          <Section label="Fotoğraf galerisi">
            <p className="mb-4 text-[13px] leading-[1.6] text-brand-mute">
              Sevdiğiniz fotolardan 4-8 tane ekleyin. Polaroid çerçeveli mosaic
              olarak görünür. Fotonun internetteki tam URL&apos;si yeterli.
            </p>
            <ul className="space-y-3">
              {photos.map((p, i) => (
                <li
                  key={i}
                  className="rounded-[8px] border border-brand-ink/12 bg-paper p-4"
                >
                  <Field label="Foto URL">
                    <input
                      type="url"
                      value={p.url}
                      onChange={(e) => patchPhoto(i, { url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Caption (opsiyonel)">
                    <input
                      type="text"
                      value={p.caption ?? ""}
                      onChange={(e) => patchPhoto(i, { caption: e.target.value })}
                      placeholder="our first trip"
                      className={inputClass}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="mt-2 text-[11px] uppercase tracking-[0.2em] text-brand-mute hover:text-red-700"
                  >
                    × Sil
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addPhoto}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-brand-ink/30 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-brand-ink/70 transition hover:border-brand-cognac hover:text-brand-cognac"
            >
              + Foto ekle
            </button>
          </Section>

          <Section label="Müzik">
            <Field
              label="Çalacak parça (etiket)"
              hint="Sayfa müziği için kullanılacak şarkı adı / sanatçı bilgisi. Ses linki sonra eklenecek."
            >
              <input
                type="text"
                value={musicTrack}
                onChange={bind(setMusicTrack, "music_track")}
                placeholder="Clair de Lune · Claude Debussy"
                className={inputClass}
              />
            </Field>
          </Section>

          <Section label="Hediye / IBAN (opsiyonel)">
            <p className="mb-4 text-[13px] leading-[1.6] text-brand-mute">
              Misafirler hediye için banka bilgilerine ulaşabilsin. Hiçbir
              alan zorunlu değil — boş bırakırsan section gizlenir.
            </p>
            <Row>
              <Field label="IBAN">
                <input
                  type="text"
                  value={giftIban}
                  onChange={bind(setGiftIban, "gift_iban")}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                  className={inputClass}
                />
              </Field>
              <Field label="Banka">
                <input
                  type="text"
                  value={giftBank}
                  onChange={bind(setGiftBank, "gift_bank")}
                  placeholder="Garanti BBVA"
                  className={inputClass}
                />
              </Field>
            </Row>
            <Field label="Hesap sahibi">
              <input
                type="text"
                value={giftAccountHolder}
                onChange={bind(setGiftAccountHolder, "gift_account_holder")}
                placeholder="Elif & Mert"
                className={inputClass}
              />
            </Field>
            <Field label="Açıklama (opsiyonel)">
              <input
                type="text"
                value={giftNote}
                onChange={bind(setGiftNote, "gift_note")}
                placeholder="Açıklamaya isimlerinizi yazmayı unutmayın"
                className={inputClass}
              />
            </Field>
          </Section>

          <Section label="Otel önerileri">
            <p className="mb-4 text-[13px] leading-[1.6] text-brand-mute">
              Şehir dışından gelen misafirler için 3-5 otel öner. Liste
              boşsa bu bölüm davetiyede gizlenir.
            </p>
            <ul className="space-y-3">
              {hotels.map((h, i) => (
                <li
                  key={i}
                  className="rounded-[8px] border border-brand-ink/12 bg-paper p-4"
                >
                  <Row>
                    <Field label="Otel adı">
                      <input
                        type="text"
                        value={h.name}
                        onChange={(e) => patchHotel(i, { name: e.target.value })}
                        placeholder="Alavya Hotel"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Mesafe / konum">
                      <input
                        type="text"
                        value={h.address ?? ""}
                        onChange={(e) => patchHotel(i, { address: e.target.value })}
                        placeholder="12 dk · Alaçatı merkez"
                        className={inputClass}
                      />
                    </Field>
                  </Row>
                  <Row>
                    <Field label="Fiyat (opsiyonel)">
                      <input
                        type="text"
                        value={h.price ?? ""}
                        onChange={(e) => patchHotel(i, { price: e.target.value })}
                        placeholder="€220"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Booking linki">
                      <input
                        type="url"
                        value={h.url ?? ""}
                        onChange={(e) => patchHotel(i, { url: e.target.value })}
                        placeholder="https://..."
                        className={inputClass}
                      />
                    </Field>
                  </Row>
                  <Field label="Açıklama (opsiyonel)">
                    <input
                      type="text"
                      value={h.note ?? ""}
                      onChange={(e) => patchHotel(i, { note: e.target.value })}
                      placeholder="Taş ev · spa + bahçe"
                      className={inputClass}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => removeHotel(i)}
                    className="mt-2 text-[11px] uppercase tracking-[0.2em] text-brand-mute hover:text-red-700"
                  >
                    × Sil
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={addHotel}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-brand-ink/30 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-brand-ink/70 transition hover:border-brand-cognac hover:text-brand-cognac"
            >
              + Otel ekle
            </button>
          </Section>

          <Section label="Footer notu">
            <Field
              label="Davetiyenin altındaki kısa söz"
              hint="Sayfanın en altında, isimlerinizin üstünde küçük bir vedalaşma."
            >
              <input
                type="text"
                value={footerNote}
                onChange={bind(setFooterNote, "footer_note")}
                placeholder="Bizimle olmanız bizi onurlandırır"
                className={inputClass}
                maxLength={120}
              />
            </Field>
          </Section>

          <Section label="Sana nasıl ulaşalım">
            <p className="mb-4 text-[13px] leading-[1.6] text-brand-mute">
              Ödeme makbuzu, admin panel linki ve RSVP bildirimleri için.
              Sadece sen göreceksin.
            </p>
            <Row>
              <Field label="E-posta" hint="Zorunlu — ödeme + admin link buraya.">
                <input
                  type="email"
                  value={email}
                  onChange={bind(setEmail, "owner_email")}
                  placeholder="elif@gmail.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Telefon (opsiyonel)" hint="WhatsApp bildirimi için.">
                <input
                  type="tel"
                  value={phone}
                  onChange={bind(setPhone, "owner_phone")}
                  placeholder="+90 555 000 00 00"
                  className={inputClass}
                />
              </Field>
            </Row>
          </Section>

          {/* Flat pricing — €39.99, hepsi dahil */}
          <Section label="Toplam">
            <div className="flex items-baseline gap-3 rounded-[8px] border border-brand-cognac/40 bg-brand-cognac/5 px-5 py-4">
              <span className="font-display text-[34px] leading-none text-brand-ink">
                €39,99
              </span>
              <span className="text-[12px] uppercase tracking-[0.22em] text-brand-ink/60">
                tek seferlik · 1 yıl yayın · hepsi dahil
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-[1.6] text-brand-ink/65">
              Bütün özellikler dahil: AI özel kapak, sınırsız fotoğraf,
              program, otel önerileri, harita, RSVP, müzik, çoklu dil ve özel
              alan adı. Hiçbir ek ücret yok. KDV + banka komisyonu Dodo
              Payments tarafında.
            </p>
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
              const v2slug = resolveThemeV2Slug(templateSlug);
              const v2 = THEMES_V2[v2slug];
              const pal = v2.palette;
              const isDark = isHexDark(pal.bg);
              const theme = {
                name: v2.name,
                bg: pal.bg,
                ink: pal.ink,
                inkSoft: pal.inkSoft,
                accent: pal.accent,
                monogramText: pal.accent,
                monogramFill: pal.paper,
                ruleColor: pal.accent,
                spark: pal.countdownBg,
                isDark,
              };
              const cover = THEME_THUMB[v2slug];
              const sealSrc = THEME_CEREMONY[v2slug]?.seal;
              const initials = monogram || (p1 && p2 ? `${p1[0]}&${p2[0]}` : (p1?.[0] ?? p2?.[0] ?? "♥"));
              return (
                <div className="overflow-hidden rounded-[12px] border border-brand-ink/12 bg-paper shadow-[0_12px_40px_-16px_rgba(43,30,22,0.18)]">
                  {/* Preview header */}
                  <div className="flex items-center justify-between border-b border-brand-ink/10 px-5 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
                      — Önizleme · {theme.name}
                    </p>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-brand-mute">
                      Canlı
                    </span>
                  </div>

                  {/* Themed preview canvas — Hero benzeri */}
                  <div
                    className="relative overflow-hidden text-center"
                    style={{
                      background: theme.bg,
                      color: theme.ink,
                      minHeight: 460,
                    }}
                  >
                    {/* Cover scene background — custom (premium) varsa onu, yoksa edition default */}
                    {(customCoverUrl || cover) && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{ opacity: theme.isDark ? 0.4 : 0.55 }}
                      >
                        <Image
                          src={customCoverUrl ?? cover}
                          alt=""
                          fill
                          sizes="(max-width: 1024px) 100vw, 460px"
                          style={{ objectFit: "cover" }}
                          priority={false}
                          unoptimized={!!customCoverUrl}
                        />
                        {/* Gradient overlay for legibility */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: theme.isDark
                              ? "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.55) 100%)"
                              : "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.4) 100%)",
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center px-7 py-10">
                      <p
                        className="text-[9px] font-semibold uppercase tracking-[0.42em]"
                        style={{ color: theme.accent }}
                      >
                        Evleniyoruz
                      </p>

                      {/* Real wax seal asset (luxe) veya fallback CSS daire */}
                      <div className="mt-6 flex h-[88px] w-[88px] items-center justify-center">
                        {sealSrc ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={sealSrc}
                              alt=""
                              fill
                              sizes="88px"
                              style={{
                                objectFit: "contain",
                                filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.35))",
                              }}
                              priority={false}
                            />
                            {/* Initials overlay on seal */}
                            <span
                              className="absolute inset-0 flex items-center justify-center font-display italic"
                              style={{
                                color: theme.monogramText,
                                fontSize: "22px",
                                lineHeight: 1,
                                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                              }}
                            >
                              {initials}
                            </span>
                          </div>
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center rounded-full shadow-[0_8px_18px_-6px_rgba(43,30,22,0.45)]"
                            style={{ background: theme.monogramFill }}
                          >
                            <span
                              className="font-display italic"
                              style={{
                                color: theme.monogramText,
                                fontSize: "26px",
                                lineHeight: 1,
                              }}
                            >
                              {initials}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Couple names — Pinyon Script calligraphy */}
                      <div
                        className="mt-7"
                        style={{
                          fontFamily: "var(--font-calligraphy), Georgia, serif",
                          color: theme.ink,
                        }}
                      >
                        <p style={{ fontSize: "44px", lineHeight: 1.05, letterSpacing: "0.01em" }}>
                          {p1 || "—"}
                        </p>
                        <p
                          className="my-1"
                          style={{
                            fontFamily: "var(--font-display), serif",
                            fontStyle: "italic",
                            fontSize: "13px",
                            color: theme.accent,
                            letterSpacing: "0.18em",
                            textTransform: "lowercase",
                          }}
                        >
                          ve
                        </p>
                        <p style={{ fontSize: "44px", lineHeight: 1.05, letterSpacing: "0.01em" }}>
                          {p2 || "—"}
                        </p>
                      </div>

                      {/* Decorative separator */}
                      <span
                        aria-hidden
                        className="my-6 inline-block"
                        style={{
                          width: 48,
                          height: 1,
                          background: theme.ruleColor,
                          opacity: 0.7,
                        }}
                      />

                      {date && (
                        <p
                          className="text-[11px] uppercase tracking-[0.32em]"
                          style={{ color: theme.inkSoft }}
                        >
                          {new Date(date).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      {(venueName || venueCity) && (
                        <p
                          className="mt-2 font-display italic"
                          style={{ color: theme.inkSoft, fontSize: "13px", letterSpacing: "0.01em" }}
                        >
                          {[venueName, venueCity].filter(Boolean).join(" · ")}
                        </p>
                      )}

                      {!p1 && !p2 && !date && (
                        <p
                          className="mt-3 text-[10px] uppercase tracking-[0.28em]"
                          style={{ color: theme.inkSoft, opacity: 0.6 }}
                        >
                          Soldaki alanlardan başla
                        </p>
                      )}
                    </div>
                  </div>

                  {/* "Demoyu tam aç" CTA — kullanıcı edition'ı full deneyimle inceleyebilir */}
                  <Link
                    href={`/themes/${v2slug}`}
                    target="_blank"
                    rel="noopener"
                    data-cursor="open"
                    data-cursor-label="Tam ekran"
                    className="group flex items-center justify-between gap-3 border-t border-brand-ink/10 bg-paper px-5 py-3 text-[10px] uppercase tracking-[0.26em] text-brand-mute transition hover:text-brand-cognac"
                  >
                    <span>Demoyu tam ekran aç</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                  </Link>

                  {/* Palette chips + slug label */}
                  <div className="flex items-center gap-2 border-t border-brand-ink/10 bg-paper px-5 py-3">
                    {[theme.accent, theme.ink, theme.monogramFill, theme.spark].map((c, i) => (
                      <span
                        key={i}
                        aria-hidden
                        className="h-4 w-4 rounded-full border border-brand-ink/12"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                    <span className="ml-auto text-[9px] uppercase tracking-[0.22em] text-brand-mute">
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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-brand-mute">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-[11px] leading-[1.5] text-brand-ink/55">
          {hint}
        </span>
      )}
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
