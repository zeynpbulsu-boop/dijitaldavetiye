import { THEMES_V2 } from "@/lib/themes-v2/registry";

// Palet registry'den — thumb kopya hex'leri senkron riskiydi (P2-10);
// sahneye özgü renkler (gök, ışık) bilinçli hardcoded kalır.
const P = THEMES_V2.celenk.palette;

export function CelenkThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill={P.bg} />
      {/* Watercolor washes */}
      <ellipse cx="60" cy="60" rx="80" ry="40" fill="#A8C4D6" opacity="0.18" />
      <ellipse cx="250" cy="350" rx="100" ry="50" fill={P.accent} opacity="0.16" />

      {/* Wreath */}
      <g transform="translate(150 180)">
        <g stroke={P.accent} strokeWidth="0.8" fill="none">
          <path d="M -80 0 Q -68 -50 -36 -72 T 24 -98" />
          <path d="M 80 0 Q 68 -50 36 -72 T -24 -98" />
          <path d="M -80 0 Q -68 50 -36 72 T 24 98" />
          <path d="M 80 0 Q 68 50 36 72 T -24 98" />
        </g>
        {/* Leaves */}
        {[
          [-60, -32, -30], [-48, -52, -45], [-30, -72, -55], [-12, -88, -65],
          [60, -32, 30], [48, -52, 45], [30, -72, 55], [12, -88, 65],
          [-60, 32, 30], [-48, 52, 45], [-30, 72, 55], [-12, 88, 65],
          [60, 32, -30], [48, 52, -45], [30, 72, -55], [12, 88, -65],
        ].map(([x, y, a], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
            <ellipse cx="0" cy="0" rx="6" ry="2.5" fill={P.accent} fillOpacity="0.7" />
          </g>
        ))}
        {/* Gypsophila */}
        {[[0, -100], [0, 100], [-72, -56], [72, -56], [-72, 56], [72, 56]].map(
          ([cx, cy], i) => (
            <g key={`g-${i}`} transform={`translate(${cx} ${cy})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle
                  key={a}
                  cx={Math.cos((a * Math.PI) / 180) * 2.5}
                  cy={Math.sin((a * Math.PI) / 180) * 2.5}
                  r="2"
                  fill="#FBFAF5"
                  stroke={P.ink}
                  strokeWidth="0.2"
                  strokeOpacity="0.3"
                />
              ))}
              <circle cx="0" cy="0" r="1.2" fill="#E8D89A" />
            </g>
          ),
        )}

        {/* Center text */}
        <text
          x="0"
          y="-10"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="34"
          fill={P.ink}
        >
          Elif
        </text>
        <text
          x="0"
          y="10"
          textAnchor="middle"
          fontFamily="serif"
          fontStyle="italic"
          fontSize="11"
          fill={P.accent}
        >
          ve
        </text>
        <text
          x="0"
          y="38"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="34"
          fill={P.ink}
        >
          Can
        </text>
      </g>

      {/* Date */}
      <text
        x="150"
        y="350"
        textAnchor="middle"
        fontFamily="serif"
        fontStyle="italic"
        fontSize="12"
        fill={P.ink}
      >
        15 Haziran 2026
      </text>
      <text
        x="150"
        y="368"
        textAnchor="middle"
        fontSize="8"
        fill={P.inkSoft}
        letterSpacing="3"
      >
        CUNDA ADASI
      </text>
    </svg>
  );
}
