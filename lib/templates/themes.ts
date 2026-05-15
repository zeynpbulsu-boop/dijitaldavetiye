/**
 * Per-template visual themes — drives the look of /i/[slug] public
 * invitation pages. Each template_slug picks a palette, monogram
 * styling, and an ornament motif so the same React layout reads
 * completely different depending on which edition the couple chose.
 *
 * Covers both:
 *   - the 9 carousel slugs shown on the home page
 *   - the 8 slugs in lib/templates/registry.ts
 * with fallthrough to a sensible default for anything unknown.
 */

export type Ornament =
  | "peony"
  | "rose-vine"
  | "eucalyptus"
  | "anemone"
  | "babys-breath"
  | "fern"
  | "none";

export type InvitationTheme = {
  slug: string;
  /** Human-readable name shown in caption strips. */
  name: string;
  /** Page background. Solid or two-stop gradient string. */
  bg: string;
  /** Body / ink colour. */
  ink: string;
  /** Softer ink for secondary text. */
  inkSoft: string;
  /** Accent — used on italic words and dividers. */
  accent: string;
  /** Wax-seal monogram fill colour. */
  monogramFill: string;
  /** Monogram text colour (on the seal). */
  monogramText: string;
  /** "✦" separator + minor accent tone. */
  spark: string;
  /** Dotted divider on the date row. */
  ruleColor: string;
  /** Story block background — usually a subtle tone of bg. */
  storyBg: string;
  /** Story block border colour. */
  storyBorder: string;
  /** Footer wordmark dot accent. */
  footerDot: string;
  /** Primary ornament motif used at the 4 corners. */
  ornament: Ornament;
  /** Opacity multiplier for the ornaments (0–1). */
  ornamentOpacity: number;
  /** When true, treat the canvas as dark — flip CSS variable
      meanings (sage/cognac get lighter etc.). */
  isDark: boolean;
};

const T = {
  ink: "#2B1E16",
  cream: "#F2EEE6",
  creamAlt: "#EFE6DA",
  roseTaupe: "#B98E78",
  cognac: "#8C5A3C",
} as const;

/** Master theme registry. Add new template_slug entries here. */
const THEMES: Record<string, InvitationTheme> = {
  /* ── light, romantic — desaturated champagne-blush palette ── */
  "blush-reverie": {
    slug: "blush-reverie",
    name: "Blush Reverie",
    bg: "radial-gradient(ellipse at 35% 8%, #FAF1E8 0%, #F4E8DA 38%, #EEDDC9 78%, #E4D0BA 100%)",
    ink: "#3A2A22",
    inkSoft: "rgba(58, 42, 34, 0.58)",
    accent: "#B07A5C",
    monogramFill: "#9A6147",
    monogramText: "#FAF1E8",
    spark: "#B07A5C",
    ruleColor: "rgba(176, 122, 92, 0.30)",
    storyBg: "rgba(250, 241, 232, 0.6)",
    storyBorder: "rgba(58, 42, 34, 0.07)",
    footerDot: "#B07A5C",
    ornament: "peony",
    ornamentOpacity: 0.48,
    isDark: false,
  },
  dream: {
    slug: "dream",
    name: "Dream",
    bg: "radial-gradient(ellipse at 35% 8%, #FAF1E8 0%, #F4E8DA 38%, #EEDDC9 78%, #E4D0BA 100%)",
    ink: "#3A2A22",
    inkSoft: "rgba(58, 42, 34, 0.58)",
    accent: "#B07A5C",
    monogramFill: "#9A6147",
    monogramText: "#FAF1E8",
    spark: "#B07A5C",
    ruleColor: "rgba(176, 122, 92, 0.30)",
    storyBg: "rgba(250, 241, 232, 0.6)",
    storyBorder: "rgba(58, 42, 34, 0.07)",
    footerDot: "#B07A5C",
    ornament: "peony",
    ornamentOpacity: 0.48,
    isDark: false,
  },

  /* ── dark, dramatic ── */
  bordeaux: {
    slug: "bordeaux",
    name: "Bordeaux",
    bg: "linear-gradient(170deg, #2A0F0F 0%, #1F0E0E 55%, #3A1414 100%)",
    ink: "#F2E8D8",
    inkSoft: "rgba(242, 232, 216, 0.7)",
    accent: "#D4A158",
    monogramFill: "#D4A158",
    monogramText: "#1F0E0E",
    spark: "#D4A158",
    ruleColor: "rgba(212, 161, 88, 0.4)",
    storyBg: "rgba(212, 161, 88, 0.06)",
    storyBorder: "rgba(242, 232, 216, 0.14)",
    footerDot: "#D4A158",
    ornament: "rose-vine",
    ornamentOpacity: 0.28,
    isDark: true,
  },
  "atelier-indigo": {
    slug: "atelier-indigo",
    name: "Atelier Indigo",
    bg: "linear-gradient(170deg, #2A0F0F 0%, #1F0E0E 55%, #3A1414 100%)",
    ink: "#F2E8D8",
    inkSoft: "rgba(242, 232, 216, 0.7)",
    accent: "#D4A158",
    monogramFill: "#D4A158",
    monogramText: "#1F0E0E",
    spark: "#D4A158",
    ruleColor: "rgba(212, 161, 88, 0.4)",
    storyBg: "rgba(212, 161, 88, 0.06)",
    storyBorder: "rgba(242, 232, 216, 0.14)",
    footerDot: "#D4A158",
    ornament: "rose-vine",
    ornamentOpacity: 0.28,
    isDark: true,
  },

  /* ── earthy mediterranean ── */
  "olive-grove": {
    slug: "olive-grove",
    name: "Olive Grove",
    bg: "linear-gradient(170deg, #F4EFDD 0%, #EFEEDD 55%, #D7D7BD 100%)",
    ink: "#2E3324",
    inkSoft: "rgba(46, 51, 36, 0.7)",
    accent: "#7A8B72",
    monogramFill: "#5E6346",
    monogramText: "#F4EFDD",
    spark: "#B86B4A",
    ruleColor: "rgba(94, 99, 70, 0.4)",
    storyBg: "rgba(141, 162, 134, 0.10)",
    storyBorder: "rgba(46, 51, 36, 0.12)",
    footerDot: "#B86B4A",
    ornament: "eucalyptus",
    ornamentOpacity: 0.32,
    isDark: false,
  },
  botanical: {
    slug: "botanical",
    name: "Botanical",
    bg: "linear-gradient(170deg, #F4EFDD 0%, #EFEEDD 55%, #D7D7BD 100%)",
    ink: "#2E3324",
    inkSoft: "rgba(46, 51, 36, 0.7)",
    accent: "#7A8B72",
    monogramFill: "#5E6346",
    monogramText: "#F4EFDD",
    spark: "#B86B4A",
    ruleColor: "rgba(94, 99, 70, 0.4)",
    storyBg: "rgba(141, 162, 134, 0.10)",
    storyBorder: "rgba(46, 51, 36, 0.12)",
    footerDot: "#B86B4A",
    ornament: "eucalyptus",
    ornamentOpacity: 0.32,
    isDark: false,
  },

  /* ── classic botanical ── */
  magnolia: {
    slug: "magnolia",
    name: "Magnolia",
    bg: "linear-gradient(170deg, #FAF6EE 0%, #F2EEE6 55%, #E7D9CB 100%)",
    ink: "#2B1E16",
    inkSoft: "rgba(43, 30, 22, 0.7)",
    accent: "#8E7556",
    monogramFill: "#8E7556",
    monogramText: "#FAF6EE",
    spark: "#8E7556",
    ruleColor: "rgba(142, 117, 86, 0.4)",
    storyBg: "rgba(231, 217, 203, 0.4)",
    storyBorder: "rgba(43, 30, 22, 0.10)",
    footerDot: "#8E7556",
    ornament: "babys-breath",
    ornamentOpacity: 0.35,
    isDark: false,
  },

  /* ── opulent dark night ── */
  "mansion-lights": {
    slug: "mansion-lights",
    name: "Mansion Lights",
    bg: "linear-gradient(170deg, #1A120C 0%, #2B1E16 55%, #5A3A28 100%)",
    ink: "#F2EEE6",
    inkSoft: "rgba(242, 238, 230, 0.7)",
    accent: "#C9A961",
    monogramFill: "#C9A961",
    monogramText: "#1A120C",
    spark: "#C9A961",
    ruleColor: "rgba(201, 169, 97, 0.45)",
    storyBg: "rgba(201, 169, 97, 0.06)",
    storyBorder: "rgba(242, 238, 230, 0.14)",
    footerDot: "#C9A961",
    ornament: "anemone",
    ornamentOpacity: 0.25,
    isDark: true,
  },

  /* ── soft minimal editorial ── */
  timeless: {
    slug: "timeless",
    name: "Timeless",
    bg: T.creamAlt,
    ink: T.ink,
    inkSoft: "rgba(43, 30, 22, 0.7)",
    accent: T.cognac,
    monogramFill: T.cognac,
    monogramText: T.cream,
    spark: T.cognac,
    ruleColor: "rgba(140, 90, 60, 0.4)",
    storyBg: "rgba(242, 238, 230, 0.6)",
    storyBorder: "rgba(43, 30, 22, 0.12)",
    footerDot: T.cognac,
    ornament: "none",
    ornamentOpacity: 0,
    isDark: false,
  },

  /* ── pure modern minimal ── */
  modern: {
    slug: "modern",
    name: "Modern",
    bg: "#FFFFFF",
    ink: "#0F0F0F",
    inkSoft: "rgba(15, 15, 15, 0.65)",
    accent: "#2B1E16",
    monogramFill: "#0F0F0F",
    monogramText: "#FFFFFF",
    spark: "#0F0F0F",
    ruleColor: "rgba(15, 15, 15, 0.3)",
    storyBg: "rgba(15, 15, 15, 0.03)",
    storyBorder: "rgba(15, 15, 15, 0.10)",
    footerDot: "#0F0F0F",
    ornament: "none",
    ornamentOpacity: 0,
    isDark: false,
  },

  /* ── Provençal lavender ── */
  lavender: {
    slug: "lavender",
    name: "Lavender",
    bg: "linear-gradient(170deg, #F0E8F2 0%, #EAE2EE 55%, #C7B4D6 100%)",
    ink: "#2B1F3A",
    inkSoft: "rgba(43, 31, 58, 0.72)",
    accent: "#7E5E9D",
    monogramFill: "#7E5E9D",
    monogramText: "#F0E8F2",
    spark: "#7E5E9D",
    ruleColor: "rgba(126, 94, 157, 0.35)",
    storyBg: "rgba(199, 180, 214, 0.16)",
    storyBorder: "rgba(43, 31, 58, 0.12)",
    footerDot: "#7E5E9D",
    ornament: "babys-breath",
    ornamentOpacity: 0.35,
    isDark: false,
  },

  /* ── wild garden — soft sage with rose accents ── */
  "kir-bahcesi": {
    slug: "kir-bahcesi",
    name: "Kır Bahçesi",
    bg: "linear-gradient(170deg, #F5F1DE 0%, #EFEDD7 55%, #C2C8A4 100%)",
    ink: "#2E3520",
    inkSoft: "rgba(46, 53, 32, 0.72)",
    accent: "#6E8246",
    monogramFill: "#6E8246",
    monogramText: "#F5F1DE",
    spark: "#B96A55",
    ruleColor: "rgba(110, 130, 70, 0.4)",
    storyBg: "rgba(194, 200, 164, 0.18)",
    storyBorder: "rgba(46, 53, 32, 0.12)",
    footerDot: "#B96A55",
    ornament: "fern",
    ornamentOpacity: 0.35,
    isDark: false,
  },

  /* ── Égée Blue / sea-spray ── */
  "egee-blue": {
    slug: "egee-blue",
    name: "Égée Blue",
    bg: "linear-gradient(170deg, #E8EEF2 0%, #D7E0E7 55%, #A8BCC9 100%)",
    ink: "#1F2E3A",
    inkSoft: "rgba(31, 46, 58, 0.7)",
    accent: "#4F6276",
    monogramFill: "#4F6276",
    monogramText: "#E8EEF2",
    spark: "#4F6276",
    ruleColor: "rgba(79, 98, 118, 0.4)",
    storyBg: "rgba(168, 188, 201, 0.18)",
    storyBorder: "rgba(31, 46, 58, 0.12)",
    footerDot: "#4F6276",
    ornament: "eucalyptus",
    ornamentOpacity: 0.32,
    isDark: false,
  },

  /* ── ink black editorial ── */
  "black-ink": {
    slug: "black-ink",
    name: "Black Ink",
    bg: "linear-gradient(170deg, #0B0B0B 0%, #161616 55%, #2A2A2A 100%)",
    ink: "#F2EEE6",
    inkSoft: "rgba(242, 238, 230, 0.7)",
    accent: "#F2EEE6",
    monogramFill: "#F2EEE6",
    monogramText: "#0B0B0B",
    spark: "#F2EEE6",
    ruleColor: "rgba(242, 238, 230, 0.4)",
    storyBg: "rgba(242, 238, 230, 0.05)",
    storyBorder: "rgba(242, 238, 230, 0.14)",
    footerDot: "#F2EEE6",
    ornament: "none",
    ornamentOpacity: 0,
    isDark: true,
  },

  /* ── ivory + sage elegant ── */
  "elegant-ivory": {
    slug: "elegant-ivory",
    name: "Elegant Ivory",
    bg: "linear-gradient(170deg, #FBF7EE 0%, #F4ECDD 55%, #DCD2BE 100%)",
    ink: "#2B2418",
    inkSoft: "rgba(43, 36, 24, 0.7)",
    accent: "#6E8470",
    monogramFill: "#6E8470",
    monogramText: "#FBF7EE",
    spark: "#A8896C",
    ruleColor: "rgba(110, 132, 112, 0.42)",
    storyBg: "rgba(220, 210, 190, 0.4)",
    storyBorder: "rgba(43, 36, 24, 0.12)",
    footerDot: "#A8896C",
    ornament: "babys-breath",
    ornamentOpacity: 0.35,
    isDark: false,
  },

  /* ── verde + borgogna split ── */
  "verde-borgogna": {
    slug: "verde-borgogna",
    name: "Verde & Borgogna",
    bg: "linear-gradient(170deg, #EDEEDB 0%, #E2D4CB 55%, #B25A45 100%)",
    ink: "#2C1F18",
    inkSoft: "rgba(44, 31, 24, 0.7)",
    accent: "#7C2C20",
    monogramFill: "#7C2C20",
    monogramText: "#EDEEDB",
    spark: "#7C2C20",
    ruleColor: "rgba(124, 44, 32, 0.4)",
    storyBg: "rgba(226, 212, 203, 0.4)",
    storyBorder: "rgba(44, 31, 24, 0.12)",
    footerDot: "#7C2C20",
    ornament: "rose-vine",
    ornamentOpacity: 0.32,
    isDark: false,
  },

  /* ── blush-garden floral ── */
  "blush-garden": {
    slug: "blush-garden",
    name: "Blush Garden",
    bg: "linear-gradient(170deg, #F9E9E0 0%, #F2D9CE 55%, #DBA98C 100%)",
    ink: "#3A1E14",
    inkSoft: "rgba(58, 30, 20, 0.72)",
    accent: "#9B4E2C",
    monogramFill: "#9B4E2C",
    monogramText: "#F9E9E0",
    spark: "#9B4E2C",
    ruleColor: "rgba(155, 78, 44, 0.38)",
    storyBg: "rgba(219, 169, 140, 0.18)",
    storyBorder: "rgba(58, 30, 20, 0.12)",
    footerDot: "#9B4E2C",
    ornament: "peony",
    ornamentOpacity: 0.42,
    isDark: false,
  },

  __default: {
    slug: "__default",
    name: "NUVE",
    bg: T.cream,
    ink: T.ink,
    inkSoft: "rgba(43, 30, 22, 0.7)",
    accent: T.cognac,
    monogramFill: T.cognac,
    monogramText: T.cream,
    spark: T.cognac,
    ruleColor: "rgba(140, 90, 60, 0.4)",
    storyBg: "rgba(239, 230, 218, 0.5)",
    storyBorder: "rgba(43, 30, 22, 0.10)",
    footerDot: T.cognac,
    ornament: "peony",
    ornamentOpacity: 0.36,
    isDark: false,
  },
};

export function themeForSlug(slug: string): InvitationTheme {
  return THEMES[slug] ?? THEMES.__default;
}

/** Whether a theme calls for the light or dark UI variant of generic chrome. */
export function isDarkTheme(slug: string): boolean {
  return themeForSlug(slug).isDark;
}
