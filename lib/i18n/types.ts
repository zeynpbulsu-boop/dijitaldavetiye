/**
 * NUVE i18n — 3 langs: Turkish, English, Serbian (Latinica).
 * Turkish is the source language; EN and SR mirror its shape.
 * TypeScript enforces parallel keys via the Messages interface.
 */

export const LOCALES = ["tr", "en", "sr"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  sr: "SR",
};

/** Full message shape. All three dictionaries must satisfy this. */
export interface Messages {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    aria_label: string;
    lang_aria: string;
    menu: {
      manifesto: string;
      themes: string;
      how: string;
      pricing: string;
      faq: string;
      contact: string;
    };
    cta_short: string;
    cta_aria: string;
    open_menu: string;
    close_menu: string;
    home_aria: string;
  };
  hero: {
    eyebrow: string;
    headline_l1: string;
    headline_l2_prefix: string;
    headline_l2_accent: string;
    headline_l2_suffix: string;
    lead: string;
    cta_primary: string;
    cta_secondary: string;
    footnote: string;
    rail_left: string;
    rail_right: string;
    marquee: string[];
    phone: {
      top_label: string;
      and: string;
      date: string;
      tap_hint: string;
    };
  };
  carousel: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    headline_suffix: string;
    drag_hint: string;
    bottom_tagline: string;
    bottom_cta: string;
    badge_new: string;
    card_action: string;
    /** Per-card categories — index-aligned with TemplateCarousel cards[] */
    card_categories: [
      string, string, string, string, string,
      string, string, string, string,
    ];
  };
  how_it_works: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    headline_suffix: string;
    intro: string;
    steps: { title: string; body: string }[];
  };
  music: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    paragraphs: string[];
    cta: string;
    label_idle: string;
    label_playing: string;
    record_label_top: string;
    record_label_bottom: string;
  };
  collection_note: {
    eyebrow: string;
    body: string;
    body_accent: string;
    bottom_strip: string;
  };
  seal: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    paragraphs: string[];
    caption: string;
  };
  ceremonies: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    lead: string;
    rituals: { title: string; body: string }[];
    phone_ribbon: { tag: string; label: string; hint: string };
    phone_wax: { tag: string; label: string; hint: string };
  };
  manifesto: {
    eyebrow: string;
    number: string;
    drop_cap: string;
    body_first: string;
    body_main: string;
    body_accent: string;
    body_rest: string;
    specs: { k: string; v: string }[];
  };
  testimonials: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    rating: string;
    reviews: {
      initials: string;
      couple: string;
      where: string;
      quote: string;
    }[];
  };
  pricing: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    headline_period: string;
    intro: string;
    badge_popular: string;
    cta_template: string; // "{name} ile Başla" → "Start with {name}"
    reassurance: string;
    /** ISO 4217 currency code for the active locale's prices. */
    currency: "TRY" | "USD" | "EUR";
    /** Pre-formatted symbol used in display ("₺", "$", "€"). */
    currency_symbol: string;
    /** Human-readable shorthand for the tier's recurrence wording in copy. */
    renewal_price_text: string; // e.g. "yıllık ₺199" / "$5/year" / "€5/godišnje"
    tiers: {
      name: string;
      note: string;
      summary: string;
      features: string[];
      /** Price in the locale's currency, integer (no decimals). */
      price: number;
    }[];
  };
  faq: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    closing_prefix: string;
    closing_suffix: string;
    items: { q: string; a: string }[];
  };
  closing: {
    eyebrow: string;
    headline_prefix: string;
    headline_accent: string;
    headline_suffix: string;
    lead: string;
    cta_primary: string;
    cta_secondary: string;
    reassurance: string[];
  };
  footer: {
    atelier_label: string;
    atelier_body: string;
    col_product: string;
    col_legal: string;
    col_contact: string;
    contact_body: string;
    product_links: { label: string; href: string }[];
    legal_links: { label: string; href: string }[];
    rights: string;
    locale_row: string;
  };
  checkout: {
    success: {
      pending_eyebrow: string;
      success_eyebrow: string;
      headline_main: string;
      headline_accent: string;
      body_prefix: string;
      body_main: string;
      payment_ref: string;
      cta_home: string;
      cta_editor: string;
      footer: string;
    };
    cancel: {
      eyebrow: string;
      headline: string;
      body: string;
      cta_retry: string;
      cta_home: string;
      footer: string;
    };
  };
}
