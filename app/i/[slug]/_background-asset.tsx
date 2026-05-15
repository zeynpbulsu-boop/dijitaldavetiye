"use client";

import { useState } from "react";

/**
 * BackgroundAsset — full-canvas illustration slot.
 *
 * Looks for an image at `/illustrations/{templateSlug}/hero.{ext}` and
 * renders it as a soft, slowly-drifting (Ken Burns) backdrop behind
 * the invitation content. If the file is missing, it silently hides
 * itself — the page still renders the gradient + ornaments below.
 *
 * Drop your purchased / licensed watercolor backgrounds into:
 *   public/illustrations/blush-reverie/hero.jpg   (or .png / .webp)
 *   public/illustrations/olive-grove/hero.jpg
 *   public/illustrations/bordeaux/hero.jpg
 *   public/illustrations/mansion-lights/hero.jpg
 *   public/illustrations/kir-bahcesi/hero.jpg
 *   ...etc
 *
 * Filenames are tried in this order: hero.jpg → hero.png → hero.webp.
 * Animations: 1.4s fade-in (opacity 0 → opacity prop), gentle slide
 * from y +18px → 0, then a slow 24s Ken Burns scale 1.04 → 1.0 loop.
 * Honours prefers-reduced-motion (no Ken Burns when set).
 */

type Props = {
  templateSlug: string;
  /** Final opacity once faded in. Lower = more subtle. Default 0.45. */
  opacity?: number;
  /** Position of the asset within the viewport. Default "cover top". */
  position?: string;
  /** Force a specific extension first. */
  preferExt?: "jpg" | "png" | "webp";
};

const EXT_FALLBACK_ORDER: Array<"jpg" | "png" | "webp"> = ["jpg", "png", "webp"];

export function BackgroundAsset({
  templateSlug,
  opacity = 0.45,
  position = "center top",
  preferExt,
}: Props) {
  const order = preferExt
    ? [preferExt, ...EXT_FALLBACK_ORDER.filter((e) => e !== preferExt)]
    : EXT_FALLBACK_ORDER;

  const [extIndex, setExtIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;
  const ext = order[extIndex];
  const src = `/illustrations/${templateSlug}/hero.${ext}`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Raw img on purpose — Next/Image's optimizer chokes on
          potentially-missing paths and we already have a graceful
          onError fallback below. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        onError={() => {
          // Try next extension; if all fail, hide the layer entirely.
          if (extIndex < order.length - 1) {
            setExtIndex(extIndex + 1);
          } else {
            setHidden(true);
          }
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          opacity,
          mixBlendMode: "multiply",
          animation:
            "nuve-asset-in 1.6s cubic-bezier(0.22,1,0.36,1) both, nuve-kenburns 26s ease-in-out 2s infinite alternate",
          willChange: "opacity, transform",
        }}
      />

      {/* Soft top-vignette so text remains readable */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.0) 70%)",
        }}
      />

      <style>{`
        @keyframes nuve-asset-in {
          0%   { opacity: 0; transform: translateY(18px) scale(1.04); filter: blur(2px); }
          100% { opacity: ${opacity}; transform: translateY(0) scale(1.04); filter: blur(0); }
        }
        @keyframes nuve-kenburns {
          0%   { transform: translateY(0) scale(1.04); }
          100% { transform: translateY(-12px) scale(1.0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="nuve-asset-in"], [style*="nuve-kenburns"] {
            animation: nuve-asset-in 0.4s linear both !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
