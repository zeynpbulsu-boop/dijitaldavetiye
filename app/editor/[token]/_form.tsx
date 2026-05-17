"use client";

/**
 * EditorForm — FAZ A.4 client-side form for /editor/[token].
 *
 * Section layout: couple + date + venue (always shown), then a
 * "Lüks içerik" group with the LuxeEditionTheme copy fields (only
 * shown for the 6 luxe slugs).
 *
 * Submission: server action `saveInvitation`. We surface the
 * ok/message result inline — no toast library to keep the
 * dependency footprint minimal. Result clears 4s after success.
 */

import { useEffect, useState, useTransition } from "react";
import type { FormEvent } from "react";
import type { Invitation } from "@/lib/db/types";
import { saveInvitation, type SaveResult } from "./_actions";

interface EditorFormProps {
  token: string;
  invitation: Invitation;
  showLuxeFields: boolean;
}

export function EditorForm({
  token,
  invitation,
  showLuxeFields,
}: EditorFormProps) {
  const [result, setResult] = useState<SaveResult | null>(null);
  const [isPending, startTransition] = useTransition();

  /* Clear success banner after a beat so the form stops looking like
     a stale confirmation if the couple stays on the page. */
  useEffect(() => {
    if (!result?.ok) return;
    const id = window.setTimeout(() => setResult(null), 4000);
    return () => window.clearTimeout(id);
  }, [result]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const r = await saveInvitation(token, formData);
      setResult(r);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <Group title="Etkinlik" eyebrow="— Tip & Dil">
        <Row>
          <Select
            label="Etkinlik tipi"
            name="event_type"
            defaultValue={invitation.event_type}
            options={[
              { value: "wedding", label: "Düğün" },
              { value: "engagement", label: "Nişan" },
              { value: "henna", label: "Kına Gecesi" },
              { value: "save_the_date", label: "Save the Date" },
            ]}
            hint="Davetiyenin başlıkları ve geri sayım metni buna göre değişir."
          />
          <Select
            label="Dil"
            name="locale"
            defaultValue={invitation.locale}
            options={[
              { value: "tr", label: "Türkçe" },
              { value: "en", label: "English" },
              { value: "sr", label: "Srpski" },
            ]}
            hint="Davetiyenin tüm metinleri bu dilde gösterilir."
          />
        </Row>
      </Group>

      <Group title="Çift" eyebrow="— Kimlik">
        <Row>
          <Field
            label="İlk isim"
            name="partner_one_name"
            defaultValue={invitation.partner_one_name ?? ""}
            placeholder="Defne"
          />
          <Field
            label="İkinci isim"
            name="partner_two_name"
            defaultValue={invitation.partner_two_name ?? ""}
            placeholder="Aras"
          />
        </Row>
        <Row>
          <Field
            label="Monogram"
            name="monogram_initials"
            defaultValue={invitation.monogram_initials ?? ""}
            placeholder="D&A"
            hint="Mühürde gösterilecek 2-3 harf."
          />
          <Field
            label="Düğün tarihi"
            name="wedding_date"
            type="date"
            defaultValue={invitation.wedding_date ?? ""}
            hint="Boş bırakırsanız varsayılan tarih görünür."
          />
        </Row>
      </Group>

      <Group title="Mekan" eyebrow="— Adres">
        <Row>
          <Field
            label="Mekan adı"
            name="venue_name"
            defaultValue={invitation.venue_name ?? ""}
            placeholder="Aethel's Chapel"
          />
          <Field
            label="Şehir"
            name="venue_city"
            defaultValue={invitation.venue_city ?? ""}
            placeholder="Toskana"
          />
        </Row>
        <Field
          label="Açık adres"
          name="venue_address"
          defaultValue={invitation.venue_address ?? ""}
          placeholder="Via dei Cipressi, 18"
        />
      </Group>

      {showLuxeFields && (
        <Group title="Lüks içerik" eyebrow="— Kopya">
          <p className="text-[13px] leading-[1.7] text-brand-mute">
            Boş bırakılan alanlar için seçtiğiniz edisyonun varsayılan
            metinleri gösterilir.
          </p>
          <Field
            label="Karşılama (zarf)"
            name="greeting"
            defaultValue={invitation.greeting ?? ""}
            placeholder="Bir davet sizi bekliyor"
          />
          <Row>
            <Field
              label="Hero eyebrow"
              name="hero_eyebrow"
              defaultValue={invitation.hero_eyebrow ?? ""}
              placeholder="Evleniyoruz"
            />
            <Field
              label="Hero CTA"
              name="hero_cta"
              defaultValue={invitation.hero_cta ?? ""}
              placeholder="Bizimle olur musun?"
            />
          </Row>
          <Row>
            <Field
              label="Zarf açma CTA"
              name="envelope_cta"
              defaultValue={invitation.envelope_cta ?? ""}
              placeholder="Davetiyeyi Aç"
            />
            <Field
              label="Müzik parçası"
              name="music_track"
              defaultValue={invitation.music_track ?? ""}
              placeholder="Clair de Lune · Claude Debussy"
            />
          </Row>
          <Field
            label="Footer alt-yazı"
            name="footer_note"
            defaultValue={invitation.footer_note ?? ""}
            placeholder="Bizimle olmanız bizi onurlandırır"
          />
        </Group>
      )}

      <Group title="Hediye / IBAN" eyebrow="— Banka Bilgileri">
        <p className="text-[13px] leading-[1.7] text-brand-mute">
          IBAN doluysa davetiyenin sonunda &quot;kopyala&quot; butonuyla bir
          banka kartı görünür. Boş bırakırsan bu bölüm gizlenir.
        </p>
        <Row>
          <Field
            label="IBAN"
            name="gift_iban"
            defaultValue={invitation.gift_iban ?? ""}
            placeholder="TR00 0000 0000 0000 0000 0000 00"
          />
          <Field
            label="Banka"
            name="gift_bank"
            defaultValue={invitation.gift_bank ?? ""}
            placeholder="Garanti BBVA"
          />
        </Row>
        <Field
          label="Hesap sahibi"
          name="gift_account_holder"
          defaultValue={invitation.gift_account_holder ?? ""}
          placeholder="Defne &amp; Aras"
        />
        <Field
          label="Ek not (opsiyonel)"
          name="gift_note"
          defaultValue={invitation.gift_note ?? ""}
          placeholder="Açıklama alanına ismini yazabilir misin?"
          hint="Türk geleneği: altın takma yerine banka tercih edenler için kısa bir mesaj."
        />
      </Group>

      <Group title="Mühür rengi" eyebrow="— Tema">
        <p className="text-[13px] leading-[1.7] text-brand-mute">
          Mühürün üzerinde mix-blend-multiply ile bindirilir; boş
          bırakırsan edisyonun varsayılan rengi geçerli olur. Düğün
          renklerine uyacak bir hex değer dene.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            name="wax_seal_color"
            defaultValue={invitation.wax_seal_color ?? "#7A8A6E"}
            className="h-11 w-16 cursor-pointer rounded-md border border-brand-ink/15 bg-white"
          />
          <span className="text-[12px] text-brand-mute">
            Çıkarmak için renk seçiciyi varsayılan dışı bir tona çek, sonra
            kutuyu boşalt — kayıttan sonra varsayılan rengi alır.
          </span>
        </div>
      </Group>

      <div className="flex flex-wrap items-center gap-4 border-t border-brand-ink/12 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="btn-couture disabled:opacity-50"
        >
          {isPending ? "Kaydediliyor…" : "Kaydet"}
        </button>
        <a
          href={`/i/${invitation.slug}`}
          target="_blank"
          rel="noopener"
          className="text-[11px] uppercase tracking-[0.22em] text-brand-mute hover:text-brand-ink"
        >
          Önizle ↗
        </a>
        {result && (
          <span
            role="status"
            className={`text-[12px] uppercase tracking-[0.2em] ${
              result.ok ? "text-brand-cognac" : "text-red-600"
            }`}
          >
            {result.message}
          </span>
        )}
      </div>
    </form>
  );
}

function Group({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-cognac">
          {eyebrow}
        </span>
        <h2
          className="mt-2 font-display text-brand-ink"
          style={{
            fontSize: "clamp(22px, 3vw, 28px)",
            letterSpacing: "-0.015em",
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

function Select({
  label,
  name,
  defaultValue,
  options,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  const id = `field-${name}`;
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-brand-ink">
        {label}
      </span>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="block w-full rounded-md border border-brand-ink/15 bg-white px-3 py-2.5 text-[14px] text-brand-ink shadow-ed-sm transition focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && (
        <span className="block text-[11px] leading-[1.5] text-brand-mute">
          {hint}
        </span>
      )}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  type?: "text" | "date";
  defaultValue?: string;
  placeholder?: string;
  hint?: string;
}) {
  const id = `field-${name}`;
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="block text-[11px] font-medium uppercase tracking-[0.2em] text-brand-ink">
        {label}
      </span>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="block w-full rounded-md border border-brand-ink/15 bg-white px-3 py-2.5 text-[14px] text-brand-ink shadow-ed-sm transition placeholder:text-brand-ink/30 focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/30"
      />
      {hint && (
        <span className="block text-[11px] leading-[1.5] text-brand-mute">
          {hint}
        </span>
      )}
    </label>
  );
}
