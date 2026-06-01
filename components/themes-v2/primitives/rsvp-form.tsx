"use client";

import { useState, useTransition } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";
import { bestTextOn } from "@/lib/themes-v2/contrast";
import { useInvitationT } from "../i18n-context";

interface Props {
  meta: ThemeV2Meta;
  title?: string;
  slug?: string;
}

type Attendance = "yes" | "no" | "maybe" | null;

export function RsvpForm({ meta, slug }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<Attendance>(null);
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !attendance) return;
    setError(null);

    if (!slug) {
      setSubmitted(true);
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            guest_name: name.trim(),
            guest_email: email.trim() || undefined,
            attendance,
            plus_one: plusOne,
            plus_one_name: plusOne ? plusOneName.trim() || undefined : undefined,
            note: note.trim() || undefined,
          }),
        });
        if (!res.ok) throw new Error("Bir hata oluştu, tekrar dener misiniz?");
        setSubmitted(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <section
      className="px-6 py-24 lg:py-32"
      style={{ backgroundColor: palette.bg }}
    >
      <div className="mx-auto max-w-[620px]">
        <div className="text-center">
          <p
            className="text-[10.5px] uppercase"
            style={{
              color: palette.accent,
              letterSpacing: "0.42em",
              fontWeight: 500,
            }}
          >
            {str.rsvp.eyebrow}
          </p>
          <p
            className="mt-4 font-display italic"
            style={{
              fontSize: "clamp(32px, 4vw, 50px)",
              color: palette.ink,
              letterSpacing: "0.005em",
              filter: "url(#ink-bleed)",
            }}
          >
            {str.rsvp.title}
          </p>
          <div className="mx-auto my-6 h-px w-14 opacity-50" style={{ background: palette.ink }} />
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-sm p-10 text-center"
            style={{
              border: `1px solid ${palette.ink}24`,
              backgroundColor: palette.paper,
              boxShadow: "0 10px 30px -16px rgba(0,0,0,0.18)",
            }}
          >
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: palette.accent,
                color: bestTextOn(palette.accent),
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22">
                <path d="M 4 11 L 9 16 L 18 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p
              className="font-display italic"
              style={{
                fontSize: "clamp(24px, 2.8vw, 32px)",
                color: palette.ink,
              }}
            >
              {str.rsvp.successTitle} {name.split(" ")[0]}
            </p>
            <p
              className="mt-3 font-display italic"
              style={{ fontSize: 16, color: palette.inkSoft, lineHeight: 1.65 }}
            >
              {str.rsvp.successBody}
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9 }}
            onSubmit={submit}
            className="mt-10 space-y-7 rounded-sm p-8 sm:p-12"
            style={{
              border: `1px solid ${palette.ink}1a`,
              backgroundColor: palette.paper,
              boxShadow: "0 14px 32px -20px rgba(0,0,0,0.2)",
            }}
          >
            <Field label={str.rsvp.name} required ink={palette.ink} inkSoft={palette.inkSoft}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız ve soyadınız"
                required
                className="w-full bg-transparent pb-2 outline-none placeholder:opacity-40"
                style={{
                  borderBottom: `1px solid ${palette.ink}40`,
                  fontFamily: "var(--font-display), serif",
                  fontSize: 17,
                  color: palette.ink,
                }}
              />
            </Field>

            <Field label={str.rsvp.email} ink={palette.ink} inkSoft={palette.inkSoft}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                className="w-full bg-transparent pb-2 outline-none placeholder:opacity-40"
                style={{
                  borderBottom: `1px solid ${palette.ink}40`,
                  fontFamily: "var(--font-display), serif",
                  fontSize: 17,
                  color: palette.ink,
                }}
              />
            </Field>

            <div>
              <p
                className="mb-3 text-[10px] uppercase"
                style={{
                  letterSpacing: "0.36em",
                  color: palette.inkSoft,
                  fontWeight: 500,
                }}
              >
                {str.rsvp.attendance} <span style={{ color: palette.accent }}>*</span>
              </p>
              <div
                className="grid grid-cols-3 gap-2"
                role="radiogroup"
                aria-label={str.rsvp.attendance}
                aria-required="true"
              >
                {(
                  [
                    ["yes", str.rsvp.yes],
                    ["maybe", str.rsvp.maybe],
                    ["no", str.rsvp.no],
                  ] as const
                ).map(([val, label]) => {
                  const active = attendance === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setAttendance(val)}
                      className="rounded-full py-3 text-[11px] font-semibold uppercase transition"
                      style={{
                        letterSpacing: "0.28em",
                        border: `1px solid ${active ? palette.accent : `${palette.ink}30`}`,
                        backgroundColor: active ? palette.accent : "transparent",
                        color: active ? bestTextOn(palette.accent) : palette.ink,
                        transform: active ? "scale(1.02)" : "scale(1)",
                        boxShadow: active ? "0 6px 14px -6px rgba(0,0,0,0.2)" : "none",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                className="flex items-center gap-3"
                style={{ color: palette.inkSoft, fontSize: 14 }}
              >
                <input
                  type="checkbox"
                  checked={plusOne}
                  onChange={(e) => setPlusOne(e.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: palette.accent }}
                />
                <span className="font-display italic">{str.rsvp.plusOne}</span>
              </label>
              {plusOne && (
                <motion.input
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  value={plusOneName}
                  onChange={(e) => setPlusOneName(e.target.value)}
                  placeholder="Misafirin adı"
                  className="mt-3 w-full bg-transparent pb-2 outline-none placeholder:opacity-40"
                  style={{
                    borderBottom: `1px solid ${palette.ink}40`,
                    fontFamily: "var(--font-display), serif",
                    fontSize: 16,
                    color: palette.ink,
                  }}
                />
              )}
            </div>

            <Field
              label="Not (alerji, mesaj vs.)"
              ink={palette.ink}
              inkSoft={palette.inkSoft}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="İletmek istediğiniz herhangi bir şey…"
                className="w-full resize-none bg-transparent p-3 outline-none placeholder:opacity-40"
                style={{
                  border: `1px solid ${palette.ink}24`,
                  fontFamily: "var(--font-display), serif",
                  fontSize: 16,
                  color: palette.ink,
                  borderRadius: 2,
                  lineHeight: 1.5,
                }}
              />
            </Field>

            {error && (
              <p className="text-center text-[13px]" style={{ color: "#b14848" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!name.trim() || !attendance || pending}
              className="block w-full rounded-full py-4 text-[11px] font-semibold uppercase transition disabled:opacity-40"
              style={{
                letterSpacing: "0.4em",
                backgroundColor: palette.ink,
                color: palette.paper,
                boxShadow: "0 12px 28px -14px rgba(0,0,0,0.4)",
              }}
            >
              {pending ? str.rsvp.submitting : str.rsvp.submit}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
  ink,
  inkSoft,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  ink: string;
  inkSoft: string;
}) {
  return (
    <div>
      <p
        className="mb-2 text-[10px] uppercase"
        style={{
          letterSpacing: "0.36em",
          color: inkSoft,
          fontWeight: 500,
        }}
      >
        {label}
        {required && <span style={{ color: ink, marginLeft: 4 }}>*</span>}
      </p>
      {children}
    </div>
  );
}
