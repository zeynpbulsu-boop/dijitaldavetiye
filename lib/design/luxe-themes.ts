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
