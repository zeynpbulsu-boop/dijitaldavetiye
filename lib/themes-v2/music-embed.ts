/**
 * Müzik embed çözümleyici.
 *
 * Çift, davetiyesine KENDİ şarkısını (Sia, Ed Sheeran, her popüler parça)
 * Spotify / YouTube / Apple Music linkiyle ekler. Telifli kaydı LİSANSLI
 * platformun resmi oynatıcısı (iframe) çalar — dosya bizde barınmaz, sıfır
 * telif riski. Bu, satılan bir üründe popüler şarkı kullanmanın tek yasal yolu.
 *
 * `music_url` alanı:
 *   - Spotify/YouTube/Apple linki → resmi embed oynatıcı (MusicEmbed)
 *   - .mp3/.m4a vb. dosya          → ambient <audio> (useAmbientAudio)
 *   - boş                          → temanın kamu-malı klasik default'u
 */

export type MusicPlatform = "spotify" | "youtube" | "apple";

export interface MusicEmbed {
  platform: MusicPlatform;
  embedUrl: string;
  /** Oynatıcı yüksekliği (px) — platform/içerik tipine göre. */
  height: number;
}

/** Bir Spotify/YouTube/Apple Music linkini resmi embed oynatıcıya çevirir. */
export function parseMusicEmbed(raw?: string | null): MusicEmbed | null {
  if (!raw) return null;
  const url = raw.trim();

  // Spotify — track/album/playlist/episode (intl-xx prefix'i tolere edilir)
  const sp = url.match(
    /open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode)\/([A-Za-z0-9]+)/i,
  );
  if (sp) {
    const type = sp[1].toLowerCase();
    return {
      platform: "spotify",
      embedUrl: `https://open.spotify.com/embed/${type}/${sp[2]}`,
      height: type === "track" || type === "episode" ? 152 : 352,
    };
  }

  // YouTube — watch / youtu.be / embed / shorts / music.youtube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/|music\.youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/i,
  );
  if (yt) {
    return {
      platform: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`,
      height: 200,
    };
  }

  // Apple Music — embed. öneki yeterli
  const am = url.match(/(?:embed\.)?music\.apple\.com\/(.+)$/i);
  if (am) {
    return {
      platform: "apple",
      embedUrl: `https://embed.music.apple.com/${am[1]}`,
      height: 175,
    };
  }

  return null;
}

/** music_url barındırılan bir ses dosyası mı (embed linki değil)? */
export function isHostedAudio(url?: string | null): boolean {
  return !!url && /\.(mp3|m4a|aac|ogg|wav|flac)(\?|#|$)/i.test(url.trim());
}
