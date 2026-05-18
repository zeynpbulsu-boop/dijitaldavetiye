/**
 * EditionCard — TemplateCarousel + /tasarimlar dedicated catalog
 * tarafından paylaşılan kart verisi. Tek doğruluk kaynağı.
 *
 * PR #18: Kart numarası + "EN SEVİLEN" rozeti + kategorize edilebilir
 * eventType eklendi (bizevleniyoruz.net /tasarimlar paritesi).
 */

export type EditionEventType = "wedding" | "save-the-date" | "birthday" | "engagement";

export interface EditionCard {
  /** "01"–"06" — koleksiyon eseri hissi (bizevleniyoruz paritesi). */
  number: string;
  slug: string;
  name: string;
  category: string;
  /** Sağ üstte kategori chip (PL/TDI paritesi). */
  vibe: string;
  /** Etkinlik filtresi — /tasarimlar sayfasındaki chip'ler için. */
  eventTypes: EditionEventType[];
  /** Kart arkaplan gradient'ı — coverScene yüklenirken fallback. */
  bg: { from: string; to: string };
  /** Full-bleed sahne (fal.ai rendered, JPEG). */
  coverScene: string;
  /** Wax seal PNG — sahnenin üstünde merkez ortada. */
  seal: string;
  /** "YENİ" rozeti. */
  isNew?: boolean;
  /** "EN SEVİLEN" rozeti — most popular (bizevleniyoruz paritesi). */
  isPopular?: boolean;
  /** Sahne koyu mu (font rengi krem). */
  isDark?: boolean;
  /** /tasarimlar grid'inde kısa açıklama (1 satır). */
  shortDescription: string;
}

export const editionCards: EditionCard[] = [
  {
    number: "01",
    slug: "aethel",
    name: "Aethel's Chapel",
    category: "Toskana · Antik Şapel",
    vibe: "Elegant",
    eventTypes: ["wedding", "save-the-date"],
    bg: { from: "#F2EEE4", to: "#D8DCC9" },
    coverScene: "/aethel/cover.jpg",
    seal: "/aethel/wax-seal-luxe.png",
    isPopular: true,
    shortDescription: "Antik şapel, selvi ve zeytinlik — golden hour Toskana.",
  },
  {
    number: "02",
    slug: "atelier-indigo",
    name: "Atelier Indigo",
    category: "Gece Yarısı · Altın Varak",
    vibe: "Dramatic",
    eventTypes: ["wedding", "engagement"],
    bg: { from: "#0F1A3D", to: "#1B2E5F" },
    coverScene: "/atelier-indigo/cover.jpg",
    seal: "/atelier-indigo/wax-seal.png",
    isDark: true,
    isNew: true,
    shortDescription: "Gece yarısı yıldız semaları, hilal ve altın toz.",
  },
  {
    number: "03",
    slug: "mansion-lights",
    name: "Mansion Lights",
    category: "Akşam Yalısı · Şampanya",
    vibe: "Regal",
    eventTypes: ["wedding"],
    bg: { from: "#11261E", to: "#1F4435" },
    coverScene: "/mansion-lights/cover.jpg",
    seal: "/mansion-lights/wax-seal.png",
    isDark: true,
    isNew: true,
    shortDescription: "Yalı balo salonu, kristal avize, bordo kadife.",
  },
  {
    number: "04",
    slug: "bodrum-blue",
    name: "Bodrum Blue",
    category: "Ege Mavisi · Kireç Beyazı",
    vibe: "Coastal",
    eventTypes: ["wedding", "save-the-date"],
    bg: { from: "#F4F1EA", to: "#CFDCE3" },
    coverScene: "/bodrum-blue/cover.jpg",
    seal: "/bodrum-blue/wax-seal.png",
    shortDescription: "Ege kıyısı, yelkenli, begonvil ve Cycladic beyaz.",
  },
  {
    number: "05",
    slug: "olive-grove",
    name: "Olive Grove",
    category: "Akdeniz · Zeytin Bahçesi",
    vibe: "Botanical",
    eventTypes: ["wedding", "save-the-date", "engagement"],
    bg: { from: "#F2EFE0", to: "#C8D2A8" },
    coverScene: "/olive-grove/cover.jpg",
    seal: "/olive-grove/wax-seal.png",
    shortDescription: "Akdeniz zeytinlik, sage yapraklar, pale gold ışık.",
  },
  {
    number: "06",
    slug: "aurora",
    name: "Aurora",
    category: "Modern Minimal · Mor",
    vibe: "Modern",
    eventTypes: ["wedding", "birthday", "save-the-date"],
    bg: { from: "#F8F7F4", to: "#D8D2EC" },
    coverScene: "/aurora/cover.jpg",
    seal: "/aurora/wax-seal.png",
    isNew: true,
    shortDescription: "Modernist gradient bant, lavanta, rose gold arc.",
  },
];

export const eventTypeLabels: Record<EditionEventType, string> = {
  wedding: "Düğün",
  "save-the-date": "Save the Date",
  birthday: "Doğum Günü",
  engagement: "Nişan",
};
