"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import type { TemplateComponentProps, InvitationData } from "@/lib/templates/types";
import type { EditorialTheme } from "./theme";
import { formatLongDateEn, formatDotDate } from "@/lib/format";
import { Countdown } from "./countdown";
import { RsvpForm } from "../blush-reverie/rsvp-form";

interface EditorialBaseProps extends TemplateComponentProps {
  theme: EditorialTheme;
}

/**
 * Single-scroll editorial template. Reads theme tokens and renders
 * 4–6 sections based on what each edition enables.
 *
 * @deprecated FAZ 2B — Will be removed once every edition migrates to
 *   the slot architecture (EditionRenderer + composition + per-edition
 *   bespoke slot components). Do NOT use for new editions. New work
 *   should declare an EditionComposition and pass it to
 *   <EditionRenderer />. This file is preserved verbatim and exposed
 *   via a re-export shim at the old path so the existing 8 editions
 *   keep rendering identically while we migrate them one by one.
 *
 *   Migration tracking: AUDIT.md FAZ 2D — Per-edition slot fill.
 */
export function EditorialBase({ data, isPreview, theme }: EditorialBaseProps) {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  return (
    <>
      <div
        className="h-full w-full overflow-y-auto"
        style={{ background: theme.bg, color: theme.ink, scrollBehavior: "smooth" }}
      >
        <Arrival data={data} theme={theme} />
        <Prologue data={data} theme={theme} />
        <Programme data={data} theme={theme} />
        {theme.showPortrait && <Portrait data={data} theme={theme} />}
        {theme.showLetter && <Letter data={data} theme={theme} />}
        <Close data={data} theme={theme} onRsvp={() => setRsvpOpen(true)} />
      </div>

      {rsvpOpen && (
        <div className="absolute inset-0 z-40" style={{ background: theme.bg }}>
          <RsvpForm data={data} onBack={() => setRsvpOpen(false)} onSubmit={() => setRsvpOpen(false)} />
        </div>
      )}

      {isPreview && (
        <div className="absolute left-1/2 top-3 z-50 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          Demo
        </div>
      )}
    </>
  );
}

/* ─────────── 1. ARRIVAL ─────────── */

function Arrival({ data, theme }: { data: InvitationData; theme: EditorialTheme }) {
  const hasPhoto = !!data.coverPhoto;
  return (
    <section className="relative h-full min-h-[100%] w-full">
      {hasPhoto && (
        <Image src={data.coverPhoto!} alt="" fill sizes="100vw" priority className="object-cover" />
      )}
      <div aria-hidden className="absolute inset-0" style={{ background: theme.coverOverlay }} />

      <div className="absolute left-5 right-5 top-7 flex items-baseline justify-between text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: hasPhoto ? "rgba(255,255,255,0.85)" : theme.muted }}>
        <span>{theme.arrivalLabel}</span>
        <span style={{ fontFamily: "ui-monospace, SF Mono, monospace" }}>№ 001</span>
      </div>

      <div className="absolute bottom-10 left-5 right-5" style={{ color: hasPhoto ? "white" : theme.ink }}>
        <div className="text-[9px] font-medium uppercase tracking-[0.4em]" style={{ color: hasPhoto ? "rgba(255,255,255,0.75)" : theme.muted }}>
          {formatLongDateEn(data.date)}
        </div>
        <h1
          className="mt-4 font-display"
          style={{
            fontSize: "clamp(56px, 18vw, 96px)",
            lineHeight: 0.85,
            letterSpacing: "-0.035em",
            fontVariationSettings: '"opsz" 144, "SOFT" 50',
          }}
        >
          {data.partnerOneFull ?? data.partnerOne}
          <br />
          <Amp theme={theme} />
          {" "}
          {data.partnerTwoFull ?? data.partnerTwo}
        </h1>
      </div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.3em]"
        style={{ color: hasPhoto ? "rgba(255,255,255,0.75)" : theme.muted }}
      >
        ↓
      </motion.div>
    </section>
  );
}

function Amp({ theme }: { theme: EditorialTheme }) {
  if (theme.ampersand === "italic") {
    return (
      <span
        style={{
          fontStyle: "italic",
          color: theme.accent,
          fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
        }}
      >
        &
      </span>
    );
  }
  if (theme.ampersand === "and") {
    return (
      <span style={{ fontStyle: "italic", color: theme.accent, fontSize: "0.55em", letterSpacing: "0.05em" }}>
        and
      </span>
    );
  }
  if (theme.ampersand === "et") {
    return <span style={{ fontStyle: "italic", color: theme.accent }}>et</span>;
  }
  return <span style={{ color: theme.accent }}>&</span>;
}

/* ─────────── 2. PROLOGUE ─────────── */

function Prologue({ data, theme }: { data: InvitationData; theme: EditorialTheme }) {
  const text = theme.prologue(data);
  return (
    <section className="border-b px-7 py-20" style={{ borderColor: theme.hairline }}>
      <SectionHeader label={theme.prologueLabel} num="002" theme={theme} />

      <p
        className="font-display"
        style={{
          fontSize: "clamp(22px, 6vw, 28px)",
          lineHeight: 1.35,
          letterSpacing: "-0.015em",
          fontVariationSettings: '"opsz" 72, "SOFT" 50',
          color: theme.ink,
        }}
      >
        <span
          className="float-left mr-3 mt-1"
          style={{
            fontSize: "clamp(72px, 18vw, 96px)",
            lineHeight: 0.8,
            letterSpacing: "-0.04em",
            fontFamily: "var(--font-display)",
          }}
        >
          {text.charAt(0)}
        </span>
        {text.slice(1)}
      </p>
    </section>
  );
}

/* ─────────── 3. PROGRAMME ─────────── */

function Programme({ data, theme }: { data: InvitationData; theme: EditorialTheme }) {
  const rows: [string, string][] = [
    ["Date", formatDotDate(data.date)],
    ["Hour", data.timeOfDay ?? "—"],
    ["Place", data.venue ?? data.location],
    ["City", data.location],
    ["Dress", "Black-tie optional"],
  ];

  return (
    <section className="border-b px-7 py-20" style={{ borderColor: theme.hairline }}>
      <SectionHeader label={theme.programmeLabel} num="003" theme={theme} />

      <h2
        className="mb-10 font-display"
        style={{
          fontSize: "clamp(36px, 10vw, 56px)",
          lineHeight: 0.96,
          letterSpacing: "-0.025em",
          fontVariationSettings: '"opsz" 96, "SOFT" 50',
          color: theme.ink,
        }}
      >
        {theme.programmeTitle.line1}
        <br />
        <span style={{ fontStyle: "italic", color: theme.accent, fontVariationSettings: '"opsz" 96, "SOFT" 100, "WONK" 1' }}>
          {theme.programmeTitle.accent}
        </span>
      </h2>

      <ul className="divide-y border-y" style={{ borderColor: theme.hairline }}>
        {rows.map(([k, v]) => (
          <li key={k} className="flex items-baseline justify-between gap-4 py-4" style={{ borderColor: theme.hairline }}>
            <span
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ fontFamily: "ui-monospace, SF Mono, monospace", color: theme.muted }}
            >
              {k}
            </span>
            <span
              className="font-display text-right text-[18px]"
              style={{ fontStyle: "italic", color: theme.ink, fontVariationSettings: '"opsz" 72, "SOFT" 100' }}
            >
              {v}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <div className="mb-4 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "ui-monospace, SF Mono, monospace", color: theme.muted }}>
          A countdown
        </div>
        <Countdown
          targetIso={data.date}
          labels={{ days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" }}
          numberColor={theme.ink}
          labelColor={theme.muted}
          separatorColor={theme.accent}
        />
      </div>
    </section>
  );
}

/* ─────────── 4. PORTRAIT ─────────── */

function Portrait({ data, theme }: { data: InvitationData; theme: EditorialTheme }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  if (!data.coverPhoto) return null;

  return (
    <section ref={ref} className="relative h-[420px] overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 -top-[6%] -bottom-[6%]">
        <Image src={data.coverPhoto} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div aria-hidden className="absolute inset-0" style={{ background: theme.coverOverlay }} />
      <div className="absolute bottom-6 left-6 right-6 flex items-baseline justify-between text-white/85">
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">{theme.portraitLabel ?? "— A portrait, in advance"}</span>
        <span className="text-[10px] tracking-[0.2em]" style={{ fontFamily: "ui-monospace, SF Mono, monospace" }}>№ 004</span>
      </div>
    </section>
  );
}

/* ─────────── 5. LETTER ─────────── */

function Letter({ data, theme }: { data: InvitationData; theme: EditorialTheme }) {
  const paragraphs = theme.letterParagraphs?.(data) ?? data.storyParagraphs ?? [];
  if (paragraphs.length === 0) return null;

  return (
    <section className="border-b px-7 py-20" style={{ borderColor: theme.hairline }}>
      <SectionHeader label={theme.letterLabel ?? "— A note from us"} num="005" theme={theme} />

      <div className="space-y-5">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-display text-[18px] leading-[1.55]"
            style={{ color: theme.inkSoft, fontStyle: "italic", fontVariationSettings: '"opsz" 72, "SOFT" 70' }}
          >
            {p}
          </p>
        ))}
      </div>

      <p
        className="mt-10 font-display text-[28px]"
        style={{ color: theme.accent, fontStyle: "italic", fontVariationSettings: '"opsz" 96, "SOFT" 100, "WONK" 1' }}
      >
        — {data.partnerOne} <Amp theme={theme} /> {data.partnerTwo}
      </p>
    </section>
  );
}

/* ─────────── 6. CLOSE ─────────── */

function Close({
  data,
  theme,
  onRsvp,
}: {
  data: InvitationData;
  theme: EditorialTheme;
  onRsvp: () => void;
}) {
  return (
    <section className="px-7 pb-14 pt-16">
      <SectionHeader label={theme.closeLabel} num="006" theme={theme} />

      <h2
        className="mb-3 font-display"
        style={{
          fontSize: "clamp(44px, 14vw, 64px)",
          lineHeight: 0.92,
          letterSpacing: "-0.03em",
          fontVariationSettings: '"opsz" 120, "SOFT" 50',
          color: theme.ink,
        }}
      >
        {theme.closeTitle}
      </h2>

      <p className="mb-10 text-[14px]" style={{ color: theme.muted }}>
        Please respond by{" "}
        {data.rsvpDeadline
          ? new Date(data.rsvpDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "long" })
          : "the spring"}
        .
      </p>

      <button
        type="button"
        onClick={onRsvp}
        className="group relative w-full border-t py-6 text-left"
        style={{ borderColor: theme.ink }}
      >
        <span
          className="font-display text-[28px] transition-colors"
          style={{
            color: theme.ink,
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 96, "SOFT" 100, "WONK" 1',
          }}
        >
          {theme.closeCta}
        </span>
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[28px]"
          style={{ color: theme.accent }}
        >
          →
        </span>
      </button>

      <div className="mt-16 flex items-baseline justify-between border-t pt-4" style={{ borderColor: theme.hairline }}>
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "ui-monospace, SF Mono, monospace", color: theme.muted }}>
          {data.slug ?? "untitled"}.nuve.co
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "ui-monospace, SF Mono, monospace", color: theme.muted }}>
          {theme.editionName} · MMXXVI
        </span>
      </div>
    </section>
  );
}

/* ─────────── Helpers ─────────── */

function SectionHeader({ label, num, theme }: { label: string; num: string; theme: EditorialTheme }) {
  return (
    <div className="mb-8 flex items-baseline justify-between">
      <span className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: theme.inkSoft }}>
        {label}
      </span>
      <span className="text-[10px] tracking-[0.2em]" style={{ fontFamily: "ui-monospace, SF Mono, monospace", color: theme.muted }}>
        № {num}
      </span>
    </div>
  );
}
