"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { TiltCard } from "@/components/effects/tilt-card";
import { useT } from "@/lib/i18n/provider";
import { TemplateCardArt } from "@/components/decorations/template-art";

/**
 * Template Carousel — horizontal snap rail of portrait cards.
 * Mouse drag + native scroll + touch swipe. Cards: gradient placeholder
 * (no raster assets), template name in italic Cormorant, optional "YENİ"
 * badge. Hover: 1.04 scale + cognac wash overlay.
 *
 * Each card links to /templates/[slug] when the slug exists in the registry
 * — falls back to /#themes anchor for placeholders.
 */
type Card = {
  slug: string;
  name: string;
  category: string;
  /** From → To CSS color stops for the placeholder backdrop. */
  bg: { from: string; to: string };
  /** Ornament accent — small inline SVG drawn over the gradient. */
  ornament: "vine" | "spray" | "wreath" | "ribbon" | "leaf" | "burst";
  isNew?: boolean;
  exists?: boolean;
};

const cards: Card[] = [
  {
    slug: "blush-garden",
    name: "Magnolia",
    category: "Klasik Botanik",
    bg: { from: "#F2EEE6", to: "#E7D9CB" },
    ornament: "leaf",
    isNew: true,
    exists: true,
  },
  {
    slug: "verde-borgogna",
    name: "Mansion Lights",
    category: "Akşam Yalısı",
    bg: { from: "#2B1E16", to: "#5A3A28" },
    ornament: "burst",
    isNew: true,
    exists: true,
  },
  {
    slug: "elegant-ivory",
    name: "Timeless",
    category: "Sade Editöryel",
    bg: { from: "#EFE6DA", to: "#D8C9B7" },
    ornament: "ribbon",
    exists: true,
  },
  {
    slug: "black-ink",
    name: "Modern",
    category: "Minimal Çizgi",
    bg: { from: "#F2EEE6", to: "#C9B9A4" },
    ornament: "spray",
    exists: true,
  },
  {
    slug: "blush-reverie",
    name: "Dream",
    category: "Şefkat Pudra",
    bg: { from: "#F5EDDB", to: "#E0BFAE" },
    ornament: "vine",
    isNew: true,
    exists: true,
  },
  {
    slug: "egee-blue",
    name: "Lavender",
    category: "Kıyı Modern",
    bg: { from: "#EAE2EE", to: "#B8A4C9" },
    ornament: "spray",
    exists: true,
  },
  {
    slug: "olive-grove",
    name: "Botanical",
    category: "Akdeniz Zeytin",
    bg: { from: "#EFEEDD", to: "#A8B596" },
    ornament: "leaf",
    exists: true,
  },
  {
    slug: "bordeaux",
    name: "Atelier Indigo",
    category: "Bordo Akşam",
    bg: { from: "#1F0E0E", to: "#7A2E25" },
    ornament: "burst",
    exists: true,
  },
];

export function TemplateCarousel() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const railRef = useRef<HTMLDivElement>(null);

  // Click-and-drag horizontal pan for desktop.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    const down = (e: MouseEvent) => {
      isDown = true;
      rail.classList.add("cursor-grabbing");
      startX = e.pageX - rail.offsetLeft;
      scrollStart = rail.scrollLeft;
    };
    const up = () => {
      isDown = false;
      rail.classList.remove("cursor-grabbing");
    };
    const move = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - startX) * 1.15;
      rail.scrollLeft = scrollStart - walk;
    };

    rail.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    rail.addEventListener("mousemove", move);
    rail.addEventListener("mouseleave", up);

    return () => {
      rail.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      rail.removeEventListener("mousemove", move);
      rail.removeEventListener("mouseleave", up);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="themes"
      className="relative border-b border-line bg-bg py-24 lg:py-32"
    >
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex items-end justify-between gap-6 border-b border-line pb-6 lg:mb-20"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — {t.carousel.eyebrow}
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-0.025em",
              }}
            >
              {t.carousel.headline_prefix}
              <span className="italic text-brand-cognac">{t.carousel.headline_accent}</span>
              {t.carousel.headline_suffix}
            </h2>
          </div>
          <span className="hidden text-[11px] uppercase tracking-[0.2em] text-brand-mute sm:inline-block">
            {t.carousel.drag_hint}
          </span>
        </motion.div>
      </div>

      {/* Carousel rail — full bleed, drag + snap */}
      <div
        ref={railRef}
        className="no-scrollbar relative flex w-full cursor-grab snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ paddingInline: "max(1.25rem, calc(50vw - 660px))" }}
      >
        <div className="flex gap-5 pb-4 pr-5 lg:gap-7">
          {cards.map((card, i) => (
            <motion.div
              key={card.slug + i}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.85,
                delay: 0.1 + i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="snap-center"
            >
              <TiltCard max={6}>
                <TemplateCard
                  card={card}
                  index={i}
                  categoryLabel={t.carousel.card_categories[i] ?? card.category}
                  newBadge={t.carousel.badge_new}
                  actionLabel={t.carousel.card_action}
                />
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-wide mt-10 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-brand-mute lg:mt-14">
        <span>{t.carousel.bottom_tagline}</span>
        <Link
          href="#themes"
          className="font-medium text-brand-ink underline decoration-brand-mute/40 underline-offset-[6px] transition hover:decoration-brand-cognac hover:text-brand-cognac"
        >
          {t.carousel.bottom_cta}
        </Link>
      </div>
    </section>
  );
}

function TemplateCard({
  card,
  index,
  categoryLabel,
  newBadge,
  actionLabel,
}: {
  card: Card;
  index: number;
  categoryLabel: string;
  newBadge: string;
  actionLabel: string;
}) {
  const href = card.exists ? `/templates/${card.slug}` : "#themes";
  return (
    <Link
      href={href}
      data-cursor="cta"
      aria-label={`${card.name} — ${categoryLabel}`}
      className="group relative block w-[260px] flex-shrink-0 select-none sm:w-[290px] lg:w-[320px]"
    >
      {/* Card frame */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] shadow-[0_1px_2px_rgba(43,30,22,0.08)] transition-shadow duration-500 group-hover:shadow-[0_20px_40px_-12px_rgba(43,30,22,0.25)]">
        {/* Gradient placeholder backdrop */}
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          style={{
            background: `linear-gradient(155deg, ${card.bg.from} 0%, ${card.bg.to} 100%)`,
          }}
        />

        {/* Bespoke per-slug art preview — matches the full TemplateDecorations
            layer that renders on /i/[slug]. So a Magnolia card actually shows
            magnolia flowers, Mansion Lights shows a chandelier, etc.
            Sits in front of the gradient + monogram so the bespoke motif is
            unmistakable at a glance. Dark backdrops swap to a luminous palette. */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            parseInt(card.bg.from.slice(1), 16) < 0x808080 ? "" : "mix-blend-multiply"
          }`}
        >
          <TemplateCardArt
            slug={card.slug}
            dark={parseInt(card.bg.from.slice(1), 16) < 0x808080}
          />
        </div>

        {/* Cognac wash on hover */}
        <div className="absolute inset-0 bg-brand-cognac/0 transition-colors duration-500 group-hover:bg-brand-cognac/15" />

        {/* Vertical edge label */}
        <span className="absolute left-3 top-3 text-[9px] font-medium uppercase tracking-[0.3em] text-brand-ink/45">
          NUVE · ED. № {String(index + 1).padStart(2, "0")}
        </span>

        {/* New-badge — localised */}
        {card.isNew && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand-cognac px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-cream">
            <span className="block h-1 w-1 rounded-full bg-brand-cream/80" />
            {newBadge}
          </span>
        )}

        {/* Center monogram — italic N (subtle, lets the bespoke art breathe) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="font-display italic"
            style={{
              fontSize: "clamp(90px, 14vw, 140px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: card.bg.from.toLowerCase().startsWith("#1") || card.bg.from.toLowerCase().startsWith("#2")
                ? "rgba(245, 232, 217, 0.22)"
                : "rgba(43, 30, 22, 0.10)",
            }}
            aria-hidden
          >
            N
          </span>
        </div>

        {/* Bottom name plate */}
        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
          <div className="rounded-[3px] bg-brand-cream/85 px-3.5 py-3 backdrop-blur-[2px]">
            <p
              className="font-display text-brand-ink"
              style={{
                fontSize: "22px",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              {card.name}
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-brand-mute">
              {categoryLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Underline detail on hover */}
      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-brand-mute">
        <span>{actionLabel}</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}

/**
 * Small abstract ornaments — purely decorative, no copy or branding.
 * Drawn at card-center scale; kept airy and subtle.
 */
function CardOrnament({ motif }: { motif: Card["ornament"] }) {
  const stroke = "rgba(43, 30, 22, 0.22)";
  const accent = "rgba(140, 90, 60, 0.55)";

  if (motif === "leaf") {
    return (
      <svg viewBox="0 0 200 260" className="h-[78%] w-auto">
        <g fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round">
          <path d="M100 30 Q100 130 100 230" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <path
                d={`M100 ${50 + i * 22} Q ${70 - (i % 2) * 10} ${60 + i * 22}, ${50 + (i % 2) * 6} ${70 + i * 22}`}
              />
              <path
                d={`M100 ${50 + i * 22} Q ${130 + (i % 2) * 10} ${60 + i * 22}, ${150 - (i % 2) * 6} ${70 + i * 22}`}
              />
            </g>
          ))}
        </g>
      </svg>
    );
  }

  if (motif === "vine") {
    return (
      <svg viewBox="0 0 220 260" className="h-[80%] w-auto">
        <g fill="none" stroke={stroke} strokeWidth="1">
          <path
            d="M40 30 Q 120 80, 90 130 T 150 230"
            strokeLinecap="round"
          />
          {[60, 95, 130, 170, 210].map((y, i) => (
            <g key={i} stroke={accent}>
              <circle cx={i % 2 === 0 ? 80 : 130} cy={y} r="6" fill="none" />
              <circle cx={i % 2 === 0 ? 80 : 130} cy={y} r="2" fill={accent} />
            </g>
          ))}
        </g>
      </svg>
    );
  }

  if (motif === "wreath") {
    return (
      <svg viewBox="0 0 220 260" className="h-[78%] w-auto">
        <g fill="none" stroke={stroke} strokeWidth="1">
          <ellipse cx="110" cy="130" rx="78" ry="98" />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const cx = 110 + Math.cos(a) * 78;
            const cy = 130 + Math.sin(a) * 98;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r="4"
                fill={i % 3 === 0 ? accent : "none"}
                stroke={stroke}
              />
            );
          })}
        </g>
      </svg>
    );
  }

  if (motif === "ribbon") {
    return (
      <svg viewBox="0 0 220 60" className="w-[78%]">
        <g fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round">
          <path d="M10 30 Q 60 0, 110 30 T 210 30" />
          <path d="M10 30 Q 60 60, 110 30 T 210 30" strokeOpacity="0.5" />
        </g>
      </svg>
    );
  }

  if (motif === "burst") {
    return (
      <svg viewBox="0 0 200 200" className="h-[72%] w-auto">
        <g fill="none" stroke="rgba(242, 238, 230, 0.35)" strokeWidth="0.8">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={100 + Math.cos(a) * 30}
                y1={100 + Math.sin(a) * 30}
                x2={100 + Math.cos(a) * 86}
                y2={100 + Math.sin(a) * 86}
              />
            );
          })}
          <circle cx="100" cy="100" r="22" stroke="rgba(242, 238, 230, 0.5)" />
        </g>
      </svg>
    );
  }

  // spray
  return (
    <svg viewBox="0 0 200 260" className="h-[78%] w-auto">
      <g fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round">
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = -40 + i * 10;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1="100"
              y1="230"
              x2={100 + Math.sin(rad) * 180}
              y2={230 - Math.cos(rad) * 180}
            />
          );
        })}
        {[60, 90, 120].map((y, i) => (
          <circle
            key={i}
            cx={i % 2 ? 130 : 80}
            cy={y}
            r="3"
            fill={accent}
            stroke="none"
          />
        ))}
      </g>
    </svg>
  );
}
