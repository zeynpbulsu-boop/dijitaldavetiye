"use client";

/**
 * Elegant Ivory — Cover Slot (FAZ 2C pilot)
 *
 * Lifted byte-for-byte from app/i/[slug]/_invitation-view.tsx
 * lines 838-991 (the HERO section of OpenedContent) so the migration
 * from monolithic invitation-view → slot architecture lands with
 * ZERO visual diff.
 *
 * What this slot renders, in order:
 *   1. NUVE eyebrow + theme.name caption strip
 *   2. Monogram disc (gradient + inner shadow + edition initials)
 *   3. partner_one — italic "ve" — partner_two block
 *   4. dateLine with hairline rules + weekday
 *   5. Countdown (lifted from the monolith's <Countdown /> sub-component)
 *   6. Venue caption line (venue_name · city · address)
 *   7. MapBlock (lifted from the monolith's <MapBlock /> sub-component)
 *
 * Future refinement (FAZ 2D): split countdown + map into their own
 * default slots so other editions can swap layouts without rewriting
 * the cover. For now we preserve the exact composition of the live
 * page to keep the A/B test honest.
 */

import { motion } from "framer-motion";
import type { SlotProps } from "../../_shared/slots";
import { CoverCountdown } from "./cover-countdown";
import { CoverMapBlock } from "./cover-map-block";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const PAPER_CARD = { type: "spring" as const, stiffness: 70, damping: 18, mass: 1.2 };

export function ElegantIvoryCoverSlot({
  invitation,
  theme,
  locale,
  messages,
  dateLine,
  weekday,
  monogram,
}: SlotProps) {
  // Cover slot only renders meaningfully when the renderer was mounted
  // with the live-invitation enrichment (FAZ 2C). For preview/demo
  // contexts where these are absent, fail-soft to null — the legacy
  // template detail page still handles those.
  if (!invitation || !theme || !messages || !locale) return null;

  const inv = invitation;

  return (
    <section
      data-slot="cover"
      data-edition-slug="elegant-ivory"
      className="relative z-10 px-6 pt-28 pb-32 text-center sm:pt-36 lg:pt-44 lg:pb-44"
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 0.4, ease: SOFT_EASE }}
        className="inline-block text-[10px] font-semibold uppercase"
        style={{ color: theme.accent, letterSpacing: "0.46em" }}
      >
        NUVE &nbsp;·&nbsp; {theme.name}
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...PAPER_CARD, delay: 0.7 }}
        className="mx-auto mt-16 mb-20 flex h-24 w-24 items-center justify-center rounded-full lg:h-28 lg:w-28"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${theme.accent}, ${theme.monogramFill} 60%, ${theme.monogramFill}cc 100%)`,
          boxShadow: `0 16px 32px -10px ${theme.accent}55, inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.18)`,
        }}
      >
        <span
          className="font-display italic"
          style={{
            fontSize: "38px",
            lineHeight: 1,
            letterSpacing: "0.01em",
            color: theme.monogramText,
            textShadow: "0 1px 2px rgba(0,0,0,0.18)",
          }}
        >
          {monogram}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 1.2, ease: SOFT_EASE }}
        className="font-display font-light"
        style={{
          color: theme.ink,
          fontSize: "clamp(38px, 5.5vw, 76px)",
          lineHeight: 1.05,
          letterSpacing: "0.045em",
        }}
      >
        {inv.partner_one_name || "—"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 1.5, ease: SOFT_EASE }}
        className="my-6 font-display italic lg:my-7"
        style={{
          color: theme.accent,
          fontSize: "clamp(20px, 2.2vw, 30px)",
          lineHeight: 1,
          letterSpacing: "0.05em",
        }}
      >
        {messages.hero.phone.and}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 1.8, ease: SOFT_EASE }}
        className="font-display font-light"
        style={{
          color: theme.ink,
          fontSize: "clamp(38px, 5.5vw, 76px)",
          lineHeight: 1.05,
          letterSpacing: "0.045em",
        }}
      >
        {inv.partner_two_name || "—"}
      </motion.h1>

      {dateLine && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2.3, ease: SOFT_EASE }}
          className="mt-20 inline-flex flex-col items-center gap-3 lg:mt-24"
        >
          <div className="flex items-center gap-5">
            <span aria-hidden className="h-px w-14" style={{ background: theme.ruleColor }} />
            <span
              className="font-display"
              style={{
                color: theme.ink,
                fontSize: "clamp(14px, 1.5vw, 18px)",
                letterSpacing: "0.36em",
                textTransform: "uppercase",
              }}
            >
              {dateLine}
            </span>
            <span aria-hidden className="h-px w-14" style={{ background: theme.ruleColor }} />
          </div>
          {weekday && (
            <span
              className="text-[10px]"
              style={{
                color: theme.inkSoft,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
              }}
            >
              {weekday}
            </span>
          )}
        </motion.div>
      )}

      {inv.wedding_date && (
        <CoverCountdown
          targetIso={inv.wedding_date + "T18:00:00"}
          locale={locale}
          theme={theme}
        />
      )}

      {(inv.venue_name || inv.venue_city) && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2.6, ease: SOFT_EASE }}
          className="mx-auto mt-12 max-w-[460px] font-display italic"
          style={{
            color: theme.inkSoft,
            fontSize: "clamp(16px, 1.6vw, 20px)",
            lineHeight: 1.5,
            letterSpacing: "0.04em",
          }}
        >
          {[inv.venue_name, inv.venue_city, inv.venue_address]
            .filter(Boolean)
            .join(" · ")}
        </motion.p>
      )}

      {(inv.venue_address || inv.venue_name) && (
        <CoverMapBlock
          query={[inv.venue_name, inv.venue_city, inv.venue_address]
            .filter(Boolean)
            .join(", ")}
          locale={locale}
          theme={theme}
        />
      )}
    </section>
  );
}
