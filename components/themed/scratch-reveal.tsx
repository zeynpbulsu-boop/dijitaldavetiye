"use client";

/**
 * ScratchReveal — Pressed Love paritesi.
 *
 * Children prop'u olarak verilen içerik (örn. tarih satırı), üzerinde
 * canvas overlay ile gizlenir. Kullanıcı mouse veya touch ile kazıdıkça
 * canvas'ta destination-out compositing pikselleri siler. Belirli bir
 * yüzdeye (~%40) ulaşıldığında otomatik fade-out + altındaki içerik
 * görünür.
 *
 * Tasarım kararları:
 *   - Canvas yalnızca client-side mount edilir (useEffect). SSR'da
 *     children görünür (hydration mismatch sıfır).
 *   - HiDPI: canvas piksel boyutu * devicePixelRatio. CSS boyut
 *     bozulmuyor.
 *   - Touch event'ler passive false (preventDefault — scroll'u
 *     bloklamak için).
 *   - prefers-reduced-motion: canvas hiç çizilmez, içerik direkt
 *     görünür (kazımak motion-heavy bir interaction).
 *
 * Bağımlılık yok — vanilla canvas API.
 */

import { useEffect, useRef, useState } from "react";

interface ScratchRevealProps {
  /** Altta gizlenen içerik. */
  children: React.ReactNode;
  /** Surface rengi (hex). Default tema accent / soft gold. */
  surfaceColor?: string;
  /** Kazıma kalınlığı (px). Default 36. */
  brushSize?: number;
  /** Tamamlama eşiği (0..1). Default 0.4. */
  threshold?: number;
  /** Hint metni (örn. "Kazıyın"). */
  hint?: string;
  /** Hint metin rengi. */
  hintColor?: string;
  className?: string;
}

export function ScratchReveal({
  children,
  surfaceColor = "#C8B68A",
  brushSize = 36,
  threshold = 0.4,
  hint,
  hintColor = "#FFFFFF",
  className = "",
}: ScratchRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [supported, setSupported] = useState(true);

  /* prefers-reduced-motion → kazıma yok, içerik direkt görünür. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setRevealed(true);
      setSupported(false);
    }
  }, []);

  /* Canvas'ı mount sonrası kur — surface ile doldur + event handler'lar. */
  useEffect(() => {
    if (!supported || revealed) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    let lastCheck = 0;

    function fitCanvas() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, rect.width, rect.height);
      /* Hint yazısı surface üstünde belirsin. */
      if (hint) {
        ctx.fillStyle = hintColor;
        ctx.font = '300 12px / 1 "Cormorant Garamond", Georgia, serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.globalAlpha = 0.8;
        ctx.fillText(hint.toUpperCase(), rect.width / 2, rect.height / 2);
        ctx.globalAlpha = 1;
      }
      /* Kazıma operatörü — kazıma sırasında pikselleri sil. */
      ctx.globalCompositeOperation = "destination-out";
    }

    fitCanvas();
    const ro = new ResizeObserver(fitCanvas);
    ro.observe(container);

    function drawAt(clientX: number, clientY: number) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    function checkProgress() {
      if (!canvas) return;
      const now = performance.now();
      if (now - lastCheck < 120) return;
      lastCheck = now;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      /* Tüm canvas'ı taramak pahalı. ~50x50 grid sample alıyoruz. */
      const sampleW = 50;
      const sampleH = 50;
      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let cleared = 0;
        const stepX = Math.floor(canvas.width / sampleW);
        const stepY = Math.floor(canvas.height / sampleH);
        for (let y = 0; y < sampleH; y++) {
          for (let x = 0; x < sampleW; x++) {
            const idx = (y * stepY * canvas.width + x * stepX) * 4 + 3;
            if (data[idx] === 0) cleared++;
          }
        }
        const ratio = cleared / (sampleW * sampleH);
        if (ratio >= threshold) {
          setRevealed(true);
        }
      } catch {
        /* CORS-tainted canvas'ta getImageData fırlatır; bizim canvas'ta
           sadece kendi pikselleri var, normalde olmamalı. Sessizce yut. */
      }
    }

    let pointerDown = false;

    function onPointerDown(e: PointerEvent) {
      pointerDown = true;
      drawAt(e.clientX, e.clientY);
    }
    function onPointerMove(e: PointerEvent) {
      if (!pointerDown) return;
      drawAt(e.clientX, e.clientY);
      checkProgress();
    }
    function onPointerUp() {
      pointerDown = false;
      checkProgress();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);
    /* iOS Safari touch scroll'u bloklamak için. */
    canvas.style.touchAction = "none";

    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [supported, revealed, surfaceColor, brushSize, threshold, hint, hintColor]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{ minWidth: 1, minHeight: 1 }}
    >
      {children}
      {supported && !revealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 cursor-pointer transition-opacity duration-700"
          style={{ opacity: revealed ? 0 : 1 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
