"use client";

/**
 * ChapelWatermark — FAZ 5.11.1 (background-blend-mode FIX)
 *
 * Fal.ai chapel vignette'i tema zeminine %5-8 opacity ile yedirir.
 * background-blend-mode: multiply ile beyaz BG silinir, sadece
 * çizim kalır. Stacking context'ten bağımsız çalışır.
 */

interface ChapelWatermarkProps {
  position?: "fixed" | "absolute";
  opacity?: number;
  alignment?: "center" | "top" | "bottom" | "left" | "right";
  className?: string;
  maxWidth?: number;
  /** Tema zemin rengi — beyaz pikseller bu rengin içinde "yutulur". */
  bgColor?: string;
}

export function ChapelWatermark({
  position = "absolute",
  opacity = 0.06,
  alignment = "center",
  className = "",
  maxWidth = 1100,
  bgColor = "#F2EEE4",
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
      <div
        style={{
          width: "100%",
          maxWidth,
          aspectRatio: "4 / 3",
          backgroundImage: "url(/aethel/chapel-vignette.png)",
          backgroundColor: bgColor,
          backgroundBlendMode: "multiply",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity,
        }}
      />
    </div>
  );
}
