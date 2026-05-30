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
    bg: "/themes-v2/celenk/watercolor-bg.webp",
    accent: "/themes-v2/celenk/gypsophila-cluster.webp",
  },
  polaroid: {
    scenes: [
      "/themes-v2/polaroid/scene-sunset.webp",
      "/themes-v2/polaroid/scene-mountain.webp",
      "/themes-v2/polaroid/scene-field.webp",
      "/themes-v2/polaroid/scene-shore.webp",
    ],
  },
  kurdele: {
    texture: "/themes-v2/kurdele/vellum-texture.webp",
    accent: "/themes-v2/kurdele/blue-wash.webp",
  },
  fener: {
    illustration: "/themes-v2/fener/venue-sketch.webp",
    overlay: "/themes-v2/fener/bokeh-overlay.webp",
  },
  defter: {
    texture: "/themes-v2/defter/linen-texture.webp",
    accent: "/themes-v2/defter/pressed-flower.webp",
  },
  geceyarisi: {
    bg: "/themes-v2/geceyarisi/nebula-bg.webp",
    overlay: "/themes-v2/geceyarisi/foliage-gold.webp",
  },
  postakart: {
    illustration: "/themes-v2/postakart/ayvalik-landscape.webp",
    texture: "/themes-v2/postakart/aged-paper.webp",
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

/**
 * Cinematic full-bleed hero VIDEO per theme (fal.ai-generated original clips).
 * Optional — when present the hero renders a <video> backdrop (with the still
 * bg image as poster fallback); when absent it falls back to the still + motion.
 * Populated as each theme's clip is generated + web-optimized.
 */
export const THEME_VIDEO: Partial<Record<ThemeV2Slug, string>> = {
  celenk: "/themes-v2/celenk/hero-video.mp4",
  polaroid: "/themes-v2/polaroid/hero-video.mp4",
  kurdele: "/themes-v2/kurdele/hero-video.mp4",
  fener: "/themes-v2/fener/hero-video.mp4",
  defter: "/themes-v2/defter/hero-video.mp4",
  geceyarisi: "/themes-v2/geceyarisi/night-sky.mp4",
  postakart: "/themes-v2/postakart/hero-video.mp4",
};

/**
 * Realistic opening-ceremony assets per theme (fal.ai-generated). When a seal
 * image is present the sealed cover uses it (with the couple monogram overlaid)
 * instead of the flat SVG seal; coverTexture enriches the cover panels.
 */
export interface ThemeCeremonyAssets {
  seal?: string;
  coverTexture?: string;
}
export const THEME_CEREMONY: Partial<Record<ThemeV2Slug, ThemeCeremonyAssets>> = {
  celenk: { seal: "/themes-v2/celenk/wax-seal.webp", coverTexture: "/themes-v2/celenk/cover-texture.webp" },
  polaroid: { seal: "/themes-v2/polaroid/wax-seal.webp", coverTexture: "/themes-v2/polaroid/cover-texture.webp" },
  kurdele: { seal: "/themes-v2/kurdele/wax-seal.webp", coverTexture: "/themes-v2/kurdele/cover-texture.webp" },
  fener: { seal: "/themes-v2/fener/wax-seal.webp", coverTexture: "/themes-v2/fener/cover-texture.webp" },
  defter: { seal: "/themes-v2/defter/wax-seal.webp", coverTexture: "/themes-v2/defter/cover-texture.webp" },
  geceyarisi: {
    seal: "/themes-v2/geceyarisi/wax-seal-gold.webp",
    coverTexture: "/themes-v2/geceyarisi/cover-texture.webp",
  },
  postakart: { seal: "/themes-v2/postakart/wax-seal.webp", coverTexture: "/themes-v2/postakart/cover-texture.webp" },
};

/** Thumbnail used by /tasarimlar showcase grid. */
export const THEME_THUMB: Record<ThemeV2Slug, string> = {
  celenk: "/themes-v2/thumbs/celenk.webp",
  polaroid: "/themes-v2/thumbs/polaroid.webp",
  kurdele: "/themes-v2/thumbs/kurdele.webp",
  fener: "/themes-v2/thumbs/fener.webp",
  defter: "/themes-v2/thumbs/defter.webp",
  geceyarisi: "/themes-v2/thumbs/geceyarisi.webp",
  postakart: "/themes-v2/thumbs/postakart.webp",
};
