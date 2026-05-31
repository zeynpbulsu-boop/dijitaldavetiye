import { describe, it, expect } from "vitest";
import { resolveThemeV2Slug } from "../bridge";

describe("resolveThemeV2Slug", () => {
  it("v2 slug aynen geçer", () => {
    expect(resolveThemeV2Slug("geceyarisi")).toBe("geceyarisi");
    expect(resolveThemeV2Slug("celenk")).toBe("celenk");
  });

  it("legacy slug → en yakın v2", () => {
    expect(resolveThemeV2Slug("nocturne")).toBe("geceyarisi");
    expect(resolveThemeV2Slug("aethel")).toBe("celenk");
    expect(resolveThemeV2Slug("olea")).toBe("defter");
  });

  it("bilinmeyen → celenk (default)", () => {
    expect(resolveThemeV2Slug("xyz-yok")).toBe("celenk");
  });

  it("boş / büyük harf güvenli", () => {
    expect(resolveThemeV2Slug("")).toBe("celenk");
    expect(resolveThemeV2Slug("GECEYARISI")).toBe("geceyarisi");
  });
});
