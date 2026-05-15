import type { ComponentType } from "react";

/** Data the customer fills in — used to render their personalized invitation */
export interface InvitationData {
  /** First partner's name(s) */
  partnerOne: string;
  /** Second partner's name(s) */
  partnerTwo: string;
  /** Optional: full names for the main invitation page (e.g. "Clara Ashford") */
  partnerOneFull?: string;
  partnerTwoFull?: string;
  /** Monogram letters shown on the wax seal, e.g. "C & E" */
  monogram?: string;
  /** Wedding date (ISO 8601, e.g. "2027-06-21") */
  date: string;
  /** Approximate time of day (display only, e.g. "Twelve thirty in the afternoon") */
  timeOfDay?: string;
  /** Location label (e.g. "Occitanie, France") */
  location: string;
  /** Detailed venue name (e.g. "Sait Halim Paşa Yalısı") */
  venue?: string;
  /** RSVP deadline (ISO 8601) */
  rsvpDeadline?: string;
  /** Cover photo URL (couple photo, displayed in invitation) */
  coverPhoto?: string;
  /** Optional gallery photos */
  galleryPhotos?: string[];
  /** Optional love story text */
  storyParagraphs?: string[];
  /** Public site slug (e.g. "ali-ve-zeynep") */
  slug?: string;
}

export type TemplateCategory =
  | "editorial"
  | "modern"
  | "classic"
  | "coastal"
  | "boho";

export type TemplateMood = "romantic" | "minimal" | "luxurious" | "earthy" | "playful";

/** Static metadata shown in gallery / detail pages */
export interface TemplateMeta {
  slug: string;
  name: string;
  /** Short subtitle, e.g. "Editöryel · Romantic" */
  tagline: string;
  description: string;
  /** Listing thumbnail (Etsy-style product mockup) */
  thumb: string;
  /** Preview cover image for the detail hero */
  cover?: string;
  /** Color palette swatches as hex */
  palette: string[];
  category: TemplateCategory;
  mood: TemplateMood;
  /** Available languages this template ships with */
  languages: string[];
  /** Number of pages in the website (used in detail page bullets) */
  pages: number;
  /** Whether the template features an opening envelope animation */
  hasEnvelope: boolean;
  /** Price in TRY (kuruş base — i.e. 89900 = ₺899) */
  priceTry: number;
  /** Optional "was" price for strike-through display */
  priceWasTry?: number;

  /* ── Lifecycle / SEO flags (FAZ 2A) ─────────────────────────── */

  /**
   * Show this template in the public gallery + carousel?
   * `listTemplates()` defaults to filtering by `listed === true`.
   * Deprecated templates set this to `false` so their existing
   * /i/[slug] invitation URLs keep resolving but they don't appear
   * in new browsing UI.
   */
  listed?: boolean;

  /**
   * Marks the slug as superseded. Older invitations on this slug
   * still resolve via `resolveSlug()` but the detail page emits
   * `robots: { index: false }` and the gallery hides the card.
   */
  deprecated?: boolean;

  /**
   * If `deprecated`, points at the slug that replaces this one.
   * `resolveSlug()` uses this to choose which React component to
   * render so the legacy slug visually adopts the new edition.
   */
  supersededBy?: string;
}

/** Full template entry combining metadata with the React component that renders it */
export interface Template extends TemplateMeta {
  /**
   * The React component that renders the actual interactive invitation.
   * It receives the customer's data + a sample-mode flag.
   */
  Component: ComponentType<TemplateComponentProps>;
}

export interface TemplateComponentProps {
  data: InvitationData;
  /** When true, shows demo data and an "Editing demo" banner */
  isPreview?: boolean;
}
