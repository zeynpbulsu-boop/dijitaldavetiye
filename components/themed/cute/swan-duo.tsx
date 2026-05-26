/**
 * SwanDuo — Etsy 2026 motif.
 *
 * İki kuğunun boyunlarını birbirine sokarak oluşturduğu kalp şekli.
 * Section separator olarak kullanılır (ThemedSeparator yerine veya
 * ek olarak). Saf SVG — asset yok.
 *
 * Görsel: 2 ince outline kuğu, hafif kabarık boyunlar kalp formu
 * oluşturur, taban hafif dalgalı su çizgisi. Stroke-only minimal.
 */

interface Props {
  color: string;
  size?: number;
  className?: string;
}

export function SwanDuo({ color, size = 56, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 120 56"
      width={size}
      height={(size * 56) / 120}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* Left swan */}
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path d="M28 44 C 16 44, 10 38, 14 32 C 18 30, 30 30, 38 34 C 44 36, 48 40, 52 44 Z" />
        {/* neck curving up + to right (into heart shape) */}
        <path d="M48 36 C 50 26, 52 18, 56 14 C 58 12, 60 12, 60 14" />
        {/* head */}
        <circle cx="60" cy="14" r="2.2" fill={color} />
        {/* tiny beak */}
        <path d="M60 13 L 63 12" />
        {/* wing flourish */}
        <path d="M22 38 C 26 32, 32 32, 36 36" opacity="0.55" />
      </g>

      {/* Right swan (mirror) */}
      <g fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M92 44 C 104 44, 110 38, 106 32 C 102 30, 90 30, 82 34 C 76 36, 72 40, 68 44 Z" />
        <path d="M72 36 C 70 26, 68 18, 64 14 C 62 12, 60 12, 60 14" />
        <circle cx="60" cy="14" r="2.2" fill={color} />
        <path d="M60 13 L 57 12" />
        <path d="M98 38 C 94 32, 88 32, 84 36" opacity="0.55" />
      </g>

      {/* Water hairline */}
      <path
        d="M2 50 Q 30 48 60 50 T 118 50"
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.45"
      />
    </svg>
  );
}
