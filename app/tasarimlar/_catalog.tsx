"use client";

/**
 * /tasarimlar Catalog — interactive grid with category filters.
 *
 * Layout: hero block + filter chips + 3-col grid (2-col on tablet,
 * 1-col on mobile). EditionCardTile reuse — aynı kart komponenti
 * landing carousel'inde de var (DRY).
 *
 * Filter: tek state, "all" / "wedding" / "save-the-date" / "birthday"
 * / "engagement". EditionCard.eventTypes array'iyle kesişim kontrolü.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  editionCards,
  eventTypeLabels,
  type EditionEventType,
} from "@/lib/templates/edition-cards";
import {
  EditionCardTile,
  ComingSoonTile,
} from "@/components/edition-card-tile";

type Filter = "all" | EditionEventType;

const FILTERS: Array<{ id: Filter; label: string; count?: number }> = [
  { id: "all", label: "Tümü" },
  { id: "wedding", label: eventTypeLabels.wedding },
  { id: "save-the-date", label: eventTypeLabels["save-the-date"] },
  { id: "engagement", label: eventTypeLabels.engagement },
  { id: "birthday", label: eventTypeLabels.birthday },
];

export function TasarimlarCatalog() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleCards = useMemo(() => {
    if (filter === "all") return editionCards;
    return editionCards.filter((c) => c.eventTypes.includes(filter));
  }, [filter]);

  const counts = useMemo(() => {
    const counts: Record<Filter, number> = {
      all: editionCards.length,
      wedding: 0,
      "save-the-date": 0,
      birthday: 0,
      engagement: 0,
    };
    editionCards.forEach((c) => {
      c.eventTypes.forEach((t) => {
        counts[t] = (counts[t] ?? 0) + 1;
      });
    });
    return counts;
  }, []);

  return (
    <>
      {/* Hero block */}
      <section className="relative overflow-hidden border-b border-line bg-bg pb-12 pt-32 sm:pt-40 lg:pt-48 lg:pb-16">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[900px]"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-cognac">
              — Tüm koleksiyon
            </span>
            <h1
              className="mt-4 font-display text-brand-ink"
              style={{
                fontSize: "clamp(40px, 7vw, 96px)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontWeight: 500,
              }}
            >
              Her edisyon{" "}
              <span className="italic text-brand-cognac">bir sahne</span>.
            </h1>
            <p
              className="mt-6 max-w-[640px] text-[16px] leading-[1.65] text-brand-mute lg:text-[17px]"
            >
              Şapelin altın saati, gece yarısı yıldız semaları, kıyıda kalkan
              yelkenli, zeytinlikteki rüzgâr&hellip; Her edisyon kendi mührü,
              fontu, ornament ailesi ve sahnesiyle hazırlandı &mdash; tek bir
              kalıbın renk varyantı değil.
            </p>
            <p
              className="mt-4 text-[12px] uppercase tracking-[0.22em] text-brand-mute"
            >
              {editionCards.length} edisyon · 1 yakında · Tek seferlik ödeme
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter rail */}
      <section className="sticky top-[64px] z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className="container-wide flex items-center gap-3 overflow-x-auto py-4 no-scrollbar">
          <span className="shrink-0 text-[10px] uppercase tracking-[0.28em] text-brand-mute">
            Filtre:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition ${
                filter === f.id
                  ? "bg-brand-ink text-bg"
                  : "border border-brand-ink/20 text-brand-ink hover:border-brand-cognac hover:text-brand-cognac"
              }`}
            >
              {f.label}{" "}
              <span
                className={`ml-1 ${
                  filter === f.id ? "text-bg/70" : "text-brand-mute"
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-bg py-12 lg:py-20">
        <div className="container-wide">
          {visibleCards.length === 0 ? (
            <div className="rounded-md border border-dashed border-line p-12 text-center">
              <p className="font-display italic text-[18px] text-brand-mute">
                Bu kategoride şu an edisyon yok.
              </p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.22em] text-brand-mute">
                Filtreyi değiştir, koleksiyonu gez.
              </p>
            </div>
          ) : (
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            >
              {visibleCards.map((card) => (
                <EditionCardTile key={card.slug} card={card} />
              ))}
              {filter === "all" && <ComingSoonTile />}
            </motion.div>
          )}

          {/* Footer CTA */}
          <div className="mt-16 flex flex-col items-start gap-4 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p
                className="font-display italic"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.15 }}
              >
                Bir tasarım gözüne mi takıldı?
              </p>
              <p className="mt-2 text-[13px] text-brand-mute">
                Demoyu gez, beğenirsen 48 saat içinde teslim alalım. Tasarlamak ücretsiz.
              </p>
            </div>
            <Link
              href="/#pricing"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brand-ink px-8 text-[12px] uppercase tracking-[0.22em] text-bg transition hover:tracking-[0.28em]"
            >
              Davetiyeni tasarla →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
