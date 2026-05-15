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
}

export const EDITIONS: Record<EditionSlug, EditionMeta> = {
  "atelier-indigo": {
    slug: "atelier-indigo",
    name: "Atelier Indigo",
    character: "Karanlık bordo + altın filigree, art-deco letterpress",
    displayFont: "Playfair Display",
    motion: "letterpress",
    palette: { bg: "#1B0C0C", bgAlt: "#2A1414", ink: "#F2E8D8", accent: "#D4A158", deep: "#8C2828" },
  },
  timeless: {
    slug: "timeless",
    name: "Timeless",
    character: "Saf ivory + grafit, geniş margin editöryel",
    displayFont: "Cormorant Garamond",
    motion: "editorial",
    palette: { bg: "#FBF8F2", bgAlt: "#F5EFE3", ink: "#2A2622", accent: "#6E4A2E", deep: "#1F1B17" },
  },
  "olive-grove": {
    slug: "olive-grove",
    name: "Olive Grove",
    character: "Akdeniz krem keten + zeytin yeşili, signature el yazısı",
    displayFont: "Cormorant Garamond + Caveat",
    motion: "botanical",
    palette: { bg: "#F2EFE0", bgAlt: "#E6E0CB", ink: "#2D3320", accent: "#67784E", deep: "#3D4528" },
  },
  "mansion-lights": {
    slug: "mansion-lights",
    name: "Mansion Lights",
    character: "Akşam yalısı, koyu yeşil + şampanya altın",
    displayFont: "DM Serif Display",
    motion: "gilded",
    palette: { bg: "#11261E", bgAlt: "#1A3329", ink: "#F2EAD3", accent: "#D9B36A", deep: "#8A6F32" },
  },
  "bodrum-blue": {
    slug: "bodrum-blue",
    name: "Bodrum Blue",
    character: "Ege mavisi + kireç beyazı + zeytin",
    displayFont: "Tenor Sans",
    motion: "coastal",
    palette: { bg: "#F4F1EA", bgAlt: "#E0EAEE", ink: "#1F3848", accent: "#4A7E94", deep: "#1E3D5C" },
  },
  aurora: {
    slug: "aurora",
    name: "Aurora",
    character: "Off-white + grafit + tek aksan, modernist minimal",
    displayFont: "Fraunces",
    motion: "modernist",
    palette: { bg: "#F8F7F4", bgAlt: "#ECEAE4", ink: "#161510", accent: "#5C4ED0", deep: "#2A2270" },
  },
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
