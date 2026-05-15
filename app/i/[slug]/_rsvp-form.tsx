"use client";

import { useState, type FormEvent } from "react";
import type { DbLocale } from "@/lib/db/types";

/**
 * RsvpForm — client component embedded inside /i/[slug].
 * Posts to /api/rsvp. Locale-aware labels pulled from RSVP_LABELS.
 * On success, renders a soft thank-you card in the same place.
 */

const RSVP_LABELS: Record<
  DbLocale,
  {
    name: string;
    email: string;
    attendance: string;
    yes: string;
    no: string;
    maybe: string;
    plus_one: string;
    plus_one_name: string;
    menu: string;
    allergies: string;
    note: string;
    submit: string;
    submitting: string;
    success_title: string;
    success_body: string;
    success_again: string;
    err_required: string;
    err_send: string;
    placeholder_name: string;
    placeholder_email: string;
    placeholder_plus_one_name: string;
    placeholder_menu: string;
    placeholder_allergies: string;
    placeholder_note: string;
  }
> = {
  tr: {
    name: "Adın",
    email: "E-posta (opsiyonel)",
    attendance: "Geleceğin durumu",
    yes: "Evet, geliyorum",
    maybe: "Belki",
    no: "Hayır, gelemeyeceğim",
    plus_one: "Yanımda biri olacak",
    plus_one_name: "Eşlikçinin adı",
    menu: "Menü tercihi (opsiyonel)",
    allergies: "Alerji notu (opsiyonel)",
    note: "Çifte küçük bir not (opsiyonel)",
    submit: "Yanıtı gönder",
    submitting: "Gönderiliyor…",
    success_title: "Teşekkürler.",
    success_body: "Yanıtın bize ulaştı. Düğün gününde görüşmek üzere.",
    success_again: "Başka biri için de yanıt vermek istiyorum",
    err_required: "Adın ve geleceğin durumu zorunlu.",
    err_send: "Gönderilemedi. Lütfen birkaç saniye sonra tekrar dene.",
    placeholder_name: "Berke Bulsu",
    placeholder_email: "berke@example.com",
    placeholder_plus_one_name: "Zeynep",
    placeholder_menu: "Vejetaryen / Et / Balık",
    placeholder_allergies: "Fındık alerjim var",
    placeholder_note: "Birkaç kelime…",
  },
  en: {
    name: "Your name",
    email: "Email (optional)",
    attendance: "Will you attend?",
    yes: "Yes, I'll be there",
    maybe: "Maybe",
    no: "No, I can't make it",
    plus_one: "I'm bringing someone",
    plus_one_name: "Their name",
    menu: "Menu preference (optional)",
    allergies: "Allergy note (optional)",
    note: "A short note for the couple (optional)",
    submit: "Send response",
    submitting: "Sending…",
    success_title: "Thank you.",
    success_body: "Your response is with us. See you on the day.",
    success_again: "Submit another response",
    err_required: "Your name and attendance are required.",
    err_send: "Couldn't send. Please try again in a few seconds.",
    placeholder_name: "Sam Reilly",
    placeholder_email: "sam@example.com",
    placeholder_plus_one_name: "Alex",
    placeholder_menu: "Vegetarian / Meat / Fish",
    placeholder_allergies: "Nut allergy",
    placeholder_note: "A few words…",
  },
  sr: {
    name: "Tvoje ime",
    email: "Mejl (opciono)",
    attendance: "Hoćeš li doći?",
    yes: "Da, dolazim",
    maybe: "Možda",
    no: "Ne, ne mogu",
    plus_one: "Dolazim sa nekim",
    plus_one_name: "Ime osobe",
    menu: "Izbor menija (opciono)",
    allergies: "Napomena o alergijama (opciono)",
    note: "Kratka poruka mladencima (opciono)",
    submit: "Pošalji odgovor",
    submitting: "Šaljem…",
    success_title: "Hvala.",
    success_body: "Tvoj odgovor je primljen. Vidimo se na dan svadbe.",
    success_again: "Pošalji još jedan odgovor",
    err_required: "Ime i potvrda dolaska su obavezni.",
    err_send: "Slanje nije uspelo. Pokušaj ponovo za par sekundi.",
    placeholder_name: "Marko Petrović",
    placeholder_email: "marko@example.com",
    placeholder_plus_one_name: "Ana",
    placeholder_menu: "Vegetarijanski / Meso / Riba",
    placeholder_allergies: "Alergija na orahe",
    placeholder_note: "Nekoliko reči…",
  },
};

export function RsvpForm({ slug, locale }: { slug: string; locale: DbLocale }) {
  const L = RSVP_LABELS[locale];

  const [name, setName] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no" | "maybe" | "">("");
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [menu, setMenu] = useState("");
  const [allergies, setAllergies] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !attendance) {
      setErr(L.err_required);
      return;
    }
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_slug: slug,
          guest_name: name.trim(),
          guest_email: emailVal.trim() || undefined,
          attendance,
          plus_one: plusOne,
          plus_one_name: plusOne ? plusOneName.trim() || undefined : undefined,
          menu_choice: menu.trim() || undefined,
          allergies: allergies.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErr(body.error ?? L.err_send);
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setErr(L.err_send);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setName("");
    setEmailVal("");
    setAttendance("");
    setPlusOne(false);
    setPlusOneName("");
    setMenu("");
    setAllergies("");
    setNote("");
    setDone(false);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-[500px] rounded-[10px] border border-brand-cognac/40 bg-brand-cognac/8 p-8 text-center">
        <span aria-hidden className="inline-block text-brand-cognac" style={{ fontSize: "28px" }}>
          ✦
        </span>
        <h3
          className="mt-3 font-display text-brand-ink"
          style={{ fontSize: "28px", lineHeight: 1.15 }}
        >
          {L.success_title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-brand-ink/75">
          {L.success_body}
        </p>
        <button
          type="button"
          onClick={resetForm}
          className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-cognac underline decoration-brand-cognac/40 underline-offset-4 transition hover:decoration-brand-cognac"
        >
          {L.success_again} →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-[560px] space-y-6 rounded-[10px] border border-brand-ink/12 bg-paper p-7 lg:p-9"
    >
      <Field label={L.name}>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={L.placeholder_name}
          className={inputClass}
        />
      </Field>

      <Field label={L.email}>
        <input
          type="email"
          value={emailVal}
          onChange={(e) => setEmailVal(e.target.value)}
          placeholder={L.placeholder_email}
          className={inputClass}
        />
      </Field>

      <fieldset>
        <legend className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-brand-mute">
          {L.attendance}
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(["yes", "maybe", "no"] as const).map((v) => (
            <label
              key={v}
              className={`flex cursor-pointer items-center justify-center rounded-[6px] border px-3 py-2.5 text-[13px] transition ${
                attendance === v
                  ? "border-brand-cognac bg-brand-cognac/10 text-brand-ink"
                  : "border-brand-ink/20 text-brand-ink/70 hover:border-brand-cognac/50"
              }`}
            >
              <input
                type="radio"
                name="attendance"
                value={v}
                checked={attendance === v}
                onChange={() => setAttendance(v)}
                className="sr-only"
              />
              {L[v]}
            </label>
          ))}
        </div>
      </fieldset>

      {attendance === "yes" && (
        <>
          <label className="flex items-center gap-2 text-[13px] text-brand-ink/85">
            <input
              type="checkbox"
              checked={plusOne}
              onChange={(e) => setPlusOne(e.target.checked)}
              className="h-4 w-4 accent-brand-cognac"
            />
            {L.plus_one}
          </label>

          {plusOne && (
            <Field label={L.plus_one_name}>
              <input
                type="text"
                value={plusOneName}
                onChange={(e) => setPlusOneName(e.target.value)}
                placeholder={L.placeholder_plus_one_name}
                className={inputClass}
              />
            </Field>
          )}

          <Field label={L.menu}>
            <input
              type="text"
              value={menu}
              onChange={(e) => setMenu(e.target.value)}
              placeholder={L.placeholder_menu}
              className={inputClass}
            />
          </Field>

          <Field label={L.allergies}>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder={L.placeholder_allergies}
              className={inputClass}
            />
          </Field>
        </>
      )}

      <Field label={L.note}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={L.placeholder_note}
          rows={3}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </Field>

      {err && (
        <p className="rounded-[4px] bg-red-700/8 px-3 py-2 text-[13px] text-red-800">
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-cognac px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-cream transition hover:bg-brand-ink disabled:opacity-50 sm:w-auto"
      >
        {submitting ? L.submitting : L.submit}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-[6px] border border-brand-ink/20 bg-paper px-3.5 py-3 text-[15px] text-brand-ink transition focus:border-brand-cognac focus:outline-none focus:ring-2 focus:ring-brand-cognac/20 placeholder:text-brand-mute/55";

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
