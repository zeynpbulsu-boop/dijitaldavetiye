"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, InvitationDate } from "@/lib/themes-v2/types";
import { useInvitationT } from "../i18n-context";
import { SlotDate } from "./slot-date";
import { ScratchDate } from "./scratch-date";
import { contrastRatio } from "@/lib/themes-v2/contrast";
import { H2, LEAD } from "./type-scale";

interface Props {
  meta: ThemeV2Meta;
  date: InvitationDate;
  label?: string;
  /** save_the_date'te tarih kazı-kazanla, düğünde slot makinesiyle bulunur. */
  eventType?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function diff(iso: string | undefined) {
  if (!iso) return { d: 0, h: 0, m: 0, s: 0, expired: true };
  const target = new Date(iso).getTime();
  const now = Date.now();
  const delta = target - now;
  if (delta <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
  const d = Math.floor(delta / 86400000);
  const h = Math.floor((delta / 3600000) % 24);
  const m = Math.floor((delta / 60000) % 60);
  const s = Math.floor((delta / 1000) % 60);
  return { d, h, m, s, expired: false };
}

export function CountdownBand({ meta, date, eventType }: Props) {
  // Start from a deterministic placeholder so server and first client render
  // match exactly — calling Date.now() during render makes the static SSR
  // markup ("07") differ from the live client value ("06"), which forces
  // React to throw away the whole tree (blank flash). Real values populate
  // after mount, below the fold, before the section scrolls into view.
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });
  const reduced = useReducedMotion();
  const str = useInvitationT();

  useEffect(() => {
    setT(diff(date.iso));
    const id = setInterval(() => setT(diff(date.iso)), 1000);
    return () => clearInterval(id);
  }, [date.iso]);

  const { palette } = meta;
  const ink = palette.countdownInk;
  // Accent, koyu bant üstünde 5 temada görünmüyordu (çelenk 1.00, postakart
  // 1.03...). Kontrast ≥3 değilse süs rengi bant mürekkebine düşer — yeni
  // temalar da otomatik kapsanır (K3: kontrast derleme kuralıdır).
  const accent =
    contrastRatio(palette.accent, palette.countdownBg) >= 3
      ? palette.accent
      : palette.countdownInk;

  // Mirrors VenueMap's reveal helper so this band shares the same motion grammar.
  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  const cells: Array<[string, number, string]> = [
    ["d", t.d, str.countdown.day],
    ["h", t.h, str.countdown.hour],
    ["m", t.m, str.countdown.minute],
    ["s", t.s, str.countdown.second],
  ];

  // Koyu temada (geceyarisi) bant zeminden hiç ayrışmıyor → ince accent
  // hairline; açık temalarda gradyan köprüler zaten ayrımı veriyor.
  const bandBlends = contrastRatio(palette.bg, palette.countdownBg) < 1.35;

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{
        backgroundColor: palette.countdownBg,
        color: ink,
        borderTop: bandBlends ? `1px solid ${palette.accent}30` : undefined,
        borderBottom: bandBlends ? `1px solid ${palette.accent}30` : undefined,
      }}
    >
      {/* K4 "boya geçişi": bant sayfadan bıçakla kesilmiş gibi başlamasın —
          üst/alt 64px, sayfa zemininden bant rengine eriyen köprü. */}
      {!bandBlends && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-16"
            style={{ background: `linear-gradient(180deg, ${palette.bg}, transparent)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
            style={{ background: `linear-gradient(0deg, ${palette.bg}, transparent)` }}
          />
        </>
      )}

      {/* Soft grain on band */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto max-w-[820px] text-center">
        {/* Eyebrow — matches the bar (10/10.5px, 0.5em, accent) */}
        <motion.p
          {...reveal(0)}
          className="text-[10px] uppercase sm:text-[10.5px]"
          style={{ color: accent, letterSpacing: "0.5em", fontWeight: 500 }}
        >
          {str.countdown.title}
        </motion.p>

        {/* Tarih önce kalpli slot makinesiyle "bulunur" (görünüme girince
            makaralar döner, kalpler süzülür), sonra bu sakin serif ifadeye
            çözülür. Reduced-motion / iso yoksa doğrudan serif gösterilir. */}
        <DateReveal meta={meta} date={date} eventType={eventType}>
          <motion.h2
            {...reveal(0.05)}
            className="mt-6 font-display"
            style={{
              fontWeight: 300,
              fontSize: H2,
              color: ink,
              lineHeight: 1.1,
              letterSpacing: "0.01em",
              fontVariantNumeric: "oldstyle-nums",
            }}
          >
            {date.day} {date.month} {date.year}
          </motion.h2>
        </DateReveal>

        {/* Divider with a small diamond ornament — same motif as VenueMap */}
        <motion.div
          {...reveal(0.12)}
          className="mx-auto my-7 flex items-center justify-center gap-3"
        >
          <span className="block h-px w-10" style={{ background: accent, opacity: 0.6 }} />
          <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden>
            <rect
              x="5"
              y="0"
              width="5"
              height="5"
              transform="rotate(45 5 0)"
              fill={accent}
              opacity="0.9"
            />
          </svg>
          <span className="block h-px w-10" style={{ background: accent, opacity: 0.6 }} />
        </motion.div>

        {/* Weekday / soft subline */}
        {date.weekday && (
          <motion.p
            {...reveal(0.16)}
            className="text-[10px] uppercase sm:text-[10.5px]"
            style={{ color: ink, opacity: 0.62, letterSpacing: "0.4em" }}
          >
            {date.weekday}
          </motion.p>
        )}

        {/* Countdown cells — hairline-framed tiles, refined numerals */}
        <motion.div
          {...reveal(0.2)}
          className="mt-12 grid grid-cols-4 gap-2 sm:gap-5"
        >
          {cells.map(([key, value, lbl], i) => (
            <Cell
              key={key}
              value={value}
              label={lbl}
              ink={ink}
              accent={accent}
              index={i}
              isLast={i === cells.length - 1}
              reduced={!!reduced}
            />
          ))}
        </motion.div>

        {t.expired && (
          <motion.p
            {...reveal(0.3)}
            className="mt-10 font-display italic"
            style={{
              fontSize: LEAD,
              opacity: 0.86,
              letterSpacing: "0.01em",
              color: ink,
            }}
          >
            {str.countdown.passed}
          </motion.p>
        )}
      </div>
    </section>
  );
}

function Cell({
  value,
  label,
  ink,
  accent,
  index,
  isLast,
  reduced,
}: {
  value: number;
  label: string;
  ink: string;
  accent: string;
  index: number;
  isLast: boolean;
  reduced: boolean;
}) {
  const padded = value.toString().padStart(2, "0");
  return (
    <div className="relative">
      <div
        className="flex flex-col items-center rounded-xl px-1 py-4 sm:px-3 sm:py-6"
        style={{
          border: `1px solid ${accent}29`,
          backgroundColor: `${ink}08`,
          backdropFilter: "blur(2px)",
        }}
      >
        {/* The number animates gently on each tick (key swap) without disturbing
            the frame, so seconds feel alive but never jumpy. */}
        <div
          className="overflow-hidden"
          style={{
            fontSize: "clamp(28px, 7vw, 60px)",
            lineHeight: 1,
            height: "1em",
          }}
        >
          {reduced ? (
            <span
              className="font-display block"
              style={{ color: ink, fontVariantNumeric: "oldstyle-nums" }}
            >
              {padded}
            </span>
          ) : (
            <motion.span
              key={padded}
              initial={{ opacity: 0.35, y: "28%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-display block"
              style={{ color: ink, fontVariantNumeric: "oldstyle-nums" }}
            >
              {padded}
            </motion.span>
          )}
        </div>

        {/* Hairline rule under the numeral keeps the tile feeling composed */}
        <span
          aria-hidden
          className="mt-3 block h-px w-5 sm:w-6"
          style={{ background: accent, opacity: 0.45 }}
        />

        <p
          className="mt-2.5 text-[8px] uppercase sm:text-[9.5px]"
          style={{
            letterSpacing: "0.22em",
            color: ink,
            opacity: 0.7,
          }}
        >
          {label}
        </p>
      </div>

      {/* Refined colon separator between tiles (md+ only) */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute right-[-12px] top-1/2 hidden -translate-y-1/2 flex-col gap-1.5 sm:flex"
        >
          <span
            className="block h-[3px] w-[3px] rounded-full"
            style={{ background: accent, opacity: 0.5 }}
          />
          <span
            className="block h-[3px] w-[3px] rounded-full"
            style={{ background: accent, opacity: 0.5 }}
          />
        </span>
      )}
    </div>
  );
}

/** Tarih "bulma" oyunu seçimi — saf ve test edilebilir. */
export function dateRevealMode(eventType?: string): "scratch" | "slot" {
  return eventType === "save_the_date" ? "scratch" : "slot";
}

function DateReveal({
  meta,
  date,
  eventType,
  children,
}: Props & { children: React.ReactNode }) {
  if (dateRevealMode(eventType) === "scratch") {
    return <ScratchDate meta={meta}>{children}</ScratchDate>;
  }
  return (
    <SlotDate meta={meta} date={date}>
      {children}
    </SlotDate>
  );
}
