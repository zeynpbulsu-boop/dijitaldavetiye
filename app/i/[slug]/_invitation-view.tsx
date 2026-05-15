"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Peony,
  RoseVine,
  Eucalyptus,
  Anemone,
  BabysBreath,
  FernFrond,
} from "@/components/ornaments/floral-library";
import type { Invitation, DbLocale } from "@/lib/db/types";
import type { InvitationTheme, Ornament } from "@/lib/templates/themes";
import type { Messages } from "@/lib/i18n/types";
import { RsvpForm } from "./_rsvp-form";
import { SvgFilters } from "./_svg-filters";
import { BackgroundAsset } from "./_background-asset";

/**
 * Public invitation view — entrance ceremony + content.
 *
 * Upgraded for paper-quality (Faz 18.22):
 *   - Linen / paper grain baked into envelope body, flap, and the
 *     inner cards via SVG turbulence overlays at multiple frequencies.
 *   - Spring physics replace cubic-bezier on flap and card slide so
 *     the motion lands like paper, not metal.
 *   - Vellum (translucent gauze) layer floats over the inner card —
 *     fades in slightly after the card settles, giving real depth.
 *   - Multi-stop card shadow: 1px crisp top + 24px soft ambient bottom
 *     reads as a paper sheet sitting on the page, not a flat rect.
 *   - Card edges: 4-5px radius + extremely subtle inset highlight on
 *     top edge (paper sheen).
 */

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const SHARP_EASE = [0.6, 0, 0.4, 1] as const;
// "Vacuum" feel — tiny backwards dip then strong forward acceleration.
// Use for the flap rotation: it leans toward viewer for ~80ms (suction
// pulling it open) before reversing back.
const VACUUM_EASE = [0.7, -0.04, 0.25, 1] as const;
// Card emergence — fast launch, gentle slow-down at the top of the arc.
const RISE_EASE = [0.16, 0.84, 0.24, 1] as const;

// Spring presets — tuned for paper, not rubber.
const PAPER_FLAP = { type: "spring" as const, stiffness: 48, damping: 22, mass: 1.4 };
const PAPER_CARD = { type: "spring" as const, stiffness: 70, damping: 18, mass: 1.2 };

type Stage = "sealed" | "breaking" | "opening" | "opened";

const TAP_HINT: Record<DbLocale, string> = {
  tr: "açmak için dokun",
  en: "tap to open",
  sr: "dodirni da otvoriš",
};

const RSVP_COPY: Record<DbLocale, { headline: string; sub: string }> = {
  tr: {
    headline: "Bizimle olur musun?",
    sub: "Lütfen düğünden 14 gün önce yanıtla.",
  },
  en: {
    headline: "Will you be there?",
    sub: "Kindly reply 14 days before the wedding.",
  },
  sr: {
    headline: "Hoćeš li biti tu?",
    sub: "Molimo odgovorite 14 dana pre svadbe.",
  },
};

/* SVG noise — used as a CSS background-image for paper grain.
   Two intensities: stronger for envelope flap (visible texture),
   softer for the page canvas. */
const PAPER_GRAIN_STRONG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' seed='11'/><feColorMatrix values='0 0 0 0 0.55, 0 0 0 0 0.40, 0 0 0 0 0.28, 0 0 0 0.30 0'/></filter><rect width='320' height='320' filter='url(%23n)'/></svg>\")";

const PAPER_GRAIN_SOFT =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0.55, 0 0 0 0 0.42, 0 0 0 0 0.32, 0 0 0 0.16 0'/></filter><rect width='320' height='320' filter='url(%23n)'/></svg>\")";

export function InvitationView({
  inv,
  theme,
  t,
  dateLine,
  weekday,
  monogram,
}: {
  inv: Invitation;
  theme: InvitationTheme;
  t: Messages;
  dateLine: string | null;
  weekday: string | null;
  monogram: string;
}) {
  const [stage, setStage] = useState<Stage>("sealed");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function fadeInAudio() {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    a.play().catch(() => {});
    let v = 0;
    if (fadeTimer.current) clearInterval(fadeTimer.current);
    fadeTimer.current = setInterval(() => {
      v = Math.min(0.7, v + 0.035);
      a.volume = v;
      if (v >= 0.7 && fadeTimer.current) clearInterval(fadeTimer.current);
    }, 100);
  }

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearInterval(fadeTimer.current);
    };
  }, []);

  function openEnvelope() {
    if (stage !== "sealed") return;
    setStage("breaking");
    fadeInAudio();
    setTimeout(() => setStage("opening"), 700);
    setTimeout(() => setStage("opened"), 2700);
  }

  const opened = stage === "opened";

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      lang={inv.locale}
      style={{ background: theme.bg, color: theme.ink }}
    >
      {/* Hidden SVG filter defs — referenced everywhere via url(#id) */}
      <SvgFilters />

      {/* Page-wide linen grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: PAPER_GRAIN_SOFT,
          backgroundSize: "320px 320px",
          mixBlendMode: "multiply",
          opacity: 0.6,
        }}
      />

      {inv.music_url && (
        <audio ref={audioRef} src={inv.music_url} loop preload="auto" aria-hidden />
      )}

      {/* ── CEREMONY OVERLAY ───────────────────────────────────────── */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            key="ceremony"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: SOFT_EASE }}
            className="fixed inset-0 z-30 flex items-center justify-center px-6"
            style={{ background: theme.bg }}
          >
            {/* Strong canvas grain inside ceremony view */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: PAPER_GRAIN_SOFT,
                backgroundSize: "320px 320px",
                mixBlendMode: "multiply",
                opacity: 0.55,
              }}
            />
            {/* Vignette to focus eye on envelope */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 40%, rgba(43,30,22,0.18) 100%)",
              }}
            />
            <EnvelopeCeremony
              stage={stage}
              theme={theme}
              monogram={monogram}
              tapHint={TAP_HINT[inv.locale]}
              editionLabel={theme.name}
              partner1={inv.partner_one_name || ""}
              partner2={inv.partner_two_name || ""}
              connector={t.hero.phone.and}
              onTap={openEnvelope}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OPENED CONTENT ─────────────────────────────────────────── */}
      <AnimatePresence>
        {opened && (
          <OpenedContent
            inv={inv}
            theme={theme}
            t={t}
            dateLine={dateLine}
            weekday={weekday}
            monogram={monogram}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  ENVELOPE                                                          */
/* ────────────────────────────────────────────────────────────────── */

function EnvelopeCeremony({
  stage,
  theme,
  monogram,
  tapHint,
  editionLabel,
  partner1,
  partner2,
  connector,
  onTap,
}: {
  stage: Stage;
  theme: InvitationTheme;
  monogram: string;
  tapHint: string;
  editionLabel: string;
  partner1: string;
  partner2: string;
  connector: string;
  onTap: () => void;
}) {
  const opening = stage === "opening" || stage === "opened";
  const breaking = stage === "breaking";

  // Paper tones — body slightly darker than flap, both warmer than canvas
  const envBody = theme.isDark ? "#3A2820" : "#EFE1CE";
  const envFlap = theme.isDark ? "#48342A" : "#E4D2B9";
  const cardSheet = theme.isDark ? "#1F1410" : "#FAF1E5";
  const cardEdge = theme.isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(255,255,255,0.65)";

  return (
    <div
      style={{
        width: "min(360px, 86vw)",
        aspectRatio: "5/7",
        perspective: "1600px",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Aura glow behind */}
      <div
        aria-hidden
        className="absolute inset-[-56px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${theme.accent}1f 0%, transparent 65%)`,
          filter: "blur(48px)",
        }}
      />

      {/* ── Envelope back/body — paper-textured ──────────────────── */}
      <div
        className="absolute inset-0 rounded-[5px]"
        style={{
          background: envBody,
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.6) inset, 0 -1px 0 rgba(43,30,22,0.08) inset, 0 36px 60px -22px rgba(43,30,22,0.45), 0 10px 22px -8px rgba(43,30,22,0.28), 0 2px 4px -1px rgba(43,30,22,0.18)",
        }}
      >
        {/* Paper grain overlay */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-[5px]"
          style={{
            backgroundImage: PAPER_GRAIN_STRONG,
            backgroundSize: "300px 300px",
            mixBlendMode: "multiply",
            opacity: 0.75,
          }}
        />
        {/* Soft envelope fold lines */}
        <svg
          viewBox="0 0 100 140"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <path
            d="M0 60 L50 100 L100 60"
            stroke={theme.ink}
            strokeOpacity="0.10"
            strokeWidth="0.35"
            fill="none"
          />
          <path
            d="M0 0 L50 60 L100 0"
            stroke={theme.ink}
            strokeOpacity="0.12"
            strokeWidth="0.35"
            fill="none"
          />
        </svg>
      </div>

      {/* ── INNER CARD — slides up out of envelope with overshoot ── */}
      <motion.div
        initial={{ y: "4%", opacity: 0 }}
        animate={
          opening
            ? { y: ["3%", "-9%", "-7%"], opacity: [0, 1, 1] }
            : { y: "4%", opacity: 0 }
        }
        transition={
          opening
            ? {
                duration: 1.6,
                delay: 0.65,
                times: [0, 0.82, 1],
                ease: RISE_EASE,
              }
            : { duration: 0.4 }
        }
        className="absolute inset-x-3 top-3 bottom-3 overflow-hidden rounded-[4px]"
        style={{
          background: cardSheet,
          boxShadow:
            "0 1px 0 " +
            cardEdge +
            " inset, 0 -1px 1px rgba(43,30,22,0.06) inset, 0 1px 2px rgba(43,30,22,0.10), 0 22px 36px -16px rgba(43,30,22,0.30), 0 6px 12px -4px rgba(43,30,22,0.16)",
        }}
      >
        {/* Card paper grain */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: PAPER_GRAIN_STRONG,
            backgroundSize: "260px 260px",
            mixBlendMode: "multiply",
            opacity: 0.55,
          }}
        />

        {/* Vellum overlay — translucent gauze layer with the names printed */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={opening ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={opening ? { ...PAPER_CARD, delay: 1.15 } : { duration: 0.3 }}
          className="absolute inset-2 flex flex-col items-center justify-center rounded-[3px] px-5 text-center"
          style={{
            background: theme.isDark
              ? "rgba(58,40,32,0.45)"
              : "rgba(250,241,229,0.55)",
            backdropFilter: "blur(0.4px)",
            boxShadow:
              "0 1px 0 " +
              cardEdge +
              " inset, 0 8px 18px -8px rgba(43,30,22,0.20)",
          }}
        >
          {/* Vellum's own subtle grain */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[3px]"
            style={{
              backgroundImage: PAPER_GRAIN_SOFT,
              backgroundSize: "240px 240px",
              mixBlendMode: "multiply",
              opacity: 0.35,
            }}
          />
          <span
            className="relative text-[8.5px] font-semibold uppercase"
            style={{ color: theme.accent, letterSpacing: "0.38em" }}
          >
            NUVE · {editionLabel}
          </span>
          <div
            className="relative my-5 h-px w-10"
            style={{ background: theme.ruleColor }}
          />
          <p
            className="relative font-display font-light"
            style={{
              color: theme.ink,
              fontSize: "26px",
              lineHeight: 1.05,
              letterSpacing: "0.045em",
            }}
          >
            {partner1 || "—"}
          </p>
          <p
            className="relative my-3 font-display italic"
            style={{
              color: theme.accent,
              fontSize: "15px",
              lineHeight: 1,
              letterSpacing: "0.05em",
            }}
          >
            {connector}
          </p>
          <p
            className="relative font-display font-light"
            style={{
              color: theme.ink,
              fontSize: "26px",
              lineHeight: 1.05,
              letterSpacing: "0.045em",
            }}
          >
            {partner2 || "—"}
          </p>
        </motion.div>
      </motion.div>

      {/* ── FLAP — vacuum dip then rotates back, paper-textured both faces ── */}
      <motion.div
        initial={{ rotateX: 0 }}
        animate={
          opening ? { rotateX: [0, 4, -180] } : { rotateX: 0 }
        }
        transition={
          opening
            ? {
                duration: 1.3,
                times: [0, 0.06, 1],
                ease: VACUUM_EASE,
              }
            : { duration: 0.4 }
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "62%",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face of flap (visible when closed) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: envFlap,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            boxShadow: "inset 0 -20px 28px -18px rgba(43,30,22,0.25)",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundImage: PAPER_GRAIN_STRONG,
              backgroundSize: "300px 300px",
              mixBlendMode: "multiply",
              opacity: 0.7,
            }}
          />
          {/* Subtle gradient on flap — top lit, bottom darker */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 30%, rgba(43,30,22,0.08) 100%)",
            }}
          />
        </div>

        {/* Back face of flap (visible after flip — inside of envelope) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
            background: envBody,
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundImage: PAPER_GRAIN_STRONG,
              backgroundSize: "300px 300px",
              mixBlendMode: "multiply",
              opacity: 0.7,
            }}
          />
        </div>
      </motion.div>

      {/* ── WAX SEAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {stage === "sealed" && (
          <motion.button
            key="seal-whole"
            type="button"
            onClick={onTap}
            aria-label={tapHint}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: [1, 1.035, 1],
              transition: {
                opacity: { duration: 0.9, ease: SOFT_EASE },
                scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
              },
            }}
            exit={{ opacity: 0 }}
            className="group absolute left-1/2 top-[55%] flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle at 35% 30%, ${theme.accent}, ${theme.monogramFill} 60%, ${theme.monogramFill}aa 100%)`,
              color: theme.monogramText,
              boxShadow: `0 14px 28px -8px ${theme.accent}88, 0 2px 4px rgba(43,30,22,0.20), inset 0 1px 1px rgba(255,255,255,0.20), inset 0 -2px 4px rgba(0,0,0,0.25)`,
            }}
          >
            {/* Wax surface grain */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                backgroundImage: PAPER_GRAIN_STRONG,
                backgroundSize: "100px 100px",
                mixBlendMode: "overlay",
                opacity: 0.45,
              }}
            />
            <span
              aria-hidden
              className="absolute h-[68px] w-[68px] rounded-full"
              style={{ border: `1px dashed ${theme.monogramText}55` }}
            />
            {/* Champagne-gold halo ring — animated foil sweep */}
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              className="pointer-events-none absolute"
              style={{ inset: -6, width: "calc(100% + 12px)", height: "calc(100% + 12px)" }}
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#wax-champagne)"
                strokeWidth="1.4"
                strokeOpacity="0.85"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#wax-champagne)"
                strokeWidth="0.5"
                strokeOpacity="0.55"
                strokeDasharray="0.5 2.2"
              />
            </svg>
            <span
              className="relative font-display italic"
              style={{
                fontSize: "30px",
                lineHeight: 1,
                letterSpacing: "0.01em",
                textShadow: "0 1px 2px rgba(0,0,0,0.25)",
              }}
            >
              {monogram}
            </span>
          </motion.button>
        )}

        {breaking && (
          <BreakingSeal key="seal-broken" theme={theme} monogram={monogram} />
        )}
      </AnimatePresence>

      {/* Tap hint */}
      <AnimatePresence>
        {stage === "sealed" && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 1.6, ease: SOFT_EASE }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="block whitespace-nowrap text-[10px] uppercase"
              style={{
                color: theme.inkSoft,
                letterSpacing: "0.46em",
              }}
            >
              {tapHint}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  Wax seal cracking                                                 */
/* ────────────────────────────────────────────────────────────────── */

function BreakingSeal({
  theme,
  monogram,
}: {
  theme: InvitationTheme;
  monogram: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[55%] flex h-[88px] w-[88px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <motion.div
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{ x: -54, y: 24, rotate: -15, opacity: 0 }}
        transition={{ duration: 0.75, ease: SHARP_EASE }}
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
          background: `radial-gradient(circle at 30% 30%, ${theme.accent}, ${theme.monogramFill})`,
          boxShadow: `0 6px 12px -4px ${theme.accent}66`,
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center font-display italic"
          style={{ color: theme.monogramText, fontSize: "30px" }}
        >
          {monogram}
        </span>
      </motion.div>

      <motion.div
        initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
        animate={{ x: 54, y: 24, rotate: 15, opacity: 0 }}
        transition={{ duration: 0.75, ease: SHARP_EASE }}
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)",
          background: `radial-gradient(circle at 70% 30%, ${theme.accent}, ${theme.monogramFill})`,
          boxShadow: `0 6px 12px -4px ${theme.accent}66`,
        }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center font-display italic"
          style={{ color: theme.monogramText, fontSize: "30px" }}
        >
          {monogram}
        </span>
      </motion.div>

      <motion.span
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: [0, 1, 0] }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute h-full w-[1.5px]"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${theme.monogramText} 50%, transparent 100%)`,
        }}
      />

      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 0, scale: 1 }}
          animate={{
            x: (i - 3.5) * 14,
            y: 64 + i * 3,
            opacity: [0, 1, 0],
            scale: 0.6,
          }}
          transition={{
            duration: 0.9,
            delay: 0.18 + i * 0.04,
            ease: "easeIn",
          }}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ background: theme.monogramFill }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/*  OPENED CONTENT                                                    */
/* ────────────────────────────────────────────────────────────────── */

function OpenedContent({
  inv,
  theme,
  t,
  dateLine,
  weekday,
  monogram,
}: {
  inv: Invitation;
  theme: InvitationTheme;
  t: Messages;
  dateLine: string | null;
  weekday: string | null;
  monogram: string;
}) {
  const labels = RSVP_COPY[inv.locale];
  const PrimaryMotif = motifFor(theme.ornament, "primary");
  const SecondaryMotif = motifFor(theme.ornament, "secondary");

  const { scrollY } = useScroll();
  const primaryY = useTransform(scrollY, [0, 800], [0, -120]);
  const secondaryY = useTransform(scrollY, [0, 800], [0, 60]);

  return (
    <motion.div
      key="opened"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0, ease: SOFT_EASE }}
      className="relative z-10"
    >
      {/* User-supplied watercolor background — sits behind everything.
          Silently hides if no file at /illustrations/[slug]/hero.{jpg|png|webp} */}
      <BackgroundAsset templateSlug={inv.template_slug} opacity={0.55} />

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: theme.ornamentOpacity }}
        transition={{ duration: 2.0, delay: 0.2, ease: SOFT_EASE }}
        style={{
          position: "absolute",
          top: -140,
          left: -130,
          y: primaryY,
          mixBlendMode: "multiply",
          filter: "url(#wc-edge)",
        }}
        className="pointer-events-none z-0"
      >
        <PrimaryMotif size={520} opacity={1} />
      </motion.div>

      {/* Soft wash layer — same motif underneath with heavy displacement
          for the "pigment bleed" backdrop. Sits below the edge layer. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: theme.ornamentOpacity * 0.42 }}
        transition={{ duration: 2.2, delay: 0.3, ease: SOFT_EASE }}
        style={{
          position: "absolute",
          top: -160,
          left: -150,
          y: primaryY,
          mixBlendMode: "multiply",
          filter: "url(#wc-wash)",
        }}
        className="pointer-events-none z-0"
      >
        <PrimaryMotif size={560} opacity={1} />
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: theme.ornamentOpacity * 0.65 }}
        transition={{ duration: 2.0, delay: 0.5, ease: SOFT_EASE }}
        style={{
          position: "absolute",
          bottom: -60,
          right: -50,
          y: secondaryY,
          mixBlendMode: "multiply",
          filter: "url(#wc-edge)",
        }}
        className="pointer-events-none z-0"
      >
        <SecondaryMotif size={220} opacity={1} flip />
      </motion.div>

      {/* Bokeh drift — 6 soft blurred discs floating slowly */}
      <Bokeh theme={theme} />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${theme.accent}12 0%, transparent 62%)`,
          filter: "blur(40px)",
        }}
      />

      {/* HERO */}
      <section className="relative z-10 px-6 pt-28 pb-32 text-center sm:pt-36 lg:pt-44 lg:pb-44">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.4, ease: SOFT_EASE }}
          className="inline-block text-[10px] font-semibold uppercase"
          style={{ color: theme.accent, letterSpacing: "0.46em" }}
        >
          NUVE &nbsp;·&nbsp; {theme.name}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...PAPER_CARD, delay: 0.7 }}
          className="mx-auto mt-16 mb-20 flex h-24 w-24 items-center justify-center rounded-full lg:h-28 lg:w-28"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${theme.accent}, ${theme.monogramFill} 60%, ${theme.monogramFill}cc 100%)`,
            boxShadow: `0 16px 32px -10px ${theme.accent}55, inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.18)`,
          }}
        >
          <span
            className="font-display italic"
            style={{
              fontSize: "38px",
              lineHeight: 1,
              letterSpacing: "0.01em",
              color: theme.monogramText,
              textShadow: "0 1px 2px rgba(0,0,0,0.18)",
            }}
          >
            {monogram}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.2, ease: SOFT_EASE }}
          className="font-display font-light"
          style={{
            color: theme.ink,
            fontSize: "clamp(38px, 5.5vw, 76px)",
            lineHeight: 1.05,
            letterSpacing: "0.045em",
          }}
        >
          {inv.partner_one_name || "—"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 1.5, ease: SOFT_EASE }}
          className="my-6 font-display italic lg:my-7"
          style={{
            color: theme.accent,
            fontSize: "clamp(20px, 2.2vw, 30px)",
            lineHeight: 1,
            letterSpacing: "0.05em",
          }}
        >
          {t.hero.phone.and}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.8, ease: SOFT_EASE }}
          className="font-display font-light"
          style={{
            color: theme.ink,
            fontSize: "clamp(38px, 5.5vw, 76px)",
            lineHeight: 1.05,
            letterSpacing: "0.045em",
          }}
        >
          {inv.partner_two_name || "—"}
        </motion.h1>

        {dateLine && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 2.3, ease: SOFT_EASE }}
            className="mt-20 inline-flex flex-col items-center gap-3 lg:mt-24"
          >
            <div className="flex items-center gap-5">
              <span aria-hidden className="h-px w-14" style={{ background: theme.ruleColor }} />
              <span
                className="font-display"
                style={{
                  color: theme.ink,
                  fontSize: "clamp(14px, 1.5vw, 18px)",
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                }}
              >
                {dateLine}
              </span>
              <span aria-hidden className="h-px w-14" style={{ background: theme.ruleColor }} />
            </div>
            {weekday && (
              <span
                className="text-[10px]"
                style={{
                  color: theme.inkSoft,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                }}
              >
                {weekday}
              </span>
            )}
          </motion.div>
        )}

        {inv.wedding_date && (
          <Countdown
            targetIso={inv.wedding_date + "T18:00:00"}
            locale={inv.locale}
            theme={theme}
          />
        )}

        {(inv.venue_name || inv.venue_city) && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 2.6, ease: SOFT_EASE }}
            className="mx-auto mt-12 max-w-[460px] font-display italic"
            style={{
              color: theme.inkSoft,
              fontSize: "clamp(16px, 1.6vw, 20px)",
              lineHeight: 1.5,
              letterSpacing: "0.04em",
            }}
          >
            {[inv.venue_name, inv.venue_city, inv.venue_address]
              .filter(Boolean)
              .join(" · ")}
          </motion.p>
        )}

        {(inv.venue_address || inv.venue_name) && (
          <MapBlock
            query={[inv.venue_name, inv.venue_city, inv.venue_address]
              .filter(Boolean)
              .join(", ")}
            locale={inv.locale}
            theme={theme}
          />
        )}
      </section>

      <PhotoGallery theme={theme} locale={inv.locale} />

      {inv.story_text && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.4, ease: SOFT_EASE }}
          className="relative z-10 border-y px-6 py-28 lg:py-36"
          style={{ background: theme.storyBg, borderColor: theme.storyBorder }}
        >
          <div className="container-narrow text-center">
            <p
              className="font-display"
              style={{
                color: theme.inkSoft,
                fontSize: "clamp(18px, 2vw, 26px)",
                lineHeight: 1.7,
                letterSpacing: "0.012em",
              }}
            >
              {inv.story_text}
            </p>
          </div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: SOFT_EASE }}
        id="rsvp"
        className="relative z-10 px-6 py-28 lg:py-36"
      >
        <div className="container-narrow">
          <header className="mb-16 text-center lg:mb-20">
            <span
              className="text-[10px] font-semibold uppercase"
              style={{ color: theme.accent, letterSpacing: "0.46em" }}
            >
              — RSVP
            </span>
            <h2
              className="mt-6 font-display font-light"
              style={{
                color: theme.ink,
                fontSize: "clamp(32px, 4.2vw, 54px)",
                lineHeight: 1.1,
                letterSpacing: "0.04em",
              }}
            >
              {labels.headline}
            </h2>
            <p
              className="mt-5 text-[13px]"
              style={{
                color: theme.inkSoft,
                letterSpacing: "0.04em",
                lineHeight: 1.6,
              }}
            >
              {labels.sub}
            </p>
          </header>

          <RsvpForm slug={inv.slug} locale={inv.locale} />
        </div>
      </motion.section>

      <footer
        className="relative z-10 border-t px-6 py-14 text-center"
        style={{ borderColor: theme.storyBorder }}
      >
        <span
          className="font-display italic"
          style={{
            color: theme.inkSoft,
            fontSize: "20px",
            letterSpacing: "0.03em",
          }}
        >
          nuve
          <span style={{ color: theme.footerDot }}>.</span>
        </span>
        <p
          className="mt-3 text-[9.5px]"
          style={{
            color: theme.inkSoft,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
          }}
        >
          {t.footer.rights}
        </p>
      </footer>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────────── */
/*  Bokeh — slow-drifting blurred light discs                         */
/* ────────────────────────────────────────────────────────────────── */

function Bokeh({ theme }: { theme: InvitationTheme }) {
  // Pre-positioned bokeh seeds — sizes / locations chosen for an
  // editorial feel rather than evenly-distributed wallpaper. Each
  // disc drifts on its own slow loop via inline keyframes.
  const seeds = [
    { left: "8%",  top: "12%", size: 140, dur: 22, delay: 0,  drift: 18 },
    { left: "72%", top: "18%", size: 90,  dur: 18, delay: 3,  drift: -14 },
    { left: "25%", top: "55%", size: 110, dur: 26, delay: 6,  drift: 22 },
    { left: "82%", top: "62%", size: 75,  dur: 20, delay: 2,  drift: -10 },
    { left: "12%", top: "85%", size: 95,  dur: 24, delay: 8,  drift: 14 },
    { left: "60%", top: "92%", size: 130, dur: 28, delay: 5,  drift: -18 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {seeds.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.accent}24 0%, ${theme.accent}10 40%, transparent 70%)`,
            filter: "blur(18px)",
            animation: `bokeh-${i} ${s.dur}s ease-in-out ${s.delay}s infinite alternate`,
            mixBlendMode: "screen",
          }}
        />
      ))}

      <style>{`
        ${seeds
          .map(
            (s, i) => `
            @keyframes bokeh-${i} {
              0%   { transform: translate(0, 0) scale(1); opacity: 0.5; }
              50%  { transform: translate(${s.drift}px, ${-s.drift / 1.4}px) scale(1.08); opacity: 0.9; }
              100% { transform: translate(${-s.drift / 1.6}px, ${s.drift * 0.8}px) scale(0.96); opacity: 0.6; }
            }
          `,
          )
          .join("")}
        @media (prefers-reduced-motion: reduce) {
          ${seeds.map((_, i) => `[style*="bokeh-${i}"] { animation: none !important; }`).join("")}
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────── */

function motifFor(o: Ornament, position: "primary" | "secondary") {
  if (o === "none") {
    const Empty = () => null;
    return Empty;
  }
  if (position === "primary") {
    switch (o) {
      case "peony": return Peony;
      case "rose-vine": return RoseVine;
      case "eucalyptus": return Eucalyptus;
      case "anemone": return Anemone;
      case "babys-breath": return BabysBreath;
      case "fern": return FernFrond;
    }
  }
  switch (o) {
    case "peony": return Eucalyptus;
    case "rose-vine": return RoseVine;
    case "eucalyptus": return BabysBreath;
    case "anemone": return Eucalyptus;
    case "babys-breath": return BabysBreath;
    case "fern": return Eucalyptus;
    default: return Eucalyptus;
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* Countdown — live ticking days/hours/minutes/seconds to event. */

const COUNTDOWN_LABELS: Record<DbLocale, { d: string; h: string; m: string; s: string; eyebrow: string }> = {
  tr: { d: "Gün", h: "Saat", m: "Dakika", s: "Saniye", eyebrow: "— O güne kadar" },
  en: { d: "Days", h: "Hours", m: "Minutes", s: "Seconds", eyebrow: "— Until the day" },
  sr: { d: "Dana", h: "Sata", m: "Minuta", s: "Sekundi", eyebrow: "— Do dana svadbe" },
};

function Countdown({
  targetIso,
  locale,
  theme,
}: {
  targetIso: string;
  locale: DbLocale;
  theme: InvitationTheme;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const L = COUNTDOWN_LABELS[locale];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 2.4, ease: SOFT_EASE }}
      className="mx-auto mt-14"
      style={{ maxWidth: 620 }}
    >
      <p
        className="text-center text-[10px] font-semibold uppercase"
        style={{ color: theme.accent, letterSpacing: "0.4em" }}
      >
        {L.eyebrow}
      </p>
      <div className="mt-6 grid grid-cols-4 items-baseline gap-2 sm:gap-4">
        {[
          { v: days, l: L.d },
          { v: hours, l: L.h },
          { v: minutes, l: L.m },
          { v: seconds, l: L.s },
        ].map((cell, i) => (
          <div key={i} className="relative text-center">
            <span
              className="block font-display tabular-nums"
              style={{
                color: theme.ink,
                fontSize: "clamp(34px, 5.5vw, 64px)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              {String(cell.v).padStart(2, "0")}
            </span>
            <span
              className="mt-3 block text-[9px] font-semibold uppercase"
              style={{ color: theme.inkSoft, letterSpacing: "0.34em" }}
            >
              {cell.l}
            </span>
            {i < 3 && (
              <span
                aria-hidden
                className="absolute right-[-2px] top-[18%] hidden text-[28px] font-display sm:block"
                style={{ color: theme.spark, opacity: 0.35 }}
              >
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* MapBlock — OpenStreetMap static embed via iframe (privacy-respecting,
   no API key needed). Hidden if no venue info. */

const MAP_LABELS: Record<DbLocale, { eyebrow: string; cta: string }> = {
  tr: { eyebrow: "— Konum", cta: "Yol tarifi al" },
  en: { eyebrow: "— Location", cta: "Get directions" },
  sr: { eyebrow: "— Lokacija", cta: "Uputstvo do mesta" },
};

function MapBlock({
  query,
  locale,
  theme,
}: {
  query: string;
  locale: DbLocale;
  theme: InvitationTheme;
}) {
  const M = MAP_LABELS[locale];
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  // OpenStreetMap embed centered on Istanbul as a default — pin requires
  // geocoding which we don't do client-side. The CTA button opens
  // Google Maps for actual navigation.
  const osmEmbed =
    "https://www.openstreetmap.org/export/embed.html?bbox=28.92%2C40.99%2C29.10%2C41.07&layer=mapnik";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, ease: SOFT_EASE }}
      className="mx-auto mt-20 w-full"
      style={{ maxWidth: 720 }}
    >
      <p
        className="text-center text-[10px] font-semibold uppercase"
        style={{ color: theme.accent, letterSpacing: "0.4em" }}
      >
        {M.eyebrow}
      </p>
      <div
        className="mt-6 overflow-hidden"
        style={{
          border: `1px solid ${theme.storyBorder}`,
          borderRadius: 4,
        }}
      >
        <iframe
          title="map"
          src={osmEmbed}
          aria-label="map"
          loading="lazy"
          style={{
            display: "block",
            width: "100%",
            height: 280,
            border: 0,
            filter: "saturate(0.78) sepia(0.04)",
          }}
        />
      </div>
      <div className="mt-5 text-center">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase underline-offset-4 hover:underline"
          style={{ color: theme.accent, letterSpacing: "0.28em" }}
        >
          {M.cta} →
        </a>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────── */
/* PhotoGallery — placeholder grid. Owner uploads not wired yet, so we
   show 6 elegant blank tiles tinted by the theme. When the editor
   gets upload support, swap the array for inv.gallery_urls. */

const GALLERY_LABELS: Record<DbLocale, { eyebrow: string; headline: string; sub: string }> = {
  tr: {
    eyebrow: "— Anılar",
    headline: "Birlikte yaşanan anlar.",
    sub: "Galeri yakında — kendi fotoğraflarınla bu kareleri doldur.",
  },
  en: {
    eyebrow: "— Memories",
    headline: "Moments that brought us here.",
    sub: "Gallery coming soon — replace these frames with your own.",
  },
  sr: {
    eyebrow: "— Uspomene",
    headline: "Trenuci koji su nas doveli ovde.",
    sub: "Galerija uskoro — popunite okvire vašim fotografijama.",
  },
};

function PhotoGallery({
  theme,
  locale,
}: {
  theme: InvitationTheme;
  locale: DbLocale;
}) {
  const G = GALLERY_LABELS[locale];
  // 6 tile positions with subtle parallax offset for organic grid feel
  const tiles = [
    { col: "span 2", row: "span 2", offset: 0 },
    { col: "span 1", row: "span 1", offset: 6 },
    { col: "span 1", row: "span 1", offset: -4 },
    { col: "span 1", row: "span 1", offset: 8 },
    { col: "span 1", row: "span 1", offset: -3 },
    { col: "span 2", row: "span 1", offset: 5 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 1.2, ease: SOFT_EASE }}
      className="relative z-10 px-6 py-24 lg:py-32"
    >
      <div className="container-narrow text-center">
        <p
          className="text-[10px] font-semibold uppercase"
          style={{ color: theme.accent, letterSpacing: "0.42em" }}
        >
          {G.eyebrow}
        </p>
        <h2
          className="mt-6 font-display"
          style={{
            color: theme.ink,
            fontSize: "clamp(28px, 3.6vw, 46px)",
            lineHeight: 1.1,
            letterSpacing: "0.02em",
          }}
        >
          {G.headline}
        </h2>
        <p
          className="mx-auto mt-5 max-w-[480px] text-[13px]"
          style={{ color: theme.inkSoft, lineHeight: 1.65, letterSpacing: "0.02em" }}
        >
          {G.sub}
        </p>

        <div
          className="mx-auto mt-14 grid w-full max-w-[820px] gap-3 sm:gap-4"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "118px",
          }}
        >
          {tiles.map((tile, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.94, y: tile.offset }}
              whileInView={{ opacity: 1, scale: 1, y: tile.offset }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{
                duration: 0.9,
                delay: 0.12 + i * 0.08,
                ease: SOFT_EASE,
              }}
              style={{
                gridColumn: tile.col,
                gridRow: tile.row,
                background: `linear-gradient(135deg, ${theme.storyBg} 0%, ${theme.storyBorder} 100%)`,
                border: `1px solid ${theme.storyBorder}`,
                borderRadius: 3,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Soft script "fotoğraf" placeholder centered */}
              <span
                aria-hidden
                className="absolute inset-0 grid place-items-center font-display italic"
                style={{
                  color: theme.inkSoft,
                  fontSize: "clamp(14px, 1.6vw, 20px)",
                  opacity: 0.32,
                  letterSpacing: "0.04em",
                }}
              >
                {i === 0 ? "ph" : ""}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
