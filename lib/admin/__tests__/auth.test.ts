import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Admin auth — sahip paneli güvenlik kapısı testleri.
 *
 * next/headers cookies() vi.hoisted ile mock'lanır (factory dışarıdaki
 * değişkene erişebilsin diye). Her test öncesi cookie + ilgili env temizlenir;
 * böylece "ADMIN_PASSWORD yoksa güvenli kapalı" gibi senaryolar izole.
 */

const { cookieStore } = vi.hoisted(() => ({
  cookieStore: new Map<string, string>(),
}));

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: (name: string) =>
      cookieStore.has(name)
        ? { name, value: cookieStore.get(name) }
        : undefined,
  }),
}));

import {
  sessionToken,
  verifyPassword,
  isAdminAuthed,
  adminPasswordConfigured,
  ADMIN_COOKIE,
} from "../auth";

beforeEach(() => {
  cookieStore.clear();
  delete process.env.ADMIN_PASSWORD;
  delete process.env.ADMIN_SESSION_SECRET;
});

describe("verifyPassword (zamanlama-güvenli karşılaştırma)", () => {
  it("ADMIN_PASSWORD yoksa her zaman false (güvenli kapalı)", () => {
    expect(verifyPassword("anything")).toBe(false);
  });

  it("doğru şifre → true", () => {
    process.env.ADMIN_PASSWORD = "s3cret-pw";
    expect(verifyPassword("s3cret-pw")).toBe(true);
  });

  it("yanlış şifre → false", () => {
    process.env.ADMIN_PASSWORD = "s3cret-pw";
    expect(verifyPassword("wrong")).toBe(false);
  });

  it("boş input → false", () => {
    process.env.ADMIN_PASSWORD = "s3cret-pw";
    expect(verifyPassword("")).toBe(false);
  });

  it("uzunluk farkı → false (timingSafeEqual patlamaz)", () => {
    process.env.ADMIN_PASSWORD = "short";
    expect(verifyPassword("a-much-longer-input")).toBe(false);
  });
});

describe("sessionToken (şifreden türetilmiş HMAC)", () => {
  it("ADMIN_PASSWORD yoksa null", () => {
    expect(sessionToken()).toBeNull();
  });

  it("deterministik (aynı şifre → aynı token)", () => {
    process.env.ADMIN_PASSWORD = "pw";
    expect(sessionToken()).toBe(sessionToken());
  });

  it("şifre değişince token değişir", () => {
    process.env.ADMIN_PASSWORD = "pw-a";
    const a = sessionToken();
    process.env.ADMIN_PASSWORD = "pw-b";
    expect(sessionToken()).not.toBe(a);
  });

  it("token şifreyi sızdırmaz, 64-hex format", () => {
    process.env.ADMIN_PASSWORD = "leak-me-pw";
    const t = sessionToken();
    expect(t).toMatch(/^[a-f0-9]{64}$/);
    expect(t).not.toContain("leak-me-pw");
  });

  it("ADMIN_SESSION_SECRET varsa şifreden bağımsız secret kullanır", () => {
    process.env.ADMIN_PASSWORD = "pw";
    const withoutSecret = sessionToken();
    process.env.ADMIN_SESSION_SECRET = "separate-secret";
    expect(sessionToken()).not.toBe(withoutSecret);
  });
});

describe("isAdminAuthed (cookie kapısı)", () => {
  it("şifre ayarlı değilse, cookie olsa bile false", () => {
    cookieStore.set(ADMIN_COOKIE, "whatever");
    expect(isAdminAuthed()).toBe(false);
  });

  it("cookie yoksa false", () => {
    process.env.ADMIN_PASSWORD = "pw";
    expect(isAdminAuthed()).toBe(false);
  });

  it("geçerli oturum token cookie'si → true", () => {
    process.env.ADMIN_PASSWORD = "pw";
    const tok = sessionToken();
    if (tok) cookieStore.set(ADMIN_COOKIE, tok);
    expect(isAdminAuthed()).toBe(true);
  });

  it("sahte/yanlış cookie → false", () => {
    process.env.ADMIN_PASSWORD = "pw";
    cookieStore.set(ADMIN_COOKIE, "f".repeat(64));
    expect(isAdminAuthed()).toBe(false);
  });
});

describe("adminPasswordConfigured", () => {
  it("ayarlı değilse false", () => {
    expect(adminPasswordConfigured()).toBe(false);
  });

  it("ayarlıysa true", () => {
    process.env.ADMIN_PASSWORD = "pw";
    expect(adminPasswordConfigured()).toBe(true);
  });
});
