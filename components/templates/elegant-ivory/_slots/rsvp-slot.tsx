"use client";

/**
 * Elegant Ivory — RSVP Slot (FAZ 2C)
 * Lifted from monolith _invitation-view.tsx L1020-1061.
 * RsvpForm component is shared across all editions for now.
 */

import { motion } from "framer-motion";
import type { DbLocale } from "@/lib/db/types";
import type { SlotProps } from "../../_shared/slots";
import { RsvpForm } from "@/app/i/[slug]/_rsvp-form";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

const RSVP_COPY: Record<DbLocale, { headline: string; sub: string }> = {
  tr: {
    headline: "Bizimle olur musun?",
    sub: "Lütfen düğünden 14 gün önce yanıtla.",
  },
  en: {
    headline: "Will you be there?",
    sub: "Kindly reply 14 days before the wedding.",
  },
  sr: {
    headline: "Hoćeš li biti tu?",
    sub: "Molimo odgovorite 14 dana pre svadbe.",
  },
};

export function ElegantIvoryRsvpSlot({ invitation, theme, locale }: SlotProps) {
  if (!invitation || !theme || !locale) return null;

  const labels = RSVP_COPY[locale];

  return (
    <motion.section
      data-slot="rsvp"
      data-edition-slug="elegant-ivory"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.4, ease: SOFT_EASE }}
      id="rsvp"
      className="relative z-10 px-6 py-28 lg:py-36"
    >
      <div className="container-narrow">
        <header className="mb-16 text-center lg:mb-20">
          <span
            className="text-[10px] font-semibold uppercase"
            style={{ color: theme.accent, letterSpacing: "0.46em" }}
          >
            — RSVP
          </span>
          <h2
            className="mt-6 font-display font-light"
            style={{
              color: theme.ink,
              fontSize: "clamp(32px, 4.2vw, 54px)",
              lineHeight: 1.1,
              letterSpacing: "0.04em",
            }}
          >
            {labels.headline}
          </h2>
          <p
            className="mt-5 text-[13px]"
            style={{
              color: theme.inkSoft,
              letterSpacing: "0.04em",
              lineHeight: 1.6,
            }}
          >
            {labels.sub}
          </p>
        </header>

        <RsvpForm slug={invitation.slug} locale={locale} />
      </div>
    </motion.section>
  );
}
