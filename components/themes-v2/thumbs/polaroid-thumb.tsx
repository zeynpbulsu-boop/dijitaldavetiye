export function PolaroidThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#EFE4D2" />

      {/* Back polaroids */}
      <g transform="translate(60 90) rotate(-10)">
        <rect width="80" height="110" fill="#FCF8EF" stroke="#3D2C1E22" />
        <rect x="6" y="6" width="68" height="68" fill="#A88660" />
      </g>
      <g transform="translate(170 100) rotate(8)">
        <rect width="80" height="110" fill="#FCF8EF" stroke="#3D2C1E22" />
        <rect x="6" y="6" width="68" height="68" fill="#8B5E40" />
      </g>

      {/* Front polaroid (couple name) */}
      <g transform="translate(95 170) rotate(-2)">
        <rect width="120" height="160" fill="#FCF8EF" stroke="#3D2C1E33" />
        <rect x="8" y="8" width="104" height="104" fill="#FCF8EF" stroke="#3D2C1E22" />
        <text
          x="60"
          y="34"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="6.5"
          fill="#B86E4E"
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
          fill="#3D2C1E"
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
          fill="#B86E4E"
        >
          &amp;
        </text>
        <text
          x="60"
          y="100"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="24"
          fill="#3D2C1E"
        >
          Can
        </text>
        <text
          x="60"
          y="142"
          textAnchor="middle"
          fontFamily="'Pinyon Script', cursive"
          fontSize="16"
          fill="#7A6149"
        >
          15 Haziran 2026
        </text>
      </g>
    </svg>
  );
}
