"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Tema kartı görseli + hover/in-view'da oynayan sessiz video önizleme.
 * Rakip vitrin standardı: kart üstünde temanın sinematik hero klibi.
 *
 * - Masaüstü (hover destekli cihaz): mouse girince oynar, çıkınca durur.
 * - Mobil: kart görünümün ~%60'ına girince oynar, çıkınca durur
 *   (IntersectionObserver — dokunmatikte hover yok).
 * - prefers-reduced-motion: video hiç render edilmez, statik görsel kalır.
 * - Video yüklenemezse sessizce statik görsele düşer.
 */
export function HoverVideoThumb({
  videoSrc,
  imgSrc,
  alt,
  SvgFallback,
}: {
  videoSrc?: string;
  imgSrc: string;
  alt: string;
  SvgFallback?: React.ComponentType;
}) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);

  const wantsVideo = Boolean(videoSrc) && !reduced && !failed;

  // Masaüstü: hover'ı KARTIN kendisinden dinle — kart içindeki gradient
  // overlay'ler pointer'ı yuttuğu için iç div'in onMouseEnter'ı hiç
  // tetiklenmiyordu (video paused+opacity:0 kalıyordu). En yakın <a>/<article>
  // host'una bağlanınca overlay'ler sorun olmaktan çıkar.
  useEffect(() => {
    if (!wantsVideo || typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const host =
      rootRef.current?.closest("a, article, [data-hover-video-host]") ??
      rootRef.current;
    if (!host) return;
    const enter = () => setActive(true);
    const leave = () => setActive(false);
    host.addEventListener("mouseenter", enter);
    host.addEventListener("mouseleave", leave);
    return () => {
      host.removeEventListener("mouseenter", enter);
      host.removeEventListener("mouseleave", leave);
    };
  }, [wantsVideo]);

  // Mobil: hover yoksa in-view oynatma
  useEffect(() => {
    if (!wantsVideo || typeof window === "undefined") return;
    if (window.matchMedia("(hover: hover)").matches) return; // desktop → hover yönetir
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [wantsVideo]);

  // active değişince oynat/durdur
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => setFailed(true));
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <div ref={rootRef} className="absolute inset-0">
      <picture>
        <source srcSet={imgSrc} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </picture>

      {wantsVideo && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: active ? 1 : 0 }}
          src={videoSrc}
        />
      )}

      {SvgFallback && (
        <div className="absolute inset-0 -z-10">
          <SvgFallback />
        </div>
      )}
    </div>
  );
}
