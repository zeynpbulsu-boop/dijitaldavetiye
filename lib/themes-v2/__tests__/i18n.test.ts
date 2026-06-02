import { describe, it, expect } from "vitest";
import { invitationStrings, eventHeading, defaultEyebrow } from "../i18n";

describe("invitationStrings", () => {
  it("tr/en/sr farklı diller döndürür", () => {
    expect(invitationStrings("tr").ceremony.tapToOpen).toBe("Açmak için dokun");
    expect(invitationStrings("en").ceremony.tapToOpen).toBe("Tap to open");
    expect(invitationStrings("sr").ceremony.tapToOpen).toBe(
      "Dodirnite da otvorite",
    );
  });

  it("geçersiz / null / boş dil → TR fallback", () => {
    expect(invitationStrings("de").rsvp.submit).toBe(
      invitationStrings("tr").rsvp.submit,
    );
    expect(invitationStrings(null).rsvp.submit).toBe("Yanıtı Gönder");
    expect(invitationStrings(undefined).countdown.title).toBe("Geri Sayım");
  });

  it("her dilde tüm bölümler dolu (eksik anahtar yok)", () => {
    for (const loc of ["tr", "en", "sr"] as const) {
      const s = invitationStrings(loc);
      expect(s.rsvp.yes).toBeTruthy();
      expect(s.countdown.day).toBeTruthy();
      expect(s.venue.directions).toBeTruthy();
      expect(s.gift.headline).toBeTruthy();
      expect(s.hotels.reserve).toBeTruthy();
      expect(s.expired.body).toBeTruthy();
    }
  });
});

describe("eventHeading — etkinlik türüne + dile göre başlık", () => {
  it("etkinlik türüne göre farklı başlık", () => {
    expect(eventHeading("tr", "wedding")).toBe("Düğün Davetiyesi");
    expect(eventHeading("tr", "birthday")).toBe("Doğum Günü Daveti");
    expect(eventHeading("tr", "engagement")).toBe("Nişan Davetiyesi");
    expect(eventHeading("tr", "henna")).toBe("Kına Gecesi Daveti");
  });

  it("dile göre lokalize", () => {
    expect(eventHeading("en", "birthday")).toBe("Birthday Invitation");
    expect(eventHeading("sr", "wedding")).toBe("Pozivnica za venčanje");
  });

  it("bilinmeyen tür → düğün, bilinmeyen dil → TR fallback", () => {
    expect(eventHeading("tr", "xyz")).toBe("Düğün Davetiyesi");
    expect(eventHeading("tr", null)).toBe("Düğün Davetiyesi");
    expect(eventHeading("de", "birthday")).toBe(eventHeading("tr", "birthday"));
  });
});

describe("defaultEyebrow — etkinlik-türüne göre hero eyebrow varsayılanı", () => {
  it("doğum günü düğün eyebrow'u göstermez", () => {
    expect(defaultEyebrow("tr", "birthday")).toBe("Doğum günü kutlamamıza davetlisiniz");
    expect(defaultEyebrow("tr", "wedding")).toBe("Düğün törenimize davetlisiniz");
  });
  it("dile + fallback'e saygılı", () => {
    expect(defaultEyebrow("en", "engagement")).toBe("You're invited to our engagement");
    expect(defaultEyebrow("tr", null)).toBe("Düğün törenimize davetlisiniz");
  });
});
