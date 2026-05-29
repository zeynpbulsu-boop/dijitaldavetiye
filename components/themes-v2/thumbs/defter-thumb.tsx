export function DefterThumb() {
  return (
    <svg viewBox="0 0 300 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="400" fill="#E5DCC4" />
      {/* Linen pattern */}
      <g stroke="#2D2418" strokeWidth="0.3" opacity="0.2">
        {Array.from({ length: 50 }).map((_, i) => (
          <line key={i} x1={i * 6} y1="0" x2={i * 6 + 6} y2="400" />
        ))}
      </g>

      {/* Notebook */}
      <g transform="translate(20 50)">
        <rect width="260" height="300" fill="#F5EEDE" stroke="#2D241820" />
        {/* Spine */}
        <line x1="130" y1="0" x2="130" y2="300" stroke="#2D241840" strokeWidth="2" />
        {/* Bookmark ribbon */}
        <polygon
          points="220,0 248,0 248,72 234,62 220,72"
          fill="#8B6F3F"
        />

        {/* Ruled lines */}
        <g stroke="#2D2418" strokeWidth="0.3" opacity="0.15">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1="10" y1={20 + i * 16} x2="120" y2={20 + i * 16} />
          ))}
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={i} x1="140" y1={20 + i * 16} x2="250" y2={20 + i * 16} />
          ))}
        </g>

        {/* Left page */}
        <text x="65" y="50" textAnchor="middle" fontSize="6" fill="#8B6F3F" letterSpacing="3">
          DAVETİYEMİZ
        </text>
        <text x="65" y="80" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="9" fill="#665542">
          Hikâyemizin en güzel
        </text>
        <text x="65" y="94" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="9" fill="#665542">
          sayfasını paylaşmak
        </text>
        <text x="65" y="108" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="9" fill="#665542">
          için sizi bekleriz.
        </text>

        <text x="14" y="160" fontSize="6" fill="#8B6F3F" letterSpacing="2">TARİH</text>
        <text x="14" y="174" fontFamily="serif" fontSize="11" fill="#2D2418">15 Haziran 2026</text>
        <text x="14" y="200" fontSize="6" fill="#8B6F3F" letterSpacing="2">MEKÂN</text>
        <text x="14" y="214" fontFamily="serif" fontSize="11" fill="#2D2418">Cunda Adası</text>

        {/* Right page */}
        <text x="195" y="50" textAnchor="middle" fontSize="6" fill="#8B6F3F" letterSpacing="3">
          EVLENİYORUZ
        </text>
        <text x="195" y="135" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="32" fill="#2D2418">
          Elif
        </text>
        <text x="195" y="158" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="10" fill="#8B6F3F">
          ve
        </text>
        <text x="195" y="195" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="32" fill="#2D2418">
          Can
        </text>
        {/* botanical doodle */}
        <g transform="translate(195 230)" stroke="#8B6F3F" strokeWidth="0.8" fill="none">
          <path d="M 0 0 Q -10 -10 -20 -16" />
          <path d="M 0 0 Q 10 -10 20 -16" />
          <ellipse cx="-15" cy="-12" rx="4" ry="1.6" fill="#8B6F3F" fillOpacity="0.5" transform="rotate(-40 -15 -12)" />
          <ellipse cx="15" cy="-12" rx="4" ry="1.6" fill="#8B6F3F" fillOpacity="0.5" transform="rotate(40 15 -12)" />
        </g>
      </g>
    </svg>
  );
}
