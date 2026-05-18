"use client";

/**
 * TemplateCarousel — 6 luxe edition kartı (yeniden yazıldı).
 *
 * Önceki carousel 9 karışık kart gösteriyordu, isim-slug uyumsuzdu
 * (örn. "Lavender" diye gösterilen kart aslında egee-blue'ya bağlıydı,
 * "Mansion Lights" verde-borgogna'ya gidiyordu). Yeni hâl: 6 gerçek
 * luxe edition, her birinin gerçek wax seal PNG'si kapak olarak,
 * tıklayınca /dev-preview/{slug}'a — yani gerçek davetiye demosuna
 * gider.
 *
 * Mouse drag + native scroll + touch swipe rail.
 */

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { TiltCard } from "@/components/effects/tilt-card";

type EditionCard = {
  slug: string;
  name: string;
  category: string;
  /** Sağ üstte kategori chip (Pressed Love paritesi: ELEGANT, DRAMATIC,
   *  ROMANTIC, COASTAL, BOTANICAL, MODERN). Uppercase, küçük pill. */
  vibe: string;
  /** Kart arkaplan gradient'ı — edition'ın bg + footerBg'sinden türer. */
  bg: { from: string; to: string };
  /** Wax seal PNG kapak yolu (public/). */
  cover: string;
  /** Watermark / chapel scene PNG — kartın bg'sinde çok düşük opacity
   *  ile render edilir, "sahne" hissi katar (PL kartlarındaki gibi). */
  watermark: string;
  /** "YENİ" rozeti. */
  isNew?: boolean;
  /** Açık tema mı (font rengi siyah / krem) — kart üstündeki metnin
   *  kontrastı için. */
  isDark?: boolean;
};

const cards: EditionCard[] = [
  {
    slug: "aethel",
    name: "Aethel's Chapel",
    category: "Toskana · Antik Şapel",
    vibe: "Elegant",
    bg: { from: "#F2EEE4", to: "#D8DCC9" },
    cover: "/aethel/wax-seal-luxe.png",
    watermark: "/aethel/chapel-vignette.png",
    isNew: true,
  },
  {
    slug: "atelier-indigo",
    name: "Atelier Indigo",
    category: "Gece Yarısı · Altın Varak",
    vibe: "Dramatic",
    bg: { from: "#0F1A3D", to: "#1B2E5F" },
    cover: "/atelier-indigo/wax-seal.png",
    watermark: "/atelier-indigo/watermark.png",
    isDark: true,
  },
  {
    slug: "mansion-lights",
    name: "Mansion Lights",
    category: "Akşam Yalısı · Şampanya",
    vibe: "Regal",
    bg: { from: "#11261E", to: "#1F4435" },
    cover: "/mansion-lights/wax-seal.png",
    watermark: "/mansion-lights/watermark.png",
    isDark: true,
    isNew: true,
  },
  {
    slug: "bodrum-blue",
    name: "Bodrum Blue",
    category: "Ege Mavisi · Kireç Beyazı",
    vibe: "Coastal",
    bg: { from: "#F4F1EA", to: "#CFDCE3" },
    cover: "/bodrum-blue/wax-seal.png",
    watermark: "/bodrum-blue/watermark.png",
  },
  {
    slug: "olive-grove",
    name: "Olive Grove",
    category: "Akdeniz · Zeytin Bahçesi",
    vibe: "Botanical",
    bg: { from: "#F2EFE0", to: "#C8D2A8" },
    cover: "/olive-grove/wax-seal.png",
    watermark: "/olive-grove/watermark.png",
  },
  {
    slug: "aurora",
    name: "Aurora",
    category: "Modern Minimal · Mor",
    vibe: "Modern",
    bg: { from: "#F8F7F4", to: "#D8D2EC" },
    cover: "/aurora/wax-seal.png",
    watermark: "/aurora/watermark.png",
    isNew: true,
  },
];

export function TemplateCarousel() {
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
      id="themes"
      ref={ref}
      className="border-b border-line bg-bg py-20 lg:py-32"
    >
      <div className="container-wide">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-16"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Koleksiyon
            </span>
            <h2
              className="mt-4 font-display text-brand-ink"
              style={{
                fontSize: "clamp(36px, 5vw, 72px)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
              }}
            >
              Altı edisyon,{" "}
              <span className="italic text-brand-cognac">altı hikâye</span>.
            </h2>
            <p className="mt-3 max-w-[540px] text-[14px] leading-[1.7] text-brand-mute">
              Her edisyon kendi mührü, watermark dokusu, ornament ailesi ve
              fontuyla — &ldquo;aynı kalıba renk değişiyor&rdquo; değil,
              gerçekten farklı kompozisyonlar. Tıklayın, demoyu gezin.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-brand-mute">
            Sürükle →
          </p>
        </motion.div>

        {/* Rail */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.15 }}
          ref={railRef}
          className="no-scrollbar -mx-5 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:-mx-8 lg:gap-7 lg:px-8"
          style={{ scrollPaddingLeft: 24 }}
        >
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/dev-preview/${card.slug}`}
              className="group block w-[280px] flex-shrink-0 snap-start sm:w-[320px] lg:w-[380px]"
            >
              <TiltCard max={6}>
                <article
                  className="relative aspect-[3/4] overflow-hidden rounded-md shadow-ed-md transition-shadow group-hover:shadow-ed-lg"
                  style={{
                    background: `linear-gradient(155deg, ${card.bg.from} 0%, ${card.bg.to} 100%)`,
                  }}
                >
                  {/* Watermark scene bg layer — PL paritesi:
                      kartın "sahnesi" hissini katar, mührün altında
                      düşük opacity ile dolaşır. */}
                  <div className="absolute inset-0">
                    <Image
                      src={card.watermark}
                      alt=""
                      fill
                      sizes="380px"
                      style={{
                        objectFit: "cover",
                        opacity: card.isDark ? 0.22 : 0.35,
                        mixBlendMode: card.isDark ? "screen" : "multiply",
                      }}
                    />
                  </div>

                  {/* Üst sol: NUVE brand watermark (PL'da
                      "PRESSED LOVE" üst sol). */}
                  <span
                    className="absolute left-4 top-4 text-[9px] uppercase tracking-[0.36em]"
                    style={{
                      color: card.isDark
                        ? "rgba(246, 241, 234, 0.7)"
                        : "rgba(31, 27, 23, 0.55)",
                      fontWeight: 500,
                    }}
                  >
                    NUVE
                  </span>

                  {/* Üst sağ: kategori chip (vibe) — PL paritesi */}
                  <span
                    className="absolute right-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      background: card.isDark
                        ? "rgba(246, 241, 234, 0.18)"
                        : "rgba(31, 27, 23, 0.08)",
                      color: card.isDark
                        ? "rgba(246, 241, 234, 0.92)"
                        : "rgba(31, 27, 23, 0.78)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    {card.vibe}
                  </span>

                  {/* Wax seal kapak — bg watermark üzerinde */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[58%] w-[58%]">
                      <Image
                        src={card.cover}
                        alt={`${card.name} mührü`}
                        fill
                        sizes="(max-width: 640px) 60vw, 220px"
                        style={{
                          objectFit: "contain",
                          filter:
                            "drop-shadow(0 18px 32px rgba(20, 20, 20, 0.28))",
                        }}
                      />
                    </div>
                  </div>

                  {/* "YENİ" rozeti — vibe chip yanına geçti, sağ üst
                      köşede chip ile dikey sıralı görünür. */}
                  {card.isNew && (
                    <span
                      className="absolute right-4 top-12 rounded-full bg-emerald-700/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-paper"
                    >
                      Yeni
                    </span>
                  )}

                  {/* Alt etiket bandı */}
                  <div
                    className="absolute inset-x-3 bottom-3 flex flex-col gap-0.5 rounded-sm px-4 py-3"
                    style={{
                      background: card.isDark
                        ? "rgba(255,255,255,0.10)"
                        : "rgba(255,255,255,0.78)",
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
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[13px] text-brand-mute">
            Her edisyon kendi mührü, watermark dokusu, ornament ailesi ve
            fontuyla &mdash; tek bir kalıbın renk varyantı değil.
          </p>
          <Link
            href="#pricing"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-ink/40 px-6 text-[11px] uppercase tracking-[0.28em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
          >
            Fiyatları gör
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
