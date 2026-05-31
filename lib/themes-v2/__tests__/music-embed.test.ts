import { describe, it, expect } from "vitest";
import { parseMusicEmbed, isHostedAudio } from "../music-embed";

describe("parseMusicEmbed", () => {
  it("Spotify track → resmi embed URL", () => {
    const r = parseMusicEmbed(
      "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v",
    );
    expect(r?.platform).toBe("spotify");
    expect(r?.embedUrl).toBe(
      "https://open.spotify.com/embed/track/0tgVpDi06FyKpA1z0VMD4v",
    );
  });

  it("Spotify intl-xx öneki tolere edilir", () => {
    expect(parseMusicEmbed("https://open.spotify.com/intl-tr/track/abc123")?.platform).toBe(
      "spotify",
    );
  });

  it("YouTube watch → videoId + embed", () => {
    const r = parseMusicEmbed("https://www.youtube.com/watch?v=2Vv-BfVoq4g");
    expect(r?.platform).toBe("youtube");
    expect(r?.videoId).toBe("2Vv-BfVoq4g");
  });

  it("youtu.be kısa link", () => {
    expect(parseMusicEmbed("https://youtu.be/2Vv-BfVoq4g")?.videoId).toBe("2Vv-BfVoq4g");
  });

  it("başlangıç saniyesi t=63", () => {
    expect(parseMusicEmbed("https://www.youtube.com/watch?v=2Vv-BfVoq4g&t=63")?.start).toBe(63);
  });

  it("başlangıç t=1m3s → 63", () => {
    expect(parseMusicEmbed("https://youtu.be/2Vv-BfVoq4g?t=1m3s")?.start).toBe(63);
  });

  it("Apple Music linki", () => {
    expect(
      parseMusicEmbed("https://music.apple.com/tr/album/x/123?i=456")?.platform,
    ).toBe("apple");
  });

  it("boş / geçersiz / null → null", () => {
    expect(parseMusicEmbed("")).toBeNull();
    expect(parseMusicEmbed("https://example.com/foo")).toBeNull();
    expect(parseMusicEmbed(null)).toBeNull();
  });
});

describe("isHostedAudio", () => {
  it("mp3 → true", () => expect(isHostedAudio("/audio/x.mp3")).toBe(true));
  it("YouTube → false", () =>
    expect(isHostedAudio("https://youtube.com/watch?v=x")).toBe(false));
  it("null → false", () => expect(isHostedAudio(null)).toBe(false));
});
