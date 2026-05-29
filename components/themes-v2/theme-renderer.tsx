"use client";

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
}

export function ThemeRenderer({ meta, data, rsvpSlug, showBuyBadge }: Props) {
  const Hero = HERO_BY_SLUG[meta.slug];
  return (
    <ThemeShell
      meta={meta}
      data={data}
      hero={<Hero meta={meta} data={data} />}
      rsvpSlug={rsvpSlug}
      showBuyBadge={showBuyBadge}
    />
  );
}
