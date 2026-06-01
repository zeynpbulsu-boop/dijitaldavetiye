import { describe, it, expect } from "vitest";
import { relativeLuminance, contrastRatio, bestTextOn } from "../contrast";
import { THEMES_V2 } from "../registry";
import type { ThemeV2Slug } from "../types";

describe("relativeLuminance", () => {
  it("siyah ~0, beyaz ~1", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 2);
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 2);
  });
  it("3-haneli hex genişletilir (#fff → beyaz)", () => {
    expect(relativeLuminance("#fff")).toBeCloseTo(1, 2);
    expect(relativeLuminance("#000")).toBeCloseTo(0, 2);
  });
});

describe("contrastRatio", () => {
  it("siyah/beyaz = 21", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 0);
  });
  it("simetrik", () => {
    expect(contrastRatio("#7A8870", "#FFFFFF")).toBeCloseTo(
      contrastRatio("#FFFFFF", "#7A8870"),
      5,
    );
  });
});

describe("bestTextOn — her tema accent'inde AA (>=4.5) geçmeli", () => {
  const slugs = Object.keys(THEMES_V2) as ThemeV2Slug[];
  for (const slug of slugs) {
    it(`${slug} accent üstünde seçilen metin AA geçer`, () => {
      const accent = THEMES_V2[slug].palette.accent;
      const text = bestTextOn(accent);
      expect(contrastRatio(accent, text)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
