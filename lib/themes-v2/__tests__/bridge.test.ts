import { describe, it, expect } from "vitest";
import { resolveThemeV2Slug, invitationToThemeV2 } from "../bridge";
import type { Invitation } from "@/lib/db/types";

/** Bridge'in okuduğu alanları taşıyan minimal mock (test amaçlı cast). */
function mockInv(over: Partial<Invitation> = {}): Invitation {
  return {
    id: "x",
    slug: "elif-can",
    template_slug: "geceyarisi",
    tier: "standard",
    status: "live",
    locale: "tr",
    partner_one_name: null,
    partner_two_name: null,
    monogram_initials: null,
    wedding_date: null,
    venue_name: null,
    venue_city: null,
    venue_address: null,
    venue_lat: null,
    venue_lng: null,
    story_text: null,
    hero_eyebrow: null,
    greeting: null,
    footer_note: null,
    gift_iban: null,
    gift_bank: null,
    gift_account_holder: null,
    gift_note: null,
    photos: null,
    ...over,
  } as unknown as Invitation;
}

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

describe("invitationToThemeV2 — null-güvenlik (/i crash etmesin)", () => {
  it("tamamen boş davetiye crash etmez, default'lara düşer", () => {
    const { meta, data } = invitationToThemeV2(mockInv());
    expect(meta.slug).toBe("geceyarisi");
    expect(data.coupleName).toBe("");
    expect(data.date.year).toBe(""); // null tarih → boş → countdown gizlenir
    expect(data.eyebrow).toBeTruthy(); // tema default eyebrow
    expect(data.photos).toEqual([]);
    expect(data.gift).toBeNull();
  });

  it("dolu davetiye doğru maplenir", () => {
    const { data } = invitationToThemeV2(
      mockInv({
        partner_one_name: "Elif",
        partner_two_name: "Can",
        wedding_date: "2026-06-15",
      }),
    );
    expect(data.coupleName).toBe("Elif & Can");
    expect(data.date.year).toBe("2026");
    expect(data.date.day).toBe("15");
  });

  it("bozuk tarih → boş (crash yok)", () => {
    expect(invitationToThemeV2(mockInv({ wedding_date: "bozuk" })).data.date.year).toBe("");
  });

  it("hotels yoksa [] (crash yok)", () => {
    expect(invitationToThemeV2(mockInv()).data.hotels).toEqual([]);
  });

  it("schedule: {time,title,desc} → {time,label,desc}, boş elenir", () => {
    const { data } = invitationToThemeV2(
      mockInv({
        schedule: [
          { time: "16:00", title: "Tören", desc: "Bahçe" },
          { time: "", title: "" },
        ],
      } as Partial<Invitation>),
    );
    expect(data.schedule).toHaveLength(1);
    expect(data.schedule[0]).toMatchObject({
      time: "16:00",
      label: "Tören",
      desc: "Bahçe",
    });
  });

  it("schedule yoksa [] (program section gizlenir)", () => {
    expect(invitationToThemeV2(mockInv()).data.schedule).toEqual([]);
  });

  it("hotels: name'i olanlar maplenir, boş name elenir", () => {
    const { data } = invitationToThemeV2(
      mockInv({
        hotels: [
          { name: "Otel A", price: "₺1000", url: "https://x" },
          { name: "" },
        ],
      } as Partial<Invitation>),
    );
    expect(data.hotels).toHaveLength(1);
    expect(data.hotels[0]).toMatchObject({ name: "Otel A", price: "₺1000" });
  });
});
