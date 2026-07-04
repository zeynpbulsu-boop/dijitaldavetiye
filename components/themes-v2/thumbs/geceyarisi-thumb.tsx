import { THEMES_V2 } from "@/lib/themes-v2/registry";

// Palet registry'den — thumb kopya hex'leri senkron riskiydi (P2-10);
// sahneye özgü renkler (gök, ışık) bilinçli hardcoded kalır.
const P = THEMES_V2.geceyarisi.palette;

export function GeceyarisiThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill={P.bg} />
      {/* Halo */}
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%">
          <stop offset="0%" stopColor={P.accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={P.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="200" r="160" fill="url(#halo)" />

      {/* Stars */}
      {Array.from({ length: 60 }).map((_, i) => {
        const cx = Math.random() * 300;
        const cy = Math.random() * 400;
        const r = 0.3 + Math.random() * 1.2;
        return <circle key={i} cx={cx} cy={cy} r={r} fill={P.accent} opacity="0.7" />;
      })}

      {/* Foliage corners */}
      <g stroke={P.accent} strokeWidth="0.7" fill="none" opacity="0.55">
        <path d="M 10 30 Q 30 50 50 80 T 90 130" />
        <ellipse cx="30" cy="50" rx="5" ry="2" fill={P.accent} fillOpacity="0.45" transform="rotate(-40 30 50)" />
        <ellipse cx="45" cy="70" rx="5" ry="2" fill={P.accent} fillOpacity="0.45" transform="rotate(-30 45 70)" />
        <ellipse cx="60" cy="92" rx="5" ry="2" fill={P.accent} fillOpacity="0.45" transform="rotate(-20 60 92)" />

        <path d="M 290 30 Q 270 50 250 80 T 210 130" />
        <ellipse cx="270" cy="50" rx="5" ry="2" fill={P.accent} fillOpacity="0.45" transform="rotate(40 270 50)" />
        <ellipse cx="255" cy="70" rx="5" ry="2" fill={P.accent} fillOpacity="0.45" transform="rotate(30 255 70)" />
        <ellipse cx="240" cy="92" rx="5" ry="2" fill={P.accent} fillOpacity="0.45" transform="rotate(20 240 92)" />

        <path d="M 10 370 Q 30 350 50 320 T 90 270" />
        <path d="M 290 370 Q 270 350 250 320 T 210 270" />
      </g>

      {/* Title */}
      <text
        x="150"
        y="180"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="8"
        fill={P.accent}
        letterSpacing="4"
      >
        SAVE THE DATE
      </text>
      <text
        x="150"
        y="222"
        textAnchor="middle"
        fontFamily="serif"
        fontWeight="300"
        fontSize="32"
        fill={P.ink}
        letterSpacing="2"
      >
        Elif <tspan fill={P.accent} fontStyle="italic">&amp;</tspan> Can
      </text>
      <line x1="120" y1="240" x2="180" y2="240" stroke={P.accent} strokeWidth="0.5" opacity="0.6" />
      <text
        x="150"
        y="262"
        textAnchor="middle"
        fontFamily="serif"
        fontStyle="italic"
        fontSize="12"
        fill={P.inkSoft}
      >
        15 · Haziran · 2026
      </text>
    </svg>
  );
}
