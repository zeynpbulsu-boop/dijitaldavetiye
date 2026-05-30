"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ThemeV2Meta } from "@/lib/themes-v2/types";

/**
 * YouTubeMusic — çiftin şarkısı, mühre basar basmaz ARKADA otomatik çalar.
 *
 * Tarayıcılar sesli autoplay'i yalnızca kullanıcı hareketi sonrası izinli kılar;
 * mühre dokunma (opened=true) o hareketi sağlar → IFrame API `playVideo()` ile
 * sesli başlatırız. Telifli kayıt YouTube'un resmi oynatıcısında çalar (lisans
 * platformda) — dosya bizde barınmaz, sıfır risk. Loop + native kontroller +
 * kapat butonu. Küçük köşe oynatıcı (ToS uyumlu görünür embed, arka plan hissi).
 */

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}
interface YTPlayerOptions {
  videoId: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, number | string>;
  events?: { onReady?: () => void };
}
declare global {
  interface Window {
    YT?: { Player: new (el: Element, opts: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

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
}: {
  videoId: string;
  meta: ThemeV2Meta;
  opened: boolean;
}) {
  const { palette } = meta;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const host = mountRef.current;
    if (!host) return;
    // YT.Player verilen elemanı iframe ile DEĞİŞTİRİR. React'in yönettiği div'i
    // korumak için imperatif bir alt hedef ekliyoruz; React ona dokunmaz.
    const target = document.createElement("div");
    host.appendChild(target);
    ensureYouTubeApi().then(() => {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(target, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          loop: 1,
          playlist: videoId, // tek videoyu loop'lamak için gerekli
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
          controls: 1,
        },
        events: {
          onReady: () => {
            if (!cancelled) setReady(true);
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

  // Mühre basınca (opened) sesli otomatik başlat — kullanıcı-hareketi penceresi
  // içinde olduğu için tarayıcı sesli oynatmaya izin verir.
  useEffect(() => {
    if (opened && ready && !dismissed) {
      try {
        playerRef.current?.unMute();
        playerRef.current?.playVideo();
      } catch {
        /* ignore */
      }
    }
  }, [opened, ready, dismissed]);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-4 right-4 z-40 w-[min(78vw,288px)] overflow-hidden rounded-2xl"
      style={{
        backgroundColor: palette.paper,
        border: `1px solid ${palette.accent}40`,
        boxShadow: "0 18px 50px -22px rgba(0,0,0,0.55)",
      }}
    >
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: `1px solid ${palette.accent}26` }}
      >
        <span
          className="flex items-center gap-2 text-[10px] uppercase"
          style={{ color: palette.accent, letterSpacing: "0.26em", fontWeight: 500 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          Bizim Şarkımız
        </span>
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
          aria-label="Müziği kapat"
          className="text-[16px] leading-none transition hover:opacity-70"
          style={{ color: palette.inkSoft }}
        >
          &times;
        </button>
      </div>
      <div ref={mountRef} className="aspect-video w-full" />
    </motion.div>
  );
}
