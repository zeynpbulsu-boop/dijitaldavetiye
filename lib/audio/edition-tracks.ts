/**
 * Per-edition audio manifest.
 *
 * NOT: .mp3 dosyaları henüz yok. Faz 3'te Suno AI + royalty-free
 * (Pixabay/Artlist) ile üretilecek. Audio dosyaları olmadan
 * useAmbient() / useSfx() no-op çalışır (graceful degrade).
 */

import type { EditionSlug } from "@/lib/design/tokens";

export interface AudioManifest {
  /** Looping ambient background. Tone.js veya Howler ile pürüzsüz loop. */
  ambient?: string;
  /** Music track — countdown/T-0 ya da envelope açılışında oynar. */
  music?: string;
  /** One-shot SFX. Anahtarlar her edition'a özel. */
  sfx?: Record<string, string>;
}

/** AETHEL_CHAPEL'a aurora slug verilmiş — onu da ekliyoruz. */
export const EDITION_AUDIO: Record<EditionSlug | "aethel", AudioManifest> = {
  aethel: {
    ambient: "/audio/aethel/ambient-chapel-reverb.mp3",
    music: "/audio/aethel/clair-de-lune.mp3",
    sfx: {
      bell: "/audio/aethel/bell-bronze-toll.mp3",
      doves: "/audio/aethel/doves-flapping.mp3",
      footsteps: "/audio/aethel/footsteps-stone.mp3",
    },
  },
  nocturne: {
    ambient: "/audio/nocturne/ambient-bosphorus-night.mp3",
    music: "/audio/nocturne/chopin-nocturne.mp3",
    sfx: {
      crystal: "/audio/nocturne/chandelier-crystal.mp3",
      champagne: "/audio/nocturne/champagne-pour.mp3",
      ink: "/audio/nocturne/ink-drop.mp3",
    },
  },
  candela: {
    ambient: "/audio/candela/ambient-yali-evening.mp3",
    music: "/audio/candela/la-vie-en-rose-instrumental.mp3",
    sfx: {
      candle: "/audio/candela/candle-flicker.mp3",
      ferry: "/audio/candela/bosphorus-ferry-horn-far.mp3",
      lantern: "/audio/candela/lantern-whoosh.mp3",
    },
  },
  mistral: {
    ambient: "/audio/mistral/ambient-aegean-waves.mp3",
    music: "/audio/mistral/sagapo-instrumental.mp3",
    sfx: {
      seagull: "/audio/mistral/seagull-distant.mp3",
      boatCreak: "/audio/mistral/boat-creak.mp3",
      splash: "/audio/mistral/water-splash.mp3",
    },
  },
  olea: {
    ambient: "/audio/olea/ambient-cicadas-leaves.mp3",
    music: "/audio/olea/lemon-tree-acoustic.mp3",
    sfx: {
      cicada: "/audio/olea/cicada-burst.mp3",
      birdsong: "/audio/olea/morning-birdsong.mp3",
      pour: "/audio/olea/olive-oil-pour.mp3",
    },
  },
  aurora: {
    ambient: "/audio/aurora/ambient-pad-faint-piano.mp3",
    music: "/audio/aurora/comptine-dun-autre-ete.mp3",
    sfx: {
      chime: "/audio/aurora/glass-chime.mp3",
      paper: "/audio/aurora/paper-flutter.mp3",
    },
  },
  timeless: {
    // Legacy edition — audio yok, no-op
  },
};

/** Countdown T-0 detonation için ortak SFX. */
export const SHARED_SFX = {
  ceremonialChime: "/audio/shared/ceremonial-chime.mp3",
  confettiPop: "/audio/shared/confetti-pop.mp3",
  sealShatter: "/audio/shared/wax-seal-shatter.mp3",
  envelopeOpen: "/audio/shared/envelope-tear.mp3",
} as const;
