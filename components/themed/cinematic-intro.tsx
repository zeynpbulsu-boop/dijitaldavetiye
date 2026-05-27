"use client";

/**
 * CinematicIntro — 2.5s page-in film opening (framer-motion).
 *
 * Sayfa ilk yüklendiğinde:
 *   0.0s  → siyah perde tam ekran
 *   0.4s  → monogram harfleri stagger fade-in
 *   1.2s  → ink bloom (accent renkli daire scale 0→4.5, fade out)
 *   1.7s  → perde dikey ortadan ikiye yarılır (top up, bottom down)
 *   2.5s  → onComplete tetiklenir, intro DOM'dan kalkar
 *
 * GSAP yerine framer-motion (zaten bundle'da, ek 50KB import yok).
 * prefers-reduced-motion → no-op (instant onComplete).
 */

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  monogram: string;
  inkColor: string;
  accentColor: string;
  curtainColor?: string;
  onComplete: () => void;
  edition?: string;
}

export function CinematicIntro({
  monogram,
  inkColor,
  accentColor,
  curtainColor = "#0A0A0A",
  onComplete,
}: Props) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      onComplete();
      return;
    }
    const timer = window.setTimeout(() => {
      setDone(true);
      onComplete();
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  if (done) return null;

  const letters = monogram.split("");

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Top curtain half — slides up after 1.7s */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.7, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
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
      {/* Bottom curtain half — slides down after 1.7s */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ duration: 0.7, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
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

      {/* Center stage */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {/* Ink bloom KALDIRILDI — scale 4.5x + screen blend tüm
            viewport'u accent rengiyle (sage/olive) yeşil-yıkamış
            gibi gösteriyordu, "ekran bozuk" hissi veriyordu.
            Sadece monogram fade-in yeterli premium efekt. */}

        {/* Monogram letters with stagger fade-in + fade-out */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.15 },
            },
          }}
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
          {letters.map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              variants={{
                hidden: { opacity: 0, scale: 0.6, y: 12 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </motion.div>

        {/* NUVE wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 1,
            marginTop: 32,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.6em",
            textTransform: "uppercase",
            color: inkColor,
            willChange: "transform, opacity",
          }}
        >
          NUVE · An invitation
        </motion.div>

        {/* Final fade-out overlay — kicks in at 2.0s */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 1.05, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            background: curtainColor,
            pointerEvents: "none",
            mixBlendMode: "normal",
          }}
        />
      </div>
    </div>
  );
}
