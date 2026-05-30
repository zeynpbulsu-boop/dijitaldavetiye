"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { motion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";

/**
 * YouTubeMusic — çiftin şarkısı, mühre basar basmaz ARKADA otomatik çalar.
 * VIDEO GÖRÜNMEZ: YouTube iframe'i opak bir "şarkı çalıyor" şeridi tamamen
 * örter (iframe render edilir → ses güvenle çalar; ama kullanıcı yalnızca ince
 * şeridi görür). Şarkı, linkteki t=/start= saniyesinden ("güzel yer") başlar ve
 * loop'ta da oradan döner. Telifli kayıt YouTube'un resmi oynatıcısında çalar →
 * bizde dosya yok, sıfır risk. Sesli autoplay yalnızca kullanıcı hareketi
 * (mühre dokunma = opened) sonrası başlatılır.
 */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  destroy(): void;
}
interface YTEvent {
  data: number;
  target: YTPlayer;
}
interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, number | string>;
  events?: { onReady?: (e: YTEvent) => void; onStateChange?: (e: YTEvent) => void };
}
declare global {
  interface Window {
    YT?: { Player: new (el: Element, opts: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const ENDED = 0;
const PLAYING = 1;

let apiPromise: Promise<void> | null = null;
function ensureYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        resolve();
      };
      const exists = Array.from(document.scripts).some((s) =>
        s.src.includes("youtube.com/iframe_api"),
      );
      if (!exists) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    });
  }
  return apiPromise;
}

export function YouTubeMusic({
  videoId,
  meta,
  opened,
  start = 0,
  playRef,
}: {
  videoId: string;
  meta: ThemeV2Meta;
  opened: boolean;
  start?: number;
  /** Mühre-basma jesti içinde doğrudan çağrılacak play fonksiyonu buraya kaydedilir. */
  playRef?: MutableRefObject<(() => void) | null>;
}) {
  const { palette } = meta;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const startRef = useRef(start);
  startRef.current = start;
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const host = mountRef.current;
    if (!host) return;
    // YT.Player verilen elemanı iframe ile değiştirir → React'in yönetmediği
    // imperatif bir hedef ekliyoruz.
    const target = document.createElement("div");
    host.appendChild(target);
    ensureYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(target, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          start: Math.floor(startRef.current),
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: () => {
            if (!cancelled) setReady(true);
          },
          onStateChange: (e) => {
            if (cancelled) return;
            // Bittiğinde "güzel yerden" yeniden başlat (loop).
            if (e.data === ENDED) {
              try {
                e.target.seekTo(startRef.current, true);
                e.target.playVideo();
              } catch {
                /* ignore */
              }
            }
            setPlaying(e.data === PLAYING);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [videoId]);

  // Mühre basınca: güzel yerden başlat, sesi aç, çal (kullanıcı-hareketi penceresi).
  useEffect(() => {
    if (opened && ready && !dismissed) {
      try {
        playerRef.current?.seekTo(startRef.current, true);
        playerRef.current?.unMute();
        playerRef.current?.playVideo();
      } catch {
        /* ignore */
      }
    }
  }, [opened, ready, dismissed]);

  // Play fonksiyonunu parent'a (theme-shell handleOpen) kaydet → mühre-basma
  // click handler'ının İÇİNDE senkron çağrılır (en güvenilir sesli autoplay).
  useEffect(() => {
    if (!playRef) return;
    playRef.current = () => {
      const p = playerRef.current;
      if (!p) return;
      try {
        p.seekTo(startRef.current, true);
        p.unMute();
        p.playVideo();
      } catch {
        /* ignore */
      }
    };
    return () => {
      playRef.current = null;
    };
  }, [playRef]);

  if (dismissed) return null;

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (playing) p.pauseVideo();
      else {
        p.unMute();
        p.playVideo();
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 right-4 z-40 overflow-hidden rounded-full"
      style={{ width: 232, boxShadow: "0 14px 40px -18px rgba(0,0,0,0.5)" }}
    >
      <div className="relative" style={{ height: 48 }}>
        {/* Gizli YouTube oynatıcı — render edilir (ses çalar) ama opak şerit örter. */}
        <div
          ref={mountRef}
          aria-hidden
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 96 }}
        />
        {/* Üstte opak "şarkı çalıyor" şeridi — videoyu tamamen kapatır. */}
        <div
          className="absolute inset-0 flex items-center justify-between gap-2 px-3"
          style={{
            backgroundColor: palette.paper,
            border: `1px solid ${palette.accent}40`,
            borderRadius: 999,
          }}
        >
          <span
            className="flex items-center gap-2 truncate text-[10px] uppercase"
            style={{ color: palette.accent, letterSpacing: "0.2em", fontWeight: 500 }}
          >
            <EqBars color={palette.accent} active={playing} />
            Bizim Şarkımız
          </span>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Duraklat" : "Çal"}
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:scale-110"
              style={{ color: palette.accent }}
            >
              {playing ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  playerRef.current?.pauseVideo();
                } catch {
                  /* ignore */
                }
                setDismissed(true);
              }}
              aria-label="Kapat"
              className="flex h-7 w-7 items-center justify-center rounded-full transition hover:opacity-70"
              style={{ color: palette.inkSoft }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EqBars({ color, active }: { color: string; active: boolean }) {
  if (!active) {
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    );
  }
  return (
    <span className="inline-flex items-end gap-[2px]" style={{ height: 11 }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: 2, backgroundColor: color, borderRadius: 1 }}
          animate={{ height: [4, 11, 5, 9, 4] }}
          transition={{ duration: 0.9 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}
