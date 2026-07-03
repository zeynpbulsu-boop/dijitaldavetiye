"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { listThemesV2 } from "@/lib/themes-v2/registry";
import { THEME_THUMB, THEME_VIDEO } from "@/lib/themes-v2/assets";
import { HoverVideoThumb } from "./hover-video-thumb";
import { CelenkThumb } from "./thumbs/celenk-thumb";
import { PolaroidThumb } from "./thumbs/polaroid-thumb";
import { KurdeleThumb } from "./thumbs/kurdele-thumb";
import { FenerThumb } from "./thumbs/fener-thumb";
import { DefterThumb } from "./thumbs/defter-thumb";
import { GeceyarisiThumb } from "./thumbs/geceyarisi-thumb";
import { PostakartThumb } from "./thumbs/postakart-thumb";
import type { ThemeV2Slug } from "@/lib/themes-v2/types";

const SVG_THUMB_BY_SLUG: Record<ThemeV2Slug, React.ComponentType> = {
  celenk: CelenkThumb,
  polaroid: PolaroidThumb,
  kurdele: KurdeleThumb,
  fener: FenerThumb,
  defter: DefterThumb,
  geceyarisi: GeceyarisiThumb,
  postakart: PostakartThumb,
};

export function ShowcaseGrid() {
  const themes = listThemesV2();
  const reduced = useReducedMotion();

  return (
    <section className="bg-bg px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 max-w-[820px]">
          <p
            className="text-[11px] font-semibold uppercase text-brand-cognac"
            style={{ letterSpacing: "0.32em" }}
          >
            — Tasarım Koleksiyonu
          </p>
          <h1
            className="mt-4 font-display text-brand-ink"
            style={{
              fontSize: "clamp(40px, 6vw, 76px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
            }}
          >
            Yedi farklı{" "}
            <span className="italic text-brand-cognac">karakter</span>, yedi anı.
          </h1>
          <p
            className="mt-6 max-w-[580px] text-brand-mute"
            style={{ fontSize: 17, lineHeight: 1.7 }}
          >
            Her şablon kendi imza animasyonu, gerçek suluboya dokusu ve
            hikâyesiyle gelir. Bambaşka yedi yaklaşım — ortak tek bir hedef:
            misafiriniz davetiyeyi ilk açtığı an gülümsesin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme, i) => {
            const SvgThumb = SVG_THUMB_BY_SLUG[theme.slug];
            const renderedThumb = THEME_THUMB[theme.slug];
            return (
              <motion.article
                key={theme.slug}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group"
              >
                <Link
                  href={`/themes/${theme.slug}`}
                  className="block overflow-hidden rounded-sm border border-brand-ink/10 bg-paper transition hover:border-brand-cognac/40 hover:shadow-xl"
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden"
                    style={{ backgroundColor: theme.palette.bg }}
                  >
                    {/* Rendered thumbnail (premium fal.ai) + hover'da hero
                        klibi (SVG fallback korunur) */}
                    <HoverVideoThumb
                      videoSrc={THEME_VIDEO[theme.slug]}
                      imgSrc={renderedThumb}
                      alt={`${theme.name} davetiye şablonu`}
                      SvgFallback={SvgThumb}
                    />
                    <div
                      className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.42), transparent 50%)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-ink">
                        Önizle ↗
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-white/90">
                        {theme.mood}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex items-baseline justify-between">
                      <h2
                        className="font-display text-brand-ink"
                        style={{
                          fontSize: 28,
                          lineHeight: 1.05,
                          letterSpacing: "-0.012em",
                        }}
                      >
                        {theme.name}
                      </h2>
                      <span
                        className="text-[10px] uppercase text-brand-cognac"
                        style={{ letterSpacing: "0.32em" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] text-brand-mute">
                      {theme.tagline}
                    </p>
                    <p
                      className="mt-4 font-display italic text-brand-ink/70"
                      style={{ fontSize: 13.5, lineHeight: 1.6 }}
                    >
                      {theme.signature}
                    </p>

                    <div className="mt-5 flex items-center gap-2">
                      {Object.values(theme.palette)
                        .slice(0, 5)
                        .map((c, j) => (
                          <span
                            key={j}
                            className="block h-3 w-3 rounded-full ring-1 ring-brand-ink/12"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <p className="text-brand-mute" style={{ fontSize: 14.5 }}>
            Hepsi tek paket içinde — €39.99 · 12 ay yayında.
          </p>
          <Link
            href="/#pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-cognac px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.36em] text-brand-cream transition hover:bg-brand-ink"
          >
            Davetiyeni oluştur
          </Link>
        </div>
      </div>
    </section>
  );
}
