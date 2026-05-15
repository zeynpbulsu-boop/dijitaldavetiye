/**
 * Composition contract tests — FAZ 2B
 *
 * These tests pin the buildComposition() validator so editions can't
 * accidentally:
 *   - reference a slot name that doesn't exist
 *   - skip an edition-mandated slot (cover/envelope/details/rsvp/thanks)
 *   - leave an override hanging without declaring the slot in `order`
 *
 * The validator runs at module-load time inside each edition's
 * composition file, so these tests double as a regression net for the
 * contract — if buildComposition() loosens, downstream editions can
 * ship broken pages.
 */

import { describe, it, expect } from "vitest";
import { buildComposition } from "../composition";
import type { SlotComponent } from "../slots";

// Lightweight stand-in component used wherever a real React component
// would be required. The validator never renders these — it only
// checks presence / absence in the slot map.
const StubComponent = (() => null) as unknown as SlotComponent;

const allMandatorySlots = {
  cover: StubComponent,
  envelope: StubComponent,
  details: StubComponent,
  rsvp: StubComponent,
  thanks: StubComponent,
};

describe("buildComposition()", () => {
  it("accepts a fully-specified composition with every mandatory slot", () => {
    expect(() =>
      buildComposition({
        slug: "test-edition",
        name: "Test Edition",
        order: ["cover", "envelope", "details", "rsvp", "thanks"],
        slots: { ...allMandatorySlots },
      }),
    ).not.toThrow();
  });

  it("returns the same composition object it was given", () => {
    const input = {
      slug: "test-edition",
      name: "Test Edition",
      order: ["cover", "envelope", "details", "rsvp", "thanks"] as const,
      slots: { ...allMandatorySlots },
    };

    const output = buildComposition(input);
    expect(output).toBe(input);
  });

  it("allows shared-default slots to be declared without an override", () => {
    // countdown / gallery / map / gift are "default"-mandated — the
    // edition can include them in `order` without supplying an
    // override and the renderer fills in the shared default.
    expect(() =>
      buildComposition({
        slug: "test-edition",
        name: "Test Edition",
        order: [
          "cover",
          "envelope",
          "details",
          "countdown",
          "gallery",
          "map",
          "rsvp",
          "gift",
          "thanks",
        ],
        slots: { ...allMandatorySlots },
      }),
    ).not.toThrow();
  });

  it("allows optional slots (e.g. story) to be omitted entirely", () => {
    // `story` has mandate: "optional" — leaving it out of `order`
    // is the correct expression of an edition that doesn't ship a
    // couple-timeline section.
    expect(() =>
      buildComposition({
        slug: "test-edition",
        name: "Test Edition",
        order: ["cover", "envelope", "details", "rsvp", "thanks"],
        slots: { ...allMandatorySlots },
      }),
    ).not.toThrow();
  });

  it("throws when `order` references an unknown slot name", () => {
    expect(() =>
      buildComposition({
        slug: "test-edition",
        name: "Test Edition",
        // @ts-expect-error — intentionally invalid for the runtime check
        order: ["cover", "envelope", "details", "lyrics", "rsvp", "thanks"],
        slots: { ...allMandatorySlots },
      }),
    ).toThrow(/Unknown slot in order: "lyrics"/);
  });

  it("throws when an edition-mandated slot is missing an override", () => {
    const { cover: _omitCover, ...rest } = allMandatorySlots;
    expect(() =>
      buildComposition({
        slug: "test-edition",
        name: "Test Edition",
        order: ["cover", "envelope", "details", "rsvp", "thanks"],
        slots: rest,
      }),
    ).toThrow(/Slot "cover" is edition-mandated/);
  });

  it.each(["envelope", "details", "rsvp", "thanks"] as const)(
    "throws when edition-mandated slot %s has no override",
    (missingSlot) => {
      const slots = { ...allMandatorySlots };
      delete (slots as Record<string, SlotComponent | undefined>)[missingSlot];

      expect(() =>
        buildComposition({
          slug: "test-edition",
          name: "Test Edition",
          order: ["cover", "envelope", "details", "rsvp", "thanks"],
          slots,
        }),
      ).toThrow(new RegExp(`Slot "${missingSlot}" is edition-mandated`));
    },
  );

  it("throws when an override targets a slot not declared in `order`", () => {
    expect(() =>
      buildComposition({
        slug: "test-edition",
        name: "Test Edition",
        order: ["cover", "envelope", "details", "rsvp", "thanks"],
        slots: {
          ...allMandatorySlots,
          // gallery override supplied but gallery isn't in the order —
          // almost always a typo, validator must surface it.
          gallery: StubComponent,
        },
      }),
    ).toThrow(/Override provided for "gallery" but it is not declared in composition.order/);
  });

  it("includes the edition slug in every error message for traceability", () => {
    expect(() =>
      buildComposition({
        slug: "atelier-indigo",
        name: "Atelier Indigo",
        order: ["cover", "envelope", "details", "rsvp", "thanks"],
        slots: { ...allMandatorySlots, gallery: StubComponent },
      }),
    ).toThrow(/\[atelier-indigo\]/);
  });
});
