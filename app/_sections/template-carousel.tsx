"use client";

/**
 * TemplateCarousel — the 7 themes-v2 cinematic templates.
 *
 * Replaces the legacy luxe-edition carousel. Each card uses the theme's
 * rendered preview thumbnail (SVG fallback) and links to /themes/[slug],
 * the live cinematic preview (tap-to-open → video hero → full invitation).
 */

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { listThemesV2 } from "@/lib/themes-v2/registry";
import { THEME_THUMB, THEME_VIDEO } from "@/lib/themes-v2/assets";
import { HoverVideoThumb } from "@/components/themes-v2/hover-video-thumb";
import type { ThemeV2Slug } from "@/lib/themes-v2/types";
import { CelenkThumb } from "@/components/themes-v2/thumbs/celenk-thumb";
import { PolaroidThumb } from "@/components/themes-v2/thumbs/polaroid-thumb";
import { KurdeleThumb } from "@/components/themes-v2/thumbs/kurdele-thumb";
import { FenerThumb } from "@/components/themes-v2/thumbs/fener-thumb";
import { DefterThumb } from "@/components/themes-v2/thumbs/defter-thumb";
import { GeceyarisiThumb } from "@/components/themes-v2/thumbs/geceyarisi-thumb";
import { PostakartThumb } from "@/components/themes-v2/thumbs/postakart-thumb";

const SVG_THUMB: Record<ThemeV2Slug, React.ComponentType> = {
  celenk: CelenkThumb,
  polaroid: PolaroidThumb,
  kurdele: KurdeleThumb,
  fener: FenerThumb,
  defter: DefterThumb,
  geceyarisi: GeceyarisiThumb,
  postakart: PostakartThumb,
};

/** Small editorial badge per theme (purely cosmetic). */
const BADGE: Partial<Record<ThemeV2Slug, string>> = {
  geceyarisi: "EN SEVİLEN",
  celenk: "YENİ",
  fener: "YENİ",
};

export function TemplateCarousel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const railRef = useRef<HTMLDivElement>(null);
  const themes = listThemesV2();

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
      rail.scrollLeft = scrollStart - (x - startX) * 1.15;
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
    <section id="themes" ref={ref} className="border-b border-line bg-bg py-20 lg:py-32">
      <div className="container-wide">
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
              style={{ fontSize: "clamp(36px, 5vw, 72px)", lineHeight: 0.98, letterSpacing: "-0.025em" }}
            >
              Yedi tema,{" "}
              <span className="italic text-brand-cognac">yedi hikâye</span>.
            </h2>
            <p className="mt-3 max-w-[560px] text-[14px] leading-[1.7] text-brand-mute">
              Her tema kendi sinematik açılışı, video sahnesi, mührü ve fontuyla
              tasarlandı &mdash; tek bir kalıbın renk varyantı değil. Tıklayın,
              demoyu gezin.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-brand-mute">Sürükle →</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.15 }}
          ref={railRef}
          className="no-scrollbar -mx-5 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 lg:-mx-8 lg:gap-7 lg:px-8"
          style={{ scrollPaddingLeft: 24 }}
        >
          {themes.map((theme, i) => {
            const Svg = SVG_THUMB[theme.slug];
            return (
              <Link
                key={theme.slug}
                href={`/themes/${theme.slug}`}
                data-cursor="magnetic"
                data-cursor-label="Demoyu gör"
                aria-label={`${theme.name} demosunu gör`}
                className="group relative w-[300px] shrink-0 snap-start overflow-hidden rounded-sm border border-brand-ink/10 bg-paper transition hover:-translate-y-1 hover:border-brand-cognac/40 hover:shadow-xl sm:w-[340px] lg:w-[380px]"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden"
                  style={{ backgroundColor: theme.palette.bg }}
                >
                  <HoverVideoThumb
                    videoSrc={THEME_VIDEO[theme.slug]}
                    imgSrc={THEME_THUMB[theme.slug]}
                    alt={`${theme.name} davetiye teması`}
                    SvgFallback={Svg}
                  />

                  {/* Number top-left */}
                  <span
                    className="absolute left-5 top-5 font-display text-white/90"
                    style={{ fontSize: 22, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Vibe / badge top-right */}
                  <span
                    className="absolute right-4 top-5 rounded-full bg-white/85 px-3 py-1 text-[9px] font-semibold uppercase text-brand-ink"
                    style={{ letterSpacing: "0.24em" }}
                  >
                    {BADGE[theme.slug] ?? theme.mood}
                  </span>

                  {/* Hover gradient + pill */}
                  <div
                    className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 55%)" }}
                  />
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-ink opacity-0 transition group-hover:opacity-100">
                    Demoyu gör →
                  </span>
                </div>

                <div className="p-6 sm:p-7">
                  <h3
                    className="font-display text-brand-ink"
                    style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "-0.012em" }}
                  >
                    {theme.name}
                  </h3>
                  <p className="mt-2 text-[13px] text-brand-mute">{theme.tagline}</p>
                </div>
              </Link>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[13px] text-brand-mute">
            Her tema sinematik video sahnesi, gerçek mühür açılışı ve kamu-malı
            klasik müzikle gelir &mdash; hepsi tek paket içinde.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tasarimlar"
              data-cursor="magnetic"
              data-cursor-label="Koleksiyon"
              aria-label="Tüm tasarım koleksiyonunu gör"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-ink px-6 text-[11px] uppercase tracking-[0.28em] text-bg transition hover:tracking-[0.32em]"
            >
              Tüm koleksiyon →
            </Link>
            <Link
              href="/tasarimlar"
              data-cursor="magnetic"
              data-cursor-label="Tasarla"
              aria-label="Davetiye tasarlamaya başla"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-ink/40 px-6 text-[11px] uppercase tracking-[0.28em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
            >
              Tasarlamaya başla
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
