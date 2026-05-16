/**
 * NUVE Design Tokens — FAZ 1 (single source of truth)
 *
 * Mirrors the CSS variables in app/globals.css and the Tailwind config
 * extensions so TypeScript callers (motion configs, runtime style
 * computations, Framer Motion animate props) can reference the same
 * values that CSS does.
 *
 * Editions activate via a `data-edition` attribute on either <html> or
 * a slot wrapper. The token *values* live in CSS — this file exports
 * the *names* and *meta* (label, slug, palette swatches for previews).
 */

/* ── Edition catalogue ─────────────────────────────────────────── */

export type EditionSlug =
  | "atelier-indigo"
  | "timeless"
  | "olive-grove"
  | "mansion-lights"
  | "bodrum-blue"
  | "aurora";

export interface EditionMeta {
  slug: EditionSlug;
  /** Human-readable name shown in the carousel + detail page. */
  name: string;
  /** One-line character description (used as subtitle). */
  character: string;
  /** Display font name (matches the CSS variable family) — for UI labels. */
  displayFont: string;
  /** Motion preset key — picked up by lib/design/motion.ts. */
  motion: "letterpress" | "editorial" | "botanical" | "gilded" | "coastal" | "modernist";
  /** 5-stop palette swatches (preview tiles, palette badges). */
  palette: { bg: string; bgAlt: string; ink: string; accent: string; deep: string };

  /* ── FAZ 5 — Tematik Bütünsel Dil ───────────────────────────────
   * Tema seçildiğinde tüm site ELEMENTleri bu token'lardan beslenir:
   * - Hero arka planı solid (artık AI manzara kapak yok)
   * - Section ayraçları (`+` / `✦` / leaf) bu tema rengine bürünür
   * - Background dokusu (sayfa boyunca soft watermark) bu motiften
   * - Calligraphy font, isim animasyonu, button stroke — hep bu kimlik
   * Bütünsel deneyim = Pressed Love'ı geçen tek fark.
   */

  /** Hero için tam ekran solid arka plan rengi (HEX). */
  heroBg: string;
  /** Hero üstündeki ink rengi — calligraphy + eyebrow için. */
  heroInk: string;
  /** Section ayraç ikon rengi (örn. ✦ yosun yeşili). */
  ornamentColor: string;
  /** Section ayraç ikon türü — temaya göre swap. */
  separatorIcon: "plus" | "diamond" | "leaf" | "flower" | "star" | "key";
  /** Calligraphy script font CSS variable adı — isim animasyonu kullanır. */
  calligraphyFont: string;
  /** Sayfa arka planına yedirilen tematik motif türü. */
  bgMotif: "ivy" | "marbled" | "olive" | "candle" | "wave" | "ink-spray" | "none";
  /** Body içerik sayfası background — beyaz değil, tema'nın çok hafif dokusu. */
  bodyBg: string;
  /** Body ink rengi (içerik metinleri). */
  bodyInk: string;
}

export const EDITIONS: Record<EditionSlug, EditionMeta> = {
  "atelier-indigo": {
    slug: "atelier-indigo",
    name: "Atelier Indigo",
    character: "Karanlık bordo + altın filigree, art-deco letterpress",
    displayFont: "Playfair Display",
    motion: "letterpress",
    palette: { bg: "#1B0C0C", bgAlt: "#2A1414", ink: "#F2E8D8", accent: "#D4A158", deep: "#8C2828" },
    heroBg: "#1B0C0C",
    heroInk: "#F2E8D8",
    ornamentColor: "#D4A158",
    separatorIcon: "diamond",
    calligraphyFont: "var(--font-calligraphy)",
    bgMotif: "ink-spray",
    bodyBg: "#F5EFE3",
    bodyInk: "#2A1414",
  },
  timeless: {
    slug: "timeless",
    name: "Timeless",
    character: "Saf ivory + grafit, geniş margin editöryel",
    displayFont: "Cormorant Garamond",
    motion: "editorial",
    palette: { bg: "#FBF8F2", bgAlt: "#F5EFE3", ink: "#2A2622", accent: "#6E4A2E", deep: "#1F1B17" },
    heroBg: "#FBF8F2",
    heroInk: "#2A2622",
    ornamentColor: "#6E4A2E",
    separatorIcon: "plus",
    calligraphyFont: "var(--font-calligraphy)",
    bgMotif: "none",
    bodyBg: "#FBF8F2",
    bodyInk: "#2A2622",
  },
  "olive-grove": {
    slug: "olive-grove",
    name: "Olive Grove",
    character: "Akdeniz krem keten + zeytin yeşili, signature el yazısı",
    displayFont: "Cormorant Garamond + Caveat",
    motion: "botanical",
    palette: { bg: "#F2EFE0", bgAlt: "#E6E0CB", ink: "#2D3320", accent: "#67784E", deep: "#3D4528" },
    heroBg: "#2D3320",
    heroInk: "#F2EFE0",
    ornamentColor: "#67784E",
    separatorIcon: "leaf",
    calligraphyFont: "var(--font-signature)",
    bgMotif: "olive",
    bodyBg: "#F2EFE0",
    bodyInk: "#2D3320",
  },
  "mansion-lights": {
    slug: "mansion-lights",
    name: "Mansion Lights",
    character: "Akşam yalısı, koyu yeşil + şampanya altın",
    displayFont: "DM Serif Display",
    motion: "gilded",
    palette: { bg: "#11261E", bgAlt: "#1A3329", ink: "#F2EAD3", accent: "#D9B36A", deep: "#8A6F32" },
    heroBg: "#11261E",
    heroInk: "#F2EAD3",
    ornamentColor: "#D9B36A",
    separatorIcon: "diamond",
    calligraphyFont: "var(--font-calligraphy)",
    bgMotif: "candle",
    bodyBg: "#F2EAD3",
    bodyInk: "#11261E",
  },
  "bodrum-blue": {
    slug: "bodrum-blue",
    name: "Bodrum Blue",
    character: "Ege mavisi + kireç beyazı + zeytin",
    displayFont: "Tenor Sans",
    motion: "coastal",
    palette: { bg: "#F4F1EA", bgAlt: "#E0EAEE", ink: "#1F3848", accent: "#4A7E94", deep: "#1E3D5C" },
    heroBg: "#1F3848",
    heroInk: "#F4F1EA",
    ornamentColor: "#4A7E94",
    separatorIcon: "star",
    calligraphyFont: "var(--font-calligraphy)",
    bgMotif: "wave",
    bodyBg: "#F4F1EA",
    bodyInk: "#1F3848",
  },
  aurora: {
    slug: "aurora",
    name: "Aurora",
    character: "Off-white + grafit + tek aksan, modernist minimal",
    displayFont: "Fraunces",
    motion: "modernist",
    palette: { bg: "#F8F7F4", bgAlt: "#ECEAE4", ink: "#161510", accent: "#5C4ED0", deep: "#2A2270" },
    heroBg: "#F8F7F4",
    heroInk: "#161510",
    ornamentColor: "#5C4ED0",
    separatorIcon: "plus",
    calligraphyFont: "var(--font-calligraphy)",
    bgMotif: "ink-spray",
    bodyBg: "#F8F7F4",
    bodyInk: "#161510",
  },
};

/* ── Aethel's Chapel — 6. premium tema ─────────────────────────── */
export const AETHEL_CHAPEL: EditionMeta = {
  slug: "aurora",  // type reuse; gerçek slug "aethel-chapel"
  name: "Aethel's Chapel",
  character: "Yeşillikler arasında antik şapel — yosun + fildişi + mor salkım",
  displayFont: "Cormorant Garamond",
  motion: "botanical",
  palette: { bg: "#EDE9DD", bgAlt: "#E5DFC8", ink: "#2F3527", accent: "#7A8A6E", deep: "#5C6450" },
  heroBg: "#2F3527",
  heroInk: "#EDE9DD",
  ornamentColor: "#9F84B5", // mor salkım accent
  separatorIcon: "diamond", // ✦ — antik kilise vitray hissi
  calligraphyFont: "var(--font-calligraphy)",
  bgMotif: "ivy",
  bodyBg: "#EDE9DD",
  bodyInk: "#2F3527",
};

export const EDITION_SLUGS: EditionSlug[] = Object.keys(EDITIONS) as EditionSlug[];

/* ── Spacing scale (mirrors tailwind ed-* tokens) ──────────────── */
export const space = {
  1: 4, 2: 8, 3: 12, 4: 16, 6: 24,
  8: 32, 12: 48, 16: 64, 24: 96, 32: 128,
} as const;

/* ── Radius scale ──────────────────────────────────────────────── */
export const radius = {
  sm: 3, md: 6, lg: 12, xl: 20, "2xl": 32, pill: 9999,
} as const;

/* ── Shadow scale (CSS strings) ────────────────────────────────── */
export const shadow = {
  sm: "0 2px 8px rgba(31, 27, 23, 0.06)",
  md: "0 8px 24px -8px rgba(31, 27, 23, 0.10)",
  lg: "0 24px 50px -16px rgba(31, 27, 23, 0.18)",
  xl: "0 40px 90px -28px rgba(31, 27, 23, 0.28)",
} as const;

/* ── CSS-variable accessors ────────────────────────────────────── *
 * Use these in inline styles when you want the active edition's
 * resolved value at runtime without hard-coding a palette:
 *
 *   <div style={{ background: cssVar('--edition-bg') }} />
 *
 * The runtime value is whatever [data-edition="..."] resolves it to.
 */
export const cssVar = (name: `--${string}`) => `var(${name})`;

export const editionVars = {
  bg:        cssVar("--edition-bg"),
  bgAlt:     cssVar("--edition-bg-alt"),
  ink:       cssVar("--edition-ink"),
  inkSoft:   cssVar("--edition-ink-soft"),
  accent:    cssVar("--edition-accent"),
  deep:      cssVar("--edition-deep"),
  hairline:  cssVar("--edition-hairline"),
  display:   cssVar("--edition-display"),
  body:      cssVar("--edition-body"),
  signature: cssVar("--edition-signature"),
} as const;
