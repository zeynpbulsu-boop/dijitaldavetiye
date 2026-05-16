"use client";

/**
 * Elegant Ivory — Story Slot (FAZ 2C)
 * Lifted from monolith _invitation-view.tsx L995-1018.
 */

import { motion } from "framer-motion";
import type { SlotProps } from "../../_shared/slots";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;

export function ElegantIvoryStorySlot({ invitation, theme }: SlotProps) {
  if (!invitation || !theme) return null;
  if (!invitation.story_text) return null;

  return (
    <motion.section
      data-slot="story"
      data-edition-slug="elegant-ivory"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.4, ease: SOFT_EASE }}
      className="relative z-10 border-y px-6 py-28 lg:py-36"
      style={{ background: theme.storyBg, borderColor: theme.storyBorder }}
    >
      <div className="container-narrow text-center">
        <p
          className="font-display"
          style={{
            color: theme.inkSoft,
            fontSize: "clamp(18px, 2vw, 26px)",
            lineHeight: 1.7,
            letterSpacing: "0.012em",
          }}
        >
          {invitation.story_text}
        </p>
      </div>
    </motion.section>
  );
}
