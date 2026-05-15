/**
 * Default Slot wrappers — FAZ 2B
 *
 * Barrel re-export for the four "default"-mandated slots. The
 * EditionRenderer imports from this single entry point, so adding
 * a new default slot is one-file-touch.
 */

export { CountdownSlot } from "./countdown-slot";
export { MapSlot } from "./map-slot";
export { createGallerySlot, type GalleryLayout } from "./gallery-slot";
export { GiftSlot } from "./gift-slot";

import { CountdownSlot } from "./countdown-slot";
import { MapSlot } from "./map-slot";
import { createGallerySlot } from "./gallery-slot";
import { GiftSlot } from "./gift-slot";
import type { SlotComponent, SlotName } from "../slots";

/**
 * Shared defaults keyed by slot name. The renderer falls back to
 * `DEFAULT_SLOTS[name]` whenever a composition doesn't provide an
 * override. Returns `null` for slots without a default (edition-
 * mandated or optional slots like cover/envelope/story).
 *
 * Note: gallery uses a default "grid" layout. Editions wanting
 * mason/slider can call `createGallerySlot("mason")` in their own
 * composition.
 */
export const DEFAULT_SLOTS: Partial<Record<SlotName, SlotComponent>> = {
  countdown: CountdownSlot,
  map: MapSlot,
  gallery: createGallerySlot("grid"),
  gift: GiftSlot,
};
