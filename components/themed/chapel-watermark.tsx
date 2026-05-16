"use client";

/**
 * ChapelWatermark — FAZ 5.11.2 (gerçek alpha PNG)
 *
 * PNG'nin beyaz BG'si Pillow ile transparent. Direkt <img> kullan.
 */

interface ChapelWatermarkProps {
  position?: "fixed" | "absolute";
  opacity?: number;
  alignment?: "center" | "top" | "bottom" | "left" | "right";
  className?: string;
  maxWidth?: number;
  /** Geriye uyumluluk — kullanılmıyor. */
  bgColor?: string;
}

export function ChapelWatermark({
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
        src="/aethel/chapel-vignette.png"
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
