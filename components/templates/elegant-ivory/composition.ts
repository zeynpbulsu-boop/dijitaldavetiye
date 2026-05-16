/**
 * Elegant Ivory — Edition Composition (FAZ 2C pilot)
 *
 * This is the FIRST edition to migrate from the monolithic
 * _invitation-view.tsx to the slot architecture. The migration lands
 * incrementally: we start with `cover` only, then add story → rsvp →
 * envelope → thanks in subsequent commits, each landing a clean
 * visual A/B test before moving on.
 *
 * For slots not yet declared in `order`, the live /i/[slug] route
 * keeps rendering its legacy monolith path — so the production
 * invitation view is never half-broken during migration.
 *
 * Composition validation runs at module-load: missing edition-
 * mandated overrides throw immediately (see _shared/composition.ts).
 */

import { buildComposition } from "../_shared/composition";
import { ElegantIvoryCoverSlot } from "./_slots/cover-slot";
import { ElegantIvoryStorySlot } from "./_slots/story-slot";
import { ElegantIvoryRsvpSlot } from "./_slots/rsvp-slot";
import { ElegantIvoryThanksSlot } from "./_slots/thanks-slot";

export const elegantIvoryComposition = buildComposition({
  slug: "elegant-ivory",
  name: "Elegant Ivory",

  // Envelope ceremony (wax-seal opening) stays in the legacy
  // monolith for now because it manages cross-slot stage state
  // (sealed → breaking → opening → opened). Will fold in once
  // a stage-aware orchestrator slot lands.
  order: ["cover", "story", "rsvp", "thanks"],

  slots: {
    cover: ElegantIvoryCoverSlot,
    story: ElegantIvoryStorySlot,
    rsvp: ElegantIvoryRsvpSlot,
    thanks: ElegantIvoryThanksSlot,
  },
});
