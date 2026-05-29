"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, InvitationDate } from "@/lib/themes-v2/types";

interface Props {
  meta: ThemeV2Meta;
  date: InvitationDate;
  label?: string;
}

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

export function CountdownBand({ meta, date, label = "Geri Sayım" }: Props) {
  // Start from a deterministic placeholder so server and first client render
  // match exactly — calling Date.now() during render makes the static SSR
  // markup ("07") differ from the live client value ("06"), which forces
  // React to throw away the whole tree (blank flash). Real values populate
  // after mount, below the fold, before the section scrolls into view.
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });
  const reduced = useReducedMotion();

  useEffect(() => {
    setT(diff(date.iso));
    const id = setInterval(() => setT(diff(date.iso)), 1000);
    return () => clearInterval(id);
  }, [date.iso]);

  const { palette } = meta;

  return (
    <section
      className="relative px-6 py-24 lg:py-28"
      style={{
        backgroundColor: palette.countdownBg,
        color: palette.countdownInk,
      }}
    >
      {/* Soft grain on band */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative mx-auto max-w-[860px] text-center">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9 }}
          className="font-display italic"
          style={{
            fontSize: "clamp(30px, 3.6vw, 44px)",
            letterSpacing: "0.015em",
          }}
        >
          {label}
        </motion.p>

        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mx-auto my-6 h-px w-14 opacity-60"
          style={{ background: palette.countdownInk }}
        />

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="font-display italic"
          style={{
            fontSize: "clamp(15px, 1.6vw, 19px)",
            opacity: 0.86,
            letterSpacing: "0.01em",
          }}
        >
          {date.day} {date.month} {date.year}
          {date.weekday ? `, ${date.weekday}` : ""}
        </motion.p>

        <div className="mt-12 grid grid-cols-4 gap-3 sm:gap-8">
          {[
            ["d", t.d, "Gün"],
            ["h", t.h, "Saat"],
            ["m", t.m, "Dakika"],
            ["s", t.s, "Saniye"],
          ].map(([key, value, lbl], i) => (
            <Cell
              key={key as string}
              value={value as number}
              label={lbl as string}
              inkColor={palette.countdownInk}
              index={i}
              reduced={!!reduced}
            />
          ))}
        </div>

        {t.expired && (
          <p
            className="mt-10 font-display italic"
            style={{
              fontSize: 17,
              opacity: 0.86,
              letterSpacing: "0.01em",
            }}
          >
            Bugün büyük gün — bizimle olmanız bizi mutlu eder.
          </p>
        )}
      </div>
    </section>
  );
}

function Cell({
  value,
  label,
  inkColor,
  index,
  reduced,
}: {
  value: number;
  label: string;
  inkColor: string;
  index: number;
  reduced: boolean;
}) {
  const padded = value.toString().padStart(2, "0");
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: 0.6 + index * 0.08, duration: 0.7 }}
      className="relative"
    >
      <p
        className="font-display italic"
        style={{
          fontSize: "clamp(34px, 5.5vw, 64px)",
          lineHeight: 1,
          color: inkColor,
          fontVariantNumeric: "oldstyle-nums",
        }}
      >
        {padded}
      </p>
      <p
        className="mt-3 text-[10px] uppercase"
        style={{
          letterSpacing: "0.36em",
          color: inkColor,
          opacity: 0.82,
        }}
      >
        {label}
      </p>
      {/* Separator dot between cells (except last) */}
      {index < 3 && (
        <span
          aria-hidden
          className="absolute right-[-12px] top-1/2 hidden -translate-y-1/2 sm:block"
          style={{
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: inkColor,
            opacity: 0.4,
          }}
        />
      )}
    </motion.div>
  );
}
