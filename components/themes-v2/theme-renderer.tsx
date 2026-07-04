"use client";

import { useEffect, useMemo, useState } from "react";
import type { ThemeV2Props, ThemeV2Slug } from "@/lib/themes-v2/types";
import { ThemeShell } from "./theme-shell";
import { CelenkHero } from "./heroes/celenk-hero";
import { PolaroidHero } from "./heroes/polaroid-hero";
import { KurdeleHero } from "./heroes/kurdele-hero";
import { FenerHero } from "./heroes/fener-hero";
import { DefterHero } from "./heroes/defter-hero";
import { GeceyarisiHero } from "./heroes/geceyarisi-hero";
import { PostakartHero } from "./heroes/postakart-hero";

const HERO_BY_SLUG: Record<ThemeV2Slug, (p: ThemeV2Props) => JSX.Element> = {
  celenk: CelenkHero,
  polaroid: PolaroidHero,
  kurdele: KurdeleHero,
  fener: FenerHero,
  defter: DefterHero,
  geceyarisi: GeceyarisiHero,
  postakart: PostakartHero,
};

interface Props extends ThemeV2Props {
  rsvpSlug?: string;
  showBuyBadge?: boolean;
  musicSrc?: string | null;
}

export function ThemeRenderer({ meta, data, rsvpSlug, showBuyBadge, musicSrc }: Props) {
  const Hero = HERO_BY_SLUG[meta.slug];

  // Demo/QA: /themes önizlemesinde ?etkinlik=std ile save-the-date modunu
  // (kazı-kazan tarih) gezmek için — sayfa force-static olduğundan override
  // client'ta yapılır; canlı davetiyede eventType DB'den gelir.
  const [eventOverride, setEventOverride] = useState<string | null>(null);
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("etkinlik");
      if (q === "std") setEventOverride("save_the_date");
    } catch {
      /* ignore */
    }
  }, []);
  const activeData = eventOverride ? { ...data, eventType: eventOverride } : data;

  // Gece/Gündüz fazı — palet swap burada yaşar ki hem hero hem shell aynı
  // birleşik paleti görsün. Gece paleti tanımsız temalarda toggle yoktur.
  const [night, setNight] = useState(false);
  const activeMeta = useMemo(
    () =>
      night && meta.night
        ? { ...meta, palette: { ...meta.palette, ...meta.night } }
        : meta,
    [night, meta],
  );

  return (
    <ThemeShell
      meta={activeMeta}
      data={activeData}
      hero={<Hero meta={activeMeta} data={activeData} />}
      rsvpSlug={rsvpSlug}
      showBuyBadge={showBuyBadge}
      musicSrc={musicSrc}
      isNight={night}
      onToggleNight={meta.night ? () => setNight((v) => !v) : undefined}
    />
  );
}
