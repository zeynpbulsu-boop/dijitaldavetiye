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
      countdownBg: "#5F6E57", // accent ile birebir aynıydı; derin adaçayı → countdownInk 4.69 (AA)
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
    signature: "Mühür kırılıp perde açılıyor, saten kurdele dalgalanıyor, mektup nefes alıyor",
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
    signature: "Mühür kırılınca bağ evinin ampulleri sırayla yanıyor",
    palette: {
      bg: "#F2EAD7",
      paper: "#FBF4E2", // koyu #1E1810 paylaşılan kart yüzeylerini kırıyordu (ink oranı 1.09→14.67)
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
    signature: "3D defter pointer'la eğiliyor, isimler ıslak mürekkep gibi beliriyor",
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
  locale: "tr",
  eventType: "wedding",
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
    lat: 39.3436,
    lng: 26.6741,
  },
  story: {
    title: "Anılarımız",
    body:
      "Bir bahar günü tanıştık. Küçük tesadüflerin büyük aşklara dönüştüğünü öğrendik. Bugün bu yolculuğun en güzel adımını sizlerle paylaşmanın heyecanını yaşıyoruz.",
  },
  photos: [
    { src: "/themes-v2/polaroid/scene-field.webp", caption: "İlk tanıştığımız gün", rotation: -3 },
    { src: "/themes-v2/polaroid/scene-mountain.webp", caption: "Mart 2024 · Kapadokya", rotation: 2 },
    { src: "/themes-v2/polaroid/scene-sunset.webp", caption: "Birlikte ilk yılbaşı", rotation: -1 },
    { src: "/themes-v2/postakart/ayvalik-landscape.webp", caption: "Evet dediği an", rotation: 3 },
    { src: "/themes-v2/polaroid/scene-shore.webp", caption: "Bir nehir kenarı", rotation: -2 },
  ],
  schedule: [
    { time: "17:00", label: "Karşılama" },
    { time: "18:00", label: "Nikâh Töreni" },
    { time: "19:00", label: "Kokteyl" },
    { time: "20:00", label: "Yemek" },
    { time: "22:00", label: "Dans" },
  ],
  // Menü DB kolonu + editör alanı gelene kadar demo'da da gizli
  // (parite: demoda görünen her bölüm satın alınan üründe de olmalı).
  menu: [],
  extraInfo: "", // parite: DB kolonu yok (bridge '' gönderiyor)
  footerNote: "Sizleri aramızda görmek bizi çok mutlu edecek.",
  gift: {
    iban: "TR00 0000 0000 0000 0000 0000 00",
    bank: "Örnek Bankası",
    accountHolder: "Elif Yılmaz",
    note: "Varlığınız bizim için en değerli hediye. Katkıda bulunmak isterseniz aşağıdaki hesap bilgilerini kullanabilirsiniz.",
  },
  hotels: [
    {
      name: "Cunda Taş Otel",
      address: "Cunda Adası, Ayvalık",
      price: "₺3.500 / gece",
      url: "https://maps.google.com",
      note: "Düğün alanına 5 dk; misafirlerimize özel indirim için 'NUVE' deyin.",
    },
    {
      name: "Ayvalık Sahil Butik",
      address: "Sahil Yolu, Ayvalık",
      price: "₺2.200 / gece",
      note: "Deniz manzaralı, kahvaltı dahil.",
    },
  ],
};

export function getThemeV2(slug: ThemeV2Slug): ThemeV2Meta | undefined {
  return THEMES_V2[slug];
}

export function listThemesV2(): ThemeV2Meta[] {
  return Object.values(THEMES_V2);
}
