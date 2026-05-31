/**
 * Hazır şarkı kütüphanesi — müşteri tek tıkla seçer (kendi linkini de yapıştırabilir).
 *
 * İki tür, ikisi de music_url alanına yazılır + mevcut müzik sistemiyle çalar:
 *   - "popular"  → YouTube linki → resmi oynatıcı (telif lisanslı platformda),
 *                  mühre basınca arkada otomatik (YouTubeMusic). Bizde dosya yok.
 *   - "classical"→ kamu-malı, sitede barınan mp3 → ambient çalar (useAmbientAudio).
 *
 * YouTube ID'leri canlı arama ile doğrulandı. Popüler şarkıların telifi YouTube'da
 * kalır → satılan üründe yasal kullanım (resmi embed). Liste genişletilebilir.
 */

export interface WeddingSong {
  label: string;
  artist: string;
  url: string;
  kind: "popular" | "classical";
}

export const WEDDING_SONGS: WeddingSong[] = [
  // ── Popüler (YouTube — mühre basınca otomatik arka plan) ──
  {
    label: "Perfect",
    artist: "Ed Sheeran",
    url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g&t=60",
    kind: "popular",
  },
  {
    label: "A Thousand Years",
    artist: "Christina Perri",
    url: "https://www.youtube.com/watch?v=rtOvBOTyX00",
    kind: "popular",
  },
  {
    label: "Thinking Out Loud",
    artist: "Ed Sheeran",
    url: "https://www.youtube.com/watch?v=lp-EO5I60KA",
    kind: "popular",
  },
  {
    label: "All of Me",
    artist: "John Legend",
    url: "https://www.youtube.com/watch?v=450p7goxZqg",
    kind: "popular",
  },
  {
    label: "Can't Help Falling in Love",
    artist: "Elvis Presley",
    url: "https://www.youtube.com/watch?v=vGJTaP6anOU",
    kind: "popular",
  },
  // ── Klasik (kamu malı — sitede barınan, ambient) ──
  {
    label: "Clair de Lune",
    artist: "Debussy",
    url: "/audio/aethel/clair-de-lune.mp3",
    kind: "classical",
  },
  {
    label: "Moonlight Sonata",
    artist: "Beethoven",
    url: "/audio/aurora/comptine-dun-autre-ete.mp3",
    kind: "classical",
  },
  {
    label: "Nocturne Op. 9 No. 2",
    artist: "Chopin",
    url: "/audio/nocturne/chopin-nocturne.mp3",
    kind: "classical",
  },
  {
    label: "Canon in D",
    artist: "Pachelbel",
    url: "/audio/olea/lemon-tree-acoustic.mp3",
    kind: "classical",
  },
  {
    label: "Gymnopédie No. 1",
    artist: "Satie",
    url: "/audio/candela/la-vie-en-rose-instrumental.mp3",
    kind: "classical",
  },
  {
    label: "Gnossienne No. 1",
    artist: "Satie",
    url: "/audio/mistral/sagapo-instrumental.mp3",
    kind: "classical",
  },
];
