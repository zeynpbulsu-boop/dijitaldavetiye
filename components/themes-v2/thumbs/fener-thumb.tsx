export function FenerThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="fener-glow" cx="50%" cy="60%">
          <stop offset="0%" stopColor="#E8B05D" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#1E1810" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1E1810" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <rect width="300" height="400" fill="#1E1810" />
      <rect width="300" height="400" fill="url(#fener-glow)" />

      {/* Tree left */}
      <g stroke="#E8B05D" strokeWidth="1" fill="none" opacity="0.7">
        <path d="M 30 380 Q 40 280 60 240" />
        <path d="M 50 280 Q 30 260 20 230" />
        <ellipse cx="40" cy="220" rx="30" ry="22" />
      </g>

      {/* House right */}
      <g stroke="#E8B05D" strokeWidth="1.2" fill="none" opacity="0.7">
        <path d="M 180 380 L 180 240 L 230 220 L 280 240 L 280 380" />
        <rect x="220" y="320" width="22" height="60" />
      </g>

      {/* String lights */}
      <path d="M 60 200 Q 150 290 270 220" stroke="#E8B05D" strokeWidth="0.5" fill="none" opacity="0.5" />
      {[
        [60, 200], [90, 222], [120, 250], [150, 270],
        [180, 270], [210, 256], [240, 240], [270, 220],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y as number + 12} r="14" fill="#E8B05D" opacity="0.25" />
          <circle cx={x} cy={y as number + 12} r="5" fill="#FFE7AC" />
        </g>
      ))}

      {/* Title */}
      <text
        x="150"
        y="60"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="9"
        fill="#E8B05D"
        letterSpacing="4"
      >
        SAVE THE DATE
      </text>
      <text
        x="150"
        y="120"
        textAnchor="middle"
        fontFamily="serif"
        fontWeight="300"
        fontSize="34"
        fill="#F5E8C9"
        letterSpacing="2"
      >
        Elif <tspan fill="#E8B05D" fontStyle="italic">&amp;</tspan> Can
      </text>
      <text
        x="150"
        y="150"
        textAnchor="middle"
        fontFamily="serif"
        fontStyle="italic"
        fontSize="11"
        fill="#E8B05D"
      >
        15 · haziran · 2026
      </text>
    </svg>
  );
}
