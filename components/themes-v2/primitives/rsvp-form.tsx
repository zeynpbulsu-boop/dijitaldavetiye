"use client";

import { useEffect, useState, useTransition, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";
import { bestTextOn, relativeLuminance } from "@/lib/themes-v2/contrast";
import { useInvitationT } from "../i18n-context";

interface Props {
  meta: ThemeV2Meta;
  title?: string;
  slug?: string;
}

type Attendance = "yes" | "no" | "maybe" | null;
type Side = "bride" | "groom" | "both" | null;

export function RsvpForm({ meta, slug }: Props) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const str = useInvitationT();
  // Hata rengi zemin parlaklığına göre: açık temada bordo, koyu temada
  // okunur gül tonu (geceyarisi'nde 3.29 → 7.84 kontrast).
  const errorInk = relativeLuminance(palette.bg) > 0.5 ? "#B14848" : "#E29A93";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState<Attendance>(null);
  const [side, setSide] = useState<Side>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
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
            invitation_slug: slug,
            guest_name: name.trim(),
            guest_email: email.trim() || undefined,
            attendance,
            side: side ?? undefined,
            guest_count: attendance === "no" ? undefined : guestCount,
            plus_one: plusOne,
            plus_one_name: plusOne ? plusOneName.trim() || undefined : undefined,
            allergies: dietary.trim() || undefined,
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
            className="relative mt-10 overflow-hidden rounded-sm p-10 text-center"
            style={{
              border: `1px solid ${palette.ink}24`,
              backgroundColor: palette.paper,
              boxShadow: "0 10px 30px -16px rgba(0,0,0,0.18)",
            }}
          >
            {!reduced && attendance === "yes" && (
              <ConfettiBurst accent={palette.accent} ink={palette.ink} />
            )}
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
                placeholder={str.rsvp.namePlaceholder}
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
                placeholder={str.rsvp.emailPlaceholder}
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

            {attendance !== "no" && (
              <>
                <div>
                  <p
                    className="mb-3 text-[10px] uppercase"
                    style={{ letterSpacing: "0.36em", color: palette.inkSoft, fontWeight: 500 }}
                  >
                    {str.rsvp.side}
                  </p>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={str.rsvp.side}>
                    {(
                      [
                        ["bride", str.rsvp.sideBride],
                        ["groom", str.rsvp.sideGroom],
                        ["both", str.rsvp.sideBoth],
                      ] as const
                    ).map(([val, label]) => {
                      const active = side === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSide(active ? null : val)}
                          className="rounded-full py-3 text-[11px] font-semibold uppercase transition"
                          style={{
                            letterSpacing: "0.28em",
                            border: `1px solid ${active ? palette.accent : `${palette.ink}30`}`,
                            backgroundColor: active ? palette.accent : "transparent",
                            color: active ? bestTextOn(palette.accent) : palette.ink,
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p
                    className="mb-3 text-[10px] uppercase"
                    style={{ letterSpacing: "0.36em", color: palette.inkSoft, fontWeight: 500 }}
                  >
                    {str.rsvp.guestCount}
                  </p>
                  <div
                    className="inline-flex items-center gap-5 rounded-full px-4 py-2"
                    style={{ border: `1px solid ${palette.ink}30` }}
                  >
                    <button
                      type="button"
                      aria-label="−"
                      onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] transition hover:scale-110 disabled:opacity-30"
                      disabled={guestCount <= 1}
                      style={{ color: palette.accent }}
                    >
                      −
                    </button>
                    <span
                      aria-live="polite"
                      className="min-w-[2ch] text-center font-display"
                      style={{ fontSize: 20, color: palette.ink }}
                    >
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      aria-label="+"
                      onClick={() => setGuestCount((n) => Math.min(20, n + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[18px] transition hover:scale-110 disabled:opacity-30"
                      disabled={guestCount >= 20}
                      style={{ color: palette.accent }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}

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
                  placeholder={str.rsvp.plusOnePlaceholder}
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

            {attendance !== "no" && (
              <Field label={str.rsvp.dietary} ink={palette.ink} inkSoft={palette.inkSoft}>
                <input
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder={str.rsvp.dietaryPlaceholder}
                  className="w-full bg-transparent pb-2 outline-none placeholder:opacity-40"
                  style={{
                    borderBottom: `1px solid ${palette.ink}40`,
                    fontFamily: "var(--font-display), serif",
                    fontSize: 16,
                    color: palette.ink,
                  }}
                />
              </Field>
            )}

            <Field
              label={str.rsvp.note}
              ink={palette.ink}
              inkSoft={palette.inkSoft}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder={str.rsvp.notePlaceholder}
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
              <p className="text-center text-[13px]" style={{ color: errorInk }}>
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

/* ── Konfeti kutlaması — "evet" yanıtında bir kez patlar ─────────────────
 * GPU-dostu: yalnız transform+opacity, span başına CSS yok, framer ile
 * tek seferlik animasyon. useEffect'te üretilir (SSR/hydration güvenli);
 * reduced-motion'da çağıran taraf hiç render etmez. */
function ConfettiBurst({ accent, ink }: { accent: string; ink: string }) {
  const [pieces, setPieces] = useState<
    { style: CSSProperties; x: number; y: number; rotate: number; duration: number; delay: number }[]
  >([]);

  useEffect(() => {
    // Palet türevi konfeti — her tema kendi ailesinden patlar (sabit altın
    // koyu/soğuk temalarda yabancı kalıyordu). Son renk: accent'in açık tint'i.
    const colors = [accent, ink, `${accent}99`, tint(accent, 0.45)];
    setPieces(
      Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.35;
        const dist = 80 + Math.random() * 140;
        return {
          style: {
            left: "50%",
            top: "38%",
            width: 5 + Math.random() * 5,
            height: 8 + Math.random() * 6,
            backgroundColor: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : 1,
          } as CSSProperties,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 70,
          rotate: 300 + Math.random() * 480,
          duration: 0.9 + Math.random() * 0.7,
          delay: 0.25 + Math.random() * 0.15,
        };
      }),
    );
  }, [accent, ink]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={p.style}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, opacity: 0 }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.2, 0.6, 0.4, 1] }}
        />
      ))}
    </div>
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

/* Accent'i beyaza doğru k oranında açar — konfeti/parıltı tint'i için. */
function tint(hex: string, k: number): string {
  const m = hex.replace("#", "");
  const c = (i: number) => parseInt(m.slice(i, i + 2), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * k).toString(16).padStart(2, "0");
  return `#${mix(c(0))}${mix(c(2))}${mix(c(4))}`;
}
