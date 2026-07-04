import { THEMES_V2 } from "@/lib/themes-v2/registry";

// Palet registry'den — thumb kopya hex'leri senkron riskiydi (P2-10);
// sahneye özgü renkler (gök, ışık) bilinçli hardcoded kalır.
const P = THEMES_V2.kurdele.palette;

export function KurdeleThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill={P.bg} />
      <ellipse cx="60" cy="60" rx="80" ry="50" fill={P.accent} opacity="0.3" />
      <ellipse cx="240" cy="340" rx="90" ry="60" fill={P.accent} opacity="0.3" />

      {/* Envelope */}
      <g transform="translate(45 120)">
        <rect width="210" height="160" fill={P.paper} stroke="#2E394230" />
        <polygon
          points="0,0 210,0 105,90"
          fill={P.paper}
          stroke="#2E394230"
        />
        {/* Wax seal */}
        <g transform="translate(105 50)">
          <circle r="14" fill={P.accent} />
          <text
            y="4"
            textAnchor="middle"
            fontFamily="serif"
            fontStyle="italic"
            fontSize="11"
            fill={P.paper}
          >
            E&amp;C
          </text>
        </g>
        {/* Ribbon */}
        <rect x="-10" y="98" width="230" height="16" fill={P.accent} />
        <path d="M 100 106 C 75 80 60 80 70 105 C 75 122 95 110 105 106 Z" fill={P.accent} />
        <path d="M 110 106 C 135 80 150 80 140 105 C 135 122 115 110 105 106 Z" fill={P.accent} />
        <rect x="98" y="98" width="14" height="16" fill="#7C9AAC" />
        <path d="M 100 114 L 92 138 L 105 138 Z" fill={P.accent} />
        <path d="M 110 114 L 118 138 L 105 138 Z" fill={P.accent} />
      </g>

      <text
        x="150"
        y="320"
        textAnchor="middle"
        fontFamily="serif"
        fontStyle="italic"
        fontSize="14"
        fill={P.ink}
      >
        Açmak için dokun
      </text>
    </svg>
  );
}
