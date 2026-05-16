/**
 * NUVE Edition slot vocabulary — FAZ 2B
 *
 * Every NUVE invitation is composed from a fixed set of named slots.
 * Each edition picks the order (which slots appear, in what sequence)
 * and may override any slot's render function with its own bespoke
 * component. Slots the edition doesn't override fall back to a shared
 * default (countdown, map, gift, thanks).
 *
 * Slot inventory:
 *   cover      — full-screen opening (envelope sealed state, hero copy)
 *                edition-MANDATORY: every edition must provide its own
 *   envelope   — wax-seal ceremony (sealed → breaking → opening)
 *                edition-MANDATORY
 *   details    — venue / date / dress code grid
 *                edition-MANDATORY
 *   story      — optional couple timeline
 *                OPTIONAL: editions may omit
 *   countdown  — countdown to wedding date
 *                SHARED DEFAULT, edition may override
 *   gallery    — photo gallery (mason | slider | grid layout choice)
 *                SHARED DEFAULT, edition may override
 *   map        — venue map embed
 *                SHARED DEFAULT, edition may override
 *   rsvp       — RSVP form (form styling must match edition tone)
 *                edition-MANDATORY
 *   gift       — IBAN / hediye kartı
 *                SHARED DEFAULT, edition may override
 *   thanks     — teşekkür ekranı
 *                edition-MANDATORY
 */

import type { ComponentType } from "react";
import type { InvitationData } from "@/lib/templates/types";
import type { Invitation, DbLocale } from "@/lib/db/types";
import type { InvitationTheme } from "@/lib/templates/themes";
import type { Messages } from "@/lib/i18n/types";

export const SLOT_NAMES = [
  "cover",
  "envelope",
  "details",
  "story",
  "countdown",
  "gallery",
  "map",
  "rsvp",
  "gift",
  "thanks",
] as const;

export type SlotName = (typeof SLOT_NAMES)[number];

/**
 * Slot mandate determines who's responsible for providing the component.
 *
 *   - "edition"  → edition MUST override; no shared default exists
 *   - "default"  → shared default ships in default-slots/, edition may
 *                  override with its own bespoke version
 *   - "optional" → edition may include or omit; no default needed
 */
export const SLOT_MANDATE: Record<SlotName, "edition" | "default" | "optional"> = {
  cover:     "edition",
  envelope:  "edition",
  details:   "edition",
  story:     "optional",
  countdown: "default",
  gallery:   "default",
  map:       "default",
  rsvp:      "edition",
  gift:      "default",
  thanks:    "edition",
};

/**
 * Props every slot component receives. Slots can opt-out of any field
 * (e.g. countdown doesn't need the venue), but the surface stays the
 * same so swapping one slot for another never requires prop plumbing.
 */
export interface SlotProps {
  data: InvitationData;
  /** When true, the page is showing demo data (no real invitation). */
  isPreview?: boolean;
  /**
   * Edition slug currently rendering. Slots can use this to read CSS
   * variables scoped to [data-edition="..."] without re-implementing
   * theme propagation.
   */
  editionSlug: string;

  /* ── Optional live-invitation enrichment (FAZ 2C) ──────────────── *
   * When the renderer is mounted from /i/[slug] (a real customer
   * invitation), these fields carry the rich DB row + theme + i18n
   * strings so slots can render exact data. When rendered from
   * /templates/[slug] preview, they're absent — slots should treat
   * `data` (InvitationData) as the source of truth and degrade
   * gracefully (skip parts that need richer fields).
   */

  /** Full DB row when rendering a real invitation. */
  invitation?: Invitation;
  /** Per-edition visual theme (palette + ornament motif). */
  theme?: InvitationTheme;
  /** Active locale ("tr" | "en" | "sr") — drives weekday/dateLine. */
  locale?: DbLocale;
  /** i18n messages bundle for the active locale. */
  messages?: Messages;
  /** Derived display strings — pre-formatted by the route. */
  dateLine?: string | null;
  weekday?: string | null;
  monogram?: string;
}

export type SlotComponent = ComponentType<SlotProps>;
