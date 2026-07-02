"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, ThemeV2Data } from "@/lib/themes-v2/types";
import { DustParticles } from "./atmosphere";
import { THEME_CEREMONY } from "@/lib/themes-v2/assets";
import { useInvitationT } from "../i18n-context";

const CURTAIN_MS = 1250;
/** Seal-crack micro-animation length — curtain waits for it, so the ritual
 *  reads: mühür kırılır → perde açılır. */
const CRACK_MS = 420;
const AMBIENT_VOLUME = 0.4;

/* ── Ambient audio ───────────────────────────────────────────────────
 * Self-contained <audio> with graceful fallback: the toggle only becomes
 * `available` once the file actually loads, so there's never a dead control
 * when a theme has no track yet. Autoplay is started from the tap-to-open
 * gesture (browsers block un-gestured audio). */
export function useAmbientAudio(src?: string) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const raf = useRef<number | null>(null);
  const [available, setAvailable] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!src || typeof Audio === "undefined") return;
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    const onReady = () => setAvailable(true);
    const onErr = () => setAvailable(false);
    // `canplaythrough` tüm dosya buffer'lanınca ateşlenir → 5MB mp3 + CDN'siz
    // yavaş sunucuda çok geç/hiç → toggle görünmez, müzik "yok" sanılır.
    // `loadedmetadata`/`canplay` çok daha erken ateşlenir; gerçek çalma zaten
    // kullanıcı hareketiyle (tap-to-open / toggle) olduğundan bu güvenli.
    audio.addEventListener("loadedmetadata", onReady);
    audio.addEventListener("canplay", onReady);
    audio.addEventListener("error", onErr);
    audio.src = src;
    ref.current = audio;
    return () => {
      audio.removeEventListener("loadedmetadata", onReady);
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("error", onErr);
      audio.pause();
      ref.current = null;
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [src]);

  const fadeTo = useCallback((target: number, ms: number) => {
    const audio = ref.current;
    if (!audio) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    const from = audio.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      audio.volume = from + (target - from) * k;
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(() => {
    const audio = ref.current;
    if (!audio || muted) return;
    audio.play().then(() => fadeTo(AMBIENT_VOLUME, 1600)).catch(() => {});
  }, [muted, fadeTo]);

  const toggle = useCallback(() => {
    const next = !muted;
    setMuted(next);
    const audio = ref.current;
    if (!audio) return;
    if (next) {
      fadeTo(0, 400);
    } else {
      audio.play().then(() => fadeTo(AMBIENT_VOLUME, 900)).catch(() => {});
    }
  }, [muted, fadeTo]);

  return { available, muted, start, toggle };
}

/* ── Floating sound toggle (bottom-right) ────────────────────────────── */
export function AmbientToggle({
  muted,
  onToggle,
  palette,
}: {
  muted: boolean;
  onToggle: () => void;
  palette: ThemeV2Meta["palette"];
}) {
  const reduced = useReducedMotion();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? "Müziği aç" : "Müziği kapat"}
      className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition hover:scale-105"
      style={{
        backgroundColor: `${palette.paper}d9`,
        border: `1px solid ${palette.accent}55`,
        color: palette.accent,
        boxShadow: "0 6px 22px -8px rgba(0,0,0,0.4)",
      }}
    >
      <SoundIcon muted={muted} />
      {!muted && !reduced && <PulseRing color={palette.accent} />}
    </button>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      {muted ? (
        <path d="M17 9l5 6M22 9l-5 6" />
      ) : (
        <>
          <path d="M16.5 8.5a5 5 0 0 1 0 7" />
          <path d="M19 6a8 8 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

function PulseRing({ color }: { color: string }) {
  return (
    <motion.span
      className="pointer-events-none absolute inset-0 rounded-full"
      style={{ border: `1px solid ${color}` }}
      animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/* ── The opening ceremony — sealed cover that parts on tap ────────────── */
export function OpeningCeremony({
  meta,
  data,
  opened,
  onOpen,
}: {
  meta: ThemeV2Meta;
  data: ThemeV2Data;
  opened: boolean;
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const { palette } = meta;
  const ceremony = THEME_CEREMONY[meta.slug];
  const [gone, setGone] = useState(false);

  // Unmount after the crack + curtain finish so it never blocks interaction.
  useEffect(() => {
    if (!opened) return;
    const t = window.setTimeout(
      () => setGone(true),
      reduced ? 320 : CRACK_MS + CURTAIN_MS + 120,
    );
    return () => window.clearTimeout(t);
  }, [opened, reduced]);

  // Lock scroll while the cover is up.
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  if (gone) return null;

  const panelBg = `linear-gradient(180deg, ${palette.bg} 0%, ${palette.countdownBg} 140%)`;
  // Curtain waits for the seal to crack first (except in reduced motion).
  const curtain = {
    duration: reduced ? 0.3 : CURTAIN_MS / 1000,
    delay: reduced || !opened ? 0 : CRACK_MS / 1000,
    ease: [0.76, 0, 0.24, 1] as const,
  };

  // When a real cover texture exists, split one image across the two panels
  // (each shows its half) so the parting curtain looks like one luxe sheet.
  // Wash alphas stay LOW (27/20%) — the fal.ai paper/linen texture is the
  // luxury signal; drowning it in palette gradient reads as a flat empty wall.
  const panelStyle = (side: "left" | "right"): CSSProperties =>
    ceremony?.coverTexture
      ? {
          backgroundImage: `linear-gradient(180deg, ${palette.bg}44 0%, ${palette.countdownBg}33 140%), url(${ceremony.coverTexture})`,
          backgroundSize: "100vw 100%, 100vw 100%",
          backgroundPosition: `${side} center, ${side} center`,
          backgroundColor: palette.bg,
          boxShadow:
            side === "left"
              ? "inset -18px 0 32px -22px rgba(0,0,0,0.35)"
              : "inset 18px 0 32px -22px rgba(0,0,0,0.35)",
        }
      : { background: panelBg };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{ pointerEvents: opened ? "none" : "auto" }}
      aria-hidden={opened}
    >
      {/* Two panels that part like a curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={panelStyle("left")}
        initial={false}
        animate={opened ? { x: "-101%" } : { x: 0 }}
        transition={curtain}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={panelStyle("right")}
        initial={false}
        animate={opened ? { x: "101%" } : { x: 0 }}
        transition={curtain}
      />

      {/* Soft vignette — gives the flat cover sheet physical depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(0,0,0,0.16) 100%)",
        }}
        initial={false}
        animate={{ opacity: opened ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Center invitation seal — cracks on tap, then the curtain parts */}
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label="Davetiyeyi aç"
        className="absolute inset-0 z-10 flex w-full cursor-pointer flex-col items-center justify-center px-6 text-center"
        initial={false}
        animate={opened ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
        transition={{ duration: opened ? 0.55 : 0.6, delay: opened && !reduced ? 0.22 : 0 }}
      >
        <DustParticles color={palette.accent} count={22} opacity={0.4} />

        <motion.p
          className="mb-9 text-[10px] uppercase"
          style={{ color: palette.inkSoft, letterSpacing: "0.5em" }}
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          {data.eyebrow}
        </motion.p>

        <WaxSeal
          monogram={data.monogram}
          palette={palette}
          reduced={!!reduced}
          sealSrc={ceremony?.seal}
          opened={opened}
        />

        <KineticNames
          partnerOne={data.partnerOne}
          partnerTwo={data.partnerTwo}
          ink={palette.ink}
          accent={palette.accent}
          reduced={!!reduced}
        />

        <motion.div
          className="mt-9 flex flex-col items-center gap-2"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 1 }}
        >
          <span className="text-[9.5px] uppercase" style={{ color: palette.inkSoft, letterSpacing: "0.42em" }}>
            {str.ceremony.tapToOpen}
          </span>
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke={palette.accent}
            strokeWidth="1.3"
            strokeLinecap="round"
            animate={reduced ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M3 6l5 5 5-5" />
          </motion.svg>
        </motion.div>
      </motion.button>
    </div>
  );
}

/* ── Kinetic typography — isimler harf harf yükselerek belirir ──────────
 * 2026'nın tanımlayıcı davetiye trendi; tüm temaların ilk ekranında ortak.
 * Ekran okuyucular tek aria-label okur, harf span'leri dekoratiftir. */
function KineticNames({
  partnerOne,
  partnerTwo,
  ink,
  accent,
  reduced,
}: {
  partnerOne: string;
  partnerTwo: string;
  ink: string;
  accent: string;
  reduced: boolean;
}) {
  const label = `${partnerOne} & ${partnerTwo}`;
  const base: CSSProperties = {
    fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
    fontSize: "clamp(38px, 6vw, 62px)",
    color: ink,
    lineHeight: 1.15,
  };

  if (reduced) {
    return (
      <p className="mt-10" style={base}>
        {label}
      </p>
    );
  }

  // Harf gecikmeleri iki ismin toplam uzunluğuna göre sıkışır ki uzun
  // isimlerde giriş 2 saniyeyi aşmasın.
  const chars = [...partnerOne, "&", ...partnerTwo];
  const step = Math.min(0.05, 1.4 / chars.length);
  let idx = 0;
  const charSpan = (ch: string, key: string, color?: string) => {
    const delay = 0.55 + idx * step;
    idx += 1;
    return (
      <motion.span
        key={key}
        aria-hidden
        className="inline-block"
        style={color ? { color } : undefined}
        initial={{ opacity: 0, y: "0.32em", rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {ch === " " ? " " : ch}
      </motion.span>
    );
  };

  return (
    <p className="mt-10" style={base} aria-label={label}>
      {[...partnerOne].map((ch, i) => charSpan(ch, `a${i}`))}
      {charSpan(" ", "s1")}
      {charSpan("&", "amp", accent)}
      {charSpan(" ", "s2")}
      {[...partnerTwo].map((ch, i) => charSpan(ch, `b${i}`))}
    </p>
  );
}

/* ── Wax-seal medallion with the couple's monogram ─────────────────────
 * 188px hero presence (Pressed Love ölçeği); on tap it CRACKS: the two
 * clip-path halves rotate/translate apart before the curtain moves. */
const SEAL_SIZE = "clamp(150px, 44vw, 188px)";

function SealFace({
  monogram,
  palette,
  sealSrc,
}: {
  monogram: string;
  palette: ThemeV2Meta["palette"];
  sealSrc?: string;
}) {
  return (
    <>
      {sealSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sealSrc}
          alt=""
          aria-hidden
          className="h-full w-full object-contain"
          style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))" }}
        />
      ) : (
        <svg viewBox="0 0 128 128" className="h-full w-full">
          <circle cx="64" cy="64" r="52" fill="none" stroke={palette.accent} strokeWidth="1" opacity="0.55" />
          <circle cx="64" cy="64" r="46" fill="none" stroke={palette.accent} strokeWidth="0.6" opacity="0.4" />
          {/* tick ring */}
          {Array.from({ length: 48 }).map((_, i) => {
            const a = (i / 48) * Math.PI * 2;
            const r1 = 49;
            const r2 = 51.5;
            return (
              <line
                key={i}
                x1={(64 + Math.cos(a) * r1).toFixed(2)}
                y1={(64 + Math.sin(a) * r1).toFixed(2)}
                x2={(64 + Math.cos(a) * r2).toFixed(2)}
                y2={(64 + Math.sin(a) * r2).toFixed(2)}
                stroke={palette.accent}
                strokeWidth="0.5"
                opacity="0.35"
              />
            );
          })}
        </svg>
      )}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
          fontSize: sealSrc ? "clamp(40px, 11vw, 48px)" : "clamp(46px, 13vw, 56px)",
          // On the real gold seal, render the monogram as if engraved into the wax.
          color: sealSrc ? "rgba(70,48,12,0.62)" : palette.accent,
          textShadow: sealSrc ? "0 1px 0.5px rgba(255,238,196,0.5)" : undefined,
          lineHeight: 1,
        }}
      >
        {monogram}
      </span>
    </>
  );
}

function WaxSeal({
  monogram,
  palette,
  reduced,
  sealSrc,
  opened,
}: {
  monogram: string;
  palette: ThemeV2Meta["palette"];
  reduced: boolean;
  sealSrc?: string;
  opened: boolean;
}) {
  const crack = { duration: CRACK_MS / 1000, ease: [0.5, 0.05, 0.6, 1] as const };
  const cracking = opened && !reduced;

  return (
    <motion.div
      className="relative"
      style={{ width: SEAL_SIZE, height: SEAL_SIZE }}
      initial={reduced ? false : { opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* breathing glow — dies instantly when the seal cracks */}
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.accent}55 0%, ${palette.accent}00 70%)`,
        }}
        animate={
          cracking
            ? { opacity: 0, scale: 1.3 }
            : reduced
              ? undefined
              : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }
        }
        transition={cracking ? { duration: 0.35 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Left half — clip-path'li iki yarım ters yönlere kırılır */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: "polygon(0 0, 54% 0, 46% 100%, 0 100%)" }}
        initial={false}
        animate={cracking ? { x: -16, y: 5, rotate: -7, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={crack}
      >
        <SealFace monogram={monogram} palette={palette} sealSrc={sealSrc} />
      </motion.div>

      {/* Right half */}
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: "polygon(54% 0, 100% 0, 100% 100%, 46% 100%)" }}
        initial={false}
        animate={cracking ? { x: 16, y: -4, rotate: 6, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={crack}
      >
        <SealFace monogram={monogram} palette={palette} sealSrc={sealSrc} />
      </motion.div>
    </motion.div>
  );
}
