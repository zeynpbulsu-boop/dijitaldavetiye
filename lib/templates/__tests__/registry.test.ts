import { describe, expect, it } from "vitest";
import {
  getTemplate,
  getTemplateMeta,
  listTemplates,
  resolveSlug,
  templateMeta,
} from "../registry";

/**
 * Registry contract — pins the FAZ 2A deprecation policy:
 *
 *   1. `listTemplates()` hides deprecated/unlisted entries by default.
 *   2. `listTemplates({ includeDeprecated: true })` returns everything.
 *   3. `resolveSlug()` translates legacy slugs to their canonical
 *      component but keeps the requested slug in the result so the URL
 *      can stay intact.
 *   4. Unknown slugs return null (not a deprecated alias to the void).
 */

describe("listTemplates", () => {
  it("hides deprecated entries by default", () => {
    const visible = listTemplates();
    const visibleSlugs = visible.map((m) => m.slug);

    // The three deprecated slugs must not appear in the default list.
    expect(visibleSlugs).not.toContain("blush-reverie");
    expect(visibleSlugs).not.toContain("blush-garden");
    expect(visibleSlugs).not.toContain("black-ink");
  });

  it("returns at least the 5 canonical (non-deprecated) templates", () => {
    const visible = listTemplates().map((m) => m.slug);

    // Canonical 5 from the current 8 (after FAZ 2A deprecations).
    // FAZ 2D will expand this set with Aurora etc.
    expect(visible).toContain("bordeaux");
    expect(visible).toContain("egee-blue");
    expect(visible).toContain("olive-grove");
    expect(visible).toContain("verde-borgogna");
    expect(visible).toContain("elegant-ivory");
  });

  it("returns every entry when includeDeprecated is true", () => {
    const all = listTemplates({ includeDeprecated: true });
    expect(all.length).toBe(templateMeta.length);

    const allSlugs = all.map((m) => m.slug);
    expect(allSlugs).toContain("blush-reverie");
    expect(allSlugs).toContain("blush-garden");
    expect(allSlugs).toContain("black-ink");
  });

  it("every deprecated entry has supersededBy set", () => {
    const deprecated = templateMeta.filter((m) => m.deprecated === true);
    expect(deprecated.length).toBeGreaterThan(0);
    for (const m of deprecated) {
      expect(m.supersededBy).toBeTruthy();
    }
  });
});

describe("resolveSlug", () => {
  it("returns null for unknown slugs", () => {
    expect(resolveSlug("not-a-real-slug")).toBeNull();
    expect(resolveSlug("")).toBeNull();
  });

  it("resolves a canonical slug to itself", () => {
    const r = resolveSlug("bordeaux");
    expect(r).not.toBeNull();
    expect(r!.requested).toBe("bordeaux");
    expect(r!.canonical).toBe("bordeaux");
    expect(r!.isDeprecated).toBe(false);
    expect(r!.supersededBy).toBeUndefined();
    expect(r!.meta.slug).toBe("bordeaux");
    expect(r!.Component).toBeDefined();
  });

  it("resolves a deprecated slug to its superseding canonical", () => {
    const r = resolveSlug("black-ink");
    expect(r).not.toBeNull();
    expect(r!.requested).toBe("black-ink");
    expect(r!.canonical).toBe("elegant-ivory");
    expect(r!.isDeprecated).toBe(true);
    expect(r!.supersededBy).toBe("elegant-ivory");
    // Meta is the canonical's, so consumers display the new edition's
    // name + palette even when a legacy slug was requested.
    expect(r!.meta.slug).toBe("elegant-ivory");
    expect(r!.Component).toBeDefined();
  });

  it("handles all three deprecated aliases", () => {
    const aliases = [
      { from: "blush-reverie", to: "elegant-ivory" },
      { from: "blush-garden",  to: "elegant-ivory" },
      { from: "black-ink",     to: "elegant-ivory" },
    ];
    for (const { from, to } of aliases) {
      const r = resolveSlug(from);
      expect(r, `resolveSlug(${from})`).not.toBeNull();
      expect(r!.canonical).toBe(to);
      expect(r!.isDeprecated).toBe(true);
      expect(r!.supersededBy).toBe(to);
    }
  });

  it("preserves the requested slug in the result", () => {
    // Important: SEO/analytics use this to log the URL the user hit.
    const r = resolveSlug("black-ink");
    expect(r!.requested).toBe("black-ink");
    expect(r!.requested).not.toBe(r!.canonical);
  });
});

describe("legacy helpers (getTemplate / getTemplateMeta)", () => {
  it("getTemplateMeta still resolves deprecated entries (URL stays alive)", () => {
    // Backwards-compatibility: existing consumers that haven't migrated
    // to resolveSlug() should still get *something* back so the old
    // /i/<slug> URLs keep rendering.
    const m = getTemplateMeta("black-ink");
    expect(m).toBeDefined();
    expect(m!.slug).toBe("black-ink");
    expect(m!.deprecated).toBe(true);
  });

  it("getTemplate still returns the legacy component (no breakage)", () => {
    const t = getTemplate("black-ink");
    expect(t).toBeDefined();
    expect(t!.Component).toBeDefined();
  });
});
