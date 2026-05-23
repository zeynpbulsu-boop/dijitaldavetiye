"use client";

/**
 * AudioContext — singleton, lazy-loaded, user-gesture-gated.
 *
 * PERF: Tone.js (~200KB) + Howler.js (~20KB) eager loaded olunca
 * her sayfa First Load JS'i 220KB şişiyordu → bundle regression.
 * Bu refactor'da Tone + Howler **sadece kullanıcı sesi açtığında**
 * (`unlock()` veya `playSfx()` çağrısında) dynamic import edilir.
 *
 * Initial bundle: 0 audio lib. Sessiz fallback hiç asset yüklemez.
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
import { EDITION_AUDIO, SHARED_SFX, type AudioManifest } from "./edition-tracks";
import type { EditionSlug } from "@/lib/design/tokens";

type EditionKey = EditionSlug | "aethel";

interface AudioContextValue {
  unlocked: boolean;
  muted: boolean;
  setMuted: (m: boolean) => void;
  unlock: () => Promise<void>;
  playAmbient: (edition: EditionKey) => void;
  stopAmbient: () => void;
  playSfx: (src: string, options?: { volume?: number; rate?: number }) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
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

/* Lazy lib loaders — module-level memoize so multiple unlocks don't re-import. */
let howlerPromise: Promise<typeof import("howler")> | null = null;
const loadHowler = () => {
  if (!howlerPromise) howlerPromise = import("howler");
  return howlerPromise;
};

let tonePromise: Promise<typeof import("tone")> | null = null;
const loadTone = () => {
  if (!tonePromise) tonePromise = import("tone");
  return tonePromise;
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [muted, setMutedState] = useState(true);
  // Howl instances stored as `any` since the type is loaded lazily.
  const ambientHowlRef = useRef<{ stop: () => void; fade: (from: number, to: number, ms: number) => void; volume: () => number } | null>(null);
  const sfxCacheRef = useRef<Map<string, { play: () => void; unload: () => void }>>(new Map());

  const unlock = useCallback(async () => {
    try {
      const Tone = await loadTone();
      if (Tone.getContext().state !== "running") {
        await Tone.start();
      }
      setUnlocked(true);
    } catch (e) {
      console.warn("[audio] unlock failed:", e);
    }
  }, []);

  const setMuted = useCallback(
    (m: boolean) => {
      setMutedState(m);
      // Howler mute lazily — only if it was already loaded
      if (howlerPromise) {
        void howlerPromise.then((H) => H.Howler.mute(m));
      }
      if (!m && !unlocked) {
        void unlock();
      }
    },
    [unlocked, unlock]
  );

  const playAmbient = useCallback(
    (edition: EditionKey) => {
      const manifest: AudioManifest | undefined = EDITION_AUDIO[edition];
      if (!manifest?.ambient || muted) return;

      void loadHowler().then((H) => {
        if (ambientHowlRef.current) {
          const previous = ambientHowlRef.current;
          previous.fade(previous.volume(), 0, 600);
          window.setTimeout(() => previous.stop(), 700);
        }
        try {
          const howl = new H.Howl({
            src: [manifest.ambient!],
            loop: true,
            volume: 0,
            html5: false,
            preload: true,
            onloaderror: () => {
              /* file yok → sessiz fallback */
            },
          });
          howl.play();
          howl.fade(0, 0.35, 1200);
          ambientHowlRef.current = howl as unknown as typeof ambientHowlRef.current;
        } catch (e) {
          console.warn("[audio] ambient play failed:", e);
        }
      });
    },
    [muted]
  );

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
      void loadHowler().then((H) => {
        let howl = sfxCacheRef.current.get(src);
        if (!howl) {
          const fresh = new H.Howl({
            src: [src],
            volume: options?.volume ?? 0.7,
            rate: options?.rate ?? 1,
            onloaderror: () => {
              sfxCacheRef.current.delete(src);
            },
          });
          howl = fresh as unknown as typeof howl;
          sfxCacheRef.current.set(src, howl as NonNullable<typeof howl>);
        }
        try {
          howl?.play();
        } catch {
          /* silent fallback */
        }
      });
    },
    [muted]
  );

  // Cleanup
  useEffect(() => {
    const cache = sfxCacheRef.current;
    return () => {
      if (ambientHowlRef.current) {
        ambientHowlRef.current.stop();
        ambientHowlRef.current = null;
      }
      cache.forEach((h) => h.unload());
      cache.clear();
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
