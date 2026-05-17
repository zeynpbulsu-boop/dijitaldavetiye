"use client";

/**
 * ChapelWatermark — FAZ 5.12 (per-edition src) / FAZ A.2 (Next/Image)
 *
 * Gerçek alpha PNG. Her edisyon kendi watermark asset'ini geçirir.
 * "Chapel" adı tarihsel — artık genel "EditionWatermark" anlamında.
 *
 * Image: Next/Image with explicit intrinsic dimensions. The original
 * watermark PNGs are 1200×900 (Pillow-clipped from fal.ai output). We
 * declare width=maxWidth at a 4:3 ratio so layout doesn't jump while
 * the AVIF/WebP variant loads. The `sizes` attribute lets the browser
 * pick the right tier from next.config.mjs deviceSizes.
 */

import Image from "next/image";

interface ChapelWatermarkProps {
  /** PNG path — default Aethel chapel. */
  src?: string;
  position?: "fixed" | "absolute";
  opacity?: number;
  alignment?: "center" | "top" | "bottom" | "left" | "right";
  className?: string;
  maxWidth?: number;
  bgColor?: string; // geriye uyumluluk
}

/* PNG source aspect ratio — all chapel/watermark renders are 4:3
   (1200x900) from the fal.ai pipeline. */
const PNG_ASPECT = 4 / 3;

export function ChapelWatermark({
  src = "/aethel/chapel-vignette.png",
  position = "absolute",
  opacity = 0.06,
  alignment = "center",
  className = "",
  maxWidth = 1100,
}: ChapelWatermarkProps) {
  const alignStyle: Record<string, string> = {
    center: "items-center justify-center",
    top: "items-start justify-center",
    bottom: "items-end justify-center",
    left: "items-center justify-start",
    right: "items-center justify-end",
  };

  const intrinsicHeight = Math.round(maxWidth / PNG_ASPECT);

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${position} inset-0 flex ${alignStyle[alignment]} overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <Image
        src={src}
        alt=""
        width={maxWidth}
        height={intrinsicHeight}
        sizes={`(max-width: 640px) 100vw, ${maxWidth}px`}
        draggable={false}
        style={{
          width: "100%",
          maxWidth,
          height: "auto",
          opacity,
          userSelect: "none",
        }}
      />
    </div>
  );
}
