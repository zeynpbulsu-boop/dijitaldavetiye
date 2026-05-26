/**
 * FloralCorner — Etsy 2026 trend.
 *
 * Section'ın bir köşesine yerleşen gerçek photographic floral
 * arrangement PNG. Alpha cut'lı (BG transparent). Pointer-events
 * none — etkileşim için engel teşkil etmez.
 *
 * 4 köşe pozisyonu desteklenir: tl / tr / bl / br.
 * Boyut clamp(120px, 18vw, 200px) — mobile'da küçülüp masaüstünde
 * büyüyebilir.
 */

import Image from "next/image";

type Corner = "tl" | "tr" | "bl" | "br";

interface Props {
  src: string;
  corner: Corner;
  /** Override default size hint. */
  sizeCss?: string;
  /** Override max width in px. Default 200. */
  maxPx?: number;
  alt?: string;
}

const POSITIONS: Record<Corner, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0 [transform:scaleX(-1)]",
  bl: "bottom-0 left-0 [transform:scaleY(-1)]",
  br: "bottom-0 right-0 [transform:scale(-1,-1)]",
};

export function FloralCorner({
  src,
  corner,
  sizeCss = "clamp(120px, 18vw, 200px)",
  maxPx = 200,
  alt = "",
}: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-10 ${POSITIONS[corner]}`}
      style={{
        width: sizeCss,
        height: sizeCss,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${maxPx}px`}
        style={{ objectFit: "contain" }}
        draggable={false}
      />
    </div>
  );
}
