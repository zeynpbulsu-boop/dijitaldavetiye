"use client";

/**
 * ChapelWatermark — FAZ 5.11
 *
 * Fal.ai'den gelen pure-white-BG chapel vignette'i tema zeminine
 * %5-8 opacity ile yedirir. mix-blend-mode: multiply → beyaz BG silinir,
 * sadece çizim kalır. Gözü yormayan bir doku katmanı oluşturur.
 *
 * Position: fixed (tüm sayfa boyunca arka planda) veya absolute (section).
 */

interface ChapelWatermarkProps {
  /** Pozisyon CSS değeri. "fixed" tüm sayfa, "absolute" section içi. */
  position?: "fixed" | "absolute";
  /** Opaklık (0-1). Default 0.06 — gözü yormayan ışıl dokul. */
  opacity?: number;
  /** Resmin sayfada yerleşim noktası. */
  alignment?: "center" | "top" | "bottom" | "left" | "right";
  /** Ek className (boyut/transform için). */
  className?: string;
  /** Maximum width — büyük ekranlarda ölçek için. */
  maxWidth?: number;
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
          mixBlendMode: "multiply",
          userSelect: "none",
        }}
      />
    </div>
  );
}
