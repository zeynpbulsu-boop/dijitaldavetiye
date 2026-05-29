import type { ThemeV2Slug } from "./types";

/**
 * Asset paths per theme — rendered via fal.ai (flux-pro/v1.1-ultra),
 * stored under /public/themes-v2/<slug>/. Used by Hero components
 * to layer real watercolor / photographic textures behind the SVG
 * illustrations.
 */

export interface ThemeAssets {
  /** Hero background image (full-bleed) */
  bg?: string;
  /** Layered overlay (e.g. blue wash, foliage, bokeh) */
  overlay?: string;
  /** Specific scene assets (polaroid, postcard landscape) */
  scenes?: string[];
  /** Single accent image (gypsophila cluster, pressed flower, etc.) */
  accent?: string;
  /** Aged paper / texture layer */
  texture?: string;
  /** Hand-drawn venue / illustration */
  illustration?: string;
}

export const THEME_ASSETS: Record<ThemeV2Slug, ThemeAssets> = {
  celenk: {
    bg: "/themes-v2/celenk/watercolor-bg.png",
    accent: "/themes-v2/celenk/gypsophila-cluster.png",
  },
  polaroid: {
    scenes: [
      "/themes-v2/polaroid/scene-sunset.png",
      "/themes-v2/polaroid/scene-mountain.png",
      "/themes-v2/polaroid/scene-field.png",
      "/themes-v2/polaroid/scene-shore.png",
    ],
  },
  kurdele: {
    texture: "/themes-v2/kurdele/vellum-texture.png",
    accent: "/themes-v2/kurdele/blue-wash.png",
  },
  fener: {
    illustration: "/themes-v2/fener/venue-sketch.png",
    overlay: "/themes-v2/fener/bokeh-overlay.png",
  },
  defter: {
    texture: "/themes-v2/defter/linen-texture.png",
    accent: "/themes-v2/defter/pressed-flower.png",
  },
  geceyarisi: {
    bg: "/themes-v2/geceyarisi/nebula-bg.png",
    overlay: "/themes-v2/geceyarisi/foliage-gold.png",
  },
  postakart: {
    illustration: "/themes-v2/postakart/ayvalik-landscape.png",
    texture: "/themes-v2/postakart/aged-paper.png",
  },
};

/**
 * Optional ambient music per theme. Dropped into /public/themes-v2/<slug>/.
 * The sound toggle only appears if the file actually loads — until an mp3
 * exists at this path the control stays hidden (no dead UI). Starts on the
 * tap-to-open gesture (browsers require a user gesture for autoplay).
 */
export const THEME_MUSIC: Partial<Record<ThemeV2Slug, string>> = {
  // Public-domain classical (composers d. 1849–1925 → compositions are PD
  // worldwide), already shipped in /public/audio. Reused here by theme mood so
  // the ambient toggle works with zero new files and zero licensing risk.
  // NOTE: the file NAMES are misleading legacy paths — the actual audio is the
  // classical piece noted in each comment.
  geceyarisi: "/audio/aurora/comptine-dun-autre-ete.mp3", // Beethoven — Moonlight Sonata, Mvt I
  celenk: "/audio/candela/la-vie-en-rose-instrumental.mp3", // Satie — Gymnopédie No. 1
  kurdele: "/audio/nocturne/chopin-nocturne.mp3", // Chopin — Nocturne Op. 9 No. 2
  defter: "/audio/aethel/clair-de-lune.mp3", // Debussy — Clair de Lune
  fener: "/audio/olea/lemon-tree-acoustic.mp3", // Pachelbel — Canon in D
  polaroid: "/audio/mistral/sagapo-instrumental.mp3", // Satie — Gnossienne No. 1
  postakart: "/audio/aethel/clair-de-lune.mp3", // Debussy — Clair de Lune (shared)
};

/** Thumbnail used by /tasarimlar showcase grid. */
export const THEME_THUMB: Record<ThemeV2Slug, string> = {
  celenk: "/themes-v2/thumbs/celenk.png",
  polaroid: "/themes-v2/thumbs/polaroid.png",
  kurdele: "/themes-v2/thumbs/kurdele.png",
  fener: "/themes-v2/thumbs/fener.png",
  defter: "/themes-v2/thumbs/defter.png",
  geceyarisi: "/themes-v2/thumbs/geceyarisi.png",
  postakart: "/themes-v2/thumbs/postakart.png",
};
