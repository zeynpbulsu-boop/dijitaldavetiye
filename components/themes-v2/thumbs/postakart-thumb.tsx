export function PostakartThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#E3D5B5" />

      {/* Postcard tilted */}
      <g transform="translate(20 80) rotate(-3 130 100)">
        <rect width="260" height="200" fill="#F5E8C9" stroke="#3A291830" />

        {/* Landscape */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8C998" />
            <stop offset="100%" stopColor="#B86E4E" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="240" height="135" fill="url(#sky)" />
        <circle cx="200" cy="55" r="18" fill="#F4D9A8" opacity="0.85" />
        <path d="M 10 110 L 50 90 L 90 105 L 140 80 L 180 100 L 220 88 L 250 100 L 250 145 L 10 145 Z" fill="#7A5235" opacity="0.8" />
        <path d="M 10 130 L 60 115 L 110 125 L 160 110 L 210 122 L 250 115 L 250 145 L 10 145 Z" fill="#4A2F1E" />

        {/* Greeting banner */}
        <text x="22" y="34" fontFamily="serif" fontStyle="italic" fontSize="11" fill="#3A291890">
          Greetings from
        </text>
        <text x="22" y="56" fontFamily="serif" fontSize="20" fill="#3A2918" letterSpacing="1.5">
          AYVALIK
        </text>

        {/* Bottom title block */}
        <rect x="22" y="160" width="216" height="34" fill="#F5E8C9" stroke="#3A291830" />
        <text x="130" y="171" textAnchor="middle" fontSize="6" fill="#A8463A" letterSpacing="3">
          SAVE THE DATE
        </text>
        <text x="130" y="186" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="16" fill="#3A2918">
          Elif <tspan fill="#A8463A" fontStyle="italic">&amp;</tspan> Can
        </text>
      </g>

      {/* Stamp */}
      <g transform="translate(220 320) rotate(-6)">
        <rect width="50" height="65" fill="#A8463A" stroke="#3A2918" strokeDasharray="2 2" />
        <text x="25" y="22" textAnchor="middle" fontSize="6" fill="#F5E8C9">NUVE</text>
        <text x="25" y="40" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="14" fill="#F5E8C9">
          E&amp;C
        </text>
        <text x="25" y="56" textAnchor="middle" fontSize="6" fill="#F5E8C9">2026</text>
      </g>

      {/* Postmark */}
      <g transform="translate(40 320) rotate(-12)">
        <circle cx="36" cy="36" r="32" fill="none" stroke="#3A2918" strokeWidth="1" opacity="0.55" />
        <circle cx="36" cy="36" r="26" fill="none" stroke="#3A2918" strokeWidth="1" opacity="0.55" />
        <text x="36" y="26" textAnchor="middle" fontSize="5" fill="#3A2918" letterSpacing="1">HAZİRAN</text>
        <text x="36" y="46" textAnchor="middle" fontFamily="serif" fontSize="18" fill="#3A2918">15</text>
        <text x="36" y="58" textAnchor="middle" fontSize="5" fill="#3A2918" letterSpacing="1">2026</text>
      </g>
    </svg>
  );
}
