import type { ComponentType } from "react";
import type { Template, TemplateComponentProps, TemplateMeta } from "./types";
import { BlushReverie } from "@/components/templates/blush-reverie";
import { Bordeaux } from "@/components/templates/bordeaux";
import { EgeeBlue } from "@/components/templates/egee-blue";
import { OliveGrove } from "@/components/templates/olive-grove";
import { BlackInk } from "@/components/templates/black-ink";
import { BlushGarden } from "@/components/templates/blush-garden";
import { VerdeBorgogna } from "@/components/templates/verde-borgogna";
import { ElegantIvory } from "@/components/templates/elegant-ivory";

/* ──────────────────────────────────────────────────────────────────
 * DEPRECATION POLICY (FAZ 2A)
 *
 * Slugs marked `deprecated: true` stay routable for existing
 * invitation links (/i/<slug>) but are hidden from listings
 * (`listTemplates()` filters them out by default).
 *
 * When a deprecated slug is requested, `resolveSlug()` returns the
 * superseding edition's component — the customer's URL stays intact,
 * but the visual rendering picks up the new edition. SEO is locked
 * down via `robots: { index: false }` on the detail page so search
 * engines index the canonical edition.
 *
 * Why this matters: customers may have shared their /i/<slug> link
 * with guests before we renamed an edition. Breaking that link
 * damages brand trust. Deprecation keeps the URL alive while we
 * roll the visual layer forward.
 *
 * Currently deprecated:
 *   - black-ink      → aurora       (Aurora arrives in FAZ 2D;
 *                                     temporarily falls back to
 *                                     elegant-ivory until then)
 *   - blush-reverie  → elegant-ivory (placeholder until Magnolia)
 *   - blush-garden   → elegant-ivory (placeholder until Magnolia)
 * ────────────────────────────────────────────────────────────────── */

/**
 * Metadata-only entries used by the public Themes gallery, sitemap, etc.
 * Templates without a built `Component` yet are listed here so the catalog
 * still works while we ship them one at a time.
 */
export const templateMeta: TemplateMeta[] = [
  {
    slug: "blush-reverie",
    name: "The Blush Reverie",
    tagline: "Editöryel · Romantic",
    description:
      "Pembe dantel kenarlı zarf, krem wax seal monogramı, kabartmalı kağıt dokusu. Yumuşak romantik bahar düğünleri için.",
    thumb:
      "https://images.unsplash.com/photo-1674986941202-8b2f8d204cd3?auto=format&fit=crop&w=800&q=85",
    palette: ["#F8D8CB", "#ECB8A8", "#D9A294", "#FBF5E6", "#B89968"],
    category: "editorial",
    mood: "romantic",
    languages: ["TR", "EN", "DE", "FR"],
    pages: 4,
    hasEnvelope: true,
    priceTry: 899,
    priceWasTry: 1299,
    listed: false,
    deprecated: true,
    supersededBy: "elegant-ivory",
  },
  {
    slug: "bordeaux",
    name: "Bordeaux",
    tagline: "Klasik · Lüks",
    description:
      "Derin bordo arka plan + altın detaylar + mum mührü. Sonbahar yalı düğünleri ve şarap renkleri için klasik bir tasarım.",
    thumb:
      "https://images.unsplash.com/photo-1758825178518-ca48833a6c57?auto=format&fit=crop&w=800&q=85",
    palette: ["#3A1A1A", "#5A2820", "#8A3F36", "#C9A961", "#FBF5E6"],
    category: "classic",
    mood: "luxurious",
    languages: ["TR", "EN", "DE"],
    pages: 4,
    hasEnvelope: true,
    priceTry: 899,
    priceWasTry: 1299,
  },
  {
    slug: "egee-blue",
    name: "Égée Blue",
    tagline: "Kıyı · Modern",
    description:
      "Açık dusty blue + krem + altın aksanlı. Bodrum, Çeşme, Yunan adası düğünleri için temiz modern tasarım.",
    thumb:
      "https://images.unsplash.com/photo-1681554601700-0879cf295f40?auto=format&fit=crop&w=800&q=85",
    palette: ["#DCDFE6", "#A5B8C8", "#6F8295", "#3F4E5C", "#FBF5E6"],
    category: "coastal",
    mood: "minimal",
    languages: ["TR", "EN", "DE", "GR"],
    pages: 4,
    hasEnvelope: true,
    priceTry: 899,
  },
  {
    slug: "olive-grove",
    name: "Olive Grove",
    tagline: "Toprak · Akdeniz",
    description:
      "Zeytin yeşili + krem + altın. Mardin, Kapadokya, Akdeniz teras düğünleri için sıcak ve doğal.",
    thumb:
      "https://images.unsplash.com/photo-1734227267138-b886e9b0a954?auto=format&fit=crop&w=800&q=85",
    palette: ["#EFEEDD", "#C9B576", "#7A8B72", "#5E6346", "#4A4022"],
    category: "boho",
    mood: "earthy",
    languages: ["TR", "EN", "IT"],
    pages: 4,
    hasEnvelope: false,
    priceTry: 899,
  },
  {
    slug: "black-ink",
    name: "Black Ink",
    tagline: "Modern · Minimal",
    description:
      "Saf siyah + altın + krem. Kentsel modern düğünler için sade, dramatik ve zamansız.",
    thumb:
      "https://images.unsplash.com/photo-1745681503277-00eef94c5a3d?auto=format&fit=crop&w=800&q=85",
    palette: ["#0F0D0A", "#2A2520", "#C9A961", "#FBF5E6"],
    category: "modern",
    mood: "minimal",
    languages: ["TR", "EN"],
    pages: 4,
    hasEnvelope: false,
    priceTry: 899,
    listed: false,
    deprecated: true,
    supersededBy: "elegant-ivory", // → aurora once it ships in FAZ 2D
  },
  {
    slug: "blush-garden",
    name: "Blush Garden",
    tagline: "Romantik · Floral",
    description:
      "Bol çiçekli yumuşak blush palet. Bahçe ve dış mekan düğünleri için.",
    thumb:
      "https://images.unsplash.com/photo-1674986940876-baca362e4c2b?auto=format&fit=crop&w=800&q=85",
    palette: ["#FAEFEC", "#F0C5B8", "#D9A89B", "#B47A6C", "#7A8B72"],
    category: "editorial",
    mood: "romantic",
    languages: ["TR", "EN", "FR", "IT"],
    pages: 4,
    hasEnvelope: true,
    priceTry: 899,
    listed: false,
    deprecated: true,
    supersededBy: "elegant-ivory", // → magnolia once it ships
  },
  {
    slug: "verde-borgogna",
    name: "Verde & Borgogna",
    tagline: "Editöryel · Lüks",
    description:
      "Koyu yeşil + bordo geçişli arka plan + altın hat. Kış ve sonbahar için zengin renk paletleri.",
    thumb:
      "https://images.unsplash.com/photo-1721176487015-5408ae0e9bc2?auto=format&fit=crop&w=800&q=85",
    palette: ["#2D5544", "#5A2A2A", "#C9A961", "#E8E5DC"],
    category: "editorial",
    mood: "luxurious",
    languages: ["TR", "EN", "IT"],
    pages: 4,
    hasEnvelope: true,
    priceTry: 899,
  },
  {
    slug: "elegant-ivory",
    name: "Elegant Ivory",
    tagline: "Minimal · Sade",
    description:
      "Saf ivory + ince altın çizgi + sade tipografi. Sadeliği seven minimalist çiftler için.",
    thumb:
      "https://images.unsplash.com/photo-1763414902882-4e9d4f8e6275?auto=format&fit=crop&w=800&q=85",
    palette: ["#FBF8F2", "#EDE5D5", "#B89968", "#3D2E26"],
    category: "modern",
    mood: "minimal",
    languages: ["TR", "EN"],
    pages: 4,
    hasEnvelope: false,
    priceTry: 899,
  },
];

/**
 * Map of slug → component-bearing Template. Only templates whose React
 * component is implemented appear here. The dynamic `/templates/[slug]`
 * route falls back to a "coming soon" view when the slug exists in
 * `templateMeta` but not in this map.
 */
const componentBySlug: Record<string, ComponentType<TemplateComponentProps>> = {
  "blush-reverie": BlushReverie,
  bordeaux: Bordeaux,
  "egee-blue": EgeeBlue,
  "olive-grove": OliveGrove,
  "black-ink": BlackInk,
  "blush-garden": BlushGarden,
  "verde-borgogna": VerdeBorgogna,
  "elegant-ivory": ElegantIvory,
};

export const templateComponents: Record<string, Template> = Object.fromEntries(
  templateMeta
    .filter((m) => m.slug in componentBySlug)
    .map((meta) => [
      meta.slug,
      {
        ...meta,
        Component: componentBySlug[meta.slug],
      },
    ]),
);

export function getTemplateMeta(slug: string): TemplateMeta | undefined {
  return templateMeta.find((m) => m.slug === slug);
}

export function getTemplate(slug: string): Template | undefined {
  return templateComponents[slug];
}

/**
 * Returns visible templates. Pass `{ includeDeprecated: true }` to also
 * return slugs flagged `deprecated` (e.g. for an admin tool or sitemap
 * that wants to keep old URLs in the index).
 *
 * Default behaviour hides anything marked `listed: false` so the public
 * carousel + gallery only shows the canonical 8 (or 6 once FAZ 2D
 * lands).
 */
export function listTemplates(
  options: { includeDeprecated?: boolean } = {},
): TemplateMeta[] {
  if (options.includeDeprecated) return templateMeta;
  return templateMeta.filter((m) => m.listed !== false);
}

/* ── resolveSlug ────────────────────────────────────────────────── *
 * Single entry point for translating any request slug — including
 * legacy / deprecated ones — into the canonical slug, metadata, and
 * React component that should render.
 *
 * Returns `null` when the slug doesn't exist anywhere in the registry
 * (the dynamic route then calls `notFound()`).
 */
export interface ResolvedSlug {
  /** Slug the user requested (may be deprecated) */
  requested: string;
  /** Slug whose metadata + component this resolution serves */
  canonical: string;
  /** Visible meta — always the canonical's, never the deprecated one */
  meta: TemplateMeta;
  /** React component to render (canonical's) */
  Component?: ComponentType<TemplateComponentProps>;
  /** True when the requested slug was a deprecated alias */
  isDeprecated: boolean;
  /** When deprecated, the canonical slug we routed to */
  supersededBy?: string;
}

export function resolveSlug(slug: string): ResolvedSlug | null {
  const requestedMeta = getTemplateMeta(slug);
  if (!requestedMeta) return null;

  const isDeprecated = requestedMeta.deprecated === true;
  const canonicalSlug =
    isDeprecated && requestedMeta.supersededBy
      ? requestedMeta.supersededBy
      : slug;

  // If the canonical slug doesn't have its own metadata yet (e.g. Aurora
  // isn't built until FAZ 2D), fall back to the requested meta so the
  // page still renders something instead of 404'ing on a deprecated URL.
  const canonicalMeta = getTemplateMeta(canonicalSlug) ?? requestedMeta;
  const Component = componentBySlug[canonicalSlug] ?? componentBySlug[slug];

  return {
    requested: slug,
    canonical: canonicalMeta.slug,
    meta: canonicalMeta,
    Component,
    isDeprecated,
    supersededBy: isDeprecated ? requestedMeta.supersededBy : undefined,
  };
}
