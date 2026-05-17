"use client";

/**
 * ChapelWatermark — FAZ 5.12 (per-edition src)
 *
 * Gerçek alpha PNG. Her edisyon kendi watermark asset'ini geçirir.
 * "Chapel" adı tarihsel — artık genel "EditionWatermark" anlamında.
 */

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

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${position} inset-0 flex ${alignStyle[alignment]} overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    >
      <img
        src={src}
        alt=""
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
