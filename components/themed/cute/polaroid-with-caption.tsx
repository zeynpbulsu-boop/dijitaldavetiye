/**
 * PolaroidWithCaption — Etsy 2026 trend.
 *
 * Polaroid çerçeveli foto + altında calligraphy cursive tek satır
 * caption. ScrollTrigger / Ken Burns yerine sade entry transition.
 *
 * Mevcut gallery'de zaten Polaroid frame var; bu component
 * standalone tek foto için (story timeline, schedule yanı vs).
 */

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  src: string;
  alt?: string;
  caption?: string;
  /** -3 to +3 degrees suggested. */
  rotate?: number;
  inkSoft?: string;
  className?: string;
}

export function PolaroidWithCaption({
  src,
  alt = "",
  caption,
  rotate = -2,
  inkSoft = "#5E6650",
  className = "",
}: Props) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16, rotate: rotate + (rotate > 0 ? -3 : 3) }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative mx-auto w-full max-w-[280px] ${className}`}
      style={{
        background: "#FBFAF6",
        padding: "10px 10px 36px",
        boxShadow:
          "0 18px 38px -18px rgba(31,27,23,0.32), 0 2px 4px -1px rgba(31,27,23,0.08)",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 60vw, 280px"
          style={{ objectFit: "cover" }}
        />
      </div>
      {caption && (
        <figcaption
          className="absolute bottom-2 left-0 right-0 px-3 text-center italic"
          style={{
            fontFamily: "var(--font-calligraphy), 'Pinyon Script', Georgia, serif",
            fontSize: "16px",
            color: inkSoft,
            lineHeight: 1.2,
          }}
        >
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}
