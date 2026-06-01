import { describe, it, expect } from "vitest";
import { rateLimit, pruneRateLimitBuckets, clientIp } from "../rate-limit";

const NOW = 1_700_000_000_000;
const WINDOW = 60_000;

describe("rateLimit (sliding window)", () => {
  it("limit altında izin verir, remaining düşer", () => {
    const k = "t1";
    expect(rateLimit(k, 3, WINDOW, NOW)).toMatchObject({ ok: true, remaining: 2 });
    expect(rateLimit(k, 3, WINDOW, NOW)).toMatchObject({ ok: true, remaining: 1 });
    expect(rateLimit(k, 3, WINDOW, NOW)).toMatchObject({ ok: true, remaining: 0 });
  });

  it("limit aşılınca bloklar + retryAfter verir", () => {
    const k = "t2";
    rateLimit(k, 2, WINDOW, NOW);
    rateLimit(k, 2, WINDOW, NOW);
    const blocked = rateLimit(k, 2, WINDOW, NOW);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("pencere dolunca sayaç sıfırlanır", () => {
    const k = "t3";
    rateLimit(k, 1, WINDOW, NOW);
    expect(rateLimit(k, 1, WINDOW, NOW).ok).toBe(false);
    // pencere sonrası → yeniden izin
    expect(rateLimit(k, 1, WINDOW, NOW + WINDOW + 1).ok).toBe(true);
  });

  it("farklı anahtarlar bağımsız", () => {
    expect(rateLimit("a", 1, WINDOW, NOW).ok).toBe(true);
    expect(rateLimit("b", 1, WINDOW, NOW).ok).toBe(true);
  });

  it("pruneRateLimitBuckets süresi geçmişleri temizler", () => {
    rateLimit("old", 1, WINDOW, NOW);
    const pruned = pruneRateLimitBuckets(NOW + WINDOW + 1);
    expect(pruned).toBeGreaterThanOrEqual(1);
  });
});

describe("clientIp", () => {
  it("x-forwarded-for ilk IP'yi alır", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(clientIp(req)).toBe("1.2.3.4");
  });

  it("header yoksa 'unknown'", () => {
    expect(clientIp(new Request("https://x.test"))).toBe("unknown");
  });
});
