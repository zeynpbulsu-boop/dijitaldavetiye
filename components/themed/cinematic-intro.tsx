"use client";

/**
 * CinematicIntro — 2.5s page-in film opening.
 *
 * Sayfa ilk yüklendiğinde:
 *   0.0s  → siyah perde tam ekran
 *   0.4s  → monogram harfleri stagger fade-in (her harf 0.08s gecikme)
 *   1.2s  → ink bloom (accent renkli daire scale 0→4, fade out)
 *   1.8s  → perde dikey ortadan ikiye yarılarak açılır
 *   2.5s  → onComplete tetiklenir, intro DOM'dan kalkar
 *
 * prefers-reduced-motion → no-op (instant onComplete).
 *
 * Awwwards 2026 SOTD pattern: 2-3s cinematic intro = screenshot-bait.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props {
  /** Couple monogram, örn. "D&A" */
  monogram: string;
  /** Edition palette ink color (perde içindeki yazı) */
  inkColor: string;
  /** Edition palette accent (ink bloom) */
  accentColor: string;
  /** Perde rengi (default: koyu, edition'a göre customize edilebilir) */
  curtainColor?: string;
  /** İntro bittikten sonra çağırılır. */
  onComplete: () => void;
  /** Edition slug (custom font selection için, opsiyonel) */
  edition?: string;
}

export function CinematicIntro({
  monogram,
  inkColor,
  accentColor,
  curtainColor = "#0A0A0A",
  onComplete,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      onComplete();
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const letters = container.querySelectorAll(".intro-letter");
    const bloom = container.querySelector(".intro-ink-bloom");
    const curtainTop = container.querySelector(".intro-curtain-top");
    const curtainBottom = container.querySelector(".intro-curtain-bottom");

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete();
      },
    });

    // Phase 1 — letters fade in with stagger
    tl.fromTo(
      letters,
      { opacity: 0, scale: 0.6, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "expo.out" },
      0.4
    );

    // Phase 2 — ink bloom expand
    tl.fromTo(
      bloom,
      { scale: 0, opacity: 0.85 },
      { scale: 4.5, opacity: 0, duration: 1.0, ease: "power2.out" },
      1.2
    );

    // Phase 3 — curtain splits open vertically (top up, bottom down)
    tl.to(
      curtainTop,
      { y: "-100%", duration: 1.0, ease: "expo.inOut" },
      1.7
    );
    tl.to(
      curtainBottom,
      { y: "100%", duration: 1.0, ease: "expo.inOut" },
      1.7
    );

    // Phase 4 — letters fade out as curtain opens
    tl.to(
      [letters, bloom].filter(Boolean),
      { opacity: 0, duration: 0.5, ease: "power1.out" },
      2.0
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Top curtain half */}
      <div
        className="intro-curtain-top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: curtainColor,
          willChange: "transform",
        }}
      />
      {/* Bottom curtain half */}
      <div
        className="intro-curtain-bottom"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          background: curtainColor,
          willChange: "transform",
        }}
      />

      {/* Center stage — letters + ink bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Ink bloom layer (behind letters) */}
        <div
          className="intro-ink-bloom"
          style={{
            position: "absolute",
            width: 240,
            height: 240,
            borderRadius: "9999px",
            background: accentColor,
            mixBlendMode: "screen",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />

        {/* Monogram letters */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: "0.12em",
            fontFamily: "var(--font-calligraphy)",
            fontSize: "clamp(72px, 14vw, 168px)",
            lineHeight: 1,
            color: inkColor,
            textShadow: `0 0 24px ${accentColor}33`,
          }}
        >
          {monogram.split("").map((ch, i) => (
            <span
              key={`${ch}-${i}`}
              className="intro-letter"
              style={{
                display: "inline-block",
                willChange: "transform, opacity",
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>

        {/* NUVE wordmark — subtle */}
        <div
          className="intro-letter"
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 8,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: inkColor,
            opacity: 0.5,
            willChange: "transform, opacity",
          }}
        >
          NUVE · An invitation
        </div>
      </div>
    </div>
  );
}
