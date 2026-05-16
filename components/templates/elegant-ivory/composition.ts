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

export const elegantIvoryComposition = buildComposition({
  slug: "elegant-ivory",
  name: "Elegant Ivory",

  // Migration in progress. Future order (FAZ 2C complete):
  //   ["envelope", "cover", "gallery", "story", "rsvp", "thanks"]
  order: ["cover"],

  slots: {
    cover: ElegantIvoryCoverSlot,
  },
});
