"use client";

/**
 * AudioContext — singleton, user-gesture-gated, graceful-degrade.
 *
 * Tarayıcılar autoplay'i yasak ettiği için (özellikle iOS Safari),
 * AudioContext sadece kullanıcı ilk dokunduğunda unlock olur.
 *
 * Tasarım:
 *   - Tone.js master AudioContext
 *   - Howler.js one-shot SFX player
 *   - useAmbient(slug) → ambient loop (per-edition)
 *   - useSfx() → { play(name) } imperative
 *   - prefers-reduced-motion + audio çakışmasında: motion reduce ise
 *     ambient OFF (defaultta), kullanıcı manuel açabilir.
 *
 * Audio dosyaları yoksa no-op. Hata fırlatmaz.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Howl, Howler } from "howler";
import * as Tone from "tone";
import { EDITION_AUDIO, SHARED_SFX, type AudioManifest } from "./edition-tracks";
import type { EditionSlug } from "@/lib/design/tokens";

type EditionKey = EditionSlug | "aethel";

interface AudioContextValue {
  /** AudioContext açık mı? (kullanıcı ilk dokunduktan sonra true) */
  unlocked: boolean;
  /** Mute toggle. Default: muted (autoplay policy). */
  muted: boolean;
  setMuted: (m: boolean) => void;
  /** Manuel unlock — UI'dan "♪ Sesi aç" tıklayınca çağrılır. */
  unlock: () => Promise<void>;
  /** Per-edition ambient'ı başlat. */
  playAmbient: (edition: EditionKey) => void;
  /** Ambient'i durdur. */
  stopAmbient: () => void;
  /** One-shot SFX oynat. (key path or edition-specific name) */
  playSfx: (src: string, options?: { volume?: number; rate?: number }) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    // Provider yoksa no-op fallback
    return {
      unlocked: false,
      muted: true,
      setMuted: () => {},
      unlock: async () => {},
      playAmbient: () => {},
      stopAmbient: () => {},
      playSfx: () => {},
    };
  }
  return ctx;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMutedState] = useState(true);
  const ambientHowlRef = useRef<Howl | null>(null);
  const sfxCacheRef = useRef<Map<string, Howl>>(new Map());

  const unlock = useCallback(async () => {
    try {
      // Tone.js master context unlock
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }
      setUnlocked(true);
    } catch (e) {
      // Audio yoksa veya context yoksa — sessiz fallback
      console.warn("[audio] unlock failed:", e);
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    Howler.mute(m);
    if (!m && !unlocked) {
      // Sesi açmak istiyor ama unlock olmamış → unlock dene
      void unlock();
    }
  }, [unlocked, unlock]);

  const playAmbient = useCallback((edition: EditionKey) => {
    const manifest: AudioManifest | undefined = EDITION_AUDIO[edition];
    if (!manifest?.ambient || muted) return;

    // Önceki ambient'i fade-out edip durdur
    if (ambientHowlRef.current) {
      ambientHowlRef.current.fade(ambientHowlRef.current.volume(), 0, 600);
      const previous = ambientHowlRef.current;
      window.setTimeout(() => previous.stop(), 700);
    }

    try {
      const howl = new Howl({
        src: [manifest.ambient],
        loop: true,
        volume: 0,
        html5: false,
        preload: true,
        onloaderror: () => {
          // Dosya yok — sessiz fallback
        },
      });
      howl.play();
      howl.fade(0, 0.35, 1200);
      ambientHowlRef.current = howl;
    } catch (e) {
      console.warn("[audio] ambient play failed:", e);
    }
  }, [muted]);

  const stopAmbient = useCallback(() => {
    if (!ambientHowlRef.current) return;
    const howl = ambientHowlRef.current;
    howl.fade(howl.volume(), 0, 600);
    window.setTimeout(() => howl.stop(), 700);
    ambientHowlRef.current = null;
  }, []);

  const playSfx = useCallback(
    (src: string, options?: { volume?: number; rate?: number }) => {
      if (muted) return;

      let howl = sfxCacheRef.current.get(src);
      if (!howl) {
        howl = new Howl({
          src: [src],
          volume: options?.volume ?? 0.7,
          rate: options?.rate ?? 1,
          onloaderror: () => {
            sfxCacheRef.current.delete(src);
          },
        });
        sfxCacheRef.current.set(src, howl);
      }
      try {
        howl.play();
      } catch (e) {
        // Sessiz fallback
      }
    },
    [muted]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ambientHowlRef.current) {
        ambientHowlRef.current.stop();
        ambientHowlRef.current = null;
      }
      sfxCacheRef.current.forEach((h) => h.unload());
      sfxCacheRef.current.clear();
    };
  }, []);

  return (
    <AudioCtx.Provider
      value={{ unlocked, muted, setMuted, unlock, playAmbient, stopAmbient, playSfx }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export { SHARED_SFX };
