/**
 * Edition Composition contract — FAZ 2B
 *
 * Each edition exports a Composition that describes:
 *   - which slots it shows (and in what order)
 *   - which slots it overrides with bespoke components
 *
 * The EditionRenderer reads this contract, falls back to shared
 * defaults for un-overridden slots, and renders the page.
 */

import type { SlotComponent, SlotName } from "./slots";

export interface EditionComposition {
  /** Edition canonical slug (matches lib/design/tokens.ts EDITIONS keys) */
  slug: string;

  /** Human-readable name shown in chrome (back link, title, etc.) */
  name: string;

  /**
   * Ordered list of slots this edition renders. Slots not present in
   * the array are skipped — even if their default exists. This is the
   * single source of truth for invitation page structure per edition.
   */
  order: readonly SlotName[];

  /**
   * Slot-by-slot override map. A missing entry means "use the shared
   * default" (only valid for slots whose mandate is "default"). For
   * "edition"-mandated slots (cover/envelope/details/rsvp/thanks)
   * an override is REQUIRED — buildComposition() throws if missing.
   */
  slots: Partial<Record<SlotName, SlotComponent>>;
}

/**
 * Validates a composition against the slot mandate table. Throws at
 * module-load time if an edition forgot a mandatory slot, surfacing
 * the issue before it reaches production.
 *
 * Edition files call this as their default export to ensure the
 * contract is verified statically.
 */
import { SLOT_MANDATE, SLOT_NAMES } from "./slots";

export function buildComposition(
  composition: EditionComposition,
): EditionComposition {
  // Order must only reference known slots.
  for (const slot of composition.order) {
    if (!SLOT_NAMES.includes(slot)) {
      throw new Error(
        `[${composition.slug}] Unknown slot in order: "${slot}". ` +
          `Allowed: ${SLOT_NAMES.join(", ")}`,
      );
    }
  }

  // Every edition-mandated slot in the order must have an override.
  for (const slot of composition.order) {
    const mandate = SLOT_MANDATE[slot];
    const hasOverride = composition.slots[slot] !== undefined;

    if (mandate === "edition" && !hasOverride) {
      throw new Error(
        `[${composition.slug}] Slot "${slot}" is edition-mandated ` +
          `and must be provided in composition.slots. ` +
          `No shared default exists.`,
      );
    }
  }

  // Overrides may not target slots not declared in `order` — that's
  // almost always a typo and silently dropping it is worse than
  // failing loudly.
  for (const slot of Object.keys(composition.slots) as SlotName[]) {
    if (!composition.order.includes(slot)) {
      throw new Error(
        `[${composition.slug}] Override provided for "${slot}" ` +
          `but it is not declared in composition.order.`,
      );
    }
  }

  return composition;
}
