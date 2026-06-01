"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, GiftInfo as GiftData } from "@/lib/themes-v2/types";
import { useInvitationT } from "../i18n-context";

export function GiftInfo({
  meta,
  gift,
}: {
  meta: ThemeV2Meta;
  gift: GiftData;
}) {
  const { palette } = meta;
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const [copied, setCopied] = useState(false);

  const copyIban = () => {
    if (!gift.iban || typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(gift.iban.replace(/\s+/g, ""))
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  };

  const reveal = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  const rows: Array<[string, string | null | undefined]> = [
    [str.gift.accountHolder, gift.accountHolder],
    [str.gift.bank, gift.bank],
  ];

  return (
    <section
      className="relative px-6 py-24 sm:py-28 lg:py-36"
      style={{ backgroundColor: palette.bg, color: palette.ink }}
    >
      <div className="mx-auto max-w-[640px] text-center">
        <motion.p
          {...reveal(0)}
          className="text-[10px] uppercase sm:text-[10.5px]"
          style={{ color: palette.inkSoft, letterSpacing: "0.5em", fontWeight: 500 }}
        >
          {str.gift.label}
        </motion.p>

        <motion.h2
          {...reveal(0.05)}
          className="mt-6 font-display"
          style={{ fontWeight: 300, fontSize: "clamp(28px, 4.6vw, 46px)", color: palette.ink, lineHeight: 1.12 }}
        >
          {str.gift.headline}
        </motion.h2>

        <motion.div {...reveal(0.12)} className="mx-auto my-7 flex items-center justify-center gap-3">
          <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.6 }} />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="1.4">
            <rect x="3" y="8" width="18" height="13" rx="1.5" />
            <path d="M3 11h18M12 8V6a2 2 0 0 0-4 0M12 8V6a2 2 0 0 1 4 0" />
          </svg>
          <span className="block h-px w-10" style={{ background: palette.accent, opacity: 0.6 }} />
        </motion.div>

        {gift.note && (
          <motion.p
            {...reveal(0.16)}
            className="mx-auto max-w-[52ch] font-display italic"
            style={{ fontSize: "clamp(15px, 1.9vw, 19px)", color: palette.inkSoft, lineHeight: 1.7 }}
          >
            {gift.note}
          </motion.p>
        )}

        {gift.iban && (
          <motion.div
            {...reveal(0.22)}
            className="mx-auto mt-10 rounded-2xl px-6 py-7 text-left sm:px-8"
            style={{
              backgroundColor: palette.paper,
              border: `1px solid ${palette.accent}29`,
              boxShadow: "0 20px 54px -30px rgba(0,0,0,0.45)",
            }}
          >
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="mb-4 flex flex-col gap-0.5">
                  <span className="text-[9.5px] uppercase" style={{ color: palette.inkSoft, letterSpacing: "0.34em" }}>
                    {k}
                  </span>
                  <span className="font-display" style={{ fontSize: "clamp(15px, 1.9vw, 18px)", color: palette.ink }}>
                    {v}
                  </span>
                </div>
              ))}

            <div className="flex flex-col gap-0.5">
              <span className="text-[9.5px] uppercase" style={{ color: palette.inkSoft, letterSpacing: "0.34em" }}>
                {str.gift.iban}
              </span>
              <div className="flex items-center justify-between gap-3">
                <span
                  className="break-all"
                  style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em", color: palette.ink, fontSize: "clamp(14px, 2vw, 17px)" }}
                >
                  {gift.iban}
                </span>
                <button
                  type="button"
                  onClick={copyIban}
                  className="shrink-0 rounded-full px-4 py-2 text-[9.5px] uppercase transition hover:scale-[1.03]"
                  style={{
                    border: `1px solid ${palette.accent}`,
                    color: copied ? palette.bg : palette.accent,
                    backgroundColor: copied ? palette.accent : "transparent",
                    letterSpacing: "0.26em",
                    fontWeight: 500,
                  }}
                >
                  {copied ? str.gift.copied : str.gift.copy}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
