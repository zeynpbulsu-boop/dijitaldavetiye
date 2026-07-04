import { THEMES_V2 } from "@/lib/themes-v2/registry";

// Palet registry'den — thumb kopya hex'leri senkron riskiydi (P2-10);
// sahneye özgü renkler (gök, ışık) bilinçli hardcoded kalır.
const P = THEMES_V2.polaroid.palette;

export function PolaroidThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill={P.bg} />

      {/* Back polaroids */}
      <g transform="translate(60 90) rotate(-10)">
        <rect width="80" height="110" fill={P.paper} stroke="#3D2C1E22" />
        <rect x="6" y="6" width="68" height="68" fill="#A88660" />
      </g>
      <g transform="translate(170 100) rotate(8)">
        <rect width="80" height="110" fill={P.paper} stroke="#3D2C1E22" />
        <rect x="6" y="6" width="68" height="68" fill="#8B5E40" />
      </g>

      {/* Front polaroid (couple name) */}
      <g transform="translate(95 170) rotate(-2)">
        <rect width="120" height="160" fill={P.paper} stroke="#3D2C1E33" />
        <rect x="8" y="8" width="104" height="104" fill={P.paper} stroke="#3D2C1E22" />
        <text
          x="60"
          y="34"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="6.5"
          fill={P.accent}
          letterSpacing="2"
        >
          SAVE THE DATE
        </text>
        <text
          x="60"
          y="64"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="24"
          fill={P.ink}
        >
          Elif
        </text>
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="8"
          fill={P.accent}
        >
          &amp;
        </text>
        <text
          x="60"
          y="100"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="24"
          fill={P.ink}
        >
          Can
        </text>
        <text
          x="60"
          y="142"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="16"
          fill={P.inkSoft}
        >
          15 Haziran 2026
        </text>
      </g>
    </svg>
  );
}
