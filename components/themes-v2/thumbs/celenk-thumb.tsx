export function CelenkThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#F4EDE5" />
      {/* Watercolor washes */}
      <ellipse cx="60" cy="60" rx="80" ry="40" fill="#A8C4D6" opacity="0.18" />
      <ellipse cx="250" cy="350" rx="100" ry="50" fill="#7A8870" opacity="0.16" />

      {/* Wreath */}
      <g transform="translate(150 180)">
        <g stroke="#7A8870" strokeWidth="0.8" fill="none">
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
            <ellipse cx="0" cy="0" rx="6" ry="2.5" fill="#7A8870" fillOpacity="0.7" />
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
                  stroke="#3A2A1F"
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
          fill="#3A2A1F"
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
          fill="#7A8870"
        >
          ve
        </text>
        <text
          x="0"
          y="38"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="34"
          fill="#3A2A1F"
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
        fill="#3A2A1F"
      >
        15 Haziran 2026
      </text>
      <text
        x="150"
        y="368"
        textAnchor="middle"
        fontSize="8"
        fill="#6B5847"
        letterSpacing="3"
      >
        CUNDA ADASI
      </text>
    </svg>
  );
}
