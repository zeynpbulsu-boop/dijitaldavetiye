"use client";

/**
 * EditionCardTile — TemplateCarousel + /tasarimlar arasında paylaşılan
 * tek kart component'i. PR #18 ile çıkartıldı; çift kullanım için DRY.
 *
 * Inspirations:
 * - Pressed Love: full-bleed scene, frosted bottom band, vibe chip
 * - The Digital Invite: "View demo" pill her kartta açıkça görünür
 * - bizevleniyoruz.net: "EN SEVİLEN" / "YENİ" rosette + numaralandırma
 */

import Link from "next/link";
import Image from "next/image";
import { TiltCard } from "@/components/effects/tilt-card";
import type { EditionCard } from "@/lib/templates/edition-cards";

interface Props {
  card: EditionCard;
  /** Carousel: w-[280px] sm:w-[320px] lg:w-[380px]; Grid: full width. */
  className?: string;
  /** Carousel'da snap + flex-shrink-0 gerek. */
  isCarouselSlide?: boolean;
}

export function EditionCardTile({
  card,
  className = "",
  isCarouselSlide = false,
}: Props) {
  return (
    <Link
      href={`/dev-preview/${card.slug}`}
      className={`group block ${
        isCarouselSlide
          ? "w-[280px] flex-shrink-0 snap-start sm:w-[320px] lg:w-[380px]"
          : "w-full"
      } ${className}`}
      aria-label={`${card.name} — ${card.shortDescription}`}
    >
      <TiltCard max={6}>
        <article
          className="relative aspect-[3/4] overflow-hidden rounded-md shadow-ed-md transition-shadow group-hover:shadow-ed-lg"
          style={{
            background: `linear-gradient(155deg, ${card.bg.from} 0%, ${card.bg.to} 100%)`,
          }}
        >
          {/* Full-bleed sahne */}
          <div className="absolute inset-0">
            <Image
              src={card.coverScene}
              alt=""
              fill
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 380px"
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* Soft radial overlay (mühür + alt etiket okunabilir kalsın) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: card.isDark
                ? "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.32) 100%)"
                : "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.40) 100%)",
            }}
          />

          {/* Üst sol: kart numarası + NUVE wordmark */}
          <div className="absolute left-4 top-4 flex flex-col gap-1.5">
            <span
              className="font-display"
              style={{
                fontSize: 22,
                lineHeight: 1,
                color: card.isDark
                  ? "rgba(246, 241, 234, 0.92)"
                  : "rgba(31, 27, 23, 0.82)",
                textShadow: card.isDark
                  ? "0 1px 3px rgba(0,0,0,0.5)"
                  : "0 1px 2px rgba(255,255,255,0.65)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
              }}
            >
              {card.number}
            </span>
            <span
              className="text-[9px] uppercase"
              style={{
                color: card.isDark
                  ? "rgba(246, 241, 234, 0.7)"
                  : "rgba(31, 27, 23, 0.6)",
                letterSpacing: "0.36em",
                fontWeight: 500,
                textShadow: card.isDark
                  ? "0 1px 2px rgba(0,0,0,0.4)"
                  : "0 1px 2px rgba(255,255,255,0.6)",
              }}
            >
              NUVE
            </span>
          </div>

          {/* Üst sağ: vibe chip + rozetler */}
          <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em]"
              style={{
                background: card.isDark
                  ? "rgba(246, 241, 234, 0.18)"
                  : "rgba(255, 255, 255, 0.78)",
                color: card.isDark
                  ? "rgba(246, 241, 234, 0.95)"
                  : "rgba(31, 27, 23, 0.82)",
                backdropFilter: "blur(8px)",
                border: card.isDark
                  ? "0.5px solid rgba(255,255,255,0.22)"
                  : "0.5px solid rgba(31,27,23,0.08)",
              }}
            >
              {card.vibe}
            </span>
            {card.isPopular && (
              <span className="rounded-full bg-amber-600/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-paper shadow-sm">
                ★ En sevilen
              </span>
            )}
            {card.isNew && !card.isPopular && (
              <span className="rounded-full bg-emerald-700/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-paper shadow-sm">
                Yeni
              </span>
            )}
          </div>

          {/* Wax seal — sahne üzerinde merkez */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[52%] w-[52%] transition-transform duration-500 group-hover:scale-105">
              <Image
                src={card.seal}
                alt={`${card.name} mührü`}
                fill
                sizes="(max-width: 640px) 50vw, 200px"
                style={{
                  objectFit: "contain",
                  filter:
                    "drop-shadow(0 22px 36px rgba(20, 20, 20, 0.4))",
                }}
              />
            </div>
          </div>

          {/* "Demoyu gör →" pill — TDI paritesi.
              Default: küçük yarı saydam, hover'da büyür + cognac wash. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[58%] -translate-x-1/2 rounded-full px-4 py-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] opacity-0 transition-all duration-300 group-hover:opacity-100"
            style={{
              background: "rgba(31, 27, 23, 0.85)",
              color: "#F6F1EA",
              backdropFilter: "blur(6px)",
              border: "0.5px solid rgba(246, 241, 234, 0.22)",
            }}
          >
            Demoyu gör →
          </span>

          {/* Alt etiket bandı */}
          <div
            className="absolute inset-x-3 bottom-3 flex flex-col gap-0.5 rounded-sm px-4 py-3"
            style={{
              background: card.isDark
                ? "rgba(255,255,255,0.10)"
                : "rgba(255,255,255,0.82)",
              backdropFilter: "blur(8px)",
              border: `0.5px solid ${
                card.isDark
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(31,27,23,0.08)"
              }`,
            }}
          >
            <h3
              className="font-display italic"
              style={{
                fontSize: "clamp(20px, 2.4vw, 26px)",
                lineHeight: 1.1,
                letterSpacing: "-0.012em",
                color: card.isDark ? "#F6F1EA" : "#1F1B17",
              }}
            >
              {card.name}
            </h3>
            <span
              className="text-[10px] uppercase"
              style={{
                letterSpacing: "0.28em",
                color: card.isDark
                  ? "rgba(246, 241, 234, 0.7)"
                  : "rgba(31, 27, 23, 0.62)",
              }}
            >
              {card.category}
            </span>
          </div>

          {/* Hover cognac wash overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(180deg, transparent 50%, rgba(140,90,60,0.10) 100%)",
            }}
          />
        </article>
      </TiltCard>
    </Link>
  );
}

/** "Yakında" placeholder kart — TDI Coming Soon paritesi. */
export function ComingSoonTile({ isCarouselSlide = false }: { isCarouselSlide?: boolean }) {
  return (
    <div
      className={`group block ${
        isCarouselSlide
          ? "w-[280px] flex-shrink-0 snap-start sm:w-[320px] lg:w-[380px]"
          : "w-full"
      }`}
      aria-label="Yeni edisyon yakında"
    >
      <article
        className="relative aspect-[3/4] overflow-hidden rounded-md shadow-ed-sm"
        style={{
          background:
            "linear-gradient(155deg, #F5F2EB 0%, #E4DFD3 100%)",
          border: "0.5px dashed rgba(31, 27, 23, 0.22)",
        }}
      >
        {/* Hafif zemin doku */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(140, 90, 60, 0.04) 0%, transparent 60%)",
          }}
        />

        {/* Üst sol: 07 + NUVE */}
        <div className="absolute left-4 top-4 flex flex-col gap-1.5">
          <span
            className="font-display"
            style={{
              fontSize: 22,
              lineHeight: 1,
              color: "rgba(31, 27, 23, 0.45)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            07
          </span>
          <span
            className="text-[9px] uppercase"
            style={{
              color: "rgba(31, 27, 23, 0.42)",
              letterSpacing: "0.36em",
              fontWeight: 500,
            }}
          >
            NUVE
          </span>
        </div>

        {/* Üst sağ: "Yakında" chip */}
        <span
          className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em]"
          style={{
            background: "rgba(31, 27, 23, 0.08)",
            color: "rgba(31, 27, 23, 0.6)",
            border: "0.5px solid rgba(31, 27, 23, 0.12)",
          }}
        >
          Yakında
        </span>

        {/* Merkezde minimal ornament */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span
            className="font-display italic text-brand-cognac"
            style={{
              fontSize: "clamp(36px, 6vw, 56px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            ✦
          </span>
          <p
            className="mt-4 max-w-[200px] font-display italic"
            style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              lineHeight: 1.35,
              color: "rgba(31, 27, 23, 0.7)",
            }}
          >
            Yeni edisyon yolda
          </p>
          <p
            className="mt-2 text-[10px] uppercase tracking-[0.28em] text-brand-mute"
          >
            Haberdar olmak için → footer
          </p>
        </div>

        {/* Alt etiket bandı */}
        <div
          className="absolute inset-x-3 bottom-3 flex flex-col gap-0.5 rounded-sm border border-line/30 bg-paper/60 px-4 py-3 backdrop-blur"
        >
          <h3
            className="font-display italic text-brand-mute"
            style={{
              fontSize: "clamp(20px, 2.4vw, 26px)",
              lineHeight: 1.1,
              letterSpacing: "-0.012em",
            }}
          >
            Coming Soon
          </h3>
          <span
            className="text-[10px] uppercase tracking-[0.28em] text-brand-mute"
          >
            7. edisyon · Hazırlanıyor
          </span>
        </div>
      </article>
    </div>
  );
}
