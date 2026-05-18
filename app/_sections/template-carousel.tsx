"use client";

/**
 * TemplateCarousel — 6 luxe edition + "Yakında" placeholder.
 *
 * PR #18 refactor: kart markup'ı EditionCardTile'a taşındı, data
 * lib/templates/edition-cards.ts'te. /tasarimlar dedicated catalog
 * sayfası aynı data + tile'ı kullanıyor (bizevleniyoruz.net paritesi).
 *
 * Polish (PR #18):
 *  - Numbered display (01-06) her kartta
 *  - "Demoyu gör →" pill hover'da görünür (TDI paritesi)
 *  - "EN SEVİLEN" rozeti Aethel'da (bizevleniyoruz paritesi)
 *  - 7. kart "Yakında" placeholder (TDI Coming Soon paritesi)
 *  - Footer'da "Tüm koleksiyon →" link /tasarimlar'a gider
 */

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { editionCards } from "@/lib/templates/edition-cards";
import {
  EditionCardTile,
  ComingSoonTile,
} from "@/components/edition-card-tile";

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
              Her edisyon kendi mührü, sahnesi, ornament ailesi ve fontuyla
              tasarlandı &mdash; tek bir kalıbın renk varyantı değil.
              Tıklayın, demoyu gezin.
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
          {editionCards.map((card) => (
            <EditionCardTile
              key={card.slug}
              card={card}
              isCarouselSlide
            />
          ))}
          <ComingSoonTile isCarouselSlide />
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-[13px] text-brand-mute">
            Her edisyon kendi mührü, sahnesi, ornament ailesi ve fontuyla
            tasarlandı &mdash; tek bir kalıbın renk varyantı değil.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tasarimlar"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-ink px-6 text-[11px] uppercase tracking-[0.28em] text-bg transition hover:tracking-[0.32em]"
            >
              Tüm koleksiyon →
            </Link>
            <Link
              href="#pricing"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-ink/40 px-6 text-[11px] uppercase tracking-[0.28em] text-brand-ink transition hover:border-brand-cognac hover:text-brand-cognac"
            >
              Fiyatları gör
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
