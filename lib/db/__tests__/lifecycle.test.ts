import { describe, it, expect } from "vitest";
import {
  computeLiveUntil,
  isPastLiveUntil,
  isInvitationLive,
  isInvitationExpired,
} from "../lifecycle";

const DAY = 86_400_000;
const NOW = 1_700_000_000_000; // sabit epoch → deterministik test

/** ISO string'i ms cinsinden NOW'a göre offset'e çevir (gün). */
function daysFromNow(iso: string): number {
  return Math.round((new Date(iso).getTime() - NOW) / DAY);
}

describe("computeLiveUntil", () => {
  it("standard → 365 gün sonra", () => {
    expect(daysFromNow(computeLiveUntil("standard", NOW))).toBe(365);
  });

  it("premium → 730 gün sonra", () => {
    expect(daysFromNow(computeLiveUntil("premium", NOW))).toBe(730);
  });

  it("sade → 180 gün sonra", () => {
    expect(daysFromNow(computeLiveUntil("sade", NOW))).toBe(180);
  });

  it("null/undefined tier → standard (365) fallback", () => {
    expect(daysFromNow(computeLiveUntil(null, NOW))).toBe(365);
    expect(daysFromNow(computeLiveUntil(undefined, NOW))).toBe(365);
  });

  it("geçerli ISO döndürür", () => {
    expect(computeLiveUntil("standard", NOW)).toMatch(
      /^\d{4}-\d{2}-\d{2}T/,
    );
  });
});

describe("isPastLiveUntil", () => {
  it("null/undefined → false (henüz dolmamış sayılır)", () => {
    expect(isPastLiveUntil(null, NOW)).toBe(false);
    expect(isPastLiveUntil(undefined, NOW)).toBe(false);
  });

  it("geçmiş tarih → true", () => {
    expect(isPastLiveUntil(new Date(NOW - DAY).toISOString(), NOW)).toBe(true);
  });

  it("gelecek tarih → false", () => {
    expect(isPastLiveUntil(new Date(NOW + DAY).toISOString(), NOW)).toBe(false);
  });

  it("bozuk tarih → false (crash yok)", () => {
    expect(isPastLiveUntil("bozuk-tarih", NOW)).toBe(false);
  });
});

describe("isInvitationLive (herkese görünür mü)", () => {
  it("live + gelecek live_until → true", () => {
    expect(
      isInvitationLive("live", new Date(NOW + DAY).toISOString(), NOW),
    ).toBe(true);
  });

  it("live + live_until null → true (süre yoksa görünür)", () => {
    expect(isInvitationLive("live", null, NOW)).toBe(true);
  });

  it("live ama süresi dolmuş → false", () => {
    expect(
      isInvitationLive("live", new Date(NOW - DAY).toISOString(), NOW),
    ).toBe(false);
  });

  it("draft / paid / archived → false", () => {
    const future = new Date(NOW + DAY).toISOString();
    expect(isInvitationLive("draft", future, NOW)).toBe(false);
    expect(isInvitationLive("paid", future, NOW)).toBe(false);
    expect(isInvitationLive("archived", future, NOW)).toBe(false);
  });
});

describe("isInvitationExpired (süresi doldu sayfası)", () => {
  it("live + geçmiş → true", () => {
    expect(
      isInvitationExpired("live", new Date(NOW - DAY).toISOString(), NOW),
    ).toBe(true);
  });

  it("archived + geçmiş → true", () => {
    expect(
      isInvitationExpired("archived", new Date(NOW - DAY).toISOString(), NOW),
    ).toBe(true);
  });

  it("live + gelecek → false (hâlâ yayında)", () => {
    expect(
      isInvitationExpired("live", new Date(NOW + DAY).toISOString(), NOW),
    ).toBe(false);
  });

  it("draft + geçmiş → false (hiç yayınlanmamış)", () => {
    expect(
      isInvitationExpired("draft", new Date(NOW - DAY).toISOString(), NOW),
    ).toBe(false);
  });

  it("live_until null → false", () => {
    expect(isInvitationExpired("live", null, NOW)).toBe(false);
  });
});
