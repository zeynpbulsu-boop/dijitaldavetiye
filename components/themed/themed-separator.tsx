"use client";

/**
 * ThemedSeparator — FAZ 5.3
 *
 * Section ayraç. Tema'nın ornamentColor + separatorIcon'undan beslenir.
 * Hiçbir sayfa ayracı düz çizgi değildir — her edition'ın kendi DNA'sını
 * taşır: Aethel Chapel ✦ yosun yeşili, Olive Grove 🌿 yaprak, vb.
 *
 * Pressed Love'ın yapamadığı ŞEY budur: onların `+` her sayfada aynı
 * jenerik gri. Bizimki edition kimliğini her cm²'ye yedirir.
 */

import { motion } from "framer-motion";
import type { EditionMeta } from "@/lib/design/tokens";

type SeparatorIcon = EditionMeta["separatorIcon"];

interface ThemedSeparatorProps {
  /** Edition meta — ornamentColor + separatorIcon buradan gelir. */
  theme: Pick<EditionMeta, "ornamentColor" | "separatorIcon">;
  /** İkon çevresinde ince çizgi uzunluğu (px). Default 60. */
  lineLength?: number;
  /** Genel boyut. Default "md" (24px ikon, ince çizgi). */
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ThemedSeparator({
  theme,
  lineLength = 60,
  size = "md",
  className = "",
}: ThemedSeparatorProps) {
  const iconSize = size === "lg" ? 20 : size === "sm" ? 10 : 14;
  const lineHeight = size === "lg" ? 1.5 : 1;

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center justify-center gap-4 py-12 ${className}`}
    >
      <span
        className="block"
        style={{
          height: lineHeight,
          width: lineLength,
          background: theme.ornamentColor,
          opacity: 0.4,
        }}
      />
      <SeparatorGlyph icon={theme.separatorIcon} color={theme.ornamentColor} size={iconSize} />
      <span
        className="block"
        style={{
          height: lineHeight,
          width: lineLength,
          background: theme.ornamentColor,
          opacity: 0.4,
        }}
      />
    </motion.div>
  );
}

/* ── Glyph variants ──────────────────────────────────────────────── */

function SeparatorGlyph({
  icon,
  color,
  size,
}: {
  icon: SeparatorIcon;
  color: string;
  size: number;
}) {
  const stroke = 1.2;
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 4 L12 20 M4 12 L20 12" />
        </svg>
      );
    case "diamond":
      // ✦ vintage cathedral vitray — Aethel + Atelier + Mansion
      return (
        <svg {...props}>
          <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
            fill={color} fillOpacity="0.85" stroke="none" />
        </svg>
      );
    case "leaf":
      // 🌿 Olive Grove
      return (
        <svg {...props}>
          <path d="M12 2 C 8 7, 6 12, 8 18 C 14 20, 18 16, 18 10 C 18 6, 16 3, 12 2 Z"
            fill={color} fillOpacity="0.85" stroke={color} />
          <path d="M12 4 L12 20" stroke={color} strokeOpacity="0.6" strokeWidth="0.6" />
        </svg>
      );
    case "flower":
      // Magnolia-tarzı
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" fill={color} />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="12" cy="6" rx="2.5" ry="4"
              fill={color} fillOpacity="0.85"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </svg>
      );
    case "star":
      // Bodrum Blue — Aegean / coastal star
      return (
        <svg {...props}>
          <path d="M12 2 L14 9 L21 10 L16 14 L17.5 21 L12 17 L6.5 21 L8 14 L3 10 L10 9 Z"
            fill={color} fillOpacity="0.7" stroke={color} />
        </svg>
      );
    case "key":
      // Aurora — modernist key motif
      return (
        <svg {...props}>
          <circle cx="8" cy="12" r="4" fill="none" stroke={color} />
          <path d="M12 12 L22 12 M18 12 L18 16 M21 12 L21 15" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" fill={color} />
        </svg>
      );
  }
}
