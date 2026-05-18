/**
 * FAZ 5.12 — Luxe theme presets per edition.
 *
 * 6 edisyonun tüm renk + asset path + meta bilgisi tek dosyada.
 * LuxeEditionDemo bunlardan birini alıp render eder.
 */

import { AETHEL_CHAPEL, EDITIONS, type EditionMeta } from "./tokens";
import type { LuxeEditionTheme } from "@/components/themed/luxe-edition-demo";

/* ── 6. AETHEL CHAPEL (mevcut) ─────────────────────────────────── */
export const AETHEL_THEME: LuxeEditionTheme = {
  meta: AETHEL_CHAPEL,
  bg: "#F2EEE4",
  footerBg: "#E8E3D5",
  ink: "#2E3326",
  inkSoft: "#5E6650",
  inkMuted: "#8A9078",
  accent: "#7A8A6E",
  haloColor: "#9EAA8E",
  waxSealSrc: "/aethel/wax-seal-luxe.png",
  watermarkSrc: "/aethel/chapel-vignette.png",
  coupleName: "Defne & Aras",
  monogram: "D&A",
  venue: "Aethel's Chapel · Toscana",
  greeting: "Bir davet sizi bekliyor",
  heroEyebrow: "Evleniyoruz",
  heroCta: "Bizimle olur musun?",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "Clair de Lune · Claude Debussy",
  footerNote: "Bizimle olmanız bizi onurlandırır",
  defaultDate: { day: "12", month: "Eylül", year: "2026" },
  ambient: "doves",
  storyGlyph: "cross",
  story: [
    {
      year: "2019",
      title: "Floransa'da bir öğleden sonra",
      body: "Defne, Uffizi'nin önündeki bir kahve dükkânında bir İtalyan dergisini açmıştı. Aras, aynı sayfayı çevirmek için elini uzattığında ikisi de güldü.",
    },
    {
      year: "2021",
      title: "İlk yolculuk",
      body: "Toskana'nın küçük yollarında bir araba kiraladık. Yolda Aethel adında bir antik şapele rastladık — bir gün burada söz vermenin güzel olacağını söyledik.",
    },
    {
      year: "2024",
      title: "Söz",
      body: "Aynı şapelin önünde, zeytin ağaçlarının altında. Defne 'Evet' dedi; Aras o gün cebinde küçük bir bal kavanozu taşıyordu — sebebini hâlâ anlamış değiliz.",
    },
    {
      year: "2026",
      title: "Aethel'da buluşalım",
      body: "Sonbahar, üzüm hasadı ve birbirimizden başka bir şey istemiyoruz. Geldiğinizde, ışığın nasıl olduğunu görmek için biraz erken gelin.",
    },
  ],
};

/* ── 1. ATELIER INDIGO (gece mavisi + altın varak) ─────────────── */
export const ATELIER_INDIGO_THEME: LuxeEditionTheme = {
  meta: EDITIONS["atelier-indigo"],
  bg: "#0F1A3D",
  footerBg: "#0A1430",
  ink: "#F2EAD3",
  inkSoft: "rgba(242, 234, 211, 0.78)",
  inkMuted: "rgba(212, 161, 88, 0.78)",
  accent: "#D4A158",
  haloColor: "#D4A158",
  waxSealSrc: "/atelier-indigo/wax-seal.png",
  watermarkSrc: "/atelier-indigo/watermark.png",
  coupleName: "Selin & Mert",
  monogram: "S&M",
  venue: "Çırağan Sarayı · İstanbul",
  greeting: "Gece yarısı bir davet",
  heroEyebrow: "Birlikte",
  heroCta: "Yanımızda olur musun?",
  envelopeCta: "Mührü Kır",
  musicTrack: "Nocturne in E♭ · Chopin",
  footerNote: "Bir gece masalı için bekleriz",
  defaultDate: { day: "24", month: "Ekim", year: "2026" },
  ambient: "starfield",
  storyGlyph: "moon",
  story: [
    {
      year: "2018",
      title: "Bir gala gecesi",
      body: "Selin, Pera'da bir caz gecesinde. Mert, kalabalığın arasında onu fark eden tek kişi. Müzik bittiğinde Selin onun adını bile bilmiyordu.",
    },
    {
      year: "2020",
      title: "Bir gece pencere kenarında",
      body: "Karantina vardı; balkonlardan birbirimize kitap önerdik. İlk öpüştüğümüz gece İstanbul üstünde tam dolunay vardı.",
    },
    {
      year: "2023",
      title: "Bosphorus'un altın saati",
      body: "Bir vapur yolculuğunda Mert cebinden eski bir mektup çıkardı — Selin'in iki yıl önce ona bıraktığı not. Cevabını o gün verdi.",
    },
    {
      year: "2026",
      title: "Çırağan'da bir akşam",
      body: "Altın varak, gece mavisi ve sizinle. Gelirseniz, gökyüzünden bahsetmeyi ihmal etmeyin — orada en güzel hediyeyi vereceğiz.",
    },
  ],
};

/* ── 2. MANSION LIGHTS (boğazda akşam yalısı) ──────────────────── */
export const MANSION_LIGHTS_THEME: LuxeEditionTheme = {
  meta: EDITIONS["mansion-lights"],
  bg: "#4A1521",
  footerBg: "#3A0F19",
  ink: "#F2EAD3",
  inkSoft: "rgba(242, 234, 211, 0.78)",
  inkMuted: "rgba(217, 179, 106, 0.85)",
  accent: "#D9B36A",
  haloColor: "#D9B36A",
  waxSealSrc: "/mansion-lights/wax-seal.png",
  watermarkSrc: "/mansion-lights/watermark.png",
  coupleName: "Zeynep & Kerem",
  monogram: "Z&K",
  venue: "Sait Halim Paşa Yalısı · Boğaziçi",
  greeting: "Boğazda bir akşam",
  heroEyebrow: "Şerefimize",
  heroCta: "Bizi onurlandırır mısın?",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "La Vie en Rose · Édith Piaf",
  footerNote: "Geleneğe bir ışık daha katmak için",
  defaultDate: { day: "8", month: "Haziran", year: "2026" },
  ambient: "chandelier",
  storyGlyph: "candle",
  story: [
    {
      year: "2017",
      title: "Bir aile yemeği",
      body: "Zeynep'in dedesinin yalısında bir akşam. Kerem misafir olarak gelmişti ama akşam yemeğine kalmasına Zeynep'in büyükannesi sebep oldu.",
    },
    {
      year: "2019",
      title: "Bir Boğaz turu",
      body: "Üç saatlik bir vapur yolculuğunda Kerem'in cebinde küçük bir not vardı. Notu açmadan denize attı; 'Lazım olmadı, sen yanımdaydın' dedi.",
    },
    {
      year: "2024",
      title: "Söz töreni",
      body: "Aynı yalının balkonunda, kristal avizenin altında. Aile büyükleri vardı; iki tarafın da hâlâ ezberlediği bir konuşma yapıldı.",
    },
    {
      year: "2026",
      title: "Sait Halim Paşa'da",
      body: "Boğaz'a karşı, bordo kadife ve şampanya. Sizi bu masaya bekliyoruz — gece bittiğinde, bir şeyleri hatırlamak istemeyebilirsiniz.",
    },
  ],
};

/* ── 3. BODRUM BLUE (Ege esintisi) ─────────────────────────────── */
export const BODRUM_BLUE_THEME: LuxeEditionTheme = {
  meta: EDITIONS["bodrum-blue"],
  bg: "#F4F1EA",
  footerBg: "#E8E3D8",
  ink: "#1F3848",
  inkSoft: "rgba(31, 56, 72, 0.72)",
  inkMuted: "rgba(74, 126, 148, 0.7)",
  accent: "#4A7E94",
  haloColor: "#7BA8BD",
  waxSealSrc: "/bodrum-blue/wax-seal.png",
  watermarkSrc: "/bodrum-blue/watermark.png",
  coupleName: "Ayda & Can",
  monogram: "A&C",
  venue: "Maçakızı · Türkbükü",
  greeting: "Bir Ege akşamı",
  heroEyebrow: "Denize karşı",
  heroCta: "Bizimle yelken aç",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "Σ'αγαπώ · George Dalaras",
  footerNote: "Tuz, rüzgar ve birbirimiz için",
  defaultDate: { day: "27", month: "Temmuz", year: "2026" },
  ambient: "waves",
  storyGlyph: "anchor",
  story: [
    {
      year: "2018",
      title: "Türkbükü'nde bir öğle",
      body: "Ayda, bir teknede staj yapıyordu; Can o yaz Bodrum'daki ailesine yardım için gelmişti. Birbirlerine ilk söyledikleri söz: 'Çapanı çek.'",
    },
    {
      year: "2020",
      title: "Bir Yunan adası",
      body: "Patmos'a bir yelken seferi. Fırtına çıktı, geceyi küçük bir limanda geçirdik. Sabah uyandığımızda, denize bakan tek bir kahvede oturduk.",
    },
    {
      year: "2024",
      title: "Söz, denize karşı",
      body: "Maçakızı'nın iskelesinde. Can elinde tuttuğu yüzüğü öyle bir sallıyordu ki neredeyse düşürüyordu. Ayda'nın 'Evet'i denizin sesinden yüksek geldi.",
    },
    {
      year: "2026",
      title: "Maçakızı'nda",
      body: "Ege esintisi, begonvil ve yelkenler. Mutlu olmaya, denize karşı söz vermeye geliyoruz — yanımızda olun.",
    },
  ],
};

/* ── 4. OLIVE GROVE (Alaçatı organik lüks) ─────────────────────── */
export const OLIVE_GROVE_THEME: LuxeEditionTheme = {
  meta: EDITIONS["olive-grove"],
  bg: "#F5F2EB",
  footerBg: "#E8E3D5",
  ink: "#2D3320",
  inkSoft: "rgba(45, 51, 32, 0.7)",
  inkMuted: "rgba(103, 120, 78, 0.8)",
  accent: "#67784E",
  haloColor: "#9EAA8E",
  waxSealSrc: "/olive-grove/wax-seal.png",
  watermarkSrc: "/olive-grove/watermark.png",
  coupleName: "Ipek & Yiğit",
  monogram: "İ&Y",
  venue: "Köy Evi · Alaçatı",
  greeting: "Zeytin ağaçlarının altında",
  heroEyebrow: "Sabah esintisinde",
  heroCta: "Bahçemizde bekleriz",
  envelopeCta: "Davetiyeyi Aç",
  musicTrack: "Lemon Tree · Fool's Garden (acoustic)",
  footerNote: "Limon kokulu bir sabah için",
  defaultDate: { day: "15", month: "Mayıs", year: "2026" },
  ambient: "leaves",
  storyGlyph: "olive",
  story: [
    {
      year: "2019",
      title: "Alaçatı'da bir hasat",
      body: "Ipek, ailesinin zeytinliğinde hasat günündeydi. Yiğit, komşu bağdan geldi; ellerinde toprak vardı, gülümsemesinde bir mevsim.",
    },
    {
      year: "2021",
      title: "Bir Pazar sabahı",
      body: "Köy meydanındaki kahvaltıda Yiğit, Ipek'in kahvesine bilmeden iki şeker attı. Ipek bir şey demedi — sadece o günden sonra hep iki şekerli içti.",
    },
    {
      year: "2024",
      title: "Söz, zeytin ağacının altında",
      body: "Aile mülkündeki en yaşlı zeytin ağacının altında. Yiğit cebinden Ipek'in dedesinin yüzüğünü çıkardı. Ağaç şahit oldu.",
    },
    {
      year: "2026",
      title: "Köy Evi'nde",
      body: "Sabah esintisi, limon ve sade bir sevinç. Geliniz, zeytinlerin arasında yeni bir hikâyenin tanığı olun.",
    },
  ],
};

/* ── 5. AURORA (modernist minimalist) ──────────────────────────── */
export const AURORA_THEME: LuxeEditionTheme = {
  meta: EDITIONS["aurora"],
  bg: "#EFE9E4",
  footerBg: "#E2D9D1",
  ink: "#3A332D",
  inkSoft: "rgba(58, 51, 45, 0.72)",
  inkMuted: "rgba(184, 134, 122, 0.85)",
  accent: "#B8867A",
  haloColor: "#D6B0A4",
  waxSealSrc: "/aurora/wax-seal.png",
  watermarkSrc: "/aurora/watermark.png",
  coupleName: "Ece & Yusuf",
  monogram: "E&Y",
  venue: "Hacı Bekir Konağı · Anadoluhisarı",
  greeting: "İki çizgi, bir kavşak",
  heroEyebrow: "Mimari bir an",
  heroCta: "Bize katıl",
  envelopeCta: "Mührü Kır",
  musicTrack: "Comptine d'un autre été · Yann Tiersen",
  footerNote: "Geometri ve sevgi için",
  defaultDate: { day: "3", month: "Ekim", year: "2026" },
  ambient: "aurora",
  storyGlyph: "spark",
  story: [
    {
      year: "2020",
      title: "Bir mimarlık ofisi",
      body: "Ece bir konsept proje sunuyordu; Yusuf, eleştirmen masasındaydı. Maquette'in bir köşesi yamuktu — ikisi de aynı an gülümsedi.",
    },
    {
      year: "2022",
      title: "Anadoluhisarı'nda bir yürüyüş",
      body: "Sahil yolundan dönerken Yusuf, Ece'ye bir kâğıt tutuşturdu. İçinde sadece iki çizgi vardı, bir kavşak. Yıllar sonra anladık ne demek olduğunu.",
    },
    {
      year: "2025",
      title: "Söz",
      body: "Hacı Bekir Konağı'nın bahçesinde, mimari ışığın altında. Söz tek bir kelimeydi: 'Evet.' Sonraki günler için yeterli oldu.",
    },
    {
      year: "2026",
      title: "Konak'ta",
      body: "Mimari bir an. Geleceğin bizimle başlaması için gelin — kavşağın geri kalanını birlikte çizelim.",
    },
  ],
};

/* ── Toplu erişim ──────────────────────────────────────────────── */
export const LUXE_THEMES = {
  aethel: AETHEL_THEME,
  "atelier-indigo": ATELIER_INDIGO_THEME,
  "mansion-lights": MANSION_LIGHTS_THEME,
  "bodrum-blue": BODRUM_BLUE_THEME,
  "olive-grove": OLIVE_GROVE_THEME,
  aurora: AURORA_THEME,
} as const;

export type LuxeEditionSlug = keyof typeof LUXE_THEMES;
