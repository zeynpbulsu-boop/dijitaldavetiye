import type { ThemeV2Meta, ThemeV2Data, ThemeV2Slug } from "./types";

export const THEMES_V2: Record<ThemeV2Slug, ThemeV2Meta> = {
  celenk: {
    slug: "celenk",
    name: "Çelenk",
    tagline: "Suluboya · Çiçek çelengi · Sade romantik",
    mood: "romantic",
    signature: "SVG çelenk yavaşça çiziliyor, isim ortadan beliriyor",
    palette: {
      bg: "#F4EDE5",
      paper: "#FBF6EE",
      ink: "#3A2A1F",
      inkSoft: "#6B5847",
      accent: "#7A8870",
      countdownBg: "#7A8870",
      countdownInk: "#F4EDE5",
    },
  },
  polaroid: {
    slug: "polaroid",
    name: "Polaroid",
    tagline: "Anılar · Polaroid yığını · Sıcak nostaljik",
    mood: "nostalgic",
    signature: "Polaroid'ler scroll'da yerlerine düşüyor, el yazısı caption",
    palette: {
      bg: "#EFE4D2",
      paper: "#FCF8EF",
      ink: "#3D2C1E",
      inkSoft: "#7A6149",
      accent: "#B86E4E",
      countdownBg: "#7A6149",
      countdownInk: "#FCF8EF",
    },
  },
  kurdele: {
    slug: "kurdele",
    name: "Kurdele",
    tagline: "Zarif · Mavi kurdele · Mektup açılışı",
    mood: "feminine",
    signature: "Kurdele çözülüyor, zarf açılıyor, mektup kayarak çıkıyor",
    palette: {
      bg: "#EEF2F0",
      paper: "#FBF8F2",
      ink: "#2E3942",
      inkSoft: "#5C6B76",
      accent: "#A7BBC9",
      countdownBg: "#5C6B76",
      countdownInk: "#FBF8F2",
    },
  },
  fener: {
    slug: "fener",
    name: "Fener",
    tagline: "Bağ evi · Tap-to-light · Sinematik",
    mood: "cinematic",
    signature: "Tıklayınca ampuller sırayla yanıyor, gündüz→gece geçiş",
    palette: {
      bg: "#F2EAD7",
      paper: "#1E1810",
      ink: "#2A1F14",
      inkSoft: "#6E5A40",
      accent: "#E8B05D",
      countdownBg: "#2A1F14",
      countdownInk: "#E8B05D",
    },
  },
  defter: {
    slug: "defter",
    name: "Defter",
    tagline: "Keten kapak · Sayfa çevirme · Samimi",
    mood: "intimate",
    signature: "Scroll'da sayfalar 3D çevriliyor, el yazısı mürekkep",
    palette: {
      bg: "#E5DCC4",
      paper: "#F5EEDE",
      ink: "#2D2418",
      inkSoft: "#665542",
      accent: "#8B6F3F",
      countdownBg: "#665542",
      countdownInk: "#F5EEDE",
    },
  },
  geceyarisi: {
    slug: "geceyarisi",
    name: "Geceyarısı",
    tagline: "Lacivert · Altın · Takımyıldız",
    mood: "premium-dark",
    signature: "Yıldızlar yanıp sönüyor, kayan yıldız, slow fade isim",
    palette: {
      bg: "#0E1730",
      paper: "#1A2240",
      ink: "#F0E2BF",
      inkSoft: "#A8B0C8",
      accent: "#D4A852",
      countdownBg: "#1A2240",
      countdownInk: "#D4A852",
    },
  },
  postakart: {
    slug: "postakart",
    name: "Postakart",
    tagline: "Vintage · Pul · Çevirme animasyonu",
    mood: "playful",
    signature: "Eskimiş kart eğilerek geliyor, tıkla→arkaya çeviriyor",
    palette: {
      bg: "#E3D5B5",
      paper: "#F5E8C9",
      ink: "#3A2918",
      inkSoft: "#7A5E3B",
      accent: "#A8463A",
      countdownBg: "#7A5E3B",
      countdownInk: "#F5E8C9",
    },
  },
};

export const SAMPLE_DATA: ThemeV2Data = {
  coupleName: "Elif & Can",
  partnerOne: "Elif",
  partnerTwo: "Can",
  monogram: "E&C",
  eyebrow: "Düğün törenimize davetlisiniz",
  greeting:
    "En güzel hikâyemize başlamadan önce, bizimle paylaşmanızı çok isteriz.",
  date: {
    day: "15",
    month: "Haziran",
    year: "2026",
    weekday: "Pazar",
    time: "18:00 — 23:00",
    iso: "2026-06-15T18:00:00+03:00",
  },
  venue: {
    name: "Cunda Adası — Sahil Köşkü",
    city: "Ayvalık · Balıkesir",
    address: "Lale Sokak No 7, Cunda Adası",
  },
  story: {
    title: "Anılarımız",
    body:
      "Bir bahar günü tanıştık. Küçük tesadüflerin büyük aşklara dönüştüğünü öğrendik. Bugün bu yolculuğun en güzel adımını sizlerle paylaşmanın heyecanını yaşıyoruz.",
  },
  photos: [
    { caption: "İlk tanıştığımız gün", rotation: -3 },
    { caption: "Mart 2024 · Kapadokya", rotation: 2 },
    { caption: "Birlikte ilk yılbaşı", rotation: -1 },
    { caption: "Evet dediği an", rotation: 3 },
    { caption: "Bir nehir kenarı", rotation: -2 },
  ],
  schedule: [
    { time: "17:00", label: "Karşılama" },
    { time: "18:00", label: "Nikâh Töreni" },
    { time: "19:00", label: "Kokteyl" },
    { time: "20:00", label: "Yemek" },
    { time: "22:00", label: "Dans" },
  ],
  menu: [
    {
      heading: "Başlangıçlar",
      items: [
        { name: "Mevsim yeşillikleri salatası", detail: "Keçi peyniri, ceviz, nar pekmezi" },
        { name: "Levrek carpaccio", detail: "Limon, kapari, taze fesleğen" },
        { name: "Mezeler tabağı", detail: "Humus, haydari, közlenmiş biber" },
      ],
    },
    {
      heading: "Ana Yemek",
      items: [
        { name: "Kuzu tandır", detail: "Patates püresi, kekikli sos" },
        { name: "Izgara levrek", detail: "Limonlu sebze, sote ıspanak" },
      ],
    },
    {
      heading: "Tatlılar",
      items: [
        { name: "Düğün pastası", detail: "Vanilyalı bisküvi, yaz meyveleri" },
        { name: "Sütlü tatlı seçkisi" },
      ],
    },
    {
      heading: "İçecekler",
      items: [
        { name: "Karşılama kokteyli", detail: "Köpüklü şarap, çilek" },
        { name: "Şarap, bira, alkolsüz seçenekler" },
      ],
    },
  ],
  extraInfo:
    "Davetlilerimize iletmek istediğimiz her şey için size özel bir alan. Kıyafet seçimi, çocuklara dair notlar, hediye tercihleri ya da ulaşım ayrıntıları… Buradan bu bölümü dilediğiniz gibi şekillendirebilirsiniz.",
  footerNote: "Sizleri aramızda görmek bizi çok mutlu edecek.",
};

export function getThemeV2(slug: ThemeV2Slug): ThemeV2Meta | undefined {
  return THEMES_V2[slug];
}

export function listThemesV2(): ThemeV2Meta[] {
  return Object.values(THEMES_V2);
}
