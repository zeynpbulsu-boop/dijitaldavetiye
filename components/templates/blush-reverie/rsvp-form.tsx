"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { InvitationData } from "@/lib/templates/types";

interface RsvpFormProps {
  data: InvitationData;
  onBack: () => void;
  onSubmit: () => void;
}

interface RsvpPayload {
  fullName: string;
  attendance: "accept" | "decline";
  plusOne: string;
  menu: "standard" | "vegetarian" | "gluten-free";
  note: string;
}

const initial: RsvpPayload = {
  fullName: "",
  attendance: "accept",
  plusOne: "",
  menu: "standard",
  note: "",
};

/**
 * Quiet RSVP — no card UI, no shadows, no submit-button drama.
 * Field labels in mono small caps, inputs as plain underlined text.
 * Like filling in a magazine subscription card from 1972.
 */
export function RsvpForm({ data, onBack, onSubmit }: RsvpFormProps) {
  const [form, setForm] = useState<RsvpPayload>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = <K extends keyof RsvpPayload>(key: K, val: RsvpPayload[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setDone(true);
    setTimeout(onSubmit, 1400);
  };

  if (done) {
    return (
      <section className="flex h-full w-full flex-col items-center justify-center bg-[#F5EDDB] px-8 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5C544B]">
          — Received
        </span>
        <h2
          className="mt-4 font-display"
          style={{
            fontSize: "clamp(44px, 14vw, 64px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 120, "SOFT" 100, "WONK" 1',
            color: "#A65B3E",
          }}
        >
          Thank you.
        </h2>
        <p className="mt-6 max-w-[280px] text-[15px] leading-[1.55] text-[#5C544B]">
          We will hold a chair for you on {new Date(data.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}.
        </p>
      </section>
    );
  }

  return (
    <section className="relative h-full w-full overflow-y-auto bg-[#F5EDDB] px-7 pb-12 pt-12 text-[#1F1B17]">
      <button
        type="button"
        onClick={onBack}
        className="mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8A7F73] transition-colors hover:text-[#1F1B17]"
      >
        ← Back to the invitation
      </button>

      <div className="mb-10 border-b border-[#1F1B17]/15 pb-8">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-[#5C544B]"
          style={{ fontFamily: "ui-monospace, SF Mono, monospace" }}
        >
          — R.S.V.P
        </span>
        <h2
          className="mt-4 font-display"
          style={{
            fontSize: "clamp(40px, 12vw, 56px)",
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            fontVariationSettings: '"opsz" 96, "SOFT" 50',
          }}
        >
          A line, in reply.
        </h2>
        <p className="mt-3 text-[13px] text-[#5C544B]">
          Please respond by{" "}
          {data.rsvpDeadline
            ? new Date(data.rsvpDeadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
              })
            : "the spring"}
          .
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <Field label="Your name">
          <input
            required
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="—"
            className="rsvp-input"
          />
        </Field>

        <Field label="Attendance">
          <div className="flex gap-3 pt-1">
            <Choice
              checked={form.attendance === "accept"}
              onClick={() => update("attendance", "accept")}
              label="Joyfully"
            />
            <Choice
              checked={form.attendance === "decline"}
              onClick={() => update("attendance", "decline")}
              label="Regretfully"
            />
          </div>
        </Field>

        <Field label="Plus one (optional)">
          <input
            value={form.plusOne}
            onChange={(e) => update("plusOne", e.target.value)}
            placeholder="Name, if any"
            className="rsvp-input"
          />
        </Field>

        <Field label="Menu">
          <div className="flex flex-wrap gap-3 pt-1">
            {(["standard", "vegetarian", "gluten-free"] as const).map((m) => (
              <Choice
                key={m}
                checked={form.menu === m}
                onClick={() => update("menu", m)}
                label={m === "standard" ? "Standard" : m === "vegetarian" ? "Vegetarian" : "Gluten-free"}
              />
            ))}
          </div>
        </Field>

        <Field label="A note (optional)">
          <textarea
            rows={2}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Anything you'd like us to know"
            className="rsvp-input resize-none"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="group relative w-full border-t border-[#1F1B17] py-6 text-left disabled:opacity-50"
        >
          <span
            className="font-display text-[24px] text-[#1F1B17] transition-colors group-hover:text-[#A65B3E]"
            style={{
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 96, "SOFT" 100, "WONK" 1',
            }}
          >
            {submitting ? "Sending..." : "Send reply"}
          </span>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[24px] text-[#A65B3E]">
            →
          </span>
        </button>
      </form>

      <style jsx>{`
        :global(.rsvp-input) {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(31, 27, 23, 0.2);
          padding: 8px 0;
          font-family: var(--font-display), Georgia, serif;
          font-style: italic;
          font-size: 18px;
          color: #1f1b17;
        }
        :global(.rsvp-input:focus) {
          outline: none;
          border-bottom-color: #a65b3e;
        }
        :global(.rsvp-input::placeholder) {
          color: #b3a89c;
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[#5C544B]"
        style={{ fontFamily: "ui-monospace, SF Mono, monospace" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Choice({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-4 py-2 text-[12px] font-medium uppercase tracking-[0.2em] transition-colors " +
        (checked
          ? "border border-[#1F1B17] bg-[#1F1B17] text-[#F5EDDB]"
          : "border border-[#1F1B17]/25 text-[#5C544B] hover:border-[#1F1B17] hover:text-[#1F1B17]")
      }
    >
      {label}
    </button>
  );
}
