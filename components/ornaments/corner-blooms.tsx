"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Peony,
  RoseVine,
  Eucalyptus,
  Anemone,
  BabysBreath,
  FernFrond,
} from "./floral-library";

/**
 * CornerBlooms — ambient floral overlay for any section.
 *
 * Places 4 ornaments at the 4 corners (or a subset) with low opacity so
 * they sit behind content. Each slot has a default SVG motif but tries
 * a PNG first — if you drop `/public/florals/{slot}/{tl,tr,bl,br}.png`
 * it'll prefer the watercolor PNG. This is the A Plan / B Plan bridge.
 *
 * Usage:
 *   <section className="relative">
 *     <CornerBlooms slot="closing" />
 *     ...content...
 *   </section>
 *
 * Make sure the parent has `position: relative` and `overflow: hidden`
 * (or sufficient padding) so the ornaments don't bleed out.
 */
type Slot = "hero" | "closing" | "seal" | "ceremonies" | "themes";
type Corner = "tl" | "tr" | "bl" | "br";

type CornerSpec = {
  Motif: React.ComponentType<{
    size?: number;
    opacity?: number;
    flip?: boolean;
    className?: string;
  }>;
  size: number;
  /** Final on-screen opacity multiplier (0-1). */
  opacity: number;
  flip?: boolean;
  /** Tailwind position class — used because individual corners need different offset. */
  pos: string;
};

const PRESETS: Record<Slot, Record<Corner, CornerSpec>> = {
  hero: {
    tl: { Motif: RoseVine, size: 320, opacity: 0.32, pos: "left-[-40px] top-[64px]" },
    tr: { Motif: BabysBreath, size: 260, opacity: 0.4, flip: true, pos: "right-[-30px] top-[110px]" },
    bl: { Motif: FernFrond, size: 300, opacity: 0.3, pos: "left-[-50px] bottom-[-20px]" },
    br: { Motif: Eucalyptus, size: 280, opacity: 0.32, flip: true, pos: "right-[-40px] bottom-[10px]" },
  },
  closing: {
    tl: { Motif: Peony, size: 280, opacity: 0.45, pos: "left-[-60px] top-[-40px]" },
    tr: { Motif: Anemone, size: 220, opacity: 0.4, flip: true, pos: "right-[-30px] top-[-20px]" },
    bl: { Motif: Eucalyptus, size: 320, opacity: 0.4, pos: "left-[-50px] bottom-[-60px]" },
    br: { Motif: Peony, size: 300, opacity: 0.45, flip: true, pos: "right-[-50px] bottom-[-40px]" },
  },
  seal: {
    tl: { Motif: RoseVine, size: 280, opacity: 0.28, pos: "left-[-30px] top-[-20px]" },
    tr: { Motif: FernFrond, size: 260, opacity: 0.28, flip: true, pos: "right-[-40px] top-[-10px]" },
    bl: { Motif: Eucalyptus, size: 240, opacity: 0.28, pos: "left-[-30px] bottom-[-30px]" },
    br: { Motif: BabysBreath, size: 240, opacity: 0.35, flip: true, pos: "right-[-30px] bottom-[-10px]" },
  },
  ceremonies: {
    tl: { Motif: Eucalyptus, size: 240, opacity: 0.26, pos: "left-[-30px] top-[20px]" },
    tr: { Motif: Anemone, size: 180, opacity: 0.32, flip: true, pos: "right-[10px] top-[-20px]" },
    bl: { Motif: BabysBreath, size: 220, opacity: 0.3, pos: "left-[10px] bottom-[-30px]" },
    br: { Motif: RoseVine, size: 260, opacity: 0.28, flip: true, pos: "right-[-30px] bottom-[-20px]" },
  },
  themes: {
    tl: { Motif: FernFrond, size: 240, opacity: 0.22, pos: "left-[-30px] top-[40px]" },
    tr: { Motif: Eucalyptus, size: 220, opacity: 0.22, flip: true, pos: "right-[-30px] top-[20px]" },
    bl: { Motif: BabysBreath, size: 220, opacity: 0.25, pos: "left-[-20px] bottom-[20px]" },
    br: { Motif: RoseVine, size: 240, opacity: 0.22, flip: true, pos: "right-[-30px] bottom-[20px]" },
  },
};

export function CornerBlooms({
  slot,
  corners = ["tl", "tr", "bl", "br"],
}: {
  slot: Slot;
  corners?: Corner[];
}) {
  const preset = PRESETS[slot];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {corners.map((c) => {
        const spec = preset[c];
        if (!spec) return null;
        return (
          <div key={c} className={`absolute ${spec.pos}`}>
            <BloomSlot slot={slot} corner={c} spec={spec} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders a PNG from /public/florals/{slot}/{corner}.png if present,
 * otherwise falls back to the assigned SVG motif. This lets you ship
 * with SVG ornaments today and swap in licensed watercolor PNGs later
 * without touching any section code.
 */
function BloomSlot({
  slot,
  corner,
  spec,
}: {
  slot: Slot;
  corner: Corner;
  spec: CornerSpec;
}) {
  const [usePng, setUsePng] = useState(true);
  const pngSrc = `/florals/${slot}/${corner}.png`;
  const { Motif, size, opacity, flip } = spec;

  if (usePng) {
    return (
      <Image
        src={pngSrc}
        alt=""
        width={size}
        height={size}
        unoptimized
        onError={() => setUsePng(false)}
        style={{
          width: size,
          height: "auto",
          opacity,
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      />
    );
  }

  return <Motif size={size} opacity={opacity} flip={flip} />;
}
