"use client";

/**
 * MusicWaveformPlayer — FAZ 5.5
 *
 * Çiftin kendi şarkısı + ince zarif waveform player. Pressed Love'da yok.
 *
 * 32 ince dikey çubuk — şarkı çalarken her birinin yüksekliği müzik
 * ritmine göre dans eder. Müzik durduğunda hepsi sabit minimal yüksek-
 * likte (1px) — minimalist görünür ama interaktif. Spotify'ın audio
 * visualizer'ını davetiye estetiğine indirgenmiş hâli.
 *
 * Teknik: <audio> element + Web Audio API → AnalyserNode → 32 FFT bin →
 * her bin bir çubuğun height'ını sürer.
 *
 * Düşük güç moduna saygı: prefers-reduced-motion → static minimal bars.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MusicWaveformPlayerProps {
  /** Şarkının URL'si (mp3/m4a/ogg). */
  src?: string;
  /** Şarkı + sanatçı etiketi. Demo: "Clair de Lune · Debussy" */
  trackLabel?: string;
  /** Çubuk rengi (tema accent). */
  color?: string;
  /** Ink rengi (track etiketi). */
  inkColor?: string;
  /** Çubuk sayısı. Default 36 — Pressed Love'dan zarif fark. */
  bars?: number;
  className?: string;
}

export function MusicWaveformPlayer({
  src,
  trackLabel = "Clair de Lune · Debussy",
  color = "#9F84B5",
  inkColor = "rgba(43, 30, 22, 0.78)",
  bars = 36,
  className = "",
}: MusicWaveformPlayerProps) {
  const prefersReduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [playing, setPlaying] = useState(false);
  const [levels, setLevels] = useState<number[]>(() => Array(bars).fill(0.1));

  // Web Audio init — lazy, sadece play'a basılınca
  function ensureAudioContext() {
    const a = audioRef.current;
    if (!a || analyserRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const src = ctx.createMediaElementSource(a);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = bars * 2;  // 36 bars → 72 fft
      src.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    } catch {
      // Web Audio not supported — gracefully degrade
    }
  }

  function tick() {
    const analyser = analyserRef.current;
    const data = dataArrayRef.current;
    if (!analyser || !data) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    // Cast — Web Audio Uint8Array typings shifted between TS 5.6/5.7;
    // any-cast keeps build green on both.
    analyser.getByteFrequencyData(data as unknown as Uint8Array<ArrayBuffer>);
    const next: number[] = [];
    for (let i = 0; i < bars; i++) {
      next.push(data[i] / 255);
    }
    setLevels(next);
    rafRef.current = requestAnimationFrame(tick);
  }

  function togglePlay() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setLevels(Array(bars).fill(0.1));
    } else {
      ensureAudioContext();
      a.play().then(() => {
        setPlaying(true);
        if (!prefersReduced) {
          tick();
        }
      }).catch(() => {
        // Autoplay blocked or no src
      });
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-4 ${className}`}
      style={{ fontFamily: "var(--font-display), Georgia, serif" }}
    >
      {src && (
        <audio ref={audioRef} src={src} preload="metadata" />
      )}

      {/* Track label */}
      <span
        className="text-[10px] uppercase"
        style={{
          color: inkColor,
          letterSpacing: "0.32em",
          fontWeight: 300,
        }}
      >
        {trackLabel}
      </span>

      {/* Waveform — 36 ince çubuk */}
      <div className="flex h-[44px] items-end gap-[3px]">
        {levels.map((level, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="block w-[2px] rounded-full"
            style={{
              background: color,
              height: `${Math.max(2, level * 40)}px`,
              opacity: 0.55 + level * 0.45,
            }}
            animate={{
              height: `${Math.max(2, level * 40)}px`,
              opacity: 0.55 + level * 0.45,
            }}
            transition={{ duration: 0.08, ease: "linear" }}
          />
        ))}
      </div>

      {/* Play/pause button — minimal pill */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
        className="inline-flex items-center gap-2 px-4 py-2 transition-all"
        style={{
          border: `1px solid ${color}`,
          background: "transparent",
          borderRadius: 999,
          color: inkColor,
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 300,
          cursor: "pointer",
        }}
      >
        <span aria-hidden style={{ fontSize: 8 }}>{playing ? "❚❚" : "▶"}</span>
        <span>{playing ? "Duraklat" : "Bizim şarkımız"}</span>
      </button>
    </div>
  );
}
