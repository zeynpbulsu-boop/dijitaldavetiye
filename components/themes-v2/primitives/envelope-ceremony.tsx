"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ThemeV2Meta, ThemeV2Data } from "@/lib/themes-v2/types";
import { THEME_CEREMONY, THEME_THUMB } from "@/lib/themes-v2/assets";
import { DustParticles } from "./atmosphere";
import { useInvitationT } from "../i18n-context";

/**
 * EnvelopeCeremony — Zarf Töreni 2.0 (imza açılış).
 *
 * Koreografi (≤2.5s, K10 jest-ödül protokolü):
 *   Perde 0  Misafirin ADI zarfın ön yüzünde (link ?g=<isim> taşır) —
 *            hiçbir Türk rakipte yok. Zarfın tamamı dokunma hedefi.
 *   Perde 1  Dokunuş → zarf 3D çevrilir (rotateY 180°, 0.75s) ve AYNI
 *            jestte müzik başlar (autoplay penceresi).
 *   Perde 2  Arka yüzde mum mühür; dokunuş → mühür İKİYE KIRILIR
 *            (clip-path yarımlar), kapak yukarı açılır (rotateX),
 *            davetiye kartı içinden yükselir.
 *   Perde 3  Tören 0.9s fade ile çözülür; hero'nun kinetik isimleri
 *            tam bu anda başlar (onOpen).
 *
 * Naiflik: kumarhane değil kırtasiye — tema kağıt dokusu zarfın malzemesi,
 * pul köşesi kontur kalpli, mühür letterpress monogramlı. Reduced-motion →
 * tek dokunuş + sade fade. "Atla" köşede (varsayılan deneyim tören,
 * kaçış hakkı saklı).
 */

const FLIP_S = 0.75;
const CRACK_S = 0.45;
const FLAP_S = 0.7;
const CARD_S = 0.9;
const FADE_S = 0.9;

type Phase = "front" | "back" | "opening" | "fading";

export function EnvelopeCeremony({
  meta,
  data,
  opened,
  onEngage,
  onOpen,
}: {
  meta: ThemeV2Meta;
  data: ThemeV2Data;
  opened: boolean;
  /** İlk dokunuş — müzik burada başlar (kullanıcı jesti). */
  onEngage: () => void;
  /** Mühür kırılıp kart çıkarken — shell `opened`'ı burada set eder. */
  onOpen: () => void;
}) {
  const reduced = useReducedMotion();
  const str = useInvitationT();
  const { palette } = meta;
  const ceremony = THEME_CEREMONY[meta.slug];
  const [phase, setPhase] = useState<Phase>("front");
  const [gone, setGone] = useState(false);
  const [guest, setGuest] = useState<string | null>(null);

  // ?g=<misafir> — kişisel selamlama. Effect'te okunur (SSR-güvenli).
  useEffect(() => {
    try {
      const g = new URLSearchParams(window.location.search).get("g");
      if (g && g.trim()) setGuest(g.trim().slice(0, 60));
    } catch {
      /* ignore */
    }
  }, []);

  // Kaydırma kilidi tören boyunca
  useEffect(() => {
    if (gone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [gone]);

  const finish = (fast: boolean) => {
    setPhase("fading");
    window.setTimeout(() => setGone(true), (fast ? 0.4 : FADE_S) * 1000 + 80);
  };

  const tapFront = () => {
    if (phase !== "front") return;
    onEngage(); // müzik — jest penceresi
    if (reduced) {
      onOpen();
      finish(true);
      return;
    }
    setPhase("back");
  };

  const tapSeal = () => {
    if (phase !== "back") return;
    setPhase("opening");
    // Kart yükselmeye başlarken davetiye "açıldı" — hero isimleri senkron başlar
    window.setTimeout(() => onOpen(), (CRACK_S + 0.25) * 1000);
    window.setTimeout(() => finish(false), (CRACK_S + FLAP_S + 0.5) * 1000);
  };

  const skip = () => {
    if (phase === "fading") return;
    onEngage();
    onOpen();
    finish(true);
  };

  if (gone) return null;

  // Zarf malzemesi: doku BASKIN (K: 'doku fısıltı değil, malzeme') — açık
  // paper tülü yalnız metin okunurluğu için ince; keten/kağıt lifleri görünür.
  const paperSurface: CSSProperties = ceremony?.coverTexture
    ? {
        backgroundImage: `linear-gradient(180deg, ${palette.paper}6b, ${palette.paper}52), url(${ceremony.coverTexture})`,
        backgroundSize: "cover, cover",
        backgroundPosition: "center, center",
      }
    : { backgroundColor: palette.paper };

  const opening = phase === "opening" || phase === "fading";

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{ backgroundColor: palette.bg, pointerEvents: phase === "fading" ? "none" : "auto" }}
      initial={false}
      animate={{ opacity: phase === "fading" ? 0 : 1 }}
      transition={{ duration: phase === "fading" ? FADE_S : 0.3 }}
      aria-hidden={opened}
    >
      {/* Atmosfer: doku + vignette + iki blur accent orb (K8) + toz */}
      {ceremony?.coverTexture && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, ${palette.bg}55, ${palette.bg}77), url(${ceremony.coverTexture})`,
            backgroundSize: "cover, cover",
          }}
        />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 52%, rgba(0,0,0,0.18) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full"
        style={{ background: `${palette.accent}1f`, filter: "blur(64px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-24 h-72 w-72 rounded-full"
        style={{ background: `${palette.accent}30`, filter: "blur(64px)" }}
      />
      <DustParticles color={palette.accent} count={18} opacity={0.35} />

      {/* Atla — kaçış hakkı, köşede */}
      <button
        type="button"
        onClick={skip}
        className="absolute right-5 top-6 z-20 text-[10px] uppercase transition hover:opacity-70"
        style={{ color: palette.inkSoft, letterSpacing: "0.34em", fontWeight: 500 }}
      >
        {str.ceremony.skip} →
      </button>

      {/* Zarf — 3D sahne */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="relative" style={{ perspective: 1400, width: "min(86vw, 400px)" }}>
          {/* Zemin gölgesi — zarf havada değil, masada duruyor */}
          <span
            aria-hidden
            className="absolute left-1/2 top-full mt-6 h-6 w-[78%] -translate-x-1/2 rounded-[50%]"
            style={{ background: palette.ink, opacity: 0.16, filter: "blur(14px)" }}
          />
          <motion.div
            className="relative w-full"
            style={{ aspectRatio: "10 / 7", transformStyle: "preserve-3d" }}
            initial={false}
            animate={{ rotateY: phase === "front" ? 0 : 180 }}
            transition={{ duration: FLIP_S, ease: [0.45, 0.05, 0.35, 1] }}
          >
            {/* ── ÖN YÜZ: misafire adreslenmiş zarf ── */}
            <button
              type="button"
              onClick={tapFront}
              aria-label={str.ceremony.tapToOpen}
              className="absolute inset-0 cursor-pointer rounded-[6px] text-left"
              style={{
                ...paperSurface,
                backfaceVisibility: "hidden",
                border: `1px solid ${palette.ink}22`,
                boxShadow: `0 30px 60px -24px ${palette.ink}47, 0 6px 16px ${palette.ink}1c`,
              }}
            >
              {/* Kabartmalı kapak çizgileri — zarfın ön yüzünde katlama izi */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 96%)",
                  background: `linear-gradient(180deg, ${palette.ink}0a, transparent 65%)`,
                  borderBottom: `1px solid ${palette.ink}12`,
                }}
              />
              {/* Gerçek pul: tema sanatı perfore çerçevede (kendi fal.ai render'ımız) */}
              <span
                aria-hidden
                className="absolute right-4 top-4 h-16 w-[52px] rotate-[2deg] overflow-hidden p-[3px]"
                style={{
                  backgroundColor: "#FDFBF6",
                  boxShadow: `0 2px 8px ${palette.ink}30`,
                  // perfore kenar: nokta maskesi
                  maskImage:
                    "radial-gradient(circle 2.2px at 2.5px 2.5px, transparent 2.2px, black 2.3px)",
                  maskSize: "7px 7px",
                  maskPosition: "-1px -1px",
                  WebkitMaskImage:
                    "radial-gradient(circle 2.2px at 2.5px 2.5px, transparent 2.2px, black 2.3px)",
                  WebkitMaskSize: "7px 7px",
                  WebkitMaskPosition: "-1px -1px",
                  borderRadius: 2,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={THEME_THUMB[meta.slug]}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ borderRadius: 1 }}
                />
              </span>
              {/* Posta damgası — pulun üstüne taşan mürekkep halkası + dalga */}
              <svg
                aria-hidden
                className="absolute right-10 top-9 rotate-[-14deg]"
                width="72"
                height="46"
                viewBox="0 0 72 46"
                fill="none"
                style={{ opacity: 0.5 }}
              >
                <circle cx="23" cy="23" r="19" stroke={palette.inkSoft} strokeWidth="1.2" />
                <circle cx="23" cy="23" r="14.5" stroke={palette.inkSoft} strokeWidth="0.7" />
                <path d="M46 14 Q52 10 58 14 T70 14" stroke={palette.inkSoft} strokeWidth="1" />
                <path d="M46 22 Q52 18 58 22 T70 22" stroke={palette.inkSoft} strokeWidth="1" />
                <path d="M46 30 Q52 26 58 30 T70 30" stroke={palette.inkSoft} strokeWidth="1" />
              </svg>
              {/* İade adresi: çift monogramı, sol üst */}
              <span
                aria-hidden
                className="absolute left-5 top-5"
                style={{
                  fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
                  fontSize: 19,
                  color: palette.inkSoft,
                  opacity: 0.85,
                }}
              >
                {data.monogram}
              </span>

              {/* Adres bloğu */}
              <span className="absolute inset-x-6 top-1/2 block -translate-y-1/2 text-center">
                <span
                  className="block text-[11px] uppercase"
                  style={{ color: palette.inkSoft, letterSpacing: "0.42em", fontWeight: 500 }}
                >
                  {str.ceremony.dear}
                </span>
                <span
                  className="mt-2 block"
                  style={{
                    fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
                    fontSize: "clamp(26px, 7vw, 38px)",
                    color: palette.ink,
                    lineHeight: 1.2,
                  }}
                >
                  {guest ?? str.ceremony.guestFallback}
                </span>
                <span
                  aria-hidden
                  className="mx-auto mt-3 block h-px w-24"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${palette.accent}80, transparent)`,
                  }}
                />
              </span>

              {/* İpucu */}
              <motion.span
                className="absolute inset-x-0 bottom-4 block text-center text-[9.5px] uppercase"
                style={{ color: palette.inkSoft, letterSpacing: "0.4em" }}
                animate={reduced ? undefined : { opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {str.ceremony.tapToOpen}
              </motion.span>
            </button>

            {/* ── ARKA YÜZ: kapak + mum mühür + içinden çıkan kart ── */}
            <div
              className="absolute inset-0 rounded-[6px]"
              style={{
                ...paperSurface,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: `1px solid ${palette.ink}22`,
                boxShadow: `0 30px 60px -24px ${palette.ink}47, 0 6px 16px ${palette.ink}1c`,
              }}
            >
              {/* Davetiye kartı — zarfın içinde BOŞ bekler (üstü cep+mühürle
                  örtülü, yazı koysak çakışır); mühür kırılıp kart yükselirken
                  isimler kartın üstünde belirir — "içinden çıkan sürpriz". */}
              <motion.div
                className="absolute inset-x-[7%] bottom-[8%] top-[14%] flex flex-col items-center justify-center rounded-[3px] px-4 text-center"
                style={{
                  backgroundColor: palette.paper,
                  border: `1px solid ${palette.ink}1c`,
                  boxShadow: `0 -8px 24px -14px ${palette.ink}40`,
                }}
                initial={false}
                animate={opening ? { y: "-38%" } : { y: 0 }}
                transition={{ duration: CARD_S, delay: CRACK_S + 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  className="flex flex-col items-center"
                  initial={false}
                  animate={{ opacity: opening ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: opening ? CRACK_S + 0.45 : 0 }}
                >
                  <span
                    className="text-[9px] uppercase"
                    style={{ color: palette.inkSoft, letterSpacing: "0.4em" }}
                  >
                    {data.eyebrow}
                  </span>
                  <span
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
                      fontSize: "clamp(22px, 6vw, 32px)",
                      color: palette.ink,
                      lineHeight: 1.25,
                    }}
                  >
                    {data.partnerOne} <span style={{ color: palette.accent }}>&</span> {data.partnerTwo}
                  </span>
                  <span
                    className="mt-1.5 font-display"
                    style={{ fontSize: 13, color: palette.inkSoft, letterSpacing: "0.08em" }}
                  >
                    {data.date.day} {data.date.month} {data.date.year}
                  </span>
                </motion.span>
              </motion.div>

              {/* Zarf gövdesinin alt cebi — kartın "içeride" durduğu hissi */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 top-[46%] rounded-b-[6px]"
                style={{
                  ...paperSurface,
                  clipPath: "polygon(0 0, 50% 34%, 100% 0, 100% 100%, 0 100%)",
                  boxShadow: `inset 0 8px 18px -12px ${palette.ink}38`,
                }}
              />

              {/* Kapak — astar deseniyle, tepeden açılır */}
              <motion.div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[52%] rounded-t-[6px]"
                style={{
                  transformOrigin: "top center",
                  transformStyle: "preserve-3d",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backgroundImage: `linear-gradient(180deg, ${palette.paper}f2, ${palette.paper}e0), radial-gradient(circle at 6px 6px, ${palette.accent}42 1.5px, transparent 1.5px)`,
                  backgroundSize: "cover, 22px 22px",
                  borderBottom: `1px solid ${palette.ink}1a`,
                  boxShadow: `inset 0 -2px 6px ${palette.ink}1f`,
                }}
                initial={false}
                animate={opening ? { rotateX: -168 } : { rotateX: 0 }}
                transition={{ duration: FLAP_S, delay: CRACK_S, ease: [0.5, 0.05, 0.35, 1] }}
              />

              {/* Mum mühür — kapak ucunda, dokununca kırılır */}
              <WaxSealCrackable
                monogram={data.monogram}
                palette={palette}
                sealSrc={ceremony?.seal}
                cracked={opening}
                reduced={!!reduced}
                onTap={tapSeal}
              />

              {/* İpucu */}
              <motion.span
                className="absolute inset-x-0 bottom-3 block text-center text-[9.5px] uppercase"
                style={{ color: palette.inkSoft, letterSpacing: "0.38em" }}
                initial={false}
                animate={
                  opening ? { opacity: 0 } : reduced ? { opacity: 0.8 } : { opacity: [0.55, 1, 0.55] }
                }
                transition={opening ? { duration: 0.25 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {str.ceremony.breakSeal}
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Kırılabilir mum mühür — clip-path yarımlar ters yönlere ayrılır ── */
function WaxSealCrackable({
  monogram,
  palette,
  sealSrc,
  cracked,
  reduced,
  onTap,
}: {
  monogram: string;
  palette: ThemeV2Meta["palette"];
  sealSrc?: string;
  cracked: boolean;
  reduced: boolean;
  onTap: () => void;
}) {
  const crack = { duration: CRACK_S, ease: [0.5, 0.05, 0.6, 1] as const };

  const face = (
    <>
      {sealSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sealSrc}
          alt=""
          aria-hidden
          className="h-full w-full object-contain"
          style={{ filter: `drop-shadow(0 6px 14px ${palette.ink}59)` }}
        />
      ) : (
        <span
          aria-hidden
          className="block h-full w-full rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${palette.accent}, color-mix(in srgb, ${palette.accent} 60%, black) 78%)`,
            boxShadow: `0 6px 16px ${palette.ink}4d, inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.28)`,
          }}
        />
      )}
      <span
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontFamily: "var(--font-calligraphy), 'Pinyon Script', cursive",
          fontSize: "clamp(22px, 6vw, 30px)",
          color: sealSrc ? "rgba(70,48,12,0.62)" : palette.paper,
          textShadow: sealSrc
            ? "0 1px 0.5px rgba(255,238,196,0.5)"
            : "0 1px 0 rgba(255,255,255,0.35)",
          lineHeight: 1,
        }}
      >
        {monogram}
      </span>
    </>
  );

  return (
    <motion.button
      type="button"
      onClick={onTap}
      aria-label="Mührü kır"
      className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ width: "clamp(76px, 22vw, 96px)", height: "clamp(76px, 22vw, 96px)" }}
      whileTap={reduced ? undefined : { scale: 1.06 }}
    >
      {/* nefes alan glow — kırılınca söner */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-[-30%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.accent}4d 0%, transparent 70%)`,
        }}
        initial={false}
        animate={
          cracked ? { opacity: 0, scale: 1.35 } : reduced ? { opacity: 0.7 } : { scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }
        }
        transition={cracked ? { duration: 0.3 } : { duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        style={{ clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)" }}
        initial={false}
        animate={cracked && !reduced ? { x: -14, y: 4, rotate: -8, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={crack}
      >
        {face}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 block"
        style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
        initial={false}
        animate={cracked && !reduced ? { x: 14, y: -3, rotate: 7, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={crack}
      >
        {face}
      </motion.span>
    </motion.button>
  );
}
